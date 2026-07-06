/**
 * Stream vs Block 对比基准测试（完整 Pattern Pipeline）
 *
 * 用法:
 *   bun run packages/app/octoapp/pages/pattern/test/stream_vs_block_bench.ts \
 *     --server http://localhost:4096 \
 *     --dir D:\vibeCoding\test \
 *     --model qyc-deepseek/deepseek-v4-flash \
 *     -n 5
 *
 * 前提: opencode server 已启动
 *   cd packages/opencode && bun run --conditions=browser ./src/index.ts serve --port 4096
 */

import { parseArgs } from "node:util"
import { mkdir, writeFile, readFile, readdir, stat } from "node:fs/promises"
import { join, resolve } from "node:path"

const { values: args } = parseArgs({
  options: {
    server: { type: "string", short: "s", default: "http://localhost:4096" },
    dir: { type: "string", short: "d" },
    model: { type: "string", short: "m", default: "" },
    count: { type: "string", short: "n", default: "5" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
})

if (args.help) {
  console.log(`
Stream vs Block 对比基准测试（完整 Pattern Pipeline）

  --server, -s  OpenCode server 地址（默认 http://localhost:4096）
  --dir, -d     工作目录（必填）
  --model, -m   模型，格式 providerID/modelID（可选）
  --count, -n   每种模式运行次数（默认 5）
  --help, -h    显示帮助
`)
  process.exit(0)
}

const directory = args.dir ? resolve(args.dir) : undefined
if (!directory) {
  console.error("必须提供 --dir 参数")
  process.exit(1)
}

const serverUrl = args.server ?? "http://localhost:4096"
const runCount = Math.max(1, parseInt(args.count ?? "5", 10) || 5)
const modelArg = args.model ?? ""
const outputDir = resolve(join(__dirname, "../bench_results"))

let modelKey: { providerID: string; modelID: string } | undefined
if (modelArg) {
  const [providerID, modelID] = modelArg.split("/")
  if (!providerID || !modelID) {
    console.error("--model 格式应为 providerID/modelID")
    process.exit(1)
  }
  modelKey = { providerID, modelID }
}

const USER_INPUT = `页面整体由两大板块组成：顶部导航栏和主内容区。

顶部导航栏分为左右两端对齐排布。左侧区域水平排布：华为Logo，华为坤灵文本，带有向下折叠箭头图标的纯文本项目名称。右侧区域水平居中依次排布三个元素：带有红色badage的通知铃铛图标、个人用户头像图标、以及一个返回首页的按钮。

主内容区中包含左侧固定菜单栏和右侧主内容区。
左侧菜单栏是缩略版的菜单栏，固定宽度54px，采用纵向纯图标排布，上方模块垂直排布 8 个功能图标，其中第 5 个终端设备图标处于高亮选中状态。在最下方垂直排布 2 个功能图标。

主内容区上半部分数据概览区内横向等宽、等距排布 5 个[独立区块]的图表卡片模块，每个卡片固定高度300px。

卡片 1 标题为终端类型，标题下方放置一个环形图和图例，中心垂直排布大字号数字 12 及下方文本总数。数据依次为：手机33.33%，家居设备 33.33%，平板 16.67%，其他 16.67%。

卡片 2 标题为接入类型，结构与卡片 1 一致，中心数字为 12 及总数。数据依次为：有线 66.66%，无线 33.34%。

卡片 3 标题为终端流量使用，标题右侧带问号提示图标，卡片右上角有一个 Top5 dropdown选择器。标题下方是Top5的图表展示，数据依次为：iphone12 1869MB，oppo 1016MB，mate70 664MB，iphone16 167MB，ipad 167MB，括号内的 MAC 地址请使用虚拟数据占位。

卡片 4 标题为应用流量使用，带问号提示图标。结构与卡片 3 相同。5 组数据依次为：微信 1869MB，支付宝 1016MB，抖音 664MB，淘宝 167MB，微博 167MB。

卡片 5 标题为终端在线时长。内部为一个基础垂直柱状图。左侧纵轴顶部文本为终端数，刻度依次为 0、20、40、60、80、100。底部横轴标签依次为小于1h、1-3h、3-6h、6-8h、大于8h，对应 5 根高度不同的垂直柱子。

下半部分终端用户管理模块[独立区块]，顶部左侧为独立大标题终端用户。标题正下方为表格工具栏，采用左右两端对齐排布。左侧排布一个定宽的搜索输入框，内含搜索图标与 "请输入搜索内容" 的 placeholder，以及一个带有向上折叠箭头的高级搜索文本操作按钮。右侧依次排布带有下拉箭头的按钮"立即扫描"和四个普通按钮，内容依次是"IP/MAC解绑"、"IP/MAC绑定"、"已守护列表"、"已限速列表"，以及一个刷新图标。

工具栏下方为核心数据表格。表头包含 18 个列字段，从左至右依次为：全选复选框、终端名称、终端类型、IP地址、MAC地址、VLAN、厂商、型号、系统、在线时长、接入时间、上行速率、下行速率、流量消耗、接入设备、守护、连接、操作。

表格内部展示 8 行数据。每行最左侧固定为未勾选的单选复选框。终端名称列内部为品牌 Logo 图标加超链接文本。上行速率列数值左侧带向上箭头图标。下行速率列数值左侧带向下箭头图标。守护列文本左侧带盾牌状态图标。最右侧操作列固定包含编辑铅笔和链接两个操作图标。

其中一行的数据模版是这样：图标加hauwei，手机，192.168.1.1，MAC地址展示0O:E0:FC:...，204，oppo，Intel(R)，Windows 10，9min，2022-07-...，3.30Kbps带向上箭头，4.61Kbps带向下箭头，3.4GB，android，图标加守护中，Wifi_xxx。其他行的数据与此类似。`

// ─── SDK ───

const rootDir = resolve(join(__dirname, "../../../../../../../"))
const sdkPath = join(rootDir, "packages/sdk/js/src/v2/client.ts")

let createOpencodeClient: any
try {
  const mod = await import(sdkPath)
  createOpencodeClient = mod.createOpencodeClient
} catch {
  const mod = await import("@opencode-ai/sdk/v2/client")
  createOpencodeClient = mod.createOpencodeClient
}

const client = createOpencodeClient({ baseUrl: serverUrl, directory, throwOnError: true })

// ─── 工具函数 ───

function extractJson(text: string): any {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(text.substring(start, end + 1))
  } catch {
    return null
  }
}

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

async function loadLayoutFixer() {
  const fixerPath = join(__dirname, "../agents/layout_fixer_agent/index.ts")
  try {
    const mod = await import(fixerPath)
    return mod.layoutFixer ?? mod.default
  } catch {
    return null
  }
}

// ─── Session 工具 ───

async function waitForResult(sessionId: string, timeoutMs = 600_000): Promise<string> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000))
    try {
      const res = await client.session.messages({ sessionID: sessionId })
      const items = res.data
      if (!items?.length) continue
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].info.role !== "assistant") continue
        if (items[i].info.time?.completed == null) break
        const texts: string[] = []
        for (const part of items[i].parts) {
          if (part.type === "text" && part.text) texts.push(part.text)
        }
        if (texts.length > 0) return texts.join("\n")
        break
      }
    } catch { /* ignore */ }
  }
  throw new Error(`Timeout waiting for session ${sessionId}`)
}

