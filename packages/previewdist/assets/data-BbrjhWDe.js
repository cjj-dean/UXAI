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
			"id": "backNavigation",
			"component": "div",
			"props": { "className": "flex flex-row shrink-0" },
			"children": ["banaBackLink"]
		},
		{
			"id": "stepBar",
			"component": "div",
			"props": { "className": "flex flex-row shrink-0" },
			"children": ["stbaSteps"]
		},
		{
			"id": "nodeConfigRegion",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 gap-[1rem] min-w-0" },
			"children": ["nocoreBasicConfigSection", "nocoreTransferSection"],
			"annotations": ["独立区块"]
		},
		{
			"id": "bottomActionBar",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center shrink-0" },
			"children": ["boacbaLeft", "boacbaRight"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-col" },
			"children": [
				"backNavigation",
				"stepBar",
				"nodeConfigRegion",
				"bottomActionBar"
			]
		},
		{
			"id": "body",
			"component": "div",
			"props": { "className": "flex flex-row flex-1 overflow-hidden" },
			"children": ["main"]
		},
		{
			"id": "root",
			"component": "div",
			"props": { "className": "flex flex-col h-screen overflow-hidden bg-surface-container-lowest overflow-x-hidden" },
			"children": ["header", "body"]
		},
		{
			"id": "headLogo",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
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
						"key": "permission"
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
						"key": "extension"
					}
				]
			}
		},
		{
			"id": "headSearchIcon",
			"component": "Icon",
			"props": {
				"name": "search",
				"className": "w-5 h-5",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "banaBackLink",
			"component": "a",
			"props": {
				"className": "text-primary text-md cursor-pointer hover:underline",
				"value": "＜ 返回节点列表",
				"href": "#"
			}
		},
		{
			"id": "stbaSteps",
			"component": "Steps",
			"props": {
				"current": { "path": "/currentStep" },
				"types": "navigation",
				"className": "flex-1 min-w-0 w-full"
			},
			"children": ["stbaStep1", "stbaStep2"]
		},
		{
			"id": "stbaStep1",
			"component": "StepItem",
			"props": {
				"title": "规则设置",
				"status": "process",
				"className": "mb-[1rem]"
			}
		},
		{
			"id": "stbaStep2",
			"component": "StepItem",
			"props": {
				"title": "确认发布",
				"status": "wait"
			}
		},
		{
			"id": "nocoreBasicConfigSection",
			"component": "div",
			"props": { "className": "flex flex-col gap-gutter" },
			"children": [
				"nocoreBasicConfigTitle",
				"nocoreNodeCategoryField",
				"nocoreEnvField",
				"nocoreRouteTypeField"
			]
		},
		{
			"id": "nocoreBasicConfigTitle",
			"component": "span",
			"props": {
				"className": "text-xl font-semibold text-on-surface",
				"value": "基础配置"
			},
			"children": []
		},
		{
			"id": "nocoreNodeCategoryField",
			"component": "div",
			"props": { "className": "flex flex-col gap-inline" },
			"children": ["nocoreNodeCategoryLabel", "nocoreNodeCategorySegmented"]
		},
		{
			"id": "nocoreNodeCategoryLabel",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface",
				"value": "节点类别（必填）"
			}
		},
		{
			"id": "nocoreNodeCategorySegmented",
			"component": "Segmented",
			"props": {
				"value": { "path": "/nodeCategory" },
				"options": [
					{
						"label": "系统内置",
						"value": "system"
					},
					{
						"label": "自定义",
						"value": "custom"
					},
					{
						"label": "直连节点",
						"value": "direct"
					}
				],
				"orientation": "horizontal",
				"size": "medium",
				"className": "w-fit"
			}
		},
		{
			"id": "nocoreEnvField",
			"component": "div",
			"props": { "className": "flex flex-col gap-inline" },
			"children": ["nocoreEnvLabel", "nocoreEnvSelect"]
		},
		{
			"id": "nocoreEnvLabel",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface",
				"value": "关联环境（必填）"
			}
		},
		{
			"id": "nocoreEnvSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/envValue" },
				"options": { "path": "/envOptions" },
				"size": "medium",
				"className": "w-64"
			}
		},
		{
			"id": "nocoreRouteTypeField",
			"component": "div",
			"props": { "className": "flex flex-col gap-inline" },
			"children": ["nocoreRouteTypeLabel", "nocoreRouteTypeRadio"]
		},
		{
			"id": "nocoreRouteTypeLabel",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface",
				"value": "路由类型（必填）"
			}
		},
		{
			"id": "nocoreRouteTypeRadio",
			"component": "RadioGroup",
			"props": {
				"value": { "path": "/routeType" },
				"options": [{
					"label": "前置转发",
					"value": "forward"
				}, {
					"label": "条件拦截",
					"value": "condition"
				}],
				"orientation": "horizontal",
				"className": "w-fit"
			}
		},
		{
			"id": "nocoreTransferSection",
			"component": "div",
			"props": { "className": "flex flex-row gap-gutter flex-1" },
			"children": [
				"nocoreAvailableDataSources",
				"nocoreTransferOperations",
				"nocoreSelectedNodes"
			]
		},
		{
			"id": "nocoreAvailableDataSources",
			"component": "div",
			"props": { "className": "flex flex-col flex-1 min-w-0 border border-base rounded-lg p-gutter bg-white gap-[1rem]" },
			"children": [
				"nocoreAvailableHeader",
				"nocoreAvailableHint",
				"nocoreAvailableTable"
			]
		},
		{
			"id": "nocoreAvailableHeader",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between mb-stack" },
			"children": ["nocoreAvailableTitle", "nocoreClearBtn"]
		},
		{
			"id": "nocoreAvailableTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "可用数据源(102)"
			}
		},
		{
			"id": "nocoreClearBtn",
			"component": "Button",
			"props": {
				"value": "清空",
				"types": "link",
				"className": "text-md"
			}
		},
		{
			"id": "nocoreAvailableHint",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant mb-stack",
				"value": "请勾选需要绑定的目标节点，点击右箭头将其添加至右侧列表。"
			}
		},
		{
			"id": "nocoreAvailableTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/availableNodes" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "sourceIP",
						"minWidth": 123
					},
					{
						"title": "映射IP",
						"dataIndex": "mappedIP",
						"minWidth": 95
					},
					{
						"title": "运行状态",
						"dataIndex": "status",
						"className": "min-w-[120px]",
						"minWidth": 112
					},
					{
						"title": "设备标识",
						"dataIndex": "deviceId",
						"minWidth": 130
					},
					{
						"title": "固件版本",
						"dataIndex": "firmwareVersion",
						"minWidth": 88
					}
				],
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedRowKeys" }
				},
				"className": "mb-gutter"
			},
			"children": {
				"path": "/availableNodes",
				"componentId": "nocoreAvailableRow"
			}
		},
		{
			"id": "nocoreAvailableRow",
			"component": "TableRow",
			"children": ["nocoreStatusCell"],
			"props": {}
		},
		{
			"id": "nocoreStatusCell",
			"component": "div",
			"props": {
				"dataIndex": "status",
				"className": "flex flex-row items-center gap-inline whitespace-nowrap"
			},
			"children": ["nocoreStatusIcon", "nocoreStatusText"]
		},
		{
			"id": "nocoreStatusIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "statusIcon" },
				"color": "success",
				"shape": "outline",
				"className": "w-4 h-4 whitespace-nowrap"
			}
		},
		{
			"id": "nocoreStatusText",
			"component": "span",
			"props": {
				"value": { "path": "statusLabel" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "nocoreTransferOperations",
			"component": "div",
			"props": { "className": "flex flex-col justify-center gap-stack px-inline" },
			"children": ["nocoreMoveRightBtn", "nocoreMoveLeftBtn"]
		},
		{
			"id": "nocoreMoveRightBtn",
			"component": "Button",
			"props": {
				"value": "> 右移",
				"icon": "chevron-right",
				"iconPlacement": "end",
				"types": "default",
				"className": "w-24"
			}
		},
		{
			"id": "nocoreMoveLeftBtn",
			"component": "Button",
			"props": {
				"value": "< 左移",
				"icon": "chevron-left",
				"iconPlacement": "start",
				"types": "default",
				"className": "w-24"
			}
		},
		{
			"id": "nocoreSelectedNodes",
			"component": "div",
			"props": { "className": "flex flex-col flex-1 min-w-0 border border-base rounded-lg p-gutter bg-white gap-[1rem]" },
			"children": [
				"nocoreSelectedHeader",
				"nocoreSelectedHint",
				"nocoreSelectedTable"
			]
		},
		{
			"id": "nocoreSelectedHeader",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between mb-stack" },
			"children": ["nocoreSelectedTitle", "nocoreSelectedActions"]
		},
		{
			"id": "nocoreSelectedTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "已选节点(5)"
			}
		},
		{
			"id": "nocoreSelectedActions",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-inline" },
			"children": [
				"nocoreCascadeSwitch",
				"nocoreCascadeLabel",
				"nocoreCascadeInfoIcon",
				"nocoreSelectedClearBtn"
			]
		},
		{
			"id": "nocoreCascadeSwitch",
			"component": "Switch",
			"props": {
				"value": { "path": "/cascadeSwitch" },
				"size": "medium"
			}
		},
		{
			"id": "nocoreCascadeLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface",
				"value": "开启深层级联"
			}
		},
		{
			"id": "nocoreCascadeInfoIcon",
			"component": "Icon",
			"props": {
				"name": "info",
				"color": "#777777",
				"shape": "outline",
				"className": "w-4 h-4"
			}
		},
		{
			"id": "nocoreSelectedClearBtn",
			"component": "Button",
			"props": {
				"value": "清空",
				"types": "link",
				"className": "text-sm"
			}
		},
		{
			"id": "nocoreSelectedHint",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant mb-stack",
				"value": "当前暂未向目标池中分配任何可用节点。"
			}
		},
		{
			"id": "nocoreSelectedTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/selectedNodes" },
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "sourceIP",
						"minWidth": 88
					},
					{
						"title": "映射IP",
						"dataIndex": "mappedIP",
						"minWidth": 80
					},
					{
						"title": "响应策略",
						"dataIndex": "strategy",
						"minWidth": 88
					},
					{
						"title": "所属用户组",
						"dataIndex": "group",
						"minWidth": 102
					},
					{
						"title": "重试次数",
						"dataIndex": "retries",
						"minWidth": 88
					}
				],
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedRowKeys" }
				},
				"className": "mb-gutter"
			}
		},
		{
			"id": "boacbaLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": [
				"boacbaLeftStatus",
				"boacbaLeftDivider",
				"boacbaLeftTask"
			]
		},
		{
			"id": "boacbaLeftStatus",
			"component": "span",
			"props": {
				"value": "系统连接正常",
				"className": "text-sm text-on-surface"
			}
		},
		{
			"id": "boacbaLeftDivider",
			"component": "span",
			"props": {
				"value": "|",
				"className": "text-sm text-on-surface-variant mx-1"
			}
		},
		{
			"id": "boacbaLeftTask",
			"component": "span",
			"props": {
				"value": "待同步任务: 7",
				"className": "text-sm text-on-surface"
			}
		},
		{
			"id": "boacbaRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-3" },
			"children": [
				"boacbaCancelBtn",
				"boacbaSaveDraftBtn",
				"boacbaSubmitBtn"
			]
		},
		{
			"id": "boacbaCancelBtn",
			"component": "Button",
			"props": {
				"value": "取消",
				"color": "default"
			}
		},
		{
			"id": "boacbaSaveDraftBtn",
			"component": "Button",
			"props": {
				"value": "保存草稿",
				"color": "default"
			}
		},
		{
			"id": "boacbaSubmitBtn",
			"component": "Button",
			"props": {
				"value": "提交配置",
				"color": "primary"
			}
		}
	],
	state: {
		"currentStep": 0,
		"nodeCategory": "direct",
		"envValue": "prod-clusterA",
		"envOptions": [
			{
				"label": "生产环境-集群A",
				"value": "prod-clusterA"
			},
			{
				"label": "测试环境-集群B",
				"value": "test-clusterB"
			},
			{
				"label": "开发环境-集群C",
				"value": "dev-clusterC"
			}
		],
		"routeType": "condition",
		"availableNodes": [
			{
				"id": "node1",
				"sourceIP": "192.168.1.101",
				"mappedIP": "10.0.0.5",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-407307...",
				"firmwareVersion": "v1.0-648"
			},
			{
				"id": "node2",
				"sourceIP": "192.168.1.102",
				"mappedIP": "10.0.0.6",
				"statusIcon": "circle-alert",
				"statusLabel": "维护中",
				"deviceId": "NODE-248824...",
				"firmwareVersion": "v1.0-529"
			},
			{
				"id": "node3",
				"sourceIP": "192.168.1.103",
				"mappedIP": "10.0.0.7",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-309876...",
				"firmwareVersion": "v1.1-324"
			},
			{
				"id": "node4",
				"sourceIP": "192.168.1.104",
				"mappedIP": "10.0.0.8",
				"statusIcon": "circle-alert",
				"statusLabel": "维护中",
				"deviceId": "NODE-156789...",
				"firmwareVersion": "v1.0-832"
			},
			{
				"id": "node5",
				"sourceIP": "192.168.1.105",
				"mappedIP": "10.0.0.9",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-543210...",
				"firmwareVersion": "v1.2-175"
			},
			{
				"id": "node6",
				"sourceIP": "192.168.1.106",
				"mappedIP": "10.0.0.10",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-678901...",
				"firmwareVersion": "v1.0-421"
			},
			{
				"id": "node7",
				"sourceIP": "192.168.1.107",
				"mappedIP": "10.0.0.11",
				"statusIcon": "circle-alert",
				"statusLabel": "维护中",
				"deviceId": "NODE-432109...",
				"firmwareVersion": "v1.1-755"
			},
			{
				"id": "node8",
				"sourceIP": "192.168.1.108",
				"mappedIP": "10.0.0.12",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-765432...",
				"firmwareVersion": "v1.0-912"
			},
			{
				"id": "node9",
				"sourceIP": "192.168.1.109",
				"mappedIP": "10.0.0.13",
				"statusIcon": "circle-check",
				"statusLabel": "正常在线",
				"deviceId": "NODE-321098...",
				"firmwareVersion": "v1.2-340"
			},
			{
				"id": "node10",
				"sourceIP": "192.168.1.110",
				"mappedIP": "10.0.0.14",
				"statusIcon": "circle-alert",
				"statusLabel": "维护中",
				"deviceId": "NODE-890123...",
				"firmwareVersion": "v1.0-604"
			}
		],
		"selectedNodes": [],
		"selectedRowKeys": [],
		"cascadeSwitch": true
	}
};
//#endregion
export { data_default as default };
