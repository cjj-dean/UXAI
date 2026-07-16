import { directLLMCall } from '../../utils/direct_llm_call'
import { logAgentParsed } from "../../utils/persist"

const AGENT_NAME = "planner_new_create"

type PlannerNewCreateInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  standardizedIntent: any
  onSessionCreated?: (childSessionID: string) => void
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

const SHELL_COMPONENT_MAP: Record<string, string> = {
  root: "div",
  header: "header",
  infoBar: "div",
  body: "div",
  aside: "aside",
  main: "main",
  dialog: "Dialog",
  drawer: "Drawer",
}

const SHELL_SLOT_IDS = new Set(["header", "infoBar", "aside", "dialog", "drawer"])

const FIXED_CLASSNAMES: Record<string, string> = {
  header: "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem]",
  infoBar: "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]",
  aside: "shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between h-full",
  body: "flex flex-row flex-1 min-h-0 overflow-hidden",
  root: "flex flex-col h-screen overflow-hidden bg-surface-container-lowest",
}

function deriveIdPrefix(id: string): string {
  const parts = id.replace(/([A-Z])/g, "_$1").toLowerCase().split(/[_-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4)
  return parts.map((p) => p.slice(0, 2)).join("").slice(0, 6)
}

function getChildNodes(node: any): any[] {
  return (node.children ?? [])
    .map((child: any) => child.id ? child : (Object.values(child)[0] as any ?? child))
    .filter((c: any) => c && c.id)
}

function buildSkeleton(node: any, elements: any[], slots: any[], parentChildren: string[], isDirectChildOfMain: boolean = false) {
  if (!node) return
  const id = node.id
  if (!id) return

  const isShellNode = id in SHELL_COMPONENT_MAP
  const isRegion = node.isRegion === true

  const component = isShellNode
    ? SHELL_COMPONENT_MAP[id]
    : isRegion
      ? "Section"
      : "div"

  let className = FIXED_CLASSNAMES[id] ?? ""
  if (id === "main") {
    const layoutDir = node.layout === "horizontal" ? "flex flex-row" : "flex flex-col"
    className = `flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 ${layoutDir}`
  } else if (!(id in FIXED_CLASSNAMES)) {
    const layoutDir = node.layout === "horizontal" ? "flex flex-row" : node.layout === "grid" ? "grid" : "flex flex-col"
    className = `${layoutDir} gap-[1rem]`
  }

  const needsClassName = !(id in FIXED_CLASSNAMES) && id !== "main"

  const element: any = {
    id,
    component,
    props: { className },
    children: [] as string[],
    layout: node.layout ?? "",
    style: node.style ?? "",
    isRegion,
    needsClassName,
  }

  if (component === "Dialog") {
    element.props = { ...element.props, title: "", width: "50%" }
  } else if (component === "Drawer") {
    element.props = { ...element.props, title: "", direction: "rtl", size: "30%" }
  }

  if (SHELL_SLOT_IDS.has(id)) {
    slots.push({ section_id: id, element_id: id, id_prefix: deriveIdPrefix(id) })
  } else if (id === "main") {
    const childNodes = getChildNodes(node)
    const nonRegionChildren = childNodes.filter((c: any) => !c.isRegion)
    if (childNodes.length === 1 && nonRegionChildren.length === 1 && getChildNodes(nonRegionChildren[0]).length > 0) {
      const grandChildren = getChildNodes(nonRegionChildren[0])
      element.children = grandChildren.map((gc: any) => gc.id)
      for (const gc of grandChildren) {
        slots.push({ section_id: gc.id, element_id: gc.id, id_prefix: deriveIdPrefix(gc.id) })
        buildSkeleton(gc, elements, slots, [], false)
      }
    } else {
      element.children = childNodes.map((c: any) => c.id)
      for (const c of childNodes) {
        slots.push({ section_id: c.id, element_id: c.id, id_prefix: deriveIdPrefix(c.id) })
        buildSkeleton(c, elements, slots, [], false)
      }
    }
  } else if (isDirectChildOfMain) {
    slots.push({ section_id: id, element_id: id, id_prefix: deriveIdPrefix(id) })
  } else if (node.children && node.children.length > 0) {
    const childIds: string[] = []
    for (const child of node.children) {
      if (typeof child === "object" && child !== null) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        buildSkeleton(childNode, elements, slots, childIds, false)
      }
    }
    element.children = childIds
  }

  elements.push(element)
  parentChildren.push(id)
}

