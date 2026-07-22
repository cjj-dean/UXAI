var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLogoContainer",
				"headNavMenu",
				"headActionSection"
			]
		},
		{
			"id": "backLink",
			"component": "div",
			"props": { "className": "shrink-0" },
			"children": ["baliBackButton"]
		},
		{
			"id": "configRegion",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem] shrink-0" },
			"children": [
				"coreStepBar",
				"coreBasicConfigTitle",
				"coreFormItem1",
				"coreFormItem2",
				"coreFormItem3",
				"coreTransferSection"
			],
			"annotations": ["独立区块"]
		},
		{
			"id": "bottomActionBar",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] shrink-0" },
			"children": ["boacbaActionBarLeft", "boacbaActionBarRight"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-col" },
			"children": [
				"backLink",
				"configRegion",
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
			"id": "headLogoContainer",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": ["headLogoIcon", "headLogoTxt"]
		},
		{
			"id": "headLogoIcon",
			"component": "Icon",
			"props": {
				"name": "database",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headLogoTxt",
			"component": "span",
			"props": {
				"value": "DataConfig Pro",
				"className": "text-lg font-bold text-on-surface"
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
						"key": "analytics"
					},
					{
						"title": "权限控制",
						"key": "permission"
					},
					{
						"title": "模块管理",
						"key": "module"
					},
					{
						"title": "节点配置",
						"key": "nodeConfig"
					},
					{
						"title": "扩展中心",
						"key": "extension"
					}
				],
				"className": ""
			}
		},
		{
			"id": "headActionSection",
			"component": "div",
			"props": { "className": "flex flex-row items-center" },
			"children": ["headSearchIcon"]
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
			"id": "baliBackButton",
			"component": "Button",
			"props": {
				"value": "< 返回节点列表",
				"types": "link"
			}
		},
		{
			"id": "coreStepBar",
			"component": "Steps",
			"props": {
				"current": { "path": "/stepCurrent" },
				"types": "default",
				"orientation": "horizontal",
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
				"className": "mb-[1rem]"
			}
		},
		{
			"id": "coreStepItem2",
			"component": "StepItem",
			"props": {
				"title": "确认发布",
				"status": "wait"
			}
		},
		{
			"id": "coreBasicConfigTitle",
			"component": "h2",
			"props": {
				"value": "基础配置",
				"className": "text-2xl font-bold text-on-surface"
			}
		},
		{
			"id": "coreFormItem1",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem]" },
			"children": ["coreFormItem1Label", "coreSegmented"]
		},
		{
			"id": "coreFormItem1Label",
			"component": "span",
			"props": {
				"value": "节点类别",
				"className": "text-sm font-medium text-on-surface before:content-['*'] before:text-error before:mr-0.5"
			}
		},
		{
			"id": "coreSegmented",
			"component": "Segmented",
			"props": {
				"value": { "path": "/selectedNodeCategory" },
				"options": [
					"系统内置",
					"自定义",
					"直连节点"
				],
				"orientation": "horizontal",
				"size": "medium"
			}
		},
		{
			"id": "coreFormItem2",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem]" },
			"children": ["coreFormItem2Label", "coreSelect"]
		},
		{
			"id": "coreFormItem2Label",
			"component": "span",
			"props": {
				"value": "关联环境",
				"className": "text-sm font-medium text-on-surface before:content-['*'] before:text-error before:mr-0.5"
			}
		},
		{
			"id": "coreSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/selectedEnv" },
				"options": { "path": "/envOptions" },
				"placeholder": "请选择环境",
				"showSearch": true,
				"className": "w-80"
			}
		},
		{
			"id": "coreFormItem3",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem]" },
			"children": ["coreFormItem3Label", "coreRadioGroup"]
		},
		{
			"id": "coreFormItem3Label",
			"component": "span",
			"props": {
				"value": "路由类型",
				"className": "text-sm font-medium text-on-surface before:content-['*'] before:text-error before:mr-0.5"
			}
		},
		{
			"id": "coreRadioGroup",
			"component": "RadioGroup",
			"props": {
				"value": { "path": "/routeTypeValue" },
				"options": [{
					"label": "前置转发",
					"value": "forward"
				}, {
					"label": "条件拦截",
					"value": "intercept"
				}],
				"orientation": "horizontal"
			}
		},
		{
			"id": "coreTransferSection",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-start" },
			"children": [
				"coreLeftSourcePanel",
				"coreTransferActions",
				"coreRightTargetPanel"
			]
		},
		{
			"id": "coreLeftSourcePanel",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] border border-base rounded-lg p-4 flex-1 min-w-0" },
			"children": [
				"coreLeftPanelHeader",
				"coreLeftPanelDesc",
				"coreLeftTable"
			]
		},
		{
			"id": "coreLeftPanelHeader",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["coreLeftPanelTitle", "coreLeftPanelClearBtn"]
		},
		{
			"id": "coreLeftPanelTitle",
			"component": "span",
			"props": {
				"value": "可用数据源(102)",
				"className": "text-lg font-semibold text-on-surface"
			}
		},
		{
			"id": "coreLeftPanelClearBtn",
			"component": "Button",
			"props": {
				"value": "清空",
				"types": "link",
				"size": "small"
			}
		},
		{
			"id": "coreLeftPanelDesc",
			"component": "p",
			"props": {
				"value": "请勾选需要绑定的目标节点，点击右箭头将其添加至右侧列表。",
				"className": "text-sm text-on-surface-variant"
			}
		},
		{
			"id": "coreLeftTable",
			"component": "Table",
			"props": {
				"rowKey": "deviceId",
				"dataSource": { "path": "/leftTableData" },
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedKeys" }
				},
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIp",
						"width": 130,
						"minWidth": 123
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIp",
						"width": 120,
						"minWidth": 88
					},
					{
						"title": "运行状态",
						"dataIndex": "status",
						"width": 130,
						"minWidth": 102
					},
					{
						"title": "设备标识",
						"dataIndex": "deviceId",
						"width": 150,
						"minWidth": 130
					},
					{
						"title": "固件版本",
						"dataIndex": "firmwareVer",
						"width": 120,
						"minWidth": 88
					}
				]
			},
			"children": {
				"path": "/leftTableData",
				"componentId": "coreLeftTableRow"
			}
		},
		{
			"id": "coreLeftTableRow",
			"component": "TableRow",
			"children": [
				"coreSrcIpCell",
				"coreMapIpCell",
				"coreStatusCell",
				"coreDeviceIdCell",
				"coreFirmwareVerCell"
			],
			"props": {}
		},
		{
			"id": "coreSrcIpCell",
			"component": "span",
			"props": {
				"dataIndex": "srcIp",
				"value": { "path": "srcIp" }
			}
		},
		{
			"id": "coreMapIpCell",
			"component": "span",
			"props": {
				"dataIndex": "mapIp",
				"value": { "path": "mapIp" }
			}
		},
		{
			"id": "coreStatusCell",
			"component": "div",
			"props": {
				"dataIndex": "status",
				"className": "flex items-center gap-1 whitespace-nowrap"
			},
			"children": ["coreStatusIcon", "coreStatusText"]
		},
		{
			"id": "coreStatusIcon",
			"component": "span",
			"props": {
				"value": { "path": "statusIcon" },
				"className": "inline-block whitespace-nowrap"
			}
		},
		{
			"id": "coreStatusText",
			"component": "span",
			"props": { "value": { "path": "status" } }
		},
		{
			"id": "coreDeviceIdCell",
			"component": "span",
			"props": {
				"dataIndex": "deviceId",
				"value": { "path": "deviceId" }
			}
		},
		{
			"id": "coreFirmwareVerCell",
			"component": "span",
			"props": {
				"dataIndex": "firmwareVer",
				"value": { "path": "firmwareVer" }
			}
		},
		{
			"id": "coreTransferActions",
			"component": "div",
			"props": { "className": "flex flex-col items-center justify-center gap-[0.5rem] px-2 py-12" },
			"children": ["coreMoveRightBtn", "coreMoveLeftBtn"]
		},
		{
			"id": "coreMoveRightBtn",
			"component": "Button",
			"props": {
				"value": "> 右移",
				"color": "default"
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
			"id": "coreRightTargetPanel",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] border border-base rounded-lg p-4 flex-1 min-w-0" },
			"children": [
				"coreRightPanelHeader",
				"coreRightPanelDesc",
				"coreRightTable"
			]
		},
		{
			"id": "coreRightPanelHeader",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["coreRightPanelTitle", "coreRightPanelActions"]
		},
		{
			"id": "coreRightPanelTitle",
			"component": "span",
			"props": {
				"value": "已选节点(5)",
				"className": "text-lg font-semibold text-on-surface"
			}
		},
		{
			"id": "coreRightPanelActions",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"coreRightPanelSwitch",
				"coreRightPanelCascadeLabel",
				"coreRightPanelInfoIcon",
				"coreRightPanelClearBtn"
			]
		},
		{
			"id": "coreRightPanelSwitch",
			"component": "Switch",
			"props": {
				"value": { "path": "/switchValue" },
				"checkedChildren": "开启",
				"unCheckedChildren": "关闭",
				"size": "small"
			}
		},
		{
			"id": "coreRightPanelCascadeLabel",
			"component": "span",
			"props": {
				"value": "开启深层级联",
				"className": "text-sm text-on-surface"
			}
		},
		{
			"id": "coreRightPanelInfoIcon",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "coreRightPanelClearBtn",
			"component": "Button",
			"props": {
				"value": "清空",
				"types": "link",
				"size": "small"
			}
		},
		{
			"id": "coreRightPanelDesc",
			"component": "p",
			"props": {
				"value": "当前暂未向目标池中分配任何可用节点。",
				"className": "text-sm text-on-surface-variant"
			}
		},
		{
			"id": "coreRightTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/rightTableData" },
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedKeys" }
				},
				"columns": [
					{
						"title": "源IP地址",
						"dataIndex": "srcIp",
						"width": 130,
						"minWidth": 88
					},
					{
						"title": "映射IP",
						"dataIndex": "mapIp",
						"width": 120,
						"minWidth": 80
					},
					{
						"title": "响应策略",
						"dataIndex": "policy",
						"width": 120,
						"minWidth": 88
					},
					{
						"title": "所属用户组",
						"dataIndex": "group",
						"width": 130,
						"minWidth": 102
					},
					{
						"title": "重试次数",
						"dataIndex": "retries",
						"width": 100,
						"minWidth": 88
					}
				]
			}
		},
		{
			"id": "boacbaActionBarLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-4" },
			"children": ["boacbaStatusText", "boacbaSyncTaskCount"]
		},
		{
			"id": "boacbaStatusText",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface",
				"value": "系统连接正常"
			}
		},
		{
			"id": "boacbaSyncTaskCount",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "待同步任务: 7"
			}
		},
		{
			"id": "boacbaActionBarRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-3 ml-auto" },
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
		"stepCurrent": 0,
		"selectedNodeCategory": "直连节点",
		"selectedEnv": "clusterA",
		"envOptions": [
			{
				"label": "生产环境-集群A",
				"value": "clusterA"
			},
			{
				"label": "测试环境-集群B",
				"value": "clusterB"
			},
			{
				"label": "开发环境-集群C",
				"value": "clusterC"
			}
		],
		"routeTypeValue": "intercept",
		"leftTableData": [
			{
				"srcIp": "192.168.1.101",
				"mapIp": "10.0.0.5",
				"status": "正常在线",
				"statusIcon": "🔵",
				"deviceId": "NODE-407307...",
				"firmwareVer": "v1.0-648"
			},
			{
				"srcIp": "192.168.1.102",
				"mapIp": "10.0.0.6",
				"status": "维护中",
				"statusIcon": "🟡",
				"deviceId": "NODE-248824...",
				"firmwareVer": "v1.0-529"
			},
			{
				"srcIp": "192.168.1.102",
				"mapIp": "10.0.0.6",
				"status": "维护中",
				"statusIcon": "🟡",
				"deviceId": "NODE-248824...",
				"firmwareVer": "v1.0-529"
			},
			{
				"srcIp": "192.168.1.102",
				"mapIp": "10.0.0.6",
				"status": "维护中",
				"statusIcon": "🟡",
				"deviceId": "NODE-248824...",
				"firmwareVer": "v1.0-529"
			}
		],
		"selectedKeys": [],
		"rightTableData": [],
		"switchValue": true
	}
};
//#endregion
export { data_default as default };
