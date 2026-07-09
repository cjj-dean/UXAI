import { homedir } from "os"
import path from "path"

type DesktopApi = {
  readFileBuffer?: (filePath: string) => Promise<ArrayBuffer | null>
}

function getDesktopApi(): DesktopApi | undefined {
  return (window as unknown as { api?: DesktopApi }).api
}

async function readFileViaApi(filePath: string): Promise<string | null> {
  const api = getDesktopApi()
  if (!api?.readFileBuffer) return null
  try {
    const buf = await api.readFileBuffer(filePath)
    if (!buf) return null
    return new TextDecoder().decode(buf)
  } catch {
    return null
  }
}

type JsonSchema = Record<string, unknown>

const COMPONENT_CHILDREN: Record<string, string[]> = {
  Tabs: ["TabItem"],
  Steps: ["StepItem"],
  Table: ["TableRow"],
  Collapse: ["CollapseItem"],
  Timeline: ["TimelineItem"],
}

const COMPONENT_CATALOG: Record<string, string[]> = {
  Layout: ["Section"],
  General: ["Button", "Icon"],
  Navigation: ["Tabs", "TabItem", "Steps", "StepItem", "Breadcrumb", "Dropdown", "Menu"],
  DataEntry: ["Checkbox", "CheckboxGroup", "RadioGroup", "Select", "Slider", "Switch", "Input", "InputNumber", "TextArea", "TimePicker", "DatePicker", "Rate"],
  DataDisplay: ["Tag", "Table", "TableRow", "Collapse", "CollapseItem", "Timeline", "TimelineItem", "Divider", "Badge", "Carousel", "Segmented", "Tree"],
  Response: ["Progress"],
  Chart: ["LineChart", "BarChart", "PieChart", "RadarChart", "GaugeChart", "ProcessChart", "BubbleChart", "AssembleBubbleChart", "BulletChart", "FunnelChart", "HillChart", "ScatterChart", "JadeJueChart", "CircleProcessChart"],
  Custom: ["PatGauge", "PatStackedBar"],
}

const ALL_COMPONENTS = Object.values(COMPONENT_CATALOG).flat()

function expandComponents(input: string[]): string[] {
  const expanded = [...input]
  for (const comp of input) {
    const children = COMPONENT_CHILDREN[comp] ?? []
    for (const child of children) {
      if (!expanded.includes(child)) expanded.push(child)
    }
  }
  return expanded
}

function refName(ref: string): string {
  const parts = ref.split("/")
  return parts[parts.length - 1] ?? ref
}

function getDefs(schema: JsonSchema): Record<string, JsonSchema> {
  return (schema.$defs as Record<string, JsonSchema>) ?? (schema.definitions as Record<string, JsonSchema>) ?? {}
}

function formatEnum(schema: JsonSchema): string {
  const values = schema.enum as unknown[]
  if (!values) return ""
  return values.map((v) => (typeof v === "string" ? `"${v}"` : String(v))).join(" | ")
}

function formatType(schema: JsonSchema, defs: Record<string, JsonSchema>, sharedDefs: Record<string, JsonSchema>, visited: Set<string>): string {
  if (!schema) return "any"
  if (schema.$ref) {
    const name = refName(schema.$ref as string)
    if (sharedDefs[name]) return name
    if (visited.has(name)) return name
    const defn = defs[name]
    if (!defn) return name
    const newVisited = new Set(visited)
    newVisited.add(name)
    return formatType(defn, defs, sharedDefs, newVisited)
  }
  if (schema.oneOf) return (schema.oneOf as JsonSchema[]).map((opt) => formatType(opt, defs, sharedDefs, visited)).join(" | ")
  if (schema.anyOf) return (schema.anyOf as JsonSchema[]).map((opt) => formatType(opt, defs, sharedDefs, visited)).join(" | ")
  if (schema.enum) return formatEnum(schema)
  if (schema.type === "array") {
    const items = schema.items as JsonSchema | undefined
    const itemType = items ? formatType(items, defs, sharedDefs, visited) : "any"
    return `${itemType}[]`
  }
  if (schema.type === "object") {
    const props = (schema.properties ?? {}) as Record<string, JsonSchema>
    if (Object.keys(props).length === 0) return "object"
    const required = (schema.required as string[]) ?? []
    const entries = Object.entries(props).map(([key, val]) => {
      const mark = required.includes(key) ? "" : "?"
      const typeStr = formatType(val, defs, sharedDefs, visited)
      return `\`${key}${mark}\`: ${typeStr}`
    })
    return `{ ${entries.join(", ")} }`
  }
  if (schema.type) {
    if (Array.isArray(schema.type)) return (schema.type as string[]).join(" | ")
    return schema.type as string
  }
  return "any"
}

