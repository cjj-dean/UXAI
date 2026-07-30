import { type A2UIElement, type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const SKIP_COMPONENTS = new Set(["Table", "TableRow", "Tabs", "TabItem", "Collapse", "Tree", "Carousel", "Timeline"])
const JUSTIFY_DISTRIBUTE = new Set(["justify-evenly", "justify-between", "justify-around"])
const LEAF_COMPONENTS = new Set(["Icon", "span", "Tag", "Badge", "Button", "Input", "Select", "img", "a", "strong", "em", "code", "Progress", "Rate", "Switch", "Avatar", "Pagination", "DatePicker", "TimePicker", "Cascader"])
const MB_RE = /^mb-(?:\[|\d)/
const MARGIN_RE = /^m[tlrb]?-(?:\[|\d)/
const PADDING_RE = /^p[tlrb]?-(?:\[|\d)/
const SPACING_COMPONENTS = new Set(["Divider"])

function childHasSelfSpacing(childElems: A2UIElement[]): boolean {
  return childElems.some((c) => {
    if (SPACING_COMPONENTS.has(c.component)) return true
    const toks = tokens(getClassName(c))
    return toks.some((t) => MARGIN_RE.test(t) || PADDING_RE.test(t))
  })
}

function isShellChrome(elem: A2UIElement): boolean {
  const cls = getClassName(elem)
  return cls.includes("shadow-sm") && cls.includes("bg-surface-container-highest")
}

function pickGap(childComps: Set<string>): string {
  return childComps.size > 0 && [...childComps].every((c) => LEAF_COMPONENTS.has(c)) ? "gap-[0.5rem]" : "gap-[1rem]"
}

function pickMargin(childComps: Set<string>): string {
  return childComps.size > 0 && [...childComps].every((c) => LEAF_COMPONENTS.has(c)) ? "mb-[0.5rem]" : "mb-[1rem]"
}

export const fixContainerFlex: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const rootId = json.rootId ?? ""

  for (const elem of json.elements) {
    if (SKIP_COMPONENTS.has(elem.component)) continue
    if (elem.id === rootId) continue
    if (!Array.isArray(elem.children) || elem.children.length < 2) continue

    const childElems = elem.children.filter((c: any) => typeof c === "string" && map[c]).map((c: string) => map[c])
    if (childElems.some(isShellChrome)) continue

    const childComps = new Set(childElems.map((c) => c.component ?? ""))
    if (childComps.size > 0 && [...childComps].every((c) => ["span", "a", "strong", "em", "code"].includes(c))) continue

    let cls = getClassName(elem)
    const toks = tokens(cls)
    const hasDisplay = toks.some((t) => t === "flex" || t === "grid" || t.startsWith("grid-"))
    const hasGap = toks.some((t) => t.startsWith("gap-"))
    const hasJustify = toks.some((t) => JUSTIFY_DISTRIBUTE.has(t))

    if (hasJustify && !hasGap) continue

    if (!hasDisplay && !hasGap) {
      if (elem.component === "header") {
        const gapCls = pickGap(childComps)
        const additions = ["flex", "flex-row", "items-center", gapCls]
        setClassName(elem, `${cls} ${additions.join(" ")}`.trim())
        fixes.push(`[${elem.id}](${elem.component}) header 缺少横向布局: 补充 ${additions.join(" ")}`)
      } else {
        const mbCls = pickMargin(childComps)
        for (let i = 0; i < childElems.length - 1; i++) {
          const child = childElems[i]
          if (!child) continue
          const childCls = getClassName(child)
          if (tokens(childCls).some((t) => MB_RE.test(t))) continue
          setClassName(child, `${childCls} ${mbCls}`.trim())
        }
        fixes.push(`[${elem.id}](${elem.component}) 多子容器无 flex: 为子元素补充 ${mbCls}（末元素除外）`)
      }
    } else if (!hasGap) {
      if (childHasSelfSpacing(childElems)) continue
      const gapCls = pickGap(childComps)
      setClassName(elem, `${cls} ${gapCls}`.trim())
      fixes.push(`[${elem.id}](${elem.component}) 多子容器缺少 ${gapCls}: 已补充`)
    }
  }
  return [json, fixes]
}
