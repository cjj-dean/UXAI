var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLeft",
				"headCenter",
				"headRight"
			]
		},
		{
			"id": "infoBar",
			"component": "div",
			"props": { "className": "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]" },
			"children": ["inbaLeftTitle", "inbaRightContainer"]
		},
		{
			"id": "mainContent",
			"component": "div",
			"props": { "className": "flex-1 min-w-0 flex flex-col gap-[1rem]" },
			"children": ["leftRegion"]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "w-[450px] shrink-0 flex flex-col gap-[1rem]" },
			"children": ["ripaStatOverviewPanel", "ripaMultiLevelListPanel"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-row" },
			"children": ["mainContent", "rightPanel"]
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
			"children": [
				"header",
				"infoBar",
				"body"
			]
		},
		{
			"id": "headLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["headLogoIcon", "headTitle"]
		},
		{
			"id": "headLogoIcon",
			"component": "Icon",
			"props": {
				"name": "cpu",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headCenter",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-center flex-1" },
			"children": ["headMenu"]
		},
		{
			"id": "headMenu",
			"component": "Menu",
			"props": {
				"mode": "horizontal",
				"selectedKeys": ["overview"],
				"items": [
					{
						"key": "overview",
						"label": "概览"
					},
					{
						"key": "nodeMgr",
						"label": "节点管理"
					},
					{
						"key": "topoList",
						"label": "拓扑列表"
					},
					{
						"key": "perfMon",
						"label": "性能监控"
					},
					{
						"key": "extAccess",
						"label": "外部接入"
					},
					{
						"key": "ruleConfig",
						"label": "规则配置"
					},
					{
						"key": "logAnalysis",
						"label": "日志分析"
					}
				]
			},
			"children": []
		},
		{
			"id": "headRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": [
				"headSettingsIcon",
				"headViewIcon",
				"headUserIcon"
			]
		},
		{
			"id": "headSettingsIcon",
			"component": "Icon",
			"props": {
				"name": "settings",
				"color": "#777777",
				"className": "w-5 h-5 flex-1",
				"shape": "outline"
			}
		},
		{
			"id": "headViewIcon",
			"component": "Icon",
			"props": {
				"name": "layout-dashboard",
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headUserIcon",
			"component": "Icon",
			"props": {
				"name": "user-circle",
				"color": "#777777",
				"className": "w-5 h-5 flex-1",
				"shape": "outline"
			}
		},
		{
			"id": "inbaLeftTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "网络运行总览"
			}
		},
		{
			"id": "inbaRightContainer",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": ["inbaSystemTime", "inbaAlertIcon"]
		},
		{
			"id": "inbaSystemTime",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface",
				"value": "系统时间: 2026-05-27 14:30:00"
			}
		},
		{
			"id": "inbaAlertIcon",
			"component": "Icon",
			"props": {
				"name": "bell",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "leftRegion",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"macoTabBar",
				"macoCpuModule",
				"macoTrafficModule",
				"macoSmallChartGroup"
			]
		},
		{
			"id": "macoTabBar",
			"component": "Tabs",
			"props": { "activeKey": { "path": "/activeTab" } },
			"children": [
				"macoTabCore",
				"macoTabEdge",
				"macoTabAccess"
			]
		},
		{
			"id": "macoTabCore",
			"component": "TabItem",
			"props": {
				"key": "coreRouter",
				"label": "核心路由",
				"icon": "router"
			}
		},
		{
			"id": "macoTabEdge",
			"component": "TabItem",
			"props": {
				"key": "edgeGateway",
				"label": "边缘网关",
				"icon": "wifi"
			}
		},
		{
			"id": "macoTabAccess",
			"component": "TabItem",
			"props": {
				"key": "accessLayer",
				"label": "接入层",
				"icon": "server"
			}
		},
		{
			"id": "macoCpuModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": ["macoCpuGauge", "macoCpuStatsGroup"]
		},
		{
			"id": "macoCpuGauge",
			"component": "PatGauge",
			"props": {
				"value": { "path": "/cpuUsage" },
				"max": 100,
				"className": "w-[30%]"
			}
		},
		{
			"id": "macoCpuStatsGroup",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] flex-1" },
			"children": {
				"path": "/cpuStats",
				"componentId": "macoStatBlock"
			}
		},
		{
			"id": "macoStatBlock",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": ["macoStatIcon", "macoStatText"]
		},
		{
			"id": "macoStatIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "primary",
				"className": "w-6 h-6",
				"shape": "outline"
			}
		},
		{
			"id": "macoStatText",
			"component": "div",
			"props": { "className": "flex flex-col" },
			"children": ["macoStatValue", "macoStatLabel"]
		},
		{
			"id": "macoStatValue",
			"component": "span",
			"props": {
				"className": "text-xl font-bold text-on-surface",
				"value": { "path": "value" }
			}
		},
		{
			"id": "macoStatLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "label" }
			}
		},
		{
			"id": "macoTrafficModule",
			"component": "div",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["macoTrafficHeader", "macoTrafficChart"]
		},
		{
			"id": "macoTrafficHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["macoTrafficTitle", "macoTrafficSelect"]
		},
		{
			"id": "macoTrafficTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "macoTrafficSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/selectedPeriod" },
				"options": [
					{
						"label": "近7天",
						"value": "近7天"
					},
					{
						"label": "近15天",
						"value": "近15天"
					},
					{
						"label": "近30天",
						"value": "近30天"
					}
				],
				"className": "shrink-0 w-auto"
			}
		},
		{
			"id": "macoTrafficChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/trafficData" },
					"xAxis": {
						"data": "日期",
						"name": "日期"
					},
					"yAxisTitle": "Mbps"
				},
				"className": "h-48"
			}
		},
		{
			"id": "macoSmallChartGroup",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": [
				"macoComputeChart",
				"macoStorageChart",
				"macoNetworkChart"
			]
		},
		{
			"id": "macoComputeChart",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["macoComputeTitle", "macoComputeLine"]
		},
		{
			"id": "macoComputeTitle",
			"component": "span",
			"props": {
				"className": "text-md font-bold text-on-surface",
				"value": "计算资源池监控"
			}
		},
		{
			"id": "macoComputeLine",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/computeData" },
					"xAxis": {
						"data": "时间",
						"name": "时间"
					},
					"yAxisTitle": "占比(%)",
					"stack": true
				},
				"className": "h-40 h-[180px]"
			}
		},
		{
			"id": "macoStorageChart",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["macoStorageTitle", "macoStorageLine"]
		},
		{
			"id": "macoStorageTitle",
			"component": "span",
			"props": {
				"className": "text-md font-bold text-on-surface",
				"value": "存储容量使用趋势"
			}
		},
		{
			"id": "macoStorageLine",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/storageData" },
					"xAxis": {
						"data": "时间",
						"name": "时间"
					},
					"yAxisTitle": "占比(%)",
					"stack": true
				},
				"className": "h-40 h-[180px]"
			}
		},
		{
			"id": "macoNetworkChart",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-[0.75rem] min-w-0" },
			"children": ["macoNetworkTitle", "macoNetworkLine"]
		},
		{
			"id": "macoNetworkTitle",
			"component": "span",
			"props": {
				"className": "text-md font-bold text-on-surface",
				"value": "网络IO流量监控"
			}
		},
		{
			"id": "macoNetworkLine",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/networkData" },
					"xAxis": {
						"data": "时间",
						"name": "时间"
					},
					"yAxisTitle": "占比(%)",
					"stack": true
				},
				"className": "h-40 h-[180px]"
			}
		},
		{
			"id": "ripaStatOverviewPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"ripaStatOverviewTitle",
				"ripaTotalCountBlock",
				"ripaPatStackedBar"
			]
		},
		{
			"id": "ripaStatOverviewTitle",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"ripaStatTitleLeft",
				"ripaStatTitleSeparator",
				"ripaStatTitleRight"
			]
		},
		{
			"id": "ripaStatTitleLeft",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface font-medium",
				"value": "设备在线数(6119)"
			}
		},
		{
			"id": "ripaStatTitleSeparator",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface-variant",
				"value": "|"
			}
		},
		{
			"id": "ripaStatTitleRight",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface font-medium",
				"value": "异常告警(766)"
			}
		},
		{
			"id": "ripaTotalCountBlock",
			"component": "div",
			"props": { "className": "flex flex-col items-center justify-center gap-[0.25rem]" },
			"children": ["ripaTotalCountNumber", "ripaTotalCountLabel"]
		},
		{
			"id": "ripaTotalCountNumber",
			"component": "span",
			"props": {
				"className": "text-4xl font-bold text-on-surface",
				"value": "6415"
			}
		},
		{
			"id": "ripaTotalCountLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "总数"
			}
		},
		{
			"id": "ripaPatStackedBar",
			"component": "PatStackedBar",
			"props": {
				"normal": { "path": "/statStackedBar/normal" },
				"warning": { "path": "/statStackedBar/warning" },
				"danger": { "path": "/statStackedBar/danger" },
				"error": { "path": "/statStackedBar/error" }
			}
		},
		{
			"id": "ripaMultiLevelListPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"ripaPanelHeader",
				"ripaMasterNodeCard",
				"ripaForwardNodeCard",
				"ripaDataNodeCard"
			]
		},
		{
			"id": "ripaPanelHeader",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"ripaPanelHeaderLeft",
				"ripaPanelHeaderSeparator",
				"ripaPanelHeaderRight"
			]
		},
		{
			"id": "ripaPanelHeaderLeft",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface font-medium",
				"value": "区域流量排行(TOP 27)"
			}
		},
		{
			"id": "ripaPanelHeaderSeparator",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface-variant",
				"value": "|"
			}
		},
		{
			"id": "ripaPanelHeaderRight",
			"component": "span",
			"props": {
				"className": "text-lg text-on-surface font-medium",
				"value": "异常节点追踪(处理中28)"
			}
		},
		{
			"id": "ripaMasterNodeCard",
			"component": "Card",
			"props": { "className": "border border-base gap-[1rem] rounded-lg p-[0.75rem]" },
			"children": ["ripaMasterNodeTitle", "ripaMasterNodeList"]
		},
		{
			"id": "ripaMasterNodeTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "管理节点"
			}
		},
		{
			"id": "ripaMasterNodeList",
			"component": "div",
			"props": { "className": "flex flex-col divide-y divide-divider" },
			"children": {
				"path": "/masterNodes",
				"componentId": "ripaNodeItemTemplate"
			}
		},
		{
			"id": "ripaForwardNodeCard",
			"component": "Card",
			"props": { "className": "border border-base gap-[1rem] rounded-lg p-[0.75rem]" },
			"children": ["ripaForwardNodeTitle", "ripaForwardNodeList"]
		},
		{
			"id": "ripaForwardNodeTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "转发节点"
			}
		},
		{
			"id": "ripaForwardNodeList",
			"component": "div",
			"props": { "className": "flex flex-col divide-y divide-divider" },
			"children": {
				"path": "/forwardNodes",
				"componentId": "ripaNodeItemTemplate"
			}
		},
		{
			"id": "ripaDataNodeCard",
			"component": "Card",
			"props": { "className": "border border-base gap-[1rem] rounded-lg p-[0.75rem]" },
			"children": ["ripaDataNodeTitle", "ripaDataNodeList"]
		},
		{
			"id": "ripaDataNodeTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "数据节点"
			}
		},
		{
			"id": "ripaDataNodeList",
			"component": "div",
			"props": { "className": "flex flex-col divide-y divide-divider" },
			"children": {
				"path": "/dataNodes",
				"componentId": "ripaNodeItemTemplate"
			}
		},
		{
			"id": "ripaNodeItemTemplate",
			"component": "div",
			"props": { "className": "flex flex-row items-center p-[0.75rem] gap-[1rem]" },
			"children": ["ripaNodeItemLeft", "ripaNodeItemRight"]
		},
		{
			"id": "ripaNodeItemLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem] flex-1" },
			"children": ["ripaNodeIcon", "ripaNodeTitle"]
		},
		{
			"id": "ripaNodeIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "ripaNodeTitle",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface",
				"value": { "path": "title" }
			}
		},
		{
			"id": "ripaNodeItemRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"ripaNodeDataset1",
				"ripaNodeDivider",
				"ripaNodeDataset2"
			]
		},
		{
			"id": "ripaNodeDataset1",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaNodeDataset1Value", "ripaNodeDataset1Label"]
		},
		{
			"id": "ripaNodeDataset1Value",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": { "path": "datasets/0/value" }
			}
		},
		{
			"id": "ripaNodeDataset1Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "datasets/0/label" }
			}
		},
		{
			"id": "ripaNodeDivider",
			"component": "div",
			"props": { "className": "w-px self-stretch bg-divider" }
		},
		{
			"id": "ripaNodeDataset2",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaNodeDataset2Value", "ripaNodeDataset2Label"]
		},
		{
			"id": "ripaNodeDataset2Value",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": { "path": "datasets/1/value" }
			}
		},
		{
			"id": "ripaNodeDataset2Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "datasets/1/label" }
			}
		}
	],
	state: {
		"activeTab": "coreRouter",
		"tabItems": [
			{
				"key": "coreRouter",
				"label": "核心路由",
				"icon": "router"
			},
			{
				"key": "edgeGateway",
				"label": "边缘网关",
				"icon": "wifi"
			},
			{
				"key": "accessLayer",
				"label": "接入层",
				"icon": "server"
			}
		],
		"cpuUsage": 72,
		"cpuStats": [{
			"icon": "monitor",
			"value": "1574",
			"label": "运行中"
		}, {
			"icon": "settings",
			"value": "050",
			"label": "待检修"
		}],
		"selectedPeriod": "近30天",
		"trafficData": [
			{
				"日期": "05/01",
				"流量": 120
			},
			{
				"日期": "05/05",
				"流量": 135
			},
			{
				"日期": "05/10",
				"流量": 142
			},
			{
				"日期": "05/15",
				"流量": 158
			},
			{
				"日期": "05/20",
				"流量": 165
			},
			{
				"日期": "05/25",
				"流量": 180
			},
			{
				"日期": "05/30",
				"流量": 195
			}
		],
		"computeData": [
			{
				"时间": "00:00",
				"核心集群": 84,
				"高频区": 6,
				"闲置区": 10
			},
			{
				"时间": "04:00",
				"核心集群": 82,
				"高频区": 8,
				"闲置区": 10
			},
			{
				"时间": "08:00",
				"核心集群": 88,
				"高频区": 7,
				"闲置区": 5
			},
			{
				"时间": "12:00",
				"核心集群": 86,
				"高频区": 9,
				"闲置区": 5
			},
			{
				"时间": "16:00",
				"核心集群": 85,
				"高频区": 8,
				"闲置区": 7
			},
			{
				"时间": "20:00",
				"核心集群": 83,
				"高频区": 7,
				"闲置区": 10
			},
			{
				"时间": "24:00",
				"核心集群": 80,
				"高频区": 6,
				"闲置区": 14
			}
		],
		"storageData": [
			{
				"时间": "00:00",
				"固态存储": 58,
				"机械硬盘": 14,
				"备份区": 28
			},
			{
				"时间": "04:00",
				"固态存储": 56,
				"机械硬盘": 15,
				"备份区": 29
			},
			{
				"时间": "08:00",
				"固态存储": 60,
				"机械硬盘": 12,
				"备份区": 28
			},
			{
				"时间": "12:00",
				"固态存储": 62,
				"机械硬盘": 11,
				"备份区": 27
			},
			{
				"时间": "16:00",
				"固态存储": 61,
				"机械硬盘": 13,
				"备份区": 26
			},
			{
				"时间": "20:00",
				"固态存储": 59,
				"机械硬盘": 14,
				"备份区": 27
			},
			{
				"时间": "24:00",
				"固态存储": 57,
				"机械硬盘": 16,
				"备份区": 27
			}
		],
		"networkData": [
			{
				"时间": "00:00",
				"下行流量": 63,
				"上行流量": 12,
				"广播包": 25
			},
			{
				"时间": "04:00",
				"下行流量": 60,
				"上行流量": 10,
				"广播包": 30
			},
			{
				"时间": "08:00",
				"下行流量": 68,
				"上行流量": 8,
				"广播包": 24
			},
			{
				"时间": "12:00",
				"下行流量": 70,
				"上行流量": 9,
				"广播包": 21
			},
			{
				"时间": "16:00",
				"下行流量": 67,
				"上行流量": 11,
				"广播包": 22
			},
			{
				"时间": "20:00",
				"下行流量": 65,
				"上行流量": 13,
				"广播包": 22
			},
			{
				"时间": "24:00",
				"下行流量": 62,
				"上行流量": 14,
				"广播包": 24
			}
		],
		"statStackedBar": {
			"normal": 6119,
			"warning": 0,
			"danger": 0,
			"error": 766
		},
		"masterNodes": [
			{
				"icon": "server",
				"iconColor": "primary",
				"title": "主控服务器",
				"datasets": [{
					"value": "296",
					"label": "当前连接"
				}, {
					"value": "9902",
					"label": "总吞吐量"
				}]
			},
			{
				"icon": "cpu",
				"iconColor": "success",
				"title": "备用控制节点",
				"datasets": [{
					"value": "68",
					"label": "活跃会话"
				}, {
					"value": "7613",
					"label": "写入数据"
				}]
			},
			{
				"icon": "shield",
				"iconColor": "warning",
				"title": "安全网关",
				"datasets": [{
					"value": "88",
					"label": "拦截次数"
				}, {
					"value": "3579",
					"label": "并发数"
				}]
			},
			{
				"icon": "scale",
				"iconColor": "error",
				"title": "负载均衡器",
				"datasets": [{
					"value": "8",
					"label": "异常转发"
				}, {
					"value": "9498",
					"label": "总分配量"
				}]
			}
		],
		"forwardNodes": [{
			"icon": "cable",
			"iconColor": "primary",
			"title": "专线接入集群",
			"datasets": [{
				"value": "57",
				"label": "并发请求"
			}, {
				"value": "2560",
				"label": "数据包量"
			}]
		}, {
			"icon": "globe",
			"iconColor": "success",
			"title": "公网接入集群",
			"datasets": [{
				"value": "99",
				"label": "当前带宽"
			}, {
				"value": "0347",
				"label": "丢包率"
			}]
		}],
		"dataNodes": [{
			"icon": "database",
			"iconColor": "primary",
			"title": "主数据库",
			"datasets": [{
				"value": "3",
				"label": "查询延迟"
			}, {
				"value": "5877",
				"label": "IOPS"
			}]
		}]
	}
};
//#endregion
export { data_default as default };
