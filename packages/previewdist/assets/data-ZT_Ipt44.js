var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "root",
			"component": "div",
			"props": { "className": "flex flex-col h-screen overflow-hidden bg-surface-container-lowest overflow-x-hidden" },
			"children": ["header", "body"]
		},
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": ["headerLeft", "headerRight"]
		},
		{
			"id": "body",
			"component": "div",
			"props": { "className": "flex flex-row flex-1 overflow-hidden" },
			"children": ["aside", "main"]
		},
		{
			"id": "aside",
			"component": "aside",
			"props": { "className": "shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between w-[54px]" },
			"children": ["asideTopMenu", "asideBottomMenu"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] flex flex-col gap-[1rem] min-w-0" },
			"children": ["mainDataOverviewCards", "mainTerminalUserManagement"]
		},
		{
			"id": "mainDataOverviewCards",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] h-[300px] shrink-0" },
			"children": [
				"dataOverviewCard1",
				"dataOverviewCard2",
				"dataOverviewCard3",
				"dataOverviewCard4",
				"dataOverviewCard5"
			]
		},
		{
			"id": "mainTerminalUserManagement",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem] flex-1 min-w-0" },
			"children": [
				"terminalMgmtTitle",
				"terminalMgmtToolbar",
				"terminalMgmtTable"
			]
		},
		{
			"id": "headerLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": [
				"headerLogoIcon",
				"headerBrandName",
				"headerProjectSelect"
			]
		},
		{
			"id": "headerLogoIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "/brandLogoIcon" },
				"shape": "square",
				"className": "w-5 h-5",
				"color": "#777777"
			}
		},
		{
			"id": "headerBrandName",
			"component": "span",
			"props": {
				"value": { "path": "/brandName" },
				"className": "text-md font-semibold text-on-surface"
			}
		},
		{
			"id": "headerProjectSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/projectName" },
				"options": [
					{
						"label": "园区网络A",
						"value": "proj-001"
					},
					{
						"label": "数据中心B",
						"value": "proj-002"
					},
					{
						"label": "分支网络C",
						"value": "proj-003"
					}
				],
				"className": "w-[160px]"
			}
		},
		{
			"id": "headerRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": [
				"headerNotificationBadge",
				"headerUserAvatar",
				"headerHomeBtn"
			]
		},
		{
			"id": "headerNotificationBadge",
			"component": "Badge",
			"props": {
				"count": { "path": "/notificationBadgeCount" },
				"color": "#E02128",
				"overflowCount": 99,
				"className": "flex-1"
			},
			"children": ["headerNotificationIcon"]
		},
		{
			"id": "headerNotificationIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "/notificationIcon" },
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headerUserAvatar",
			"component": "img",
			"props": {
				"src": { "path": "/userAvatarImage" },
				"className": "w-7 h-7 object-cover rounded-[8px]",
				"alt": "用户头像"
			}
		},
		{
			"id": "headerHomeBtn",
			"component": "Button",
			"props": {
				"value": { "path": "/homeButtonText" },
				"color": "primary",
				"className": "flex-1"
			}
		},
		{
			"id": "asideTopMenu",
			"component": "Menu",
			"props": {
				"mode": "vertical",
				"inlineCollapsed": true,
				"selectedKeys": { "path": "/selectedKeys" },
				"items": { "path": "/topMenuItems" },
				"className": "flex-1 min-w-0"
			}
		},
		{
			"id": "asideBottomMenu",
			"component": "Menu",
			"props": {
				"mode": "vertical",
				"inlineCollapsed": true,
				"selectedKeys": { "path": "/selectedKeys" },
				"items": { "path": "/bottomMenuItems" },
				"className": ""
			}
		},
		{
			"id": "dataOverviewCard1",
			"component": "Section",
			"props": { "className": "flex-1 h-full flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["dataOverviewCard1Header", "dataOverviewCard1Chart"]
		},
		{
			"id": "dataOverviewCard1Header",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["dataOverviewCard1Title", "dataOverviewCard1Hint"]
		},
		{
			"id": "dataOverviewCard1Title",
			"component": "span",
			"props": {
				"value": "终端类型",
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "dataOverviewCard1Hint",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "dataOverviewCard1Chart",
			"component": "PieChart",
			"props": {
				"option": {
					"data": { "path": "/terminalTypeData" },
					"title": {
						"text": "12",
						"subtext": "总数"
					}
				},
				"className": "h-[188px]"
			}
		},
		{
			"id": "dataOverviewCard2",
			"component": "Section",
			"props": { "className": "flex-1 h-full flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["dataOverviewCard2Header", "dataOverviewCard2Chart"]
		},
		{
			"id": "dataOverviewCard2Header",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["dataOverviewCard2Title", "dataOverviewCard2Hint"]
		},
		{
			"id": "dataOverviewCard2Title",
			"component": "span",
			"props": {
				"value": "接入类型",
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "dataOverviewCard2Hint",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "dataOverviewCard2Chart",
			"component": "PieChart",
			"props": {
				"option": {
					"data": { "path": "/accessTypeData" },
					"title": {
						"text": "12",
						"subtext": "总数"
					}
				},
				"className": "h-[188px]"
			}
		},
		{
			"id": "dataOverviewCard3",
			"component": "Section",
			"props": { "className": "flex-1 h-full flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["dataOverviewCard3Header", "dataOverviewCard3Chart"]
		},
		{
			"id": "dataOverviewCard3Header",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["dataOverviewCard3TitleGroup", "dataOverviewCard3Dropdown"]
		},
		{
			"id": "dataOverviewCard3TitleGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.375rem]" },
			"children": ["dataOverviewCard3Title", "dataOverviewCard3Hint"]
		},
		{
			"id": "dataOverviewCard3Title",
			"component": "span",
			"props": {
				"value": "终端流量使用",
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "dataOverviewCard3Hint",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "dataOverviewCard3Dropdown",
			"component": "Select",
			"props": {
				"value": { "path": "/terminalTrafficDropdown" },
				"options": [{
					"label": "Top5",
					"value": "Top5"
				}, {
					"label": "Top10",
					"value": "Top10"
				}],
				"size": "small",
				"className": "w-20"
			}
		},
		{
			"id": "dataOverviewCard3Chart",
			"component": "ProcessChart",
			"props": {
				"option": {
					"name": "ProcessBarChart",
					"data": { "path": "/terminalTrafficChartData" },
					"unit": "MB"
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "dataOverviewCard4",
			"component": "Section",
			"props": { "className": "flex-1 h-full flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["dataOverviewCard4Header", "dataOverviewCard4Chart"]
		},
		{
			"id": "dataOverviewCard4Header",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["dataOverviewCard4TitleGroup", "dataOverviewCard4Dropdown"]
		},
		{
			"id": "dataOverviewCard4TitleGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.375rem]" },
			"children": ["dataOverviewCard4Title", "dataOverviewCard4Hint"]
		},
		{
			"id": "dataOverviewCard4Title",
			"component": "span",
			"props": {
				"value": "应用流量使用",
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "dataOverviewCard4Hint",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "dataOverviewCard4Dropdown",
			"component": "Select",
			"props": {
				"value": { "path": "/appTrafficDropdown" },
				"options": [{
					"label": "Top5",
					"value": "Top5"
				}, {
					"label": "Top10",
					"value": "Top10"
				}],
				"size": "small",
				"className": "w-20"
			}
		},
		{
			"id": "dataOverviewCard4Chart",
			"component": "ProcessChart",
			"props": {
				"option": {
					"name": "ProcessBarChart",
					"data": { "path": "/appTrafficChartData" },
					"unit": "MB"
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "dataOverviewCard5",
			"component": "Section",
			"props": { "className": "flex-1 h-full flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["dataOverviewCard5Header", "dataOverviewCard5Chart"]
		},
		{
			"id": "dataOverviewCard5Header",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": ["dataOverviewCard5Title", "dataOverviewCard5Hint"]
		},
		{
			"id": "dataOverviewCard5Title",
			"component": "span",
			"props": {
				"value": "终端在线时长",
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "dataOverviewCard5Hint",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "dataOverviewCard5Chart",
			"component": "BarChart",
			"props": {
				"option": {
					"data": { "path": "/onlineDurationData" },
					"xAxis": {
						"data": "timeRange",
						"name": "在线时长区间"
					},
					"yAxisTitle": "终端数"
				},
				"className": "h-[188px]"
			}
		},
		{
			"id": "terminalMgmtTitle",
			"component": "span",
			"props": {
				"value": { "path": "/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "terminalMgmtToolbar",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["terminalMgmtToolbarLeft", "terminalMgmtToolbarRight"]
		},
		{
			"id": "terminalMgmtToolbarLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": ["terminalMgmtSearchInput", "terminalMgmtAdvancedSearchBtn"]
		},
		{
			"id": "terminalMgmtSearchInput",
			"component": "Input",
			"props": {
				"value": { "path": "/searchValue" },
				"placeholder": { "path": "/searchPlaceholder" },
				"prefix": "search",
				"className": "w-72"
			}
		},
		{
			"id": "terminalMgmtAdvancedSearchBtn",
			"component": "Button",
			"props": {
				"value": "高级搜索",
				"types": "link",
				"icon": "chevron-down",
				"iconPlacement": "end"
			}
		},
		{
			"id": "terminalMgmtToolbarRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"terminalMgmtScanBtn",
				"terminalMgmtUnbindBtn",
				"terminalMgmtBindBtn",
				"terminalMgmtGuardedListBtn",
				"terminalMgmtSpeedLimitBtn",
				"terminalMgmtRefreshIcon"
			]
		},
		{
			"id": "terminalMgmtScanBtn",
			"component": "Button",
			"props": {
				"value": "立即扫描",
				"color": "primary"
			}
		},
		{
			"id": "terminalMgmtUnbindBtn",
			"component": "Button",
			"props": { "value": "IP/MAC解绑" }
		},
		{
			"id": "terminalMgmtBindBtn",
			"component": "Button",
			"props": { "value": "IP/MAC绑定" }
		},
		{
			"id": "terminalMgmtGuardedListBtn",
			"component": "Button",
			"props": {
				"value": "已守护列表",
				"icon": "chevron-down",
				"iconPlacement": "end"
			}
		},
		{
			"id": "terminalMgmtSpeedLimitBtn",
			"component": "Button",
			"props": { "value": "已限速列表" }
		},
		{
			"id": "terminalMgmtRefreshIcon",
			"component": "Icon",
			"props": {
				"name": "refresh-cw",
				"color": "#777777",
				"className": "w-4 h-4 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "terminalMgmtTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/tableData" },
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedRowKeys" }
				},
				"columns": [
					{
						"title": "终端名称",
						"dataIndex": "terminalName",
						"minWidth": 190
					},
					{
						"title": "终端类型",
						"dataIndex": "terminalType",
						"minWidth": 190
					},
					{
						"title": "IP地址",
						"dataIndex": "ipAddress",
						"minWidth": 190
					},
					{
						"title": "MAC地址",
						"dataIndex": "macAddress",
						"minWidth": 190
					},
					{
						"title": "VLAN",
						"dataIndex": "vlan",
						"minWidth": 190
					},
					{
						"title": "厂商",
						"dataIndex": "vendor",
						"minWidth": 190
					},
					{
						"title": "型号",
						"dataIndex": "model",
						"minWidth": 190
					},
					{
						"title": "系统",
						"dataIndex": "os",
						"minWidth": 190
					},
					{
						"title": "在线时长",
						"dataIndex": "onlineDuration",
						"minWidth": 190
					},
					{
						"title": "接入时间",
						"dataIndex": "accessTime",
						"minWidth": 190
					},
					{
						"title": "上行速率",
						"dataIndex": "uplinkSpeed",
						"minWidth": 190
					},
					{
						"title": "下行速率",
						"dataIndex": "downlinkSpeed",
						"minWidth": 190
					},
					{
						"title": "流量消耗",
						"dataIndex": "trafficConsumption",
						"minWidth": 190
					},
					{
						"title": "接入设备",
						"dataIndex": "accessDevice",
						"minWidth": 190
					},
					{
						"title": "守护",
						"dataIndex": "guardStatus",
						"minWidth": 190
					},
					{
						"title": "连接",
						"dataIndex": "connection",
						"minWidth": 190
					},
					{
						"title": "操作",
						"dataIndex": "actions",
						"width": 100,
						"minWidth": 190
					}
				]
			},
			"children": {
				"path": "/tableData",
				"componentId": "terminalMgmtTableRow"
			}
		},
		{
			"id": "terminalMgmtTableRow",
			"component": "TableRow",
			"children": [
				"terminalMgmtTdTerminalName",
				"terminalMgmtTdGuardStatus",
				"terminalMgmtTdActions"
			],
			"props": {}
		},
		{
			"id": "terminalMgmtTdTerminalName",
			"component": "div",
			"props": {
				"dataIndex": "terminalName",
				"className": "flex flex-row items-center gap-[0.5rem] whitespace-nowrap"
			},
			"children": ["terminalMgmtTdTerminalIcon", "terminalMgmtTdTerminalText"]
		},
		{
			"id": "terminalMgmtTdTerminalIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "terminalBrandIcon" },
				"color": "#777777",
				"className": "w-4 h-4 whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "terminalMgmtTdTerminalText",
			"component": "span",
			"props": {
				"value": { "path": "terminalName" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "terminalMgmtTdGuardStatus",
			"component": "div",
			"props": {
				"dataIndex": "guardStatus",
				"className": "flex flex-row items-center whitespace-nowrap"
			},
			"children": ["terminalMgmtTdGuardTag"]
		},
		{
			"id": "terminalMgmtTdGuardTag",
			"component": "Tag",
			"props": {
				"value": { "path": "guardStatus" },
				"icon": { "path": "guardIcon" },
				"color": { "path": "guardTagColor" }
			}
		},
		{
			"id": "terminalMgmtTdActions",
			"component": "div",
			"props": {
				"dataIndex": "actions",
				"className": "flex flex-row items-center gap-[0.25rem] whitespace-nowrap"
			},
			"children": ["terminalMgmtTdEditBtn", "terminalMgmtTdLinkBtn"]
		},
		{
			"id": "terminalMgmtTdEditBtn",
			"component": "Button",
			"props": {
				"icon": { "path": "editIcon" },
				"types": "link",
				"size": "small"
			}
		},
		{
			"id": "terminalMgmtTdLinkBtn",
			"component": "Button",
			"props": {
				"icon": { "path": "linkIcon" },
				"types": "link",
				"size": "small"
			}
		}
	],
	state: {
		"brandLogoIcon": "huawei-logo",
		"brandName": "华为坤灵",
		"projectName": "企业网络管理平台",
		"projectList": [
			{
				"projectName": "园区网络A",
				"projectId": "proj-001"
			},
			{
				"projectName": "数据中心B",
				"projectId": "proj-002"
			},
			{
				"projectName": "分支网络C",
				"projectId": "proj-003"
			}
		],
		"notificationBadgeCount": 5,
		"notificationIcon": "bell",
		"userAvatarImage": "https://randomuser.me/api/portraits/men/32.jpg",
		"homeButtonText": "返回首页",
		"topMenuItems": [
			{
				"title": "仪表盘",
				"key": "layout-dashboard",
				"icon": "layout-dashboard"
			},
			{
				"title": "网络概览",
				"key": "activity",
				"icon": "activity"
			},
			{
				"title": "无线管理",
				"key": "wifi",
				"icon": "wifi"
			},
			{
				"title": "外网管理",
				"key": "globe",
				"icon": "globe"
			},
			{
				"title": "终端设备",
				"key": "smartphone",
				"icon": "smartphone"
			},
			{
				"title": "安全中心",
				"key": "shield",
				"icon": "shield"
			},
			{
				"title": "系统设置",
				"key": "settings",
				"icon": "settings"
			},
			{
				"title": "审计日志",
				"key": "clipboard-list",
				"icon": "clipboard-list"
			}
		],
		"bottomMenuItems": [{
			"title": "帮助中心",
			"key": "help-circle",
			"icon": "help-circle"
		}, {
			"title": "退出登录",
			"key": "log-out",
			"icon": "log-out"
		}],
		"selectedKeys": ["smartphone"],
		"terminalTrafficDropdown": "Top5",
		"appTrafficDropdown": "Top5",
		"terminalTypeData": [
			{
				"name": "手机",
				"value": 4,
				"percentage": "33.33%"
			},
			{
				"name": "家居设备",
				"value": 4,
				"percentage": "33.33%"
			},
			{
				"name": "平板",
				"value": 2,
				"percentage": "16.67%"
			},
			{
				"name": "其他",
				"value": 2,
				"percentage": "16.67%"
			}
		],
		"accessTypeData": [{
			"name": "有线",
			"value": 8,
			"percentage": "66.66%"
		}, {
			"name": "无线",
			"value": 4,
			"percentage": "33.34%"
		}],
		"terminalTrafficData": [
			{
				"deviceName": "iPhone12",
				"macAddress": "0O:E0:FC:12:34:56",
				"trafficMB": 1869
			},
			{
				"deviceName": "OPPO",
				"macAddress": "0O:E0:FC:78:90:AB",
				"trafficMB": 1016
			},
			{
				"deviceName": "Mate70",
				"macAddress": "0O:E0:FC:CD:EF:01",
				"trafficMB": 664
			},
			{
				"deviceName": "iPhone16",
				"macAddress": "0O:E0:FC:23:45:67",
				"trafficMB": 167
			},
			{
				"deviceName": "iPad",
				"macAddress": "0O:E0:FC:89:01:23",
				"trafficMB": 167
			}
		],
		"terminalTrafficChartData": [
			{
				"name": "iPhone12",
				"value": 1869
			},
			{
				"name": "OPPO",
				"value": 1016
			},
			{
				"name": "Mate70",
				"value": 664
			},
			{
				"name": "iPhone16",
				"value": 167
			},
			{
				"name": "iPad",
				"value": 167
			}
		],
		"appTrafficData": [
			{
				"appName": "微信",
				"trafficMB": 1869
			},
			{
				"appName": "支付宝",
				"trafficMB": 1016
			},
			{
				"appName": "抖音",
				"trafficMB": 664
			},
			{
				"appName": "淘宝",
				"trafficMB": 167
			},
			{
				"appName": "微博",
				"trafficMB": 167
			}
		],
		"appTrafficChartData": [
			{
				"name": "微信",
				"value": 1869
			},
			{
				"name": "支付宝",
				"value": 1016
			},
			{
				"name": "抖音",
				"value": 664
			},
			{
				"name": "淘宝",
				"value": 167
			},
			{
				"name": "微博",
				"value": 167
			}
		],
		"onlineDurationData": [
			{
				"timeRange": "小于1h",
				"deviceCount": 3
			},
			{
				"timeRange": "1-3h",
				"deviceCount": 8
			},
			{
				"timeRange": "3-6h",
				"deviceCount": 12
			},
			{
				"timeRange": "6-8h",
				"deviceCount": 5
			},
			{
				"timeRange": "大于8h",
				"deviceCount": 2
			}
		],
		"searchValue": "",
		"selectedRowKeys": [],
		"cardTitle": "终端用户",
		"searchPlaceholder": "请输入搜索内容",
		"tableData": [
			{
				"id": "1",
				"checked": false,
				"terminalName": "hauwei",
				"terminalBrandIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.1",
				"macAddress": "0O:E0:FC:12:34:56",
				"vlan": "204",
				"vendor": "OPPO",
				"model": "Intel(R)",
				"os": "Windows 10",
				"onlineDuration": "9min",
				"accessTime": "2022-07-15 09:23:45",
				"uplinkSpeed": "3.30Kbps",
				"downlinkSpeed": "4.61Kbps",
				"trafficConsumption": "3.4GB",
				"accessDevice": "android",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardTagColor": "success",
				"connection": "Wifi_xxx",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "2",
				"checked": false,
				"terminalName": "Apple iPhone14",
				"terminalBrandIcon": "monitor",
				"terminalType": "手机",
				"ipAddress": "192.168.1.22",
				"macAddress": "0O:E0:FC:AB:CD:EF",
				"vlan": "101",
				"vendor": "Apple",
				"model": "A2884",
				"os": "iOS 17.5",
				"onlineDuration": "45min",
				"accessTime": "2022-07-15 08:45:12",
				"uplinkSpeed": "1.20Kbps",
				"downlinkSpeed": "2.15Kbps",
				"trafficConsumption": "1.2GB",
				"accessDevice": "AP-Office-5F",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardTagColor": "default",
				"connection": "Wifi_Office",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "3",
				"checked": false,
				"terminalName": "Samsung Tab S9",
				"terminalBrandIcon": "tablet",
				"terminalType": "平板",
				"ipAddress": "192.168.1.45",
				"macAddress": "0O:E0:FC:34:56:78",
				"vlan": "204",
				"vendor": "Samsung",
				"model": "SM-X716",
				"os": "Android 14",
				"onlineDuration": "2h15min",
				"accessTime": "2022-07-15 07:30:00",
				"uplinkSpeed": "5.60Kbps",
				"downlinkSpeed": "8.90Kbps",
				"trafficConsumption": "8.7GB",
				"accessDevice": "AP-MeetingRoom",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardTagColor": "success",
				"connection": "Wifi_Meeting",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "4",
				"checked": false,
				"terminalName": "Xiaomi SmartCamera",
				"terminalBrandIcon": "camera",
				"terminalType": "家居设备",
				"ipAddress": "192.168.1.88",
				"macAddress": "0O:E0:FC:56:78:90",
				"vlan": "305",
				"vendor": "Xiaomi",
				"model": "MJSXJ06CM",
				"os": "Embedded Linux",
				"onlineDuration": "6h30min",
				"accessTime": "2022-07-15 03:00:00",
				"uplinkSpeed": "0.50Kbps",
				"downlinkSpeed": "1.20Kbps",
				"trafficConsumption": "0.8GB",
				"accessDevice": "AP-Home-2F",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardTagColor": "default",
				"connection": "Wifi_Home",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "5",
				"checked": false,
				"terminalName": "Huawei MateBook",
				"terminalBrandIcon": "laptop",
				"terminalType": "笔记本",
				"ipAddress": "192.168.1.10",
				"macAddress": "0O:E0:FC:90:AB:CD",
				"vlan": "101",
				"vendor": "Huawei",
				"model": "MateBook X Pro",
				"os": "Windows 11",
				"onlineDuration": "3h20min",
				"accessTime": "2022-07-15 06:10:00",
				"uplinkSpeed": "12.30Kbps",
				"downlinkSpeed": "25.00Kbps",
				"trafficConsumption": "15.6GB",
				"accessDevice": "AP-Office-3F",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardTagColor": "success",
				"connection": "Wifi_Office",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "6",
				"checked": false,
				"terminalName": "Lenovo ThinkPad",
				"terminalBrandIcon": "laptop",
				"terminalType": "笔记本",
				"ipAddress": "192.168.1.33",
				"macAddress": "0O:E0:FC:12:AB:34",
				"vlan": "204",
				"vendor": "Lenovo",
				"model": "T14 Gen3",
				"os": "Windows 10",
				"onlineDuration": "1h45min",
				"accessTime": "2022-07-15 08:00:00",
				"uplinkSpeed": "4.10Kbps",
				"downlinkSpeed": "6.80Kbps",
				"trafficConsumption": "4.2GB",
				"accessDevice": "AP-Lab-B2",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardTagColor": "default",
				"connection": "Wifi_Lab",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "7",
				"checked": false,
				"terminalName": "iPad Pro M4",
				"terminalBrandIcon": "tablet",
				"terminalType": "平板",
				"ipAddress": "192.168.1.67",
				"macAddress": "0O:E0:FC:CD:12:78",
				"vlan": "101",
				"vendor": "Apple",
				"model": "A2836",
				"os": "iPadOS 17.5",
				"onlineDuration": "15min",
				"accessTime": "2022-07-15 09:30:00",
				"uplinkSpeed": "2.90Kbps",
				"downlinkSpeed": "3.50Kbps",
				"trafficConsumption": "0.5GB",
				"accessDevice": "AP-Lobby",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardTagColor": "success",
				"connection": "Wifi_Guest",
				"editIcon": "pencil",
				"linkIcon": "link"
			},
			{
				"id": "8",
				"checked": false,
				"terminalName": "Honor Magic6",
				"terminalBrandIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.99",
				"macAddress": "0O:E0:FC:EF:34:56",
				"vlan": "305",
				"vendor": "Honor",
				"model": "BVL-AN20",
				"os": "Android 14",
				"onlineDuration": "4h10min",
				"accessTime": "2022-07-15 05:50:00",
				"uplinkSpeed": "7.20Kbps",
				"downlinkSpeed": "14.50Kbps",
				"trafficConsumption": "10.1GB",
				"accessDevice": "AP-Office-12F",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardTagColor": "default",
				"connection": "Wifi_Office",
				"editIcon": "pencil",
				"linkIcon": "link"
			}
		]
	}
};
//#endregion
export { data_default as default };
