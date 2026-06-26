import { type Fixer, elemMap, getClassName, removePadding, setClassName, tokens } from "../../types"

export const fixRedundantPadding: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  for (const elem of json.elements) {
    if (elem.component !== "Section") continue
    if (!Array.isArray(elem.children)) continue
    for (const childId of elem.children) {
      if (typeof childId !== "string") continue
      const child = map[childId]
      if (!child) continue
      const cls = getClassName(child)
      if (!cls) continue
      const newCls = removePadding(cls)
      if (newCls !== cls) {
        const removed = new Set(tokens(cls)).difference(new Set(tokens(newCls)))
        setClassName(child, newCls)
        fixes.push(`[${childId}](${child.component}) 是 Section[${elem.id}] 直接子元素，移除冗余 padding: ${[...removed].sort()}`)
      }
    }
  }
  return [json, fixes]
}
