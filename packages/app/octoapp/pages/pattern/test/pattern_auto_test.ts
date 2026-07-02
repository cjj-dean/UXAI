/**
 * Pattern 自动化测试脚本
 *
 * 用法:
 *   bun run packages/app/octoapp/pages/pattern/test/pattern_auto_test.ts \
 *     --input "一个服务器监控仪表盘" \
 *     --count 3 \
 *     --server http://localhost:4096 \
 *     --dir /path/to/project
 *
 * 输出:
 *   {output}/report.html — 交互式 HTML 报告，支持切换 N 次结果、查看日志文件
 *   {output}/run_{i}/    — 每次运行的完整产物（merged.json, fixer.log, debug.json, llm traces）
 */

import { parseArgs } from "node:util"
import { mkdir, writeFile, readFile, readdir, stat } from "node:fs/promises"
import { join, resolve, sep } from "node:path"
import { execSync } from "node:child_process"

// ─── CLI 参数 ───

const { values: args } = parseArgs({
  options: {
    input: { type: "string", short: "i" },
    count: { type: "string", short: "n", default: "3" },
    server: { type: "string", short: "s", default: "http://localhost:4096" },
    dir: { type: "string", short: "d" },
    output: { type: "string", short: "o" },
    model: { type: "string", short: "m", default: "" },
    help: { type: "boolean", short: "h", default: "false" },
  },
  strict: true,
})

if (args.help) {
  console.log(`
Pattern 自动化测试脚本

  --input, -i   用户输入的页面描述（必填）
  --count, -n   运行次数（默认 3）
  --server, -s  OpenCode server 地址（默认 http://localhost:4096）
  --dir, -d     工作目录（必填）
  --output, -o  报告输出目录（默认 ./pattern_test_output）
  --model, -m   模型，格式 providerID/modelID（可选，使用默认模型）
  --help, -h    显示帮助
`)
  process.exit(0)
}

const userInput = args.input
if (!userInput) {
  console.error("❌ 必须提供 --input 参数")
  process.exit(1)
}

const directory = args.dir ? resolve(args.dir) : undefined
if (!directory) {
  console.error("❌ 必须提供 --dir 参数")
  process.exit(1)
}

const runCount = Math.max(1, parseInt(args.count ?? "3", 10) || 3)
const serverUrl = args.server ?? "http://localhost:4096"
const outputDir = resolve(args.output ?? "./pattern_test_output")
const modelArg = args.model ?? ""

let modelKey: { providerID: string; modelID: string } | undefined
if (modelArg) {
  const [providerID, modelID] = modelArg.split("/")
  if (!providerID || !modelID) {
    console.error("❌ --model 格式应为 providerID/modelID")
    process.exit(1)
  }
  modelKey = { providerID, modelID }
}

console.log("═══════════════════════════════════════════")
console.log("  Pattern 自动化测试")
console.log("═══════════════════════════════════════════")
console.log(`  输入: ${userInput}`)
console.log(`  次数: ${runCount}`)
console.log(`  服务: ${serverUrl}`)
console.log(`  目录: ${directory}`)
console.log(`  输出: ${outputDir}`)
if (modelKey) console.log(`  模型: ${modelKey.providerID}/${modelKey.modelID}`)
console.log("═══════════════════════════════════════════\n")

// ─── SDK Client 初始化 ───

// 动态导入 SDK，因为脚本可能从 repo root 运行
const rootDir = resolve(join(__dirname, "../../../../../../../"))
const sdkPath = join(rootDir, "packages/sdk/js/src/v2/client.ts")

let createOpencodeClient: any
try {
  const mod = await import(sdkPath)
  createOpencodeClient = mod.createOpencodeClient
} catch {
  // 尝试从编译后的包导入
  try {
    const mod = await import("@opencode-ai/sdk/v2/client")
    createOpencodeClient = mod.createOpencodeClient
  } catch {
    console.error("❌ 无法导入 SDK，请确保路径正确")
    process.exit(1)
  }
}

const client = createOpencodeClient({
  baseUrl: serverUrl,
  directory,
  throwOnError: true,
})

// ─── JSON 解析工具（直接内联，避免路径问题） ───

