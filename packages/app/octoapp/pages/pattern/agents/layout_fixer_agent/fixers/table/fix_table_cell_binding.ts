import { type A2UIElement, type Fixer, elemMap } from "../../types"

/**
 * Fixes table cells whose `component` cannot render the bound text content.
 *
 * Background: cell row templates often bind `props.value` to a row-data path
 * (e.g. `{ path: "terminalName.text" }`). When the cell uses `component: "a"`
 * but has no usable `href`, the renderer treats the anchor as a navigation
 * surface and drops the text — the column appears empty. Replace with `span`
 * so the value is rendered like every other text cell.
 *
 * Also reports columns whose `dataIndex` points to a nested object while no
 * cell binds the exact path (cells only bind sub-fields like `xx.text`).
 * Informational only — column-level auto-binding semantics are renderer-
 * dependent, but the warning surfaces a known footgun in fixer.log.
 */

const TEXT_CELLS = new Set(["span", "p", "text", "label", "strong", "em"])

function rowTemplateCells(table: A2UIElement, map: Record<string, A2UIElement>): A2UIElement[] {
  const tc = table.children
  const rowIds: string[] = []
  if (Array.isArray(tc)) {
    for (const c of tc) if (typeof c === "string") rowIds.push(c)
  } else if (tc && typeof tc === "object" && typeof tc.componentId === "string") {
    rowIds.push(tc.componentId)
  }
  return rowIds.flatMap((rid) => {
    const row = map[rid]
    if (!row || !Array.isArray(row.children)) return []
    return row.children.flatMap((cc) => {
      if (typeof cc === "string" && map[cc]) return [map[cc]]
      return []
    })
  })
}

function descendantIds(cells: A2UIElement[], map: Record<string, A2UIElement>): string[] {
  const seen = new Set<string>()
  const stack = [...cells]
  while (stack.length) {
    const el = stack.pop()!
    if (seen.has(el.id)) continue
    seen.add(el.id)
    if (Array.isArray(el.children)) {
      for (const c of el.children) {
        if (typeof c === "string" && map[c]) stack.push(map[c])
      }
    }
  }
  return [...seen]
}

export const fixTableCellBinding: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const table of json.elements) {
    if (table.component !== "Table") continue

    const cells = rowTemplateCells(table, map)
    const allIds = descendantIds(cells, map)
    const allElems = allIds.flatMap((id) => {
      const e = map[id]
      return e ? [e] : []
    })

    let rewritten = 0
    const rewrittenIds: string[] = []
    for (const el of allElems) {
      if (el.component !== "a") continue
      const value = el.props?.value
      const href = el.props?.href
      const hasTextBinding = value != null
      const hrefValid = typeof href === "string" && href.trim().length > 0
      if (!hasTextBinding || hrefValid) continue
      el.component = "span"
      rewritten++
      rewrittenIds.push(el.id)
    }
    if (rewritten) {
      fixes.push(`[${table.id}] ${rewritten} 处单元格 component=a 缺 href 降级为 span: ${rewrittenIds.join(", ")}`)
    }

    const cols = table.props?.columns
    if (!Array.isArray(cols)) continue
    const cellPaths = new Set<string>()
    for (const el of allElems) {
      const v = el.props?.value
      if (v && typeof v === "object" && typeof v.path === "string") cellPaths.add(v.path)
    }
    const mismatched: string[] = []
    for (const col of cols) {
      if (!col || typeof col !== "object") continue
      const dx = col.dataIndex
      if (typeof dx !== "string") continue
      if (cellPaths.has(dx)) continue
      const nested = [...cellPaths].filter((p) => p.startsWith(dx + "."))
      if (nested.length) {
        mismatched.push(`${col.title ?? dx}(dataIndex=${dx})<-${nested.join("|")}`)
      }
    }
    if (mismatched.length) {
      fixes.push(`[${table.id}] dataIndex 为嵌套对象、cells 仅绑定子字段（按行模板路径解析，列级 dataIndex 自动绑定失效）: ${mismatched.join("; ")}`)
    }
  }

  return [json, fixes]
}