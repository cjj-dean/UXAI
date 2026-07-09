import { extractJson } from '../../utils/json_parser';
import { runChildSession } from '../run_child_session';
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "proto_planner_create"

type ProtoPlannerCreateInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  intentDescription: string
  predefinedSlots?: Array<{ section_id: string; element_id: string; id_prefix: string }>
  onSessionCreated?: (childSessionID: string) => void
}

export default async function proto_planner_create(input: ProtoPlannerCreateInput) {
  const { 
    sdk, 
    sync, 
    modelKey, 
    userInput, 
    rootSession, 
    intentDescription, 
    predefinedSlots,
    onSessionCreated 
  } = input
  const humanMessage = buildHumanMessage(intentDescription, predefinedSlots)
  console.log("----- 布局规划Agent开始执行 ----- ");
  const startTime = Date.now()
  const plannerResult = await runChildSession({
    client: sdk.client,
    directory: sdk.directory,
    parentSessionID: rootSession,
    agent: AGENT_NAME,
    modelKey,
    prompt: humanMessage,
    sync,
    onSessionCreated,
  })
  console.log("----- 布局规划Agent运行结束，耗时：", (Date.now() - startTime) / 1000, 's -----');
  const plannerJson = extractJson(plannerResult.text)
  if (!plannerJson) throw new Error("----- Planner Create did not return valid JSON -----")
  const returnValue = {
    "layout_planner": plannerJson,
    "current_step": "planner_create"
  }
  logAgentParsed(plannerResult.childSessionId, returnValue)
  return returnValue
}

function buildHumanMessage(intentDescription: string, predefinedSlots?: Array<{ section_id: string; element_id: string; id_prefix: string }>){
  const slotGuidance = predefinedSlots?.length
    ? `\n  [Predefined Slots (HIGHEST PRIORITY — 已预分配，必须严格遵循)] ==================================\n  你必须为以下每个 slot 创建对应的 element（作为 slot parent），element_id 和 id_prefix 必须完全匹配。slots 数组由系统自动生成，你无需输出 slots。\n${predefinedSlots.map((s) => `  - section_id: "${s.section_id}" → element_id: "${s.element_id}", id_prefix: "${s.id_prefix}"`).join("\n")}\n  不要输出 slots 数组，slots 将由系统自动注入。你的 elements 中必须包含上述每个 element_id 对应的元素。`
    : ""
  return `请根据以下页面蓝图，设计外壳布局并指定下一步细化模块：
  [Page Blue_print:] ==================================

  ${intentDescription}
${slotGuidance}
  `;
}

