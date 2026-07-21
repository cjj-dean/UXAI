import { runChildSession } from "../run_child_session"
import { logAgentParsed } from "../../utils/persist"
import { extractJson } from '../../utils/json_parser'

const AGENT_NAME = "proto_component_lookup"

type ProtoComponentLookupInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  sectionId: string
  elementId: string
  layoutPlanner: any
  intentDescription: any
  onSessionCreated?: (childSessionID: string) => void
}

export default async function proto_component_lookup(input: ProtoComponentLookupInput) {
  const {
    sdk,
    sync,
    modelKey,
    rootSession,
    sectionId,
    elementId,
    layoutPlanner,
    intentDescription,
    onSessionCreated,
  } = input

  const humanMessage = buildHumanMessage(sectionId, elementId, layoutPlanner, intentDescription)

  console.log("----- 组件查询Agent开始执行 -----")
  const startTime = Date.now()

  const result = await runChildSession({
    client: sdk.client,
    directory: sdk.directory,
    parentSessionID: rootSession,
    agent: AGENT_NAME,
    modelKey,
    prompt: humanMessage,
    sync,
    onSessionCreated,
  })

  console.log("----- 组件查询Agent运行结束，耗时：", (Date.now() - startTime) / 1000, "s -----")

  const parsed = extractJson(result.text)
  let componentNames: string[] = []
  let layoutPatterns: string[] = []

  if (Array.isArray(parsed)) {
    componentNames = parsed
  } else if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.component_names)) componentNames = parsed.component_names
    if (Array.isArray(parsed.layout_patterns)) layoutPatterns = parsed.layout_patterns
  } else {
    console.warn("----- 组件查询Agent返回非数组/非对象，尝试从文本提取 -----")
  }

  if (sectionId === "header") {
    if (!componentNames.includes("Menu")) componentNames.push("Menu")
    componentNames = componentNames.filter(c => c !== "Tabs" && c !== "TabItem")
    if (!layoutPatterns.includes("three-column-center")) layoutPatterns.push("three-column-center")
  }
  if (sectionId === "aside") {
    if (!componentNames.includes("Menu")) componentNames.push("Menu")
    componentNames = componentNames.filter(c => c !== "Collapse" && c !== "CollapseItem")
  }

  const annotationComponents = collectAnnotationComponents(intentDescription, sectionId)
  for (const comp of annotationComponents) {
    if (!componentNames.includes(comp)) componentNames.push(comp)
  }

  const returnValue = {
    component_names: componentNames,
    layout_patterns: layoutPatterns,
    section_id: sectionId,
    element_id: elementId,
  }
  logAgentParsed(result.childSessionId, returnValue)
  console.log("----- 组件查询Agent结果（后处理后）：", JSON.stringify(returnValue))
  return returnValue
}

function findNodeById(node: any, id: string): any {
  if (!node) return null
  if (node.id === id) return node
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
      const found = findNodeById(childNode, id)
      if (found) return found
    }
  }
  if (node.itemTemplate) {
    const found = findNodeById(node.itemTemplate, id)
    if (found) return found
  }
  return null
}

const ANNOTATION_COMPONENT_MAP: Record<string, string> = {
  "卡片": "Card",
  "二级卡片": "Card",
}

function collectAnnotationComponents(intentDescription: any, sectionId: string): string[] {
  const node = findNodeById(intentDescription, sectionId)
  if (!node) return []
  const components: string[] = []
  const seen = new Set<string>()
  const walk = (n: any) => {
    if (!n) return
    const annotations: string[] = n.annotations ?? []
    for (const ann of annotations) {
      const comp = ANNOTATION_COMPONENT_MAP[ann]
      if (comp && !seen.has(comp)) {
        seen.add(comp)
        components.push(comp)
      }
    }
    if (Array.isArray(n.children)) {
      for (const child of n.children) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        walk(childNode)
      }
    }
    if (n.itemTemplate) walk(n.itemTemplate)
  }
  walk(node)
  return components
}

function buildHumanMessage(sectionId: string, elementId: string, layoutPlanner: any, intentDescription: any): string {
  let elements = layoutPlanner.elements ?? []
  let slotElement = elements.find((e: any) => e?.id === elementId) ?? {}
  let slotElementStr = JSON.stringify(slotElement, null, 2)

  let node = findNodeById(intentDescription, sectionId)
  let nodeStr = JSON.stringify(node, null, 2)

  return `请分析以下模块蓝图，确定需要哪些 A2UI 组件（不含 Section 和 Icon）以及适用的布局模式，输出一个 JSON 对象。

[模块顶层容器:] ==================================
- Root ID: ${elementId}
- Root UI:
  ${slotElementStr}

[需要被渲染的模块详细蓝图:] ==================================
${nodeStr}

规则：
- 如果蓝图的description中明确提到了组件名（如PatGauge、PatStackedBar、LineChart等），必须使用该组件名，不要替换为其他类似组件
- 例如：描述中写"PatGauge"就必须用"PatGauge"，不能用"GaugeChart"替代
- 当蓝图描述的布局结构匹配布局模式词汇时，必须在layout_patterns中输出

请仔细分析蓝图，输出 JSON 对象，格式如下：
{"component_names": ["Table", "Tabs", "Button"], "layout_patterns": ["three-column-center"]}
如果无布局模式匹配，layout_patterns 输出空数组 []。不要输出任何其他内容。`
}
