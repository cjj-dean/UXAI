export interface PlannerOutput {
  rootId: string
  elements: { id: string; component: string; props?: Record<string, unknown>; children?: string[] | unknown }[]
  slots: { section_id: string; element_id: string; id_prefix?: string }[]
}

export interface ValidationIssue {
  severity: "error" | "warning"
  message: string
  detail: string
}

export function validatePlannerOutput(planner: PlannerOutput, sectionCount: number, hasSidebar: boolean): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const elMap = new Map<string, typeof planner.elements[0]>()
  const referenced = new Set<string>()
  const parentOf = new Map<string, string[]>() // childId → [parentId, ...]
  for (const el of planner.elements) {
    elMap.set(el.id, el)
    if (Array.isArray(el.children)) {
      for (const c of el.children) {
        if (typeof c === "string") {
          referenced.add(c)
          const p = parentOf.get(c) ?? []
          p.push(el.id)
          parentOf.set(c, p)
        }
      }
    }
  }

  // 1) Root must exist
  const root = elMap.get(planner.rootId)
  if (!root) {
    issues.push({ severity: "error", message: "rootId 不存在", detail: `rootId "${planner.rootId}" 在 elements 中未找到` })
    return issues
  }

  const rootChildren = Array.isArray(root.children) ? root.children.filter((c): c is string => typeof c === "string") : []

  // 2) Must have <main> element
  const hasMain = [...elMap.values()].some((e) => e.component === "main")
  if (!hasMain) {
    issues.push({ severity: "error", message: "缺少 <main>", detail: "页面必须有 <main> 元素作为主内容容器" })
  }

  // 3) Must have <header> element
  const hasHeader = [...elMap.values()].some((e) => e.component === "header")
  if (!hasHeader) {
    issues.push({ severity: "error", message: "缺少 <header>", detail: "页面必须有 <header> 元素" })
  }

  // 4) If sidebar section exists, must have <aside>
  if (hasSidebar) {
    const hasAside = [...elMap.values()].some((e) => e.component === "aside")
    if (!hasAside) {
      issues.push({ severity: "error", message: "缺少 <aside>", detail: "页面包含侧边栏 section，但 elements 中没有 <aside> 元素" })
    }
  }

  // 5) Check all slots have element_id in elements
  for (const slot of planner.slots) {
    if (!elMap.has(slot.element_id)) {
      issues.push({ severity: "error", message: `slot "${slot.element_id}" 不在 elements 中`, detail: `slot section_id="${slot.section_id}" 引用了不存在的 element_id` })
    }
  }

  // 6) Check duplicate references (same slot in multiple parents)
  for (const slot of planner.slots) {
    const parents = parentOf.get(slot.element_id)
    if (parents && parents.length > 1) {
      issues.push({ severity: "error", message: `slot "${slot.element_id}" 被 ${parents.length} 个父元素重复引用`, detail: `重复的父元素: ${parents.join(", ")}。merge 后 fix_duplicate_ref 会删除其中一个引用` })
    }
  }

  // 7) Check orphan slots
  for (const slot of planner.slots) {
    if (!referenced.has(slot.element_id) && elMap.has(slot.element_id)) {
      issues.push({ severity: "error", message: `slot "${slot.element_id}" 是孤儿`, detail: `slot 元素存在但未被任何父元素的 children 引用，merge 后不会渲染` })
    }
  }

  // 8) Check section count matches slot count
  if (planner.slots.length !== sectionCount) {
    issues.push({ severity: "error", message: "section 数量与 slot 数量不匹配", detail: `intent 有 ${sectionCount} 个 section，但 planner 只创建了 ${planner.slots.length} 个 slot` })
  }

  return issues
}

export function formatValidationFeedback(issues: ValidationIssue[]): string {
  return issues
    .map((i) => `[${i.severity.toUpperCase()}] ${i.message}: ${i.detail}`)
    .join("\n")
}
