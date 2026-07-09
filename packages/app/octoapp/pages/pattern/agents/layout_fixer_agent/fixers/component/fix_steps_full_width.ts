import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const FULL_WIDTH_COMPONENTS = new Set(["Steps"])

export const fixStepsFullWidth: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (!Array.isArray(elem.children) || elem.children.length !== 1) continue
    const childId = elem.children[0]
    if (typeof childId !== "string") continue
    const child = map[childId]
    if (!child || !FULL_WIDTH_COMPONENTS.has(child.component)) continue

    const childCls = getClassName(child)
    const toks = tokens(childCls)
    if (toks.some((t) => t === "w-full")) continue

    setClassName(child, `${childCls} w-full`.trim())
    fixes.push(`[${childId}](${child.component}) 父容器仅含此组件，补充 w-full 使其占满父容器宽度`)
  }

  return [json, fixes]
}
