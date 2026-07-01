import { type Fixer, getClassName, setClassName, tokens } from "../../types"

export const fixHiddenClass: Fixer = (json) => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    const cls = getClassName(elem)
    if (!cls) continue
    const toks = tokens(cls)
    if (!toks.includes("hidden")) continue

    setClassName(elem, toks.filter((t) => t !== "hidden").join(" "))
    fixes.push(`[${elem.id}](${elem.component}) 移除 hidden 类（弹窗/元素显隐不由 CSS hidden 控制）`)
  }

  return [json, fixes]
}
