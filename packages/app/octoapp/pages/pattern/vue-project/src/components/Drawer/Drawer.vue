<script setup lang="ts">
import { computed } from "vue"
import { ElDrawer } from "element-plus"
import type { A2UIComponentProps, AnyComponentNode } from "../../renderer"
import ComponentNode from "../../renderer/render/ComponentNode.vue"

interface DrawerProperties {
  title?: string
  direction?: "ltr" | "rtl" | "ttb" | "btt"
  size?: string
  className?: string
  children?: AnyComponentNode[]
}

type DrawerNode = AnyComponentNode<DrawerProperties> & { type: "Drawer" }

const props = defineProps<A2UIComponentProps<DrawerNode>>()
const { node, surfaceId } = props
const properties = computed(() => node.properties)

const fixedClass = ""
const mergedClass = computed(() => {
  const userClass = properties.value.className || ""
  return `${fixedClass} ${userClass}`.trim()
})
</script>

<template>
  <ElDrawer
    :model-value="true"
    :title="properties.title || ''"
    :direction="properties.direction || 'rtl'"
    :size="properties.size || '30%'"
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
  </ElDrawer>
</template>

<style>
.el-drawer__header {
  margin-bottom: 0 !important;
}
</style>
