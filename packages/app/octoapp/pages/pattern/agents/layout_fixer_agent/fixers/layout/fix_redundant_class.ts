import { type A2UIElement, type Fixer, getClassName, setClassName, tokens } from "../../types"

const H_FULL_RE = /^h-full$/
const H_FIXED_RE = /^h-(?:\d+|\[.+\]|screen|screen-xl)$/
const W_FULL_RE = /^w-full$/
const FLEX_COL_RE = /^flex-col$/
const ITEMS_RE = /^items-(?:start|end|center|baseline)$/
const FLEX_PARENT_RE = /^flex$|^inline-flex$/
const FLEX_GRID_PARENT_RE = /^flex$|^inline-flex$|^grid$|^inline-grid$/
const FLEX_GROW_RE = /^flex-1$|^flex-grow$|^grow$/
const MIN_SIZE_RE = /^min-[hw]-0$/
const NOOP_RE = /^h-auto$/

export const fixRedundantClass: Fixer = (json) => {
  const fixes: string[] = []
  const pmap: Record<string, A2UIElement> = {}
  for (const elem of json.elements) {
    if (Array.isArray(elem.children)) {
      for (const cid of elem.children) {
        if (typeof cid === "string") pmap[cid] = elem
      }
    }
  }

  for (const elem of json.elements) {
    const cls = getClassName(elem)
    if (!cls) continue
    const toks = tokens(cls)
    const parent = pmap[elem.id]
    const parentCls = parent ? tokens(getClassName(parent)) : []

    const parentHasFixedH = parentCls.some((t) => H_FIXED_RE.test(t))
    const parentIsFlexCol = parentCls.some((t) => FLEX_COL_RE.test(t))
    const parentHasItems = parentCls.some((t) => ITEMS_RE.test(t))
    const parentIsFlex = parentCls.some((t) => FLEX_PARENT_RE.test(t))
    const parentIsFlexGrid = parentCls.some((t) => FLEX_GRID_PARENT_RE.test(t))

    const removed: string[] = []
    for (const t of toks) {
      if (H_FULL_RE.test(t) && !parentHasFixedH) removed.push(t)
      else if (W_FULL_RE.test(t) && parentIsFlexCol && !parentHasItems) removed.push(t)
      else if (FLEX_GROW_RE.test(t) && !parentIsFlex) removed.push(t)
      else if (MIN_SIZE_RE.test(t) && !parentIsFlexGrid) removed.push(t)
      else if (NOOP_RE.test(t)) removed.push(t)
    }

    if (removed.length) {
      const removeSet = new Set(removed)
      setClassName(elem, toks.filter((t) => !removeSet.has(t)).join(" "))
      fixes.push(`[${elem.id}](${elem.component}) 移除冗余 class: ${[...removeSet].sort()}`)
    }
  }
  return [json, fixes]
}
