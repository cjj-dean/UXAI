/**
 * Stream vs Block 对比基准测试
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
import { mkdir, writeFile } from "node:fs/promises"
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
Stream vs Block 对比基准测试

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

// ─── SDK 初始化 ───

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

function makeClient() {
  return createOpencodeClient({ baseUrl: serverUrl, directory, throwOnError: true })
}

// ─── 轮询等待结果 ───

async function waitForResult(client: any, sessionId: string, timeoutMs = 600_000): Promise<string> {
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

// ─── 单次运行: intent agent ───

async function runOnce(label: string): Promise<{ durationMs: number; textLen: number; error?: string }> {
  const client = makeClient()
  const start = Date.now()

  try {
    const rootRes = await client.session.create({ directory, agent: "proto_intent" })
    const rootId = rootRes.data.id

    const childRes = await client.session.create({ directory, parentID: rootId, agent: "proto_intent" })
    const childId = childRes.data.id

    await client.session.promptAsync({
      agent: "proto_intent",
      model: modelKey,
      sessionID: childId,
      parts: [{ type: "text", text: `[用户的需求:] ==================================\n${USER_INPUT}\n\n请开始意图扩展。` }],
    })

    const text = await waitForResult(client, childId)
    const durationMs = Date.now() - start
    console.log(`  ${label} ${(durationMs / 1000).toFixed(1)}s (${text.length} chars)`)
    return { durationMs, textLen: text.length }
  } catch (e: any) {
    const durationMs = Date.now() - start
    console.log(`  ${label} FAILED after ${(durationMs / 1000).toFixed(1)}s: ${e.message}`)
    return { durationMs, textLen: 0, error: e.message }
  }
}

// ─── 主流程 ───

async function main() {
  console.log("╔══════════════════════════════════════════╗")
  console.log("║   Stream vs Block 基准测试              ║")
  console.log("╠══════════════════════════════════════════╣")
  console.log(`║  模式: proto_intent × ${runCount}              ║`)
  console.log(`║  服务: ${serverUrl}`)
  if (modelKey) console.log(`║  模型: ${modelKey.providerID}/${modelKey.modelID}`)
  console.log("╚══════════════════════════════════════════╝\n")

  const streamResults: { durationMs: number; textLen: number; error?: string }[] = []
  const blockResults: { durationMs: number; textLen: number; error?: string }[] = []

  // 交替运行 stream 和 block，减少时间偏差
  for (let i = 0; i < runCount; i++) {
    console.log(`\n── 第 ${i + 1}/${runCount} 轮 ──`)

    // 先测 stream（当前默认模式）
    console.log("  [Stream]")
    const s = await runOnce(`  stream#${i + 1}`)
    streamResults.push(s)

    // 等待 2s 避免限流
    await new Promise((r) => setTimeout(r, 2000))

    // 再测 block（需 agent.block=true 已生效）
    console.log("  [Block]")
    const b = await runOnce(`  block#${i + 1}`)
    blockResults.push(b)

    // 等待 2s
    await new Promise((r) => setTimeout(r, 2000))
  }

  // ─── 汇总 ───

  function stats(results: typeof streamResults) {
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

  // 保存结果到 JSON
  const outputDir = resolve(join(__dirname, "../test_output"))
  await mkdir(outputDir, { recursive: true })
  const reportPath = join(outputDir, "stream_vs_block_result.json")
  await writeFile(reportPath, JSON.stringify({ stream: streamResults, block: blockResults, streamStats: ss, blockStats: bs }, null, 2), "utf-8")
  console.log(`\n结果已保存: ${reportPath}`)
}

main().catch(console.error)
