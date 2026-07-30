import { type A2UIJson, type Fixer, getClassName, setClassName } from "../../types"

export const fixAsideWidth: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const el of json.elements) {
    if (el.component !== "aside") continue
    const cls = getClassName(el)
    setClassName(el, cls + " w-full")
    fixes.push(`[aside_width] 移动端aside改为全宽: ${el.id}`)
  }

  return [json, fixes]
}

export default fixAsideWidth
