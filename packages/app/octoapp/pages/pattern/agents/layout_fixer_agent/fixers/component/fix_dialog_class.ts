import { type Fixer, getClassName, setClassName, tokens } from "../../types"

const REQUIRED = new Set(["z-[99]", "overflow-y-auto", "p-[1.5rem]", "flex", "flex-col", "gap-[1rem]", "bg-surface-container-highest", "shadow-sm"])

const CONFLICTING: Record<string, RegExp[]> = {
  "z-[99]": [/^z-\d+$/, /^z-\[.+\]$/],
  "overflow-y-auto": [/^overflow-(?:hidden|auto|scroll|visible|x-auto)$/],
  "p-[1.5rem]": [/^p-\[.+\]$/, /^p-\d+$/],
  "flex-col": [/^flex-row$/],
  "bg-surface-container-highest": [/^bg-surface(?:-container)?(?:-lowest|-low|-high|-highest)?$/],
  "shadow-sm": [/^shadow-(?:md|lg|xl|2xl|none)$/],
}

export const fixDialogClass: Fixer = (json) => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    if (elem.component !== "Dialog" && elem.component !== "dialog") continue
    const cls = getClassName(elem)
    if (!cls) {
      setClassName(elem, [...REQUIRED].join(" "))
      fixes.push(`[${elem.id}](dialog) className 为空: 设置为模板默认值`)
      continue
    }
    const toks = tokens(cls)
    const tokSet = new Set(toks)
    const removed: string[] = []
    const added: string[] = []

    const cleaned = toks.filter((t) => {
      for (const [reqClass, patterns] of Object.entries(CONFLICTING)) {
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
    for (const req of REQUIRED) {
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
      fixes.push(`[${elem.id}](dialog) ${parts.join("; ")}`)
    }
  }

  return [json, fixes]
}
