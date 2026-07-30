import { type A2UIElement, type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

function hasFixedWidth(elem: A2UIElement): boolean {
  const cls = getClassName(elem)
  return /\bw-\[\d/.test(cls) || /\bw-\d/.test(cls)
}

function hasFlex1(toks: string[]): boolean {
  return toks.includes("flex-1")
}

export const fixThreeColCenter: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (!Array.isArray(elem.children) || elem.children.length !== 3) continue
    const cls = getClassName(elem)
    const toks = tokens(cls)
    if (!toks.includes("flex") || !toks.includes("flex-row")) continue

    const childElems = elem.children
      .filter((c: any) => typeof c === "string" && map[c])
      .map((c: string) => map[c])
    if (childElems.length !== 3) continue

    setClassName(elem, cls.replace(/flex-row/, "flex-col"))
    for (const child of childElems) {
      const childCls = getClassName(child)
      const childToks = tokens(childCls)
      if (!childToks.includes("w-full")) {
        setClassName(child, `${childCls} w-full`.trim())
      }
    }
    fixes.push(`[${elem.id}](${elem.component}) 三栏布局移动端降级为垂直堆叠`)
  }

  return [json, fixes]
}
