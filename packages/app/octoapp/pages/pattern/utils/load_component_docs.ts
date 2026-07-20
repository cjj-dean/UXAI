const COMPONENT_CATALOG: Record<string, string[]> = {
  Layout: ["Section", "three-column-center"],
  General: ["Button", "Icon"],
  Navigation: ["Tabs", "TabItem", "Steps", "StepItem", "Breadcrumb", "Dropdown", "Menu"],
  DataEntry: ["Checkbox", "CheckboxGroup", "RadioGroup", "Select", "Slider", "Switch", "Input", "InputNumber", "TextArea", "TimePicker", "DatePicker", "Rate"],
  DataDisplay: ["Tag", "Table", "TableRow", "Collapse", "CollapseItem", "Timeline", "TimelineItem", "Divider", "Badge", "Carousel", "Segmented", "Tree"],
  Response: ["Progress"],
  Chart: ["LineChart", "BarChart", "PieChart", "RadarChart", "GaugeChart", "ProcessChart", "BubbleChart", "AssembleBubbleChart", "BulletChart", "FunnelChart", "HillChart", "ScatterChart", "JadeJueChart", "CircleProcessChart"],
  Custom: ["PatGauge", "PatStackedBar"],
}

const COMPONENT_TO_CATEGORY: Record<string, string> = {}
for (const [category, comps] of Object.entries(COMPONENT_CATALOG)) {
  for (const comp of comps) COMPONENT_TO_CATEGORY[comp] = category
}

const LAYOUT_PATTERNS = COMPONENT_CATALOG.Layout.filter(c => c !== "Section")

const COMPONENT_CHILDREN: Record<string, string[]> = {
  Tabs: ["TabItem"],
  Steps: ["StepItem"],
  Table: ["TableRow"],
  Collapse: ["CollapseItem"],
  Timeline: ["TimelineItem"],
}

const USAGE_ALIASES: Record<string, string> = {
  LineChart: "Chart", BarChart: "Chart", PieChart: "Chart", RadarChart: "Chart",
  GaugeChart: "Chart", ProcessChart: "Chart", BubbleChart: "Chart", AssembleBubbleChart: "Chart",
  BulletChart: "Chart", FunnelChart: "Chart", HillChart: "Chart", ScatterChart: "Chart",
  JadeJueChart: "Chart", CircleProcessChart: "Chart",
  img: "Image",
}

const PRELOADED_COMPONENTS = ["Section", "Icon"]

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

const apiModules = import.meta.glob<{ default: string }>(
  "../../../../../opencode/src/tool/proto_tool/components/api/**/*.json",
  { query: "?raw", import: "default", eager: false },
)

const exampleModules = import.meta.glob<{ default: string }>(
  "../../../../../opencode/src/tool/proto_tool/components/example/**/*.md",
  { query: "?raw", import: "default", eager: false },
)

const layoutModules = import.meta.glob<{ default: string }>(
  "../../../../../opencode/src/tool/proto_tool/components/api/Layout/*.md",
  { query: "?raw", import: "default", eager: false },
)

const usageModules = import.meta.glob<{ default: string }>(
  "../../../../../opencode/src/tool/proto_tool/components/usage/*.md",
  { query: "?raw", import: "default", eager: false },
)

async function loadGlobModule(modules: Record<string, () => Promise<{ default: string }>>, globPath: string): Promise<string | null> {
  const loader = modules[globPath]
  if (!loader) return null
  const mod = await loader()
  return typeof mod === "string" ? mod : mod.default
}

type JsonSchema = Record<string, unknown>

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

  if (schema.oneOf) {
    return (schema.oneOf as JsonSchema[]).map((opt) => formatType(opt, defs, sharedDefs, visited)).join(" | ")
  }
  if (schema.anyOf) {
    return (schema.anyOf as JsonSchema[]).map((opt) => formatType(opt, defs, sharedDefs, visited)).join(" | ")
  }

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
  const lines: string[] = ["## Shared Definitions"]
  lines.push("以下类型定义被组件复用，属性类型标注为这些名称时参照此定义：")

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
        if (pdesc || exStr) {
          lines.push(`- \`${pname}${opt}\`: ${pschema.type ?? "any"}${exStr} — ${pdesc}`)
        } else {
          lines.push(`- \`${pname}${opt}\`: ${pschema.type ?? "any"}`)
        }
      }
    } else if (defn.type === "array" && defn.items) {
      const items = defn.items as JsonSchema
      const itemType = items.type ?? "any"
      const itemDesc = items.description ? items.description as string : ""
      if (itemDesc) {
        lines.push(`类型: ${itemType}[] — ${itemDesc}`)
      } else {
        lines.push(`类型: ${itemType}[]`)
      }
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
          if (nd) {
            lines.push(`  - \`${nk}${nopt}\`: ${nt}${ndef} — ${nd}`)
          } else {
            lines.push(`  - \`${nk}${nopt}\`: ${nt}${ndef}`)
          }
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
      if (sharedDefs[ref]) {
        lines.push(`类型: ${ref}`)
      } else if (defs[ref]) {
        const refDef = defs[ref]
        const typeStr = formatType(refDef, defs, sharedDefs, new Set())
        lines.push(`类型: ${typeStr}`)
      } else {
        lines.push(`类型: ${ref}`)
      }
    } else {
      const typeStr = formatType(childrenSchema, defs, sharedDefs, new Set())
      lines.push(`类型: ${typeStr}`)
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

  for (const schema of schemas) {
    parts.push(compactSchema(schema, sharedDefs))
  }

  return parts.join("\n\n---\n\n")
}

