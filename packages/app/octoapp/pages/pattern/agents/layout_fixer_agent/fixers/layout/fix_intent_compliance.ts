import { type Fixer, elemMap, getClassName, setClassName, tokens } from "../../types"

const LAYOUT_DIR_MAP: Record<string, string[]> = {
  horizontal: ["flex", "flex-row"],
  vertical: ["flex", "flex-col"],
  grid: ["grid"],
}

const LAYOUT_DESC_MAP: Record<string, { parent?: string[]; child?: string[] }> = {
  "justify-between": { parent: ["justify-between"] },
  "three-column": { parent: ["flex", "flex-row"] },
  "equal-width": { parent: ["flex", "flex-row"], child: ["flex-1", "min-w-0"] },
}

const FLEX_SIZE_RE = /^(?:flex-1|shrink-0|w-\[|min-w-|min-h-)/

function hasAllTokens(clsTokens: string[], required: string[]): boolean {
  return required.every((r) => clsTokens.includes(r))
}

function addMissing(cls: string, clsTokens: string[], required: string[]): string {
  const missing = required.filter((r) => !clsTokens.includes(r))
  if (missing.length === 0) return cls
  return `${cls} ${missing.join(" ")}`.trim()
}

function hasFlexSizeToken(toks: string[]): boolean {
  return toks.some((t) => FLEX_SIZE_RE.test(t))
}

function fixChildFlex(childId: string, map: Record<string, any>, required: string[], fixParts: string[], label: string) {
  const child = map[childId]
  if (!child) return
  const cls = getClassName(child)
  const toks = tokens(cls)
  if (hasFlexSizeToken(toks)) return
  if (!hasAllTokens(toks, required)) {
    setClassName(child, addMissing(cls, toks, required))
    fixParts.push(`${label} ${childId} → 补 ${required.join(" ")}`)
  }
}

export const fixIntentCompliance: Fixer = (json) => {
  const fixes: string[] = []
  const intentNodes = json.intentNodes
  if (!intentNodes || Object.keys(intentNodes).length === 0) return [json, fixes]

  const map = elemMap(json.elements)

  for (const elem of json.elements) {
    const intentNode = intentNodes[elem.id]
    if (!intentNode) continue

    const cls = getClassName(elem)
    const clsTokens = tokens(cls)
    const fixParts: string[] = []
    let newCls = cls

    if (intentNode.layout && LAYOUT_DIR_MAP[intentNode.layout]) {
      const required = LAYOUT_DIR_MAP[intentNode.layout]
      if (!hasAllTokens(clsTokens, required)) {
        newCls = addMissing(newCls, tokens(newCls), required)
        fixParts.push(`layout:${intentNode.layout} → 补 ${required.join(" ")}`)
      }
    }

    if (intentNode.layoutDescription && intentNode.layoutDescription !== "default") {
      const desc = LAYOUT_DESC_MAP[intentNode.layoutDescription]
      if (desc) {
        if (desc.parent && !hasAllTokens(tokens(newCls), desc.parent)) {
          newCls = addMissing(newCls, tokens(newCls), desc.parent)
          fixParts.push(`layoutDescription:${intentNode.layoutDescription} → 补 ${desc.parent.join(" ")}`)
        }
        if (desc.child) {
          const childIds = Array.isArray(elem.children)
            ? elem.children.filter((c: any) => typeof c === "string")
            : []
          const templateChild = elem.children && typeof elem.children === "object" && !Array.isArray(elem.children)
            ? (elem.children as any).componentId
            : null

          for (const cid of childIds) {
            const child = map[cid]
            if (!child) continue
            const childCls = getClassName(child)
            const childTokens = tokens(childCls)
            if (!hasAllTokens(childTokens, desc.child)) {
              setClassName(child, addMissing(childCls, childTokens, desc.child))
              fixParts.push(`子元素 ${cid} layoutDescription:${intentNode.layoutDescription} → 补 ${desc.child.join(" ")}`)
            }
          }

          if (templateChild) {
            const tmpl = map[templateChild]
            if (tmpl) {
              const tmplCls = getClassName(tmpl)
              const tmplTokens = tokens(tmplCls)
              if (!hasAllTokens(tmplTokens, desc.child)) {
                setClassName(tmpl, addMissing(tmplCls, tmplTokens, desc.child))
                fixParts.push(`模板 ${templateChild} layoutDescription:${intentNode.layoutDescription} → 补 ${desc.child.join(" ")}`)
              }
            }
          }
        }
      }

      if (intentNode.layoutDescription === "left-fixed" || intentNode.layoutDescription === "right-fixed") {
        if (!tokens(newCls).includes("flex-row")) {
          newCls = addMissing(newCls, tokens(newCls), ["flex", "flex-row"])
          fixParts.push(`layoutDescription:${intentNode.layoutDescription} → 补 flex flex-row`)
        }
        const childIds = Array.isArray(elem.children)
          ? elem.children.filter((c: any) => typeof c === "string")
          : []
        if (childIds.length >= 2) {
          if (intentNode.layoutDescription === "left-fixed") {
            fixChildFlex(childIds[0], map, ["shrink-0"], fixParts, `子元素(左)`)
            fixChildFlex(childIds[1], map, ["flex-1", "min-w-0"], fixParts, `子元素(右)`)
          } else {
            fixChildFlex(childIds[0], map, ["flex-1", "min-w-0"], fixParts, `子元素(左)`)
            fixChildFlex(childIds[1], map, ["shrink-0"], fixParts, `子元素(右)`)
          }
        }
      }
    }

    if (fixParts.length > 0) {
      setClassName(elem, newCls)
      fixes.push(`[${elem.id}] intent 合规修正: ${fixParts.join("; ")}`)
    }
  }

  return [json, fixes]
}
