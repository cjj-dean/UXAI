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

    const [left, middle, right] = childElems
    const middleToks = tokens(getClassName(middle))

    if (!hasFixedWidth(middle) || hasFlex1(middleToks)) continue

    const leftCls = getClassName(left)
    const leftToks = tokens(leftCls)
    const rightCls = getClassName(right)
    const rightToks = tokens(rightCls)

    if (hasFlex1(leftToks) && hasFlex1(rightToks)) continue

    const changes: string[] = []
    if (!hasFlex1(leftToks)) {
      setClassName(left, `${leftCls} flex-1`.trim())
      changes.push(`左栏[${left.id}] 补充 flex-1`)
    }
    if (!hasFlex1(rightToks)) {
      const rightClsNew = rightToks.includes("justify-end") ? `${rightCls} flex-1` : `${rightCls} flex-1 justify-end`
      setClassName(right, rightClsNew.trim())
      changes.push(`右栏[${right.id}] 补充 flex-1 justify-end`)
    }
    if (changes.length) {
      fixes.push(`[${elem.id}](${elem.component}) 三栏居中布局: ${changes.join(", ")}`)
    }
  }

  return [json, fixes]
}
