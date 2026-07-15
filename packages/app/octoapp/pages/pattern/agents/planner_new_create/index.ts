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
  infoBar: "div",
  body: "div",
  aside: "aside",
  main: "main",
  dialog: "Dialog",
  drawer: "Drawer",
}

const SHELL_SLOT_IDS = new Set(["header", "infoBar", "aside", "dialog", "drawer"])

function deriveIdPrefix(id: string): string {
  const parts = id.replace(/([A-Z])/g, "_$1").toLowerCase().split(/[_-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4)
  return parts.map((p) => p.slice(0, 2)).join("").slice(0, 6)
}

function buildSkeleton(node: any, elements: any[], slots: any[], parentChildren: string[], isUnderMain: boolean = false) {
  if (!node) return
  const id = node.id
  if (!id) return

  const isLeaf = !node.children || node.children.length === 0
  const isShellNode = id in SHELL_COMPONENT_MAP
  const isRegion = node.isRegion === true

  const component = isShellNode
    ? SHELL_COMPONENT_MAP[id]
    : isRegion
      ? "Section"
      : "div"

  const FIXED_CLASSNAMES: Record<string, string> = {
    header: "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem]",
    infoBar: "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]",
    aside: "shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between h-full",
    body: "flex flex-row flex-1 min-h-0 overflow-hidden",
    root: "flex flex-col h-screen overflow-hidden bg-surface-container-lowest",
  }

  let className = FIXED_CLASSNAMES[id] ?? ""
  if (id === "main") {
    className = "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0"
  }

  const element: any = {
    id,
    component,
    props: { className },
    children: [] as string[],
  }

  if (component === "Dialog") {
    element.props = { ...element.props, title: "", width: "50%" }
  } else if (component === "Drawer") {
    element.props = { ...element.props, title: "", direction: "rtl", size: "30%" }
  }

  // header/aside/dialog/drawer 各只对应一个slot，不递归展开内部
  // main的直接子节点直接作为slot；如果main只有一个子节点，则往下再找一层
  if (SHELL_SLOT_IDS.has(id)) {
    slots.push({
      section_id: id,
      element_id: id,
      id_prefix: deriveIdPrefix(id),
    })
  } else if (isUnderMain) {
    const childNodes = (node.children ?? [])
      .map((child: any) => child.id ? child : (Object.values(child)[0] as any ?? child))
      .filter((c: any) => c && c.id)
    if (childNodes.length === 1 && childNodes[0].children?.length > 0 && !childNodes[0].isRegion) {
      const onlyChild = childNodes[0]
      const grandChildren = onlyChild.children
        .map((gc: any) => gc.id ? gc : (Object.values(gc)[0] as any ?? gc))
        .filter((c: any) => c && c.id)
      if (grandChildren.length > 0) {
        element.children = grandChildren.map((gc: any) => gc.id)
        for (const gc of grandChildren) {
          slots.push({
            section_id: gc.id,
            element_id: gc.id,
            id_prefix: deriveIdPrefix(gc.id),
          })
          buildSkeleton(gc, elements, slots, [], false)
        }
        elements.push(element)
        parentChildren.push(id)
        return
      }
    }
    slots.push({
      section_id: id,
      element_id: id,
      id_prefix: deriveIdPrefix(id),
    })
    return
  } else if (node.children && node.children.length > 0) {
    const childIds: string[] = []
    const childIsUnderMain = id === "main"
    for (const child of node.children) {
      if (typeof child === "object" && child !== null) {
        const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
        buildSkeleton(childNode, elements, slots, childIds, childIsUnderMain)
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
  const isLeaf = !node.children || node.children.length === 0
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
- infoBar固定: shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]
- aside固定: shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between h-full
- main默认: flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0，再根据layout添加flex-row或flex-col
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

  logAgentParsed(result.childSessionId, returnValue)
  return returnValue
}
