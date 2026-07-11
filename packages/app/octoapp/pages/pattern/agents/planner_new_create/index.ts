import { extractJson } from '../../utils/json_parser'
import { runChildSession } from '../run_child_session'
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
  body: "div",
  aside: "aside",
  main: "main",
  dialog: "Dialog",
  drawer: "Drawer",
}

function deriveIdPrefix(id: string): string {
  const parts = id.replace(/([A-Z])/g, "_$1").toLowerCase().split(/[_-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4)
  return parts.map((p) => p.slice(0, 2)).join("").slice(0, 6)
}

function buildSkeleton(node: any, elements: any[], slots: any[], parentChildren: string[]) {
  if (!node) return
  const id = node.id
  if (!id) return

  const isLeaf = !node.children || node.children.length === 0 || node.isRegion === true
  const isShellNode = id in SHELL_COMPONENT_MAP
  const isRegion = node.isRegion === true

  const component = isShellNode
    ? SHELL_COMPONENT_MAP[id]
    : isRegion
      ? "Section"
      : "div"

  const element: any = {
    id,
    component,
    props: { className: "" },
    children: [] as string[],
  }

  if (component === "Dialog") {
    element.props = { ...element.props, title: "", width: "50%" }
  } else if (component === "Drawer") {
    element.props = { ...element.props, title: "", direction: "rtl", size: "30%" }
  }

  if (isLeaf) {
    slots.push({
      section_id: id,
      element_id: id,
      id_prefix: deriveIdPrefix(id),
    })
  } else {
    const childIds: string[] = []
    for (const child of node.children) {
      if (typeof child === "object" && child !== null) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        buildSkeleton(childNode, elements, slots, childIds)
      }
    }
    element.children = childIds
  }

  elements.push(element)
  parentChildren.push(id)
}

function flattenForPrompt(node: any, results: Array<{ id: string; name: string; layout: string; style: string; isLeaf: boolean; isRegion: boolean; description: string }>) {
  if (!node) return
  const id = node.id ?? ""
  const isLeaf = !node.children || node.children.length === 0 || node.isRegion === true
  results.push({
    id,
    name: node.name ?? "",
    layout: node.layout ?? "",
    style: node.style ?? "",
    isLeaf,
    isRegion: node.isRegion === true,
    description: node.description ?? "",
  })
  if (!isLeaf && Array.isArray(node.children)) {
    for (const child of node.children) {
      if (typeof child === "object" && child !== null) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        flattenForPrompt(childNode, results)
      }
    }
  }
}

export default async function planner_new_create(input: PlannerNewCreateInput) {
  const { sdk, sync, modelKey, rootSession, standardizedIntent, onSessionCreated } = input

  // 程序化构建骨架：elements + slots
  const elements: any[] = []
  const slots: any[] = []
  const rootChildren: string[] = []
  buildSkeleton(standardizedIntent, elements, slots, rootChildren)

  // 收集节点信息用于生成 className prompt
  const flatNodes: Array<{ id: string; name: string; layout: string; style: string; isLeaf: boolean; isRegion: boolean; description: string }> = []
  flattenForPrompt(standardizedIntent, flatNodes)

  const nonLeafNodes = flatNodes.filter(n => !n.isLeaf)

  const humanMessage = `[意图扩展输出的标准化JSON:] ==================================
${JSON.stringify(standardizedIntent, null, 2)}

[程序化生成的布局骨架（className为空，需要你填充）:] ==================================
${JSON.stringify({ rootId: standardizedIntent.id ?? "root", elements, slots }, null, 2)}

请根据骨架中每个节点的layout和style属性，生成完整的Tailwind className，输出完整的A2UI JSON（rootId + elements + slots）。
规则：
- 层级关系、children、component、id 不可更改，必须与骨架完全一致
- layout "horizontal" → flex flex-row
- layout "vertical" → flex flex-col
- layout "grid" → grid
- style中的"固定宽度54px" → w-[54px]
- style中的"固定高度300px" → h-[300px]
- style中的"独立区块" → Section组件自带bg/shadow/rounded/padding，不要手动添加
- style中的"横向等宽等距排布" → flex-1
- 有children的容器必须加 gap-[1rem]
- header固定: shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem]
- aside固定: shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between h-full
- main固定: flex-1 overflow-y-auto p-[2rem] flex flex-col gap-[1rem] min-w-0
- root固定: flex flex-col h-screen overflow-hidden bg-surface-container-lowest

请输出完整的A2UI JSON（包含rootId、elements、slots）。`

  console.log("----- 新布局规划Agent开始执行 -----")
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

  console.log("----- 新布局规划Agent运行结束，耗时：", (Date.now() - startTime) / 1000, 's -----')

  const plannerJson = extractJson(result.text)
  if (!plannerJson) throw new Error("----- Planner New Create did not return valid JSON -----")

  const layoutPlanner = {
    rootId: plannerJson.rootId ?? standardizedIntent.id ?? "root",
    elements: plannerJson.elements ?? elements,
    slots: plannerJson.slots ?? slots,
  }

  const returnValue = {
    layout_planner: layoutPlanner,
    current_step: "planner_new_create"
  }

  logAgentParsed(result.childSessionId, returnValue)
  return returnValue
}
