import { type Fixer, elemMap, getClassName, setClassName } from "../../types"
import { PADDING_RE } from "../../types"

const HORIZONTAL_PADDING_RE = /\bp(?:x|l|r)?-(?:\[[^\]]+\]|\S+)/g

export const fixTabContentDuplication: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  const tabContentIds = new Set<string>()
  for (const elem of json.elements) {
    if (elem.component !== "TabItem") continue
    const content = elem.props?.content
    if (content && typeof content === "object" && typeof content.componentId === "string") {
      tabContentIds.add(content.componentId)
    }
  }
  if (!tabContentIds.size) return [json, []]

  function successors(eid: string): string[] {
    const e = map[eid]
    if (!e) return []
    const succ: string[] = []
    const children = e.children
    if (!Array.isArray(children)) return []
    for (const c of children) {
      if (typeof c !== "string") continue
      succ.push(c)
      const ce = map[c]
      if (ce && ce.component === "TabItem") {
        const ct = ce.props?.content
        if (ct && typeof ct === "object" && typeof ct.componentId === "string") {
          succ.push(ct.componentId)
        }
      }
    }
    return succ
  }

  function reach(start: string): Set<string> {
    const seen = new Set<string>()
    const stack = [start]
    while (stack.length) {
      const cur = stack.pop()!
      for (const s of successors(cur)) {
        if (!seen.has(s)) {
          seen.add(s)
          stack.push(s)
        }
      }
    }
    return seen
  }

  for (const elem of json.elements) {
    if (!Array.isArray(elem.children) || !elem.children.length) continue
    const removed = elem.children.filter((cid: any) => typeof cid === "string" && tabContentIds.has(cid))
    if (!removed.length) continue
    elem.children = elem.children.filter((cid: any) => !(typeof cid === "string" && tabContentIds.has(cid)))
    fixes.push(`[${elem.id}](${elem.component}) children 中含 tab content 引用 ${removed}: 已移除（防止重复渲染）`)
  }

  const tabOwned = new Set<string>()
  for (const t of tabContentIds) for (const id of reach(t)) tabOwned.add(id)

  const childParents: Record<string, string[]> = {}
  for (const elem of json.elements) {
    if (!Array.isArray(elem.children)) continue
    for (const c of elem.children) {
      if (typeof c === "string") (childParents[c] ??= []).push(elem.id)
    }
  }

  for (const [cid, parents] of Object.entries(childParents)) {
    if (!tabOwned.has(cid)) continue
    const uniq = [...new Set(parents)]
    if (uniq.length < 2) continue

    const reaches: Record<string, Set<string>> = {}
    for (const p of uniq) reaches[p] = reach(p)
    const toRemove: string[] = []
    for (const p of uniq) {
      for (const q of uniq) {
        if (p === q) continue
        if (reaches[p].has(q) && !reaches[q].has(p)) {
          toRemove.push(p)
          break
        }
      }
    }
    if (toRemove.length === uniq.length) continue

    for (const p of toRemove) {
      const pe = map[p]
      if (!pe) continue
      const ch = Array.isArray(pe.children) ? pe.children : []
      if (!ch.includes(cid)) continue
      pe.children = ch.filter((x: any) => x !== cid)
      fixes.push(`[${p}](${pe.component}) 重复引用 tab content 子树元素 [${cid}]: 已移除（归属更内层 tab 面板）`)
    }
  }

  for (const elem of json.elements) {
    if (!tabContentIds.has(elem.id)) continue
    const cls = getClassName(elem)
    const paddingMatches = cls.match(PADDING_RE)
    if (paddingMatches) {
      setClassName(elem, cls.replace(PADDING_RE, "").replace(/\s+/g, " ").trim())
      fixes.push(`[${elem.id}] tab content 含 padding ${paddingMatches}: 已移除（防止嵌套 Tab 缩进不一致）`)
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
        fixes.push(`[${child.id}] tab content 直接子元素含水平 padding ${hMatches}: 已移除（保证与 tab 条左对齐）`)
      }
    }
  }
  return [json, fixes]
}
