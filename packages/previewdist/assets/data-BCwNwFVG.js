var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLogo",
				"headMenu",
				"headSearchIcon"
			]
		},
		{
			"id": "backBar",
			"component": "div",
			"props": { "className": "flex flex-row shrink-0" },
			"children": ["babaBackBtn"]
		},
		{
			"id": "configRegion",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem] shrink-0" },
			"children": [
				"coreStepBar",
				"coreBasicConfig",
				"coreTransferArea"
			],
			"annotations": ["独立区块"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-col" },
			"children": ["backBar", "configRegion"]
		},
		{
			"id": "body",
			"component": "div",
			"props": { "className": "flex flex-row flex-1 overflow-hidden" },
			"children": ["main"]
		},
		{
			"id": "footer",
			"component": "div",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-end items-center px-[1.5rem] py-[0.75rem] gap-[1rem]" },
			"children": ["footLeftText", "footRightBtns"]
		},
		{
			"id": "root",
			"component": "div",
			"props": { "className": "flex flex-col h-screen overflow-hidden bg-surface-container-lowest overflow-x-hidden" },
			"children": [
				"header",
				"body",
				"footer"
			]
		},
		{
			"id": "headLogo",
			"component": "span",
			"props": {
				"value": "DataConfig Pro",
				"className": "text-on-surface"
			}
		},
		{
			"id": "headMenu",
			"component": "Menu",
			"props": {
				"mode": "horizontal",
				"selectedKeys": ["节点配置"],
				"items": [
					{
						"title": "首页",
						"key": "首页"
					},
					{
						"title": "数据面板",
						"key": "数据面板"
					},
					{
						"title": "权限控制",
						"key": "权限控制"
					},
					{
						"title": "模块管理",
						"key": "模块管理"
					},
					{
						"title": "节点配置",
						"key": "节点配置"
					},
					{
						"title": "扩展中心",
						"key": "扩展中心"
					}
				]
			}
		},
		{
			"id": "headSearchIcon",
			"component": "Icon",
			"props": {
				"name": "search",
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "babaBackBtn",
			"component": "Button",
			"props": {
				"value": "返回节点列表",
				"types": "link",
				"icon": "chevron-left",
				"iconPlacement": "start"
			}
		},
		{
			"id": "coreStepBar",
			"component": "Steps",
			"props": {
				"current": 0,
				"types": "default",
				"className": ""
			},
			"children": ["coreStepItem1", "coreStepItem2"]
		},
		{
			"id": "coreStepItem1",
			"component": "StepItem",
			"props": {
				"title": "规则设置",
				"status": "process",
				"icon": "settings",
				"className": "mb-[1rem]"
			}
		},
		{
			"id": "coreStepItem2",
			"component": "StepItem",
			"props": {
				"title": "确认发布",
				"status": "wait",
				"icon": "send"
			}
		},
		{
			"id": "coreBasicConfig",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"coreConfigTitle",
				"coreNodeCategory",
				"coreEnvSelector",
				"coreRouteType"
			]
		},
		{
			"id": "coreConfigTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "基础配置"
			}
		},
		{
			"id": "coreNodeCategory",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["coreNodeCategoryLabel", "coreNodeCategorySegmented"]
		},
		{
			"id": "coreNodeCategoryLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant whitespace-nowrap",
				"value": "节点类别"
			}
		},
		{
			"id": "coreNodeCategorySegmented",
			"component": "Segmented",
			"props": {
				"value": { "path": "/nodeCategoryValue" },
				"options": { "path": "/nodeCategoryOptions" },
				"size": "medium"
			}
		},
		{
			"id": "coreEnvSelector",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["coreEnvLabel", "coreEnvSelect"]
		},
		{
			"id": "coreEnvLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant whitespace-nowrap",
				"value": "关联环境"
			}
		},
		{
			"id": "coreEnvSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/envValue" },
				"options": { "path": "/envOptions" },
				"size": "medium",
				"className": "shrink-0 w-auto"
			}
		},
		{
			"id": "coreRouteType",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["coreRouteLabel", "coreRouteRadio"]
		},
		{
			"id": "coreRouteLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant whitespace-nowrap",
				"value": "路由类型"
			}
		},
		{
			"id": "coreRouteRadio",
			"component": "RadioGroup",
			"props": {
				"value": { "path": "/routeValue" },
				"options": { "path": "/routeOptions" },
				"orientation": "horizontal"
			}
		},
		{
			"id": "coreTransferArea",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": ["coreTransferTitle", "coreTransferContent"]
		},
		{
			"id": "coreTransferTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "主内容区下部：穿梭框"
			}
		},
		{
			"id": "coreTransferContent",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-stretch" },
			"children": [
				"coreLeftSourcePanel",
				"coreTransferButtons",
				"coreRightTargetPanel"
			]
		},
		{
			"id": "coreLeftSourcePanel",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] border border-base rounded-xl p-[1rem] flex-1 min-w-0" },
			"children": [
				"coreLeftPanelHeader",
				"coreLeftPanelHint",
				"coreLeftTable"
			]
		},
		{
			"id": "coreLeftPanelHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["coreLeftPanelTitle", "coreLeftPanelClearBtn"]
		},
		{
			"id": "coreLeftPanelTitle",
			"component": "span",
			"props": {
				"className": "text-sm font-semibold text-on-surface",
				"value": "可用数据源(102)"
			}
		},
		{
			"id": "coreLeftPanelClearBtn",
			"component": "Button",
			"props": {
				"types": "link",
				"value": "清空"
			}
		},
		{
			"id": "coreLeftPanelHint",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": "请勾选需要绑定的目标节点，点击右箭头将其添加至右侧列表。"
			}
		},
		{
			"id": "coreLeftTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/leftTableData" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIP",
						"minWidth": 123
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIP",
						"minWidth": 95
					},
					{
						"title": "运行状态",
						"dataIndex": "status",
						"minWidth": 88
					},
					{
						"title": "设备标识",
						"dataIndex": "deviceId",
						"minWidth": 144
					},
					{
						"title": "固件版本",
						"dataIndex": "firmware",
						"minWidth": 88
					}
				],
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedLeftKeys" }
				},
				"className": "mb-0"
			}
		},
		{
			"id": "coreTransferButtons",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem] justify-center" },
			"children": ["coreMoveRightBtn", "coreMoveLeftBtn"]
		},
		{
			"id": "coreMoveRightBtn",
			"component": "Button",
			"props": {
				"value": ">",
				"className": "w-8 h-8"
			}
		},
		{
			"id": "coreMoveLeftBtn",
			"component": "Button",
			"props": {
				"value": "<",
				"className": "w-8 h-8"
			}
		},
		{
			"id": "coreRightTargetPanel",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] border border-base rounded-xl p-[1rem] flex-1 min-w-0" },
			"children": [
				"coreRightPanelHeader",
				"coreRightPanelHint",
				"coreRightTable"
			]
		},
		{
			"id": "coreRightPanelHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["coreRightPanelTitle", "coreRightPanelActions"]
		},
		{
			"id": "coreRightPanelTitle",
			"component": "span",
			"props": {
				"className": "text-sm font-semibold text-on-surface",
				"value": "已选节点(5)"
			}
		},
		{
			"id": "coreRightPanelActions",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"coreSwitchWrapper",
				"coreHintIcon",
				"coreClearBtn"
			]
		},
		{
			"id": "coreSwitchWrapper",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.25rem] flex-1" },
			"children": ["coreCascadeSwitch", "coreSwitchLabel"]
		},
		{
			"id": "coreCascadeSwitch",
			"component": "Switch",
			"props": {
				"value": { "path": "/cascadeSwitch" },
				"size": "small"
			}
		},
		{
			"id": "coreSwitchLabel",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": "开启深层级联"
			}
		},
		{
			"id": "coreHintIcon",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "coreClearBtn",
			"component": "Button",
			"props": {
				"types": "link",
				"value": "清空",
				"className": "flex-1 justify-end"
			}
		},
		{
			"id": "coreRightPanelHint",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": "当前暂未向目标池中分配任何可用节点。"
			}
		},
		{
			"id": "coreRightTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/rightTableData" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIP",
						"minWidth": 88
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIP",
						"minWidth": 80
					},
					{
						"title": "响应策略",
						"dataIndex": "responsePolicy",
						"minWidth": 88
					},
					{
						"title": "所属用户组",
						"dataIndex": "userGroup",
						"minWidth": 102
					},
					{
						"title": "重试次数",
						"dataIndex": "retryCount",
						"minWidth": 88
					}
				],
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedRightKeys" }
				},
				"className": "mb-0"
			}
		},
		{
			"id": "footLeftText",
			"component": "span",
			"props": {
				"className": "flex-1 text-md text-on-surface min-w-0",
				"value": "系统连接正常／待同步任务: 7"
			}
		},
		{
			"id": "footRightBtns",
			"component": "div",
			"props": { "className": "flex flex-row gap-2 items-center" },
			"children": [
				"footCancelBtn",
				"footSaveDraftBtn",
				"footSubmitBtn"
			]
		},
		{
			"id": "footCancelBtn",
			"component": "Button",
			"props": {
				"value": "取消",
				"color": "default"
			}
		},
		{
			"id": "footSaveDraftBtn",
			"component": "Button",
			"props": {
				"value": "保存草稿",
				"color": "default"
			}
		},
		{
			"id": "footSubmitBtn",
			"component": "Button",
			"props": {
				"value": "提交配置",
				"color": "primary"
			}
		}
	],
	state: {
		"stepCurrent": 0,
		"nodeCategoryValue": "直连节点",
		"nodeCategoryOptions": [
			{
				"label": "系统内置",
				"value": "系统内置"
			},
			{
				"label": "自定义",
				"value": "自定义"
			},
			{
				"label": "直连节点",
				"value": "直连节点"
			}
		],
		"envValue": "clusterA",
		"envOptions": [{
			"label": "生产环境-集群A",
			"value": "clusterA"
		}],
		"routeValue": "条件拦截",
		"routeOptions": [{
			"label": "前置转发",
			"value": "前置转发"
		}, {
			"label": "条件拦截",
			"value": "条件拦截"
		}],
		"leftTableData": [
			{
				"id": "1",
				"srcIP": "192.168.1.101",
				"mapIP": "10.0.0.5",
				"status": "正常在线",
				"deviceId": "NODE-407307-A1B2",
				"firmware": "v1.0-648"
			},
			{
				"id": "2",
				"srcIP": "192.168.1.102",
				"mapIP": "10.0.0.6",
				"status": "正常在线",
				"deviceId": "NODE-407308-C3D4",
				"firmware": "v1.0-648"
			},
			{
				"id": "3",
				"srcIP": "192.168.1.103",
				"mapIP": "10.0.0.7",
				"status": "离线",
				"deviceId": "NODE-407309-E5F6",
				"firmware": "v1.0-649"
			},
			{
				"id": "4",
				"srcIP": "192.168.1.104",
				"mapIP": "10.0.0.8",
				"status": "正常在线",
				"deviceId": "NODE-407310-G7H8",
				"firmware": "v1.0-647"
			},
			{
				"id": "5",
				"srcIP": "192.168.1.105",
				"mapIP": "10.0.0.9",
				"status": "故障",
				"deviceId": "NODE-407311-I9J0",
				"firmware": "v1.0-650"
			},
			{
				"id": "6",
				"srcIP": "192.168.1.106",
				"mapIP": "10.0.0.10",
				"status": "正常在线",
				"deviceId": "NODE-407312-K1L2",
				"firmware": "v1.0-648"
			},
			{
				"id": "7",
				"srcIP": "192.168.1.107",
				"mapIP": "10.0.0.11",
				"status": "正常在线",
				"deviceId": "NODE-407313-M3N4",
				"firmware": "v1.0-648"
			},
			{
				"id": "8",
				"srcIP": "192.168.1.108",
				"mapIP": "10.0.0.12",
				"status": "离线",
				"deviceId": "NODE-407314-O5P6",
				"firmware": "v1.0-649"
			},
			{
				"id": "9",
				"srcIP": "192.168.1.109",
				"mapIP": "10.0.0.13",
				"status": "正常在线",
				"deviceId": "NODE-407315-Q7R8",
				"firmware": "v1.0-647"
			},
			{
				"id": "10",
				"srcIP": "192.168.1.110",
				"mapIP": "10.0.0.14",
				"status": "正常在线",
				"deviceId": "NODE-407316-S9T0",
				"firmware": "v1.0-650"
			}
		],
		"rightTableData": [],
		"selectedLeftKeys": [],
		"selectedRightKeys": [],
		"cascadeSwitch": true
	}
};
//#endregion
export { data_default as default };
