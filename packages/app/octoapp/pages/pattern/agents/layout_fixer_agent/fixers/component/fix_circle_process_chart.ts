import { type Fixer } from "../../types"

export const fixCircleProcessChart: Fixer = (json) => {
  const fixes: string[] = []
  const state = json.state ?? {}
  for (const elem of json.elements) {
    if (elem.component !== "CircleProcessChart") continue
    if (!elem.props) elem.props = {}
    const option = elem.props.option
    if (!option || typeof option !== "object") {
      elem.props.option = {}
    }
    const opt = elem.props.option
    const title = opt.title
    if (title && typeof title === "object" && title.text && typeof title.text === "object" && "path" in title.text) continue

    const rawData = opt.data ?? []
    let firstPath: string | null = null
    if (Array.isArray(rawData) && rawData.length > 0) {
      const first = rawData[0]
      if (first && typeof first === "object" && first.value && typeof first.value === "object" && "path" in first.value) {
        firstPath = first.value.path
      }
    } else if (rawData && typeof rawData === "object" && "path" in rawData) {
      firstPath = `${rawData.path}/0/value`
    }

    if (firstPath) {
      const newText = { path: firstPath }
      if (title && typeof title === "object") {
        title.text = newText
      } else {
        opt.title = { text: newText }
      }
      fixes.push(`[${elem.id}] CircleProcessChart title.text 绑定到 ${firstPath}`)
    }
  }
  return [json, fixes]
}
