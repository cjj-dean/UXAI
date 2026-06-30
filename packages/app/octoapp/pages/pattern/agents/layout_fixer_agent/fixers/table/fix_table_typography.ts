import { type A2UIJson, type Fixer } from "../../types"

/**
 * Forces all text elements inside Table cells to use text-md text-on-surface
 * with whitespace-nowrap. Strips conflicting text size and color classes,
 * ensures no-wrap behavior so column minWidth works correctly.
 *
 * Leaves Tag and Button components untouched (Tag conveys status via its own
 * color prop; Button has its own sizing).
 */

const SIZE_CLASSES = /\btext-(xs|sm|lg|xl|2xl|3xl|base)\b/g
const COLOR_CLASSES = /\btext-(on-surface-variant|on-surface-container|primary|success|warning|critical|error|info|inverse|on-primary|on-secondary)\b/g

const TEXT_TAGS = new Set(["span", "a", "div", "p", "label", "h1", "h2", "h3", "h4", "h5", "h6"])

export const fixTableTypography: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []
  const map: Record<string, any> = {}
  for (const el of json.elements) map[el.id] = el

  const tableCellIds = new Set<string>()

  for (const el of json.elements) {
    if (el.component !== "Table") continue

    // Resolve TableRow — direct children or template binding
    const tc = el.children
    let rowIds: string[] = []
    if (Array.isArray(tc)) {
      rowIds = tc.filter((c: any) => typeof c === "string")
    } else if (tc && typeof tc === "object" && tc.componentId) {
      // Template binding: the template IS the row
      rowIds = [tc.componentId]
      // Also collect actual rendered rows if any exist in elements
    }

    // Also scan all TableRow elements in the doc
    for (const e of json.elements) {
      if (e.component === "TableRow") rowIds.push(e.id)
    }

    for (const rowId of rowIds) {
      collectCellDescendants(rowId, map, tableCellIds)
    }
  }

  if (tableCellIds.size === 0) return [json, fixes]

  let count = 0
  for (const id of tableCellIds) {
    const el = map[id]
    if (!el) continue
    if (el.component === "Tag" || el.component === "Button") continue

    const cls = el.props?.className
    if (typeof cls !== "string") continue

    let newCls = cls
    let modified = false

    // Replace size classes
    if (SIZE_CLASSES.test(newCls)) {
      newCls = newCls.replace(SIZE_CLASSES, "text-md")
      // Deduplicate consecutive text-md
      newCls = newCls.replace(/(?:text-md\s*)+/g, "text-md ")
      modified = true
    }

    // Replace color classes (but keep text-on-surface)
    if (COLOR_CLASSES.test(newCls)) {
      newCls = newCls.replace(COLOR_CLASSES, "text-on-surface")
      newCls = newCls.replace(/(?:text-on-surface\s*)+/g, "text-on-surface ")
      modified = true
    }

    // Ensure whitespace-nowrap so text doesn't wrap inside the cell
    const NOWRAP_RE = /\bwhitespace-nowrap\b/
    if (!NOWRAP_RE.test(newCls)) {
      newCls = newCls.replace(/\s*$/, " whitespace-nowrap")
      modified = true
    }

    if (modified) {
      newCls = newCls.replace(/\s+/g, " ").trim()
      el.props.className = newCls
      count++
    }
  }

  if (count > 0) {
    fixes.push(`[table_typography] ${count} 处表格文本样式统一为 text-md text-on-surface`)
  }

  return [json, fixes]
}

function collectCellDescendants(id: string, map: Record<string, any>, out: Set<string>): void {
  const el = map[id]
  if (!el) return
  out.add(id)

  const kids = el.children
  if (Array.isArray(kids)) {
    for (const c of kids) {
      if (typeof c === "string") collectCellDescendants(c, map, out)
    }
  } else if (kids && typeof kids === "object" && kids.componentId) {
    collectCellDescendants(kids.componentId, map, out)
  }
}
