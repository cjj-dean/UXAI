import { type A2UIJson, type Fixer, resolveState } from "../../types"

function stripIconsFromChildren(items: any[], fixes: string[], elemId: string): void {
  for (const item of items) {
    if (!item || typeof item !== "object") continue
    const children = item.children
    if (!Array.isArray(children) || children.length === 0) continue
    for (const child of children) {
      if (!child || typeof child !== "object") continue
      if (child.icon) {
        const oldIcon = child.icon
        delete child.icon
        fixes.push(`[${elemId}](Menu) 子菜单项 "${child.title ?? child.key}" 移除 icon: ${oldIcon}`)
      }
      if (Array.isArray(child.children)) stripIconsFromChildren([child], fixes, elemId)
    }
  }
}

export const fixMenuIcons: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    if (elem.component !== "Menu") continue
    const itemsProp = elem.props?.items
    if (!itemsProp) continue

    let items: any[] | null = null
    if (Array.isArray(itemsProp)) {
      items = itemsProp
    } else if (itemsProp && typeof itemsProp === "object" && typeof itemsProp.path === "string") {
      items = resolveState(json.state, itemsProp.path)
      if (!Array.isArray(items)) items = null
    }

    if (items) stripIconsFromChildren(items, fixes, elem.id)
  }

  return [json, fixes]
}
