import { type A2UIJson, type Fixer, resolveState } from "../../types"

/**
 * Ensures all chart data arrays use the required field names: { name, value }.
 *
 * Algorithm per data item:
 * 1. If no "value" field: find the best numeric field, rename to "value"
 * 2. If no "name" field: find a text field from remaining keys, rename to "name"
 * 3. If neither can be found: replace with default data
 */

const CHART_TYPES = new Set([
  "PieChart", "HillChart", "ProcessChart", "FunnelChart",
  "CircleProcessChart", "GaugeChart", "JadeJueChart",
])

const NON_VALUE_FIELDS = new Set([
  "rank", "id", "index", "key", "code", "level", "depth", "tier",
  "color", "icon", "image", "url", "link",
])

const NAME_HINTS = ["name", "label", "title", "text", "category", "type", "app", "device", "item", "product", "host", "service", "region", "zone", "status"]

const fix_chart_data: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []
  if (!json.state) return [json, fixes]

  for (const el of json.elements) {
    if (!CHART_TYPES.has(el.component as string)) continue
    const opt = el.props?.option
    if (!opt) continue

    const dataPath = opt.data?.path
    if (!dataPath) continue

    const data = resolveState(json.state, dataPath)

    // Non-array or empty: replace with default
    if (!Array.isArray(data) || data.length === 0) {
      const fallback = makeDefaultData(el.component)
      writeStatePath(json.state, dataPath, fallback)
      fixes.push(`[${el.id}] ${el.component} 数据为空或不合法，已替换为默认数据`)
      continue
    }

    let changed = false
    const detail: string[] = []

    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        // Primitive or null: normalize to {name, value}
        if (typeof item === "number") {
          data[i] = { name: `项${i + 1}`, value: item }
          changed = true
        } else {
          data[i] = { name: `项${i + 1}`, value: 0 }
          changed = true
        }
        continue
      }

      item = item as Record<string, any>

      // Step 1: ensure "value" — find numeric field
      if (!("value" in item) || typeof item.value !== "number") {
        const valueKey = pickValueField(item)
        if (valueKey) {
          item.value = item[valueKey]
          delete item[valueKey]
          changed = true
        } else {
          // No numeric field at all — replace whole item with default
          data[i] = { name: pickNameField(item) ?? `项${i + 1}`, value: 0 }
          changed = true
          continue
        }
      }

      // Step 2: ensure "name" — find text field from remaining keys
      if (!("name" in item) || item.name == null || item.name === "") {
        const nameKey = pickNameFieldKey(item)
        if (nameKey) {
          item.name = item[nameKey]
          if (nameKey !== "name") delete item[nameKey]
          changed = true
        } else {
          item.name = `项${i + 1}`
          changed = true
        }
      }
    }

    if (changed) {
      writeStatePath(json.state, dataPath, data)
      fixes.push(`[${el.id}] ${el.component} 数据字段修正: 确保 name + value`)
    }
  }

  return [json, fixes]
}

/** Pick the best numeric field to use as "value" */
function pickValueField(obj: Record<string, any>): string | null {
  const candidates: { key: string; priority: number }[] = []
  for (const key of Object.keys(obj)) {
    if (key === "name" || key === "value") continue
    if (NON_VALUE_FIELDS.has(key)) continue
    const v = obj[key]
    if (typeof v !== "number" || isNaN(v)) continue
    const lower = key.toLowerCase()
    let priority = 1
    if (lower.includes("value")) priority = 10
    else if (lower.includes("usage") || lower.includes("used")) priority = 9
    else if (lower.includes("count") || lower.includes("total") || lower.includes("sum")) priority = 8
    else if (lower.includes("amount") || lower.includes("size") || lower.includes("volume")) priority = 7
    else if (lower.includes("rate") || lower.includes("ratio") || lower.includes("percent")) priority = 6
    else if (lower.includes("num") || lower.includes("score")) priority = 5
    candidates.push({ key, priority })
  }
  if (candidates.length === 0) return null
  candidates.sort((a, b) => b.priority - a.priority)
  return candidates[0].key
}

/** Pick the best text field to use as "name" */
function pickNameFieldKey(obj: Record<string, any>): string | null {
  for (const hint of NAME_HINTS) {
    for (const key of Object.keys(obj)) {
      if (key === "value") continue
      if (key.toLowerCase() === hint && typeof obj[key] === "string" && obj[key].trim()) return key
    }
  }
  // Fallback: first string field that isn't value
  for (const key of Object.keys(obj)) {
    if (key === "value") continue
    const v = obj[key]
    if (typeof v === "string" && v.trim()) return key
  }
  return null
}

/** Get a display name from an object */
function pickNameField(obj: Record<string, any>): string | null {
  const key = pickNameFieldKey(obj)
  return key ? String(obj[key]) : null
}

function writeStatePath(state: any, path: string, value: any): void {
  const parts = path.trim().split("/").filter(Boolean)
  let cur = state
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur && typeof cur === "object" && parts[i] in cur) cur = cur[parts[i]]
    else return
  }
  const last = parts[parts.length - 1]
  if (cur && typeof cur === "object" && last in cur) cur[last] = value
}

const DEFAULT_DATASETS = [
  [{ name: "手机", value: 4200 }, { name: "电脑", value: 3100 }, { name: "平板", value: 1800 }, { name: "穿戴设备", value: 950 }, { name: "其他", value: 420 }],
  [{ name: "微信", value: 2869 }, { name: "支付宝", value: 1816 }, { name: "抖音", value: 1264 }, { name: "淘宝", value: 867 }, { name: "微博", value: 567 }],
  [{ name: "CPU使用率", value: 72 }, { name: "内存占用", value: 58 }, { name: "磁盘使用", value: 45 }, { name: "网络带宽", value: 33 }],
  [{ name: "北京", value: 8400 }, { name: "上海", value: 7200 }, { name: "深圳", value: 6100 }, { name: "广州", value: 5300 }, { name: "杭州", value: 4100 }],
  [{ name: "正常", value: 156 }, { name: "告警", value: 34 }, { name: "异常", value: 12 }, { name: "离线", value: 5 }],
]

let defaultIdx = 0

function makeDefaultData(component: string): any[] {
  return DEFAULT_DATASETS[defaultIdx++ % DEFAULT_DATASETS.length]
}

export default fix_chart_data
