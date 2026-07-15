import { readFileSync, writeFileSync } from "fs"
import path from "path"

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

  console.log(`[buildSkeleton] id=${id}, isUnderMain=${isUnderMain}, isLeaf=${isLeaf}, isShellNode=${isShellNode}, isRegion=${isRegion}`)

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

  if (SHELL_SLOT_IDS.has(id)) {
    console.log(`  → SHELL_SLOT: ${id}`)
    slots.push({
      section_id: id,
      element_id: id,
      id_prefix: deriveIdPrefix(id),
    })
  } else if (isUnderMain) {
    const childCount = (node.children ?? []).length
    console.log("  isUnderMain id=" + id + " children=" + childCount)
    const childNodes = (node.children ?? [])
      .map((child: any) => child.id ? child : (Object.values(child)[0] as any ?? child))
      .filter((c: any) => c && c.id)
    if (childNodes.length === 1 && childNodes[0].children?.length > 0) {
      console.log(`  → single child, looking deeper: onlyChild=${childNodes[0].id}`)
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
          console.log(`  → grandChild slot: ${gc.id}`)
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
    console.log(`  → isUnderMain slot: ${id}`)
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

const workflowDir = process.argv[2]
if (!workflowDir) {
  console.error("Usage: bun run test_slots.ts <workflow-session-dir>")
  process.exit(1)
}

const intentFile = path.join(workflowDir, "intent_expand.md")
const content = readFileSync(intentFile, "utf-8")
const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
if (!jsonMatch) {
  console.error("No JSON found in intent_expand.md")
  process.exit(1)
}

const intent = JSON.parse(jsonMatch[1])
const standardizedIntent = intent.standardizedIntent ?? intent

const elements: any[] = []
const slots: any[] = []
const rootChildren: string[] = []
buildSkeleton(standardizedIntent, elements, slots, rootChildren)

console.log("=== SLOTS ===")
console.log(JSON.stringify(slots, null, 2))
console.log(`\nTotal slots: ${slots.length}`)

console.log("\n=== ELEMENTS ===")
console.log(JSON.stringify(elements, null, 2))
