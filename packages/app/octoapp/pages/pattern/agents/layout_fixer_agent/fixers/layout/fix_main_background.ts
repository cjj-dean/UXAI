import { type Fixer, getClassName, setClassName, tokens } from "../../types"

const BG_RE = /^bg-/

export const fixMainBackground: Fixer = (json) => {
  const fixes: string[] = []
  for (const elem of json.elements) {
    if (elem.component !== "main") continue
    const toks = tokens(getClassName(elem))
    const bgTokens = toks.filter((t) => BG_RE.test(t))
    if (!bgTokens.length) continue
    setClassName(elem, toks.filter((t) => !BG_RE.test(t)).join(" "))
    fixes.push(`[${elem.id}](${elem.component}) 移除 main 背景色: ${bgTokens}`)
  }
  return [json, fixes]
}
