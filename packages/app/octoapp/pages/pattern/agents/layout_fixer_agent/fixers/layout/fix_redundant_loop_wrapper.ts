import { type Fixer, elemMap, getClassName, tokens } from "../../types"

const GRID_OR_FLEX_RE = /\b(grid-cols-|grid-rows-|flex\b|flex-row|flex-col)/

export const fixRedundantLoopWrapper: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const idsToRemove = new Set<string>()

  for (const elem of json.elements) {
    if (idsToRemove.has(elem.id)) continue
    if (!Array.isArray(elem.children) || elem.children.length !== 1) continue

    const cls = getClassName(elem)
    if (!GRID_OR_FLEX_RE.test(cls)) continue

    const childId = elem.children[0]
    if (typeof childId !== "string") continue
    const child = map[childId]
    if (!child || child.component !== "div") continue

    const childCls = tokens(getClassName(child)).filter((t) => t !== "")
    if (childCls.length > 0) continue

    const childChildren = child.children
    const hasTemplateChildren = childChildren && typeof childChildren === "object" && !Array.isArray(childChildren) && "path" in childChildren && "componentId" in childChildren
    if (!hasTemplateChildren && !Array.isArray(childChildren)) continue

    elem.children = Array.isArray(childChildren) ? childChildren : [childChildren]
    idsToRemove.add(childId)
    fixes.push(`[${childId}](div) 移除冗余循环包裹层，TemplateChildren 直接作为 [${elem.id}] 的子元素`)
  }

  if (idsToRemove.size) {
    json.elements = json.elements.filter((e) => !idsToRemove.has(e.id))
  }
  return [json, fixes]
}
