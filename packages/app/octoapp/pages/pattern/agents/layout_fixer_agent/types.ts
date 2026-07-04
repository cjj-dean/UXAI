export type A2UIJson = {
  rootId?: string
  elements: A2UIElement[]
  state?: Record<string, any>
}

export type A2UIElement = {
  id: string
  component: string
  props?: Record<string, any>
  children?: any
}

export type Fixer = (json: A2UIJson) => [A2UIJson, string[]]

export const PADDING_RE = /\bp(?:x|y|t|b|l|r)?-(?:\[[^\]]+\]|\S+)/g

export function tokens(className: string | undefined): string[] {
  return (className ?? "").split(/\s+/).filter(Boolean)
}

export function elemMap(elements: A2UIElement[]): Record<string, A2UIElement> {
  const m: Record<string, A2UIElement> = {}
  for (const e of elements) if (e.id) m[e.id] = e
  return m
}

export function childToParent(elements: A2UIElement[]): Record<string, string> {
  const m: Record<string, string> = {}
  for (const e of elements) {
    if (Array.isArray(e.children)) {
      for (const c of e.children) {
        if (typeof c === "string") m[c] = e.id
      }
    }
  }
  return m
}

export function getClassName(elem: A2UIElement): string {
  const cls = elem.props?.className
  return typeof cls === "string" ? cls : ""
}

export function setClassName(elem: A2UIElement, cls: string) {
  if (!elem.props) elem.props = {}
  elem.props.className = cls
}

export function removePadding(cls: string): string {
  return cls.replace(PADDING_RE, "").replace(/\s+/g, " ").trim()
}

export function resolveState(state: any, path: string): any {
  if (!path) return null
  let cur = state
  for (const part of path.trim().split("/").filter(Boolean)) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = cur[part]
    } else if (Array.isArray(cur)) {
      const idx = parseInt(part)
      if (!isNaN(idx) && idx >= 0 && idx < cur.length) cur = cur[idx]
      else return null
    } else {
      return null
    }
  }
  if (Array.isArray(cur) && cur.length === 1) {
    const parent = resolveState(state, path.split("/").slice(0, -1).join("/"))
    const countKey = `_${path.split("/").pop()}_count`
    if (parent && typeof parent === "object" && typeof parent[countKey] === "number" && parent[countKey] > 1) {
      const sample = cur[0]
      const count = parent[countKey] as number
      const expanded = []
      for (let i = 0; i < count; i++) {
        expanded.push(i === 0 ? sample : JSON.parse(JSON.stringify(sample)))
      }
      return expanded
    }
  }
  return cur
}
