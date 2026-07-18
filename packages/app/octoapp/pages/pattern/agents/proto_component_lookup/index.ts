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

  const componentNames = extractJson(result.text)
  if (!Array.isArray(componentNames)) {
    console.warn("----- 组件查询Agent返回非数组，尝试从文本提取 -----")
  }

  const returnValue = {
    component_names: Array.isArray(componentNames) ? componentNames : [],
    section_id: sectionId,
    element_id: elementId,
  }
  logAgentParsed(result.childSessionId, returnValue)
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
  return null
}

function buildHumanMessage(sectionId: string, elementId: string, layoutPlanner: any, intentDescription: any): string {
  let elements = layoutPlanner.elements ?? []
  let slotElement = elements.find((e: any) => e?.id === elementId) ?? {}
  let slotElementStr = JSON.stringify(slotElement, null, 2)

  let node = findNodeById(intentDescription, sectionId)
  let nodeStr = JSON.stringify(node, null, 2)

  return `请分析以下模块蓝图，确定需要哪些 A2UI 组件（不含 Section 和 Icon），输出一个 JSON 数组。

[模块顶层容器:] ==================================
- Root ID: ${elementId}
- Root UI:
  ${slotElementStr}

[需要被渲染的模块详细蓝图:] ==================================
${nodeStr}

规则：
- 如果蓝图的description中明确提到了组件名（如PatGauge、PatStackedBar、LineChart等），必须使用该组件名，不要替换为其他类似组件
- 例如：描述中写"PatGauge"就必须用"PatGauge"，不能用"GaugeChart"替代

请仔细分析蓝图，列出所有需要的组件名（排除 Section 和 Icon），只输出一个 JSON 数组，例如 ["Table", "Tabs", "Button"]。不要输出任何其他内容。`
}
