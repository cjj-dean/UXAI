import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const Z_TOKEN_RE = /^z-(?:auto|\d+|\[.+\])$/
const H_FIXED_RE2 = /^h-(?:\d+|\[.+\])$/
const PY_TOKEN_RE = /^py-(?:\d+|px|\[.+\])$/
const HEADER_Z_CLASS = "z-[1]"
const HEADER_PY_CLASS = "py-[0.75rem]"

export const fixHeaderZIndex: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (elem.component !== "header") continue
    let toks = tokens(getClassName(elem))
    const hasZ = toks.some((t) => Z_TOKEN_RE.test(t))
    const hasHSelf = toks.some((t) => H_FIXED_RE2.test(t))
    const hasPySelf = toks.some((t) => PY_TOKEN_RE.test(t))

    let childHasH = false
    let childHasPy = false
    if (Array.isArray(elem.children)) {
      for (const cid of elem.children) {
        const child = map[cid]
        if (!child) continue
        const childToks = tokens(getClassName(child))
        if (childToks.some((t) => H_FIXED_RE2.test(t))) childHasH = true
        if (childToks.some((t) => PY_TOKEN_RE.test(t))) childHasPy = true
      }
    }

    const descs: string[] = []
    let changed = false

    if (!hasZ) {
      toks.push(HEADER_Z_CLASS)
      descs.push(`补充 ${HEADER_Z_CLASS}`)
      changed = true
    }

    if (childHasH && hasPySelf) {
      toks = toks.filter((t) => !PY_TOKEN_RE.test(t))
      descs.push("移除多余 py-* (子元素已有 h-*)")
      changed = true
    } else if (!hasHSelf && !hasPySelf && !childHasH && !childHasPy) {
      toks.push(HEADER_PY_CLASS)
      descs.push(`补充 ${HEADER_PY_CLASS}`)
      changed = true
    }

    if (changed) {
      setClassName(elem, toks.join(" "))
      fixes.push(`[${elem.id}] header 样式修正: ${descs.join(", ")}`)
    }
  }
  return [json, fixes]
}
