<script setup lang="ts">
import { computed } from "vue"
import { ElDialog } from "element-plus"
import type { A2UIComponentProps, AnyComponentNode } from "../../renderer"
import ComponentNode from "../../renderer/render/ComponentNode.vue"

interface DialogProperties {
  title?: string
  width?: string
  className?: string
  children?: AnyComponentNode[]
}

type DialogNode = AnyComponentNode<DialogProperties> & { type: "Dialog" }

const props = defineProps<A2UIComponentProps<DialogNode>>()
const { node, surfaceId } = props
const properties = computed(() => node.properties)

const fixedClass = "z-[99] overflow-y-auto flex flex-col gap-[1rem] bg-surface-container-highest shadow-sm"
const mergedClass = computed(() => {
  const userClass = properties.value.className || ""
  return `${fixedClass} ${userClass}`.trim()
})
</script>

<template>
  <ElDialog
    :model-value="true"
    :title="properties.title || ''"
    :width="properties.width || '50%'"
    :class="mergedClass"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
  >
    <ComponentNode
      v-for="child in properties.children"
      :key="child.id"
      :node="child"
      :surface-id="surfaceId"
    />
  </ElDialog>
</template>

<style>
.el-dialog__header {
  margin-bottom: 0 !important;
}
</style>
