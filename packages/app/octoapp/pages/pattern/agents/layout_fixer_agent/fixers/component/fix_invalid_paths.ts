import { type A2UIJson, type Fixer } from "../../types"

/**
 * Validates data binding paths in all elements.
 *
 * Detects:
 * - Paths containing ".." (directory traversal syntax) which is NOT supported
 *   by A2UI's resolveState and will silently return null.
 *   LLMs sometimes use paths like "/menuItems/0/../8" to express array slices,
 *   but the correct approach is to split the data into separate arrays in state.
 */
export const fixInvalidPaths: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []

  function walk(obj: unknown, context: string): void {
    if (!obj || typeof obj !== "object") return
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) walk(obj[i], `${context}[${i}]`)
      return
    }
    const record = obj as Record<string, unknown>
    if (typeof record.path === "string" && record.path.includes("..")) {
      fixes.push(`[invalid_path] ${context} 包含 ".." 路径语法 "${record.path}" — resolveState 不支持，将返回 null。数据应拆分为独立数组后分别绑定。`)
    }
    for (const [k, v] of Object.entries(record)) {
      if (k === "id" || k === "component") continue
      walk(v, `${context}.${k}`)
    }
  }

  for (const el of json.elements) {
    walk(el, `elements[${el.id}]`)
  }

  return [json, fixes]
}

export default fixInvalidPaths
