<script setup lang="ts">
import A2UIRenderer from "../renderer/render/Renderer.vue";
import { provideA2UI } from "../renderer/render/Provider";
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const { createSurface, updateSurface } = provideA2UI();

const currentContent = ref<any>(null);
const surfaceId = "preview-surface";
const loading = ref(true);
const surfaceCreated = ref(false);

const loadedClasses = new Set<string>();
let cssLoadTimer: ReturnType<typeof setTimeout> | null = null;

function applyA2UIJson(data: any) {
  if (!data || !data.rootId || !Array.isArray(data.elements)) return
  currentContent.value = data
  if (!surfaceCreated.value) {
    surfaceCreated.value = true
    createSurface(surfaceId, data)
  } else {
    updateSurface(surfaceId, data)
  }
  scheduleDynamicCSS()
}

function collectDomClassNames(): string[] {
  const classNames = new Set<string>()
  document.querySelectorAll("*").forEach((el) => {
    el.classList?.forEach((cls: string) => {
      if (!loadedClasses.has(cls)) classNames.add(cls)
    })
  })
  return Array.from(classNames)
}

function scheduleDynamicCSS() {
  if (cssLoadTimer) clearTimeout(cssLoadTimer)
  cssLoadTimer = setTimeout(() => void loadDynamicCSS(), 150)
}

async function loadDynamicCSS() {
  await nextTick()
  await new Promise((r) => requestAnimationFrame(() => r(null)))

  const classNames = collectDomClassNames()
  if (classNames.length === 0) return

  try {
    const res = await fetch("/tailwind-compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classes: classNames }),
    })
    if (!res.ok) return
    const css = await res.text()
    classNames.forEach((c) => loadedClasses.add(c))
    if (!css.trim()) return

    let styleEl = document.getElementById("dynamic-tw") as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = "dynamic-tw"
      document.head.appendChild(styleEl)
    }
    styleEl.textContent += "\n" + css
  } catch (err) {
    console.warn("[PreviewPage] Dynamic CSS loading failed:", err)
  }
}

function handleMessage(event: MessageEvent) {
  if (event.data?.type === "A2UI_UPDATE") {
    loading.value = false
    if (event.data.payload === null) {
      currentContent.value = null
    } else if (event.data.payload) {
      applyA2UIJson(event.data.payload)
    }
  }
}

onMounted(async () => {
  window.addEventListener("message", handleMessage)

  if (window.self !== window.top) {
    window.parent.postMessage({ type: "A2UI_READY" }, "*")
  } else {
    try {
      const params = new URLSearchParams(location.search)
      const fetchFile = params.get("fetch")
      if (fetchFile) {
        const res = await fetch("./" + fetchFile, { cache: "no-store" })
        const data = await res.json()
        applyA2UIJson(data)
      } else {
        const { default: testData } = await import("@/jsonStorage/data.json");
        applyA2UIJson(JSON.parse(JSON.stringify(testData)));
      }
    } catch (err) {
      console.warn("[PreviewPage] 加载 data.json 失败:", err);
    } finally {
      loading.value = false;
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage)
});
</script>

<template>
  <div class="flex flex-col h-screen overflow-auto bg-gray-50">
    <!-- 渲染区 -->
    <div v-if="currentContent" class="w-full h-full">
      <A2UIRenderer :surfaceId="surfaceId" />
    </div>
    <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">
      <span v-if="loading">加载中...</span>
      <span v-else>暂无预览内容</span>
    </div>
  </div>
</template>