import { A as normalizeClass, C as openBlock, D as withCtx, E as watch, M as toDisplayString, O as ref, S as onUnmounted, T as resolveComponent, _ as createElementBlock, a as Moon, b as nextTick, c as ChevronRight, d as _plugin_vue_export_helper_default, f as Fragment, g as createCommentVNode, h as createBlock, i as Sun, j as normalizeStyle, k as unref, l as ChevronLeft, m as createBaseVNode, n as useTheme, o as Folder, p as computed, r as Renderer_default, s as FileBraces, u as provideA2UI, v as createVNode, w as renderList, x as onMounted, y as defineComponent } from "./index-BZnQ0q6x.js";
//#region \0virtual:test-files
var _virtual_test_files_default = [];
//#endregion
//#region src/views/ExplorerPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex h-screen overflow-hidden bg-surface-container-lowest" };
var _hoisted_2 = { class: "flex flex-col border-r border-divider w-64 shrink-0 relative" };
var _hoisted_3 = { class: "p-3 pt-8 border-b border-divider whitespace-nowrap" };
var _hoisted_4 = { class: "flex-1 overflow-y-auto p-2 whitespace-nowrap" };
var _hoisted_5 = ["onMouseenter"];
var _hoisted_6 = { class: "max-w-[420px] max-h-[60vh] px-3 text-sm overflow-auto" };
var _hoisted_7 = {
	key: 1,
	class: "flex items-center gap-1.5"
};
var _hoisted_8 = { class: "text-sm truncate" };
var _hoisted_9 = { class: "flex-1 overflow-auto flex flex-col" };
var _hoisted_10 = {
	key: 0,
	class: "w-full h-full"
};
var _hoisted_11 = {
	key: 1,
	class: "flex items-center justify-center h-full text-gray-400 text-sm"
};
var surfaceId = "preview-surface";
//#endregion
//#region src/views/ExplorerPage.vue
var ExplorerPage_default = /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "ExplorerPage",
	setup(__props) {
		const { createSurface, updateSurface } = provideA2UI();
		const modelOptions = ref([
			{
				label: "gemini-3.0-flash",
				value: "gemini-3.0-flash"
			},
			{
				label: "deepseek-v4-flash",
				value: "deepseek-v4-flash"
			},
			{
				label: "glm-5.1",
				value: "glm-5.1"
			},
			{
				label: "glm-5.1(多轮)",
				value: "glm-5.1(多轮)"
			}
		]);
		const selectedModel = ref("gemini-3.0-flash");
		const selectedJsonPath = ref("");
		const selectedJsonInfo = ref(null);
		const currentContent = ref(null);
		const surfaceCreated = ref(false);
		const treeRef = ref(null);
		let abortController = null;
		const sidebarCollapsed = ref(false);
		const { isDark, toggleTheme } = useTheme();
		const tooltipMap = ref({});
		const mdCache = /* @__PURE__ */ new Map();
		function toggleSidebar() {
			sidebarCollapsed.value = !sidebarCollapsed.value;
		}
		async function loadMdContent(jsonPath) {
			if (mdCache.has(jsonPath)) return mdCache.get(jsonPath);
			const mdPath = jsonPath.replace(/\.json$/, ".md");
			try {
				const res = await fetch(`/api/test-file?path=${encodeURIComponent(mdPath)}`);
				if (res.ok) {
					const text = await res.text();
					mdCache.set(jsonPath, text);
					return text;
				}
			} catch (e) {}
			const fallback = "未找到需求描述";
			mdCache.set(jsonPath, fallback);
			return fallback;
		}
		async function handleLeafMouseEnter(data) {
			const jsonPath = data.path;
			if (tooltipMap.value[jsonPath]) return;
			tooltipMap.value[jsonPath] = "加载中...";
			const content = await loadMdContent(jsonPath);
			tooltipMap.value[jsonPath] = content;
		}
		function hasModelSubfolder(dir) {
			const modelLabels = modelOptions.value.map((m) => m.value);
			return (dir.children || []).some((child) => child.isDirectory && modelLabels.includes(child.label));
		}
		const menuTree = computed(() => {
			const modelLabels = modelOptions.value.map((m) => m.value);
			function buildTree(data) {
				return data.map((item) => {
					if (!item.isDirectory) return null;
					if (hasModelSubfolder(item)) {
						const fileMap = /* @__PURE__ */ new Map();
						for (const child of item.children || []) if (child.isDirectory && modelLabels.includes(child.label)) {
							for (const file of child.children || []) if (!file.isDirectory) {
								if (!fileMap.has(file.label)) fileMap.set(file.label, /* @__PURE__ */ new Set());
								fileMap.get(file.label).add(child.label);
							}
						}
						if (fileMap.size === 0) return null;
						const jsonFiles = Array.from(fileMap.entries()).map(([filename, models]) => {
							const modelList = Array.from(models);
							return {
								label: filename,
								path: item.path + "/" + filename,
								models: modelList
							};
						});
						return {
							label: item.label,
							path: item.path,
							children: jsonFiles
						};
					}
					const children = buildTree(item.children || []);
					if (children.length === 0) return null;
					return {
						label: item.label,
						path: item.path,
						children
					};
				}).filter(Boolean);
			}
			return buildTree(_virtual_test_files_default);
		});
		const flatLeaves = computed(() => {
			const leaves = [];
			function collectLeaves(nodes) {
				for (const node of nodes) if (node.children) collectLeaves(node.children);
				else leaves.push(node);
			}
			collectLeaves(menuTree.value);
			return leaves;
		});
		const currentLeafIndex = computed(() => {
			return flatLeaves.value.findIndex((leaf) => leaf.path === selectedJsonPath.value);
		});
		function navigateToLeaf(index) {
			if (index < 0 || index >= flatLeaves.value.length) return;
			const leaf = flatLeaves.value[index];
			selectedJsonPath.value = leaf.path;
			selectedJsonInfo.value = leaf;
			loadJsonContent();
			nextTick(() => {
				treeRef.value?.setCurrentKey(leaf.path);
			});
		}
		function navigatePrev() {
			if (currentLeafIndex.value > 0) navigateToLeaf(currentLeafIndex.value - 1);
		}
		function navigateNext() {
			if (currentLeafIndex.value < flatLeaves.value.length - 1) navigateToLeaf(currentLeafIndex.value + 1);
		}
		function getFetchUrl() {
			const info = selectedJsonInfo.value;
			if (!info) return "";
			const parts = info.path.split("/");
			const filename = parts[parts.length - 1];
			const parentPath = parts.slice(0, -1).join("/");
			let model = selectedModel.value;
			const fullPath = parentPath + "/" + model + "/" + filename;
			return `/api/test-file?path=${encodeURIComponent(fullPath)}`;
		}
		async function loadJsonContent() {
			if (abortController) abortController.abort();
			abortController = new AbortController();
			const signal = abortController.signal;
			const fetchUrl = getFetchUrl();
			try {
				const res = await fetch(fetchUrl, { signal });
				if (!res.ok) {
					console.warn(`[loadJsonContent] 请求失败: ${res.status} ${fetchUrl}`);
					currentContent.value = null;
					return;
				}
				const text = await res.text();
				if (!text || !text.trim()) {
					console.warn(`[loadJsonContent] 返回内容为空: ${fetchUrl}`);
					currentContent.value = null;
					return;
				}
				let content;
				try {
					content = JSON.parse(text);
				} catch (parseErr) {
					console.warn(`[loadJsonContent] JSON 解析失败: ${fetchUrl}`, parseErr);
					currentContent.value = null;
					return;
				}
				if (signal.aborted) return;
				currentContent.value = content;
				if (!surfaceCreated.value) {
					surfaceCreated.value = true;
					createSurface(surfaceId, content);
				} else updateSurface(surfaceId, content);
			} catch (err) {
				if (err?.name === "AbortError") return;
				console.warn(`[loadJsonContent] 加载异常: ${fetchUrl}`, err);
				currentContent.value = null;
			}
		}
		function handleNodeClick(data) {
			if (data.children) return;
			selectedJsonPath.value = data.path;
			selectedJsonInfo.value = data;
			loadJsonContent();
		}
		watch(selectedModel, () => {
			if (selectedJsonPath.value) loadJsonContent();
		});
		function findFirstLeaf(nodes) {
			for (const node of nodes) if (node.children) {
				const found = findFirstLeaf(node.children);
				if (found) return found;
			} else return node;
			return null;
		}
		function handleKeydown(e) {
			if (!sidebarCollapsed.value) return;
			if (e.key === "ArrowUp") {
				e.preventDefault();
				navigatePrev();
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				navigateNext();
			}
		}
		onMounted(async () => {
			toggleTheme();
			const firstLeaf = findFirstLeaf(menuTree.value);
			if (firstLeaf) {
				selectedJsonPath.value = firstLeaf.path;
				selectedJsonInfo.value = firstLeaf;
				loadJsonContent();
				nextTick(() => {
					treeRef.value?.setCurrentKey(firstLeaf.path);
				});
			}
			window.addEventListener("keydown", handleKeydown);
		});
		onUnmounted(() => {
			if (abortController) {
				abortController.abort();
				abortController = null;
			}
			window.removeEventListener("keydown", handleKeydown);
		});
		return (_ctx, _cache) => {
			const _component_el_option = resolveComponent("el-option");
			const _component_el_select = resolveComponent("el-select");
			const _component_el_tooltip = resolveComponent("el-tooltip");
			const _component_el_tree = resolveComponent("el-tree");
			return openBlock(), createElementBlock("div", _hoisted_1, [
				sidebarCollapsed.value ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: "fixed left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white rounded-full shadow-lg border border-divider flex items-center justify-center cursor-pointer hover:shadow-xl hover:bg-blue-50 transition-all duration-200 group",
					onClick: toggleSidebar
				}, [createVNode(unref(ChevronRight), { class: "w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" })])) : createCommentVNode("", true),
				createBaseVNode("div", {
					class: "left-content relative flex shrink-0 transition-all duration-300",
					style: normalizeStyle({
						width: sidebarCollapsed.value ? "0px" : "256px",
						overflow: "hidden"
					})
				}, [createBaseVNode("div", _hoisted_2, [
					createBaseVNode("div", {
						class: normalizeClass(["absolute right-2 top-2 z-9999 w-10 h-10 rounded-full shadow-lg border flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-200 group", unref(isDark) ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-divider hover:bg-blue-50"]),
						onClick: _cache[0] || (_cache[0] = (...args) => unref(toggleTheme) && unref(toggleTheme)(...args))
					}, [unref(isDark) ? (openBlock(), createBlock(unref(Sun), {
						key: 0,
						class: "w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors"
					})) : (openBlock(), createBlock(unref(Moon), {
						key: 1,
						class: "w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors"
					}))], 2),
					createBaseVNode("div", _hoisted_3, [_cache[2] || (_cache[2] = createBaseVNode("label", { class: "block text-xs text-gray-500 mb-1.5 font-medium" }, "模型切换", -1)), createVNode(_component_el_select, {
						modelValue: selectedModel.value,
						"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedModel.value = $event),
						size: "small",
						style: { "width": "100%" },
						teleported: true,
						"popper-class": "model-select-popper"
					}, {
						default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(modelOptions.value, (item) => {
							return openBlock(), createBlock(_component_el_option, {
								key: item.value,
								label: item.label,
								value: item.value
							}, null, 8, ["label", "value"]);
						}), 128))]),
						_: 1
					}, 8, ["modelValue"])]),
					createBaseVNode("div", _hoisted_4, [createVNode(_component_el_tree, {
						ref_key: "treeRef",
						ref: treeRef,
						data: menuTree.value,
						"node-key": "path",
						"default-expand-all": "",
						"highlight-current": "",
						props: {
							label: "label",
							children: "children"
						},
						onNodeClick: handleNodeClick
					}, {
						default: withCtx(({ node, data }) => [!data.children ? (openBlock(), createBlock(_component_el_tooltip, {
							key: 0,
							placement: "right",
							"show-after": 300,
							"raw-content": false,
							teleported: true,
							"popper-options": { strategy: "fixed" },
							"popper-style": { padding: "8px 0px" }
						}, {
							content: withCtx(() => [createBaseVNode("div", _hoisted_6, toDisplayString(tooltipMap.value[data.path] || "加载中..."), 1)]),
							default: withCtx(() => [createBaseVNode("div", {
								class: "flex items-center gap-1.5",
								onMouseenter: ($event) => handleLeafMouseEnter(data)
							}, [createVNode(unref(FileBraces), {
								size: 14,
								class: "text-blue-400"
							}), createBaseVNode("span", { class: normalizeClass(["text-sm truncate", { "line-through text-gray-400": data.models && !data.models.includes(selectedModel.value) }]) }, toDisplayString(node.label), 3)], 40, _hoisted_5)]),
							_: 2
						}, 1024)) : (openBlock(), createElementBlock("div", _hoisted_7, [createVNode(unref(Folder), {
							size: 14,
							class: "text-gray-400"
						}), createBaseVNode("span", _hoisted_8, toDisplayString(node.label), 1)]))]),
						_: 1
					}, 8, ["data"])]),
					createBaseVNode("div", {
						class: "flex items-center justify-center h-8 border-t border-divider cursor-pointer hover:bg-blue-50 transition-colors group shrink-0",
						onClick: toggleSidebar
					}, [createVNode(unref(ChevronLeft), { class: "w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-transform duration-300" })])
				])], 4),
				createBaseVNode("div", _hoisted_9, [currentContent.value ? (openBlock(), createElementBlock("div", _hoisted_10, [createVNode(Renderer_default, { surfaceId })])) : (openBlock(), createElementBlock("div", _hoisted_11, " 暂无预览内容 "))])
			]);
		};
	}
}), [["__scopeId", "data-v-9e74e321"]]);
//#endregion
export { ExplorerPage_default as default };
