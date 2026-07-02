import { type Fixer, PADDING_RE, getClassName, removePadding, setClassName, elemMap } from "../../types"
import { SECTION_BUILTIN, CARD_BUILTIN } from "./fix_elevation_nesting"

const STANDARD_GAP = "gap-[1rem]"
const MARGIN_RE = /\b(?:mb|mt|my)-\[[^\]]+\]|\b(?:mb|mt|my)-\S+/g
const CARD_LIKE = new Set(["Section", "Card"])

export const fixSectionStyles: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (!CARD_LIKE.has(elem.component)) continue
    const builtin = elem.component === "Card" ? CARD_BUILTIN : SECTION_BUILTIN
    const label = elem.component
    let cls = getClassName(elem)
    const removed: string[] = []
    for (const token of builtin) {
      if (cls.includes(token)) {
        cls = cls.split(token).join("")
        removed.push(token)
      }
    }
    const paddingMatches = cls.match(PADDING_RE)
    if (paddingMatches) {
      cls = removePadding(cls)
      removed.push(...paddingMatches)
    }
    if (removed.length) {
      fixes.push(`[${elem.id}](${label}) className 含内置 token ${removed}: 已移除`)
    }

    const isFlexCol = /\bflex\b/.test(cls) && /\bflex-col\b/.test(cls)
    const hasGap = /gap-(?:\[[^\]]+\]|\S+)/.test(cls)
    let gapAdded = false
    if (!hasGap) {
      cls = `${cls} ${STANDARD_GAP}`.trim()
      gapAdded = true
      fixes.push(`[${elem.id}](${label}) 缺少 gap: 补充 '${STANDARD_GAP}'`)
    }
    setClassName(elem, cls.replace(/\s+/g, " ").trim())

    if (isFlexCol && Array.isArray(elem.children)) {
      const stripped: string[] = []
      for (const cid of elem.children) {
        if (typeof cid !== "string") continue
        const child = map[cid]
        if (!child) continue
        const ccls = getClassName(child)
        if (!ccls) continue
        const m = ccls.match(MARGIN_RE)
        if (!m) continue
        const cleaned = ccls.replace(MARGIN_RE, "").replace(/\s+/g, " ").trim()
        setClassName(child, cleaned)
        stripped.push(`${cid} (${m.join(",")})`)
      }
      if (stripped.length) {
        fixes.push(`[${elem.id}](${label}) flex-col + ${gapAdded ? "新补 gap " : "已有 gap "}→ 剥除子元素 mt/mb/my-*: ${stripped.join(", ")}`)
      }
    }
  }
  return [json, fixes]
}
