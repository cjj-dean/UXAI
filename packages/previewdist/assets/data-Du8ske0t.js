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
			"children": ["inbaLeftTitle", "inbaRightArea"]
		},
		{
			"id": "mainContent",
			"component": "Card",
			"props": { "className": "flex-1 min-w-0 flex flex-col gap-[1rem] overflow-y-auto" },
			"children": [
				"maco_tabBar",
				"maco_firstModule",
				"maco_secondModule",
				"maco_thirdModule"
			]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "w-[450px] shrink-0 flex flex-col gap-[1rem] overflow-hidden bg-surface-container-highest shadow-sm p-[1.5rem]" },
			"children": ["ripaOverviewPanel", "ripaMultiLevelPanel"]
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
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": ["headIcon", "headTitle"]
		},
		{
			"id": "headIcon",
			"component": "Icon",
			"props": {
				"name": "sparkle",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "headTitle",
			"component": "span",
			"props": {
				"className": "text-md font-bold text-on-surface",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headCenter",
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
						"key": "nodes"
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
						"key": "external"
					},
					{
						"title": "规则配置",
						"key": "rules"
					},
					{
						"title": "日志分析",
						"key": "logs"
					}
				]
			}
		},
		{
			"id": "headRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-4" },
			"children": ["headThemeIcon", "headUserIcon"]
		},
		{
			"id": "headThemeIcon",
			"component": "Icon",
			"props": {
				"name": "sun",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "headUserIcon",
			"component": "Icon",
			"props": {
				"name": "user",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
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
			"id": "inbaRightArea",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"inbaSystemTime",
				"inbaSettingIcon",
				"inbaGridViewIcon",
				"inbaTopologyIcon"
			]
		},
		{
			"id": "inbaSystemTime",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant mr-[0.5rem]",
				"value": "系统时间: 2026-05-27 14:30:00"
			}
		},
		{
			"id": "inbaSettingIcon",
			"component": "Icon",
			"props": {
				"name": "settings",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5 cursor-pointer"
			}
		},
		{
			"id": "inbaGridViewIcon",
			"component": "Icon",
			"props": {
				"name": "grid-3x3",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5 cursor-pointer"
			}
		},
		{
			"id": "inbaTopologyIcon",
			"component": "Icon",
			"props": {
				"name": "network",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5 cursor-pointer"
			}
		},
		{
			"id": "maco_tabBar",
			"component": "Tabs",
			"props": {
				"activeKey": { "path": "/activeTab" },
				"types": "line",
				"size": "medium",
				"className": "shrink-0"
			},
			"children": {
				"path": "/tabItems",
				"componentId": "maco_tabItemTemplate"
			}
		},
		{
			"id": "maco_tabItemTemplate",
			"component": "TabItem",
			"props": {
				"key": { "path": "key" },
				"label": { "path": "label" },
				"content": { "path": "content" }
			}
		},
		{
			"id": "maco_firstModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-stretch shrink-0" },
			"children": ["maco_cpuGauge", "maco_cpuStatBlocks"]
		},
		{
			"id": "maco_cpuGauge",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] w-[30%] shrink-0" },
			"children": ["maco_cpuGaugeTitle", "maco_cpuGaugeChart"]
		},
		{
			"id": "maco_cpuGaugeTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "CPU使用率"
			}
		},
		{
			"id": "maco_cpuGaugeChart",
			"component": "PatGauge",
			"props": {
				"value": { "path": "/gaugeValue" },
				"max": 100
			}
		},
		{
			"id": "maco_cpuStatBlocks",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-center w-[70%]" },
			"children": {
				"path": "/cpuStatItems",
				"componentId": "maco_cpuStatItemTemplate"
			}
		},
		{
			"id": "maco_cpuStatItemTemplate",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem] p-[1.5rem] bg-surface-container-highest shadow-sm rounded-xl" },
			"children": ["maco_cpuStatIcon", "maco_cpuStatText"]
		},
		{
			"id": "maco_cpuStatIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"shape": "circle",
				"className": "w-12 h-12"
			}
		},
		{
			"id": "maco_cpuStatText",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.25rem]" },
			"children": ["maco_cpuStatValue", "maco_cpuStatLabel"]
		},
		{
			"id": "maco_cpuStatValue",
			"component": "span",
			"props": {
				"className": "text-3xl font-bold text-on-surface",
				"value": { "path": "value" }
			}
		},
		{
			"id": "maco_cpuStatLabel",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": { "path": "label" }
			}
		},
		{
			"id": "maco_secondModule",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] shrink-0" },
			"children": ["maco_trafficHeader", "maco_trafficChart"]
		},
		{
			"id": "maco_trafficHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["maco_trafficTitle", "maco_trafficSelect"]
		},
		{
			"id": "maco_trafficTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "maco_trafficSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/trafficPeriod" },
				"options": [
					{
						"label": "近30天",
						"value": "近30天"
					},
					{
						"label": "近7天",
						"value": "近7天"
					},
					{
						"label": "近24小时",
						"value": "近24小时"
					}
				],
				"size": "small",
				"className": "shrink-0 w-auto"
			}
		},
		{
			"id": "maco_trafficChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/trafficData" },
					"xAxis": { "data": "date" },
					"yAxisTitle": "流量(Mbps)"
				},
				"className": "h-[300px]"
			}
		},
		{
			"id": "maco_thirdModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] shrink-0" },
			"children": [
				"maco_computePoolCard",
				"maco_storageTrendCard",
				"maco_networkIOCard"
			]
		},
		{
			"id": "maco_computePoolCard",
			"component": "Card",
			"props": {
				"title": "计算资源池监控",
				"className": "flex flex-col gap-[0.75rem] w-1/3 min-w-0 flex-1"
			},
			"children": ["maco_computePoolChart"]
		},
		{
			"id": "maco_computePoolChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/computePoolData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "使用率(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "maco_storageTrendCard",
			"component": "Card",
			"props": {
				"title": "存储容量使用趋势",
				"className": "flex flex-col gap-[0.75rem] w-1/3 min-w-0"
			},
			"children": ["maco_storageTrendChart"]
		},
		{
			"id": "maco_storageTrendChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/storageData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "使用率(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "maco_networkIOCard",
			"component": "Card",
			"props": {
				"title": "网络IO流量监控",
				"className": "flex flex-col gap-[0.75rem] w-1/3 min-w-0 flex-1 justify-end"
			},
			"children": ["maco_networkIOChart"]
		},
		{
			"id": "maco_networkIOChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/networkData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "使用率(%)",
					"stack": true
				},
				"className": "h-[200px]"
			}
		},
		{
			"id": "ripaOverviewPanel",
			"component": "Card",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"ripaOverviewHeader",
				"ripaTotalCount",
				"ripaStackedBarChart"
			]
		},
		{
			"id": "ripaOverviewHeader",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "设备在线数(6119) | 异常告警(766)"
			}
		},
		{
			"id": "ripaTotalCount",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaTotalCountNumber", "ripaTotalCountLabel"]
		},
		{
			"id": "ripaTotalCountNumber",
			"component": "span",
			"props": {
				"className": "text-4xl font-bold text-primary",
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
			"id": "ripaStackedBarChart",
			"component": "PatStackedBar",
			"props": {
				"normal": { "path": "/healthStatus/normal" },
				"warning": { "path": "/healthStatus/warning" },
				"danger": { "path": "/healthStatus/danger" },
				"error": { "path": "/healthStatus/error" }
			}
		},
		{
			"id": "ripaMultiLevelPanel",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem] flex-1 overflow-hidden min-w-0" },
			"children": ["ripaMultiLevelHeader", "ripaDataList"]
		},
		{
			"id": "ripaMultiLevelHeader",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "区域流量排行(TOP 27)｜异常节点追踪(处理中28)"
			}
		},
		{
			"id": "ripaDataList",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem]" },
			"children": {
				"path": "/dataListItems",
				"componentId": "ripaDataItem"
			}
		},
		{
			"id": "ripaDataItem",
			"component": "div",
			"props": { "className": "border border-divider rounded-lg bg-transparent flex flex-col p-[0.75rem]" },
			"children": ["ripaDataRow", "ripaItemDivider"]
		},
		{
			"id": "ripaDataRow",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["ripaLeftInfo", "ripaRightMetrics"]
		},
		{
			"id": "ripaLeftInfo",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["ripaItemIcon", "ripaItemTitle"]
		},
		{
			"id": "ripaItemIcon",
			"component": "Icon",
			"props": {
				"name": "box",
				"shape": "square",
				"color": "#777777",
				"className": "w-8 h-8"
			}
		},
		{
			"id": "ripaItemTitle",
			"component": "span",
			"props": {
				"className": "text-sm font-medium text-on-surface",
				"value": { "path": "title" }
			}
		},
		{
			"id": "ripaRightMetrics",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.25rem]" },
			"children": [
				"ripaMetricGroup1",
				"ripaMetricsDivider",
				"ripaMetricGroup2"
			]
		},
		{
			"id": "ripaMetricGroup1",
			"component": "div",
			"props": { "className": "flex flex-col items-end" },
			"children": ["ripaMetricValue1", "ripaMetricLabel1"]
		},
		{
			"id": "ripaMetricValue1",
			"component": "span",
			"props": {
				"className": "text-base font-semibold text-on-surface",
				"value": { "path": "value1" }
			}
		},
		{
			"id": "ripaMetricLabel1",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "label1" }
			}
		},
		{
			"id": "ripaMetricsDivider",
			"component": "Divider",
			"props": {
				"orientation": "vertical",
				"className": "h-8 mx-1"
			}
		},
		{
			"id": "ripaMetricGroup2",
			"component": "div",
			"props": { "className": "flex flex-col items-end" },
			"children": ["ripaMetricValue2", "ripaMetricLabel2"]
		},
		{
			"id": "ripaMetricValue2",
			"component": "span",
			"props": {
				"className": "text-base font-semibold text-on-surface",
				"value": { "path": "value2" }
			}
		},
		{
			"id": "ripaMetricLabel2",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "label2" }
			}
		},
		{
			"id": "ripaItemDivider",
			"component": "Divider",
			"props": {
				"orientation": "horizontal",
				"className": "m-0"
			}
		}
	],
	state: {
		"activeTab": "core",
		"tabItems": [
			{
				"key": "core",
				"label": "核心路由",
				"content": "核心路由管理面板"
			},
			{
				"key": "edge",
				"label": "边缘网关",
				"content": "边缘网关管理面板"
			},
			{
				"key": "access",
				"label": "接入层",
				"content": "接入层管理面板"
			}
		],
		"gaugeValue": 72,
		"cpuStatItems": [{
			"value": "1574",
			"label": "运行中",
			"icon": "check-circle",
			"color": "success"
		}, {
			"value": "050",
			"label": "待检修",
			"icon": "alert-triangle",
			"color": "critical"
		}],
		"trafficData": [
			{
				"date": "04/01",
				"traffic": 120
			},
			{
				"date": "04/02",
				"traffic": 200
			},
			{
				"date": "04/03",
				"traffic": 150
			},
			{
				"date": "04/04",
				"traffic": 80
			},
			{
				"date": "04/05",
				"traffic": 70
			},
			{
				"date": "04/06",
				"traffic": 110
			},
			{
				"date": "04/07",
				"traffic": 130
			}
		],
		"trafficPeriod": "近30天",
		"computePoolData": [
			{
				"time": "04/01",
				"核心集群": 85,
				"高频区": 7,
				"闲置区": 15
			},
			{
				"time": "04/02",
				"核心集群": 78,
				"高频区": 12,
				"闲置区": 10
			},
			{
				"time": "04/03",
				"核心集群": 92,
				"高频区": 8,
				"闲置区": 5
			},
			{
				"time": "04/04",
				"核心集群": 88,
				"高频区": 6,
				"闲置区": 8
			}
		],
		"storageData": [
			{
				"time": "04/01",
				"固态存储": 58,
				"机械硬盘": 14,
				"备份区": 28
			},
			{
				"time": "04/02",
				"固态存储": 62,
				"机械硬盘": 10,
				"备份区": 26
			},
			{
				"time": "04/03",
				"固态存储": 55,
				"机械硬盘": 12,
				"备份区": 30
			},
			{
				"time": "04/04",
				"固态存储": 60,
				"机械硬盘": 8,
				"备份区": 32
			}
		],
		"networkData": [
			{
				"time": "04/01",
				"下行流量": 65,
				"上行流量": 11,
				"广播包": 24
			},
			{
				"time": "04/02",
				"下行流量": 70,
				"上行流量": 9,
				"广播包": 21
			},
			{
				"time": "04/03",
				"下行流量": 58,
				"上行流量": 14,
				"广播包": 25
			},
			{
				"time": "04/04",
				"下行流量": 63,
				"上行流量": 12,
				"广播包": 22
			}
		],
		"healthStatus": {
			"normal": 6119,
			"warning": 296,
			"danger": 266,
			"error": 100
		},
		"dataListItems": [
			{
				"color": "primary",
				"title": "主控服务器",
				"value1": "296",
				"label1": "当前连接",
				"value2": "9902",
				"label2": "总吞吐量"
			},
			{
				"color": "success",
				"title": "备用控制节点",
				"value1": "68",
				"label1": "活跃会话",
				"value2": "7613",
				"label2": "写入数据"
			},
			{
				"color": "warning",
				"title": "安全网关",
				"value1": "88",
				"label1": "拦截次数",
				"value2": "3579",
				"label2": "并发数"
			},
			{
				"color": "error",
				"title": "负载均衡器",
				"value1": "8",
				"label1": "异常转发",
				"value2": "9498",
				"label2": "总分配量"
			},
			{
				"color": "info",
				"title": "专线接入集群",
				"value1": "57",
				"label1": "并发请求",
				"value2": "2560",
				"label2": "数据包量"
			},
			{
				"color": "critical",
				"title": "公网接入集群",
				"value1": "99",
				"label1": "当前带宽",
				"value2": "0347",
				"label2": "丢包率"
			},
			{
				"color": "primary",
				"title": "主数据库",
				"value1": "3",
				"label1": "查询延迟",
				"value2": "5877",
				"label2": "IOPS"
			}
		]
	}
};
//#endregion
export { data_default as default };