function buildSharedHeader(sharedDefs: Record<string, JsonSchema>): string {
  if (Object.keys(sharedDefs).length === 0) return ""
  const lines: string[] = ["## Shared Definitions", "以下类型定义被组件复用，属性类型标注为这些名称时参照此定义："]
  for (const [name, defn] of Object.entries(sharedDefs)) {
    const desc = defn.description ? defn.description as string : ""
    lines.push("")
    lines.push(`### ${name}`)
    if (desc) lines.push(`> ${desc}`)
    if (defn.type === "object" && defn.properties) {
      const defRequired = new Set((defn.required as string[]) ?? [])
      for (const [pname, pschema] of Object.entries(defn.properties as Record<string, JsonSchema>)) {
        const pdesc = pschema.description ? pschema.description as string : ""
        const opt = defRequired.has(pname) ? "" : "?"
        const examples = (pschema as any).examples as unknown[] | undefined
        const exStr = examples ? ` (e.g., ${examples.map(String).join(", ")})` : ""
        lines.push(`- \`${pname}${opt}\`: ${pschema.type ?? "any"}${exStr}${pdesc ? ` — ${pdesc}` : ""}`)
      }
    } else if (defn.type === "array" && defn.items) {
      const items = defn.items as JsonSchema
      const itemType = items.type ?? "any"
      const itemDesc = items.description ? items.description as string : ""
      lines.push(`类型: ${itemType}[]${itemDesc ? ` — ${itemDesc}` : ""}`)
    } else {
      const typeStr = formatType(defn, sharedDefs, {}, new Set())
      lines.push(`类型: ${typeStr}`)
    }
  }
  return lines.join("\n")
}

