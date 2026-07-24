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

interface AnnotationHint {
  type: "wrap" | "inline"
  annotation: string
  content?: string
  nestedAnnotations?: string[]
}

function parseAnnotations(text: string): AnnotationHint[] {
  const hints: AnnotationHint[] = []

  const wrapStartRe = /\{\{([^{}：]+)：/g
  let startMatch: RegExpExecArray | null
  while ((startMatch = wrapStartRe.exec(text)) !== null) {
    const annotation = startMatch[1].trim()
    const contentStart = startMatch.index + startMatch[0].length
    const closingIdx = findClosingBraces(text, contentStart)
    if (closingIdx === -1) continue
    const content = text.slice(contentStart, closingIdx)
    const nested: string[] = []
    const inlineRe = /\{\{([^{}：]+?)\}\}/g
    let nm: RegExpExecArray | null
    while ((nm = inlineRe.exec(content)) !== null) {
      nested.push(nm[1].trim())
    }
    hints.push({ type: "wrap", annotation, content, nestedAnnotations: nested })
  }

  const cleanedText = text.replace(/\{\{[^{}：]+：[\s\S]*?\}\}/g, "")
  const inlineRe2 = /\{\{([^{}：]+?)\}\}/g
  let m: RegExpExecArray | null
  while ((m = inlineRe2.exec(cleanedText)) !== null) {
    hints.push({ type: "inline", annotation: m[1].trim() })
  }
  return hints
}

function findClosingBraces(text: string, fromIdx: number): number {
  let depth = 1
  for (let i = fromIdx; i < text.length - 1; i++) {
    if (text[i] === "{" && text[i + 1] === "{") { depth++; i++ }
    else if (text[i] === "}" && text[i + 1] === "}") { depth--; if (depth === 0) return i }
  }
  return -1
}

function buildAnnotationHintsMessage(text: string): string {
  const hints = parseAnnotations(text)
  if (hints.length === 0) return ""
  const lines: string[] = ["\n\n[程序化解析的{{}}标注（CRITICAL，必须严格遵守）:] =================================="]
  for (const h of hints) {
    if (h.type === "wrap") {
      lines.push(`- {{${h.annotation}：...}} 是包裹标记：必须创建一个父节点，设置 annotations:["${h.annotation}"]，包裹内的所有内容作为该父节点的children。禁止将包裹内容拆分到多个节点`)
      if (h.nestedAnnotations && h.nestedAnnotations.length > 0) {
        lines.push(`  包裹内嵌套标注：${h.nestedAnnotations.map(a => `{{${a}}}`).join(", ")} — 这些标注保留在对应的子节点上`)
      }
    } else {
      lines.push(`- {{${h.annotation}}} 是紧跟标记：在标注紧跟的节点上设置 annotations:["${h.annotation}"]`)
    }
  }
  lines.push("- 禁止省略、改写或丢失任何标注")
  lines.push(`- 只有上述{{}}标注明确标记的节点才能在annotations中添加对应标注，禁止对未标注的节点自行添加任何与标注同名的annotations`)
  return lines.join("\n")
}

export default async function intent_expand(input: IntentExpandInput) {
  const { sdk, sync, modelKey, rootSession, userInput, onSessionCreated } = input

  const annotationHints = buildAnnotationHintsMessage(userInput)

  const humanMessage = `[用户的需求:] ==================================
${userInput}
${annotationHints}

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

  const standardizedIntent = expandJson.standardizedIntent ?? expandJson.standardized_intent ?? expandJson
  const returnValue = {
    standardized_intent: standardizedIntent,
    current_step: "intent_expand"
  }

  logAgentParsed(result.childSessionId, returnValue)
  return returnValue
}
