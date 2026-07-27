var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headerLeft",
				"headerCenter",
				"headerRight"
			]
		},
		{
			"id": "infoBar",
			"component": "div",
			"props": { "className": "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]" },
			"children": ["infoBarLeftTitle", "infoBarRightContainer"]
		},
		{
			"id": "leftContentRegion",
			"component": "Section",
			"props": { "className": "flex-1 min-w-0 flex flex-col gap-[1rem]" },
			"children": [
				"tabRow",
				"firstModule",
				"secondModule",
				"thirdModule"
			]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "shrink-0 w-[450px] flex flex-col gap-[1rem]" },
			"children": ["upperOverviewPanel", "lowerMultiLevelListPanel"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-row" },
			"children": ["leftContentRegion", "rightPanel"]
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
			"id": "headerLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": ["headerLeftIcon", "headerLeftText"]
		},
		{
			"id": "headerLeftIcon",
			"component": "Icon",
			"props": {
				"name": "package",
				"className": "w-5 h-5",
				"color": "primary",
				"shape": "outline"
			}
		},
		{
			"id": "headerLeftText",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headerCenter",
			"component": "Menu",
			"props": {
				"mode": "horizontal",
				"selectedKeys": { "path": "/selectedMenuKeys" },
				"items": [
					{
						"title": "概览",
						"key": "overview"
					},
					{
						"title": "节点管理",
						"key": "nodeManagement"
					},
					{
						"title": "拓扑列表",
						"key": "topology"
					},
					{
						"title": "性能监控",
						"key": "performance"
					},
					{
						"title": "外部接入",
						"key": "externalAccess"
					},
					{
						"title": "规则配置",
						"key": "ruleConfig"
					},
					{
						"title": "日志分析",
						"key": "logAnalysis"
					}
				],
				"className": ""
			}
		},
		{
			"id": "headerRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-4" },
			"children": ["headerRightTheme", "headerRightUser"]
		},
		{
			"id": "headerRightTheme",
			"component": "Icon",
			"props": {
				"name": "sun",
				"className": "w-5 h-5",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "headerRightUser",
			"component": "Icon",
			"props": {
				"name": "user",
				"className": "w-5 h-5",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "infoBarLeftTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "网络运行总览"
			}
		},
		{
			"id": "infoBarRightContainer",
			"component": "div",
			"props": { "className": "flex flex-row gap-4 items-center" },
			"children": [
				"infoBarTimeText",
				"infoBarSettingIcon",
				"infoBarGridIcon",
				"infoBarTopologyIcon"
			]
		},
		{
			"id": "infoBarTimeText",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "系统时间: 2026-05-27 14:30:00"
			}
		},
		{
			"id": "infoBarSettingIcon",
			"component": "Icon",
			"props": {
				"type": "setting",
				"className": "text-lg w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "infoBarGridIcon",
			"component": "Icon",
			"props": {
				"type": "grid",
				"className": "text-lg w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "infoBarTopologyIcon",
			"component": "Icon",
			"props": {
				"type": "topology",
				"className": "text-lg w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "tabRow",
			"component": "Tabs",
			"props": {
				"activeKey": { "path": "/activeTab" },
				"className": "flex flex-row"
			},
			"children": {
				"path": "/tabItems",
				"componentId": "tabItemTemplate"
			}
		},
		{
			"id": "tabItemTemplate",
			"component": "TabItem",
			"props": {
				"key": { "path": "key" },
				"label": { "path": "label" },
				"content": { "componentId": "tabEmptyContent" }
			}
		},
		{
			"id": "tabEmptyContent",
			"component": "div",
			"props": { "className": "" }
		},
		{
			"id": "firstModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": ["leftGaugeArea", "rightStatsArea"]
		},
		{
			"id": "leftGaugeArea",
			"component": "div",
			"props": { "className": "flex flex-col w-[30%]" },
			"children": ["leftGaugeTitle", "gaugeCpu"]
		},
		{
			"id": "leftGaugeTitle",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface mb-[0.75rem]",
				"value": "CPU使用率"
			}
		},
		{
			"id": "gaugeCpu",
			"component": "PatGauge",
			"props": {
				"value": { "path": "/cpuUsage" },
				"max": 100
			}
		},
		{
			"id": "rightStatsArea",
			"component": "div",
			"props": { "className": "flex flex-row w-[70%] gap-[1rem]" },
			"children": {
				"path": "/statsArray",
				"componentId": "statsBlockTemplate"
			}
		},
		{
			"id": "statsBlockTemplate",
			"component": "div",
			"props": { "className": "flex flex-row items-center flex-1 min-w-0 gap-[1rem]" },
			"children": ["statsIcon", "statsTextBlock"]
		},
		{
			"id": "statsIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"shape": "circle",
				"className": "w-12 h-12"
			}
		},
		{
			"id": "statsTextBlock",
			"component": "div",
			"props": { "className": "flex flex-col" },
			"children": ["statsValue", "statsLabel"]
		},
		{
			"id": "statsValue",
			"component": "span",
			"props": {
				"className": "text-3xl font-bold text-on-surface",
				"value": { "path": "value" }
			}
		},
		{
			"id": "statsLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant mt-[0.25rem]",
				"value": { "path": "label" }
			}
		},
		{
			"id": "secondModule",
			"component": "div",
			"props": { "className": "flex flex-col h-[300px]" },
			"children": ["titleRow", "lineChartArea"]
		},
		{
			"id": "titleRow",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center mb-[0.75rem]" },
			"children": ["secondTitleLeft", "periodSelect"]
		},
		{
			"id": "secondTitleLeft",
			"component": "span",
			"props": {
				"className": "text-lg font-medium text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "periodSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/selectedPeriod" },
				"options": { "path": "/periodOptions" },
				"size": "small",
				"className": "shrink-0 w-auto"
			}
		},
		{
			"id": "lineChartArea",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/networkTrafficData" },
					"xAxis": { "data": "日期" },
					"yAxisTitle": "流量(Mbps)"
				},
				"className": "h-0 min-w-0 h-[180px]"
			}
		},
		{
			"id": "thirdModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": {
				"path": "/chartsData",
				"componentId": "chartCardTemplate"
			}
		},
		{
			"id": "chartCardTemplate",
			"component": "div",
			"props": { "className": "flex flex-col bg-surface-container-highest shadow-sm rounded-xl p-[1.5rem] flex-1 min-w-0" },
			"children": ["chartTitle", "chartLine"]
		},
		{
			"id": "chartTitle",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface mb-[0.75rem]",
				"value": { "path": "title" }
			}
		},
		{
			"id": "chartLine",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "data" },
					"xAxis": { "data": { "path": "xField" } },
					"yAxisTitle": { "path": "yTitle" },
					"stack": true
				},
				"className": "h-0 min-w-0 h-[180px]"
			}
		},
		{
			"id": "upperOverviewPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"overviewTitleBar",
				"totalCountDisplay",
				"stackedBarChartArea"
			]
		},
		{
			"id": "overviewTitleBar",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["overviewTitleText"]
		},
		{
			"id": "overviewTitleText",
			"component": "span",
			"props": { "value": "设备在线数(6119) | 异常告警(766)" }
		},
		{
			"id": "totalCountDisplay",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["totalCountNum", "totalCountLabel"]
		},
		{
			"id": "totalCountNum",
			"component": "span",
			"props": {
				"className": "text-5xl font-bold text-on-surface",
				"value": "6415"
			}
		},
		{
			"id": "totalCountLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "总数"
			}
		},
		{
			"id": "stackedBarChartArea",
			"component": "PatStackedBar",
			"props": {
				"normal": { "path": "/stackedBarNormal" },
				"warning": { "path": "/stackedBarWarning" },
				"danger": { "path": "/stackedBarDanger" },
				"error": { "path": "/stackedBarError" }
			}
		},
		{
			"id": "lowerMultiLevelListPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["listPanelTitleBar", "dataListContainer"]
		},
		{
			"id": "listPanelTitleBar",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["listPanelTitleText"]
		},
		{
			"id": "listPanelTitleText",
			"component": "span",
			"props": { "value": "区域流量排行(TOP 27)｜异常节点追踪(处理中28)" }
		},
		{
			"id": "dataListContainer",
			"component": "div",
			"props": { "className": "rounded-lg border border-base flex flex-col border-outline-variant p-[0.75rem]" },
			"children": {
				"path": "/listData",
				"componentId": "listDataItem"
			}
		},
		{
			"id": "listDataItem",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center p-[0.75rem] border-b border-divider" },
			"children": ["itemLeftInfo", "itemRightMetrics"]
		},
		{
			"id": "itemLeftInfo",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": ["itemLeftIcon", "itemLeftTitle"]
		},
		{
			"id": "itemLeftIcon",
			"component": "Icon",
			"props": {
				"name": "server",
				"color": "#777777",
				"shape": "square",
				"className": "w-8 h-8"
			}
		},
		{
			"id": "itemLeftTitle",
			"component": "span",
			"props": { "value": { "path": "title" } }
		},
		{
			"id": "itemRightMetrics",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"metricGroup1",
				"metricDivider",
				"metricGroup2"
			]
		},
		{
			"id": "metricGroup1",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["metricValue1", "metricLabel1"]
		},
		{
			"id": "metricValue1",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "value1" }
			}
		},
		{
			"id": "metricLabel1",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "label1" }
			}
		},
		{
			"id": "metricDivider",
			"component": "Divider",
			"props": {
				"orientation": "vertical",
				"className": "h-8"
			}
		},
		{
			"id": "metricGroup2",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["metricValue2", "metricLabel2"]
		},
		{
			"id": "metricValue2",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "value2" }
			}
		},
		{
			"id": "metricLabel2",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "label2" }
			}
		}
	],
	state: {
		"selectedMenuKeys": ["overview"],
		"activeTab": "coreRouter",
		"tabItems": [
			{
				"key": "coreRouter",
				"label": "核心路由"
			},
			{
				"key": "edgeGateway",
				"label": "边缘网关"
			},
			{
				"key": "accessLayer",
				"label": "接入层"
			}
		],
		"cpuUsage": 72,
		"statsArray": [{
			"icon": "circle-check",
			"color": "success",
			"value": "1574",
			"label": "运行中"
		}, {
			"icon": "alert-triangle",
			"color": "warning",
			"value": "050",
			"label": "待检修"
		}],
		"selectedPeriod": "last30",
		"periodOptions": [
			{
				"label": "近7天",
				"value": "last7"
			},
			{
				"label": "近30天",
				"value": "last30"
			},
			{
				"label": "近90天",
				"value": "last90"
			}
		],
		"networkTrafficData": [
			{
				"日期": "11/01",
				"下行流量": 120,
				"上行流量": 80
			},
			{
				"日期": "11/05",
				"下行流量": 135,
				"上行流量": 75
			},
			{
				"日期": "11/10",
				"下行流量": 110,
				"上行流量": 90
			},
			{
				"日期": "11/15",
				"下行流量": 145,
				"上行流量": 70
			},
			{
				"日期": "11/20",
				"下行流量": 130,
				"上行流量": 85
			},
			{
				"日期": "11/25",
				"下行流量": 125,
				"上行流量": 78
			},
			{
				"日期": "11/30",
				"下行流量": 140,
				"上行流量": 82
			}
		],
		"chartsData": [
			{
				"title": "计算资源池监控",
				"data": [
					{
						"日期": "11/01",
						"核心集群": 84,
						"高频区": 9,
						"闲置区": 7
					},
					{
						"日期": "11/10",
						"核心集群": 86,
						"高频区": 8,
						"闲置区": 6
					},
					{
						"日期": "11/20",
						"核心集群": 82,
						"高频区": 11,
						"闲置区": 7
					},
					{
						"日期": "11/30",
						"核心集群": 85,
						"高频区": 10,
						"闲置区": 5
					}
				],
				"xField": "日期",
				"yTitle": "使用率(%)"
			},
			{
				"title": "存储容量使用趋势",
				"data": [
					{
						"日期": "11/01",
						"固态存储": 58,
						"机械硬盘": 14,
						"备份区": 28
					},
					{
						"日期": "11/10",
						"固态存储": 60,
						"机械硬盘": 13,
						"备份区": 27
					},
					{
						"日期": "11/20",
						"固态存储": 59,
						"机械硬盘": 15,
						"备份区": 26
					},
					{
						"日期": "11/30",
						"固态存储": 61,
						"机械硬盘": 12,
						"备份区": 27
					}
				],
				"xField": "日期",
				"yTitle": "容量(TB)"
			},
			{
				"title": "网络IO流量监控",
				"data": [
					{
						"日期": "11/01",
						"下行流量": 63,
						"上行流量": 12,
						"广播包": 25
					},
					{
						"日期": "11/10",
						"下行流量": 65,
						"上行流量": 11,
						"广播包": 24
					},
					{
						"日期": "11/20",
						"下行流量": 61,
						"上行流量": 14,
						"广播包": 25
					},
					{
						"日期": "11/30",
						"下行流量": 64,
						"上行流量": 13,
						"广播包": 23
					}
				],
				"xField": "日期",
				"yTitle": "流量(Gbps)"
			}
		],
		"stackedBarNormal": 6119,
		"stackedBarWarning": 400,
		"stackedBarDanger": 200,
		"stackedBarError": 100,
		"listData": [
			{
				"title": "主控服务器",
				"value1": "296",
				"label1": "当前连接",
				"value2": "9902",
				"label2": "总吞吐量",
				"color": "primary"
			},
			{
				"title": "备用控制节点",
				"value1": "68",
				"label1": "活跃会话",
				"value2": "7613",
				"label2": "写入数据",
				"color": "warning"
			},
			{
				"title": "安全网关",
				"value1": "88",
				"label1": "拦截次数",
				"value2": "3579",
				"label2": "并发数",
				"color": "critical"
			},
			{
				"title": "负载均衡器",
				"value1": "8",
				"label1": "异常转发",
				"value2": "9498",
				"label2": "总分配量",
				"color": "info"
			},
			{
				"title": "专线接入集群",
				"value1": "57",
				"label1": "并发请求",
				"value2": "2560",
				"label2": "数据包量",
				"color": "success"
			},
			{
				"title": "公网接入集群",
				"value1": "99",
				"label1": "当前带宽",
				"value2": "0347",
				"label2": "丢包率",
				"color": "error"
			},
			{
				"title": "主数据库",
				"value1": "3",
				"label1": "查询延迟",
				"value2": "5877",
				"label2": "IOPS",
				"color": "primary"
			}
		]
	},
	intentNodes: {
		"root": { "layout": "vertical" },
		"header": {
			"layout": "horizontal",
			"layoutDescription": "three-column"
		},
		"infoBar": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"body": {
			"layout": "horizontal",
			"layoutDescription": "right-fixed"
		},
		"main": { "layout": "horizontal" },
		"mainContent": { "layout": "vertical" },
		"leftContentRegion": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"tabRow": { "layout": "horizontal" },
		"firstModule": {
			"layout": "horizontal",
			"layoutDescription": "left-fixed",
			"style": "rounded-bg"
		},
		"leftGaugeArea": {
			"layout": "vertical",
			"style": "width-30%"
		},
		"rightStatsArea": {
			"layout": "horizontal",
			"layoutDescription": "equal-width",
			"style": "width-70%"
		},
		"secondModule": {
			"layout": "vertical",
			"style": "rounded-bg,height-300px"
		},
		"titleRow": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"thirdModule": {
			"layout": "horizontal",
			"layoutDescription": "equal-width"
		},
		"computeResourceChart": {
			"layout": "vertical",
			"style": "rounded-bg"
		},
		"storageCapacityChart": {
			"layout": "vertical",
			"style": "rounded-bg"
		},
		"networkIOMonitorChart": {
			"layout": "vertical",
			"style": "rounded-bg"
		},
		"rightPanel": {
			"layout": "vertical",
			"style": "固定宽度450px"
		},
		"upperOverviewPanel": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"overviewTitleBar": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"lowerMultiLevelListPanel": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"listPanelTitleBar": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"dataListContainer": {
			"layout": "vertical",
			"style": "rounded-bordered"
		},
		"listDataItem": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"itemLeftInfo": { "layout": "horizontal" },
		"itemRightMetrics": { "layout": "horizontal" },
		"metricGroup1": { "layout": "vertical" },
		"metricGroup2": { "layout": "vertical" }
	}
};
//#endregion
export { data_default as default };
