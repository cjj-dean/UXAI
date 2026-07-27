import { type A2UIElement, type Fixer } from "../../types"

function hoistPropsChildren(el: A2UIElement): void {
  if (el.children !== undefined) return
  const propsChildren = el.props?.children
  if (!propsChildren || typeof propsChildren !== "object") return
  if (Array.isArray(propsChildren)) return
  if (!("path" in (propsChildren as Record<string, unknown>) )) return
  el.children = propsChildren
  delete el.props!.children
}

export const fixPropsChildren: Fixer = (json) => {
  const fixes: string[] = []
  for (const el of json.elements) {
    if (el.children === undefined && el.props?.children && typeof el.props.children === "object" && !Array.isArray(el.props.children) && "path" in (el.props.children as Record<string, unknown>)) {
      const moved = el.props.children as Record<string, unknown>
      fixes.push(`[${el.id}](${el.component}) children 从 props 提升到顶层: componentId=${moved.componentId}, path=${moved.path}`)
      hoistPropsChildren(el)
    }
  }
  return [json, fixes]
}
