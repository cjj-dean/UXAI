import { type A2UIElement, type Fixer, elemMap, resolveState } from "../../types"
import { TEXT_COMPONENTS } from "./fix_table_selection_column"

const FONT_CJK = 14
const FONT_ASCII = 7
const CELL_PAD = 24
const HEADER_PAD = 24
const ICON_SORT = 22
const ICON_FILTER = 24
const BUFFER = 8
const MIN_WIDTH = 80
const MAX_WIDTH = 360

function textWidthPx(text: any): number {
  if (text == null) return 0
  let width = 0
  for (const ch of String(text)) {
    width += ch.codePointAt(0)! > 0x2e80 ? FONT_CJK : FONT_ASCII
  }
  return width
}

function sampleField(rows: any[], field: string): any[] {
  if (!field) return []
  const parts = field.split(".")
  return rows.map((r) => {
    if (!r || typeof r !== "object") return null
    let cur = r
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p]
      else return null
    }
    return cur
  })
}

const MIN_W_RE = /min-w-\[(\d+)px\]/

/** 估算非文本单元格的内容宽度（含组件开销） */
function estimateCellWidth(cell: A2UIElement, rows: any[], map: Record<string, A2UIElement>): number {
  let width = 0
  const cls = (cell.props?.className as string) ?? ""

  // 1) 解析 min-w-[Npx]
  const mw = cls.match(MIN_W_RE)
  if (mw) width = Math.max(width, parseInt(mw[1]))

  const comp = cell.component ?? ""

  // 2) Tag / Button：从 state 取文本测量
  if (comp === "Tag" || comp === "Button") {
    const overhead = comp === "Tag" ? 32 : 40
    const value = cell.props?.value
    if (value && typeof value === "object" && typeof value.path === "string") {
      for (const v of sampleField(rows, value.path)) {
        if (v == null || typeof v === "object") continue
        width = Math.max(width, textWidthPx(v) + overhead)
      }
    } else if (typeof value === "string") {
      width = Math.max(width, textWidthPx(value) + overhead)
    }
    if (!width) width = overhead + 20
  }

  // 3) Icon：固定宽度
  if (comp === "Icon") width = Math.max(width, 24)

  // 4) Checkbox / Switch：固定宽度
  if (comp === "Checkbox" || comp === "Switch") width = Math.max(width, 40)

  // 5) span：从 value/text 测量文本
  if (comp === "span" || comp === "a") {
    const value = cell.props?.value ?? cell.props?.text
    if (value && typeof value === "object" && typeof value.path === "string") {
      for (const v of sampleField(rows, value.path)) {
        if (v == null || typeof v === "object") continue
        width = Math.max(width, textWidthPx(v))
      }
    } else if (typeof value === "string") {
      width = Math.max(width, textWidthPx(value))
    }
  }

  // 6) div 容器：递归扫描子元素，累加 flex-row 宽度（含 gap）
  if (comp === "div" && Array.isArray(cell.children)) {
    let childMax = 0
    let childSum = 0
    for (const cid of cell.children) {
      if (typeof cid === "string" && map[cid]) {
        const cw = estimateCellWidth(map[cid], rows, map)
        childMax = Math.max(childMax, cw)
        childSum += cw
      }
    }
    if (cls.includes("flex-row") || cls.includes("flex flex-row") || /flex.*(row|items-center)/.test(cls)) {
      // flex-row: sum children + gaps
      const gapMatch = cls.match(/gap-\[?([\d.]+)(?:rem|px)\]?/)
      const gap = gapMatch ? (gapMatch[2] === "px" ? parseFloat(gapMatch[1]) : parseFloat(gapMatch[1]) * 16) : 0
      const childCount = cell.children.filter((c: any) => typeof c === "string" && map[c]).length
      width = Math.max(width, childSum + gap * Math.max(childCount - 1, 0))
    } else {
      width = Math.max(width, childMax)
    }
  }

  return width
}

