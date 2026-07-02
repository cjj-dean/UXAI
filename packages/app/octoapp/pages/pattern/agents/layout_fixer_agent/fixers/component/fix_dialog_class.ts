import { type A2UIElement, type Fixer, getClassName, setClassName, tokens } from "../../types"

const DIALOG_REQUIRED = new Set(["z-[99]", "overflow-y-auto", "flex", "flex-col", "gap-[1rem]", "bg-surface-container-highest", "shadow-sm"])

const DIALOG_CONFLICTING: Record<string, RegExp[]> = {
  "z-[99]": [/^z-\d+$/, /^z-\[.+\]$/],
  "overflow-y-auto": [/^overflow-(?:hidden|auto|scroll|visible|x-auto)$/],
  "flex-col": [/^flex-row$/],
  "bg-surface-container-highest": [/^bg-surface(?:-container)?(?:-lowest|-low|-high|-highest)?$/],
  "shadow-sm": [/^shadow-(?:md|lg|xl|2xl|none)$/],
}

const DRAWER_REQUIRED = new Set(["z-[99]", "flex", "flex-col", "gap-[1rem]", "bg-surface-container-highest"])

const DRAWER_CONFLICTING: Record<string, RegExp[]> = {
  "z-[99]": [/^z-\d+$/, /^z-\[.+\]$/],
  "flex-col": [/^flex-row$/],
  "bg-surface-container-highest": [/^bg-surface(?:-container)?(?:-lowest|-low|-high|-highest)?$/],
}

function fixOverlayClass(elem: A2UIElement, component: string, required: Set<string>, conflicting: Record<string, RegExp[]>): string[] | null {
  const cls = getClassName(elem)
  if (!cls) {
    setClassName(elem, [...required].join(" "))
    return null
  }
  const toks = tokens(cls)
  const tokSet = new Set(toks)
  const removed: string[] = []
  const added: string[] = []

  const cleaned = toks.filter((t) => {
    for (const [reqClass, patterns] of Object.entries(conflicting)) {
      if (tokSet.has(reqClass)) continue
      for (const re of patterns) {
        if (re.test(t)) {
          removed.push(t)
          return false
        }
      }
    }
    return true
  })

  const cleanedSet = new Set(cleaned)
  for (const req of required) {
    if (!cleanedSet.has(req)) {
      cleaned.push(req)
      added.push(req)
    }
  }

  if (removed.length || added.length) {
    setClassName(elem, cleaned.join(" "))
    const parts: string[] = []
    if (removed.length) parts.push(`移除冲突: ${removed.sort().join(", ")}`)
    if (added.length) parts.push(`补齐缺失: ${added.sort().join(", ")}`)
    return parts
  }
  return null
}

export const fixDialogClass: Fixer = (json) => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    if (elem.component === "Dialog" || elem.component === "dialog") {
      const result = fixOverlayClass(elem, "dialog", DIALOG_REQUIRED, DIALOG_CONFLICTING)
      if (result === null) {
        fixes.push(`[${elem.id}](dialog) className 为空: 设置为模板默认值`)
      } else if (result) {
        fixes.push(`[${elem.id}](dialog) ${result.join("; ")}`)
      }
    }
    if (elem.component === "Drawer" || elem.component === "drawer") {
      const result = fixOverlayClass(elem, "drawer", DRAWER_REQUIRED, DRAWER_CONFLICTING)
      if (result === null) {
        fixes.push(`[${elem.id}](drawer) className 为空: 设置为模板默认值`)
      } else if (result) {
        fixes.push(`[${elem.id}](drawer) ${result.join("; ")}`)
      }
    }
  }

  return [json, fixes]
}
