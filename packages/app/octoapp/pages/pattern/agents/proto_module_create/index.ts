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
function buildHumanMessage(idPrefix: string, sectionId: string, elementId: string, layoutPlanner: any, intentDescription: any, rawUserInput: string, componentDocs?: string) {
  let layoutDesc = intentDescription.layoutDescription ?? "";
  let sections = intentDescription.sections ?? [];
  let sectionsStr = JSON.stringify(sections, null, 2);

  // 布局规划
  let elements = layoutPlanner.elements ?? [];
  let slotElement = elements.find((e: any) => e?.id === elementId) ?? {};
  let slotElemnetStr = JSON.stringify(slotElement, null, 2);

  // 该模块详细意图
  let sectionDetailList = intentDescription.sectionDetailList ?? [];
  let sectionDetail = sectionDetailList.find((item: any) => item?.id === sectionId) ?? {};
  let sectionDetailStr = JSON.stringify(sectionDetail, null, 2);

  // 提取 constraints 高亮显示，确保模型不遗漏
  let constraints = sectionDetail.constraints ?? [];
  let constraintsStr = constraints.length
    ? constraints.map((c: any) => `${c.type}:${c.value} (${c.description})`).join("; ")
    : "无";

  let componentDocsSection = ""
  if (componentDocs) {
    componentDocsSection = `\n\n  [组件 API 文档（已预加载，无需调用工具）:] ==================================\n  ${componentDocs}\n\n  严格按照以上文档中的 API Schema 和 Example 生成 JSON。严禁依靠记忆编造任何未在文档中出现的属性。`
  }

  let humanMessage: string;
  humanMessage = `请为以下模块生成 A2UI JSON：

  [完整页面蓝图:] ==================================
  - 布局描述: ${layoutDesc}
  - 页面结构: ${sectionsStr}

  [模块顶层容器:] ==================================
  - Root ID: ${elementId}
  - Root UI:
    ${slotElemnetStr}
    
  [⚠️ 本模块约束（必须遵循）:] ==================================
  ${constraintsStr}

  [需要被渲染的模块详细蓝图:] ==================================
  ${sectionDetailStr}

  [需要被渲染模块的根节点:] ${elementId}
   [模块内部元素id前缀:] ${idPrefix} (注：该模块内所有 element id 必须以此开头)
  ${componentDocsSection}
  **CRITICAL — Path 语法约束：**
  - 数据绑定 path 禁止使用 ".."（目录回溯语法），如 "/menuItems/0/../8" 不会解析。
  - 两个不同区域引用同一数据源时（如"顶部 8 个图标"+"底部 2 个图标"），数据必须预先拆分为两个独立数组（如 topMenuItems / bottomMenuItems），分别绑定各自的 path。
  - 正确示例：{ "path": "/topMenuItems" } 和 { "path": "/bottomMenuItems" }
  - 错误示例：{ "path": "/menuItems/0/../8" }

  你的最终回复必须是一个纯 JSON 对象（以 { 开头，以 } 结尾），禁止输出思考过程、分析或任何自然语言。`;
  return humanMessage;
}
