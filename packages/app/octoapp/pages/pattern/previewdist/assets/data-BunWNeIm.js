var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headerLeft",
				"headerNavMenu",
				"headerRight"
			]
		},
		{
			"id": "infoBar",
			"component": "div",
			"props": { "className": "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]" },
			"children": ["infoBarLeftTitle", "infoBarRightActions"]
		},
		{
			"id": "mainContent",
			"component": "Section",
			"props": { "className": "flex-1 min-w-0 overflow-y-auto gap-[1rem] flex flex-col" },
			"children": [
				"tabBar",
				"module1_cpuUsage",
				"module2_networkTrafficTrend",
				"module3_smallCharts"
			]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "shrink-0 w-[450px] overflow-hidden flex flex-col gap-[1rem]" },
			"children": ["summaryPanel", "trafficRankingPanel"]
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
			"id": "headerLeft",
			"component": "div",
			"props": { "className": "flex items-center gap-2" },
			"children": ["headerIconSystem", "headerTextSystem"]
		},
		{
			"id": "headerIconSystem",
			"component": "Icon",
			"props": {
				"name": "monitor",
				"color": "primary",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "headerTextSystem",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headerNavMenu",
			"component": "Menu",
			"props": {
				"mode": "horizontal",
				"selectedKeys": ["overview"],
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
						"key": "topologyList"
					},
					{
						"title": "性能监控",
						"key": "performanceMonitor"
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
				]
			}
		},
		{
			"id": "headerRight",
			"component": "div",
			"props": { "className": "flex items-center gap-2" },
			"children": ["headerThemeIcon", "headerUserIcon"]
		},
		{
			"id": "headerThemeIcon",
			"component": "Icon",
			"props": {
				"name": "moon",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "headerUserIcon",
			"component": "Icon",
			"props": {
				"name": "user",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
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
			"id": "infoBarRightActions",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-inline" },
			"children": [
				"infoBarTimeText",
				"infoBarSettingIcon",
				"infoBarGridIcon",
				"infoBarTopoIcon"
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
				"className": "cursor-pointer w-4 h-4",
				"icon": "SettingOutlined",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "infoBarGridIcon",
			"component": "Icon",
			"props": {
				"className": "cursor-pointer w-4 h-4",
				"icon": "AppstoreOutlined",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "infoBarTopoIcon",
			"component": "Icon",
			"props": {
				"className": "cursor-pointer w-4 h-4",
				"icon": "BlockOutlined",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "tabBar",
			"component": "Tabs",
			"props": {
				"activeKey": { "path": "/activeTab" },
				"type": "line",
				"size": "large",
				"className": "flex flex-row shrink-0"
			},
			"children": {
				"path": "/tabItems",
				"componentId": "dynamicTabItem"
			}
		},
		{
			"id": "dynamicTabItem",
			"component": "TabItem",
			"props": {
				"key": { "path": "key" },
				"label": { "path": "label" },
				"content": { "componentId": "tabContent" }
			}
		},
		{
			"id": "tabContent",
			"component": "div",
			"props": { "value": { "path": "content" } }
		},
		{
			"id": "module1_cpuUsage",
			"component": "div",
			"props": { "className": "flex flex-row gap-4 items-stretch shrink-0" },
			"children": ["m1Left", "m1Right"]
		},
		{
			"id": "m1Left",
			"component": "div",
			"props": { "className": "w-[30%] flex flex-col gap-2" },
			"children": ["m1Title", "m1Gauge"]
		},
		{
			"id": "m1Title",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "CPU使用率"
			}
		},
		{
			"id": "m1Gauge",
			"component": "PatGauge",
			"props": {
				"value": { "path": "/cpuGaugeValue" },
				"max": { "path": "/cpuGaugeMax" }
			}
		},
		{
			"id": "m1Right",
			"component": "div",
			"props": { "className": "w-[70%] flex flex-row items-center gap-6" },
			"children": ["m1Stat1", "m1Stat2"]
		},
		{
			"id": "m1Stat1",
			"component": "div",
			"props": { "className": "flex-1 flex flex-row items-center gap-4" },
			"children": ["m1Stat1Icon", "m1Stat1Text"]
		},
		{
			"id": "m1Stat1Icon",
			"component": "Icon",
			"props": {
				"name": "circle-check",
				"color": "success",
				"shape": "circle",
				"className": "w-10 h-10"
			}
		},
		{
			"id": "m1Stat1Text",
			"component": "div",
			"props": { "className": "flex flex-col" },
			"children": ["m1Stat1Num", "m1Stat1Label"]
		},
		{
			"id": "m1Stat1Num",
			"component": "span",
			"props": {
				"className": "text-5xl font-bold text-on-surface",
				"value": "1574"
			}
		},
		{
			"id": "m1Stat1Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "运行中"
			}
		},
		{
			"id": "m1Stat2",
			"component": "div",
			"props": { "className": "flex-1 flex flex-row items-center gap-4" },
			"children": ["m1Stat2Icon", "m1Stat2Text"]
		},
		{
			"id": "m1Stat2Icon",
			"component": "Icon",
			"props": {
				"name": "alert-triangle",
				"color": "warning",
				"shape": "circle",
				"className": "w-10 h-10"
			}
		},
		{
			"id": "m1Stat2Text",
			"component": "div",
			"props": { "className": "flex flex-col" },
			"children": ["m1Stat2Num", "m1Stat2Label"]
		},
		{
			"id": "m1Stat2Num",
			"component": "span",
			"props": {
				"className": "text-5xl font-bold text-on-surface",
				"value": "050"
			}
		},
		{
			"id": "m1Stat2Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "待检修"
			}
		},
		{
			"id": "module2_networkTrafficTrend",
			"component": "div",
			"props": { "className": "flex flex-col gap-4 h-[300px] shrink-0" },
			"children": ["m2Header", "m2Chart"]
		},
		{
			"id": "m2Header",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["m2Title", "m2Select"]
		},
		{
			"id": "m2Title",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "m2Select",
			"component": "Select",
			"props": {
				"value": { "path": "/selectValue" },
				"options": [{
					"label": "近30天",
					"value": "last30"
				}],
				"size": "small",
				"className": "shrink-0 w-auto"
			}
		},
		{
			"id": "m2Chart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/trafficData" },
					"xAxis": {
						"data": "date",
						"name": "日期"
					},
					"yAxisTitle": "流量(Gbps)",
					"smooth": true
				},
				"className": "h-[300px]"
			}
		},
		{
			"id": "module3_smallCharts",
			"component": "div",
			"props": { "className": "flex flex-row gap-4 shrink-0" },
			"children": [
				"computePoolMonitor",
				"storageCapacityTrend",
				"networkIOMonitor"
			]
		},
		{
			"id": "computePoolMonitor",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-2 min-w-0" },
			"children": ["computePoolTitle", "computePoolChart"]
		},
		{
			"id": "computePoolTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "计算资源池监控"
			}
		},
		{
			"id": "computePoolChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/computePoolData" },
					"xAxis": {
						"data": "time",
						"name": "时间"
					},
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "storageCapacityTrend",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-2 min-w-0" },
			"children": ["storageTitle", "storageChart"]
		},
		{
			"id": "storageTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "存储容量使用趋势"
			}
		},
		{
			"id": "storageChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/storageData" },
					"xAxis": {
						"data": "time",
						"name": "季度"
					},
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "networkIOMonitor",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col gap-2 min-w-0" },
			"children": ["networkIOTitle", "networkIOChart"]
		},
		{
			"id": "networkIOTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "网络IO流量监控"
			}
		},
		{
			"id": "networkIOChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/networkData" },
					"xAxis": {
						"data": "time",
						"name": "时间"
					},
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "summaryPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"summaryHeader",
				"totalCount",
				"patStackedBar"
			]
		},
		{
			"id": "summaryHeader",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "设备在线数(6119) | 异常告警(766)"
			}
		},
		{
			"id": "totalCount",
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
			"id": "patStackedBar",
			"component": "PatStackedBar",
			"props": {
				"normal": { "path": "/healthStatus/normal" },
				"warning": { "path": "/healthStatus/warning" },
				"danger": { "path": "/healthStatus/danger" },
				"error": { "path": "/healthStatus/error" },
				"className": ""
			}
		},
		{
			"id": "trafficRankingPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["panelHeader", "dataBlock"]
		},
		{
			"id": "panelHeader",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "区域流量排行(TOP 27)｜异常节点追踪(处理中28)"
			}
		},
		{
			"id": "dataBlock",
			"component": "div",
			"props": {
				"className": "flex flex-col gap-[0.75rem] rounded-lg border border-outline-variant p-[0.75rem]",
				"children": {
					"path": "/trafficData",
					"componentId": "trafficItemTemplate"
				}
			}
		},
		{
			"id": "trafficItemTemplate",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["itemLeft", "itemRight"]
		},
		{
			"id": "itemLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["trafficIcon", "trafficTitle"]
		},
		{
			"id": "trafficIcon",
			"component": "Icon",
			"props": {
				"name": "circle",
				"color": "#777777",
				"shape": "square",
				"className": "w-8 h-8"
			}
		},
		{
			"id": "trafficTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-medium text-on-surface",
				"value": { "path": "title" }
			}
		},
		{
			"id": "itemRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": [
				"group1",
				"divider",
				"group2"
			]
		},
		{
			"id": "group1",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["group1Val", "group1Label"]
		},
		{
			"id": "group1Val",
			"component": "span",
			"props": {
				"className": "text-xl font-bold text-on-surface",
				"value": { "path": "value1" }
			}
		},
		{
			"id": "group1Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "label1" }
			}
		},
		{
			"id": "divider",
			"component": "Divider",
			"props": {
				"orientation": "vertical",
				"className": "h-8"
			}
		},
		{
			"id": "group2",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["group2Val", "group2Label"]
		},
		{
			"id": "group2Val",
			"component": "span",
			"props": {
				"className": "text-xl font-bold text-on-surface",
				"value": { "path": "value2" }
			}
		},
		{
			"id": "group2Label",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "label2" }
			}
		}
	],
	state: {
		"activeTab": "core",
		"tabItems": [
			{
				"key": "core",
				"label": "核心路由",
				"content": "核心路由"
			},
			{
				"key": "edge",
				"label": "边缘网关",
				"content": "边缘网关"
			},
			{
				"key": "access",
				"label": "接入层",
				"content": "接入层"
			}
		],
		"cpuGaugeValue": 72,
		"cpuGaugeMax": 100,
		"trafficData": [
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
				"color": "success"
			},
			{
				"title": "安全网关",
				"value1": "88",
				"label1": "拦截次数",
				"value2": "3579",
				"label2": "并发数",
				"color": "warning"
			},
			{
				"title": "负载均衡器",
				"value1": "8",
				"label1": "异常转发",
				"value2": "9498",
				"label2": "总分配量",
				"color": "critical"
			},
			{
				"title": "专线接入集群",
				"value1": "57",
				"label1": "并发请求",
				"value2": "2560",
				"label2": "数据包量",
				"color": "error"
			},
			{
				"title": "公网接入集群",
				"value1": "99",
				"label1": "当前带宽",
				"value2": "0347",
				"label2": "丢包率",
				"color": "info"
			},
			{
				"title": "主数据库",
				"value1": "3",
				"label1": "查询延迟",
				"value2": "5877",
				"label2": "IOPS",
				"color": "primary"
			}
		],
		"selectValue": "last30",
		"computePoolData": [
			{
				"time": "00:00",
				"核心集群": 84,
				"高频区": 6,
				"闲置区": 10
			},
			{
				"time": "06:00",
				"核心集群": 78,
				"高频区": 9,
				"闲置区": 13
			},
			{
				"time": "12:00",
				"核心集群": 80,
				"高频区": 8,
				"闲置区": 12
			},
			{
				"time": "18:00",
				"核心集群": 82,
				"高频区": 7,
				"闲置区": 11
			}
		],
		"storageData": [
			{
				"time": "Q1",
				"固态存储": 58,
				"机械硬盘": 14,
				"备份区": 28
			},
			{
				"time": "Q2",
				"固态存储": 60,
				"机械硬盘": 15,
				"备份区": 25
			},
			{
				"time": "Q3",
				"固态存储": 62,
				"机械硬盘": 13,
				"备份区": 25
			},
			{
				"time": "Q4",
				"固态存储": 65,
				"机械硬盘": 12,
				"备份区": 23
			}
		],
		"networkData": [
			{
				"time": "00:00",
				"下行流量": 63,
				"上行流量": 12,
				"广播包": 25
			},
			{
				"time": "06:00",
				"下行流量": 58,
				"上行流量": 10,
				"广播包": 32
			},
			{
				"time": "12:00",
				"下行流量": 60,
				"上行流量": 11,
				"广播包": 29
			},
			{
				"time": "18:00",
				"下行流量": 55,
				"上行流量": 9,
				"广播包": 36
			}
		],
		"healthStatus": {
			"normal": 6119,
			"warning": 766,
			"danger": 0,
			"error": 0
		}
	},
	intentNodes: {
		"root": { "layout": "vertical" },
		"header": {
			"layout": "horizontal",
			"layoutDescription": "three-column"
		},
		"infoBar": { "layout": "horizontal" },
		"body": {
			"layout": "horizontal",
			"layoutDescription": "default"
		},
		"main": {
			"layout": "horizontal",
			"layoutDescription": "left-fixed"
		},
		"mainContent": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"tabBar": { "layout": "horizontal" },
		"module1_cpuUsage": { "layout": "horizontal" },
		"module2_networkTrafficTrend": {
			"layout": "vertical",
			"style": "height-300px"
		},
		"module3_smallCharts": {
			"layout": "horizontal",
			"layoutDescription": "equal-width"
		},
		"rightPanel": {
			"layout": "vertical",
			"style": "固定宽度450px"
		},
		"summaryPanel": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"trafficRankingPanel": {
			"layout": "vertical",
			"containerType": "Region"
		},
		"dataBlock": {
			"layout": "vertical",
			"style": "rounded-bordered"
		},
		"trafficItem": {
			"layout": "horizontal",
			"layoutDescription": "justify-between"
		},
		"itemRight": { "layout": "horizontal" }
	}
};
//#endregion
export { data_default as default };
