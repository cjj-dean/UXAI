import { type A2UIJson, type Fixer, resolveState } from "../../types"

/**
 * Removes manually-generated legend divs and center-text overlays that are
 * siblings of PieChart/CircleProcessChart/GaugeChart.
 *
 * Detection:
 * - Center text: chart's option.title text/subtext matches sibling span text
 * - Legend: sibling subtree contains "colored dot (div/span) + adjacent text span" pairs
 *
 * Path bindings in both option.title and sibling text values are resolved
 * against json.state so the comparison can match real (resolved) strings.
 */
const fix_chart_builtin_legend: Fixer = (json): [A2UIJson, string[]] => {
  const root = json
  const state = json.state ?? {}
  const fixes: string[] = []
  const byId = new Map<string, any>()
  const parentOf = new Map<string, string>()

  for (const el of root.elements) {
    byId.set(el.id, el)
    const kids = (el as any).children
    if (Array.isArray(kids)) {
      for (const k of kids) {
        if (typeof k === "string") parentOf.set(k, el.id)
      }
    }
  }

  const CHART_TYPES = new Set(["PieChart", "CircleProcessChart", "GaugeChart"])

  for (const el of root.elements) {
    if (!CHART_TYPES.has(el.component as string)) continue
    const parentId = parentOf.get(el.id)
    if (!parentId) continue
    const parent = byId.get(parentId)
    if (!parent || !Array.isArray(parent.children)) continue

    const titleTexts = collectTitleTexts(el, state)

    const removed: string[] = []
    parent.children = parent.children.filter((childId: string) => {
      if (childId === el.id) return true
      const child = byId.get(childId)
      if (!child) return true
      if (isRedundantChartSibling(child, byId, titleTexts, state)) {
        removed.push(childId)
        return false
      }
      return true
    })

    if (removed.length === 0) continue

    const toDelete = new Set<string>()
    for (const id of removed) collectDescendants(id, byId, toDelete)
    root.elements = root.elements.filter((e) => !toDelete.has(e.id))
    fixes.push(`[${parentId}] 移除${el.component}冗余图例/中心文字: ${removed.join(", ")}`)
  }

  return [json, fixes]
}

function collectTitleTexts(chartEl: any, state: any): Set<string> {
  const out = new Set<string>()
  const title = chartEl.props?.option?.title
  if (!title) return out
  for (const key of ["text", "subtext"] as const) {
    const v = title[key]
    if (typeof v === "string") {
      if (v.trim()) out.add(v.trim())
    } else if (v && typeof v === "object" && typeof v.path === "string") {
      // Resolve path binding against state to get the real text
      const resolved = resolveState(state, v.path)
      if (typeof resolved === "string" && resolved.trim()) out.add(resolved.trim())
    }
  }
  return out
}

function collectTexts(elId: string, byId: Map<string, any>, state: any): string[] {
  const out: string[] = []
  const el = byId.get(elId)
  if (!el) return out
  const v = el.props?.value ?? el.props?.text
  if (typeof v === "string" && v.trim()) {
    out.push(v.trim())
  } else if (v && typeof v === "object" && typeof v.path === "string") {
    // Resolve path binding against state
    const resolved = resolveState(state, v.path)
    if (typeof resolved === "string" && resolved.trim()) out.push(resolved.trim())
  }
  const kids = (el as any).children
  if (Array.isArray(kids)) {
    for (const k of kids) {
      if (typeof k === "string") out.push(...collectTexts(k, byId, state))
    }
  }
  return out
}

function isRedundantChartSibling(el: any, byId: Map<string, any>, titleTexts: Set<string>, state: any): boolean {
  // 1) Center text: element's subtree contains spans matching option.title text
  if (titleTexts.size > 0) {
    const texts = collectTexts(el.id, byId, state)
    if (texts.some((t) => titleTexts.has(t))) return true
  }

  // 2) Legend: subtree contains "colored dot + adjacent text span" pairs
  if (countDotTextPairs(el, byId) > 0) return true

  return false
}

/** Count "colored rounded dot (div/span) immediately followed by text span" pairs */
function countDotTextPairs(rootEl: any, byId: Map<string, any>): number {
  let count = 0

  function walk(elId: string, depth: number) {
    if (depth > 4) return
    const el = byId.get(elId)
    if (!el) return
    const kids = (el as any).children

    // Template binding: resolve template element
    if (kids && !Array.isArray(kids) && typeof kids === "object" && kids.componentId) {
      const tpl = byId.get(kids.componentId)
      if (tpl) {
        if (checkDotTextInArray(tpl, byId)) count++
      }
      return
    }

    if (!Array.isArray(kids)) return

    // Check adjacent pairs in this element's children
    if (checkDotTextInArray(el, byId)) count++

    // Recurse
    for (const k of kids) {
      if (typeof k === "string") walk(k, depth + 1)
    }
  }

  walk(rootEl.id, 0)
  return count
}

function checkDotTextInArray(el: any, byId: Map<string, any>): boolean {
  const kids = (el as any).children
  if (!Array.isArray(kids)) return false
  for (let i = 0; i < kids.length - 1; i++) {
    if (typeof kids[i] !== "string" || typeof kids[i + 1] !== "string") continue
    const a = byId.get(kids[i])
    const b = byId.get(kids[i + 1])
    if (!a || !b) continue
    if (isColoredDot(a) && isTextSpan(b)) return true
  }
  return false
}

function isColoredDot(el: any): boolean {
  if (el.component !== "div" && el.component !== "span") return false
  const cls: string = el.props?.className ?? ""
  const isRound = /rounded-full/.test(cls)
  const hasSize = /w-\[?\d|h-\[?\d/.test(cls)
  const hasColor = /bg-/.test(cls)
  return isRound && hasSize && hasColor
}

function isTextSpan(el: any): boolean {
  if (el.component !== "span" && el.component !== "a") return false
  return true
}

function collectDescendants(id: string, byId: Map<string, any>, out: Set<string>) {
  out.add(id)
  const el = byId.get(id)
  if (!el) return
  const kids = (el as any).children
  if (Array.isArray(kids)) {
    for (const k of kids) {
      if (typeof k === "string") collectDescendants(k, byId, out)
    }
  }
}

export default fix_chart_builtin_legend
