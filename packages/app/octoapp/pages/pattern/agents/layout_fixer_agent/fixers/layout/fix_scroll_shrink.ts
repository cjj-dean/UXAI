import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const SCROLL_OVERFLOW = new Set(["overflow-y-auto", "overflow-auto", "overflow-y-scroll"])
const GROW_TOKENS = new Set(["flex-1", "flex-grow", "grow"])
const SHRINK_TOKENS = new Set(["shrink-0", "flex-shrink-0"])

function hasFlexGrow(toks: string[]): boolean {
  return toks.some((t) => GROW_TOKENS.has(t) || t.startsWith("flex-["))
}

export const fixScrollShrink: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const container of json.elements) {
    const toks = tokens(getClassName(container))
    if (!toks.includes("flex") || !toks.includes("flex-col")) continue
    if (!toks.some((t) => SCROLL_OVERFLOW.has(t))) continue
    if (!Array.isArray(container.children)) continue

    for (const cid of container.children) {
      if (typeof cid !== "string") continue
      const child = map[cid]
      if (!child) continue
      const ctokens = tokens(getClassName(child))
      if (hasFlexGrow(ctokens)) continue
      if (ctokens.some((t) => SHRINK_TOKENS.has(t))) continue
      setClassName(child, `${ctokens.join(" ")} shrink-0`.trim())
      fixes.push(`[${cid}](${child.component}) 滚动列[${container.id}]子项缺少 shrink-0: 已补充`)
    }
  }
  return [json, fixes]
}
