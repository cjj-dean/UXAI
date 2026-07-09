import { type Fixer } from "../../types"

export const fixCircleProcessChart: Fixer = (json) => {
  const fixes: string[] = []
  for (const elem of json.elements) {
    if (elem.component !== "CircleProcessChart") continue
    if (!elem.props) elem.props = {}
    const option = elem.props.option
    if (!option || typeof option !== "object") {
      elem.props.option = {}
    }
    const opt = elem.props.option

    const rawData = opt.data ?? []
    let dataPath: string | null = null
    if (Array.isArray(rawData) && rawData.length > 0) {
      const first = rawData[0]
      if (first && typeof first === "object" && first.value && typeof first.value === "object" && "path" in first.value) {
        dataPath = first.value.path
      }
    } else if (rawData && typeof rawData === "object" && "path" in rawData) {
      dataPath = `${rawData.path}/0/value`
    }

    if (!dataPath) continue

    const title = opt.title
    const currentTextPath = title && typeof title === "object" && title.text && typeof title.text === "object" && "path" in title.text
      ? (title.text as any).path
      : null

    if (currentTextPath === dataPath) continue

    const newText = { path: dataPath }
    if (title && typeof title === "object") {
      title.text = newText
    } else {
      opt.title = { text: newText }
    }
    fixes.push(`[${elem.id}] CircleProcessChart title.text 绑定到 ${dataPath}${currentTextPath ? ` (原: ${currentTextPath})` : ""}`)
  }
  return [json, fixes]
}
