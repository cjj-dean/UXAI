import intent_expand from "../agents/intent_expand"
import proto_intent from "../agents/proto_intent"
import proto_intent_audit from "../agents/proto_intent_audit"
import proto_planner_create from "../agents/proto_planner_create"
import proto_module_create from "../agents/proto_module_create"
import proto_component_lookup from "../agents/proto_component_lookup"
import { loadComponentDocs } from "../utils/load_component_docs"
import { mergeModules } from "../agents/merge"
import layoutFixer from "../agents/layout_fixer_agent"
import { validatePlannerOutput, formatValidationFeedback } from "../agents/planner_validator"

type ProtoCreateJsonInput = {
  sdk: any
  sync: any
  modelKey: any
  rootSession: string
  userInput: string
  onDirectCallTiming?: (timing: { agent: string; startTime: number; endTime?: number }) => void
  onReasoningDelta?: (agent: string, delta: string) => void
}

function buildSlotsFromSections(sections: Array<any>): Array<{ section_id: string; element_id: string; id_prefix: string }> {
  const SHELL_SECTION_IDS = new Set(["header", "aside"])
  return sections.map((s) => {
    const id = s.id as string
    const element_id = SHELL_SECTION_IDS.has(id) ? id : id + "Slot"
    const id_prefix = deriveIdPrefix(id)
    return { section_id: id, element_id, id_prefix }
  })
}

function deriveIdPrefix(sectionId: string): string {
  const parts = sectionId.replace(/([A-Z])/g, "_$1").toLowerCase().split(/[_-]+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4)
  return parts.map((p) => p.slice(0, 2)).join("").slice(0, 6)
}

