import { Provider } from "@/provider/provider"
import * as Log from "@opencode-ai/core/util/log"
import { Context, Effect, Layer, Record } from "effect"
import * as Stream from "effect/Stream"
import { streamText, generateText, wrapLanguageModel, type ModelMessage, type Tool, tool, jsonSchema } from "ai"
import { mergeDeep } from "remeda"
import { GitLabWorkflowLanguageModel } from "gitlab-ai-provider"
import { ProviderTransform } from "@/provider/transform"
import { Config } from "@/config/config"
import { InstanceState } from "@/effect/instance-state"
import type { Agent } from "@/agent/agent"
import type { MessageV2 } from "./message-v2"
import { Plugin } from "@/plugin"
import { SystemPrompt } from "./system"
import { Flag } from "@opencode-ai/core/flag/flag"
import { Permission } from "@/permission"
import { PermissionID } from "@/permission/schema"
import { Bus } from "@/bus"
import { Wildcard } from "@/util/wildcard"
import { SessionID } from "@/session/schema"
import { Auth } from "@/auth"
import { Installation } from "@/installation"
import { InstallationVersion } from "@opencode-ai/core/installation/version"
import { EffectBridge } from "@/effect/bridge"
import * as Option from "effect/Option"
import * as OtelTracer from "@effect/opentelemetry/Tracer"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const log = Log.create({ service: "llm" })
export const OUTPUT_TOKEN_MAX = ProviderTransform.OUTPUT_TOKEN_MAX
type Result = Awaited<ReturnType<typeof streamText>>
type GenerateResult = Awaited<ReturnType<typeof generateText>>

const _llmRound = new Map<string, number>()
const _llmTrace = new Map<string, { dir: string; base: string; agent: string; sessionID: string }>()

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

async function writeTrace(dir: string, base: string, suffix: string, data: unknown) {
  try {
    await mkdir(dir, { recursive: true })
    const file = path.join(dir, `${base}_${suffix}.json`)
    await writeFile(file, JSON.stringify(data, (_k, v) => (typeof v === "function" ? "[Function]" : v), 2), "utf-8")
    log.info("llm-trace written", { file })
  } catch (e) {
    log.warn("llm-trace write failed", { error: String(e) })
  }
}

async function* tapOutput(
  source: AsyncIterable<Event>,
  trace: { dir: string; base: string; agent: string; sessionID: string },
): AsyncGenerator<Event> {
  let text = ""
  for await (const event of source) {
    const e = event as unknown as Record<string, unknown>
    if (e.type === "text-delta" && typeof e.text === "string") text += e.text
    yield event
  }
  // Beautify JSON output: try to extract JSON and pretty-print
  let display = text
  let content = "" // extracted content text for separate file
  try {
    const match = display.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    const raw = match ? match[1] : display
    const parsed = JSON.parse(raw)
    const formatted = JSON.stringify(parsed, null, 2)
    display = match
      ? display.replace(raw, formatted)
      : formatted
    content = formatted
  } catch { /* not JSON, use raw text */ }
  void writeTrace(trace.dir, trace.base, "llm_output", {
    agent: trace.agent,
    sessionID: trace.sessionID,
    timestamp: new Date().toISOString(),
    text: display,
  })
  // Also write extracted content as a standalone formatted file
  if (content) {
    try {
      const file = path.join(trace.dir, `${trace.base}_llm_output.md`)
      await mkdir(trace.dir, { recursive: true })
      await writeFile(file, content, "utf-8")
    } catch { /* best-effort */ }
  }
}

const REASONING_TYPES = new Set(["reasoning-start", "reasoning-delta", "reasoning-end"])

async function* dropReasoning(source: AsyncIterable<Event>): AsyncGenerator<Event> {
  for await (const event of source) {
    if (REASONING_TYPES.has((event as { type: string }).type)) continue
    yield event
  }
}

// Avoid re-instantiating remeda's deep merge types in this hot LLM path; the runtime behavior is still mergeDeep.
const mergeOptions = (target: Record<string, any>, source: Record<string, any> | undefined): Record<string, any> =>
  mergeDeep(target, source ?? {}) as Record<string, any>

export type StreamInput = {
  user: MessageV2.User
  sessionID: string
  parentSessionID?: string
  model: Provider.Model
  agent: Agent.Info
  permission?: Permission.Ruleset
  system: string[]
  messages: ModelMessage[]
  small?: boolean
  tools: Record<string, Tool>
  retries?: number
  toolChoice?: "auto" | "required" | "none"
}

