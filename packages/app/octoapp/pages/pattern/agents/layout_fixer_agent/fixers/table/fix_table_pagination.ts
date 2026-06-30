import { type A2UIJson, type Fixer } from "../../types"

/**
 * Tables default to showing pagination. The LLM sometimes sets `pagination: false`
 * explicitly, which removes the page navigation. Strip that override so the
 * table renderer falls back to its default paginated behavior.
 *
 * Design system rule: "Table 默认具有分页功能，在不显性控制分页器时，
 * 必须给 Table 组件添加下边距。"
 */
export const fixTablePagination: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []
  let count = 0

  for (const el of json.elements) {
    if (el.component !== "Table") continue
    if (el.props?.pagination === false) {
      const { pagination: _drop, ...rest } = el.props
      el.props = rest
      count++
    }
  }

  if (count > 0) {
    fixes.push(`[table_pagination] ${count} 处 Table 强制开启分页（移除 LLM 设置的 pagination: false）`)
  }

  return [json, fixes]
}

export default fixTablePagination
