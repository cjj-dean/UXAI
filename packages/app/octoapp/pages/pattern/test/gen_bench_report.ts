import fs from "fs"
import path from "path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const benchDir = path.join(__dirname, "..", "bench_results")
const resultPath = path.join(benchDir, "result.json")

if (!fs.existsSync(resultPath)) {
  console.error("No result.json found. Run the bench script first.")
  process.exit(1)
}

const result = JSON.parse(fs.readFileSync(resultPath, "utf-8"))

interface RunResult {
  durationMs: number
  textLen: number
  error?: string
  output?: string
  sessionId?: string
}

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
    const status = r.error ? "error" : "success"
    const statusText = r.error ? `FAILED: ${escapeHtml(r.error)}` : `${dur}s / ${r.textLen} chars`
    let a2uiJson = ""
    if (r.output) {
      try {
        const match = r.output.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
        const raw = match ? match[1] : r.output
        JSON.parse(raw)
        a2uiJson = raw
      } catch {
        a2uiJson = ""
      }
    }
    const hasA2UI = !!a2uiJson
    const previewBtn = hasA2UI
      ? `<button class="preview-btn" data-idx="${idx}">Preview Page</button>`
      : ""
    const jsonPreview = r.output
      ? `<details><summary>Raw Output (${r.output.length} chars)</summary><pre class="raw-output">${escapeHtml(r.output.substring(0, 5000))}${r.output.length > 5000 ? "\n... (truncated)" : ""}</pre></details>`
      : `<div class="no-output">No output saved</div>`
    const jsonViewer = a2uiJson
      ? `<details><summary>A2UI JSON (parsed)</summary><pre class="a2ui-json">${escapeHtml(JSON.stringify(JSON.parse(a2uiJson), null, 2).substring(0, 8000))}</pre></details>`
      : ""

    return `
      <div class="card ${status}" data-idx="${idx}">
        <div class="card-header">
          <span class="mode-badge ${r.mode.toLowerCase()}">${r.mode} #${r.index}</span>
          <span class="status ${status}">${statusText}</span>
          ${previewBtn}
        </div>
        <div class="card-body">
          ${jsonViewer}
          ${jsonPreview}
        </div>
      </div>`
  }).join("\n")

  const diffPct = streamStats.avg > 0 && blockStats.avg > 0
    ? ((blockStats.avg - streamStats.avg) / streamStats.avg * 100).toFixed(1)
    : "N/A"
  const winner = blockStats.avg < streamStats.avg ? "Block" : "Stream"

  const a2uiDataArr = allRuns.map((r) => {
    let a2ui = null
    if (r.output) {
      try {
        const match = r.output.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
        const raw = match ? match[1] : r.output
        a2ui = JSON.parse(raw)
      } catch { a2ui = null }
    }
    return { mode: r.mode, index: r.index, a2ui }
  })

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Stream vs Block Benchmark Report</title>
<style>
  :root { --stream: #3b82f6; --block: #f59e0b; --success: #10b981; --error: #ef4444; --bg: #0f172a; --card-bg: #1e293b; --text: #e2e8f0; --muted: #94a3b8; }
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
  .card { background: var(--card-bg); border-radius: 8px; overflow: hidden; border: 1px solid #334155; transition: border-color 0.2s; cursor: pointer; }
  .card:hover { border-color: #475569; }
  .card.active { border-color: var(--success); box-shadow: 0 0 0 2px rgba(16,185,129,0.3); }
  .card.error { border-color: var(--error); cursor: default; }
  .card-header { padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; border-bottom: 1px solid #334155; }
  .mode-badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .mode-badge.stream { background: var(--stream); color: white; }
  .mode-badge.block { background: var(--block); color: white; }
  .status { font-size: 0.85rem; }
  .status.success { color: var(--success); }
  .status.error { color: var(--error); }
  .preview-btn { margin-left: auto; padding: 0.3rem 0.8rem; border-radius: 4px; border: 1px solid #475569; background: #334155; color: var(--text); font-size: 0.75rem; cursor: pointer; transition: all 0.15s; }
  .preview-btn:hover { background: #475569; border-color: var(--success); color: var(--success); }
  .card-body { padding: 0.75rem 1rem; }
  details { margin: 0.5rem 0; }
  summary { cursor: pointer; font-size: 0.85rem; color: var(--muted); padding: 0.25rem 0; }
  summary:hover { color: var(--text); }
  pre { background: #0d1117; padding: 0.75rem; border-radius: 6px; overflow-x: auto; font-size: 0.75rem; line-height: 1.4; max-height: 400px; overflow-y: auto; }
  .a2ui-json { color: #7dd3fc; }
  .raw-output { color: var(--muted); }
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

function openPreview(idx) {
  var item = A2UI_DATA[idx];
  if (!item || !item.a2ui) return;
  titleEl.textContent = item.mode + " #" + item.index;
  if (currentCard) currentCard.classList.remove("active");
  currentCard = document.querySelector('.card[data-idx="' + idx + '"]');
  if (currentCard) currentCard.classList.add("active");
  iframe.src = PREVIEW_URL;
  iframe.onload = function() {
    iframe.contentWindow.postMessage({ type: "A2UI_UPDATE", payload: item.a2ui }, "*");
  };
  panel.classList.add("open");
  document.body.classList.add("has-preview");
}

function closePreview() {
  panel.classList.remove("open");
  document.body.classList.remove("has-preview");
  iframe.src = "about:blank";
  if (currentCard) { currentCard.classList.remove("active"); currentCard = null; }
}

closeBtn.addEventListener("click", closePreview);

document.querySelectorAll(".preview-btn").forEach(function(btn) {
  btn.addEventListener("click", function(e) {
    e.stopPropagation();
    openPreview(parseInt(btn.dataset.idx));
  });
});

document.querySelectorAll(".card").forEach(function(card) {
  card.addEventListener("click", function() {
    var idx = parseInt(card.dataset.idx);
    if (A2UI_DATA[idx] && A2UI_DATA[idx].a2ui) openPreview(idx);
  });
});
</script>
</body>
</html>`
}

const streamResults: RunResult[] = result.stream
const blockResults: RunResult[] = result.block
const ss = stats(streamResults)
const bs = stats(blockResults)

const html = generateHtmlReport(streamResults, blockResults, ss, bs)
const htmlPath = path.join(benchDir, "report.html")
fs.writeFileSync(htmlPath, html, "utf-8")
console.log("HTML report saved to:", htmlPath)
