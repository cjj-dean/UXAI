import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

export const fixVerticalFlex1: Fixer = (json) => {
  const fixes: string[] = []
  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    const cls = getClassName(elem)
    const toks = tokens(cls)
    if (!toks.includes("flex-col") || !Array.isArray(elem.children)) continue

    const childIds = elem.children.filter((c: any) => typeof c === "string")
    if (childIds.length <= 1) continue

    const intentNodes = json.intentNodes ?? {}

    for (const cid of childIds) {
      const child = map[cid]
      if (!child) continue
      if (child.id === "body") continue
      const childCls = getClassName(child)
      const childToks = tokens(childCls)
      if (!childToks.includes("flex-1")) continue

      const intent = intentNodes[cid]
      if (intent?.layoutDescription === "equal-width") continue

      const newCls = childCls.replace(/\bflex-1\b/g, "").replace(/\s+/g, " ").trim()
      setClassName(child, newCls)
      fixes.push(`[${cid}] vertical容器子元素移除flex-1`)
    }
  }

  return [json, fixes]
}
