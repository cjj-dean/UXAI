import intent_expand from "../agents/intent_expand"
import planner_new_create from "../agents/planner_new_create"
import proto_module_create from "../agents/proto_module_create"
import proto_component_lookup from "../agents/proto_component_lookup"
import { loadComponentDocs, loadLayoutRules } from "../utils/load_component_docs"
import { mergeModules } from "../agents/merge"
import layoutFixer from "../agents/layout_fixer_agent"

type CreateJsonNewInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

export async function create_json_new_step1(inputCtx: CreateJsonNewInput) {
  const normalizedInput = inputCtx.userInput
    .replace(/【独立区块】/g, "{{独立区块}}")
    .replace(/\[独立区块\]/g, "{{独立区块}}")
  const ctx = { ...inputCtx, userInput: normalizedInput }

  const expandResult = await intent_expand(ctx)
  const standardizedIntent = expandResult.standardized_intent
  if (!standardizedIntent) throw new Error("----- intent_expand did not return standardizedIntent -----")

  return { expandResult, standardizedIntent, ctx }
}

export async function create_json_new_step2(
  ctx: CreateJsonNewInput & { userInput: string },
  standardizedIntent: any,
  onFinshed: (finalJson: any) => Promise<void>
) {
  const plannerResult = await planner_new_create({
    ...ctx,
    standardizedIntent,
  })

  const layoutPlanner = plannerResult.layout_planner
  const slots = layoutPlanner.slots ?? []

  const lookupResults = await Promise.all(
    slots.map((slot: any) =>
      proto_component_lookup({
        ...ctx,
        sectionId: slot.section_id,
        elementId: slot.element_id,
        layoutPlanner,
        intentDescription: standardizedIntent,
      })
    )
  )

  const docsMap = new Map(await Promise.all(lookupResults.map(async (r: any) => {
    console.log(`[create_json_new] lookupResult: element_id=${r.element_id}, component_names=${JSON.stringify(r.component_names)}, layout_patterns=${JSON.stringify(r.layout_patterns)}`)
    const [compDocs, layoutDocs] = await Promise.all([
      r.component_names.length > 0 ? loadComponentDocs(r.component_names) : Promise.resolve(""),
      r.layout_patterns.length > 0 ? loadLayoutRules(r.layout_patterns) : Promise.resolve(""),
    ])
    const combined = [compDocs, layoutDocs].filter(Boolean).join("\n\n---\n\n")
    return [r.element_id, combined] as [string, string]
  })))

  const modules = await Promise.all(
    slots.map((slot: any) =>
      proto_module_create({
        ...ctx,
        idPrefix: slot.id_prefix,
        sectionId: slot.section_id,
        elementId: slot.element_id,
        layoutPlanner,
        intentDescription: standardizedIntent,
        componentDocs: docsMap.get(slot.element_id) ?? "",
        onDirectCallTiming: ctx.onDirectCallTiming,
        onReasoningDelta: ctx.onReasoningDelta,
      }).then((r: any) => r.ui_json).catch((err: any) => {
        console.error(`[create_json_new] module_create FAILED for slot ${slot.section_id}:`, err)
        return null
      })
    )
  )

  const validModules = modules.filter((m: any) => m !== null)

  console.log(`[create_json_new] modules count=${validModules.length}`)
  for (let i = 0; i < validModules.length; i++) {
    const m = validModules[i]
    console.log(`[create_json_new] module[${i}]: rootId=${m?.rootId}, elementsCount=${m?.elements?.length}, firstElementIds=${(m?.elements ?? []).slice(0, 3).map((e: any) => e?.id).join(",")}`)
  }
  console.log(`[create_json_new] shell: rootId=${layoutPlanner.rootId}, elementsCount=${(layoutPlanner.elements as any[])?.length}, slotElementIds=${slots.map((s: any) => s.element_id).join(",")}`)

  console.log("[create_json_new] ===== mergeModules START =====")
  const merged = mergeModules(
    {
      rootId: layoutPlanner.rootId as string,
      elements: layoutPlanner.elements as any,
    },
    validModules as any,
    slots,
  )
  console.log(`[create_json_new] ===== mergeModules END ===== merged elements=${merged.elements?.length}, rootId=${merged.rootId}`)
  for (const el of merged.elements ?? []) {
    console.log(`[create_json_new] merged element: id=${el.id}, component=${el.component}, children=${JSON.stringify(el.children)}`)
  }

  const [fixed, fixerLog] = layoutFixer(merged as any)
  if (fixerLog.length) console.log("[LayoutFixer] 日志:\n" + fixerLog.join("\n"))

  await onFinshed({
    layoutPlanner,
    modulesJson: validModules,
    pageJson: fixed,
    fixerLog,
  })
}

export default async function create_json_new(inputCtx: CreateJsonNewInput, onFinshed: (finalJson: any) => Promise<void>) {
  const { expandResult, standardizedIntent, ctx } = await create_json_new_step1(inputCtx)
  await create_json_new_step2(ctx, standardizedIntent, async (result) => {
    await onFinshed({ ...result, intentExpand: expandResult })
  })
}
