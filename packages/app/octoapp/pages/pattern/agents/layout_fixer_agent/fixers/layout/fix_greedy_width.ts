import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const GREEDY_COMPONENTS = new Set(["Select", "Input", "InputNumber", "DatePicker", "Cascader", "TimePicker", "TimeSelect"])
const WIDTH_TOKEN_PREFIXES = ["w-", "max-w-"]
const WIDTH_TOKEN_VALUES = new Set(["flex-1", "flex-grow", "grow"])

function hasExplicitWidth(className: string): boolean {
  for (const tok of tokens(className)) {
    if (WIDTH_TOKEN_PREFIXES.some((p) => tok.startsWith(p))) return true
    if (WIDTH_TOKEN_VALUES.has(tok)) return true
  }
  return false
}

export const fixGreedyWidth: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    const cls = getClassName(elem)
    const toks = tokens(cls)
    if (!toks.includes("flex") && !toks.includes("inline-flex")) continue
    if (toks.includes("flex-col")) continue
    if (!Array.isArray(elem.children)) continue

    for (const childId of elem.children) {
      if (typeof childId !== "string") continue
      const child = map[childId]
      if (!child) continue
      if (!GREEDY_COMPONENTS.has(child.component)) continue
      const childCls = getClassName(child)
      if (hasExplicitWidth(childCls)) continue
      setClassName(child, `${childCls} shrink-0 w-auto`.trim())
      fixes.push(`[${childId}](${child.component}) 在 flex-row 中无显式宽度，注入 shrink-0 w-auto`)
    }
  }
  return [json, fixes]
}
