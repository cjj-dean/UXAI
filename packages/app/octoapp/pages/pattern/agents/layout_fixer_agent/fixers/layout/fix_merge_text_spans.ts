import { type Fixer, elemMap, getClassName, setClassName } from "../../types"
import { PADDING_RE } from "../../types"

export const fixMergeTextSpans: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const idsToRemove = new Set<string>()

  for (const elem of json.elements) {
    if (idsToRemove.has(elem.id)) continue
    if (!Array.isArray(elem.children) || elem.children.length < 2) continue

    const childElems = elem.children.filter((c: any) => typeof c === "string" && map[c]).map((c: string) => map[c])
    if (childElems.length !== elem.children.length) continue

    if (!childElems.every((c) => c.component === "span" && !getClassName(c).trim() && c.props && "value" in c.props)) continue

    const hasDynamic = childElems.some((c) => {
      const v = c.props!.value
      return v && typeof v === "object" && "path" in v
    })

    if (!hasDynamic) {
      const merged = childElems.map((c) => String(c.props!.value ?? "")).join("")
      if (!elem.props) elem.props = {}
      elem.props.value = merged
      fixes.push(`[${elem.id}](${elem.component}) 合并 ${elem.children.length} 个静态 span → 纯文本 value`)
      for (const cid of elem.children) {
        if (typeof cid === "string") idsToRemove.add(cid)
      }
      elem.children = []
    }
  }

  if (idsToRemove.size) {
    json.elements = json.elements.filter((e) => !idsToRemove.has(e.id))
  }
  return [json, fixes]
}