function compactSchema(schema: JsonSchema, sharedDefs: Record<string, JsonSchema>): string {
  const defs = getDefs(schema)
  const name = (schema.name as string) ?? (schema.title as string) ?? "Unknown"
  const desc = (schema.description as string) ?? ""
  const properties = (schema.properties ?? {}) as Record<string, JsonSchema>
  const lines: string[] = []
  lines.push(`## ${name}`)
  if (desc) lines.push(`> ${desc}`)
  const compConst = (properties.component as JsonSchema)?.const ?? name
  const topParts: string[] = []
  topParts.push("id: string")
  topParts.push(`component: "${compConst}"`)
  const hasProps = "props" in properties
  const hasChildren = "children" in properties
  if (hasProps) topParts.push("props: object")
  if (hasChildren) topParts.push("children: object")
  lines.push("> " + topParts.join(" | "))
  if (hasProps) {
    const propsSchema = properties.props
    const propsProps = (propsSchema.properties ?? {}) as Record<string, JsonSchema>
    const propsRequired = new Set((propsSchema.required as string[]) ?? [])
    lines.push("")
    lines.push("### props")
    for (const [pname, pschema] of Object.entries(propsProps)) {
      const pdesc = pschema.description ? pschema.description as string : ""
      const deflt = pschema.default !== undefined ? ` (default: ${JSON.stringify(pschema.default)})` : ""
      const opt = propsRequired.has(pname) ? "" : "?"
      if (pschema.type === "object" && pschema.properties) {
        lines.push(`- \`${pname}${opt}\`:` + (pdesc ? ` — ${pdesc}` : ""))
        const nestedReq = new Set((pschema.required as string[]) ?? [])
        for (const [nk, nv] of Object.entries(pschema.properties as Record<string, JsonSchema>)) {
          const nt = formatType(nv, defs, sharedDefs, new Set())
          const nd = nv.description ? nv.description as string : ""
          const nopt = nestedReq.has(nk) ? "" : "?"
          const ndef = (nv as any).default !== undefined ? ` (default: ${JSON.stringify((nv as any).default)})` : ""
          lines.push(`  - \`${nk}${nopt}\`: ${nt}${ndef}${nd ? ` — ${nd}` : ""}`)
        }
      } else {
        const typeStr = formatType(pschema, defs, sharedDefs, new Set())
        let line = `- \`${pname}${opt}\`: ${typeStr}${deflt}`
        if (pdesc) line += ` — ${pdesc}`
        lines.push(line)
      }
    }
  }
  if (hasChildren) {
    const childrenSchema = properties.children
    const childrenDesc = childrenSchema.description ? childrenSchema.description as string : ""
    lines.push("")
    lines.push("### children")
    if (childrenSchema.$ref) {
      const ref = refName(childrenSchema.$ref as string)
      if (sharedDefs[ref]) lines.push(`类型: ${ref}`)
      else if (defs[ref]) lines.push(`类型: ${formatType(defs[ref], defs, sharedDefs, new Set())}`)
      else lines.push(`类型: ${ref}`)
    } else {
      lines.push(`类型: ${formatType(childrenSchema, defs, sharedDefs, new Set())}`)
    }
    if (childrenDesc) lines.push(`> ${childrenDesc}`)
  }
  return lines.join("\n")
}

function compactSchemasBatch(schemas: JsonSchema[]): string {
  const sharedDefs: Record<string, JsonSchema> = {}
  for (const schema of schemas) {
    const defs = getDefs(schema)
    for (const [name, defn] of Object.entries(defs)) {
      if (!sharedDefs[name]) sharedDefs[name] = defn
    }
  }
  const parts: string[] = []
  const header = buildSharedHeader(sharedDefs)
  if (header) parts.push(header)
  for (const schema of schemas) parts.push(compactSchema(schema, sharedDefs))
  return parts.join("\n\n---\n\n")
}

export async function loadComponentsDocsDirect(componentNames: string[]): Promise<string> {
  if (componentNames.length === 0) return ""

  const expanded = expandComponents(componentNames)
  const validComps = expanded.filter((c) => ALL_COMPONENTS.includes(c))
  if (validComps.length === 0) return ""

  const configDir = path.join(homedir(), ".config", "octo")
  const apiDir = path.join(configDir, "components", "api")
  const exampleDir = path.join(configDir, "components", "example")

  const categoryMap: Record<string, string> = {}
  for (const [category, comps] of Object.entries(COMPONENT_CATALOG)) {
    for (const comp of comps) categoryMap[comp] = category
  }

  const apiSchemas: JsonSchema[] = []
  for (const comp of validComps) {
    const category = categoryMap[comp]
    if (!category) continue
    const raw = await readFileViaApi(path.join(apiDir, category, `${comp}.json`))
    if (!raw) continue
    try {
      apiSchemas.push(JSON.parse(raw))
    } catch {}
  }

  const resultParts: string[] = []
  if (apiSchemas.length > 0) {
    resultParts.push(`# 组件 API Schema\n\n${compactSchemasBatch(apiSchemas)}`)
  }

  for (const comp of validComps) {
    const category = categoryMap[comp]
    if (!category) continue
    const content = await readFileViaApi(path.join(exampleDir, category, `${comp}.md`))
    if (content) resultParts.push(content)
  }

  return resultParts.join("\n\n---\n\n")
}