export const fixTableColumnWidth: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const state = json.state ?? {}

  for (const elem of json.elements) {
    if (elem.component !== "Table") continue
    let cols = elem.props?.columns
    let colsFromState = false
    if (!Array.isArray(cols)) {
      if (cols && typeof cols === "object" && typeof cols.path === "string") {
        const resolved = resolveState(state, cols.path)
        if (Array.isArray(resolved)) {
          cols = resolved
          colsFromState = true
        } else continue
      } else continue
    }
    if (!cols.length) continue

    let rows: any[] = []
    const ds = elem.props?.dataSource
    if (ds && typeof ds === "object" && typeof ds.path === "string") {
      const resolved = resolveState(state, ds.path)
      if (Array.isArray(resolved)) rows = resolved
    }

    const cells = (() => {
      const ch = elem.children
      const rowIds: string[] = []
      if (ch && typeof ch === "object" && !Array.isArray(ch)) {
        if (typeof ch.componentId === "string") rowIds.push(ch.componentId)
      } else if (Array.isArray(ch)) {
        for (const c of ch) if (typeof c === "string") rowIds.push(c)
      }
      const result: A2UIElement[] = []
      for (const rid of rowIds) {
        const row = map[rid]
        if (!row || !Array.isArray(row.children)) continue
        for (const cc of row.children) {
          if (typeof cc === "string" && map[cc]) result.push(map[cc])
        }
      }
      return result
    })()

    const fieldCells: Record<string, A2UIElement> = {}
    for (const cell of cells) {
      const value = cell.props?.value
      if (value && typeof value === "object" && typeof value.path === "string") {
        fieldCells[value.path] = cell
      }
    }
    const positionalOk = cells.length > 0 && cells.length === cols.length

    let changed = false
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i]
      if (!col || typeof col !== "object") continue

      const dx = col.dataIndex
      if (typeof dx !== "string") continue

      let cell = fieldCells[dx]
      if (!cell && positionalOk && i < cells.length) cell = cells[i]

      let isText = false
      let field: string | null = null
      let literal: any = null

      if (cell) {
        const comp = cell.component ?? ""
        const value = cell.props?.value
        if (TEXT_COMPONENTS.has(comp) && value != null) {
          isText = true
          if (value && typeof value === "object" && typeof value.path === "string") {
            field = value.path
          } else if (typeof value === "string") {
            literal = value
          } else {
            literal = String(value)
          }
        }
      } else {
        if (cells.length > 0) {
          // No matching cell in row template — fall through to header-based width
        } else if (!rows.length) {
          // No cells and no rows — fall through to header-based width
        } else {
          const samples = sampleField(rows, dx).filter((v) => v != null)
          if (samples.length && samples.every((v) => typeof v !== "object")) {
            isText = true
            field = dx
          }
        }
      }

      if (!isText) {
        if (col.width != null || col.minWidth != null) continue
        const headerText = textWidthPx(col.title ?? "")
        let icons = 0
        if (col.sort) icons += ICON_SORT
        if (col.filters) icons += ICON_FILTER
        const headerTotal = headerText + HEADER_PAD + icons + BUFFER

        // 估算非文本单元格内容宽度
        let cellTotal = 0
        if (cell) {
          cellTotal = estimateCellWidth(cell, rows, map) + CELL_PAD + BUFFER
        } else {
          for (const c of cells) {
            cellTotal = Math.max(cellTotal, estimateCellWidth(c, rows, map) + CELL_PAD + BUFFER)
          }
        }

        const fit = Math.min(Math.max(headerTotal, cellTotal, MIN_WIDTH), MAX_WIDTH)

        const newCol = { ...col }
        let did = false
        const existingMin = newCol.minWidth
        if (typeof existingMin !== "number" || existingMin < fit) {
          newCol.minWidth = fit
          did = true
        }
        if (did) {
          cols[i] = newCol
          changed = true
          const title = col.title ?? col.dataIndex ?? "?"
          fixes.push(`[${elem.id}] 列[${title}] 非文本列表头宽度兜底: minWidth=${newCol.minWidth}`)
        }
        continue
      }

      const headerText = textWidthPx(col.title ?? "")
      let icons = 0
      if (col.sort) icons += ICON_SORT
      if (col.filters) icons += ICON_FILTER
      const headerTotal = headerText + HEADER_PAD + icons + BUFFER

      let cellText = textWidthPx(literal)
      if (field && rows.length) {
        for (const v of sampleField(rows, field)) {
          if (v == null || typeof v === "object") continue
          cellText = Math.max(cellText, textWidthPx(v))
        }
      }
      const cellTotal = cellText + CELL_PAD + BUFFER
      const fit = Math.min(Math.max(headerTotal, cellTotal, MIN_WIDTH), MAX_WIDTH)

      const newCol = { ...col }
      let did = false
      const existingMin = newCol.minWidth
      if (typeof existingMin !== "number" || existingMin < fit) {
        newCol.minWidth = fit
        did = true
      }
      const width = newCol.width
      if (typeof width === "number" && width < fit) {
        delete newCol.width
        did = true
      }
      if (did) {
        cols[i] = newCol
        changed = true
        const title = col.title ?? col.dataIndex ?? "?"
        fixes.push(`[${elem.id}] 列[${title}] 纯文本列宽校正: minWidth=${newCol.minWidth}`)
      }
    }

    if (changed && !colsFromState) elem.props!.columns = cols
  }
  return [json, fixes]
}
