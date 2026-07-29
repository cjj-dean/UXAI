import { extractJson } from '../../utils/json_parser'
import { directLLMCall } from '../../utils/direct_llm_call'
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "intent_region_infer"

type IntentRegionInferInput = {
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

function applyRegionFixes(intent: any, fixes: { id: string; containerType?: string | null }[]): any {
  if (!Array.isArray(fixes) || fixes.length === 0) return intent
  const fixMap = new Map<string, string | null>()
  for (const f of fixes) {
    if (f && f.id) fixMap.set(f.id, f.containerType ?? null)
  }
  const clone = JSON.parse(JSON.stringify(intent))
  function walk(node: any, parentHasRegion: boolean) {
    if (!node || !node.id) return
    const fix = fixMap.get(node.id)
    if (fix !== undefined) {
      if (fix === null || fix === "") {
        delete node.containerType
      } else {
        node.containerType = fix
      }
    }
    const thisHasRegion = node.containerType === "Region" || parentHasRegion
    if (thisHasRegion && node.containerType === "Region" && parentHasRegion) {
      delete node.containerType
    }
    if (node.itemTemplate) walk(node.itemTemplate, thisHasRegion)
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === "object") walk(child, thisHasRegion)
      }
    }
  }
  walk(clone, false)
  return clone
}

export default async function intent_region_infer(input: IntentRegionInferInput) {
  const { sdk, modelKey, rootSession, userInput, standardizedIntent, onDirectCallTiming, onReasoningDelta } = input

  const humanMessage = `[用户的原始需求:] ==================================
${userInput}

[intent_expand生成的标准化JSON:] ==================================
${JSON.stringify(standardizedIntent, null, 2)}

请根据Region使用原则，判断上述JSON中哪些节点的containerType应该设置为"Region"，输出需要设置的节点列表。`

  console.log("----- Region推断Agent开始执行 -----")
  const startTime = Date.now()
  onDirectCallTiming?.({ agent: AGENT_NAME, startTime })

  const result = await directLLMCall({
    modelKey,
    agentName: AGENT_NAME,
    humanMessage,
    noThinking: false,
    workflowId: rootSession,
    workDir: sdk.directory,
    onReasoningDelta,
  })

  const latencyMs = Date.now() - startTime
  onDirectCallTiming?.({ agent: AGENT_NAME, startTime, endTime: Date.now() })
  console.log("----- Region推断Agent运行结束，耗时：", latencyMs / 1000, 's -----')

  const fixes = extractJson(result.text) as any
  const regionFixes = Array.isArray(fixes) ? fixes : []

  const fixedIntent = applyRegionFixes(standardizedIntent, regionFixes)

  logAgentParsed(`direct-${Date.now().toString(36)}`, { regionFixes, fixedIntent, current_step: "intent_region_infer" })
  return { standardized_intent: fixedIntent, regionFixes, current_step: "intent_region_infer" }
}