function extractJson(text: string): Record<string, unknown> | null {
  if (!text || !text.trim()) return null
  text = text.replace(/[\u201C\u201D\u201E\u2018\u2019]/g, '"')
  let raw = text
  let match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n?```/)
  if (match) raw = match[1]
  else {
    let start = text.indexOf("{")
    let end = text.lastIndexOf("}")
    if (start !== -1 && end > start) raw = text.substring(start, end + 1)
  }
  if (tryParse(raw)) return tryParse(raw)!
  let searchFrom = 0
  while (true) {
    const nextStart = text.indexOf("{", searchFrom + 1)
    if (nextStart === -1) break
    const end = text.lastIndexOf("}")
    if (end <= nextStart) break
    const subRaw = text.substring(nextStart, end + 1)
    const parsed = tryParse(subRaw)
    if (parsed) return parsed
    searchFrom = nextStart
  }
  return null
}

function tryParse(raw: string): Record<string, unknown> | null {
  for (const repair of [null, repairUnescapedQuotes, repairBracketBalance, repairExtraBrackets] as const) {
    try {
      const input = repair ? repair(raw.trim()) : raw.trim()
      const parsed = JSON.parse(input)
      if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>
    } catch { }
  }
  return null
}

function repairBracketBalance(text: string): string {
  let depth = 0
  let lastValidEnd = text.length
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === "{" || c === "[") depth++
    else if (c === "}" || c === "]") {
      depth--
      if (depth === 0) { lastValidEnd = i + 1; break }
      if (depth < 0) break
    }
  }
  if (lastValidEnd < text.length && lastValidEnd > 0) {
    const candidate = text.substring(0, lastValidEnd)
    try { JSON.parse(candidate); return candidate } catch { }
  }
  return text
}

function repairExtraBrackets(text: string): string {
  let t = text
  for (let attempt = 0; attempt < 5; attempt++) {
    try { JSON.parse(t); return t } catch (e: any) {
      const m = String(e.message).match(/position (\d+)/)
      if (!m) break
      const pos = parseInt(m[1])
      const at = t[pos]
      if (at === "]" || at === "}") {
        t = t.substring(0, pos) + t.substring(pos + 1)
      } else {
        const before = t.substring(Math.max(0, pos - 10), pos)
        if (before.includes("}]")) {
          const idx = t.lastIndexOf("}]", pos)
          if (idx > -1 && idx + 2 < t.length && (t[idx + 2] === "]" || t[idx + 2] === "}")) {
            t = t.substring(0, idx + 2) + t.substring(idx + 3)
          } else break
        } else break
      }
    }
  }
  return t
}

function repairUnescapedQuotes(text: string): string {
  let result = ""
  let inString = false
  let escaped = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (escaped) { result += char; escaped = false; continue }
    if (char === "\\" && inString) { result += char; escaped = true; continue }
    if (char === '"') {
      if (!inString) { inString = true; result += char; continue }
      let j = i + 1
      while (j < text.length && /\s/.test(text[j])) j++
      if (j < text.length && (text[j] === ":" || text[j] === "," || text[j] === "}" || text[j] === "]")) {
        inString = false
        result += char
      } else {
        result += '\\"'
      }
      continue
    }
    result += char
  }
  return result
}

// ─── 轮询等待 LLM 完成 ───

async function getResultFromMessages(sessionId: string): Promise<string> {
  for (let attempt = 0; attempt < 300; attempt++) {
    await new Promise((r) => setTimeout(r, 2000))
    try {
      const res = await client.session.messages({ sessionID: sessionId })
      const items = res.data
      if (!items || items.length === 0) continue
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].info.role !== "assistant") continue
        const item = items[i]
        const msg = item.info
        if (msg.time?.completed == null) break
        const texts: string[] = []
        for (let j = 0; j < item.parts.length; j++) {
          const part = item.parts[j]
          if (part.type === "text" && part.text) texts.push(part.text)
        }
        if (texts.length > 0) return texts.join("\n")
        break
      }
    } catch { }
  }
  throw new Error(`Timeout waiting for session ${sessionId}`)
}

// ─── Child Session 执行 ───

async function runChildSession(
  agent: string,
  prompt: string,
  parentSessionID: string,
  isRoot = false,
): Promise<{ text: string; childSessionId: string }> {
  let childSessionId: string
  if (isRoot) {
    const result = await client.session.get({ sessionID: parentSessionID })
    childSessionId = parentSessionID
  } else {
    const childResult = await client.session.create({
      directory,
      parentID: parentSessionID,
      agent,
    })
    childSessionId = childResult.data.id
  }

  const effectiveModel = modelKey ?? undefined
  await client.session.promptAsync({
    agent,
    model: effectiveModel,
    sessionID: childSessionId,
    parts: [{ type: "text", text: prompt }],
  })

  const result = await getResultFromMessages(childSessionId)
  return { text: result, childSessionId }
}

// ─── Agent 调用（与前端逻辑一致） ───

async function runIntent(rootSession: string, userInput: string) {
  const prompt = `[用户的需求:] ==================================\n${userInput}\n\n请开始意图扩展。`
  console.log("  [1/4] 意图扩展 ...")
  const startTime = Date.now()
  const result = await runChildSession("proto_intent", prompt, rootSession)
  console.log(`  [1/4] 意图扩展完成 (${((Date.now() - startTime) / 1000).toFixed(1)}s)`)
  const intentJson = extractJson(result.text)
  if (!intentJson) throw new Error("Intent did not return valid JSON")
  return { intent_description: intentJson, intent_page: simplifyData(intentJson) }
}

async function runPlannerCreate(rootSession: string, intentDescription: Record<string, unknown>) {
  const descStr = JSON.stringify(intentDescription)
  const intentSectionCount = (intentDescription.sections as Array<any> ?? []).length
  const hasSidebar = (intentDescription.sectionDetailList as Array<any> ?? []).some(
    (s: any) => s.id?.toLowerCase().includes("sidebar") || s.id?.toLowerCase().includes("side"),
  )
  const plannerValidateLog: string[] = []
  let planner: any = null
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt = `请根据以下页面蓝图，设计外壳布局并指定下一步细化模块：\n[Page Blue_print:] ==================================\n\n${attempt === 0 ? descStr : descStr.replace(/\}\s*$/, `, "__planner_feedback__": ${JSON.stringify(formatValidationFeedback(plannerValidateLog as any))} }`)}`
    console.log(`  [2/4] 布局规划 (attempt ${attempt + 1}) ...`)
    const startTime = Date.now()
    const result = await runChildSession("proto_planner_create", prompt, rootSession)
    console.log(`  [2/4] 布局规划完成 (${((Date.now() - startTime) / 1000).toFixed(1)}s)`)
    const plannerJson = extractJson(result.text)
    if (!plannerJson) { plannerValidateLog.push(`[planner_validate] attempt ${attempt + 1}: no valid JSON`); continue }
    planner = { layout_planner: plannerJson }
    const layout = plannerJson as any
    if (!layout?.elements || !layout?.slots) continue
    // 内联 validatePlannerOutput 逻辑
    const issues = validatePlannerOutput(layout, intentSectionCount, hasSidebar)
    const errors = issues.filter((i: any) => i.severity === "error")
    if (errors.length === 0) {
      const warnCount = issues.filter((i: any) => i.severity === "warning").length
      plannerValidateLog.push(`[planner_validate] 校验通过${warnCount > 0 ? `（${warnCount} 个警告）` : ""}`)
      break
    }
    plannerValidateLog.push(`[planner_validate] 第 ${attempt + 1} 次输出有 ${errors.length} 个错误`)
  }
  return { planner, plannerValidateLog }
}

async function runModuleCreate(rootSession: string, slot: any, layoutPlanner: any, intentDescription: any) {
  const sectionDetailList = intentDescription.sectionDetailList ?? []
  const sectionDetail = sectionDetailList.find((item: any) => item?.id === slot.section_id) ?? {}
  const sections = intentDescription.sections ?? []
  const elements = layoutPlanner.elements ?? []
  const slotElement = elements.find((e: any) => e?.id === slot.element_id) ?? {}
  const constraints = sectionDetail.constraints ?? []
  const constraintsStr = constraints.length
    ? constraints.map((c: any) => `${c.type}:${c.value} (${c.description})`).join("; ")
    : "无"

  const prompt = `请为以下模块生成 A2UI JSON：\n\n[完整页面蓝图:] ==================================\n- 布局描述: ${intentDescription.layoutDescription ?? ""}\n- 页面结构: ${JSON.stringify(sections, null, 2)}\n\n[模块顶层容器:] ==================================\n- Root ID: ${slot.element_id}\n- Root UI:\n  ${JSON.stringify(slotElement, null, 2)}\n\n[⚠️ 本模块约束（必须遵循）:] ==================================\n${constraintsStr}\n\n[需要被渲染的模块详细蓝图:] ==================================\n${JSON.stringify(sectionDetail, null, 2)}\n\n[需要被渲染模块的根节点:] ${slot.element_id}\n[模块内部元素id前缀:] ${slot.id_prefix} (注：该模块内所有 element id 必须以此开头)\n\n**CRITICAL — Path 语法约束：**\n- 数据绑定 path 禁止使用 ".."\n- 正确示例：{ "path": "/topMenuItems" } 和 { "path": "/bottomMenuItems" }\n- 错误示例：{ "path": "/menuItems/0/../8" }\n\n如果需要使用 Section 和 Icon 以外的组件，调用 \`load_components_docs\` 工具查询 API（只有一次机会，一次性传入全部组件名）。\n如果只需要 Section 和 Icon，无需调用任何工具，直接输出 JSON。\n无论是否调用工具，你的最终回复必须是一个纯 JSON 对象（以 { 开头，以 } 结尾），禁止输出思考过程、分析或任何自然语言。`

  const result = await runChildSession("proto_module_create", prompt, rootSession)
  const moduleJson = extractJson(result.text)
  if (!moduleJson) throw new Error(`Module create for ${slot.section_id} did not return valid JSON`)
  return { ui_json: moduleJson, section_id: slot.section_id, element_id: slot.element_id, id_prefix: slot.id_prefix }
}

