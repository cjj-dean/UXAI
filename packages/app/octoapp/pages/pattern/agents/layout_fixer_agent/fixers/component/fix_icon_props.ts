import { type A2UIJson, type Fixer, elemMap, childToParent, type A2UIElement } from "../../types"

/**
 * Enforces consistent Icon color and size across the page.
 *
 * Rules:
 * 1. Strip text-* color classes from className (Icon uses color prop only)
 * 2. If color prop missing/default/inverse → "#777777"
 * 3. If no size class → add based on context (header/aside/table/default)
 * 4. Ensure shape is set (default based on size)
 */

const TEXT_COLOR_RE = /\btext-(?:on-surface(?:-variant|-container)?|primary|success|warning|critical|error|info|inverse|on-primary|on-secondary|default)\b/g
const TEXT_COLOR_TEST = /\btext-(?:on-surface(?:-variant|-container)?|primary|success|warning|critical|error|info|inverse|on-primary|on-secondary|default)\b/

const SIZE_RE = /\bw-(\d+)\b/

const fix_icon_props: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const parentOf = childToParent(json.elements)

  let count = 0

  for (const el of json.elements) {
    if (el.component !== "Icon") continue
    const p = el.props ?? (el.props = {})
    let modified = false

    // 1) Strip text-* color classes from className
    const cls = typeof p.className === "string" ? p.className : ""
    if (TEXT_COLOR_TEST.test(cls)) {
      p.className = cls.replace(TEXT_COLOR_RE, "").replace(/\s+/g, " ").trim()
      modified = true
    }

    // 2) Ensure color prop
    if (!p.color || p.color === "default" || p.color === "inverse") {
      p.color = "#777777"
      modified = true
    }

    // 3) Ensure size class based on context
    const currentCls = typeof p.className === "string" ? p.className : ""
    if (!SIZE_RE.test(currentCls)) {
      const ctx = detectContext(el, map, parentOf)
      const sizeCls = ctx === "header" ? "w-5 h-5"
        : ctx === "sidebar" ? "w-6 h-6"
        : ctx === "table" ? "w-4 h-4"
        : "w-4 h-4"
      p.className = (currentCls + " " + sizeCls).trim()
      modified = true
    }

    // 4) Ensure shape
    if (!p.shape) {
      const sizeMatch = (typeof p.className === "string" ? p.className : "").match(SIZE_RE)
      const size = sizeMatch ? parseInt(sizeMatch[1]) : 4
      p.shape = size <= 6 ? "outline" : "square"
      modified = true
    }

    if (modified) count++
  }

  if (count > 0) {
    fixes.push(`[icon_props] ${count} 处 Icon 修正: 颜色统一 color prop、大小按场景补全、shape 补全`)
  }

  return [json, fixes]
}

function detectContext(el: A2UIElement, map: Record<string, A2UIElement>, parentOf: Record<string, string>): string {
  let cur: string | undefined = el.id
  while (cur) {
    const e = map[cur]
    if (e) {
      if (e.component === "header" || /header|^nav/i.test(e.id)) return "header"
      if (e.component === "aside" || /sidebar|aside|side.?menu|leftside/i.test(e.id)) return "sidebar"
      if (e.component === "Table" || /table/i.test(e.id)) return "table"
    }
    cur = parentOf[cur]
  }
  return "default"
}

export default fix_icon_props
