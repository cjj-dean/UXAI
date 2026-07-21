import { type A2UIJson, type Fixer, getClassName, setClassName } from "../../types"

const ASIDE_DEFAULT_WIDTH = "w-[240px]"

function hasWidth(cls: string): boolean {
  return /\bw-\[/.test(cls) || /\bw-\d/.test(cls) || /\bmin-w-/.test(cls)
}

export const fixAsideWidth: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const el of json.elements) {
    if (el.component !== "aside") continue
    const cls = getClassName(el)
    if (hasWidth(cls)) continue
    setClassName(el, cls + " " + ASIDE_DEFAULT_WIDTH)
    fixes.push(`[aside_width] <aside> 缺少宽度，已补充 ${ASIDE_DEFAULT_WIDTH}: ${el.id}`)
  }

  return [json, fixes]
}

export default fixAsideWidth
