import { type A2UIJson, type Fixer, elemMap } from "../../types"

export const fixTabContent: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    if (elem.component !== "TabItem") continue
    const content = elem.props?.content
    if (!content || typeof content !== "object") continue

    const componentId = content.componentId
    if (!componentId || typeof componentId !== "string") continue

    const contentElem = map[componentId]
    if (!contentElem) continue

    if (contentElem.component === "div" || contentElem.component === "span") {
      const hasChildren = contentElem.children && (Array.isArray(contentElem.children) ? contentElem.children.length > 0 : !!contentElem.children.componentId)
      const hasOnlyValue = contentElem.props?.value && typeof contentElem.props.value === "string"
      if (!hasChildren && hasOnlyValue) {
        delete elem.props!.content
        json.elements = json.elements.filter((e) => e.id !== componentId)
        fixes.push(`[${elem.id}](TabItem) 删除文本占位content: ${componentId}`)
      }
    }
  }

  return [json, fixes]
}
