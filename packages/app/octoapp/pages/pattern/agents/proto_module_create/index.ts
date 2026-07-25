import { directLLMCall } from '../../utils/direct_llm_call'
import { logAgentParsed, logAgentStart, logAgentCall } from "../../utils/persist"

const AGENT_NAME = "proto_module_create";

type ProtoModuleCreateInput = {
  sdk: any
  sync: any
  modelKey: { providerID: string; modelID: string }
  rootSession: string
  userInput: string
  idPrefix: string
  sectionId: string
  elementId: string
  layoutPlanner: any
  intentDescription: any
  componentDocs?: string
  onSessionCreated?: (childSessionID: string) => void
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

export default async function proto_module_create(input: ProtoModuleCreateInput) {
  const {
    sdk,
    sync,
    modelKey,
    rootSession,
    userInput,
    idPrefix,
    sectionId,
    elementId,
    layoutPlanner,
    intentDescription,
    componentDocs,
    onSessionCreated,
    onDirectCallTiming,
    onReasoningDelta,
  } = input
  const humanMessage = buildHumanMessage(idPrefix, sectionId, elementId, layoutPlanner, intentDescription, userInput, componentDocs)

  const traceSessionId = `direct-${Date.now().toString(36)}`
  logAgentStart(AGENT_NAME, traceSessionId)

  console.log("----- 模块渲染Agent开始执行（直连LLM） -----")
  const startTime = Date.now()
  if (onDirectCallTiming) onDirectCallTiming({ agent: AGENT_NAME, startTime })
  const result = await directLLMCall({
    modelKey,
    agentName: AGENT_NAME,
    humanMessage,
    workflowId: rootSession,
    workDir: sdk.directory,
    onReasoningDelta,
  })
  const elapsedMs = Date.now() - startTime
  if (onDirectCallTiming) onDirectCallTiming({ agent: AGENT_NAME, startTime, endTime: Date.now() })
  console.log("----- 模块渲染Agent运行结束，耗时：", elapsedMs / 1000, 's -----')

  logAgentCall(AGENT_NAME, traceSessionId, humanMessage, result.parsed, [])

  const moduleJson = result.parsed
  if (!moduleJson) throw new Error("----- Module JSON did not return valid JSON -----")
  const returnValue = {
    "ui_json": moduleJson,
    "section_id": sectionId,
    "element_id": elementId,
    "id_prefix": idPrefix
  }
  logAgentParsed(traceSessionId, returnValue)
  return returnValue
}

// 组装模块生成的输入文本
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

function collectContainerTypeIds(root: any, sectionId: string): { regions: string[]; cards: string[] } {
  const node = findNodeById(root, sectionId)
  if (!node) return { regions: [], cards: [] }
  const regions: string[] = []
  const cards: string[] = []
  function walk(n: any) {
    if (!n) return
    if (n.containerType === "Region") regions.push(n.id)
    if (n.containerType === "Card") cards.push(n.id)
    if (Array.isArray(n.children)) {
      for (const child of n.children) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        walk(childNode)
      }
    }
    if (n.itemTemplate) walk(n.itemTemplate)
  }
  walk(node)
  return { regions, cards }
}

function buildHumanMessage(idPrefix: string, sectionId: string, elementId: string, layoutPlanner: any, intentDescription: any, rawUserInput: string, componentDocs?: string) {
  let elements = layoutPlanner.elements ?? [];
  let slotElement = elements.find((e: any) => e?.id === elementId) ?? {};
  let slotElemnetStr = JSON.stringify(slotElement, null, 2);

  let node = findNodeById(intentDescription, sectionId)
  let nodeStr = JSON.stringify(node, null, 2);

  let containerTypeIds = collectContainerTypeIds(intentDescription, sectionId)
  let containerTypeHint = ""
  if (containerTypeIds.regions.length > 0) {
    containerTypeHint += `\n  **⚠️ 蓝图中以下节点 containerType 为 Region，对应的element必须使用Section组件（自带bg-surface-container-highest+shadow-sm+rounded-xl+p-[1.5rem]，不要手动添加这些样式，不要用div替代）：${containerTypeIds.regions.join(", ")}**`
  }
  if (containerTypeIds.cards.length > 0) {
    containerTypeHint += `\n  **⚠️ 蓝图中以下节点 containerType 为 Card，对应的element必须使用Card组件（自带 bg-surface-container-highest+shadow-sm+rounded-xl+p-*）：${containerTypeIds.cards.join(", ")}**`
  }

  let annotationsHint = ""
  const nodeAnnotations: string[] = node?.annotations ?? []
  if (nodeAnnotations.includes("卡片")) {
    annotationsHint += `\n  **⚠️ 该模块标注了"卡片"，顶层容器必须使用 Card 组件（自带 bg-surface-container-highest+shadow-sm+rounded-xl+p-*）。**`
  }
  if (nodeAnnotations.includes("二级卡片")) {
    annotationsHint += `\n  **⚠️ 该模块标注了"二级卡片"，嵌套子卡片用 Card 组件 + bg-surface-variant rounded-[16px]，不用 shadow。**`
  }
  const collectAnnotationIds = (n: any, result: {id: string, annotations: string[]}[] = []): {id: string, annotations: string[]}[] => {
    if (!n) return result
    const ann: string[] = n.annotations ?? []
    if (ann.includes("卡片") || ann.includes("二级卡片")) result.push({ id: n.id, annotations: ann })
    if (Array.isArray(n.children)) {
      for (const child of n.children) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        collectAnnotationIds(childNode, result)
      }
    }
    if (n.itemTemplate) collectAnnotationIds(n.itemTemplate, result)
    return result
  }
  const childAnnotations = collectAnnotationIds(node).filter(a => a.id !== node?.id)
  if (childAnnotations.length > 0) {
    annotationsHint += `\n  **⚠️ 蓝图子节点标注约束：${childAnnotations.map(a => `${a.id} → [${a.annotations.join(", ")}]`).join("； ")}**`
  }

  let componentDocsSection = ""
  if (componentDocs) {
    componentDocsSection = `\n\n  [预加载文档（组件 API + 布局规则，无需调用工具）:] ==================================\n  ${componentDocs}\n\n  严格按照以上文档中的 API Schema、Example 和布局规则生成 JSON。严禁依靠记忆编造任何未在文档中出现的属性或违反布局规则。`
  }

  let humanMessage: string;
  humanMessage = `请为以下模块生成 A2UI JSON：

  [模块顶层容器:] ==================================
  - Root ID: ${elementId}
  - Root UI:
    ${slotElemnetStr}

  [需要被渲染的模块详细蓝图:] ==================================
  ${nodeStr}

  [需要被渲染模块的根节点:] ${elementId}
   [模块内部元素id前缀:] ${idPrefix} (注：该模块内所有 element id 必须以此开头)
  ${containerTypeHint}${annotationsHint}
  ${componentDocsSection}
  **CRITICAL — Path 语法约束：**
  - 数据绑定 path 禁止使用 ".."（目录回溯语法），如 "/menuItems/0/../8" 不会解析。
  - 两个不同区域引用同一数据源时（如"顶部 8 个图标"+"底部 2 个图标"），数据必须预先拆分为两个独立数组（如 topMenuItems / bottomMenuItems），分别绑定各自的 path。
  - 正确示例：{ "path": "/topMenuItems" } 和 { "path": "/bottomMenuItems" }
  - 错误示例：{ "path": "/menuItems/0/../8" }

  你的最终回复必须是一个纯 JSON 对象（以 { 开头，以 } 结尾），禁止输出思考过程、分析或任何自然语言。`;
  return humanMessage;
}
