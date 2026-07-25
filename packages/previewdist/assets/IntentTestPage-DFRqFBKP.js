import { F as openBlock, Vt as toDisplayString, _ as createVNode, f as createCommentVNode, ot as ref, p as createElementBlock, u as createBaseVNode, v as defineComponent } from "./runtime-core.esm-bundler-DGgENxrj.js";
import { t as IntentTreePage_default } from "./index-CE0uWY-N.js";
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
					description: "左侧为系统Logo与名称，文本为：DataMaster Pro。中部为横向排列的导航菜单，依次为：概览、资源管理、监控、告警。右侧依次排列：搜索图标、用户头像。"
				},
				{
					id: "infoBar",
					name: "信息栏",
					layout: "horizontal",
					description: "左侧为全局页面标题文字'网络运行总览'。右侧显示文本标签'实时'及刷新时间。"
				},
				{
					id: "body",
					name: "主体区域",
					layout: "horizontal",
					children: [{
						id: "aside",
						name: "侧边栏",
						style: "固定宽度54px",
						layout: "vertical",
						description: "左侧菜单栏是缩略版的菜单栏，采用纵向纯图标排布，上方模块垂直排布8个功能图标。"
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
								style: "横向等宽等距排布",
								children: [{
									id: "termTypeCard",
									name: "终端类型{{独立区块}}",
									isRegion: true,
									style: "独立区块,固定高度300px",
									description: "标题:终端类型,标题下方环形图+图例,中心垂直排布大字号数字12及文本总数,数据:手机33.33%,家居设备33.33%,平板16.67%,其他16.67%"
								}, {
									id: "accessTypeCard",
									name: "接入类型{{独立区块}}",
									isRegion: true,
									style: "独立区块,固定高度300px",
									description: "标题:接入类型,结构与终端类型卡片一致,中心数字12及总数,数据:有线66.66%,无线33.34%"
								}]
							}, {
								id: "termUserMgmt",
								name: "终端用户管理{{独立区块}}",
								style: "独立区块",
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
										description: "左右两端对齐,左侧:搜索输入框+高级搜索按钮,右侧:立即扫描按钮+刷新图标"
									},
									{
										id: "termUserTable",
										name: "终端用户表格",
										description: "核心数据表格,18列:全选复选框/终端名称/IP地址/MAC地址/厂商/在线时长/接入时间/上行速率/下行速率/流量消耗/操作"
									}
								]
							}]
						}, {
							id: "rightPanel",
							name: "右侧面板",
							style: "固定宽度500px",
							layout: "vertical",
							children: []
						}]
					}]
				},
				{
					id: "footer",
					name: "底部操作栏",
					layout: "horizontal",
					description: "底部显示版权信息和技术支持联系方式。"
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
