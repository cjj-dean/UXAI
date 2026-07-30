import { type A2UIJson, type Fixer } from "../../types"

/**
 * Header elements default to vertical centering (`items-center`), standard
 * 56px height, and `px-[1rem]` left/right padding (mobile touch-friendly).
 * `justify-between` is only added when the header has exactly 2
 * children (typical left-group + right-group pattern); for 1 or 3+ children
 * it would leave awkward gaps.
 *
 * Design system rules:
 *   - "顶部导航栏分为左右两端对齐排布" — applies only to 2-children layout
 *   - "Header Navigation ... Size: Use 56px as height" — unconditional
 *   - "Header Navigation ... Padding: px-[1rem]" — unconditional
 *   - vertical centering is standard for any header
 */
const HEADER_BASE_CLASS = "items-center h-[56px] px-[1rem]"

function ensureClass(cls: string, addition: string): string {
  const parts = cls.split(/\s+/).filter(Boolean)
  for (const tok of addition.split(/\s+/)) {
    if (!parts.includes(tok)) parts.push(tok)
  }
  return parts.join(" ")
}

function childCount(el: { children?: unknown }): number {
  return Array.isArray(el.children) ? (el.children as unknown[]).length : 0
}

export const fixHeaderLayout: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []
  let baseCount = 0
  let betweenCount = 0
  const baseTouched: string[] = []
  const betweenTouched: string[] = []

  for (const el of json.elements) {
    if (el.component !== "header") continue
    const props = (el.props ?? (el.props = {})) as Record<string, any>
    const before = typeof props.className === "string" ? props.className : ""

    // 1) Always add items-center + h-[56px]
    const after1 = ensureClass(before, HEADER_BASE_CLASS)
    if (after1 !== before) {
      props.className = after1
      baseCount++
      baseTouched.push(el.id)
    }

    // 2) Only add justify-between when exactly 2 children (left + right)
    if (childCount(el) === 2) {
      const current = typeof props.className === "string" ? props.className : ""
      const after2 = ensureClass(current, "justify-between")
      if (after2 !== current) {
        props.className = after2
        betweenCount++
        betweenTouched.push(el.id)
      }
    }
  }

  if (baseCount > 0) {
    fixes.push(`[header_layout] ${baseCount} 处 <header> 补全垂直居中与高度: ${baseTouched.join(", ")}`)
  }
  if (betweenCount > 0) {
    fixes.push(`[header_layout] ${betweenCount} 处 <header> (2 子元素) 补全两端对齐: ${betweenTouched.join(", ")}`)
  }

  return [json, fixes]
}

export default fixHeaderLayout
