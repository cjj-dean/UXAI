import proto_intent from "../agents/proto_intent"
import proto_intent_audit from "../agents/proto_intent_audit"
import proto_planner_create from "../agents/proto_planner_create"
import proto_module_create from "../agents/proto_module_create"
import { mergeModules } from "../agents/merge"
import layoutFixer from "../agents/layout_fixer_agent"
import { validatePlannerOutput, formatValidationFeedback } from "../agents/planner_validator"

type ProtoCreateJsonInput = {
  // 公共sdk
  sdk: any
  // 公共流式数据
  sync: any
  // 当前使用的模型
  modelKey: any
  // 根节点session
  rootSession: string
  // 用户输入
  userInput: string
}

export default async function create_json(inputCtx: ProtoCreateJsonInput, onFinshed: (finalJson: any) => Promise<void>){
    // 第一步：意图扩展
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
    let pageDescriptionStr = JSON.stringify(intentResult.intent_description);
    const intentSectionCount = (intentResult.intent_description?.sections as Array<any> ?? []).length
    const hasSidebar = (intentResult.intent_description?.sectionDetailList as Array<any> ?? []).some(
      (s: any) => s.id?.toLowerCase().includes("sidebar") || s.id?.toLowerCase().includes("side")
    )
    const plannerValidateLog: string[] = []
    let planner: any = null
    for (let attempt = 0; attempt < 2; attempt++) {
      planner = await proto_planner_create({ ...inputCtx, intentDescription: pageDescriptionStr });
      const layout = planner.layout_planner as any
      if (!layout?.elements || !layout?.slots) continue
      const issues = validatePlannerOutput(layout, intentSectionCount, hasSidebar)
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
      const finalIssues = validatePlannerOutput(planner.layout_planner, intentSectionCount, hasSidebar)
      const finalErrors = finalIssues.filter((i) => i.severity === "error")
      if (finalErrors.length > 0) {
        plannerValidateLog.push(`[planner_validate] 最终输出仍有 ${finalErrors.length} 个错误:`)
        finalErrors.forEach((e) => plannerValidateLog.push(`  [ERROR] ${e.message}: ${e.detail}`))
        console.warn(`[planner_validate] 最终输出仍有 ${finalErrors.length} 个错误:\n${formatValidationFeedback(finalErrors)}`)
      }
    }
          
    // 第四步：并行生成 A2UI JSON
    const modules = await Promise.all(
        (planner.layout_planner.slots as Array<any>).map(slot =>
            proto_module_create({
                ...inputCtx,
                idPrefix: slot.id_prefix,
                sectionId: slot.section_id,
                elementId: slot.element_id,
                layoutPlanner: planner.layout_planner,
                intentDescription: intentResult.intent_description
            }).then(r => r.ui_json)
        )
    )

    // 第五步：合并完整UI JSON
    const merged = mergeModules(
        { 
            rootId: planner.layout_planner.rootId as string, 
            elements: planner.layout_planner.elements as any 
        },
        modules as any,
        planner.layout_planner.slots as any,
    )

    // 第六步：布局修正（算法修正，非LLM）
    const [fixed, fixerLog] = layoutFixer(merged as any)
    if (fixerLog.length) console.log("[LayoutFixer] 日志:\n" + fixerLog.join("\n"))

    // 执行完成的回调
    await onFinshed({
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