import type { Session } from "@opencode-ai/sdk/v2/client"
import { getResultFromMessages, extractJson } from '../utils/json_parser'
import { logAgentCall, logAgentStart, type RoundTiming } from "../utils/persist"

export type RunChildSessionInput = {
  sync?: any
  client: any
  agent: string
  prompt: string
  isRoot?: boolean
  aborted?: boolean
  directory: string
  parentSessionID: string
  modelKey: { providerID: string; modelID: string } | undefined
  onSessionCreated?: (childSessionID: string) => void
}

export async function runChildSession(input: RunChildSessionInput): Promise<{ text: string; childSessionId: string }> {
  const { 
    sync,
    agent,
    isRoot,
    client,
    modelKey,
    directory,
    parentSessionID,
    prompt: promptText,
    onSessionCreated,
    aborted
  } = input
  let childSession: Session | undefined
  if (isRoot) {
    const result = await client.session.get({ sessionID: parentSessionID })
    childSession = result.data as Session | undefined
  } else {
    const childResult = await client.session.create({
      directory,
      parentID: parentSessionID,
      agent,
    })
    childSession = childResult.data as Session | undefined
  }
  if (!childSession) throw new Error(`Failed to ${isRoot ? "get" : "create"} session for ${agent}`)
  if (sync?.session?.sync) await sync.session.sync(childSession.id)
  if (onSessionCreated && !isRoot) onSessionCreated(childSession.id)
  const sessionId = isRoot ? parentSessionID : childSession.id
  logAgentStart(agent, sessionId)
  await client.session.promptAsync({
    agent,
    model: modelKey,
    sessionID: childSession.id,
    parts: [{ type: "text", text: promptText }],
  })
  const result = await getResultFromMessages({ client }, childSession.id, !!aborted)
  const rounds = await extractRoundTimings(directory, parentSessionID, childSession.id, agent)
  const cleaned = extractJson(result)
  logAgentCall(agent, sessionId, promptText, cleaned ? JSON.stringify(cleaned, null, 2) : result, rounds)
  return { text: result, childSessionId: sessionId }
}

type DesktopApi = {
  readFileBuffer?: (path: string) => Promise<ArrayBuffer | null>
}

function getDesktopApi(): DesktopApi | undefined {
  return (window as unknown as { api?: DesktopApi }).api
}

async function readTraceJson(api: DesktopApi, filePath: string): Promise<any | null> {
  try {
    const buf = await api.readFileBuffer!(filePath)
    if (!buf) return null
    return JSON.parse(new TextDecoder().decode(buf))
  } catch {
    return null
  }
}

async function extractRoundTimings(directory: string, workflowID: string, sessionId: string, agent: string): Promise<RoundTiming[]> {
  try {
    const api = getDesktopApi()
    if (!api?.readFileBuffer) return []
    const traceDir = `${directory}/pattern/workflow/${workflowID}/${agent}/${sessionId.slice(-8)}`
    const rounds: RoundTiming[] = []
    for (let round = 1; round <= 10; round++) {
      const inputData = await readTraceJson(api, `${traceDir}/round${round}_llm_input.json`)
      if (!inputData) break
      const outputData = await readTraceJson(api, `${traceDir}/round${round}_llm_output.json`)
      const tsStart = inputData.timestamp ? new Date(inputData.timestamp).getTime() : 0
      const tsEnd = outputData?.timestamp ? new Date(outputData.timestamp).getTime() : 0
      rounds.push({
        round,
        tsStart,
        tsEnd,
        reasoningEndTs: outputData?.reasoningEndTs || 0,
        textStartTs: outputData?.textStartTs || 0,
      })
    }
    return rounds
  } catch {
    return []
  }
}
