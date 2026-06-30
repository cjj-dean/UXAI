import { type Fixer, PADDING_RE, getClassName, removePadding, setClassName, elemMap } from "../../types"
import { SECTION_BUILTIN } from "./fix_elevation_nesting"

const STANDARD_GAP = "gap-[1rem]"
const MARGIN_RE = /\b(?:mb|mt|my)-\[[^\]]+\]|\b(?:mb|mt|my)-\S+/g

export const fixSectionStyles: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (elem.component !== "Section") continue
    let cls = getClassName(elem)
    const removed: string[] = []
    for (const token of SECTION_BUILTIN) {
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
      fixes.push(`[${elem.id}](Section) className 含内置 token ${removed}: 已移除`)
    }

    // If section is a flex column and we are about to (or already) control
    // child spacing via `gap`, strip `mb-*` from direct children to avoid
    // double spacing (gap + margin-bottom).
    const isFlexCol = /\bflex\b/.test(cls) && /\bflex-col\b/.test(cls)
    const hasGap = /gap-(?:\[[^\]]+\]|\S+)/.test(cls)
    let gapAdded = false
    if (!hasGap) {
      cls = `${cls} ${STANDARD_GAP}`.trim()
      gapAdded = true
      fixes.push(`[${elem.id}](Section) 缺少 gap: 补充 '${STANDARD_GAP}'`)
    }
    setClassName(elem, cls.replace(/\s+/g, " ").trim())

    // Strip mt-*/mb-*/my-* from direct children when this section is a flex column
    // (gap is now the single source of truth for inter-child spacing).
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
        fixes.push(`[${elem.id}](Section) flex-col + ${gapAdded ? "新补 gap " : "已有 gap "}→ 剥除子元素 mt/mb/my-*: ${stripped.join(", ")}`)
      }
    }
  }
  return [json, fixes]
}