export type StreamRequest = StreamInput & {
  abort: AbortSignal
}

export type Event = Result["fullStream"] extends AsyncIterable<infer T> ? T : never

export interface Interface {
  readonly stream: (input: StreamInput) => Stream.Stream<Event, unknown>
  readonly generate: (input: StreamInput) => Effect.Effect<GenerateResult, unknown>
}

export class Service extends Context.Service<Service, Interface>()("@opencode/LLM") {}

const live: Layer.Layer<
  Service,
  never,
  Auth.Service | Config.Service | Provider.Service | Plugin.Service | Permission.Service
> = Layer.effect(
  Service,
  Effect.gen(function* () {
    const auth = yield* Auth.Service
    const config = yield* Config.Service
    const provider = yield* Provider.Service
    const plugin = yield* Plugin.Service
    const perm = yield* Permission.Service

    const buildParams = Effect.fn("LLM.buildParams")(function* (input: StreamRequest) {
      const l = log
        .clone()
        .tag("providerID", input.model.providerID)
        .tag("modelID", input.model.id)
        .tag("session.id", input.sessionID)
        .tag("small", (input.small ?? false).toString())
        .tag("agent", input.agent.name)
        .tag("mode", input.agent.mode)
      l.info("build", {
        modelID: input.model.id,
        providerID: input.model.providerID,
      })

      const [language, cfg, item, info] = yield* Effect.all(
        [
          provider.getLanguage(input.model),
          config.get(),
          provider.getProvider(input.model.providerID),
          auth.get(input.model.providerID),
        ],
        { concurrency: "unbounded" },
      )

      // TODO: move this to a proper hook
      const isOpenaiOauth = item.id === "openai" && info?.type === "oauth"

      const system: string[] = []
      system.push(
        [
          // use agent prompt otherwise provider prompt
          ...(input.agent.prompt ? [input.agent.prompt] : SystemPrompt.provider(input.model)),
          // any custom prompt passed into this call
          ...input.system,
          // any custom prompt from last user message
          ...(input.user.system ? [input.user.system] : []),
        ]
          .filter((x) => x)
          .join("\n"),
      )

      const header = system[0]
      yield* plugin.trigger(
        "experimental.chat.system.transform",
        { sessionID: input.sessionID, model: input.model },
        { system },
      )
      // rejoin to maintain 2-part structure for caching if header unchanged
      if (system.length > 2 && system[0] === header) {
        const rest = system.slice(1)
        system.length = 0
        system.push(header, rest.join("\n"))
      }

      const variant =
        !input.small && input.model.variants && input.user.model.variant
          ? input.model.variants[input.user.model.variant]
          : {}
      const base = input.small
        ? ProviderTransform.smallOptions(input.model)
        : ProviderTransform.options({
            model: input.model,
            sessionID: input.sessionID,
            providerOptions: item.options,
          })
      const options = mergeOptions(mergeOptions(mergeOptions(base, input.model.options), input.agent.options), variant)
      if (isOpenaiOauth) {
        options.instructions = system.join("\n")
      }

      if (input.agent.name.startsWith("proto_") && input.agent.name !== "proto_module_create") {
        options.thinking = { type: "disabled" }
      }

      const isWorkflow = language instanceof GitLabWorkflowLanguageModel
      const messages = isOpenaiOauth
        ? input.messages
        : isWorkflow
          ? input.messages
          : [
              ...system.map(
                (x): ModelMessage => ({
                  role: "system",
                  content: x,
                }),
              ),
              ...input.messages,
            ]

      const params = yield* plugin.trigger(
        "chat.params",
        {
          sessionID: input.sessionID,
          agent: input.agent.name,
          model: input.model,
          provider: item,
          message: input.user,
        },
        {
          temperature: input.model.capabilities.temperature
            ? (input.agent.temperature ?? ProviderTransform.temperature(input.model))
            : undefined,
          topP: input.agent.topP ?? ProviderTransform.topP(input.model),
          topK: ProviderTransform.topK(input.model),
          maxOutputTokens: ProviderTransform.maxOutputTokens(input.model),
          options,
        },
      )

      const { headers } = yield* plugin.trigger(
        "chat.headers",
        {
          sessionID: input.sessionID,
          agent: input.agent.name,
          model: input.model,
          provider: item,
          message: input.user,
        },
        {
          headers: {},
        },
      )

      const tools = resolveTools(input)

      // LiteLLM and some Anthropic proxies require the tools parameter to be present
      // when message history contains tool calls, even if no tools are being used.
      // Add a dummy tool that is never called to satisfy this validation.
      // This is enabled for:
      // 1. Providers with "litellm" in their ID or API ID (auto-detected)
      // 2. Providers with explicit "litellmProxy: true" option (opt-in for custom gateways)
      const isLiteLLMProxy =
        item.options?.["litellmProxy"] === true ||
        input.model.providerID.toLowerCase().includes("litellm") ||
        input.model.api.id.toLowerCase().includes("litellm")

      // LiteLLM/Bedrock rejects requests where the message history contains tool
      // calls but no tools param is present. When there are no active tools (e.g.
      // during compaction), inject a stub tool to satisfy the validation requirement.
      // The stub description explicitly tells the model not to call it.
      if (
        (isLiteLLMProxy || input.model.providerID.includes("github-copilot")) &&
        Object.keys(tools).length === 0 &&
        hasToolCalls(input.messages)
      ) {
        tools["_noop"] = tool({
          description: "Do not call this tool. It exists only for API compatibility and must never be invoked.",
          inputSchema: jsonSchema({
            type: "object",
            properties: {
              reason: { type: "string", description: "Unused" },
            },
          }),
          execute: async () => ({ output: "", title: "", metadata: {} }),
        })
      }

      // Wire up toolExecutor for DWS workflow models so that tool calls
      // from the workflow service are executed via opencode's tool system
      // and results sent back over the WebSocket.
      if (language instanceof GitLabWorkflowLanguageModel) {
        const workflowModel = language as GitLabWorkflowLanguageModel & {
          sessionID?: string
          sessionPreapprovedTools?: string[]
          approvalHandler?: (approvalTools: { name: string; args: string }[]) => Promise<{ approved: boolean }>
        }
        workflowModel.sessionID = input.sessionID
        workflowModel.systemPrompt = system.join("\n")
        workflowModel.toolExecutor = async (toolName, argsJson, _requestID) => {
          const t = tools[toolName]
          if (!t || !t.execute) {
            return { result: "", error: `Unknown tool: ${toolName}` }
          }
          try {
            const result = await t.execute!(JSON.parse(argsJson), {
              toolCallId: _requestID,
              messages: input.messages,
              abortSignal: input.abort,
            })
            const output = typeof result === "string" ? result : (result?.output ?? JSON.stringify(result))
            return {
              result: output,
              metadata: typeof result === "object" ? result?.metadata : undefined,
              title: typeof result === "object" ? result?.title : undefined,
            }
          } catch (e: any) {
            return { result: "", error: e.message ?? String(e) }
          }
        }

        const ruleset = Permission.merge(input.agent.permission ?? [], input.permission ?? [])
        workflowModel.sessionPreapprovedTools = Object.keys(tools).filter((name) => {
          const match = ruleset.findLast((rule) => Wildcard.match(name, rule.permission))
          return !match || match.action !== "ask"
        })

        const bridge = yield* EffectBridge.make()
        const approvedToolsForSession = new Set<string>()
        workflowModel.approvalHandler = InstanceState.bind(async (approvalTools) => {
          const uniqueNames = [...new Set(approvalTools.map((t: { name: string }) => t.name))] as string[]
          // Auto-approve tools that were already approved in this session
          // (prevents infinite approval loops for server-side MCP tools)
          if (uniqueNames.every((name) => approvedToolsForSession.has(name))) {
            return { approved: true }
          }

          const id = PermissionID.ascending()
          let unsub: (() => void) | undefined
          try {
            unsub = Bus.subscribe(Permission.Event.Replied, (evt) => {
              if (evt.properties.requestID === id) void evt.properties.reply
            })
            const toolPatterns = approvalTools.map((t: { name: string; args: string }) => {
              try {
                const parsed = JSON.parse(t.args) as Record<string, unknown>
                const title = (parsed?.title ?? parsed?.name ?? "") as string
                return title ? `${t.name}: ${title}` : t.name
              } catch {
                return t.name
              }
            })
            const uniquePatterns = [...new Set(toolPatterns)] as string[]
            await bridge.promise(
              perm.ask({
                id,
                sessionID: SessionID.make(input.sessionID),
                permission: "workflow_tool_approval",
                patterns: uniquePatterns,
                metadata: { tools: approvalTools },
                always: uniquePatterns,
                ruleset: [],
              }),
            )
            for (const name of uniqueNames) approvedToolsForSession.add(name)
            workflowModel.sessionPreapprovedTools = [...(workflowModel.sessionPreapprovedTools ?? []), ...uniqueNames]
            return { approved: true }
          } catch {
            return { approved: false }
          } finally {
            unsub?.()
          }
        })
      }

      const tracer = cfg.experimental?.openTelemetry
        ? Option.getOrUndefined(yield* Effect.serviceOption(OtelTracer.OtelTracer))
        : undefined
      const telemetryTracer = tracer
        ? new Proxy(tracer, {
            get(target, prop, receiver) {
              if (prop !== "startSpan") return Reflect.get(target, prop, receiver)
              return (...args: Parameters<typeof target.startSpan>) => {
                const span = target.startSpan(...args)
                span.setAttribute("session.id", input.sessionID)
                return span
              }
            },
          })
        : undefined

      const opencodeProjectID = input.model.providerID.startsWith("opencode")
        ? (yield* InstanceState.context).project.id
        : undefined

      if (input.agent.name.startsWith("proto_")) {
        const workflowID = input.parentSessionID ?? input.sessionID
        const round = (_llmRound.get(input.sessionID) ?? 0) + 1
        _llmRound.set(input.sessionID, round)
        const d = new Date()
        const base = `round${round}`
        const traceDir = path.join(yield* InstanceState.directory, "pattern", "workflow", workflowID, input.agent.name, input.sessionID.slice(-8))
        l.info("llm-trace", { agent: input.agent.name, sessionID: input.sessionID, workflowID, round, dir: traceDir })
        _llmTrace.set(input.sessionID, { dir: traceDir, base, agent: input.agent.name, sessionID: input.sessionID })
        void writeTrace(traceDir, base, "llm_input", {
          agent: input.agent.name,
          sessionID: input.sessionID,
          model: { provider: input.model.providerID, model: input.model.id },
          timestamp: new Date().toISOString(),
          temperature: params.temperature,
          topP: params.topP,
          messages,
        })
      }

      return {
        messages,
        tools,
        params,
        headers,
        language,
        opencodeProjectID,
        cfg,
        telemetryTracer,
        options,
      }
    })

    const run = Effect.fn("LLM.run")(function* (input: StreamRequest) {
      const built = yield* buildParams(input)
      return streamText({
        onError(error) {
          log.error("stream error", { error })
        },
        async experimental_repairToolCall(failed) {
          const lower = failed.toolCall.toolName.toLowerCase()
          if (lower !== failed.toolCall.toolName && built.tools[lower]) {
            log.info("repairing tool call", {
              tool: failed.toolCall.toolName,
              repaired: lower,
            })
            return {
              ...failed.toolCall,
              toolName: lower,
            }
          }
          return {
            ...failed.toolCall,
            input: JSON.stringify({
              tool: failed.toolCall.toolName,
              error: failed.error.message,
            }),
            toolName: "invalid",
          }
        },
        temperature: built.params.temperature,
        topP: built.params.topP,
        topK: built.params.topK,
        providerOptions: ProviderTransform.providerOptions(input.model, built.params.options),
        activeTools: Object.keys(built.tools).filter((x) => x !== "invalid"),
        tools: built.tools,
        toolChoice: input.toolChoice,
        maxOutputTokens: built.params.maxOutputTokens,
        abortSignal: input.abort,
        headers: {
          ...(input.model.providerID.startsWith("opencode")
            ? {
                "x-opencode-project": built.opencodeProjectID,
                "x-opencode-session": input.sessionID,
                "x-opencode-request": input.user.id,
                "x-opencode-client": Flag.OPENCODE_CLIENT,
                "User-Agent": `opencode/${InstallationVersion}`,
              }
            : {
                "x-session-affinity": input.sessionID,
                ...(input.parentSessionID ? { "x-parent-session-id": input.parentSessionID } : {}),
                "User-Agent": `opencode/${InstallationVersion}`,
              }),
          ...input.model.headers,
          ...built.headers,
        },
        maxRetries: input.retries ?? 0,
        messages: built.messages,
        model: wrapLanguageModel({
          model: built.language,
          middleware: [
            {
              specificationVersion: "v3" as const,
              async transformParams(args) {
                if (args.type === "stream") {
                  // @ts-expect-error
                  args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, built.options)
                }
                return args.params
              },
            },
          ],
        }),
        experimental_telemetry: {
          isEnabled: built.cfg.experimental?.openTelemetry,
          functionId: "session.llm",
          tracer: built.telemetryTracer,
          metadata: {
            userId: built.cfg.username ?? "unknown",
            sessionId: input.sessionID,
          },
        },
      })
    })

    const generate: Interface["generate"] = (input) =>
      Effect.gen(function* () {
        const ctrl = yield* Effect.acquireRelease(
          Effect.sync(() => new AbortController()),
          (ctrl) => Effect.sync(() => ctrl.abort()),
        )
        const built = yield* buildParams({ ...input, abort: ctrl.signal })
        return yield* Effect.tryPromise(() =>
          generateText({
            temperature: built.params.temperature,
            topP: built.params.topP,
            topK: built.params.topK,
            providerOptions: ProviderTransform.providerOptions(input.model, built.params.options),
            activeTools: Object.keys(built.tools).filter((x) => x !== "invalid"),
            tools: built.tools,
            toolChoice: input.toolChoice,
            maxOutputTokens: built.params.maxOutputTokens,
            abortSignal: ctrl.signal,
            headers: {
              ...(input.model.providerID.startsWith("opencode")
                ? {
                    "x-opencode-project": built.opencodeProjectID,
                    "x-opencode-session": input.sessionID,
                    "x-opencode-request": input.user.id,
                    "x-opencode-client": Flag.OPENCODE_CLIENT,
                    "User-Agent": `opencode/${InstallationVersion}`,
                  }
                : {
                    "x-session-affinity": input.sessionID,
                    ...(input.parentSessionID ? { "x-parent-session-id": input.parentSessionID } : {}),
                    "User-Agent": `opencode/${InstallationVersion}`,
                  }),
              ...input.model.headers,
              ...built.headers,
            },
            maxRetries: input.retries ?? 0,
            messages: built.messages,
            model: wrapLanguageModel({
              model: built.language,
              middleware: [
                {
                  specificationVersion: "v3" as const,
                  async transformParams(args) {
                    // @ts-expect-error
                    args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, built.options)
                    return args.params
                  },
                },
              ],
            }),
            experimental_telemetry: {
              isEnabled: built.cfg.experimental?.openTelemetry,
              functionId: "session.llm.generate",
              tracer: built.telemetryTracer,
              metadata: {
                userId: built.cfg.username ?? "unknown",
                sessionId: input.sessionID,
              },
            },
          }),
        )
      }).pipe(Effect.scoped)

    const stream: Interface["stream"] = (input) =>
      Stream.scoped(
        Stream.unwrap(
          Effect.gen(function* () {
            const ctrl = yield* Effect.acquireRelease(
              Effect.sync(() => new AbortController()),
              (ctrl) => Effect.sync(() => ctrl.abort()),
            )

            const result = yield* run({ ...input, abort: ctrl.signal })

            const trace = _llmTrace.get(input.sessionID)
            const isProto = input.agent.name.startsWith("proto_") && input.agent.name !== "proto_planner_create"
            let source: AsyncIterable<Event> = result.fullStream
            if (trace) source = tapOutput(source, trace)
            if (isProto) source = dropReasoning(source)
            return Stream.fromAsyncIterable(source, (e) => (e instanceof Error ? e : new Error(String(e))))
          }),
        ),
      )

    return Service.of({ stream, generate })
  }),
)

export const layer = live.pipe(Layer.provide(Permission.defaultLayer))

export const defaultLayer = Layer.suspend(() =>
  layer.pipe(
    Layer.provide(Auth.defaultLayer),
    Layer.provide(Config.defaultLayer),
    Layer.provide(Provider.defaultLayer),
    Layer.provide(Plugin.defaultLayer),
  ),
)

function resolveTools(input: Pick<StreamInput, "tools" | "agent" | "permission" | "user">) {
  const disabled = Permission.disabled(
    Object.keys(input.tools),
    Permission.merge(input.agent.permission, input.permission ?? []),
  )
  return Record.filter(input.tools, (_, k) => input.user.tools?.[k] !== false && !disabled.has(k))
}

// Check if messages contain any tool-call content
// Used to determine if a dummy tool should be added for LiteLLM proxy compatibility
export function hasToolCalls(messages: ModelMessage[]): boolean {
  for (const msg of messages) {
    if (!Array.isArray(msg.content)) continue
    for (const part of msg.content) {
      if (part.type === "tool-call" || part.type === "tool-result") return true
    }
  }
  return false
}

export * as LLM from "./llm"
