import { readFileSync, writeFileSync } from "node:fs"
import { resolve, join } from "node:path"
import { layoutFixer } from "../agents/layout_fixer_agent"
import { mergeModules } from "../agents/merge"

const sessionDir = process.argv[2]
if (!sessionDir) {
  console.error("用法: bun run run_fixer.ts <session目录路径>")
  process.exit(1)
}

const debugPath = resolve(sessionDir, "debug.json")
const mergedPath = resolve(sessionDir, "merged.json")
const debug = JSON.parse(readFileSync(debugPath, "utf-8"))

const plannerEntry = debug.entries.find((e: any) => e.agent === "proto_planner_create")
const moduleEntries = debug.entries.filter((e: any) => e.agent === "proto_module_create" && e.parsed?.ui_json)

if (!plannerEntry?.parsed?.layout_planner) {
  console.error("debug.json 中未找到 planner 数据，尝试直接对 merged.json 跑 fixer")
  const merged = JSON.parse(readFileSync(mergedPath, "utf-8"))
  runAndOutput(merged)
} else {
  const planner = plannerEntry.parsed.layout_planner
  const modules = moduleEntries.map((e: any) => e.parsed.ui_json)
  const slots = planner.slots

  console.log(`[Rebuild] planner: ${planner.rootId}, slots: ${slots?.length}, modules: ${modules.length}`)

  const preFixerMerged = mergeModules(
    { rootId: planner.rootId, elements: planner.elements },
    modules,
    slots,
  )

  console.log(`[Rebuild] merge 完成, elements: ${preFixerMerged.elements.length}`)
  runAndOutput(preFixerMerged)
}

function runAndOutput(json: any) {
  const [fixed, fixerLog] = layoutFixer(json)

  if (fixerLog.length) {
    console.log("\n[Fixer] " + fixerLog.join("\n"))
    writeFileSync(resolve(sessionDir, "fixer.log"), fixerLog.join("\n"), "utf-8")
  } else {
    console.log("\n[Fixer] 无修正")
  }

  writeFileSync(mergedPath, JSON.stringify(fixed, null, 2), "utf-8")
  console.log(`\n已更新: ${mergedPath}`)

  const liveDataDir = resolve(sessionDir, "../../live-data")
  const liveDataPath = join(liveDataDir, "live-data.json")
  try {
    const { mkdirSync } = require("node:fs")
    mkdirSync(liveDataDir, { recursive: true })
  } catch {}
  writeFileSync(liveDataPath, JSON.stringify(fixed), "utf-8")
  console.log(`预览数据已写入: ${liveDataPath}`)
  console.log("打开 http://127.0.0.1:51856?fetch=live-data.json 查看渲染效果")
}
