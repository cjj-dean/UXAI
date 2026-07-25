<script setup lang="ts">
import { ref, watch } from "vue"
import IntentNode from "./IntentNode.ts"
import { ElButton } from "element-plus"

interface TreeNode {
  id: string
  name: string
  layout?: string
  description?: string
  annotations?: string[]
  style?: string
  containerType?: "Region" | "Card" | ""
  children?: TreeNode[]
  itemTemplate?: any
  data?: any[]
  [key: string]: any
}

const props = defineProps<{
  data: TreeNode
}>()

const emit = defineEmits<{
  (e: "confirm", data: TreeNode): void
  (e: "regenerate"): void
}>()

const editingId = ref<string | null>(null)
const editingField = ref<string>("")
const editValue = ref("")
const localData = ref<TreeNode>(JSON.parse(JSON.stringify(props.data)))

watch(() => props.data, (newData) => {
  localData.value = JSON.parse(JSON.stringify(newData))
}, { deep: false })

function startEdit(id: string, field: string, value: string) {
  editingId.value = id
  editingField.value = field
  editValue.value = value ?? ""
}

function findNode(node: TreeNode, id: string): TreeNode | null {
  if (node.id === id) return node
  if (node.children) {
    for (const c of node.children) {
      const found = findNode(c, id)
      if (found) return found
    }
  }
  if (node.itemTemplate) {
    const found = findNode(node.itemTemplate, id)
    if (found) return found
  }
  return null
}

function finishEdit() {
  if (!editingId.value) return
  const node = findNode(localData.value, editingId.value)
  if (node) {
    ;(node as any)[editingField.value] = editValue.value
  }
  editingId.value = null
  editingField.value = ""
}

function toggleIsRegion(id: string) {
  const node = findNode(localData.value, id)
  if (node) {
    const current = node.containerType ?? ""
    node.containerType = current === "" ? "Region" : current === "Region" ? "Card" : ""
  }
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-5">
      <div class="text-lg font-bold" style="color: var(--el-text-color-primary)">意图确认</div>
      <div class="mt-1 text-xs" style="color: var(--el-text-color-secondary)">双击节点名称、描述或样式可编辑，确认后将执行后续生成流程</div>
    </div>
    <div class="rounded-lg overflow-hidden" style="border: 1px solid var(--el-border-color-lighter); background: var(--el-bg-color)">
      <IntentNode
        :node="localData"
        :editing-id="editingId"
        :editing-field="editingField"
        :edit-value="editValue"
        :depth="0"
        @start-edit="startEdit"
        @finish-edit="finishEdit"
        @update:edit-value="(v: string) => editValue = v"
        @cycle-container-type="toggleIsRegion"
      />
    </div>
    <div class="flex gap-3 mt-5">
      <ElButton type="primary" @click="emit('confirm', localData)">确认并继续</ElButton>
      <ElButton @click="emit('regenerate')">重新生成</ElButton>
    </div>
  </div>
</template>
