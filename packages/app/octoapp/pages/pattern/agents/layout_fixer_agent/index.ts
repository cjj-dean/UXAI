import type { A2UIJson } from "./types"
import { ALL_FIXERS } from "./fixers"

export function layoutFixer(genuiJson: A2UIJson): [A2UIJson, string[]] {
  if (!genuiJson?.elements?.length) return [genuiJson, []]

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
