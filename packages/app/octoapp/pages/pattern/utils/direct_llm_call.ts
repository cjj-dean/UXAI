import { extractJson } from './json_parser'

type DesktopApi = {
  readFileBuffer?: (path: string) => Promise<ArrayBuffer | null>
  writeFileBuffer?: (path: string, buffer: ArrayBuffer) => Promise<void>
  getHomeDir?: () => Promise<string>
  getPromptDir?: () => Promise<string>
}

function getDesktopApi(): DesktopApi | undefined {
  return (window as unknown as { api?: DesktopApi }).api
}

async function readFileText(api: DesktopApi, filePath: string): Promise<string> {
  const buf = await api.readFileBuffer!(filePath)
  if (!buf) throw new Error(`Failed to read file: ${filePath}`)
  return new TextDecoder().decode(buf)
}

type ProviderConfig = {
  baseURL: string
  apiKey: string
  modelID: string
}

async function resolveProviderConfig(modelKey: { providerID: string; modelID: string }): Promise<ProviderConfig> {
  const api = getDesktopApi()
  if (!api?.readFileBuffer || !api?.getHomeDir) throw new Error("Electron IPC not available")

  const home = (await api.getHomeDir()).replace(/\\/g, "/")
  const configPath = `${home}/.config/opencode/opencode.json`
  const configRaw = await readFileText(api, configPath)
  const config = JSON.parse(configRaw)

  const provider = config.provider?.[modelKey.providerID]
  if (!provider) throw new Error(`Provider "${modelKey.providerID}" not found in opencode.json`)
  if (!provider.options?.baseURL) throw new Error(`Provider "${modelKey.providerID}" missing baseURL`)
  if (!provider.options?.apiKey) throw new Error(`Provider "${modelKey.providerID}" missing apiKey`)

  const modelEntry = provider.models?.[modelKey.modelID]
  if (!modelEntry) throw new Error(`Model "${modelKey.modelID}" not found under provider "${modelKey.providerID}"`)

  return {
    baseURL: provider.options.baseURL.replace(/\/+$/, ""),
    apiKey: provider.options.apiKey,
    modelID: modelKey.modelID,
  }
}

const PROMPT_TEMPLATE_FILES = [
  "DESIGN_SYSTEM_PROMPT",
  "A2UI_JSON_PROTOCOL",
] as const

type PromptData = Record<string, string>

async function getPromptDir(): Promise<string> {
  const api = getDesktopApi()
  if (!api?.getPromptDir) throw new Error("Electron IPC getPromptDir not available")
  return (await api.getPromptDir()).replace(/\\/g, "/")
}

async function loadPromptTemplates(): Promise<PromptData> {
  const api = getDesktopApi()
  if (!api?.readFileBuffer) throw new Error("Electron IPC readFileBuffer not available")
  const promptDir = await getPromptDir()

  const entries = await Promise.all(
    PROMPT_TEMPLATE_FILES.map(async (name) => {
      const filePath = `${promptDir}/stastics/${name}.txt`
      const content = await readFileText(api, filePath)
      return [name, content] as [string, string]
    })
  )
  return Object.fromEntries(entries)
}

async function loadAgentPrompt(agentName: string): Promise<string> {
  const api = getDesktopApi()
  if (!api?.readFileBuffer) throw new Error("Electron IPC readFileBuffer not available")
  const promptDir = await getPromptDir()
  const filePath = `${promptDir}/${agentName}.txt`
  return readFileText(api, filePath)
}

function formatPrompt(template: string, data: PromptData): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match
  })
}

export type DirectLLMCallInput = {
  modelKey: { providerID: string; modelID: string }
  agentName: string
  humanMessage: string
  systemPromptOverride?: string
  noThinking?: boolean
  workflowId?: string
  workDir?: string
  onReasoningDelta?: (agent: string, delta: string) => void
}

export type DirectLLMCallResult = {
  text: string
  reasoning: string
  parsed: Record<string, unknown> | null
  latencyMs: number
}

let _cachedSystemPrompt: string | null = null
let _cachedAgentName: string | null = null

async function getSystemPrompt(agentName: string): Promise<string> {
  if (_cachedSystemPrompt && _cachedAgentName === agentName) return _cachedSystemPrompt

  const [agentTemplate, templateData] = await Promise.all([
    loadAgentPrompt(agentName),
    loadPromptTemplates(),
  ])

  const data = { ...templateData }
  data.A2UI_JSON_PROTOCOL = formatPrompt(data.A2UI_JSON_PROTOCOL, data)

  const systemPrompt = formatPrompt(agentTemplate, data)

  _cachedSystemPrompt = systemPrompt
  _cachedAgentName = agentName
  return systemPrompt
}

