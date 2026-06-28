import { type A2UIElement, type A2UIJson, type Fixer, elemMap, getClassName } from "../../types"

function scanNested(obj: any, refs: Set<string>) {
  if (Array.isArray(obj)) {
    for (const item of obj) scanNested(item, refs)
  } else if (obj && typeof obj === "object") {
    if (typeof obj.componentId === "string") refs.add(obj.componentId)
    for (const [k, v] of Object.entries(obj)) {
      if (k === "componentId") continue
      scanNested(v, refs)
    }
  }
}

function referencedIds(elem: A2UIElement): Set<string> {
  const refs = new Set<string>()
  const children = elem.children
  if (Array.isArray(children)) {
    for (const c of children) {
      if (typeof c === "string") refs.add(c)
      else if (c && typeof c === "object") scanNested(c, refs)
    }
  } else if (children && typeof children === "object") {
    scanNested(children, refs)
  }
  if (elem.props) scanNested(elem.props, refs)
  return refs
}

function collectSubtree(map: Record<string, A2UIElement>, startId: string): Set<string> {
  const reachable = new Set<string>()
  const stack = [startId]
  while (stack.length) {
    const cur = stack.pop()!
    if (reachable.has(cur)) continue
    reachable.add(cur)
    const elem = map[cur]
    if (!elem) continue
    for (const ref of referencedIds(elem)) {
      if (!reachable.has(ref)) stack.push(ref)
    }
  }
  return reachable
}

export const fixOrphanElements: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const elements = json.elements
  const rootId = json.rootId ?? ""
  const fixes: string[] = []
  if (!rootId || !elements.length) return [json, fixes]

  const map = elemMap(elements)
  const root = map[rootId]
  if (!root) return [json, fixes]

  const reachable = collectSubtree(map, rootId)
  const nowReachable = new Set(reachable)
  const leading: string[] = []
  const trailing: string[] = []
  const emptyOrphanIds = new Set<string>()

  for (const elem of elements) {
    if (elem.id === rootId || nowReachable.has(elem.id)) continue
    const hasChildren = Array.isArray(elem.children) ? elem.children.length > 0 : !!elem.children
    const props = elem.props
    const propKeys = props ? Object.keys(props).filter((k) => k !== "className") : []
    if (!hasChildren && propKeys.length === 0) {
      emptyOrphanIds.add(elem.id)
      fixes.push(`[${elem.id}](${elem.component ?? "?"}) 空孤儿元素: 已删除`)
      continue
    }
    const comp = elem.component ?? ""
    const isHeaderLike = comp === "header" || elem.id.toLowerCase().includes("header")
    ;(isHeaderLike ? leading : trailing).push(elem.id)
    for (const id of collectSubtree(map, elem.id)) nowReachable.add(id)
  }

  if (emptyOrphanIds.size) {
    json.elements = elements.filter((e) => !emptyOrphanIds.has(e.id))
  }

  if (!leading.length && !trailing.length) return [json, fixes]

  const existing: string[] = Array.isArray(root.children) ? root.children.filter((c: any) => typeof c === "string") : []
  const existingSet = new Set(existing)

  const prepended: string[] = []
  for (const oid of leading) {
    if (existingSet.has(oid)) continue
    prepended.push(oid)
    existingSet.add(oid)
    fixes.push(`[${oid}](${map[oid]?.component ?? "?"}) 孤儿元素不可达: 前置挂回 root[${rootId}].children`)
  }
  const appended: string[] = []
  for (const oid of trailing) {
    if (existingSet.has(oid)) continue
    appended.push(oid)
    existingSet.add(oid)
    fixes.push(`[${oid}](${map[oid]?.component ?? "?"}) 孤儿元素不可达: 追加挂回 root[${rootId}].children`)
  }

  root.children = [...prepended, ...existing, ...appended]
  return [json, fixes]
}
