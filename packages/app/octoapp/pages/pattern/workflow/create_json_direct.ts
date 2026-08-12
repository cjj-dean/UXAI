import proto_module_create from "../agents/proto_module_create"
import { runChildSession } from "../agents/run_child_session"

type CreateJsonDirectInput = {
  sdk: any
  sync: any
  modelKey: { providerID: string; modelID: string }
  rootSession: string
  userInput: string
  onSessionCreated?: (childSessionID: string) => void
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

export default async function create_json_direct(input: CreateJsonDirectInput, onFinshed: (finalJson: any) => Promise<void>) {
  // 记录用户消息到 child session（intent_expand agent），使其在聊天面板可见
  // userMessages 只筛 role=user，故 agent 的 assistant 输出不会进聊天
  await runChildSession({
    sync: input.sync,
    modelKey: input.modelKey,
    onSessionCreated: input.onSessionCreated,
    agent: "intent_expand",
    client: input.sdk.client,
    prompt: input.userInput,
    directory: input.sdk.directory,
    parentSessionID: input.rootSession,
  }).catch((e) => console.warn("[create_json_direct] record user message failed", e))

  const layoutPlanner = {
    rootId: "root",
    elements: [
      { id: "root", component: "div", props: { className: "flex flex-col min-h-screen bg-surface-container-lowest" }, children: [] },
    ],
    slots: [{ section_id: "root", element_id: "root", id_prefix: "root" }],
  }

  const intentDescription = { id: "root", name: "页面", description: input.userInput, children: [] }

  const result = await proto_module_create({
    sdk: input.sdk,
    sync: input.sync,
    modelKey: input.modelKey,
    rootSession: input.rootSession,
    userInput: input.userInput,
    idPrefix: "root",
    sectionId: "root",
    elementId: "root",
    layoutPlanner,
    intentDescription,
    onDirectCallTiming: input.onDirectCallTiming,
    onReasoningDelta: input.onReasoningDelta,
  })

  await onFinshed({ pageJson: result.ui_json, modulesJson: [] })
}
