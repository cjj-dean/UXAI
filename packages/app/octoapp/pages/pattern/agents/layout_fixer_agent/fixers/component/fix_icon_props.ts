import { type A2UIJson, type Fixer, elemMap, childToParent, resolveState, type A2UIElement } from "../../types"

/**
 * Enforces consistent Icon color and size across the page.
 *
 * Rules:
 * 1. Strip text-* color classes from className (Icon uses color prop only)
 * 2. If color prop missing/default/inverse/path→non-color → "#777777"
 * 3. If no size class → add based on context (header/aside/table/default)
 * 4. Ensure shape is set (default based on size); ≤ w-6 ONLY outline, fill→outline
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

    // 2) Ensure color prop is a valid color string
    if (typeof p.color === "string") {
      if (p.color === "default" || p.color === "inverse") {
        p.color = "#777777"
        modified = true
      }
    } else if (p.color && typeof p.color === "object" && typeof p.color.path === "string") {
      const sample = resolveState(json.state, p.color.path)
      if (typeof sample !== "string") {
        fixes.push(`[${el.id}](Icon) color 绑定到 ${p.color.path} 解析为非字符串值（${sample === null ? "null" : typeof sample}），降级为 #777777`)
        p.color = "#777777"
        modified = true
      }
    } else {
      p.color = "#777777"
      modified = true
    }

    // 3) Ensure size class based on context
    const currentCls = typeof p.className === "string" ? p.className : ""
    if (!SIZE_RE.test(currentCls)) {
      const ctx = detectContext(el, map, parentOf)
      const sizeCls = ctx === "header" ? "w-6 h-6"
        : ctx === "sidebar" ? "w-6 h-6"
        : ctx === "table" ? "w-5 h-5"
        : "w-5 h-5"
      p.className = (currentCls + " " + sizeCls).trim()
      modified = true
    }

    // 4) Ensure shape — ≤ w-6 ONLY outline, never fill
    const sizeMatch = (typeof p.className === "string" ? p.className : "").match(SIZE_RE)
    const size = sizeMatch ? parseInt(sizeMatch[1]) : 4
    if (!p.shape) {
      p.shape = size <= 6 ? "outline" : "square"
      modified = true
    } else if (size <= 6 && p.shape === "fill") {
      p.shape = "outline"
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
