import { type Fixer, getClassName, setClassName, tokens } from "../../types"

const ROUNDED_RE = /^rounded(?:-(?:none|sm|md|lg|xl|2xl|3xl|full|\[.+\]))?$/
const IMG_RADIUS = "rounded-[8px]"

export const fixImageRadius: Fixer = (json) => {
  const fixes: string[] = []
  for (const elem of json.elements) {
    if (elem.component !== "img") continue
    const toks = tokens(getClassName(elem))
    const oldRounded = toks.filter((t) => ROUNDED_RE.test(t))
    if (oldRounded.length === 1 && oldRounded[0] === IMG_RADIUS) continue
    const kept = toks.filter((t) => !ROUNDED_RE.test(t))
    kept.push(IMG_RADIUS)
    setClassName(elem, kept.join(" "))
    fixes.push(`[${elem.id}](img) 图片圆角统一为 ${IMG_RADIUS}${oldRounded.length ? ` (原: ${oldRounded})` : " (原无圆角)"}`)
  }
  return [json, fixes]
}
