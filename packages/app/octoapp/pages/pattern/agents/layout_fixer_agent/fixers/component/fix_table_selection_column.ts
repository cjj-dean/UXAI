import { type A2UIElement, type Fixer, elemMap } from "../../types"

const SELECTION_DATA_INDEXES = new Set(["checkbox", "check", "selection", "select", "selected", "radio"])
const SELECTION_ID_KEYWORDS = ["checkbox", "check", "selection", "select", "radio"]
const TEXT_COMPONENTS = new Set(["span", "p", "text", "label", "a", "strong", "em"])

function rowTemplate(tableElem: A2UIElement, map: Record<string, A2UIElement>): A2UIElement | null {
  const ch = tableElem.children
  if (ch && typeof ch === "object" && !Array.isArray(ch)) {
    const cid = ch.componentId
    if (typeof cid === "string") return map[cid] ?? null
  }
  if (Array.isArray(ch)) {
    for (const cid of ch) {
      if (typeof cid !== "string") continue
      const row = map[cid]
      if (row && Array.isArray(row.children)) return row
    }
  }
  return null
}

function isSelectionCell(cellElem: A2UIElement, isFirst: boolean): boolean {
  const cid = (cellElem.id ?? "").toLowerCase()
  if (SELECTION_ID_KEYWORDS.some((kw) => cid.includes(kw))) return true
  if (isFirst) {
    if (!TEXT_COMPONENTS.has(cellElem.component)) return false
    const value = cellElem.props?.value
    const children = cellElem.children
    const valueEmpty = value == null || value === "" || (typeof value === "string" && !value.trim())
    if (valueEmpty && !children) return true
  }
  return false
}

export const fixTableSelectionColumn: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const orphanIds = new Set<string>()

  for (const elem of json.elements) {
    if (elem.component !== "Table") continue
    const rowSelection = elem.props?.rowSelection
    if (!rowSelection || typeof rowSelection !== "object") continue
    const rsType = rowSelection.type
    if (rsType !== "checkbox" && rsType !== "radio") continue

    const cols = elem.props?.columns
    if (Array.isArray(cols) && cols.length) {
      const kept = cols.filter((col: any) => {
        if (col && typeof col === "object") {
          const dx = col.dataIndex
          if (typeof dx === "string" && SELECTION_DATA_INDEXES.has(dx.toLowerCase())) return false
        }
        return true
      })
      if (kept.length !== cols.length) {
        const removed = cols.filter((c: any) => !kept.includes(c))
        elem.props!.columns = kept
        const titles = removed.map((c: any) => c?.dataIndex ?? c?.title ?? "?")
        fixes.push(`[${elem.id}] 移除冗余选择占位列: ${titles} (rowSelection.type=${rsType}，由内置选择列接管)`)
      }
    }

    const rowElem = rowTemplate(elem, map)
    if (!rowElem || !Array.isArray(rowElem.children)) continue
    const keptIds: any[] = []
    const removedCells: string[] = []
    for (let idx = 0; idx < rowElem.children.length; idx++) {
      const cid = rowElem.children[idx]
      if (typeof cid === "string") {
        const cell = map[cid] ?? ({} as A2UIElement)
        if (isSelectionCell(cell, idx === 0)) {
          removedCells.push(cid)
          orphanIds.add(cid)
          continue
        }
      }
      keptIds.push(cid)
    }
    if (removedCells.length) {
      rowElem.children = keptIds
      fixes.push(`[${elem.id}] 移除行模板冗余选择占位单元格: ${removedCells} (rowSelection.type=${rsType}，由内置选择列接管)`)
    }
  }

  if (orphanIds.size) {
    json.elements = json.elements.filter((e) => !orphanIds.has(e.id))
  }
  return [json, fixes]
}

export { TEXT_COMPONENTS }
