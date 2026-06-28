import { type A2UIJson, type Fixer, resolveState } from "../../types"

const ALLOWED_COLORS: Record<string, [number, number, number]> = {
  success: [9, 170, 113],
  processing: [0, 103, 209],
  error: [224, 33, 40],
  default: [144, 147, 153],
  warning: [252, 200, 0],
  "#0067D1": [0, 103, 209],
  "#d4f0f4": [212, 240, 244],
  "#dff4cc": [223, 244, 204],
  "#fef0fd": [254, 240, 253],
  "#fee5f2": [254, 229, 242],
}

const CSS_NAMED_COLORS: Record<string, string> = {
  black: "#000000", white: "#FFFFFF", red: "#FF0000", green: "#008000",
  blue: "#0000FF", yellow: "#FFFF00", orange: "#FFA500", purple: "#800080",
  pink: "#FFC0CB", cyan: "#00FFFF", magenta: "#FF00FF", teal: "#008080",
  navy: "#000080", maroon: "#800000", olive: "#808000", silver: "#C0C0C0",
  gray: "#808080", grey: "#808080", lime: "#00FF00", indigo: "#4B0082",
  violet: "#EE82EE", brown: "#A52A2A", crimson: "#DC143C", coral: "#FF7F50",
  salmon: "#FA8072", tomato: "#FF6347", gold: "#FFD700", darkred: "#8B0000",
  orangered: "#FF4500", darkorange: "#FF8C00", darkblue: "#00008B",
  royalblue: "#4169E1", dodgerblue: "#1E90FF", steelblue: "#4682B4",
  forestgreen: "#228B22", seagreen: "#2E8B57", springgreen: "#00FF7F",
  darkgreen: "#006400", limegreen: "#32CD32", mediumseagreen: "#3CB371",
  indianred: "#CD5C5C", firebrick: "#B22222", darkviolet: "#9400D3",
  blueviolet: "#8A2BE2", mediumpurple: "#9370DB", rebeccapurple: "#663399",
  darkmagenta: "#8B008B", mediumvioletred: "#C71585", deeppink: "#FF1493",
  hotpink: "#FF69B4", lightpink: "#FFB6C1", chocolate: "#D2691E",
  peru: "#CD853F", tan: "#D2B48C", darkgray: "#A9A9A9",
  lightslategray: "#778899", slategray: "#708090",
}

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.replace("#", "").trim()
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) ? null : [r, g, b]
}

function parseColor(input: string): [number, number, number] | null {
  const t = input.trim().toLowerCase()
  if (t.startsWith("#")) return parseHex(t)
  const m = t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
  if (CSS_NAMED_COLORS[t]) return parseHex(CSS_NAMED_COLORS[t])
  return null
}

function nearestAllowed(input: string): string | null {
  const rgb = parseColor(input)
  if (!rgb) return null
  let best: { name: string, dist: number } | null = null
  for (const [name, token] of Object.entries(ALLOWED_COLORS)) {
    const dist = (rgb[0] - token[0]) ** 2 + (rgb[1] - token[1]) ** 2 + (rgb[2] - token[2]) ** 2
    if (!best || dist < best.dist) best = { name, dist }
  }
  return best?.name ?? null
}

function isAllowed(input: string): boolean {
  return input in ALLOWED_COLORS
}

function collectTagColorPaths(json: A2UIJson): Set<string> {
  const paths = new Set<string>()
  for (const elem of json.elements) {
    if (elem.component !== "Tag") continue
    const color = elem.props?.color
    if (color && typeof color === "object" && typeof color.path === "string") {
      paths.add(color.path)
    }
  }
  return paths
}

function fixStateValues(obj: any, keyName: string, pathPrefix: string, fixes: string[]): void {
  if (!obj || typeof obj !== "object") return
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "string") {
        if (isAllowed(obj[i])) continue
        const replacement = nearestAllowed(obj[i])
        if (!replacement || replacement === obj[i]) continue
        const old = obj[i]
        obj[i] = replacement
        fixes.push(`state ${pathPrefix}[${i}].${keyName}: ${old} → ${replacement}`)
      } else if (obj[i] && typeof obj[i] === "object") {
        fixStateValues(obj[i], keyName, `${pathPrefix}[${i}]`, fixes)
      }
    }
  } else {
    for (const [k, v] of Object.entries(obj)) {
      if (k === keyName && typeof v === "string") {
        if (isAllowed(v)) continue
        const replacement = nearestAllowed(v)
        if (!replacement || replacement === v) continue
        obj[k] = replacement
        fixes.push(`state ${pathPrefix}/${k}: ${v} → ${replacement}`)
      } else if (v && typeof v === "object") {
        fixStateValues(v, keyName, `${pathPrefix}/${k}`, fixes)
      }
    }
  }
}

export const fixTagColors: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    if (elem.component !== "Tag") continue
    const color = elem.props?.color
    if (!color) continue

    if (typeof color === "string") {
      if (isAllowed(color)) continue
      const replacement = nearestAllowed(color)
      if (!replacement || replacement === color) continue
      elem.props!.color = replacement
      fixes.push(`[${elem.id}](Tag) color: ${color} → ${replacement}`)
    } else if (color && typeof color === "object" && typeof color.path === "string") {
      const path = color.path
      if (path.startsWith("/")) {
        const stateVal = resolveState(json.state, path)
        if (typeof stateVal === "string" && !isAllowed(stateVal)) {
          const replacement = nearestAllowed(stateVal)
          if (replacement && replacement !== stateVal) {
            const parts = path.split("/").filter(Boolean)
            let cur: any = json.state
            for (let i = 0; i < parts.length - 1; i++) {
              if (!cur || typeof cur !== "object") { cur = null; break }
              cur = cur[parts[i]]
            }
            if (cur && typeof cur === "object") {
              const last = parts[parts.length - 1]
              cur[last] = replacement
              fixes.push(`[${elem.id}](Tag) color state${path}: ${stateVal} → ${replacement}`)
            }
          }
        }
      } else {
        const keyName = path.split("/").pop() ?? path
        fixStateValues(json.state, keyName, "", fixes)
      }
    }
  }

  return [json, fixes]
}
