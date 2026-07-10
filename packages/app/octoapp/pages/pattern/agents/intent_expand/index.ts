import { extractJson } from '../../utils/json_parser'
import { runChildSession } from '../run_child_session'
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "intent_expand"

type IntentExpandInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  onSessionCreated?: (childSessionID: string) => void
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

export default async function intent_expand(input: IntentExpandInput) {
  const { sdk, sync, modelKey, rootSession, userInput, onSessionCreated } = input

  const humanMessage = `[用户的需求:] ==================================
${userInput}

请先判断意图是否过于简单，如果简单则用纯文本扩展补充，然后将扩展后的意图转换为标准化的JSON格式。
如果已经足够详细，则将isSimple设为false，expandedText中直接返回用户原文，standardizedIntent中直接标准化用户原文。

请开始意图扩展与标准化。`

  console.log("----- 意图扩展与标准化Agent开始执行 -----")
  const startTime = Date.now()

  const result = await runChildSession({
    sync,
    modelKey,
    onSessionCreated,
    agent: AGENT_NAME,
    client: sdk.client,
    prompt: humanMessage,
    directory: sdk.directory,
    parentSessionID: rootSession
  })

  console.log("----- 意图扩展与标准化Agent运行结束，耗时：", (Date.now() - startTime) / 1000, 's -----')

  const expandJson = extractJson(result.text)
  if (!expandJson) throw new Error("----- Intent Expand did not return valid JSON -----")

  const returnValue = {
    is_simple: expandJson.isSimple ?? true,
    standardized_intent: expandJson.standardizedIntent ?? null,
    current_step: "intent_expand"
  }

  logAgentParsed(result.childSessionId, returnValue)
  return returnValue
}
