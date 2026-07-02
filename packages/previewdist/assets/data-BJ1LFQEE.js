var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "root",
			"component": "div",
			"props": { "className": "flex flex-col min-h-screen overflow-hidden bg-surface-container-lowest overflow-x-hidden" },
			"children": [
				"header",
				"body",
				"drawer"
			]
		},
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": ["headerLeftGroup", "headerRightGroup"]
		},
		{
			"id": "body",
			"component": "div",
			"props": { "className": "flex-1 overflow-hidden flex flex-col gap-[1rem] min-w-0" },
			"children": ["main"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 p-[2rem] flex flex-col gap-[1rem] min-w-0" },
			"children": ["mainContentSection"]
		},
		{
			"id": "drawer",
			"component": "Drawer",
			"props": {
				"title": "指标详情",
				"direction": "rtl",
				"size": "30%"
			},
			"children": ["drawerBody"]
		},
		{
			"id": "headerLeftGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerLeftCollapseBtn",
				"headerPlatformName",
				"headerHealthLink",
				"headerBigScreenLink"
			]
		},
		{
			"id": "headerLeftCollapseBtn",
			"component": "Icon",
			"props": {
				"name": "menu",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerPlatformName",
			"component": "span",
			"props": {
				"className": "text-md font-bold text-on-surface",
				"value": { "path": "/platformName" }
			}
		},
		{
			"id": "headerHealthLink",
			"component": "a",
			"props": {
				"className": "flex flex-row items-center gap-[0.25rem] text-md text-on-surface-variant hover:text-primary no-underline cursor-pointer",
				"href": { "path": "/moduleLinks/0/path" }
			},
			"children": ["headerHealthLinkIcon", "headerHealthLinkLabel"]
		},
		{
			"id": "headerHealthLinkIcon",
			"component": "Icon",
			"props": {
				"name": "activity",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "headerHealthLinkLabel",
			"component": "span",
			"props": { "value": { "path": "/moduleLinks/0/label" } }
		},
		{
			"id": "headerBigScreenLink",
			"component": "a",
			"props": {
				"className": "flex flex-row items-center gap-[0.25rem] text-md text-on-surface-variant hover:text-primary no-underline cursor-pointer",
				"href": { "path": "/moduleLinks/1/path" }
			},
			"children": ["headerBigScreenLinkIcon", "headerBigScreenLinkLabel"]
		},
		{
			"id": "headerBigScreenLinkIcon",
			"component": "Icon",
			"props": {
				"name": "monitor",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "headerBigScreenLinkLabel",
			"component": "span",
			"props": { "value": { "path": "/moduleLinks/1/label" } }
		},
		{
			"id": "headerRightGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerPolicyLink",
				"headerRightActions",
				"headerUserAvatar",
				"headerUserName"
			]
		},
		{
			"id": "headerPolicyLink",
			"component": "a",
			"props": {
				"className": "text-md text-on-surface-variant hover:text-primary no-underline cursor-pointer",
				"href": { "path": "/rightLinks/0/path" },
				"value": { "path": "/rightLinks/0/label" }
			}
		},
		{
			"id": "headerRightActions",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"headerActionIcon1",
				"headerActionIcon2",
				"headerActionIcon3",
				"headerActionIcon4"
			]
		},
		{
			"id": "headerActionIcon1",
			"component": "Icon",
			"props": {
				"name": "bell",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerActionIcon2",
			"component": "Icon",
			"props": {
				"name": "settings",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerActionIcon3",
			"component": "Icon",
			"props": {
				"name": "help-circle",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerActionIcon4",
			"component": "Icon",
			"props": {
				"name": "search",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerUserAvatar",
			"component": "img",
			"props": {
				"className": "w-7 h-7 object-cover rounded-[8px]",
				"src": { "path": "/userInfo/avatarImage" },
				"alt": "User Avatar"
			}
		},
		{
			"id": "headerUserName",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface",
				"value": { "path": "/userInfo/userName" }
			}
		},
		{
			"id": "mainContentSection",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 min-w-0 gap-[1rem]" },
			"children": [
				"mainTitleRow",
				"mainFilterRow",
				"mainDataTable"
			]
		},
		{
			"id": "mainTitleRow",
			"component": "div",
			"props": { "className": "flex flex-row items-center" },
			"children": ["mainTitle"]
		},
		{
			"id": "mainTitle",
			"component": "span",
			"props": {
				"value": { "path": "/cardTitle" },
				"className": "text-lg font-semibold text-on-surface"
			}
		},
		{
			"id": "mainFilterRow",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": ["mainSelect", "mainSearchInput"]
		},
		{
			"id": "mainSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/selectedSearchType" },
				"options": { "path": "/searchOptions" },
				"placeholder": "筛选条件",
				"className": "w-[180px]"
			}
		},
		{
			"id": "mainSearchInput",
			"component": "Input",
			"props": {
				"value": { "path": "/searchValue" },
				"placeholder": { "path": "/searchPlaceholder" },
				"prefix": "search",
				"className": "w-[300px]"
			}
		},
		{
			"id": "mainDataTable",
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
						"title": "对端端口crc(近一天)",
						"dataIndex": "peerPortCrc",
						"minWidth": 165
					},
					{
						"title": "本端光模块告警(近一天)",
						"dataIndex": "localOpticalAlarm",
						"minWidth": 186
					},
					{
						"title": "对端告警(近一天)",
						"dataIndex": "peerAlarm",
						"minWidth": 190
					},
					{
						"title": "温度",
						"dataIndex": "temperature",
						"minWidth": 81
					},
					{
						"title": "电压",
						"dataIndex": "voltage",
						"minWidth": 80
					},
					{
						"title": "发送功率(本端)",
						"dataIndex": "txPowerLocal",
						"minWidth": 130
					},
					{
						"title": "接收功率(本端)",
						"dataIndex": "rxPowerLocal",
						"minWidth": 130
					},
					{
						"title": "电流(本端)",
						"dataIndex": "currentLocal",
						"minWidth": 123
					},
					{
						"title": "信噪比(本端)",
						"dataIndex": "snrLocal",
						"minWidth": 116
					},
					{
						"title": "误码率(本端)",
						"dataIndex": "berLocal",
						"minWidth": 116
					},
					{
						"title": "发送功率(对端)",
						"dataIndex": "txPowerPeer",
						"minWidth": 130
					},
					{
						"title": "操作",
						"dataIndex": "action",
						"fixed": "end",
						"width": 120,
						"minWidth": 160
					}
				]
			},
			"children": {
				"path": "/tableData",
				"componentId": "mainTableRow"
			}
		},
		{
			"id": "mainTableRow",
			"component": "TableRow",
			"children": [
				"mainPeerPortCrcCell",
				"mainLocalOpticalAlarmCell",
				"mainPeerAlarmCell",
				"mainTemperatureCell",
				"mainVoltageCell",
				"mainTxPowerLocalCell",
				"mainRxPowerLocalCell",
				"mainCurrentLocalCell",
				"mainSnrLocalCell",
				"mainBerLocalCell",
				"mainTxPowerPeerCell",
				"mainActionCell"
			],
			"props": {}
		},
		{
			"id": "mainPeerPortCrcCell",
			"component": "span",
			"props": {
				"value": { "path": "peerPortCrc" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainLocalOpticalAlarmCell",
			"component": "Tag",
			"props": {
				"value": { "path": "localOpticalAlarm/value" },
				"color": { "path": "localOpticalAlarm/status" }
			}
		},
		{
			"id": "mainPeerAlarmCell",
			"component": "Tag",
			"props": {
				"value": { "path": "peerAlarm/value" },
				"color": { "path": "peerAlarm/status" }
			}
		},
		{
			"id": "mainTemperatureCell",
			"component": "span",
			"props": {
				"value": { "path": "temperature" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainVoltageCell",
			"component": "span",
			"props": {
				"value": { "path": "voltage" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainTxPowerLocalCell",
			"component": "span",
			"props": {
				"value": { "path": "txPowerLocal" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainRxPowerLocalCell",
			"component": "span",
			"props": {
				"value": { "path": "rxPowerLocal" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainCurrentLocalCell",
			"component": "span",
			"props": {
				"value": { "path": "currentLocal" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainSnrLocalCell",
			"component": "span",
			"props": {
				"value": { "path": "snrLocal" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainBerLocalCell",
			"component": "span",
			"props": {
				"value": { "path": "berLocal" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainTxPowerPeerCell",
			"component": "span",
			"props": {
				"value": { "path": "txPowerPeer" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "mainActionCell",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem] whitespace-nowrap" },
			"children": ["mainActionSearchBtn", "mainActionMoreBtn"]
		},
		{
			"id": "mainActionSearchBtn",
			"component": "Button",
			"props": {
				"icon": "search",
				"size": "small",
				"color": "primary"
			}
		},
		{
			"id": "mainActionMoreBtn",
			"component": "Button",
			"props": {
				"icon": "more-horizontal",
				"size": "small",
				"color": "default"
			}
		},
		{
			"id": "drawerBody",
			"component": "div",
			"props": { "className": "flex flex-col gap-4" },
			"children": ["drawerTimeRow", "drawerTabs"]
		},
		{
			"id": "drawerTimeRow",
			"component": "div",
			"props": { "className": "flex items-center" },
			"children": ["drawerTimeRange"]
		},
		{
			"id": "drawerTimeRange",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "/timeRange" }
			}
		},
		{
			"id": "drawerTabs",
			"component": "Tabs",
			"props": { "activeKey": { "path": "/activeTab" } },
			"children": ["drawerTabLocal", "drawerTabRemote"]
		},
		{
			"id": "drawerTabLocal",
			"component": "TabItem",
			"props": {
				"key": "本端",
				"label": "本端",
				"content": { "componentId": "drawerTabContent" }
			}
		},
		{
			"id": "drawerTabRemote",
			"component": "TabItem",
			"props": {
				"key": "对端",
				"label": "对端",
				"content": { "componentId": "drawerTabContent" }
			}
		},
		{
			"id": "drawerTabContent",
			"component": "div",
			"props": { "className": "flex flex-col gap-4" },
			"children": ["drawerInfoRow", "drawerChartModules"]
		},
		{
			"id": "drawerInfoRow",
			"component": "div",
			"props": { "className": "flex items-center justify-between" },
			"children": ["drawerDeviceInfo", "drawerAggSelect"]
		},
		{
			"id": "drawerDeviceInfo",
			"component": "div",
			"props": { "className": "flex items-center gap-2" },
			"children": ["drawerDeviceName", "drawerDevicePort"]
		},
		{
			"id": "drawerDeviceName",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface font-medium",
				"value": { "path": "/deviceName" }
			}
		},
		{
			"id": "drawerDevicePort",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": { "path": "/devicePort" }
			}
		},
		{
			"id": "drawerAggSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/aggregationValue" },
				"options": { "path": "/aggregationOptions" },
				"size": "small",
				"className": "w-28"
			}
		},
		{
			"id": "drawerChartModules",
			"component": "div",
			"props": { "className": "flex flex-col gap-6" },
			"children": [
				"drawerChart1",
				"drawerChart2",
				"drawerChart3"
			]
		},
		{
			"id": "drawerChart1",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["drawerChart1Header", "drawerChart1Line"]
		},
		{
			"id": "drawerChart1Header",
			"component": "div",
			"props": { "className": "flex items-center justify-between" },
			"children": ["drawerChart1Title", "drawerChart1Stats"]
		},
		{
			"id": "drawerChart1Title",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "接收功率"
			}
		},
		{
			"id": "drawerChart1Stats",
			"component": "div",
			"props": { "className": "flex items-center gap-3" },
			"children": [
				"drawerChart1StatMax",
				"drawerChart1StatMin",
				"drawerChart1StatAvg"
			]
		},
		{
			"id": "drawerChart1StatMax",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart1StatMin",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart1StatAvg",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart1Line",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/chart1Data" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "dBm"
				},
				"className": "h-52"
			}
		},
		{
			"id": "drawerChart2",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["drawerChart2Header", "drawerChart2Line"]
		},
		{
			"id": "drawerChart2Header",
			"component": "div",
			"props": { "className": "flex items-center justify-between" },
			"children": ["drawerChart2Title", "drawerChart2Stats"]
		},
		{
			"id": "drawerChart2Title",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "发送功率"
			}
		},
		{
			"id": "drawerChart2Stats",
			"component": "div",
			"props": { "className": "flex items-center gap-3" },
			"children": [
				"drawerChart2StatMax",
				"drawerChart2StatMin",
				"drawerChart2StatAvg"
			]
		},
		{
			"id": "drawerChart2StatMax",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart2StatMin",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart2StatAvg",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart2Line",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/chart2Data" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "dBm"
				},
				"className": "h-52"
			}
		},
		{
			"id": "drawerChart3",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["drawerChart3Header", "drawerChart3Line"]
		},
		{
			"id": "drawerChart3Header",
			"component": "div",
			"props": { "className": "flex items-center justify-between" },
			"children": ["drawerChart3Title", "drawerChart3Stats"]
		},
		{
			"id": "drawerChart3Title",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "电流"
			}
		},
		{
			"id": "drawerChart3Stats",
			"component": "div",
			"props": { "className": "flex items-center gap-3" },
			"children": [
				"drawerChart3StatMax",
				"drawerChart3StatMin",
				"drawerChart3StatAvg"
			]
		},
		{
			"id": "drawerChart3StatMax",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart3StatMin",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart3StatAvg",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值 -1.74 dBm"
			}
		},
		{
			"id": "drawerChart3Line",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/chart3Data" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "mA"
				},
				"className": "h-52"
			}
		}
	],
	state: {
		"platformName": "iMaster NCE-FabricInsight",
		"moduleLinks": [{
			"label": "健康看板",
			"iconName": "activity",
			"path": "/health-dashboard"
		}, {
			"label": "大屏",
			"iconName": "monitor",
			"path": "/big-screen"
		}],
		"rightLinks": [{
			"label": "策略中心",
			"path": "/policy-center"
		}],
		"userInfo": {
			"avatarImage": "https://randomuser.me/api/portraits/men/32.jpg",
			"userName": "Admin"
		},
		"cardTitle": "链路结果",
		"searchOptions": [
			{
				"label": "请选择",
				"value": ""
			},
			{
				"label": "设备名称",
				"value": "deviceName"
			},
			{
				"label": "端口描述",
				"value": "portDesc"
			}
		],
		"selectedSearchType": "",
		"searchPlaceholder": "请输入搜索内容",
		"searchValue": "",
		"selectedRowKeys": [
			"row1",
			"row4",
			"row7",
			"row10"
		],
		"tableData": [
			{
				"id": "row1",
				"checked": true,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "error",
					"value": "光模块IIC故障"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "41.40°C",
				"voltage": "3.35V",
				"txPowerLocal": "Lane1:-1dBm",
				"rxPowerLocal": "Lane0:2.43dBm",
				"currentLocal": "Lane0:87.23mA",
				"snrLocal": "Lane0:1dB",
				"berLocal": "NA",
				"txPowerPeer": "Lane0:-0.95dBm"
			},
			{
				"id": "row2",
				"checked": false,
				"peerPortCrc": "1.2e-08",
				"localOpticalAlarm": {
					"status": "warning",
					"value": "光模块温度告警"
				},
				"peerAlarm": {
					"status": "warning",
					"value": "端口漂移"
				},
				"temperature": "55.20°C",
				"voltage": "3.28V",
				"txPowerLocal": "Lane0:0.5dBm",
				"rxPowerLocal": "Lane1:-2.1dBm",
				"currentLocal": "Lane2:80.15mA",
				"snrLocal": "Lane2:1.5dB",
				"berLocal": "2.3e-06",
				"txPowerPeer": "Lane1:-1.2dBm"
			},
			{
				"id": "row3",
				"checked": false,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "success",
					"value": "无"
				},
				"peerAlarm": {
					"status": "error",
					"value": "光模块发送功率过低"
				},
				"temperature": "38.75°C",
				"voltage": "3.31V",
				"txPowerLocal": "Lane0:-5.2dBm",
				"rxPowerLocal": "Lane2:-6.0dBm",
				"currentLocal": "Lane3:91.05mA",
				"snrLocal": "Lane3:0.8dB",
				"berLocal": "5.1e-09",
				"txPowerPeer": "Lane2:-4.5dBm"
			},
			{
				"id": "row4",
				"checked": true,
				"peerPortCrc": "3.5e-07",
				"localOpticalAlarm": {
					"status": "error",
					"value": "光模块IIC故障"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "42.10°C",
				"voltage": "3.33V",
				"txPowerLocal": "Lane0:-0.8dBm",
				"rxPowerLocal": "Lane1:1.2dBm",
				"currentLocal": "Lane0:85.6mA",
				"snrLocal": "Lane1:1.2dB",
				"berLocal": "NA",
				"txPowerPeer": "Lane1:0.1dBm"
			},
			{
				"id": "row5",
				"checked": false,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "success",
					"value": "无"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "40.00°C",
				"voltage": "3.30V",
				"txPowerLocal": "Lane0:2.1dBm",
				"rxPowerLocal": "Lane0:-1.5dBm",
				"currentLocal": "Lane0:82.4mA",
				"snrLocal": "Lane0:2.5dB",
				"berLocal": "1.2e-10",
				"txPowerPeer": "Lane0:1.8dBm"
			},
			{
				"id": "row6",
				"checked": false,
				"peerPortCrc": "8.9e-06",
				"localOpticalAlarm": {
					"status": "warning",
					"value": "光模块电压异常"
				},
				"peerAlarm": {
					"status": "error",
					"value": "链路振荡"
				},
				"temperature": "48.50°C",
				"voltage": "3.15V",
				"txPowerLocal": "Lane2:-3.0dBm",
				"rxPowerLocal": "Lane3:-4.8dBm",
				"currentLocal": "Lane1:95.3mA",
				"snrLocal": "Lane2:0.5dB",
				"berLocal": "4.7e-08",
				"txPowerPeer": "Lane3:-2.2dBm"
			},
			{
				"id": "row7",
				"checked": true,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "success",
					"value": "无"
				},
				"peerAlarm": {
					"status": "warning",
					"value": "对端温度过高"
				},
				"temperature": "43.60°C",
				"voltage": "3.29V",
				"txPowerLocal": "Lane1:0.2dBm",
				"rxPowerLocal": "Lane0:-0.9dBm",
				"currentLocal": "Lane2:88.7mA",
				"snrLocal": "Lane0:1.8dB",
				"berLocal": "3.4e-09",
				"txPowerPeer": "Lane0:-0.5dBm"
			},
			{
				"id": "row8",
				"checked": false,
				"peerPortCrc": "2.1e-05",
				"localOpticalAlarm": {
					"status": "error",
					"value": "光模块IIC故障"
				},
				"peerAlarm": {
					"status": "error",
					"value": "对端光模块失效"
				},
				"temperature": "52.30°C",
				"voltage": "3.21V",
				"txPowerLocal": "Lane0:-6.5dBm",
				"rxPowerLocal": "Lane1:-7.2dBm",
				"currentLocal": "Lane0:78.9mA",
				"snrLocal": "Lane3:0.3dB",
				"berLocal": "9.2e-07",
				"txPowerPeer": "Lane1:-5.8dBm"
			},
			{
				"id": "row9",
				"checked": false,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "success",
					"value": "无"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "39.80°C",
				"voltage": "3.32V",
				"txPowerLocal": "Lane0:1.5dBm",
				"rxPowerLocal": "Lane0:0.5dBm",
				"currentLocal": "Lane0:83.1mA",
				"snrLocal": "Lane0:2.1dB",
				"berLocal": "NA",
				"txPowerPeer": "Lane0:0.8dBm"
			},
			{
				"id": "row10",
				"checked": true,
				"peerPortCrc": "4.4e-09",
				"localOpticalAlarm": {
					"status": "warning",
					"value": "光模块温度告警"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "58.10°C",
				"voltage": "3.25V",
				"txPowerLocal": "Lane2:-1.1dBm",
				"rxPowerLocal": "Lane3:-2.5dBm",
				"currentLocal": "Lane1:92.8mA",
				"snrLocal": "Lane2:1.0dB",
				"berLocal": "6.7e-08",
				"txPowerPeer": "Lane2:-0.2dBm"
			},
			{
				"id": "row11",
				"checked": false,
				"peerPortCrc": "未检测",
				"localOpticalAlarm": {
					"status": "error",
					"value": "光模块IIC故障"
				},
				"peerAlarm": {
					"status": "warning",
					"value": "端口CRC错误"
				},
				"temperature": "45.00°C",
				"voltage": "3.27V",
				"txPowerLocal": "Lane0:-2.8dBm",
				"rxPowerLocal": "Lane1:0.1dBm",
				"currentLocal": "Lane2:86.4mA",
				"snrLocal": "Lane1:1.6dB",
				"berLocal": "NA",
				"txPowerPeer": "Lane0:-1.9dBm"
			},
			{
				"id": "row12",
				"checked": false,
				"peerPortCrc": "1.5e-06",
				"localOpticalAlarm": {
					"status": "success",
					"value": "无"
				},
				"peerAlarm": {
					"status": "success",
					"value": "无"
				},
				"temperature": "41.20°C",
				"voltage": "3.34V",
				"txPowerLocal": "Lane0:0.8dBm",
				"rxPowerLocal": "Lane2:-1.1dBm",
				"currentLocal": "Lane3:84.2mA",
				"snrLocal": "Lane0:1.9dB",
				"berLocal": "8.1e-10",
				"txPowerPeer": "Lane0:0.3dBm"
			}
		],
		"activeTab": "本端",
		"timeRange": "2025/05/15 00:54:12 - 2025/05/15 14:54:12",
		"deviceName": "POD7-spine1",
		"devicePort": "25GE1/0/4",
		"aggregationValue": "avg",
		"aggregationOptions": [
			{
				"label": "平均值",
				"value": "avg"
			},
			{
				"label": "最大值",
				"value": "max"
			},
			{
				"label": "最小值",
				"value": "min"
			}
		],
		"chart1Data": [
			{
				"time": "0",
				"Lane0": -2.1,
				"Lane1": -3.5,
				"Lane2": -1.2,
				"Lane3": -4
			},
			{
				"time": "2",
				"Lane0": -1.8,
				"Lane1": -4.1,
				"Lane2": -1.5,
				"Lane3": -4.5
			},
			{
				"time": "4",
				"Lane0": -2.5,
				"Lane1": -3.8,
				"Lane2": -2,
				"Lane3": -3.9
			},
			{
				"time": "6",
				"Lane0": -3,
				"Lane1": -2.9,
				"Lane2": -2.5,
				"Lane3": -3.5
			},
			{
				"time": "8",
				"Lane0": -2.8,
				"Lane1": -3.2,
				"Lane2": -2.2,
				"Lane3": -3.8
			},
			{
				"time": "10",
				"Lane0": -1.5,
				"Lane1": -4.5,
				"Lane2": -1.8,
				"Lane3": -4.2
			},
			{
				"time": "12",
				"Lane0": -1.8,
				"Lane1": -3.9,
				"Lane2": -1.5,
				"Lane3": -4.8
			},
			{
				"time": "14",
				"Lane0": -2.2,
				"Lane1": -3.1,
				"Lane2": -2.1,
				"Lane3": -4.1
			},
			{
				"time": "16",
				"Lane0": -1.9,
				"Lane1": -2.8,
				"Lane2": -2.8,
				"Lane3": -3.6
			},
			{
				"time": "18",
				"Lane0": -2.4,
				"Lane1": -3.6,
				"Lane2": -3.1,
				"Lane3": -3.2
			},
			{
				"time": "20",
				"Lane0": -3.2,
				"Lane1": -4.2,
				"Lane2": -2.9,
				"Lane3": -3.5
			},
			{
				"time": "22",
				"Lane0": -2.9,
				"Lane1": -3.5,
				"Lane2": -2,
				"Lane3": -4.5
			},
			{
				"time": "24",
				"Lane0": -1.6,
				"Lane1": -2.5,
				"Lane2": -1.8,
				"Lane3": -4.9
			},
			{
				"time": "26",
				"Lane0": -1.9,
				"Lane1": -2.8,
				"Lane2": -1.1,
				"Lane3": -4
			}
		],
		"chart2Data": [
			{
				"time": "0",
				"Lane0": -1,
				"Lane1": -2.5,
				"Lane2": -.2,
				"Lane3": -3
			},
			{
				"time": "2",
				"Lane0": -1.2,
				"Lane1": -3,
				"Lane2": -.5,
				"Lane3": -3.8
			},
			{
				"time": "4",
				"Lane0": -.8,
				"Lane1": -2.8,
				"Lane2": -.3,
				"Lane3": -3.5
			},
			{
				"time": "6",
				"Lane0": -1.5,
				"Lane1": -3.5,
				"Lane2": -1,
				"Lane3": -2.9
			},
			{
				"time": "8",
				"Lane0": -2,
				"Lane1": -3.2,
				"Lane2": -.8,
				"Lane3": -3.1
			},
			{
				"time": "10",
				"Lane0": -1.8,
				"Lane1": -2,
				"Lane2": -.1,
				"Lane3": -4
			},
			{
				"time": "12",
				"Lane0": -1.1,
				"Lane1": -2.6,
				"Lane2": -.6,
				"Lane3": -3.6
			},
			{
				"time": "14",
				"Lane0": -.5,
				"Lane1": -3.1,
				"Lane2": -1.2,
				"Lane3": -3.2
			},
			{
				"time": "16",
				"Lane0": -.9,
				"Lane1": -3.8,
				"Lane2": -.9,
				"Lane3": -2.5
			},
			{
				"time": "18",
				"Lane0": -1.3,
				"Lane1": -4,
				"Lane2": -1.5,
				"Lane3": -3.9
			},
			{
				"time": "20",
				"Lane0": -1.6,
				"Lane1": -3.5,
				"Lane2": -1.1,
				"Lane3": -4.2
			},
			{
				"time": "22",
				"Lane0": -.7,
				"Lane1": -2.8,
				"Lane2": -.4,
				"Lane3": -3.7
			},
			{
				"time": "24",
				"Lane0": -1.4,
				"Lane1": -2.2,
				"Lane2": -.7,
				"Lane3": -2.8
			},
			{
				"time": "26",
				"Lane0": -1.8,
				"Lane1": -2.5,
				"Lane2": -.9,
				"Lane3": -3.3
			}
		],
		"chart3Data": [
			{
				"time": "0",
				"Lane0": 85,
				"Lane1": 80,
				"Lane2": 92,
				"Lane3": 78
			},
			{
				"time": "2",
				"Lane0": 88,
				"Lane1": 83,
				"Lane2": 90,
				"Lane3": 80
			},
			{
				"time": "4",
				"Lane0": 86,
				"Lane1": 81,
				"Lane2": 93,
				"Lane3": 77
			},
			{
				"time": "6",
				"Lane0": 90,
				"Lane1": 79,
				"Lane2": 88,
				"Lane3": 82
			},
			{
				"time": "8",
				"Lane0": 87,
				"Lane1": 82,
				"Lane2": 91,
				"Lane3": 79
			},
			{
				"time": "10",
				"Lane0": 82,
				"Lane1": 85,
				"Lane2": 95,
				"Lane3": 76
			},
			{
				"time": "12",
				"Lane0": 84,
				"Lane1": 84,
				"Lane2": 92,
				"Lane3": 81
			},
			{
				"time": "14",
				"Lane0": 89,
				"Lane1": 80,
				"Lane2": 89,
				"Lane3": 83
			},
			{
				"time": "16",
				"Lane0": 91,
				"Lane1": 78,
				"Lane2": 87,
				"Lane3": 80
			},
			{
				"time": "18",
				"Lane0": 86,
				"Lane1": 83,
				"Lane2": 93,
				"Lane3": 77
			},
			{
				"time": "20",
				"Lane0": 83,
				"Lane1": 86,
				"Lane2": 96,
				"Lane3": 75
			},
			{
				"time": "22",
				"Lane0": 87,
				"Lane1": 82,
				"Lane2": 91,
				"Lane3": 79
			},
			{
				"time": "24",
				"Lane0": 90,
				"Lane1": 79,
				"Lane2": 88,
				"Lane3": 82
			},
			{
				"time": "26",
				"Lane0": 88,
				"Lane1": 81,
				"Lane2": 90,
				"Lane3": 78
			}
		]
	}
};
//#endregion
export { data_default as default };
