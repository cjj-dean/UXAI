import { type A2UIElement, type Fixer, childToParent, elemMap, getClassName, removePadding, setClassName } from "../../types"

const SECTION_BUILTIN = ["bg-surface-container-highest", "shadow-sm", "rounded-xl"]
const ELEVATION_MARKERS = ["bg-surface-container-highest", "bg-surface-bright"]

function isSection(elem: A2UIElement): boolean {
  return elem.component === "Section"
}
function hasElevationBg(elem: A2UIElement): boolean {
  const cls = getClassName(elem)
  return ELEVATION_MARKERS.some((m) => cls.includes(m))
}
function isElevated(elem: A2UIElement): boolean {
  return isSection(elem) || hasElevationBg(elem)
}

function downgradeToDiv(elem: A2UIElement, reason: string): string {
  const elemId = elem.id ?? "?"
  if (isSection(elem)) elem.component = "div"
  let cls = getClassName(elem)
  for (const token of [...SECTION_BUILTIN, ...ELEVATION_MARKERS]) {
    cls = cls.split(token).join("")
  }
  cls = removePadding(cls)
  setClassName(elem, cls)
  return `[${elemId}] ${reason}: 降级为透明 div`
}

export const fixElevationNesting: Fixer = (json) => {
  const elements = json.elements
  if (!elements.length) return [json, []]
  const map = elemMap(elements)
  const c2p = childToParent(elements)
  const fixes: string[] = []

  const parentDowngraded = new Set<string>()
  for (const elem of elements) {
    if (!isElevated(elem) || !Array.isArray(elem.children)) continue
    const sectionChildren = elem.children.filter((c: any) => typeof c === "string" && map[c] && isSection(map[c]))
    if (sectionChildren.length > 1) {
      fixes.push(downgradeToDiv(elem, `包含 ${sectionChildren.length} 个 Section 子元素，为包裹容器层`))
      parentDowngraded.add(elem.id)
    }
  }

  for (const elem of elements) {
    if (!isElevated(elem)) continue
    let ancestorId = c2p[elem.id]
    while (ancestorId) {
      const ancestor = map[ancestorId]
      if (ancestor && !parentDowngraded.has(ancestorId) && isElevated(ancestor)) {
        const reason = isSection(ancestor)
          ? `嵌套在 Section[${ancestor.id}] 内`
          : `嵌套在 elevated div[${ancestor.id}] 内`
        fixes.push(downgradeToDiv(elem, reason))
        break
      }
      ancestorId = c2p[ancestorId]
    }
  }
  return [json, fixes]
}

export { SECTION_BUILTIN, ELEVATION_MARKERS }