export async function loadLayoutRules(layoutPatterns: string[]): Promise<string> {
  if (!layoutPatterns || layoutPatterns.length === 0) return ""

  const parts: string[] = []

  for (const pattern of layoutPatterns) {
    if (!LAYOUT_PATTERNS.includes(pattern)) {
      console.warn(`[loadLayoutRules] 布局模式 [${pattern}] 未注册，已跳过`)
      continue
    }
    const content = await loadGlobModule(layoutModules, `../../../../../opencode/src/tool/proto_tool/components/api/Layout/${pattern}.md`)
    if (content) {
      parts.push(content)
      console.log(`[loadLayoutRules] 布局规则 [${pattern}] 加载成功，长度: ${content.length}`)
    } else {
      console.warn(`[loadLayoutRules] 布局规则 [${pattern}] 文件不存在`)
    }
  }

  return parts.join("\n\n---\n\n")
}

export async function loadPreloadedUsage(): Promise<string> {
  const parts: string[] = []
  for (const comp of PRELOADED_COMPONENTS) {
    const content = await loadGlobModule(usageModules, `../../../../../opencode/src/tool/proto_tool/components/usage/${comp}.md`)
    if (!content) continue
    console.log(`[loadPreloadedUsage] 预加载组件 [${comp}] Usage 文件读取成功，长度: ${content.length}`)
    parts.push(content)
  }
  return parts.join("\n\n---\n\n")
}

export async function loadComponentDocs(componentNames: string[]): Promise<string> {
  if (!componentNames || componentNames.length === 0) {
    console.log("[loadComponentDocs] componentNames 为空，跳过")
    return ""
  }

  console.log("[loadComponentDocs] 开始加载组件文档，组件列表:", componentNames)

  const expanded = expandComponents(componentNames)
  console.log("[loadComponentDocs] expandComponents 后:", expanded)

  const validComps: string[] = []
  const apiSchemas: JsonSchema[] = []

  for (const comp of expanded) {
    if (!COMPONENT_TO_CATEGORY[comp]) {
      console.warn(`[loadComponentDocs] 组件 [${comp}] 未在 CATALOG 注册，已过滤`)
      continue
    }
    validComps.push(comp)

    const category = COMPONENT_TO_CATEGORY[comp] ?? ""
    const globPath = category
      ? `../../../../../opencode/src/tool/proto_tool/components/api/${category}/${comp}.json`
      : `../../../../../opencode/src/tool/proto_tool/components/api/${comp}.json`
    const raw = await loadGlobModule(apiModules, globPath)
    if (!raw) {
      console.warn(`[loadComponentDocs] 组件 [${comp}] 在 API 目录下找不到文件: ${globPath}`)
      continue
    }
    console.log(`[loadComponentDocs] 组件 [${comp}] API 文件读取成功，长度: ${raw.length}`)
    apiSchemas.push(JSON.parse(raw))
  }

  const resultParts: string[] = []

  if (apiSchemas.length > 0) {
    const compactMd = compactSchemasBatch(apiSchemas)
    resultParts.push(`# 组件 API Schema\n\n${compactMd}`)
  }

  for (const comp of validComps) {
    const category = COMPONENT_TO_CATEGORY[comp] ?? ""
    const globPath = category
      ? `../../../../../opencode/src/tool/proto_tool/components/example/${category}/${comp}.md`
      : `../../../../../opencode/src/tool/proto_tool/components/example/${comp}.md`
    const content = await loadGlobModule(exampleModules, globPath)
    if (!content) continue
    console.log(`[loadComponentDocs] 组件 [${comp}] Example 文件读取成功，长度: ${content.length}`)
    resultParts.push(content)
  }

  const usageLoaded = new Set<string>()
  for (const comp of [...PRELOADED_COMPONENTS, ...expanded, ...validComps]) {
    const usageName = USAGE_ALIASES[comp] ?? comp
    if (usageLoaded.has(usageName)) continue
    const content = await loadGlobModule(usageModules, `../../../../../opencode/src/tool/proto_tool/components/usage/${usageName}.md`)
    if (!content) continue
    usageLoaded.add(usageName)
    console.log(`[loadComponentDocs] 组件 [${comp}] Usage 文件读取成功 (${usageName}.md)，长度: ${content.length}`)
    resultParts.push(content)
  }

  const result = resultParts.join("\n\n---\n\n")
  console.log(`[loadComponentDocs] 完成，最终文档长度: ${result.length}, validComps: [${validComps.join(", ")}]`)
  return result
}
