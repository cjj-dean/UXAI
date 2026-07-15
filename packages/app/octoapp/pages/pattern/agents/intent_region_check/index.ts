import { extractJson } from '../../utils/json_parser'
import { runChildSession } from '../run_child_session'
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "intent_region_check"

type IntentRegionCheckInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  standardizedIntent: any
  onSessionCreated?: (childSessionID: string) => void
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

export default async function intent_region_check(input: IntentRegionCheckInput) {
  const { sdk, sync, modelKey, rootSession, userInput, standardizedIntent, onSessionCreated } = input

  const humanMessage = `[用户原文:] ==================================
${userInput}

[intent_expand生成的标准化JSON:] ==================================
${JSON.stringify(standardizedIntent, null, 2)}

请校验上述JSON中isRegion标记是否与用户原文中的{{独立区块}}标记一致，输出修正后的标准化JSON。`

  console.log("----- isRegion校验Agent开始执行 -----")
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

  console.log("----- isRegion校验Agent运行结束，耗时：", (Date.now() - startTime) / 1000, 's -----')

  const checkedJson = extractJson(result.text)
  if (!checkedJson) {
    console.warn("----- intent_region_check did not return valid JSON, using original -----")
    return standardizedIntent
  }

  logAgentParsed(result.childSessionId, { checkedIntent: checkedJson, current_step: "intent_region_check" })
  return checkedJson
}
