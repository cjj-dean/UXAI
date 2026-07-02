import { type Fixer, getClassName, setClassName, tokens } from "../../types"

export const fixOverflow: Fixer = (json) => {
  const fixes: string[] = []
  const rootId = json.rootId ?? ""
  for (const elem of json.elements) {
    let cls = getClassName(elem)
    const toks = tokens(cls)

    if (elem.id === rootId && !toks.includes("overflow-x-hidden")) {
      cls = `${cls} overflow-x-hidden`.trim()
      setClassName(elem, cls)
      fixes.push(`[${elem.id}](${elem.component}) root 元素缺少 overflow-x-hidden: 已补充`)
    }

    const currentToks = tokens(getClassName(elem))
    if (currentToks.includes("flex-1") && !currentToks.includes("min-w-0") && !currentToks.includes("flex-row")) {
      cls = `${getClassName(elem)} min-w-0`.trim()
      setClassName(elem, cls)
      fixes.push(`[${elem.id}](${elem.component}) flex-1 容器缺少 min-w-0: 已补充`)
    }

    const isMainContent = elem.id === "mainContent" || elem.component === "main"
    if (!isMainContent) {
      const toks2 = tokens(getClassName(elem))
      // Section/Card 自带边距和背景，不应设置 overflow-*（会导致内容被截断）
      if (elem.component === "Section" || elem.component === "Card" || elem.component === "Dialog" || elem.component === "Drawer") {
        const oldLen = toks2.length
        const cleaned = toks2.filter((t) => !t.startsWith("overflow-"))
        if (cleaned.length !== oldLen) {
          setClassName(elem, cleaned.join(" "))
          fixes.push(`[${elem.id}](${elem.component}) ${elem.component} 移除 overflow 类: 已被清理`)
        }
        continue
      }
      let changed = false
      const newToks = toks2.map((t) => {
        if (["overflow-y-auto", "overflow-auto", "overflow-y-scroll"].includes(t)) {
          changed = true
          return "overflow-hidden"
        }
        return t
      })
      if (changed) {
        setClassName(elem, newToks.join(" "))
        fixes.push(`[${elem.id}](${elem.component}) 非mainContent元素含overflow-y-auto: 替换为overflow-hidden`)
      }
    }
  }
  return [json, fixes]
}
