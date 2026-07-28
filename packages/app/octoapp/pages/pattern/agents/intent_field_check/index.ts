import { extractJson } from '../../utils/json_parser'
import { directLLMCall } from '../../utils/direct_llm_call'
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "intent_field_check"

type IntentFieldCheckInput = {
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

const VALID_LAYOUT = new Set(["horizontal", "vertical", "grid"])
const VALID_LAYOUT_DESC = new Set(["default", "justify-between", "three-column", "equal-width", "left-fixed", "right-fixed"])
const VALID_STYLE = /^(?:width-\d+px|height-\d+px|bordered)$/

function collectNodes(node: any, out: { id: string; node: any }[]) {
  if (!node || !node.id) return
  out.push({ id: node.id, node })
  if (node.itemTemplate) collectNodes(node.itemTemplate, out)
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (typeof child === "object") collectNodes(child, out)
    }
  }
}

function validateNodes(intent: any): { id: string; fields: Record<string, any> }[] {
  const allNodes: { id: string; node: any }[] = []
  collectNodes(intent, allNodes)
  const issues: { id: string; fields: Record<string, any> }[] = []

  for (const { id, node } of allNodes) {
    const fields: Record<string, any> = {}
    if (node.style !== undefined) {
      const parts = String(node.style).split(",").map((s) => s.trim()).filter(Boolean)
      const invalid = parts.filter((p) => !VALID_STYLE.test(p))
      if (invalid.length > 0) fields.style = parts.filter((p) => VALID_STYLE.test(p)).join(",") || undefined
    }
    if (node.layout !== undefined && !VALID_LAYOUT.has(node.layout)) {
      fields.layout = undefined
    }
    if (node.layoutDescription !== undefined && !VALID_LAYOUT_DESC.has(node.layoutDescription)) {
      fields.layoutDescription = undefined
    }
    if (Object.keys(fields).length > 0) issues.push({ id, fields })
  }
  return issues
}

function applyFixes(intent: any, fixes: any[]): any {
  if (!Array.isArray(fixes) || fixes.length === 0) return intent
  const fixMap = new Map<string, any>()
  for (const f of fixes) {
    if (f && f.id) {
      const existing = fixMap.get(f.id)
      fixMap.set(f.id, existing ? { ...existing, ...f } : f)
    }
  }
  const clone = JSON.parse(JSON.stringify(intent))
  function walk(node: any) {
    if (!node || !node.id) return
    const fix = fixMap.get(node.id)
    if (fix) {
      for (const key of ["style", "layout", "layoutDescription", "containerType"]) {
        if (fix[key] !== undefined) {
          if (fix[key] === null || fix[key] === "") {
            delete node[key]
          } else {
            node[key] = fix[key]
          }
        }
      }
    }
    if (node.itemTemplate) walk(node.itemTemplate)
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === "object") walk(child)
      }
    }
  }
  walk(clone)
  return clone
}

export default async function intent_field_check(input: IntentFieldCheckInput) {
  const { sdk, modelKey, rootSession, userInput, standardizedIntent, onDirectCallTiming, onReasoningDelta } = input

  const programIssues = validateNodes(standardizedIntent)

  const humanMessage = `[用户原文:] ==================================
${userInput}

[intent_expand生成的标准化JSON:] ==================================
${JSON.stringify(standardizedIntent, null, 2)}

请校验上述JSON中每个节点的 style 和 containerType 字段是否符合规则，输出需要修正的节点。`

  console.log("----- 字段校验Agent开始执行 -----")
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
  console.log("----- 字段校验Agent运行结束，耗时：", latencyMs / 1000, 's -----')

  const llmFixes = extractJson(result.text) as any
  const allFixes = [...programIssues.map((i) => ({ id: i.id, ...i.fields })), ...(Array.isArray(llmFixes) ? llmFixes : [])]

  const fixedIntent = applyFixes(standardizedIntent, allFixes)

  logAgentParsed(`direct-${Date.now().toString(36)}`, { llmFixes, programIssues, fixedIntent, current_step: "intent_field_check" })
  return { standardized_intent: fixedIntent, llmFixes, programIssues, current_step: "intent_field_check" }
}
