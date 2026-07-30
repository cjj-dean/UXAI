import { type Fixer, getClassName, setClassName, tokens } from "../../types"

export const fixFlexMinHeight: Fixer = (json) => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    if (elem.id === "body") continue
    const toks = tokens(getClassName(elem))
    if (!toks.includes("min-h-0")) continue

    const newToks = toks.filter((t) => t !== "min-h-0")
    setClassName(elem, newToks.join(" "))
    fixes.push(`[${elem.id}](${elem.component}) 移除 min-h-0`)
  }
  return [json, fixes]
}
