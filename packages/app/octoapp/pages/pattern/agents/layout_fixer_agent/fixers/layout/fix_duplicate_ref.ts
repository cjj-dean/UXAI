import { type A2UIElement, type A2UIJson, type Fixer, elemMap, getClassName, setClassName, PADDING_RE } from "../../types"

const HORIZONTAL_PADDING_RE = /\bp(?:x|l|r)?-(?:\[[^\]]+\]|\S+)/g

function scanComponentIds(obj: any, refs: Set<string>) {
  if (Array.isArray(obj)) { for (const i of obj) scanComponentIds(i, refs) }
  else if (obj && typeof obj === "object") {
    if (typeof obj.componentId === "string") refs.add(obj.componentId)
    for (const v of Object.values(obj)) scanComponentIds(v, refs)
  }
}

function allRefs(elem: A2UIElement): Set<string> {
  const refs = new Set<string>()
  const children = elem.children
  if (Array.isArray(children)) {
    for (const c of children) {
      if (typeof c === "string") refs.add(c)
      else if (c && typeof c === "object") scanComponentIds(c, refs)
    }
  } else if (children && typeof children === "object") {
    scanComponentIds(children, refs)
  }
  if (elem.props) scanComponentIds(elem.props, refs)
  return refs
}

function computeDepths(rootId: string, map: Record<string, A2UIElement>): Record<string, number> {
  const depths: Record<string, number> = {}
  const queue: [string, number][] = [[rootId, 0]]
  while (queue.length) {
    const [id, depth] = queue.shift()!
    if (id in depths) continue
    depths[id] = depth
    const elem = map[id]
    if (!elem) continue
    for (const ref of allRefs(elem)) {
      if (!(ref in depths)) queue.push([ref, depth + 1])
    }
  }
  return depths
}

function successors(eid: string, map: Record<string, A2UIElement>): string[] {
  const e = map[eid]
  if (!e) return []
  const succ: string[] = []
  const children = e.children
  if (Array.isArray(children)) {
    for (const c of children) {
      if (typeof c !== "string") continue
      succ.push(c)
      const ce = map[c]
      if (ce?.component === "TabItem") {
        const ct = ce.props?.content
        if (ct && typeof ct === "object" && typeof ct.componentId === "string") succ.push(ct.componentId)
      }
    }
  } else if (children && typeof children === "object" && typeof children.componentId === "string") {
    succ.push(children.componentId)
  }
  return succ
}

function reach(start: string, map: Record<string, A2UIElement>): Set<string> {
  const seen = new Set<string>()
  const stack = [start]
  while (stack.length) {
    const cur = stack.pop()!
    for (const s of successors(cur, map)) {
      if (!seen.has(s)) { seen.add(s); stack.push(s) }
    }
  }
  return seen
}

export const fixDuplicateRef: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const elements = json.elements
  const rootId = json.rootId ?? ""
  const fixes: string[] = []
  if (!rootId || !elements.length) return [json, fixes]

  const map = elemMap(elements)
  if (!map[rootId]) return [json, fixes]

  const tabContentIds = new Set<string>()
  for (const elem of elements) {
    if (elem.component !== "TabItem") continue
    const content = elem.props?.content
    if (content && typeof content === "object" && typeof content.componentId === "string") {
      tabContentIds.add(content.componentId)
    }
  }

  for (const elem of elements) {
    if (!Array.isArray(elem.children) || !elem.children.length) continue
    const removed = elem.children.filter((cid: any) => typeof cid === "string" && tabContentIds.has(cid))
    if (!removed.length) continue
    elem.children = elem.children.filter((cid: any) => !(typeof cid === "string" && tabContentIds.has(cid)))
    fixes.push(`[${elem.id}](${elem.component}) children 含 tab content ${removed}: 已移除（防止重复渲染）`)
  }

  const childParents: Record<string, string[]> = {}
  for (const elem of elements) {
    if (!Array.isArray(elem.children)) continue
    for (const c of elem.children) {
      if (typeof c === "string") (childParents[c] ??= []).push(elem.id)
    }
  }

  const depths = computeDepths(rootId, map)
  const reachCache: Record<string, Set<string>> = {}
  const reachFrom = (id: string) => (reachCache[id] ??= reach(id, map))

  for (const [cid, parents] of Object.entries(childParents)) {
    const uniq = [...new Set(parents)]
    if (uniq.length < 2) continue

    const toRemove = new Set<string>()

    for (const p of uniq) {
      for (const q of uniq) {
        if (p === q) continue
        if (reachFrom(p).has(q) && !reachFrom(q).has(p)) { toRemove.add(p); break }
      }
    }

    if (toRemove.size === 0) {
      const sorted = [...uniq].sort((a, b) => (depths[a] ?? 999) - (depths[b] ?? 999))
      for (const p of sorted.slice(1)) toRemove.add(p)
    }

    if (toRemove.size === uniq.length) continue

    for (const p of toRemove) {
      const pe = map[p]
      if (!pe || !Array.isArray(pe.children)) continue
      pe.children = pe.children.filter((x: any) => x !== cid)
      const keep = uniq.find((x) => !toRemove.has(x)) ?? "?"
      const reason = reachFrom(p).has(keep) ? "祖先节点让位" : "更深节点让位"
      fixes.push(`[${cid}](${map[cid]?.component ?? "?"}) 多父节点引用: 从 [${p}](${pe.component}) 移除（保留 [${keep}]，${reason}）`)
    }
  }

  for (const elem of elements) {
    if (!tabContentIds.has(elem.id)) continue
    const cls = getClassName(elem)
    const paddingMatches = cls.match(PADDING_RE)
    if (paddingMatches) {
      setClassName(elem, cls.replace(PADDING_RE, "").replace(/\s+/g, " ").trim())
      fixes.push(`[${elem.id}] tab content 含 padding ${paddingMatches}: 已移除（防止嵌套缩进不一致）`)
    }
    if (Array.isArray(elem.children)) {
      for (const childId of elem.children) {
        if (typeof childId !== "string") continue
        const child = map[childId]
        if (!child) continue
        const ccls = getClassName(child)
        const hMatches = ccls.match(HORIZONTAL_PADDING_RE)
        if (!hMatches) continue
        setClassName(child, ccls.replace(HORIZONTAL_PADDING_RE, "").replace(/\s+/g, " ").trim())
        fixes.push(`[${child.id}] tab content 子元素含水平 padding ${hMatches}: 已移除（保证与 tab 条左对齐）`)
      }
    }
  }

  return [json, fixes]
}
