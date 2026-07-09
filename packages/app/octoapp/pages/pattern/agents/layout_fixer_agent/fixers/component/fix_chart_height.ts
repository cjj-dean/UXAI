import { type A2UIElement, type Fixer, childToParent, elemMap, getClassName, setClassName, tokens } from "../../types"

const CHART_COMPONENTS = new Set(["LineChart", "BarChart", "PieChart", "RadarChart", "GaugeChart", "ProcessChart", "BubbleChart", "AssembleBubbleChart", "BulletChart", "FunnelChart", "HillChart", "ScatterChart", "JadeJueChart", "CircleProcessChart"])
const DEFAULT_CHART_HEIGHT = 250
const HEADER_BUFFER = 80
const CONFLICTING_CLASSES = new Set(["flex-1", "min-h-0", "flex-grow", "grow", "h-full", "h-screen"])

const MINI_THRESHOLD_PER_ITEM = 38

function processDataLength(elem: A2UIElement, state: Record<string, any> | undefined): number | null {
  if (elem.component !== "ProcessChart") return null
  const dataProp = elem.props?.option?.data
  if (!dataProp) return null
  if (Array.isArray(dataProp)) return dataProp.length
  if (typeof dataProp === "object" && dataProp.path) {
    const resolved = resolvePath(state, dataProp.path)
    if (Array.isArray(resolved)) return resolved.length
  }
  return null
}

function resolvePath(state: Record<string, any> | undefined, path: string): any {
  if (!state || !path) return null
  let cur: any = state
  for (const part of path.split("/").filter(Boolean)) {
    if (cur && typeof cur === "object" && part in cur) cur = cur[part]
    else if (Array.isArray(cur)) {
      const idx = parseInt(part)
      if (!isNaN(idx) && idx >= 0 && idx < cur.length) cur = cur[idx]
      else return null
    } else return null
  }
  return cur
}

function parsePx(cls: string, re: RegExp): number | null {
  const m = cls.match(re)
  return m ? parseFloat(m[1]) : null
}

function parseRemToPx(cls: string, re: RegExp): number | null {
  const m = cls.match(re)
  return m ? parseFloat(m[1]) * 16 : null
}

function findAncestorContentHeight(chartId: string, map: Record<string, A2UIElement>, c2p: Record<string, string>): { height: number; isDirectParent: boolean } | null {
  let current = chartId
  let isFirst = true
  while (current in c2p) {
    const parentId = c2p[current]
    const parent = map[parentId]
    if (!parent) break
    const cls = getClassName(parent)
    const hPx = parsePx(cls, /h-\[(\d+(?:\.\d+)?)px\]/)
    const hRem = parseRemToPx(cls, /h-\[(\d+(?:\.\d+)?)rem\]/)
    if (hPx === null && hRem === null) {
      current = parentId
      isFirst = false
      continue
    }
    const rawH = hPx ?? hRem!
    const pRem = parseRemToPx(cls, /p-\[(\d+(?:\.\d+)?)rem\]/)
    const pPx = parsePx(cls, /p-\[(\d+(?:\.\d+)?)px\]/)
    const pad = pRem !== null ? pRem * 2 : pPx !== null ? pPx * 2 : 0
    return { height: rawH - pad, isDirectParent: isFirst }
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
    let minHMatch = cls.match(/min-h-\[(\d+(?:\.\d+)?)px\]/)
    if (minHMatch) {
      const minH = parseFloat(minHMatch[1])
      const replaced = cls.replace(/min-h-\[\d+(?:\.\d+)?px\]/, `h-[${minH}px]`)
      setClassName(elem, replaced)
      fixes.push(`[${elem.id}](${elem.component}) min-h-[${minH}px] 替换为 h-[${minH}px]（图表必须使用固定高度）`)
      continue
    }
    let ancestorResult = findAncestorContentHeight(elem.id, map, c2p)
    let available: number | null = ancestorResult?.height ?? null
    if (available !== null && !ancestorResult!.isDirectParent) {
      available -= HEADER_BUFFER
      if (available < 100) available = 100
    }
    const dataLen = processDataLength(elem, json.state)
    const miniThreshold = dataLen ? dataLen * MINI_THRESHOLD_PER_ITEM + 10 : 0
    const currentH = getChartHeightPx(cls)
    const cleanedCls = stripConflicting(cls)

    if (currentH === null) {
      let targetH = available ? Math.min(DEFAULT_CHART_HEIGHT, Math.floor(available)) : DEFAULT_CHART_HEIGHT
      if (miniThreshold > targetH) targetH = miniThreshold
      setClassName(elem, setChartHeightPx(cleanedCls, targetH))
      fixes.push(`[${elem.id}](${elem.component}) 缺少显式高度: 设置 h-[${targetH}px]`)
    } else {
      let newCls = cleanedCls
      if (available && currentH > available) {
        let targetH = Math.floor(available)
        if (miniThreshold > targetH) targetH = miniThreshold
        newCls = setChartHeightPx(cleanedCls, targetH)
        fixes.push(`[${elem.id}](${elem.component}) 图表高度 ${Math.floor(currentH)}px 溢出父容器: 缩小到 h-[${targetH}px]`)
      } else if (miniThreshold > currentH) {
        newCls = setChartHeightPx(cleanedCls, miniThreshold)
        fixes.push(`[${elem.id}](${elem.component}) ProcessChart 高度 ${currentH}px 低于 mini 阈值 ${dataLen}*38: 提升到 h-[${miniThreshold}px]`)
      } else if (cleanedCls !== cls) {
        fixes.push(`[${elem.id}](${elem.component}) 清理冲突高度类 (h-full 等)`)
      }
      if (newCls !== cls) setClassName(elem, newCls)
    }
  }
  return [json, fixes]
}
