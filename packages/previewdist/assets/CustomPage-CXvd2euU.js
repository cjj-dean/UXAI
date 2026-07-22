import { C as openBlock, O as ref, _ as createElementBlock, r as Renderer_default, t as __vitePreload, u as provideA2UI, v as createVNode, x as onMounted, y as defineComponent } from "./index-giHJuBgK.js";
//#region src/views/CustomPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "flex flex-col h-screen overflow-auto bg-gray-50" };
var _hoisted_2 = {
	key: 0,
	class: "w-full h-full"
};
var _hoisted_3 = {
	key: 1,
	class: "flex items-center justify-center h-full text-gray-400 text-sm"
};
var _hoisted_4 = { key: 0 };
var _hoisted_5 = { key: 1 };
var surfaceId = "custom-preview-surface";
//#endregion
//#region src/views/CustomPage.vue
var CustomPage_default = /* @__PURE__ */ defineComponent({
	__name: "CustomPage",
	setup(__props) {
		const { createSurface } = provideA2UI();
		const currentContent = ref(null);
		const loading = ref(true);
		onMounted(async () => {
			try {
				const { default: testData } = await __vitePreload(async () => {
					const { default: testData } = await import("./custom-f8t7xju5.js");
					return { default: testData };
				}, []);
				currentContent.value = JSON.parse(JSON.stringify(testData));
				createSurface(surfaceId, currentContent.value);
			} catch (err) {
				console.warn("[CustomPage] 加载 custom.json 失败:", err);
			} finally {
				loading.value = false;
			}
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [currentContent.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode(Renderer_default, { surfaceId })])) : (openBlock(), createElementBlock("div", _hoisted_3, [loading.value ? (openBlock(), createElementBlock("span", _hoisted_4, "加载中...")) : (openBlock(), createElementBlock("span", _hoisted_5, "暂无预览内容"))]))]);
		};
	}
});
//#endregion
export { CustomPage_default as default };
