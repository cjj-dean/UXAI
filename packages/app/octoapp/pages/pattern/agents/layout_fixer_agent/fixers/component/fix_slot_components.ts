import { type A2UIJson, type Fixer, type A2UIElement } from "../../types"

const SLOT_COMPONENTS: Record<string, { contentProp: string }> = {
  TimelineItem: { contentProp: "content" },
  CollapseItem: { contentProp: "content" },
  TabItem: { contentProp: "content" },
  StepItem: { contentProp: "content" },
}

const fix_slot_components: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const el of json.elements) {
    const spec = SLOT_COMPONENTS[el.component as string]
    if (!spec) continue

    if (!Array.isArray(el.children) || el.children.length === 0) continue

    if (!el.props) el.props = {}

    const hasContent = el.props[spec.contentProp] != null
    if (hasContent) continue

    const firstChildId = el.children[0]
    if (typeof firstChildId !== "string") continue

    el.props[spec.contentProp] = { componentId: firstChildId }

    if (el.children.length > 1) {
      el.children = el.children.slice(1)
    } else {
      delete el.children
    }

    fixes.push(`${el.id} (${el.component}): moved child "${firstChildId}" to props.${spec.contentProp}.componentId`)
  }

  return [json, fixes]
}

export default fix_slot_components