async function runChildSession(agent: string, prompt: string, parentSessionID: string) {
  const childResult = await client.session.create({ directory, parentID: parentSessionID, agent })
  const childSessionId = childResult.data.id
  await client.session.promptAsync({
    agent,
    model: modelKey ?? undefined,
    sessionID: childSessionId,
    parts: [{ type: "text", text: prompt }],
  })
  const text = await waitForResult(childSessionId)
  return { text, childSessionId }
}

// ─── 完整 Pipeline ───

interface RunResult {
  durationMs: number
  error?: string
  pageJson?: any
  sessionId?: string
}

async function runFullPipeline(label: string): Promise<RunResult> {
  const start = Date.now()
  try {
    // 1. Root session
    const rootRes = await client.session.create({ directory, agent: "proto_triage" })
    const rootId = rootRes.data.id

    // 2. Intent
    console.log(`  ${label} [1/4] intent ...`)
    const intentPrompt = `[用户的需求:] ==================================\n${USER_INPUT}\n\n请开始意图扩展。`
    const intentResult = await runChildSession("proto_intent", intentPrompt, rootId)
    const intentJson = extractJson(intentResult.text)
    if (!intentJson) throw new Error("Intent returned invalid JSON")
    const intentDescription = intentJson
    const intentPage = simplifyData(intentJson)

    // 3. Planner
    console.log(`  ${label} [2/4] planner ...`)
    const descStr = JSON.stringify(intentDescription)
    const sectionCount = (intentDescription.sections ?? []).length
    const hasSidebar = (intentDescription.sectionDetailList ?? []).some(
      (s: any) => s.id?.toLowerCase().includes("sidebar") || s.id?.toLowerCase().includes("side"),
    )
    let planner: any = null
    for (let attempt = 0; attempt < 2; attempt++) {
      const prompt = `请根据以下页面蓝图，设计外壳布局并指定下一步细化模块：\n[Page Blue_print:] ==================================\n\n${attempt === 0 ? descStr : descStr.replace(/\}\s*$/, `, "__planner_feedback__": ${JSON.stringify(formatValidationFeedback(validatePlannerOutput(planner?.layout_planner, sectionCount, hasSidebar) ?? []))} }`)}`
      const result = await runChildSession("proto_planner_create", prompt, rootId)
      const plannerJson = extractJson(result.text)
      if (!plannerJson) continue
      planner = { layout_planner: plannerJson }
      const errors = validatePlannerOutput(plannerJson, sectionCount, hasSidebar).filter((i: any) => i.severity === "error")
      if (errors.length === 0) break
    }
    if (!planner) throw new Error("Planner failed")

    // 4. Module create (parallel)
    const slots = (planner.layout_planner as any).slots as Array<any>
    console.log(`  ${label} [3/4] modules (${slots.length}) ...`)
    const modules = await Promise.all(
      slots.map(slot => {
        const sectionDetail = (intentDescription.sectionDetailList ?? []).find((item: any) => item?.id === slot.section_id) ?? {}
        const sections = intentDescription.sections ?? []
        const elements = planner.layout_planner.elements ?? []
        const slotElement = elements.find((e: any) => e?.id === slot.element_id) ?? {}
        const constraints = sectionDetail.constraints ?? []
        const constraintsStr = constraints.length
          ? constraints.map((c: any) => `${c.type}:${c.value} (${c.description})`).join("; ")
          : "无"
        const prompt = `请为以下模块生成 A2UI JSON：\n\n[完整页面蓝图:] ==================================\n- 布局描述: ${intentDescription.layoutDescription ?? ""}\n- 页面结构: ${JSON.stringify(sections, null, 2)}\n\n[模块顶层容器:] ==================================\n- Root ID: ${slot.element_id}\n- Root UI:\n  ${JSON.stringify(slotElement, null, 2)}\n\n[⚠️ 本模块约束（必须遵循）:] ==================================\n${constraintsStr}\n\n[需要被渲染的模块详细蓝图:] ==================================\n${JSON.stringify(sectionDetail, null, 2)}\n\n[需要被渲染模块的根节点:] ${slot.element_id}\n[模块内部元素id前缀:] ${slot.id_prefix}\n\n**CRITICAL — Path 语法约束：**\n- 数据绑定 path 禁止使用 ".."\n- 如果需要使用 Section 和 Icon 以外的组件，调用 \`load_components_docs\` 工具查询 API（只有一次机会）。\n- 最终回复必须是纯 JSON 对象。`
        return runChildSession("proto_module_create", prompt, rootId)
      }),
    )
    const moduleJsons = modules.map(m => extractJson(m.text)).filter(Boolean)

    // 5. Merge
    console.log(`  ${label} [4/4] merge ...`)
    const merged = mergeModules(
      { rootId: planner.layout_planner.rootId, elements: planner.layout_planner.elements },
      moduleJsons,
      planner.layout_planner.slots,
    )

    // 6. Fixer
    const fixerFn = await loadLayoutFixer()
    let fixed = merged
    if (fixerFn) {
      const [fixedResult] = fixerFn(merged)
      fixed = fixedResult
    }

    const durationMs = Date.now() - start
    console.log(`  ${label} done ${(durationMs / 1000).toFixed(1)}s`)
    return { durationMs, pageJson: fixed, sessionId: rootId }
  } catch (e: any) {
    const durationMs = Date.now() - start
    console.log(`  ${label} FAILED after ${(durationMs / 1000).toFixed(1)}s: ${e.message}`)
    return { durationMs, error: e.message }
  }
}

