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
}>()

const editingId = ref<string | null>(null)
const editingField = ref<string>("")
const editValue = ref<string>("")
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

function finishEdit(id: string, field: string, value: string) {
  const node = findNode(localData.value, id)
  if (node) {
    ;(node as any)[field] = value
  }
  editingId.value = null
  editingField.value = ""
  editValue.value = ""
}

function toggleIsRegion(id: string) {
  const node = findNode(localData.value, id)
  if (node) {
    const current = node.containerType ?? ""
    node.containerType = current === "" ? "Region" : current === "Region" ? "Card" : ""
  }
}

function deleteNodeFromTree(parent: TreeNode, id: string): boolean {
  if (parent.children) {
    const idx = parent.children.findIndex(c => c.id === id)
    if (idx >= 0) {
      parent.children.splice(idx, 1)
      return true
    }
    for (const c of parent.children) {
      if (deleteNodeFromTree(c, id)) return true
    }
  }
  if (parent.itemTemplate) {
    if (parent.itemTemplate.id === id) {
      parent.itemTemplate = undefined
      return true
    }
    if (deleteNodeFromTree(parent.itemTemplate, id)) return true
  }
  return false
}

function handleDeleteNode(id: string) {
  if (localData.value.id === id) return
  deleteNodeFromTree(localData.value, id)
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-5">
      <div class="text-lg font-bold" style="color: var(--el-text-color-primary)">意图编辑</div>
      <div class="mt-1 text-xs" style="color: var(--el-text-color-secondary)">双击节点名称、描述或样式可编辑，修改完成后点击"重新执行"将以修改后的意图重新生成页面</div>
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
        @delete-node="handleDeleteNode"
      />
    </div>
    <div class="flex gap-3 mt-5">
      <ElButton type="primary" @click="emit('confirm', localData)">重新执行</ElButton>
    </div>
  </div>
</template>
