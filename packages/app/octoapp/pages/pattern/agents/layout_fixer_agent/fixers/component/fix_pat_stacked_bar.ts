import { type A2UIJson, type Fixer } from "../../types"

const fix_pat_stacked_bar: Fixer = (json): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const el of json.elements) {
    if (el.component !== "PatStackedBar") continue

    const props = el.props
    if (!props) continue

    const hasRequired = typeof props.normal === "number" || typeof props.warning === "number" || typeof props.danger === "number" || typeof props.error === "number"
      || (props.normal?.path) || (props.warning?.path) || (props.danger?.path) || (props.error?.path)

    if (hasRequired) continue

    if (props.option) delete props.option

    props.normal = 45
    props.warning = 12
    props.danger = 5
    props.error = 2

    fixes.push(`[${el.id}] PatStackedBar 缺少 normal/warning/danger/error，已补充默认数据`)
  }

  return [json, fixes]
}

export default fix_pat_stacked_bar
