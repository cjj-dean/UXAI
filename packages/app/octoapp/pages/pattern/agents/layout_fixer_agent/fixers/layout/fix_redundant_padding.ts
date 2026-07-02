import { type Fixer, elemMap, getClassName, removePadding, setClassName, tokens } from "../../types"

const CARD_LIKE = new Set(["Section", "Card", "Dialog", "Drawer"])
const BUILTIN_PAD = new Set(["Dialog", "Drawer"])

export const fixRedundantPadding: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  for (const elem of json.elements) {
    if (BUILTIN_PAD.has(elem.component)) {
      const cls = getClassName(elem)
      if (!cls) continue
      const newCls = removePadding(cls)
      if (newCls !== cls) {
        const removed = new Set(tokens(cls)).difference(new Set(tokens(newCls)))
        setClassName(elem, newCls)
        fixes.push(`[${elem.id}](${elem.component}) 自带内置 padding，移除 className 中的冗余 padding: ${[...removed].sort()}`)
      }
    }
    if (!CARD_LIKE.has(elem.component)) continue
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
        fixes.push(`[${childId}](${child.component}) 是 ${elem.component}[${elem.id}] 直接子元素，移除冗余 padding: ${[...removed].sort()}`)
      }
    }
  }
  return [json, fixes]
}
