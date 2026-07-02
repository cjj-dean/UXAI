import { type A2UIElement, type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const BG_RE = /bg-(?!surface-container-lowest\b|surface-container-low\b|surface-default\b|transparent\b|divider\b)\S+/

function hasBg(cls: string): boolean {
  return BG_RE.test(cls)
}

function hasPadding(toks: string[]): boolean {
  return toks.some((t) => /^p[xytblr]?(?:\[|-)/.test(t) || /^p-/.test(t))
}

function isDivider(cls: string): boolean {
  const toks = tokens(cls)
  return toks.some((t) => /^w-\[?px/.test(t)) || toks.some((t) => /^h-\[?px/.test(t))
}

function isFullWidthOrHeight(cls: string): boolean {
  const toks = tokens(cls)
  return toks.some((t) => /^w-(?:full|screen|\[?100%)/.test(t)) || toks.some((t) => /^h-(?:full|screen|\[?100%)/.test(t))
}

function estimateContentArea(elem: A2UIElement, map: Record<string, A2UIElement>): number {
  if (!Array.isArray(elem.children)) return 0
  let count = 0
  for (const cid of elem.children) {
    if (typeof cid !== "string") continue
    const child = map[cid]
    if (!child) continue
    count += estimateNodeWeight(child, map)
  }
  return count
}

function estimateNodeWeight(elem: A2UIElement, map: Record<string, A2UIElement>): number {
  const LEAF = new Set(["span", "Icon", "Tag", "Badge", "img", "Input", "Select", "Button", "Switch", "Progress", "Rate", "Avatar"])
  if (LEAF.has(elem.component)) return 1
  if (elem.component === "div" || elem.component === "Section" || elem.component === "Card") {
    if (!Array.isArray(elem.children)) return 1
    let w = 0
    for (const cid of elem.children) {
      if (typeof cid !== "string") continue
      const child = map[cid]
      if (child) w += estimateNodeWeight(child, map)
    }
    return w
  }
  if (elem.component === "Menu" || elem.component === "Tabs" || elem.component === "Collapse") return 3
  return 2
}

export const fixBgPadding: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (elem.component !== "div") continue
    const cls = getClassName(elem)
    if (!hasBg(cls)) continue
    if (isDivider(cls)) continue
    if (isFullWidthOrHeight(cls)) continue
    const toks = tokens(cls)
    if (hasPadding(toks)) continue

    const area = estimateContentArea(elem, map)
    const pad = area >= 4 ? "p-[1.5rem]" : "p-[1rem]"
    setClassName(elem, `${cls} ${pad}`.trim())
    fixes.push(`[${elem.id}](${elem.component}) 有 bg 但缺 padding: 补充 ${pad} (内容面积=${area})`)
  }

  return [json, fixes]
}
