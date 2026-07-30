// 从 AI 返回的字符串中提取 JSON
export function extractJson(text: string): Record<string, unknown> | null {
  if (!text || !text.trim()) return null

  text = text.replace(/[\u201C\u201D\u201E\u2018\u2019]/g, '"')

  // 尝试提取所有 ```json ``` 代码块，优先返回包含 standardizedIntent 的
  const codeBlocks = [...text.matchAll(/```(?:json)?\s*\n([\s\S]*?)\n?```/g)]
  if (codeBlocks.length > 0) {
    const candidates = codeBlocks.map(m => m[1])
    const withIntent = candidates.find(b => tryParse(b)?.standardizedIntent || tryParse(b)?.standardized_intent)
    if (withIntent) { const p = tryParse(withIntent); if (p) return p }
    for (const c of candidates) { const p = tryParse(c); if (p) return p }
  }

  // 无代码块时，尝试直接解析整个文本（可能是JSON数组）
  const trimmed = text.trim()
  const direct = tryParse(trimmed)
  if (direct) return direct

  // 尝试提取所有顶层 JSON 对象
  const jsonCandidates = extractTopLevelJsons(text)
  if (jsonCandidates.length > 0) {
    const withIntent = jsonCandidates.find(b => tryParse(b)?.standardizedIntent || tryParse(b)?.standardized_intent)
    if (withIntent) { const p = tryParse(withIntent); if (p) return p }
    for (const c of jsonCandidates) { const p = tryParse(c); if (p) return p }
  }

  return null
}

function extractTopLevelJsons(text: string): string[] {
  const results: string[] = []
  let i = 0
  while (i < text.length) {
    const start = text.indexOf("{", i)
    if (start === -1) break
    let depth = 0
    let inStr = false
    let esc = false
    let end = -1
    for (let j = start; j < text.length; j++) {
      const c = text[j]
      if (esc) { esc = false; continue }
      if (c === "\\" && inStr) { esc = true; continue }
      if (c === '"') { inStr = !inStr; continue }
      if (inStr) continue
      if (c === "{") depth++
      else if (c === "}") {
        depth--
        if (depth === 0) { end = j; break }
      }
    }
    if (end !== -1) {
      results.push(text.substring(start, end + 1))
      i = end + 1
    } else {
      i = start + 1
    }
  }
  return results
}

function tryParse(raw: string): Record<string, unknown> | null {
  try {
    let parsed = JSON.parse(raw.trim())
    return parsed && typeof parsed === "object" ? parsed : null
  } catch { }

  try {
    let repaired = repairUnescapedQuotes(raw)
    let parsed = JSON.parse(repaired.trim())
    return parsed && typeof parsed === "object" ? parsed : null
  } catch { }

  try {
    let repaired = repairUnescapedQuotes(raw)
    let cleaned = stripControlChars(repaired)
    let parsed = JSON.parse(cleaned.trim())
    return parsed && typeof parsed === "object" ? parsed : null
  } catch { }

  try {
    let balanced = repairBracketBalance(raw.trim())
    let parsed = JSON.parse(balanced)
    return parsed && typeof parsed === "object" ? parsed : null
  } catch { }

  try {
    let fixed = repairExtraBrackets(raw.trim())
    let parsed = JSON.parse(fixed)
    return parsed && typeof parsed === "object" ? parsed : null
  } catch { }

  return null
}

function stripControlChars(text: string): string {
  let cleaned = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "")
  cleaned = cleaned.replace(/\\(?!["\\/bfnrtu])/g, "\\\\")
  return cleaned
}

function repairBracketBalance(text: string): string {
  let depth = 0
  let lastValidEnd = text.length
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') {
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
      if (at === ']' || at === '}') {
        t = t.substring(0, pos) + t.substring(pos + 1)
      } else {
        const before = t.substring(Math.max(0, pos - 10), pos)
        if (before.includes('}]')) {
          const idx = t.lastIndexOf('}]', pos)
          if (idx > -1 && idx + 2 < t.length && (t[idx + 2] === ']' || t[idx + 2] === '}')) {
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

    if (escaped) {
      result += char
      escaped = false
      continue
    }

    if (char === "\\" && inString) {
      result += char
      escaped = true
      continue
    }

    if (char === '"') {
      if (!inString) {
        inString = true
        result += char
        continue
      }

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

// 从 Session 中每2秒轮询, 取出最终结果
export async function getResultFromMessages(sdk: any, sessionId: string, aborted: boolean): Promise<string> {
  while (!aborted) {
    await new Promise((r) => setTimeout(r, 2000));
    if (aborted) throw new Error("aborted");
    try {
      const res = await sdk.client.session.messages({ sessionID: sessionId});
      const items = res.data;
      if (!items || items.length === 0) continue;      
      // 找到最新的 assistant 消息
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].info.role !== "assistant") continue;
        const item = items[i];
        const msg = item.info;
        // 最新 assistant 消息尚未完成，继续等待
        if (msg.time?.completed == null) break;
        // 收集所有文本 parts
        const texts: string[] = []
        for (let j = 0; j < item.parts.length; j++) {
          const part = item.parts[j]
          if (part.type === "text" && part.text) texts.push(part.text)
        }
        if (texts.length > 0) return texts.join("\n")
        break;
      }
    } catch (error) {
      if (aborted) throw new Error("aborted");
    }
  }
  throw new Error("aborted");
}