<script setup lang="ts">
import { computed } from "vue"
import type { A2UIComponentProps, AnyComponentNode } from "../../renderer"
import ComponentNode from "../../renderer/render/ComponentNode.vue"

interface CardProperties {
  className?: string
  children?: AnyComponentNode[]
}

type CardNode = AnyComponentNode<CardProperties> & { type: "Card" }

const props = defineProps<A2UIComponentProps<CardNode>>()
const { node, surfaceId } = props
const properties = computed(() => node.properties)

const fixedClass = "bg-surface-variant rounded-xl p-[1.5rem]"
const mergedClass = computed(() => {
  const userClass = properties.value.className || ""
  return `${fixedClass} ${userClass}`.trim()
})
</script>

<template>
  <div :id="node.id" :class="mergedClass">
    <ComponentNode
      v-for="child in properties.children"
      :key="child.id"
      :node="child"
      :surface-id="surfaceId"
    />
  </div>
</template>
