var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLogoBlock",
				"headNavMenu",
				"headRightBlock"
			]
		},
		{
			"id": "infoBar",
			"component": "div",
			"props": { "className": "shrink-0 bg-surface-container-highest flex flex-row justify-between items-center px-[1.5rem] py-[0.5rem]" },
			"children": ["inbaLeftTitle", "inbaRightArea"]
		},
		{
			"id": "leftPanel",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 min-w-0 gap-[1rem]" },
			"children": [
				"lepaTabRow",
				"lepaModule1",
				"lepaModule2",
				"lepaModule3"
			],
			"annotations": ["独立区块"]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "flex flex-col w-[450px] shrink-0 gap-[1rem]" },
			"children": ["ripaOverviewPanel", "ripaTrafficRankingPanel"],
			"annotations": ["固定宽度450px"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] gap-[1rem] min-w-0 flex flex-row" },
			"children": ["leftPanel", "rightPanel"]
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
			"id": "headLogoBlock",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["headLogoIcon", "headLogoTxt"]
		},
		{
			"id": "headLogoIcon",
			"component": "Icon",
			"props": {
				"name": "monitor",
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headLogoTxt",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headNavMenu",
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
				]
			}
		},
		{
			"id": "headRightBlock",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["headThemeBtn", "headUserBtn"]
		},
		{
			"id": "headThemeBtn",
			"component": "Icon",
			"props": {
				"name": "sun",
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headUserBtn",
			"component": "Icon",
			"props": {
				"name": "user",
				"color": "#777777",
				"className": "w-5 h-5",
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
			"id": "inbaRightArea",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-inline" },
			"children": [
				"inbaTimeText",
				"inbaSettingIcon",
				"inbaGridIcon",
				"inbaTopoIcon"
			]
		},
		{
			"id": "inbaTimeText",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "系统时间: 2026-05-27 14:30:00"
			}
		},
		{
			"id": "inbaSettingIcon",
			"component": "Icon",
			"props": {
				"name": "setting",
				"className": "cursor-pointer w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "inbaGridIcon",
			"component": "Icon",
			"props": {
				"name": "grid",
				"className": "cursor-pointer w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "inbaTopoIcon",
			"component": "Icon",
			"props": {
				"name": "topology",
				"className": "cursor-pointer w-4 h-4",
				"color": "#777777",
				"shape": "outline"
			}
		},
		{
			"id": "lepaTabRow",
			"component": "Tabs",
			"props": { "activeKey": { "path": "/activeTab" } },
			"children": {
				"path": "/tabs",
				"componentId": "lepaTabItemTemplate"
			}
		},
		{
			"id": "lepaTabItemTemplate",
			"component": "TabItem",
			"props": {
				"key": { "path": "key" },
				"label": { "path": "label" },
				"content": { "componentId": "lepaTabContent" }
			}
		},
		{
			"id": "lepaTabContent",
			"component": "div",
			"props": {
				"className": "",
				"value": ""
			}
		},
		{
			"id": "lepaModule1",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": ["lepaCpuUsageGauge"]
		},
		{
			"id": "lepaCpuUsageGauge",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-center" },
			"children": [
				"lepaCpuTitle",
				"lepaPatGauge",
				"lepaStatBlocks"
			]
		},
		{
			"id": "lepaCpuTitle",
			"component": "span",
			"props": {
				"className": "text-base font-semibold text-on-surface flex-1",
				"value": "CPU使用率"
			}
		},
		{
			"id": "lepaPatGauge",
			"component": "PatGauge",
			"props": {
				"className": "w-[30%] shrink-0",
				"value": { "path": "/cpuValue" },
				"max": { "path": "/cpuMax" }
			}
		},
		{
			"id": "lepaStatBlocks",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] w-[70%] shrink-0 items-center flex-1 justify-end" },
			"children": {
				"path": "/stats",
				"componentId": "lepaStatBlockTemplate"
			}
		},
		{
			"id": "lepaStatBlockTemplate",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": ["lepaStatIcon", "lepaStatText"]
		},
		{
			"id": "lepaStatIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"shape": "square",
				"className": "w-12 h-12",
				"color": "primary"
			}
		},
		{
			"id": "lepaStatText",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.25rem]" },
			"children": ["lepaStatValue", "lepaStatLabel"]
		},
		{
			"id": "lepaStatValue",
			"component": "span",
			"props": {
				"className": "text-2xl font-bold text-on-surface",
				"value": { "path": "value" }
			}
		},
		{
			"id": "lepaStatLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": { "path": "label" }
			}
		},
		{
			"id": "lepaModule2",
			"component": "div",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["lepaTrafficTitleRow", "lepaTrafficLineChart"]
		},
		{
			"id": "lepaTrafficTitleRow",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["lepaTrafficTitle", "lepaTrafficDropdown"]
		},
		{
			"id": "lepaTrafficTitle",
			"component": "span",
			"props": {
				"className": "text-base font-semibold text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "lepaTrafficDropdown",
			"component": "Select",
			"props": {
				"value": { "path": "/trafficPeriod" },
				"options": { "path": "/periodOptions" },
				"className": "w-32"
			}
		},
		{
			"id": "lepaTrafficLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/trafficData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "流量(Mbps)"
				},
				"className": "h-[300px]"
			}
		},
		{
			"id": "lepaModule3",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": [
				"lepaComputePoolChart",
				"lepaStorageTrendChart",
				"lepaNetworkIOTrafficChart"
			]
		},
		{
			"id": "lepaComputePoolChart",
			"component": "Card",
			"props": {
				"title": "计算资源池监控",
				"className": "flex-1 min-w-0 gap-[1rem]"
			},
			"children": ["lepaComputePoolLineChart"]
		},
		{
			"id": "lepaComputePoolLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/computePoolData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[180px] w-full"
			}
		},
		{
			"id": "lepaStorageTrendChart",
			"component": "Card",
			"props": {
				"title": "存储容量使用趋势",
				"className": "flex-1 min-w-0 gap-[1rem]"
			},
			"children": ["lepaStorageTrendLineChart"]
		},
		{
			"id": "lepaStorageTrendLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/storageTrendData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[180px] w-full"
			}
		},
		{
			"id": "lepaNetworkIOTrafficChart",
			"component": "Card",
			"props": {
				"title": "网络IO流量监控",
				"className": "flex-1 min-w-0 gap-[1rem]"
			},
			"children": ["lepaNetworkIOLineChart"]
		},
		{
			"id": "lepaNetworkIOLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/networkIOData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "百分比(%)",
					"stack": true
				},
				"className": "h-[180px] w-full"
			}
		},
		{
			"id": "ripaOverviewPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"ripaOverviewTitle",
				"ripaOverviewTotal",
				"ripaOverviewStackedBar"
			]
		},
		{
			"id": "ripaOverviewTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "设备在线数(6119) | 异常告警(766)"
			}
		},
		{
			"id": "ripaOverviewTotal",
			"component": "div",
			"props": { "className": "flex flex-col items-center gap-[0.25rem]" },
			"children": ["ripaTotalNumber", "ripaTotalLabel"]
		},
		{
			"id": "ripaTotalNumber",
			"component": "span",
			"props": {
				"className": "text-4xl font-bold text-primary",
				"value": { "path": "/totalCount" }
			}
		},
		{
			"id": "ripaTotalLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "总数"
			}
		},
		{
			"id": "ripaOverviewStackedBar",
			"component": "PatStackedBar",
			"props": {
				"normal": { "path": "/stackStats/normal" },
				"warning": { "path": "/stackStats/warning" },
				"danger": { "path": "/stackStats/danger" },
				"error": { "path": "/stackStats/error" },
				"className": ""
			}
		},
		{
			"id": "ripaTrafficRankingPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["ripaPanelTitle", "ripaTrafficList"]
		},
		{
			"id": "ripaPanelTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "区域流量排行(TOP 27)｜异常节点追踪(处理中28)"
			}
		},
		{
			"id": "ripaTrafficList",
			"component": "div",
			"props": { "className": "flex flex-col border border-base rounded-xl overflow-hidden p-[0.75rem]" },
			"children": {
				"path": "/trafficItems",
				"componentId": "ripaTrafficItemTemplate"
			}
		},
		{
			"id": "ripaTrafficItemTemplate",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center px-[1rem] py-[0.75rem] border-b border-divider" },
			"children": ["ripaTrafficLeft", "ripaTrafficRight"]
		},
		{
			"id": "ripaTrafficLeft",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.75rem]" },
			"children": ["ripaTrafficItemIcon", "ripaTrafficItemName"]
		},
		{
			"id": "ripaTrafficItemIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"shape": "square",
				"className": "w-10 h-10"
			}
		},
		{
			"id": "ripaTrafficItemName",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface",
				"value": { "path": "name" }
			}
		},
		{
			"id": "ripaTrafficRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": [
				"ripaTrafficMetricA",
				"ripaTrafficDividerLine",
				"ripaTrafficMetricB"
			]
		},
		{
			"id": "ripaTrafficMetricA",
			"component": "div",
			"props": { "className": "flex flex-col items-center gap-[0.125rem] flex-1" },
			"children": ["ripaTrafficValA", "ripaTrafficLabelA"]
		},
		{
			"id": "ripaTrafficValA",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "value1" }
			}
		},
		{
			"id": "ripaTrafficLabelA",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "label1" }
			}
		},
		{
			"id": "ripaTrafficDividerLine",
			"component": "div",
			"props": { "className": "w-[1px] h-8 bg-divider shrink-0" }
		},
		{
			"id": "ripaTrafficMetricB",
			"component": "div",
			"props": { "className": "flex flex-col items-center gap-[0.125rem] flex-1 justify-end" },
			"children": ["ripaTrafficValB", "ripaTrafficLabelB"]
		},
		{
			"id": "ripaTrafficValB",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "value2" }
			}
		},
		{
			"id": "ripaTrafficLabelB",
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
		"tabs": [
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
		"cpuValue": 72,
		"cpuMax": 100,
		"stats": [{
			"icon": "circle-check",
			"value": "1574",
			"label": "运行中"
		}, {
			"icon": "wrench",
			"value": "050",
			"label": "待检修"
		}],
		"trafficPeriod": "近30天",
		"periodOptions": [
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
		"trafficData": [
			{
				"time": "03-01",
				"流量": 120
			},
			{
				"time": "03-02",
				"流量": 135
			},
			{
				"time": "03-03",
				"流量": 110
			},
			{
				"time": "03-04",
				"流量": 145
			}
		],
		"computePoolData": [
			{
				"time": "03-01",
				"核心集群": 84,
				"高频区": 6,
				"闲置区": 10
			},
			{
				"time": "03-02",
				"核心集群": 82,
				"高频区": 9,
				"闲置区": 9
			},
			{
				"time": "03-03",
				"核心集群": 80,
				"高频区": 8,
				"闲置区": 12
			}
		],
		"storageTrendData": [
			{
				"time": "03-01",
				"固态存储": 58,
				"机械硬盘": 14,
				"备份区": 28
			},
			{
				"time": "03-02",
				"固态存储": 60,
				"机械硬盘": 12,
				"备份区": 28
			},
			{
				"time": "03-03",
				"固态存储": 55,
				"机械硬盘": 15,
				"备份区": 30
			}
		],
		"networkIOData": [
			{
				"time": "03-01",
				"下行流量": 63,
				"上行流量": 12,
				"广播包": 25
			},
			{
				"time": "03-02",
				"下行流量": 65,
				"上行流量": 11,
				"广播包": 24
			},
			{
				"time": "03-03",
				"下行流量": 60,
				"上行流量": 14,
				"广播包": 26
			}
		],
		"onlineCount": 6119,
		"alarmCount": 766,
		"totalCount": 6415,
		"stackStats": {
			"normal": 5500,
			"warning": 500,
			"danger": 300,
			"error": 115
		},
		"trafficItems": [
			{
				"id": "server1",
				"name": "主控服务器",
				"icon": "server",
				"color": "primary",
				"value1": "296",
				"label1": "当前连接",
				"value2": "9902",
				"label2": "总吞吐量"
			},
			{
				"id": "server2",
				"name": "备用控制节点",
				"icon": "server",
				"color": "warning",
				"value1": "68",
				"label1": "活跃会话",
				"value2": "7613",
				"label2": "写入数据"
			},
			{
				"id": "gateway",
				"name": "安全网关",
				"icon": "shield",
				"color": "success",
				"value1": "88",
				"label1": "拦截次数",
				"value2": "3579",
				"label2": "并发数"
			},
			{
				"id": "balancer",
				"name": "负载均衡器",
				"icon": "gauge",
				"color": "critical",
				"value1": "8",
				"label1": "异常转发",
				"value2": "9498",
				"label2": "总分配量"
			},
			{
				"id": "dedicated",
				"name": "专线接入集群",
				"icon": "cable",
				"color": "info",
				"value1": "57",
				"label1": "并发请求",
				"value2": "2560",
				"label2": "数据包量"
			},
			{
				"id": "public",
				"name": "公网接入集群",
				"icon": "globe",
				"color": "error",
				"value1": "99",
				"label1": "当前带宽",
				"value2": "0347",
				"label2": "丢包率"
			},
			{
				"id": "db",
				"name": "主数据库",
				"icon": "database",
				"color": "primary",
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