// ─── HTML 报告 ───

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function stats(results: RunResult[]) {
  const valid = results.filter((r) => !r.error)
  if (valid.length === 0) return { avg: 0, min: 0, max: 0, count: 0, errors: results.length }
  const durs = valid.map((r) => r.durationMs)
  return {
    avg: durs.reduce((a, b) => a + b, 0) / durs.length,
    min: Math.min(...durs),
    max: Math.max(...durs),
    count: valid.length,
    errors: results.length - valid.length,
  }
}

function generateHtmlReport(
  streamResults: RunResult[],
  blockResults: RunResult[],
  streamStats: ReturnType<typeof stats>,
  blockStats: ReturnType<typeof stats>,
): string {
  const allRuns = [
    ...streamResults.map((r, i) => ({ ...r, mode: "Stream", index: i + 1 })),
    ...blockResults.map((r, i) => ({ ...r, mode: "Block", index: i + 1 })),
  ]

  const cards = allRuns.map((r, idx) => {
    const dur = (r.durationMs / 1000).toFixed(1)
    const hasPage = !!r.pageJson && r.pageJson.rootId && r.pageJson.elements
    const status = r.error ? "error" : hasPage ? "success" : "warn"
    const statusText = r.error
      ? `FAILED: ${escapeHtml(r.error)}`
      : hasPage
        ? `${dur}s / ${r.pageJson.elements.length} elements`
        : `${dur}s / no page JSON`

    const previewBtn = hasPage
      ? `<button class="preview-btn" data-idx="${idx}">Preview Page</button>`
      : ""
    const jsonViewer = hasPage
      ? `<details><summary>A2UI JSON (${r.pageJson.elements.length} elements, ${Object.keys(r.pageJson.state ?? {}).length} state keys)</summary><pre class="a2ui-json">${escapeHtml(JSON.stringify(r.pageJson, null, 2).substring(0, 8000))}</pre></details>`
      : r.error
        ? `<div class="no-output">Error: ${escapeHtml(r.error)}</div>`
        : `<div class="no-output">No page JSON generated</div>`

    return `
      <div class="card ${status}" data-idx="${idx}">
        <div class="card-header">
          <span class="mode-badge ${r.mode.toLowerCase()}">${r.mode} #${r.index}</span>
          <span class="status ${status}">${statusText}</span>
          ${previewBtn}
        </div>
        <div class="card-body">
          ${jsonViewer}
        </div>
      </div>`
  }).join("\n")

  const diffPct = streamStats.avg > 0 && blockStats.avg > 0
    ? ((blockStats.avg - streamStats.avg) / streamStats.avg * 100).toFixed(1)
    : "N/A"
  const winner = blockStats.avg < streamStats.avg ? "Block" : "Stream"

  const a2uiDataArr = allRuns.map((r) => ({ mode: r.mode, index: r.index, a2ui: (r.pageJson && r.pageJson.rootId) ? r.pageJson : null }))

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stream vs Block Benchmark Report</title>
<style>
  :root { --stream: #3b82f6; --block: #f59e0b; --success: #10b981; --error: #ef4444; --warn: #f97316; --bg: #0f172a; --card-bg: #1e293b; --text: #e2e8f0; --muted: #94a3b8; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); padding: 2rem; transition: margin-right 0.3s; }
  h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  h2 { font-size: 1.1rem; margin: 1.5rem 0 0.75rem; color: var(--muted); }
  .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
  .stat-card { background: var(--card-bg); border-radius: 8px; padding: 1rem; }
  .stat-card .label { font-size: 0.8rem; color: var(--muted); margin-bottom: 0.25rem; }
  .stat-card .value { font-size: 1.4rem; font-weight: 700; }
  .stat-card .value.stream { color: var(--stream); }
  .stat-card .value.block { color: var(--block); }
  .stat-card .value.winner { color: var(--success); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 1rem; }
  .card { background: var(--card-bg); border-radius: 8px; overflow: hidden; border: 1px solid #334155; transition: border-color 0.2s, box-shadow 0.2s; }
  .card.success { cursor: pointer; }
  .card.success:hover { border-color: #475569; }
  .card.active { border-color: var(--success) !important; box-shadow: 0 0 0 2px rgba(16,185,129,0.3); }
  .card.error { border-color: var(--error); }
  .card.warn { border-color: var(--warn); }
  .card-header { padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; border-bottom: 1px solid #334155; }
  .mode-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .mode-badge.stream { background: var(--stream); color: white; }
  .mode-badge.block { background: var(--block); color: white; }
  .status { font-size: 0.85rem; }
  .status.success { color: var(--success); }
  .status.error { color: var(--error); }
  .status.warn { color: var(--warn); }
  .preview-btn { margin-left: auto; padding: 0.3rem 0.8rem; border-radius: 4px; border: 1px solid #475569; background: #334155; color: var(--text); font-size: 0.75rem; cursor: pointer; transition: all 0.15s; }
  .preview-btn:hover { background: #475569; border-color: var(--success); color: var(--success); }
  .card-body { padding: 0.75rem 1rem; }
  details { margin: 0.5rem 0; }
  summary { cursor: pointer; font-size: 0.85rem; color: var(--muted); padding: 0.25rem 0; }
  summary:hover { color: var(--text); }
  pre { background: #0d1117; padding: 0.75rem; border-radius: 6px; overflow-x: auto; font-size: 0.75rem; line-height: 1.4; max-height: 400px; overflow-y: auto; }
  .a2ui-json { color: #7dd3fc; }
  .no-output { color: var(--muted); font-size: 0.85rem; font-style: italic; padding: 0.5rem 0; }
  .timestamp { color: var(--muted); font-size: 0.8rem; margin-bottom: 1rem; }
  #preview-panel { display: none; position: fixed; top: 0; right: 0; width: 60vw; height: 100vh; z-index: 1000; background: #1a1a2e; box-shadow: -4px 0 24px rgba(0,0,0,0.5); }
  #preview-panel.open { display: flex; flex-direction: column; }
  #preview-panel .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: #16213e; border-bottom: 1px solid #334155; }
  #preview-panel .panel-header .title { font-size: 0.9rem; color: var(--muted); }
  #preview-panel .panel-header .close-btn { background: none; border: 1px solid #475569; color: var(--text); padding: 0.25rem 0.75rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
  #preview-panel .panel-header .close-btn:hover { border-color: var(--error); color: var(--error); }
  #preview-panel iframe { flex: 1; border: none; width: 100%; }
  body.has-preview { margin-right: 60vw; }
</style>
</head>
<body>
  <h1>Stream vs Block Benchmark Report</h1>
  <p class="timestamp">Generated: ${new Date().toISOString()}</p>

  <div class="summary">
    <div class="stat-card"><div class="label">Stream Avg</div><div class="value stream">${(streamStats.avg / 1000).toFixed(1)}s</div></div>
    <div class="stat-card"><div class="label">Block Avg</div><div class="value block">${(blockStats.avg / 1000).toFixed(1)}s</div></div>
    <div class="stat-card"><div class="label">Stream Min / Max</div><div class="value stream">${(streamStats.min / 1000).toFixed(1)}s / ${(streamStats.max / 1000).toFixed(1)}s</div></div>
    <div class="stat-card"><div class="label">Block Min / Max</div><div class="value block">${(blockStats.min / 1000).toFixed(1)}s / ${(blockStats.max / 1000).toFixed(1)}s</div></div>
    <div class="stat-card"><div class="label">Difference</div><div class="value">${diffPct}%</div></div>
    <div class="stat-card"><div class="label">Faster</div><div class="value winner">${winner}</div></div>
    <div class="stat-card"><div class="label">Stream Errors</div><div class="value">${streamStats.errors}</div></div>
    <div class="stat-card"><div class="label">Block Errors</div><div class="value">${blockStats.errors}</div></div>
  </div>

  <h2>All Runs (Stream: ${streamResults.length}, Block: ${blockResults.length})</h2>
  <p style="color:var(--muted);font-size:0.85rem;margin-bottom:1rem">Click a card to preview the rendered page (requires Vue preview server at 127.0.0.1:51856)</p>
  <div class="grid">
    ${cards}
  </div>

  <div id="preview-panel">
    <div class="panel-header">
      <span class="title" id="preview-title">Preview</span>
      <button class="close-btn" id="preview-close">Close</button>
    </div>
    <iframe id="preview-iframe" src="about:blank"></iframe>
  </div>

<script>
var A2UI_DATA = ${JSON.stringify(a2uiDataArr)};
var PREVIEW_URL = "http://127.0.0.1:51856";
var panel = document.getElementById("preview-panel");
var iframe = document.getElementById("preview-iframe");
var titleEl = document.getElementById("preview-title");
var closeBtn = document.getElementById("preview-close");
var currentCard = null;

var iframeLoaded = false;
function openPreview(idx) {
  var item = A2UI_DATA[idx];
  if (!item || !item.a2ui) return;
  titleEl.textContent = item.mode + " #" + item.index;
  if (currentCard) currentCard.classList.remove("active");
  currentCard = document.querySelector('.card[data-idx="' + idx + '"]');
  if (currentCard) currentCard.classList.add("active");
  if (!iframeLoaded) {
    iframe.src = PREVIEW_URL;
    iframe.onload = function() {
      iframeLoaded = true;
      iframe.contentWindow.postMessage({ type: "A2UI_UPDATE", payload: item.a2ui }, "*");
    };
  } else {
    iframe.contentWindow.postMessage({ type: "A2UI_UPDATE", payload: item.a2ui }, "*");
  }
  panel.classList.add("open");
  document.body.classList.add("has-preview");
}

function closePreview() {
  panel.classList.remove("open");
  document.body.classList.remove("has-preview");
  if (currentCard) { currentCard.classList.remove("active"); currentCard = null; }
}

closeBtn.addEventListener("click", closePreview);

document.querySelectorAll(".preview-btn").forEach(function(btn) {
  btn.addEventListener("click", function(e) {
    e.stopPropagation();
    openPreview(parseInt(btn.dataset.idx));
  });
});

document.querySelectorAll(".card.success").forEach(function(card) {
  card.addEventListener("click", function() {
    var idx = parseInt(card.dataset.idx);
    if (A2UI_DATA[idx] && A2UI_DATA[idx].a2ui) openPreview(idx);
  });
});
</script>
</body>
</html>`
}

// ─── 主流程 ───

async function main() {
  console.log("╔══════════════════════════════════════════╗")
  console.log("║   Stream vs Block 基准测试              ║")
  console.log("╠══════════════════════════════════════════╣")
  console.log(`║  模式: full pipeline × ${runCount}              ║`)
  console.log(`║  服务: ${serverUrl}`)
  if (modelKey) console.log(`║  模型: ${modelKey.providerID}/${modelKey.modelID}`)
  console.log("╚══════════════════════════════════════════╝\n")

  const streamResults: RunResult[] = []
  const blockResults: RunResult[] = []

  for (let i = 0; i < runCount; i++) {
    console.log(`\n── 第 ${i + 1}/${runCount} 轮 ──`)

    console.log("  [Stream]")
    const s = await runFullPipeline(`stream#${i + 1}`)
    streamResults.push(s)

    await new Promise((r) => setTimeout(r, 2000))

    console.log("  [Block]")
    const b = await runFullPipeline(`block#${i + 1}`)
    blockResults.push(b)

    await new Promise((r) => setTimeout(r, 2000))
  }

  const ss = stats(streamResults)
  const bs = stats(blockResults)

  console.log("\n╔══════════════════════════════════════════╗")
  console.log("║   汇总结果                               ║")
  console.log("╠══════════════════════════════════════════╣")
  console.log(`║  Stream: avg=${(ss.avg / 1000).toFixed(1)}s  min=${(ss.min / 1000).toFixed(1)}s  max=${(ss.max / 1000).toFixed(1)}s  errors=${ss.errors}`)
  console.log(`║  Block:  avg=${(bs.avg / 1000).toFixed(1)}s  min=${(bs.min / 1000).toFixed(1)}s  max=${(bs.max / 1000).toFixed(1)}s  errors=${bs.errors}`)

  if (ss.avg > 0 && bs.avg > 0) {
    const diff = ((bs.avg - ss.avg) / ss.avg * 100).toFixed(1)
    const winner = bs.avg < ss.avg ? "Block" : "Stream"
    console.log(`║  差异: Block 比 Stream ${diff > "0" ? "慢" : "快"} ${Math.abs(parseFloat(diff))}%`)
    console.log(`║  更快: ${winner}`)
  }
  console.log("╚══════════════════════════════════════════╝")

  // ─── 保存 ───

  await mkdir(outputDir, { recursive: true })

  await writeFile(join(outputDir, "result.json"), JSON.stringify({
    timestamp: new Date().toISOString(),
    server: serverUrl,
    model: modelKey,
    runCount,
    stream: streamResults,
    block: blockResults,
    streamStats: ss,
    blockStats: bs,
  }, null, 2), "utf-8")

  for (let i = 0; i < streamResults.length; i++) {
    if (streamResults[i].pageJson) {
      await writeFile(join(outputDir, `stream_${i + 1}.json`), JSON.stringify(streamResults[i].pageJson, null, 2), "utf-8")
    }
  }
  for (let i = 0; i < blockResults.length; i++) {
    if (blockResults[i].pageJson) {
      await writeFile(join(outputDir, `block_${i + 1}.json`), JSON.stringify(blockResults[i].pageJson, null, 2), "utf-8")
    }
  }

  const html = generateHtmlReport(streamResults, blockResults, ss, bs)
  await writeFile(join(outputDir, "report.html"), html, "utf-8")
  console.log(`\n报告已保存: ${join(outputDir, "report.html")}`)
}

main().catch(console.error)
