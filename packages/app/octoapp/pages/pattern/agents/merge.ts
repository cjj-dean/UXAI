interface A2UIElement {
  id: string
  component: string
  props?: Record<string, unknown>
  children?: string[] | { path: string; componentId?: string }
}

interface A2UIModule {
  rootId: string
  elements: A2UIElement[]
  state?: Record<string, unknown>
}

function copyChildren(children: unknown): unknown {
  if (Array.isArray(children)) {
    if (
      children.length === 1 &&
      children[0] &&
      typeof children[0] === "object" &&
      "path" in (children[0] as Record<string, unknown>) &&
      "componentId" in (children[0] as Record<string, unknown>)
    ) {
      return { ...(children[0] as Record<string, unknown>) }
    }
    return [...(children as string[])]
  }
  if (children && typeof children === "object") return { ...(children as Record<string, unknown>) }
  return children
}

interface SlotEntry {
  section_id: string
  element_id: string
}

export function mergeModules(shell: A2UIModule, modules: A2UIModule[], slots?: SlotEntry[]): A2UIModule {
  const elements = shell.elements.map((e) => ({
    ...e,
    props: e.props ? { ...e.props } : {},
    children: copyChildren(e.children) as string[] | undefined,
  }))
  const state = { ...(shell.state ?? {}) }

  // [merge diagnostic] 记录传入的 header/aside 状态
  const diagHeader = elements.find((e) => e.component === "header")
  const diagMain = elements.find((e) => e.component === "main")
  if (diagHeader) console.log(`[merge] init: header[${diagHeader.id}].children=${JSON.stringify(diagHeader.children)}, main[${diagMain?.id}].children=${JSON.stringify(diagMain?.children)}`)

  // 构建 module rootId → shell element_id 的映射
  const rootIdRemap = new Map<string, string>()
  if (slots && modules.length === slots.length) {
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].rootId !== slots[i].element_id) {
        rootIdRemap.set(modules[i].rootId, slots[i].element_id)
      }
    }
  }

  for (const mod of modules) {
    const originalRootId = mod.rootId
    const remappedId = rootIdRemap.get(originalRootId) ?? originalRootId
    let slotIndex = elements.findIndex((e) => e.id === originalRootId)
    if (slotIndex === -1) {
      slotIndex = elements.findIndex((e) => e.id === remappedId)
    }
    if (slotIndex === -1) {
      // Planner referenced a slot element that doesn't exist in `elements` —
      // create a placeholder so the module's content is not silently dropped.
      const newSlot = {
        id: originalRootId,
        component: "div",
        props: {} as Record<string, unknown>,
        children: [] as string[] | undefined,
      }
      elements.push(newSlot)
      slotIndex = elements.length - 1
      console.warn(
        `[merge] slot element "${originalRootId}" missing from planner's elements array — auto-created placeholder. ` +
        `Planner must include every slot as a fully-defined element. Module content preserved.`,
      )
    }

    const modRoot = mod.elements.find((e) => e.id === originalRootId)
    if (modRoot) {
      const shellComponent = elements[slotIndex].component
      const overlayComponents = ["Dialog", "Drawer"]
      if (overlayComponents.includes(shellComponent)) {
        if (modRoot.props) {
          const mergedProps = { ...(elements[slotIndex].props ?? {}), ...modRoot.props }
          delete mergedProps.className
          elements[slotIndex].props = mergedProps
        }
        if (modRoot.children) elements[slotIndex].children = copyChildren(modRoot.children) as string[]
      } else {
        const shellClassName = (elements[slotIndex].props?.className as string) ?? ""
        elements[slotIndex].component = modRoot.component
        if (modRoot.props) {
          elements[slotIndex].props = { ...modRoot.props }
          if (shellClassName) elements[slotIndex].props.className = shellClassName
        }
        if (modRoot.children) elements[slotIndex].children = copyChildren(modRoot.children) as string[]
      }
    }

    for (const el of mod.elements) {
      if (el.id === originalRootId) continue
      const existing = elements.findIndex((e) => e.id === el.id)
      if (existing !== -1) {
        elements[existing] = {
          ...el,
          props: el.props ? { ...el.props } : {},
          children: copyChildren(el.children) as string[] | undefined,
        }
      } else {
        elements.push({
          ...el,
          props: el.props ? { ...el.props } : {},
          children: copyChildren(el.children) as string[] | undefined,
        })
      }
    }

    if (mod.state) {
      Object.assign(state, mod.state)
    }
  }

  // Auto-wire orphan slot elements: if a slot's element_id is not referenced
  // in any parent's children array, attach it to the <main> element (or root).
  if (slots) {
    // [merge diagnostic] pre-auto-wire state
    const preHeader = elements.find((e) => e.component === "header")
    const preMain = elements.find((e) => e.component === "main")
    console.log(`[merge] pre-auto-wire: header[${preHeader?.id}].children=${JSON.stringify(preHeader?.children)}, main[${preMain?.id}].children=${JSON.stringify(preMain?.children)}`)
    const referenced = new Set<string>()
    for (const el of elements) {
      if (Array.isArray(el.children)) {
        for (const c of el.children) {
          if (typeof c === "string") referenced.add(c)
          if (c && typeof c === "object" && "componentId" in (c as Record<string, unknown>)) referenced.add((c as { componentId: string }).componentId)
        }
      } else if (el.children && typeof el.children === "object" && typeof (el.children as { componentId?: unknown }).componentId === "string") {
        referenced.add((el.children as { componentId: string }).componentId)
      }
    }
    const mainEl = elements.find((e) => e.component === "main")
    const rootEl = elements.find((e) => e.id === shell.rootId)
    const fallback = mainEl ?? rootEl
    if (fallback) {
      let appended = 0
      for (const slot of slots) {
        if (referenced.has(slot.element_id)) continue
        if (Array.isArray(fallback.children)) {
          (fallback.children as string[]).push(slot.element_id)
        } else if (fallback.children && typeof fallback.children === "object") {
          fallback.children = [slot.element_id]
        } else {
          fallback.children = [slot.element_id]
        }
        referenced.add(slot.element_id)
        appended++
      }
      if (appended > 0) {
        console.log(`[merge] auto-wired ${appended} orphan slot(s) into <${fallback.component}> (id=${fallback.id})`)
      }
      // [merge diagnostic] post-auto-wire state
      const postHeader = elements.find((e) => e.component === "header")
      const postMain = elements.find((e) => e.component === "main")
      console.log(`[merge] post-auto-wire: header[${postHeader?.id}].children=${JSON.stringify(postHeader?.children)}, main[${postMain?.id}].children=${JSON.stringify(postMain?.children)}`)
    }
  }

  return { rootId: shell.rootId, elements, state }
}
