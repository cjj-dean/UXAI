import { F as openBlock, Vt as toDisplayString, _ as createVNode, f as createCommentVNode, ot as ref, p as createElementBlock, u as createBaseVNode, v as defineComponent } from "./runtime-core.esm-bundler-DGgENxrj.js";
import { t as IntentTreePage_default } from "./index-Cx9glpXD.js";
//#region src/views/IntentTestPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "h-screen overflow-auto bg-gray-50" };
var _hoisted_2 = {
	key: 0,
	class: "p-4 max-w-2xl mx-auto mt-4 border border-green-300 rounded-lg bg-green-50 text-xs"
};
var _hoisted_3 = { class: "font-bold mb-1" };
var _hoisted_4 = {
	key: 0,
	class: "overflow-auto max-h-60"
};
//#endregion
//#region src/views/IntentTestPage.vue
var IntentTestPage_default = /* @__PURE__ */ defineComponent({
	__name: "IntentTestPage",
	setup(__props) {
		const mockIntent = {
			id: "root",
			name: "根节点",
			layout: "vertical",
			children: [
				{
					id: "header",
					name: "顶部导航",
					layout: "horizontal",
					layoutDescription: "three-column",
					description: "左侧为系统Logo与名称：DataMaster Pro。中部为横向排列的导航菜单。右侧依次排列：搜索图标、用户头像。"
				},
				{
					id: "infoBar",
					name: "信息栏",
					layout: "horizontal",
					layoutDescription: "justify-between",
					description: "左侧为全局页面标题文字'网络运行总览'。右侧显示文本标签'实时'及刷新时间。"
				},
				{
					id: "body",
					name: "主体区域",
					layout: "horizontal",
					layoutDescription: "left-fixed",
					children: [{
						id: "aside",
						name: "侧边栏",
						style: "width-54px",
						layout: "vertical",
						description: "左侧菜单栏，采用纵向纯图标排布，8个功能图标。"
					}, {
						id: "main",
						name: "主内容区域",
						layout: "horizontal",
						children: [{
							id: "mainContent",
							name: "主内容",
							layout: "vertical",
							children: [{
								id: "dataOverview",
								name: "数据概览区",
								layout: "horizontal",
								layoutDescription: "equal-width",
								children: [{
									id: "termTypeCard",
									name: "终端类型",
									containerType: "Region",
									style: "rounded-bg,height-300px",
									layout: "vertical",
									description: "标题:终端类型,标题下方环形图+图例,中心数字12及总数"
								}, {
									id: "accessTypeCard",
									name: "接入类型",
									containerType: "Card",
									style: "rounded-bg,shadow",
									layout: "vertical",
									description: "标题:接入类型,结构与终端类型卡片一致,数据:有线66.66%,无线33.34%"
								}]
							}, {
								id: "termUserMgmt",
								name: "终端用户管理",
								style: "rounded-bordered",
								layout: "vertical",
								children: [
									{
										id: "termUserTitle",
										name: "模块标题",
										description: "独立大标题:终端用户"
									},
									{
										id: "termUserToolbar",
										name: "工具栏",
										layout: "horizontal",
										layoutDescription: "justify-between",
										description: "左侧:搜索输入框+高级搜索按钮,右侧:立即扫描按钮+刷新图标"
									},
									{
										id: "termUserTable",
										name: "终端用户表格",
										description: "核心数据表格,18列:全选复选框/终端名称/IP地址/MAC地址等"
									}
								]
							}]
						}, {
							id: "rightPanel",
							name: "右侧面板",
							style: "width-450px",
							layout: "vertical",
							containerType: "Region",
							children: [{
								id: "rightOverview",
								name: "概览面板",
								layout: "vertical",
								description: "设备在线数统计，堆叠条形图"
							}]
						}]
					}]
				}
			]
		};
		const result = ref(null);
		function handleConfirm(data) {
			result.value = {
				type: "confirm",
				data
			};
			console.log("[IntentTest] confirm:", JSON.stringify(data, null, 2));
		}
		function handleRegenerate() {
			result.value = { type: "regenerate" };
			console.log("[IntentTest] regenerate");
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [createVNode(IntentTreePage_default, {
				data: mockIntent,
				onConfirm: handleConfirm,
				onRegenerate: handleRegenerate
			}), result.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("div", _hoisted_3, toDisplayString(result.value.type === "confirm" ? "确认结果" : "重新生成"), 1), result.value.data ? (openBlock(), createElementBlock("pre", _hoisted_4, toDisplayString(JSON.stringify(result.value.data, null, 2)), 1)) : createCommentVNode("", true)])) : createCommentVNode("", true)]);
		};
	}
});
//#endregion
export { IntentTestPage_default as default };