export async function directLLMCall(input: DirectLLMCallInput): Promise<DirectLLMCallResult> {
  const { modelKey, agentName, humanMessage, systemPromptOverride, noThinking, workflowId, workDir, onReasoningDelta } = input

  const [providerConfig, defaultSystemPrompt] = await Promise.all([
    resolveProviderConfig(modelKey),
    systemPromptOverride ? Promise.resolve("") : getSystemPrompt(agentName),
  ])

  const systemPrompt = systemPromptOverride ?? defaultSystemPrompt

  const url = `${providerConfig.baseURL}/chat/completions`
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  const sessionId = `direct-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: humanMessage },
  ]

  console.log(`[directLLMCall] Calling ${url} model=${providerConfig.modelID}`)

  if (workflowId && workDir) {
    await writeTrace(workDir, workflowId, agentName, sessionId, "round1_llm_input", {
      agent: agentName,
      sessionID: sessionId,
      model: { provider: modelKey.providerID, model: modelKey.modelID },
      timestamp,
      temperature: 0,
      messages,
    })
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${providerConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: providerConfig.modelID,
      temperature: 0,
      messages,
      stream: true,
      ...(noThinking ? { thinking: { type: "disabled" } } : {}),
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`LLM API error ${response.status}: ${errorText}`)
  }

  const { content: text, reasoning } = await readStreamResponse(response, agentName, onReasoningDelta)
  const latencyMs = Date.now() - startTime

  console.log(`[directLLMCall] Response received, latency=${latencyMs}ms, text length=${text.length}, reasoning length=${reasoning.length}`)

  if (workflowId && workDir) {
    const traceData: Record<string, unknown> = {
      agent: agentName,
      sessionID: sessionId,
      timestamp: new Date().toISOString(),
      text,
      latencyMs,
    }
    if (reasoning) traceData.reasoning = reasoning
    const latencySec = (latencyMs / 1000).toFixed(1)
    await writeTrace(workDir, workflowId, agentName, sessionId, `round1_llm_output_${latencySec}s`, traceData)

    const mdContent = reasoning ? `## Reasoning\n\n${reasoning}\n\n## Output\n\n\`\`\`json\n${text}\n\`\`\`` : `\`\`\`json\n${text}\n\`\`\``
    await writeTrace(workDir, workflowId, agentName, sessionId, `round1_llm_output`, mdContent, ".md")
  }

  const parsed = extractJson(text)

  return { text, reasoning, parsed, latencyMs }
}

async function writeTrace(workDir: string, workflowId: string, agentName: string, sessionId: string, filename: string, data: unknown, ext: string = ".json") {
  try {
    const api = getDesktopApi()
    if (!api?.writeFileBuffer) return
    const dir = `${workDir.replace(/\\/g, "/")}/pattern/workflow/${workflowId}/${agentName}/${sessionId}`
    const path = `${dir}/${filename}${ext}`
    const content = ext === ".json"
      ? new TextEncoder().encode(JSON.stringify(data, null, 2))
      : new TextEncoder().encode(typeof data === "string" ? data : String(data))
    await api.writeFileBuffer(path, content.buffer as ArrayBuffer)
    console.log(`[directLLMCall] trace written: ${path}`)
  } catch (e) {
    console.warn("[directLLMCall] trace write failed:", e)
  }
}

async function readStreamResponse(response: Response, agentName: string, onReasoningDelta?: (agent: string, delta: string) => void): Promise<{ content: string; reasoning: string }> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let content = ""
  let reasoning = ""
  let nonSseChunks = 0
  const TIMEOUT_MS = 300_000
  const deadline = Date.now() + TIMEOUT_MS

  while (Date.now() < deadline) {
    let chunk: { done: false; value: Uint8Array } | { done: true; value?: undefined }
    try {
      chunk = await Promise.race([
        reader.read(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("chunk timeout")), 60_000)
        ),
      ])
    } catch (e) {
      console.warn("[directLLMCall] stream read error or timeout:", e)
      break
    }

    if (chunk.done) break
    buffer += decoder.decode(chunk.value, { stream: true })

    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === "data: [DONE]") continue
      if (!trimmed.startsWith("data: ")) {
        nonSseChunks++
        if (nonSseChunks <= 3) console.warn("[directLLMCall] non-SSE line:", trimmed.slice(0, 200))
        continue
      }
      try {
        const json = JSON.parse(trimmed.slice(6))
        const choice = json.choices?.[0]
        if (!choice) continue
        const delta = choice.delta
        if (delta?.content) content += delta.content
        if (delta?.reasoning_content) {
          reasoning += delta.reasoning_content
          onReasoningDelta?.(agentName, delta.reasoning_content)
        }
        if (choice.finish_reason) {
          console.log("[directLLMCall] stream finished, reason:", choice.finish_reason)
        }
      } catch (e) {
        if (nonSseChunks <= 3) console.warn("[directLLMCall] SSE parse error:", trimmed.slice(0, 200))
      }
    }
  }

  if (nonSseChunks > 0) console.warn(`[directLLMCall] total non-SSE lines: ${nonSseChunks}`)
  if (!content && !reasoning && buffer.trim()) {
    console.warn("[directLLMCall] no SSE content extracted, attempting fallback JSON parse")
    try {
      const fallback = JSON.parse(buffer)
      const msg = fallback.choices?.[0]?.message
      if (msg?.content) content = msg.content
      if (msg?.reasoning_content) reasoning = msg.reasoning_content
    } catch {}
    if (!content && !reasoning) console.warn("[directLLMCall] fallback parse also failed, raw buffer (first 500):", buffer.slice(0, 500))
  }

  return { content, reasoning }
}

export function clearSystemPromptCache() {
  _cachedSystemPrompt = null
  _cachedAgentName = null
}
