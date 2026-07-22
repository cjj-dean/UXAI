import type { A2UIJson, A2UIElement } from "../../types"

const STRETCH_CLASSES = ["flex-1", "w-full", "flex-[", "grow", "min-w-0", "min-h-0"]

const INLINE_COMPONENTS = new Set([
  "Segmented",
  "RadioGroup",
  "Switch",
  "Checkbox",
  "DatePicker",
  "TimePicker",
  "InputNumber",
  "Input",
  "Select",
])

function removeStretchClasses(className: string): string {
  return className
    .split(" ")
    .filter((cls: string) => !STRETCH_CLASSES.some((s) => cls === s || cls.startsWith(s)))
    .join(" ")
    .trim()
}

export function fixInlineComponentStretch(json: A2UIJson): [A2UIJson, string[]] {
  const logs: string[] = []
  for (const el of json.elements) {
    if (!INLINE_COMPONENTS.has(el.component)) continue
    if (!el.props?.className || typeof el.props.className !== "string") continue
    const fixed = removeStretchClasses(el.props.className)
    if (fixed !== el.props.className) {
      el.props.className = fixed || "w-fit"
      logs.push(`[inline_stretch] ${el.id}: removed stretch classes from "${el.props.className}" -> "${fixed || "w-fit"}"`)
    }
  }
  return [json, logs]
}
