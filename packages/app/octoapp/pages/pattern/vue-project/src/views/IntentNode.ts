import { defineComponent, ref, computed, h, type PropType, type VNode } from "vue"
import { ElTag } from "element-plus"

interface TreeNode {
  id: string
  name: string
  layout?: string
  layoutDescription?: string
  description?: string
  style?: string
  containerType?: "Region" | "Card" | ""
  children?: TreeNode[]
  itemTemplate?: any
  data?: any[]
  [key: string]: any
}

const IntentNode = defineComponent({
  name: "IntentNode",
  props: {
    node: { type: Object as PropType<TreeNode>, required: true },
    editingId: { type: String as PropType<string | null>, default: null },
    editingField: { type: String, default: "" },
    editValue: { type: String, default: "" },
    depth: { type: Number, default: 0 },
    maxExpandDepth: { type: Number, default: 5 },
  },
  emits: ["startEdit", "finishEdit", "update:editValue", "cycleContainerType"],
  setup(props, { emit }) {
    const collapsed = ref(props.depth >= props.maxExpandDepth)
    const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0 || !!props.node.itemTemplate)
    const isEditingName = computed(() => props.editingId === props.node.id && props.editingField === "name")
    const isEditingDesc = computed(() => props.editingId === props.node.id && props.editingField === "description")
    const isEditingStyle = computed(() => props.editingId === props.node.id && props.editingField === "style")

    return () => {
      const indent = props.depth * 32
      const children: VNode[] = []

      const expandIcon = hasChildren.value
        ? h("span", {
            class: "cursor-pointer select-none text-gray-400 hover:text-gray-600 transition-colors",
            style: { width: "16px", height: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0 },
            onClick: () => { collapsed.value = !collapsed.value },
          }, collapsed.value ? "▶" : "▼")
        : h("span", { style: { width: "16px", flexShrink: 0 } })

      const nameEl = !isEditingName.value
        ? h("span", {
            class: "text-sm font-medium cursor-pointer hover:text-[var(--el-color-primary)] transition-colors",
            style: { lineHeight: "22px" },
            onDblclick: () => emit("startEdit", props.node.id, "name", props.node.name),
          }, props.node.name)
        : h("input", {
            value: props.editValue,
            style: { width: "160px", fontSize: "13px", padding: "2px 6px", border: "1px solid var(--el-border-color)", borderRadius: "4px", outline: "none" },
            onInput: (e: Event) => emit("update:editValue", (e.target as HTMLInputElement).value),
            onBlur: () => emit("finishEdit"),
            onKeydown: (e: Event) => { if ((e as KeyboardEvent).key === "Enter") emit("finishEdit") },
          })

      const infoTags: VNode[] = []

      infoTags.push(h("span", {
        class: "text-xs font-mono px-1.5 py-0.5 rounded",
        style: { backgroundColor: "var(--el-fill-color-light)", color: "var(--el-text-color-secondary)" },
      }, props.node.id))

      infoTags.push(nameEl)

      if (props.node.layout) {
        infoTags.push(h(ElTag, { size: "small", type: "info", effect: "plain" }, () => props.node.layout!))
      }

      if (props.node.layoutDescription) {
        infoTags.push(h(ElTag, { size: "small", type: "warning", effect: "plain" }, () => props.node.layoutDescription!))
      }

      if (props.node.style && !isEditingStyle.value) {
        infoTags.push(h("span", {
          class: "text-xs cursor-pointer hover:opacity-80 transition-opacity",
          style: { color: "var(--el-color-warning)" },
          onDblclick: () => emit("startEdit", props.node.id, "style", props.node.style || ""),
        }, props.node.style))
      } else if (isEditingStyle.value) {
        infoTags.push(h("input", {
          value: props.editValue,
          style: { width: "180px", fontSize: "12px", padding: "2px 6px", border: "1px solid var(--el-border-color)", borderRadius: "4px", outline: "none" },
          onInput: (e: Event) => emit("update:editValue", (e.target as HTMLInputElement).value),
          onBlur: () => emit("finishEdit"),
          onKeydown: (e: Event) => { if ((e as KeyboardEvent).key === "Enter") emit("finishEdit") },
        }))
      }

      const descEl = props.node.description
        ? h("div", {
            class: "mt-1 leading-relaxed",
            style: { fontSize: "12px", color: "var(--el-text-color-secondary)", paddingLeft: "4px" },
          },
            !isEditingDesc.value
              ? h("span", {
                  class: "cursor-pointer hover:text-[var(--el-text-color-primary)] transition-colors",
                  onDblclick: () => emit("startEdit", props.node.id, "description", props.node.description || ""),
                }, props.node.description)
              : h("textarea", {
                  value: props.editValue,
                  style: { width: "100%", fontSize: "12px", padding: "4px 6px", border: "1px solid var(--el-border-color)", borderRadius: "4px", outline: "none", resize: "vertical", minHeight: "40px" },
                  onInput: (e: Event) => emit("update:editValue", (e.target as HTMLTextAreaElement).value),
                  onBlur: () => emit("finishEdit"),
                  onKeydown: (e: Event) => { if ((e as KeyboardEvent).key === "Enter" && (e as KeyboardEvent).ctrlKey) emit("finishEdit") },
                })
          )
        : null

      const containerTypeMap: Record<string, { label: string; class: string }> = {
        Region: { label: "Region", class: "bg-[var(--el-color-primary-light-9)] text-[var(--el-color-primary)] hover:bg-[var(--el-color-primary-light-7)]" },
        Card: { label: "Card", class: "bg-[var(--el-color-success-light-9)] text-[var(--el-color-success)] hover:bg-[var(--el-color-success-light-7)]" },
      }
      const ct = props.node.containerType
      const ctInfo = ct && containerTypeMap[ct]
      const containerBtn = h("span", {
        class: [
          "text-xs px-2 py-0.5 rounded cursor-pointer select-none transition-all flex-shrink-0",
          ctInfo ? ctInfo.class : "text-[var(--el-text-color-placeholder)] hover:text-[var(--el-color-primary)] hover:bg-[var(--el-fill-color)]",
        ],
        onClick: () => emit("cycleContainerType", props.node.id),
      }, ctInfo ? `${ctInfo.label} ✓` : "容器类型")

      const row = h("div", {
        class: "flex items-start py-2 pr-3 hover:bg-[var(--el-fill-color)] transition-colors border-b border-[var(--el-border-color-lighter)] last:border-b-0",
      }, [
        h("div", { style: { width: indent + 8 + "px", flexShrink: 0 } }),
        expandIcon,
        h("div", { class: "flex-1 min-w-0", style: { marginLeft: "8px" } }, [
          h("div", { class: "flex items-center gap-2 flex-wrap" }, infoTags),
          descEl,
        ]),
        containerBtn,
      ])

      children.push(row)

      if (!collapsed.value && props.node.children) {
        for (const child of props.node.children) {
          children.push(
            h(IntentNode, {
              node: child,
              editingId: props.editingId,
              editingField: props.editingField,
              editValue: props.editValue,
              depth: props.depth + 1,
              maxExpandDepth: props.maxExpandDepth,
              onStartEdit: (...args: [string, string, string]) => emit("startEdit", args[0], args[1], args[2]),
              onFinishEdit: () => emit("finishEdit"),
              onUpdateEditValue: (v: string) => emit("update:editValue", v),
              onCycleContainerType: (id: string) => emit("cycleContainerType", id),
            })
          )
        }
      }

      if (!collapsed.value && props.node.itemTemplate) {
        children.push(
          h("div", {
            class: "py-1 px-3 border-b border-[var(--el-border-color-lighter)] text-xs italic",
            style: { paddingLeft: (props.depth + 1) * 32 + 16 + "px", color: "var(--el-text-color-placeholder)" },
          }, "itemTemplate:")
        )
        children.push(
          h(IntentNode, {
            node: props.node.itemTemplate,
            editingId: props.editingId,
            editingField: props.editingField,
            editValue: props.editValue,
            depth: props.depth + 2,
            maxExpandDepth: props.maxExpandDepth,
            onStartEdit: (...args: [string, string, string]) => emit("startEdit", args[0], args[1], args[2]),
            onFinishEdit: () => emit("finishEdit"),
            onUpdateEditValue: (v: string) => emit("update:editValue", v),
            onCycleContainerType: (id: string) => emit("cycleContainerType", id),
          })
        )
      }

      return h("div", children)
    }
  },
})

export default IntentNode
