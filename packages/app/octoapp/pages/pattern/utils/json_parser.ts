// 从 AI 返回的字符串中提取 JSON
export function extractJson(text: string): Record<string, unknown> | null {
  if (!text || !text.trim()) return null

  let raw = text
  let match = text.match(/```(?:json)?\s*\n([\s\S]*?)\n?```/)
  if (match) raw = match[1]
  else {
    let start = text.indexOf("{")
    let end = text.lastIndexOf("}")
    if (start !== -1 && end > start) raw = text.substring(start, end + 1)
  }

  if (tryParse(raw)) return tryParse(raw)!

  // 尝试从每个 '{' 位置解析（处理输出开头有多余字符的情况）
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
  try {
    let parsed = JSON.parse(raw.trim())
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null
  } catch { }

  try {
    let repaired = repairUnescapedQuotes(raw)
    let parsed = JSON.parse(repaired.trim())
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : null
  } catch { }

  return null
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