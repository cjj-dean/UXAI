import { type Fixer, PADDING_RE, getClassName, removePadding, setClassName } from "../../types"
import { SECTION_BUILTIN } from "./fix_elevation_nesting"

const STANDARD_GAP = "gap-[1rem]"

export const fixSectionStyles: Fixer = (json) => {
  const fixes: string[] = []
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
    if (!cls.match(/gap-(?:\[[^\]]+\]|\S+)/)) {
      cls = `${cls} ${STANDARD_GAP}`.trim()
      fixes.push(`[${elem.id}](Section) 缺少 gap: 补充 '${STANDARD_GAP}'`)
    }
    setClassName(elem, cls.replace(/\s+/g, " ").trim())
  }
  return [json, fixes]
}
