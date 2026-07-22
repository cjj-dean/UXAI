var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLogo",
				"headNavMenu",
				"headSearchIcon"
			]
		},
		{
			"id": "backLink",
			"component": "div",
			"props": { "className": "shrink-0" },
			"children": ["balibackLinkLink"]
		},
		{
			"id": "configRegion",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem] shrink-0" },
			"children": [
				"coreStepBar",
				"coreConfigTitle",
				"coreFormItemCategory",
				"coreFormItemEnv",
				"coreFormItemRoute",
				"coreTransferSection"
			],
			"annotations": ["独立区块"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-col" },
			"children": ["backLink", "configRegion"]
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
			"props": { "className": "shrink-0 bg-surface-container-highest flex flex-row justify-end items-center px-[1.5rem] py-[0.75rem] gap-[1rem]" },
			"children": ["footStatusText", "footActionBtns"]
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
			"component": "div",
			"props": {
				"className": "flex items-center text-primary text-lg font-bold",
				"value": "DataConfig Pro"
			}
		},
		{
			"id": "headNavMenu",
			"component": "Menu",
			"props": {
				"mode": "horizontal",
				"selectedKeys": ["nodeConfig"],
				"items": [
					{
						"title": "首页",
						"key": "home"
					},
					{
						"title": "数据面板",
						"key": "dataPanel"
					},
					{
						"title": "权限控制",
						"key": "accessControl"
					},
					{
						"title": "模块管理",
						"key": "moduleManage"
					},
					{
						"title": "节点配置",
						"key": "nodeConfig"
					},
					{
						"title": "扩展中心",
						"key": "extensionCenter"
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
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "balibackLinkLink",
			"component": "a",
			"props": {
				"className": "text-primary underline",
				"value": "< 返回节点列表",
				"href": ""
			},
			"children": []
		},
		{
			"id": "coreStepBar",
			"component": "Steps",
			"props": {
				"current": { "path": "/stepCurrent" },
				"className": ""
			},
			"children": ["coreStepBarStep1", "coreStepBarStep2"]
		},
		{
			"id": "coreStepBarStep1",
			"component": "StepItem",
			"props": {
				"title": "规则设置",
				"status": "process",
				"className": "mb-[1rem]"
			}
		},
		{
			"id": "coreStepBarStep2",
			"component": "StepItem",
			"props": {
				"title": "确认发布",
				"status": "wait"
			}
		},
		{
			"id": "coreConfigTitle",
			"component": "span",
			"props": {
				"className": "text-2xl font-bold text-on-surface",
				"value": "基础配置"
			}
		},
		{
			"id": "coreFormItemCategory",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["coreCategoryLabel", "coreCategorySegmented"]
		},
		{
			"id": "coreCategoryLabel",
			"component": "span",
			"props": {
				"className": "text-sm font-medium text-on-surface",
				"value": "节点类别"
			}
		},
		{
			"id": "coreCategorySegmented",
			"component": "Segmented",
			"props": {
				"value": { "path": "/categoryValue" },
				"options": [
					"系统内置",
					"自定义",
					"直连节点"
				]
			}
		},
		{
			"id": "coreFormItemEnv",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["coreEnvLabel", "coreEnvSelect"]
		},
		{
			"id": "coreEnvLabel",
			"component": "span",
			"props": {
				"className": "text-sm font-medium text-on-surface",
				"value": "关联环境"
			}
		},
		{
			"id": "coreEnvSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/envValue" },
				"options": [
					{
						"label": "生产环境-集群A",
						"value": "生产环境-集群A"
					},
					{
						"label": "测试环境-集群B",
						"value": "测试环境-集群B"
					},
					{
						"label": "开发环境-集群C",
						"value": "开发环境-集群C"
					}
				],
				"placeholder": "请选择环境"
			}
		},
		{
			"id": "coreFormItemRoute",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["coreRouteLabel", "coreRouteRadio"]
		},
		{
			"id": "coreRouteLabel",
			"component": "span",
			"props": {
				"className": "text-sm font-medium text-on-surface",
				"value": "路由类型"
			}
		},
		{
			"id": "coreRouteRadio",
			"component": "RadioGroup",
			"props": {
				"value": { "path": "/routeValue" },
				"options": [{
					"label": "前置转发",
					"value": "前置转发"
				}, {
					"label": "条件拦截",
					"value": "条件拦截"
				}]
			}
		},
		{
			"id": "coreTransferSection",
			"component": "div",
			"props": { "className": "flex flex-row gap-4" },
			"children": [
				"coreLeftSourceList",
				"coreCenterOperation",
				"coreRightSelectedList"
			]
		},
		{
			"id": "coreLeftSourceList",
			"component": "div",
			"props": { "className": "border border-base rounded-lg p-4 flex flex-col gap-3 flex-1 min-w-0" },
			"children": [
				"coreLeftHeader",
				"coreLeftTip",
				"coreLeftTable"
			]
		},
		{
			"id": "coreLeftHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["coreLeftHeaderTitle", "coreLeftHeaderClear"]
		},
		{
			"id": "coreLeftHeaderTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "可用数据源(102)"
			}
		},
		{
			"id": "coreLeftHeaderClear",
			"component": "Button",
			"props": {
				"value": "清空",
				"color": "default"
			}
		},
		{
			"id": "coreLeftTip",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "请勾选需要绑定的目标节点，点击右箭头将其添加至右侧列表。"
			}
		},
		{
			"id": "coreLeftTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/leftDataSource" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIp",
						"minWidth": 123
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIp",
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
						"minWidth": 109
					},
					{
						"title": "固件版本",
						"dataIndex": "firmware",
						"minWidth": 88
					}
				],
				"rowSelection": { "type": "checkbox" }
			},
			"children": {
				"path": "/leftDataSource",
				"componentId": "coreLeftTableRow"
			}
		},
		{
			"id": "coreLeftTableRow",
			"component": "TableRow",
			"props": {},
			"children": []
		},
		{
			"id": "coreCenterOperation",
			"component": "div",
			"props": { "className": "flex flex-col gap-2 justify-center items-center w-[60px] shrink-0" },
			"children": ["coreMoveRightBtn", "coreMoveLeftBtn"]
		},
		{
			"id": "coreMoveRightBtn",
			"component": "Button",
			"props": {
				"value": "> 右移",
				"color": "primary"
			}
		},
		{
			"id": "coreMoveLeftBtn",
			"component": "Button",
			"props": {
				"value": "< 左移",
				"color": "default"
			}
		},
		{
			"id": "coreRightSelectedList",
			"component": "div",
			"props": { "className": "border border-base rounded-lg p-4 flex flex-col gap-3 flex-1 min-w-0" },
			"children": [
				"coreRightHeader",
				"coreRightTip",
				"coreRightTable"
			]
		},
		{
			"id": "coreRightHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["coreRightHeaderTitle", "coreRightHeaderActions"]
		},
		{
			"id": "coreRightHeaderTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "已选节点(5)"
			}
		},
		{
			"id": "coreRightHeaderActions",
			"component": "div",
			"props": { "className": "flex flex-row gap-2 items-center" },
			"children": [
				"coreRightSwitch",
				"coreRightCascadeText",
				"coreRightInfoIcon",
				"coreRightClearBtn"
			]
		},
		{
			"id": "coreRightSwitch",
			"component": "Switch",
			"props": { "value": { "path": "/rightSwitch" } }
		},
		{
			"id": "coreRightCascadeText",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface",
				"value": "开启深层级联"
			}
		},
		{
			"id": "coreRightInfoIcon",
			"component": "Icon",
			"props": {
				"name": "info",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "coreRightClearBtn",
			"component": "Button",
			"props": {
				"value": "清空",
				"color": "default"
			}
		},
		{
			"id": "coreRightTip",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "当前暂未向目标池中分配任何可用节点。"
			}
		},
		{
			"id": "coreRightTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/rightDataSource" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIp",
						"minWidth": 88
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIp",
						"minWidth": 80
					},
					{
						"title": "响应策略",
						"dataIndex": "policy",
						"minWidth": 88
					},
					{
						"title": "所属用户组",
						"dataIndex": "group",
						"minWidth": 102
					},
					{
						"title": "重试次数",
						"dataIndex": "retryCount",
						"minWidth": 88
					}
				],
				"rowSelection": { "type": "checkbox" }
			},
			"children": {
				"path": "/rightDataSource",
				"componentId": "coreRightTableRow"
			}
		},
		{
			"id": "coreRightTableRow",
			"component": "TableRow",
			"props": {},
			"children": []
		},
		{
			"id": "footStatusText",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface mr-auto",
				"value": "系统连接正常 / 待同步任务: 7"
			}
		},
		{
			"id": "footActionBtns",
			"component": "div",
			"props": { "className": "flex flex-row gap-[0.5rem] items-center" },
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
				"types": "link"
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
		"categoryValue": "直连节点",
		"envValue": "生产环境-集群A",
		"routeValue": "条件拦截",
		"rightSwitch": true,
		"leftDataSource": [
			{
				"id": "1",
				"srcIp": "192.168.1.101",
				"mapIp": "10.0.0.5",
				"status": "正常在线",
				"deviceId": "NODE-407307",
				"firmware": "v1.0-648"
			},
			{
				"id": "2",
				"srcIp": "192.168.1.102",
				"mapIp": "10.0.0.6",
				"status": "正常在线",
				"deviceId": "NODE-407308",
				"firmware": "v1.0-648"
			},
			{
				"id": "3",
				"srcIp": "192.168.1.103",
				"mapIp": "10.0.0.7",
				"status": "正常在线",
				"deviceId": "NODE-407309",
				"firmware": "v1.0-649"
			},
			{
				"id": "4",
				"srcIp": "192.168.1.104",
				"mapIp": "10.0.0.8",
				"status": "正常在线",
				"deviceId": "NODE-407310",
				"firmware": "v1.0-649"
			},
			{
				"id": "5",
				"srcIp": "192.168.1.105",
				"mapIp": "10.0.0.9",
				"status": "离线",
				"deviceId": "NODE-407311",
				"firmware": "v1.0-650"
			},
			{
				"id": "6",
				"srcIp": "192.168.1.106",
				"mapIp": "10.0.0.10",
				"status": "正常在线",
				"deviceId": "NODE-407312",
				"firmware": "v1.0-650"
			},
			{
				"id": "7",
				"srcIp": "192.168.1.107",
				"mapIp": "10.0.0.11",
				"status": "故障",
				"deviceId": "NODE-407313",
				"firmware": "v1.0-651"
			},
			{
				"id": "8",
				"srcIp": "192.168.1.108",
				"mapIp": "10.0.0.12",
				"status": "正常在线",
				"deviceId": "NODE-407314",
				"firmware": "v1.0-651"
			},
			{
				"id": "9",
				"srcIp": "192.168.1.109",
				"mapIp": "10.0.0.13",
				"status": "正常在线",
				"deviceId": "NODE-407315",
				"firmware": "v1.0-652"
			},
			{
				"id": "10",
				"srcIp": "192.168.1.110",
				"mapIp": "10.0.0.14",
				"status": "正常在线",
				"deviceId": "NODE-407316",
				"firmware": "v1.0-652"
			}
		],
		"rightDataSource": []
	}
};
//#endregion
export { data_default as default };
