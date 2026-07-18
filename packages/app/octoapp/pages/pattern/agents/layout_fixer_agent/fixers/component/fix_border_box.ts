import { type A2UIJson, type Fixer, tokens, getClassName, setClassName } from "../../types"

export const fixBorderBox: Fixer = (json: A2UIJson): [A2UIJson, string[]] => {
  const fixes: string[] = []

  for (const elem of json.elements) {
    const cls = getClassName(elem)
    if (!cls) continue
    const toks = tokens(cls)
    if (!toks.includes("border")) continue

    const hasRounded = toks.some((t) => t.startsWith("rounded"))
    const hasPadding = toks.some((t) => /^p[tlbrxy]?-/.test(t) || /^p\[/.test(t))

    const patch: string[] = []
    if (!hasRounded) patch.push("rounded-lg")
    if (!hasPadding) patch.push("p-[0.75rem]")

    if (patch.length > 0) {
      setClassName(elem, `${cls} ${patch.join(" ")}`)
      fixes.push(`[${elem.id}] border容器补充: ${patch.join(", ")}`)
    }
  }

  return [json, fixes]
}
