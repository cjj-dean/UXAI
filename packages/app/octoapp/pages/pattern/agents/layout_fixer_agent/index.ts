import type { A2UIJson } from "./types"
import { ALL_FIXERS } from "./fixers"

function flattenIntentNodes(intent: any, map: Record<string, any> = {}): Record<string, any> {
  if (!intent || typeof intent !== "object") return map
  if (intent.id) {
    const node: any = {}
    if (intent.layout) node.layout = intent.layout
    if (intent.layoutDescription) node.layoutDescription = intent.layoutDescription
    if (intent.style) node.style = intent.style
    if (intent.containerType) node.containerType = intent.containerType
    if (Object.keys(node).length > 0) map[intent.id] = node
  }
  if (Array.isArray(intent.children)) {
    for (const child of intent.children) {
      const childNode = child.id ? child : (Object.values(child)[0] as any ?? child)
      flattenIntentNodes(childNode, map)
    }
  }
  if (intent.itemTemplate) flattenIntentNodes(intent.itemTemplate, map)
  return map
}

export function layoutFixer(genuiJson: A2UIJson, intent?: any): [A2UIJson, string[]] {
  if (!genuiJson?.elements?.length) return [genuiJson, []]

  if (intent && !genuiJson.intentNodes) {
    genuiJson = { ...genuiJson, intentNodes: flattenIntentNodes(intent) }
  }

  const allFixes: string[] = []

  for (const fixer of ALL_FIXERS) {
    const [json, fixes] = fixer.fn(genuiJson)
    genuiJson = json
    if (fixes.length) {
      allFixes.push(`[${fixer.name}] ${fixes.length} 处:`)
      allFixes.push(...fixes.map((f) => `  - ${f}`))
      console.log(`----- [LayoutFixer] ${fixer.name}: ${fixes.length} 处 -----`)
    }
  }

  if (allFixes.length) {
    console.log(`----- [LayoutFixer] 修正完成，共 ${allFixes.length} 处变更 -----`)
  } else {
    console.log("----- [LayoutFixer] 未发现需要修正的布局问题 -----")
  }

  return [genuiJson, allFixes]
}

export default layoutFixer