export default async function create_json(inputCtx: ProtoCreateJsonInput, onFinshed: (finalJson: any) => Promise<void>){
    // 第零步：意图扩展与标准化 — 如果意图简单先扩展，再转换为标准JSON格式
    const expandResult = await intent_expand(inputCtx)

    // 第一步：意图扩展（原有proto_intent）
    let intentResult = await proto_intent(inputCtx)
    
    // 第二步：意图检查 - 最多进行N(当前1)次审查 --- 未提升运行速度，暂时屏蔽
    // for (let attempt = 0; attempt < 1; attempt++) {
    //   let descriptionStr = JSON.stringify(intentResult.intent_description);
    //   const audit = await proto_intent_audit({ ...inputCtx, intentDescription: descriptionStr });
    //   if (audit.intent_audit_pass) break;
    //   intentResult = await proto_intent({
    //     ...inputCtx,
    //     auditFeedback: audit.intent_audit_feedback as string,
    //     intentAuditPass: audit.intent_audit_pass as boolean,
    //     pageDescription: descriptionStr
    //   })
    // }
          
    // 第三步：页面局部 — 最多尝试 2 次
    const intentSections = (intentResult.intent_description?.sections as Array<any> ?? [])
    const intentSectionDetailList = (intentResult.intent_description?.sectionDetailList as Array<any> ?? [])
    const hasSidebar = intentSectionDetailList.some(
      (s: any) => s.id?.toLowerCase().includes("sidebar") || s.id?.toLowerCase().includes("side")
    )

    const algorithmicSlots = buildSlotsFromSections(intentSections)

    let pageDescriptionStr = JSON.stringify(intentResult.intent_description);
    const plannerValidateLog: string[] = []
    let planner: any = null
    for (let attempt = 0; attempt < 2; attempt++) {
      planner = await proto_planner_create({ ...inputCtx, intentDescription: pageDescriptionStr, predefinedSlots: algorithmicSlots });
      const layout = planner.layout_planner as any
      if (!layout?.elements) continue

      layout.slots = algorithmicSlots

      const issues = validatePlannerOutput(layout, hasSidebar)
      const errors = issues.filter((i) => i.severity === "error")
      if (errors.length === 0) {
        const warnCount = issues.filter((i) => i.severity === "warning").length
        plannerValidateLog.push(`[planner_validate] 校验通过${warnCount > 0 ? `（${warnCount} 个警告）` : ""}`)
        if (warnCount > 0) {
          issues.filter((i) => i.severity === "warning").forEach((i) => plannerValidateLog.push(`  - ${i.message}: ${i.detail}`))
        }
        break
      }
      plannerValidateLog.push(`[planner_validate] 第 ${attempt + 1} 次输出有 ${errors.length} 个错误，准备重试:`)
      errors.forEach((e) => plannerValidateLog.push(`  [ERROR] ${e.message}: ${e.detail}`))
      console.warn(`[planner_validate] 第 ${attempt + 1} 次输出有 ${errors.length} 个错误，准备重试:\n${formatValidationFeedback(errors)}`)
      if (attempt === 0) {
        pageDescriptionStr = pageDescriptionStr.replace(/\}\s*$/, `, "__planner_feedback__": ${JSON.stringify(formatValidationFeedback(errors))} }`)
      }
    }
    if (planner) {
      planner.layout_planner.slots = algorithmicSlots
      const finalIssues = validatePlannerOutput(planner.layout_planner, hasSidebar)
      const finalErrors = finalIssues.filter((i) => i.severity === "error")
      if (finalErrors.length > 0) {
        plannerValidateLog.push(`[planner_validate] 最终输出仍有 ${finalErrors.length} 个错误:`)
        finalErrors.forEach((e) => plannerValidateLog.push(`  [ERROR] ${e.message}: ${e.detail}`))
        console.warn(`[planner_validate] 最终输出仍有 ${finalErrors.length} 个错误:\n${formatValidationFeedback(finalErrors)}`)
      }
    }
            
    // 第四步：并行查询每个 slot 需要的组件，程序化加载组件文档
    const lookupResults = await Promise.all(
        (planner.layout_planner.slots as Array<any>).map(slot =>
            proto_component_lookup({
                ...inputCtx,
                sectionId: slot.section_id,
                elementId: slot.element_id,
                layoutPlanner: planner.layout_planner,
                intentDescription: intentResult.intent_description
            })
        )
    )
    const docsMap = new Map(await Promise.all(lookupResults.map(async r => {
        console.log(`[create_json] lookupResult: element_id=${r.element_id}, component_names=${JSON.stringify(r.component_names)}`)
        const docs = r.component_names.length > 0 ? await loadComponentDocs(r.component_names) : ""
        console.log(`[create_json] loadComponentDocs 结果: element_id=${r.element_id}, docs长度=${docs.length}`)
        return [r.element_id, docs] as [string, string]
    })))

    // 第五步：并行生成 A2UI JSON
    const modules = await Promise.all(
        (planner.layout_planner.slots as Array<any>).map(slot =>
            proto_module_create({
                ...inputCtx,
                idPrefix: slot.id_prefix,
                sectionId: slot.section_id,
                elementId: slot.element_id,
                layoutPlanner: planner.layout_planner,
                intentDescription: intentResult.intent_description,
                componentDocs: docsMap.get(slot.element_id) ?? "",
                onDirectCallTiming: inputCtx.onDirectCallTiming,
                onReasoningDelta: inputCtx.onReasoningDelta,
            }).then(r => r.ui_json)
        )
    )

    // 第六步：合并完整UI JSON
    const merged = mergeModules(
        { 
            rootId: planner.layout_planner.rootId as string, 
            elements: planner.layout_planner.elements as any 
        },
        modules as any,
        planner.layout_planner.slots as any,
    )

    // 第七步：布局修正（算法修正，非LLM）
    const [fixed, fixerLog] = layoutFixer(merged as any)
    if (fixerLog.length) console.log("[LayoutFixer] 日志:\n" + fixerLog.join("\n"))

    // 执行完成的回调
    await onFinshed({
        // 意图扩展与标准化结果
        intentExpand: expandResult,
        // 页面意图描述
        pageIntent: intentResult.intent_page,
        // 布局规划
        layoutPlanner: planner.layout_planner,
        // 每个模块的 JSON
        modulesJson: modules,
        // 完整页面的 JSON
        pageJson: fixed,
        // fixer 执行日志
        fixerLog,
        // planner 校验日志
        plannerValidateLog,
    })    
}