function applyClassNames(elements: any[], llmElements: any[]) {
  const llmMap = new Map<string, string>()
  for (const el of llmElements) {
    if (el.id && el.props?.className) llmMap.set(el.id, el.props.className)
  }
  for (const el of elements) {
    const llmClassName = llmMap.get(el.id)
    if (!llmClassName) continue
    if (el.id in FIXED_CLASSNAMES || el.id === "main") continue
    el.props.className = llmClassName
  }
}

export default async function planner_new_create(input: PlannerNewCreateInput) {
  const { sdk, sync, modelKey, rootSession, standardizedIntent, onDirectCallTiming, onReasoningDelta } = input

  const elements: any[] = []
  const slots: any[] = []
  const rootChildren: string[] = []
  buildSkeleton(standardizedIntent, elements, slots, rootChildren)

  const needsClassNameNodes = elements.filter(el => el.needsClassName)
  const hasStyleNodes = needsClassNameNodes.filter(el => el.style && el.style !== "独立区块")

  const humanMessage = `[程序化生成的布局骨架:] ==================================
${JSON.stringify({ rootId: standardizedIntent.id ?? "root", elements, slots }, null, 2)}

请为骨架中 needsClassName=true 的节点生成完整的 Tailwind className，输出完整的 elements 数组。

规则：
- id、component、children 不可更改，必须与骨架完全一致
- 只需填充 needsClassName=true 节点的 props.className，其余节点的 className 保持骨架原值
- layout "horizontal" → flex flex-row
- layout "vertical" → flex flex-col
- layout "grid" → grid
- style中的"固定宽度54px" → w-[54px] shrink-0
- style中的"固定高度300px" → h-[300px]
- style中的"独立区块" → Section组件自带bg/shadow/rounded/padding，不要手动添加这些，只需添加布局方向和gap
- style中的"横向等宽等距排布" → flex-1
- 有children的容器必须加 gap-[1rem]
- 子元素间需要等分空间时，给子元素加 flex-1
- flex-1 的子元素必须加 min-w-0（横向）或 min-h-0（纵向）防止溢出
- Children MUST NOT use margin-* for spacing
- 固定宽度的侧边面板加 shrink-0

输出格式：{ "elements": [...] }
只输出JSON对象，不要输出任何其他内容。`

  console.log("----- 新布局规划Agent开始执行 -----")
  const startTime = Date.now()
  onDirectCallTiming?.({ agent: AGENT_NAME, startTime })

  const result = await directLLMCall({
    modelKey,
    agentName: AGENT_NAME,
    humanMessage,
    systemPromptOverride: "You are a UI layout architect. Generate Tailwind className for layout skeleton nodes. Output only valid JSON.",
    noThinking: true,
    workflowId: rootSession,
    workDir: sdk.directory,
    onReasoningDelta,
  })

  const latencyMs = Date.now() - startTime
  onDirectCallTiming?.({ agent: AGENT_NAME, startTime, endTime: Date.now() })
  console.log("----- 新布局规划Agent运行结束，耗时：", latencyMs / 1000, 's -----')

  const parsed = result.parsed as { elements?: any[] } | null
  if (parsed?.elements && Array.isArray(parsed.elements)) {
    applyClassNames(elements, parsed.elements)
  } else {
    console.warn("[planner_new_create] LLM did not return valid elements array, using skeleton defaults")
  }

  for (const el of elements) {
    delete el.layout
    delete el.style
    delete el.isRegion
    delete el.needsClassName
  }

  const layoutPlanner = {
    rootId: standardizedIntent.id ?? "root",
    elements,
    slots,
  }

  try {
    const desktopApi = (window as any).api
    if (desktopApi?.writeFileBuffer) {
      const data = new TextEncoder().encode(JSON.stringify(slots, null, 2))
      await desktopApi.writeFileBuffer(`${sdk.directory}/pattern/workflow/${rootSession}/planner_new_create/programmatic_slots.json`, data.buffer)
    }
  } catch (e) {
    console.error("[planner_new_create] failed to write programmatic_slots.json", e)
  }

  const returnValue = {
    layout_planner: layoutPlanner,
    current_step: "planner_new_create"
  }

  logAgentParsed(`direct-${Date.now().toString(36)}`, returnValue)
  return returnValue
}
