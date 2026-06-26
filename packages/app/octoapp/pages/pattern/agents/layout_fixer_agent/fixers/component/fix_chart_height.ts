import { type A2UIElement, type Fixer, childToParent, elemMap, getClassName, setClassName, tokens } from "../../types"

const CHART_COMPONENTS = new Set(["LineChart", "BarChart", "PieChart", "RadarChart", "GaugeChart", "ProcessChart", "BubbleChart", "AssembleBubbleChart", "BulletChart", "FunnelChart", "HillChart", "ScatterChart", "JadeJueChart", "CircleProcessChart"])
const DEFAULT_CHART_HEIGHT = 250
const HEADER_BUFFER = 80
const CONFLICTING_CLASSES = new Set(["flex-1", "min-h-0", "flex-grow", "grow", "h-full", "h-screen"])

function parsePx(cls: string, re: RegExp): number | null {
  const m = cls.match(re)
  return m ? parseFloat(m[1]) : null
}

function parseRemToPx(cls: string, re: RegExp): number | null {
  const m = cls.match(re)
  return m ? parseFloat(m[1]) * 16 : null
}

function findAncestorContentHeight(chartId: string, map: Record<string, A2UIElement>, c2p: Record<string, string>): number | null {
  let current = chartId
  while (current in c2p) {
    const parentId = c2p[current]
    const parent = map[parentId]
    if (!parent) break
    const cls = getClassName(parent)
    const hPx = parsePx(cls, /h-\[(\d+(?:\.\d+)?)px\]/)
    const hRem = parseRemToPx(cls, /h-\[(\d+(?:\.\d+)?)rem\]/)
    if (hPx === null && hRem === null) {
      current = parentId
      continue
    }
    const rawH = hPx ?? hRem!
    const pRem = parseRemToPx(cls, /p-\[(\d+(?:\.\d+)?)rem\]/)
    const pPx = parsePx(cls, /p-\[(\d+(?:\.\d+)?)px\]/)
    const pad = pRem !== null ? pRem * 2 : pPx !== null ? pPx * 2 : 0
    return rawH - pad
  }
  return null
}

function getChartHeightPx(cls: string): number | null {
  const hPx = parsePx(cls, /h-\[(\d+(?:\.\d+)?)px\]/)
  if (hPx !== null) return hPx
  const hRem = parseRemToPx(cls, /h-\[(\d+(?:\.\d+)?)rem\]/)
  if (hRem !== null) return hRem
  for (const tok of tokens(cls)) {
    const m = tok.match(/^h-(\d+(?:\.\d+)?)$/)
    if (m) return parseFloat(m[1]) * 4
  }
  return null
}

function setChartHeightPx(cls: string, heightPx: number): string {
  const newH = `h-[${heightPx}px]`
  if (/h-\[\d+(?:\.\d+)?(?:px|rem)\]/.test(cls)) {
    return cls.replace(/h-\[\d+(?:\.\d+)?(?:px|rem)\]/, newH)
  }
  return `${cls} ${newH}`.trim()
}

function stripConflicting(cls: string): string {
  return tokens(cls).filter((t) => !CONFLICTING_CLASSES.has(t)).join(" ")
}

export const fixChartHeight: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)
  const c2p = childToParent(json.elements)

  for (const elem of json.elements) {
    if (!CHART_COMPONENTS.has(elem.component)) continue
    const cls = getClassName(elem)
    let available = findAncestorContentHeight(elem.id, map, c2p)
    if (available !== null) {
      available -= HEADER_BUFFER
      if (available < 100) available = 100
    }
    const currentH = getChartHeightPx(cls)
    const cleanedCls = stripConflicting(cls)

    if (currentH === null) {
      const targetH = available ? Math.min(DEFAULT_CHART_HEIGHT, Math.floor(available)) : DEFAULT_CHART_HEIGHT
      setClassName(elem, setChartHeightPx(cleanedCls, targetH))
      fixes.push(`[${elem.id}](${elem.component}) 缺少显式高度: 设置 h-[${targetH}px]`)
    } else {
      let newCls = cleanedCls
      if (available && currentH > available) {
        const targetH = Math.floor(available)
        newCls = setChartHeightPx(cleanedCls, targetH)
        fixes.push(`[${elem.id}](${elem.component}) 图表高度 ${Math.floor(currentH)}px 溢出父容器: 缩小到 h-[${targetH}px]`)
      } else if (cleanedCls !== cls) {
        fixes.push(`[${elem.id}](${elem.component}) 清理冲突高度类 (h-full 等)`)
      }
      if (newCls !== cls) setClassName(elem, newCls)
    }
  }
  return [json, fixes]
}