// ─── 内联 validatePlannerOutput ───

function validatePlannerOutput(planner: any, sectionCount: number, hasSidebar: boolean) {
  const issues: Array<{ severity: string; message: string; detail: string }> = []
  const elMap = new Map<string, any>()
  const referenced = new Set<string>()
  for (const el of planner.elements ?? []) {
    elMap.set(el.id, el)
    if (Array.isArray(el.children)) {
      for (const c of el.children) { if (typeof c === "string") referenced.add(c) }
    }
  }
  const root = elMap.get(planner.rootId)
  if (!root) { issues.push({ severity: "error", message: "rootId 不存在", detail: `rootId "${planner.rootId}" 在 elements 中未找到` }); return issues }
  if (![...elMap.values()].some((e) => e.component === "main")) issues.push({ severity: "error", message: "缺少 <main>", detail: "页面必须有 <main> 元素" })
  if (![...elMap.values()].some((e) => e.component === "header")) issues.push({ severity: "error", message: "缺少 <header>", detail: "页面必须有 <header> 元素" })
  if (hasSidebar && ![...elMap.values()].some((e) => e.component === "aside")) issues.push({ severity: "error", message: "缺少 <aside>", detail: "页面包含侧边栏但无 <aside>" })
  for (const slot of planner.slots ?? []) { if (!elMap.has(slot.element_id)) issues.push({ severity: "error", message: `slot "${slot.element_id}" 不在 elements 中`, detail: `slot section_id="${slot.section_id}" 引用了不存在的 element_id` }) }
  for (const slot of planner.slots ?? []) { if (!referenced.has(slot.element_id) && elMap.has(slot.element_id)) issues.push({ severity: "error", message: `slot "${slot.element_id}" 是孤儿`, detail: `slot 元素未被任何父元素引用` }) }
  if ((planner.slots ?? []).length !== sectionCount) issues.push({ severity: "error", message: "section/slot 不匹配", detail: `intent 有 ${sectionCount} 个 section，planner 有 ${(planner.slots ?? []).length} 个 slot` })
  return issues
}

function formatValidationFeedback(issues: Array<{ severity: string; message: string; detail: string }>): string {
  return issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}: ${i.detail}`).join("\n")
}

// ─── Merge（内联） ───

function mergeModules(shell: any, modules: any[], slots?: any[]): any {
  const elements = shell.elements.map((e: any) => ({ ...e, props: e.props ? { ...e.props } : {}, children: Array.isArray(e.children) ? [...e.children] : e.children }))
  const state = { ...(shell.state ?? {}) }
  const rootIdRemap = new Map<string, string>()
  if (slots && modules.length === slots.length) {
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].rootId !== slots[i].element_id) rootIdRemap.set(modules[i].rootId, slots[i].element_id)
    }
  }
  for (const mod of modules) {
    const remappedId = rootIdRemap.get(mod.rootId) ?? mod.rootId
    let slotIndex = elements.findIndex((e: any) => e.id === mod.rootId || e.id === remappedId)
    if (slotIndex === -1) { elements.push({ id: mod.rootId, component: "div", props: {}, children: [] }); slotIndex = elements.length - 1 }
    const modRoot = mod.elements.find((e: any) => e.id === mod.rootId)
    if (modRoot) {
      elements[slotIndex].component = modRoot.component
      if (modRoot.props) elements[slotIndex].props = { ...modRoot.props }
      if (modRoot.children) elements[slotIndex].children = Array.isArray(modRoot.children) ? [...modRoot.children] : modRoot.children
    }
    for (const el of mod.elements) {
      if (el.id === mod.rootId) continue
      const existing = elements.findIndex((e: any) => e.id === el.id)
      if (existing !== -1) { elements[existing] = { ...el, props: el.props ? { ...el.props } : {}, children: Array.isArray(el.children) ? [...el.children] : el.children } }
      else elements.push({ ...el, props: el.props ? { ...el.props } : {}, children: Array.isArray(el.children) ? [...el.children] : el.children })
    }
    if (mod.state) Object.assign(state, mod.state)
  }
  if (slots) {
    const referenced = new Set<string>()
    for (const el of elements) { if (Array.isArray(el.children)) for (const c of el.children) if (typeof c === "string") referenced.add(c) }
    const mainEl = elements.find((e: any) => e.component === "main")
    const rootEl = elements.find((e: any) => e.id === shell.rootId)
    const fallback = mainEl ?? rootEl
    if (fallback) {
      for (const slot of slots) {
        if (referenced.has(slot.element_id)) continue
        if (!Array.isArray(fallback.children)) fallback.children = []
        fallback.children.push(slot.element_id)
        referenced.add(slot.element_id)
      }
    }
  }
  return { rootId: shell.rootId, elements, state }
}

// ─── simplifyData（内联） ───

function simplifyData(complexData: any) {
  const data = complexData ?? {}
  const pageDescription = data.intentAnalysis ?? ""
  const layoutDescription = data.layoutDescription ?? ""
  const sectionDetailList = data.sectionDetailList ?? []
  const detailMap = sectionDetailList.reduce((map: any, detail: any) => { if (detail?.id) map[detail.id] = detail; return map }, {})
  const sections = (data.sections ?? []).map((section: any) => {
    const detail = detailMap[section?.id] ?? {}
    return { id: section?.id, name: section?.name, intent: detail.intent ?? "", function: detail.function ?? "" }
  })
  return { pageDescription, layoutDescription, sections }
}

// ─── Layout Fixer（导入） ───

async function loadLayoutFixer() {
  const fixerPath = join(__dirname, "../agents/layout_fixer_agent/index.ts")
  try {
    const mod = await import(fixerPath)
    return mod.layoutFixer ?? mod.default
  } catch {
    console.warn("⚠️ 无法导入 layoutFixer，跳过算法修正")
    return null
  }
}

// ─── 单次 Pattern 完整流程 ───

interface RunResult {
  index: number
  success: boolean
  error?: string
  durationMs: number
  pageJson?: any
  intentDescription?: any
  intentPage?: any
  layoutPlanner?: any
  modulesJson?: any[]
  fixerLog?: string[]
  plannerValidateLog?: string[]
  sessionId?: string
  childSessionIds?: string[]
  artifactsDir?: string
}

async function runPattern(index: number): Promise<RunResult> {
  const runDir = join(outputDir, `run_${index}`)
  await mkdir(runDir, { recursive: true })

  const result: RunResult = { index, success: false, durationMs: 0, childSessionIds: [] }
  const startTime = Date.now()

  try {
    // 1. 创建根 session
    const sessionResult = await client.session.create({ directory, agent: "proto_triage" })
    const rootSessionId = sessionResult.data.id
    result.sessionId = rootSessionId

    // 2. 意图扩展
    const intentResult = await runIntent(rootSessionId, userInput!)
    result.intentDescription = intentResult.intent_description
    result.intentPage = intentResult.intent_page
    await writeFile(join(runDir, "intent.json"), JSON.stringify(intentResult.intent_description, null, 2), "utf-8")

    // 3. 布局规划
    const { planner, plannerValidateLog } = await runPlannerCreate(rootSessionId, intentResult.intent_description)
    result.plannerValidateLog = plannerValidateLog
    if (!planner) throw new Error("Planner failed after retries")
    result.layoutPlanner = planner.layout_planner
    await writeFile(join(runDir, "planner.json"), JSON.stringify(planner.layout_planner, null, 2), "utf-8")
    if (plannerValidateLog.length) {
      await writeFile(join(runDir, "planner_validate.log"), plannerValidateLog.join("\n"), "utf-8")
    }

    // 4. 并行模块生成
    const slots = (planner.layout_planner as any).slots as Array<any>
    console.log(`  [3/4] 并行生成 ${slots.length} 个模块 ...`)
    const modStartTime = Date.now()
    const modules = await Promise.all(
      slots.map(slot => runModuleCreate(rootSessionId, slot, planner.layout_planner, intentResult.intent_description))
    )
    console.log(`  [3/4] 模块生成完成 (${((Date.now() - modStartTime) / 1000).toFixed(1)}s)`)
    result.modulesJson = modules.map(m => m.ui_json)

    // 5. 合并
    const merged = mergeModules(
      { rootId: (planner.layout_planner as any).rootId, elements: (planner.layout_planner as any).elements },
      modules.map(m => m.ui_json) as any,
      (planner.layout_planner as any).slots,
    )
    await writeFile(join(runDir, "merged_raw.json"), JSON.stringify(merged, null, 2), "utf-8")

    // 6. Layout Fixer
    const fixerFn = await loadLayoutFixer()
    let fixed = merged
    let fixerLog: string[] = []
    if (fixerFn) {
      const [fixedResult, log] = fixerFn(merged)
      fixed = fixedResult
      fixerLog = log
    }
    result.fixerLog = fixerLog
    result.pageJson = fixed

    // 7. 保存产物
    await writeFile(join(runDir, "merged.json"), JSON.stringify(fixed, null, 2), "utf-8")
    if (fixerLog.length) await writeFile(join(runDir, "fixer.log"), fixerLog.join("\n"), "utf-8")

    // 8. 复制 LLM trace 文件
    await copyLLMTraces(rootSessionId, runDir)

    result.success = true
    result.artifactsDir = runDir
  } catch (err: any) {
    result.error = err.message ?? String(err)
    console.error(`  ❌ Run ${index + 1} 失败: ${result.error}`)
  }

  result.durationMs = Date.now() - startTime
  return result
}

// ─── 复制 LLM trace 文件 ───

async function copyLLMTraces(sessionId: string, targetDir: string) {
  // LLM trace 文件存放在 {InstanceState}/pattern/workflow/{sessionId}/
  // 以及 session 级别的 llm trace（由 llm.ts 写入）
  // 由于我们无法直接获取 InstanceState 目录，改为记录 session ID 供报告引用
  const traceDir = join(targetDir, "llm_traces")
  await mkdir(traceDir, { recursive: true })

  // 写一个映射文件，说明在哪里找 trace
  await writeFile(
    join(traceDir, "_trace_info.txt"),
    `Session ID: ${sessionId}\nLLM traces are in: {workspace}/pattern/workflow/${sessionId}/\n`,
    "utf-8",
  )

  // 尝试从 workspace 的 pattern/workflow/{sid} 目录复制
  const possibleTraceDir = join(directory!, "pattern", "workflow", sessionId)
  try {
    const entries = await readdir(possibleTraceDir)
    for (const entry of entries) {
      const src = join(possibleTraceDir, entry)
      const s = await stat(src)
      if (s.isFile()) {
        const content = await readFile(src)
        await writeFile(join(traceDir, entry), content)
      }
    }
    console.log(`  📋 已复制 ${entries.length} 个 LLM trace 文件`)
  } catch {
    // trace 目录可能不存在（非 Electron 环境或尚未写入）
  }
}

// ─── HTML 报告生成 ───

function generateHTML(results: RunResult[]): string {
  const timestamp = new Date().toLocaleString("zh-CN")
  const successCount = results.filter(r => r.success).length
  const failCount = results.length - successCount

  // 为每次运行生成内联的 A2UI JSON 数据
  const runDataBlocks = results.map((r, i) => {
    const pageJsonStr = r.pageJson ? JSON.stringify(r.pageJson) : "null"
    return `const run${i}Data = ${pageJsonStr};`
  }).join("\n  ")

  // 为每次运行生成日志文件内容
  const logBlocks = results.map((r, i) => {
    const logs: string[] = []
    if (r.error) logs.push(`❌ 错误: ${escapeHtml(r.error)}`)
    if (r.plannerValidateLog?.length) logs.push(`📋 Planner 校验日志:\n${r.plannerValidateLog.map(l => escapeHtml(l)).join("\n")}`)
    if (r.fixerLog?.length) logs.push(`🔧 Fixer 日志:\n${r.fixerLog.map(l => escapeHtml(l)).join("\n")}`)
    logs.push(`⏱️ 耗时: ${(r.durationMs / 1000).toFixed(1)}s`)
    if (r.sessionId) logs.push(`🆔 Session: ${r.sessionId}`)
    return `const run${i}Logs = ${JSON.stringify(logs.join("\n\n"))};`
  }).join("\n  ")

  const tabs = results.map((r, i) => {
    const status = r.success ? "✅" : "❌"
    const time = (r.durationMs / 1000).toFixed(1)
    return `<button class="tab-btn${i === 0 ? " active" : ""}" onclick="switchRun(${i})" id="tab-${i}">Run ${i + 1} ${status} (${time}s)</button>`
  }).join("\n        ")

  const previewSections = results.map((r, i) => {
    return `<div class="preview-panel${i === 0 ? "" : " hidden"}" id="preview-${i}">
          <div class="preview-toolbar">
            <button onclick="openInVuePreviewer(${i})" title="在 Vue 预览器中打开">👁️ 预览器打开</button>
            <button onclick="copyJson(${i})" title="复制 A2UI JSON">📋 复制 JSON</button>
            <button onclick="openArtifacts(${i})" title="查看产物文件">📁 产物目录</button>
          </div>
          <div class="preview-split">
            <div class="preview-render" id="render-area-${i}">
              <div class="render-placeholder">点击 "👁️ 预览器打开" 在 Vue 预览器中渲染</div>
            </div>
            <div class="preview-json">
              <pre id="json-view-${i}">${r.pageJson ? escapeHtml(JSON.stringify(r.pageJson, null, 2)) : escapeHtml(r.error ?? "No data")}</pre>
            </div>
          </div>
        </div>`
  }).join("\n        ")

  const logSections = results.map((r, i) => {
    return `<div class="log-panel${i === 0 ? "" : " hidden"}" id="log-${i}">
          <pre>${escapeHtml(
    [
      r.error ? `❌ 错误: ${r.error}` : "",
      r.plannerValidateLog?.length ? `📋 Planner 校验:\n${r.plannerValidateLog.join("\n")}` : "",
      r.fixerLog?.length ? `🔧 Fixer 日志:\n${r.fixerLog.join("\n")}` : "",
      `⏱️ 耗时: ${(r.durationMs / 1000).toFixed(1)}s`,
      r.sessionId ? `🆔 Session: ${r.sessionId}` : "",
      r.intentPage ? `📝 意图:\n${JSON.stringify(r.intentPage, null, 2)}` : "",
    ].filter(Boolean).join("\n\n")
  )}</pre>
        </div>`
  }).join("\n        ")

  // 生成 trace 文件链接区域
  const traceSections = results.map((r, i) => {
    if (!r.artifactsDir) return `<div class="trace-panel hidden" id="trace-${i}"><p>无产物目录</p></div>`
    return `<div class="trace-panel${i === 0 ? "" : " hidden"}" id="trace-${i}">
          <p>产物目录: <code>${escapeHtml(r.artifactsDir)}</code></p>
          <div id="trace-files-${i}"></div>
        </div>`
  }).join("\n        ")

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pattern 自动化测试报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; color: #333; }
    .header { background: #1a1a2e; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 18px; font-weight: 600; }
    .header .meta { font-size: 13px; opacity: 0.8; }
    .container { max-width: 100%; padding: 16px; }
    .stats { display: flex; gap: 12px; margin-bottom: 16px; }
    .stat-card { background: white; border-radius: 8px; padding: 12px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; text-align: center; }
    .stat-card .label { font-size: 12px; color: #888; }
    .stat-card .value { font-size: 24px; font-weight: 700; }
    .stat-card.success .value { color: #22c55e; }
    .stat-card.fail .value { color: #ef4444; }
    .stat-card.total .value { color: #3b82f6; }
    .user-input { background: white; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .user-input .label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .user-input .text { font-size: 14px; font-weight: 500; }
    .tabs { display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap; }
    .tab-btn { padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; font-size: 13px; transition: all 0.2s; }
    .tab-btn:hover { background: #f0f0f0; }
    .tab-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
    .tab-btn.fail { border-left: 3px solid #ef4444; }
    .tab-btn.success-tab { border-left: 3px solid #22c55e; }
    .panel { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
    .sub-tabs { display: flex; border-bottom: 1px solid #eee; }
    .sub-tab { padding: 10px 20px; cursor: pointer; font-size: 13px; border-bottom: 2px solid transparent; transition: all 0.2s; }
    .sub-tab:hover { background: #f9f9f9; }
    .sub-tab.active { border-bottom-color: #3b82f6; color: #3b82f6; font-weight: 500; }
    .hidden { display: none !important; }
    .preview-panel, .log-panel, .trace-panel { padding: 16px; }
    .preview-toolbar { display: flex; gap: 8px; margin-bottom: 12px; }
    .preview-toolbar button { padding: 6px 14px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; font-size: 12px; }
    .preview-toolbar button:hover { background: #f0f0f0; }
    .preview-split { display: flex; gap: 16px; height: 600px; }
    .preview-render { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; overflow: auto; background: #fafafa; display: flex; align-items: center; justify-content: center; }
    .render-placeholder { color: #aaa; font-size: 14px; }
    .preview-json { width: 45%; overflow: auto; }
    .preview-json pre { font-size: 11px; line-height: 1.5; white-space: pre-wrap; word-break: break-all; }
    .log-panel pre, .trace-panel pre { font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
    .trace-panel code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
    .diff-container { margin-top: 12px; }
    .diff-actions { display: flex; gap: 8px; margin-bottom: 8px; }
    .diff-actions select { padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }
    .diff-result { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; max-height: 400px; overflow: auto; background: #fafafa; }
    .diff-add { background: #dcfce7; }
    .diff-del { background: #fee2e2; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; z-index: 1000; transition: opacity 0.3s; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧪 Pattern 自动化测试报告</h1>
    <div class="meta">${escapeHtml(timestamp)} | 输入: ${escapeHtml((userInput ?? "").slice(0, 80))}</div>
  </div>
  <div class="container">
    <div class="stats">
      <div class="stat-card total"><div class="label">总运行次数</div><div class="value">${results.length}</div></div>
      <div class="stat-card success"><div class="label">成功</div><div class="value">${successCount}</div></div>
      <div class="stat-card fail"><div class="label">失败</div><div class="value">${failCount}</div></div>
      <div class="stat-card"><div class="label">平均耗时</div><div class="value">${results.length ? (results.reduce((s, r) => s + r.durationMs, 0) / results.length / 1000).toFixed(1) : "0"}s</div></div>
    </div>
    <div class="user-input">
      <div class="label">用户输入</div>
      <div class="text">${escapeHtml(userInput ?? "")}</div>
    </div>
    <div class="tabs">
      ${tabs}
    </div>
    <div class="panel">
      <div class="sub-tabs">
        <div class="sub-tab active" onclick="switchSubTab('preview')">🖥️ 渲染结果</div>
        <div class="sub-tab" onclick="switchSubTab('json')">📄 JSON 数据</div>
        <div class="sub-tab" onclick="switchSubTab('log')">📋 日志</div>
        <div class="sub-tab" onclick="switchSubTab('trace')">📁 LLM Trace</div>
        <div class="sub-tab" onclick="switchSubTab('diff')">🔀 Diff 对比</div>
      </div>
      ${previewSections}
      ${logSections}
      ${traceSections}
      <div class="diff-container" id="diff-section">
        <div class="diff-actions">
          <label>对比 Run: </label>
          <select id="diff-a">${results.map((_, i) => `<option value="${i}">Run ${i + 1}</option>`).join("")}</select>
          <span>vs</span>
          <select id="diff-b">${results.map((_, i) => `<option value="${i}"${i === 1 ? " selected" : ""}>Run ${i + 1}</option>`).join("")}</select>
          <button onclick="runDiff()">对比</button>
        </div>
        <div class="diff-result" id="diff-output">选择两次运行进行对比</div>
      </div>
    </div>
  </div>
  <div id="toast" class="toast" style="display:none"></div>

  <script>
    ${runDataBlocks}
    ${logBlocks}

    let currentRun = 0
    let currentSubTab = "preview"
    const allRuns = [${results.map((_, i) => i).join(", ")}]

    function switchRun(idx) {
      currentRun = idx
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"))
      document.getElementById("tab-" + idx)?.classList.add("active")

      // 隐藏所有面板
      document.querySelectorAll(".preview-panel, .log-panel, .trace-panel").forEach(p => p.classList.add("hidden"))
      // 显示当前
      showCurrentSubTab()
    }

    function switchSubTab(tab) {
      currentSubTab = tab
      document.querySelectorAll(".sub-tab").forEach(t => t.classList.remove("active"))
      event.target.classList.add("active")

      document.querySelectorAll(".preview-panel, .log-panel, .trace-panel, #diff-section").forEach(p => p.classList.add("hidden"))

      showCurrentSubTab()
    }

    function showCurrentSubTab() {
      const idx = currentRun
      if (currentSubTab === "preview" || currentSubTab === "json") {
        document.getElementById("preview-" + idx)?.classList.remove("hidden")
      } else if (currentSubTab === "log") {
        document.getElementById("log-" + idx)?.classList.remove("hidden")
      } else if (currentSubTab === "trace") {
        document.getElementById("trace-" + idx)?.classList.remove("hidden")
      } else if (currentSubTab === "diff") {
        document.getElementById("diff-section")?.classList.remove("hidden")
      }
    }

    function copyJson(idx) {
      const data = window["run" + idx + "Data"]
      if (!data) { showToast("无 JSON 数据"); return }
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => showToast("JSON 已复制"))
    }

    function openInVuePreviewer(idx) {
      const data = window["run" + idx + "Data"]
      if (!data) { showToast("无渲染数据"); return }
      // 将 JSON 写入 localStorage 并打开 Vue 预览器
      const key = "a2ui_preview_data"
      localStorage.setItem(key, JSON.stringify(data))
      // 打开 Vue 预览页面，通过 postMessage 发送数据
      const vueUrl = "http://127.0.0.1:51856"
      const w = window.open(vueUrl, "_blank")
      if (w) {
        const send = () => {
          try {
            w.postMessage({ type: "A2UI_UPDATE", payload: data }, "*")
          } catch {}
        }
        // 多次尝试发送（等待页面加载）
        setTimeout(send, 500)
        setTimeout(send, 1500)
        setTimeout(send, 3000)
      }
    }

    function openArtifacts(idx) {
      const el = document.getElementById("trace-files-" + idx)
      if (el) el.innerHTML = "<p>产物目录已在日志中列出，请查看文件系统</p>"
      showToast("产物目录路径已复制到剪贴板")
    }

    function runDiff() {
      const a = parseInt(document.getElementById("diff-a").value)
      const b = parseInt(document.getElementById("diff-b").value)
      const dataA = window["run" + a + "Data"]
      const dataB = window["run" + b + "Data"]
      if (!dataA || !dataB) { document.getElementById("diff-output").textContent = "至少一次运行无 JSON 数据"; return }
      const strA = JSON.stringify(dataA, null, 2)
      const strB = JSON.stringify(dataB, null, 2)
      const diff = simpleDiff(strA, strB)
      document.getElementById("diff-output").innerHTML = diff
    }

    function simpleDiff(a, b) {
      const linesA = a.split("\\n")
      const linesB = b.split("\\n")
      let html = ""
      const maxLen = Math.max(linesA.length, linesB.length)
      let changes = 0
      for (let i = 0; i < maxLen; i++) {
        const la = linesA[i] ?? ""
        const lb = linesB[i] ?? ""
        if (la === lb) {
          html += '<div>' + escHtml(la) + '</div>'
        } else {
          changes++
          if (la) html += '<div class="diff-del">- ' + escHtml(la) + '</div>'
          if (lb) html += '<div class="diff-add">+ ' + escHtml(lb) + '</div>'
        }
      }
      return changes === 0 ? '<div style="color:#22c55e">✅ 两次运行结果完全相同</div>' : html
    }

    function escHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    function showToast(msg) {
      const t = document.getElementById("toast")
      t.textContent = msg
      t.style.display = "block"
      t.style.opacity = "1"
      setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.style.display = "none", 300) }, 2000)
    }

    // 键盘快捷键: 左右箭头切换 Run
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && currentRun > 0) switchRun(currentRun - 1)
      if (e.key === "ArrowRight" && currentRun < ${results.length - 1}) switchRun(currentRun + 1)
    })
  </script>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// ─── 主流程 ───

async function main() {
  await mkdir(outputDir, { recursive: true })

  const results: RunResult[] = []

  for (let i = 0; i < runCount; i++) {
    console.log(`\n${"═".repeat(50)}`)
    console.log(`  🔄 Run ${i + 1} / ${runCount}`)
    console.log(`${"═".repeat(50)}\n`)

    const result = await runPattern(i)
    results.push(result)

    const status = result.success ? "✅ 成功" : "❌ 失败"
    console.log(`\n  ${status} | 耗时: ${(result.durationMs / 1000).toFixed(1)}s\n`)
  }

  // 生成 HTML 报告
  const html = generateHTML(results)
  const reportPath = join(outputDir, "report.html")
  await writeFile(reportPath, html, "utf-8")

  // 保存汇总数据
  const summary = {
    userInput,
    runCount,
    serverUrl,
    directory,
    modelKey,
    timestamp: new Date().toISOString(),
    results: results.map(r => ({
      index: r.index,
      success: r.success,
      durationMs: r.durationMs,
      error: r.error,
      sessionId: r.sessionId,
      artifactsDir: r.artifactsDir,
    })),
  }
  await writeFile(join(outputDir, "summary.json"), JSON.stringify(summary, null, 2), "utf-8")

  console.log(`\n${"═".repeat(50)}`)
  console.log(`  📊 测试报告已生成`)
  console.log(`${"═".repeat(50)}`)
  console.log(`  报告: ${reportPath}`)
  console.log(`  成功: ${results.filter(r => r.success).length} / ${runCount}`)
  console.log(`  平均耗时: ${(results.reduce((s, r) => s + r.durationMs, 0) / results.length / 1000).toFixed(1)}s`)
  console.log(`\n  提示: 用浏览器打开 report.html 查看交互式报告`)
  console.log(`  快捷键: ← → 切换运行结果\n`)
}

main().catch(console.error)
