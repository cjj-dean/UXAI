var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "header",
			"component": "header",
			"props": { "className": "shrink-0 bg-surface-container-highest shadow-sm flex flex-row justify-between items-center h-[48px] px-[1.5rem] z-[1] h-[3rem]" },
			"children": [
				"headLeftArea",
				"headCenterMenu",
				"headRightArea"
			]
		},
		{
			"id": "mainContent",
			"component": "div",
			"props": { "className": "flex-1 min-w-0 flex flex-col gap-[1rem]" },
			"children": ["macoPageTitleBar", "macoLeftRegion"]
		},
		{
			"id": "rightPanel",
			"component": "div",
			"props": { "className": "w-[450px] shrink-0 flex flex-col gap-[1rem]" },
			"children": ["ripaOverviewPanel", "ripaMultiLayerListPanel"]
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
			"children": ["header", "body"]
		},
		{
			"id": "headLeftArea",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem] shrink-0" },
			"children": ["headLogoIcon", "headLogoText"]
		},
		{
			"id": "headLogoIcon",
			"component": "Icon",
			"props": {
				"name": "box",
				"color": "primary",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "headLogoText",
			"component": "span",
			"props": {
				"className": "text-on-surface font-bold text-md",
				"value": "iMaster Pro"
			}
		},
		{
			"id": "headCenterMenu",
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
				],
				"className": "flex-1 flex justify-center min-w-0"
			}
		},
		{
			"id": "headRightArea",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem] shrink-0" },
			"children": ["headThemeIcon", "headUserIcon"]
		},
		{
			"id": "headThemeIcon",
			"component": "Icon",
			"props": {
				"name": "moon",
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
			"id": "macoPageTitleBar",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["macoPageTitleLeft", "macoPageTitleRight"]
		},
		{
			"id": "macoPageTitleLeft",
			"component": "span",
			"props": {
				"className": "text-xl font-bold text-on-surface",
				"value": "网络运行总览"
			}
		},
		{
			"id": "macoPageTitleRight",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-4" },
			"children": [
				"macoTimeSpan",
				"macoSettingIcon",
				"macoGridIcon",
				"macoTopologyIcon"
			]
		},
		{
			"id": "macoTimeSpan",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "系统时间: 2026-05-27 14:30:00"
			}
		},
		{
			"id": "macoSettingIcon",
			"component": "Icon",
			"props": {
				"name": "settings",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "macoGridIcon",
			"component": "Icon",
			"props": {
				"name": "grid",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "macoTopologyIcon",
			"component": "Icon",
			"props": {
				"name": "git-network",
				"color": "#777777",
				"shape": "outline",
				"className": "w-5 h-5"
			}
		},
		{
			"id": "macoLeftRegion",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 gap-[1rem] min-w-0" },
			"children": [
				"macoTabRow",
				"macoCpuUsageModule",
				"macoTrafficTrendModule",
				"macoMiniChartGroup"
			]
		},
		{
			"id": "macoTabRow",
			"component": "Tabs",
			"props": { "activeKey": { "path": "/activeTab" } },
			"children": {
				"path": "/tabItems",
				"componentId": "macoDynamicTabItem"
			}
		},
		{
			"id": "macoCpuUsageModule",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": ["macoCpuGauge", "macoStatsBlocks"]
		},
		{
			"id": "macoCpuGauge",
			"component": "div",
			"props": { "className": "w-[30%] shrink-0 flex flex-col gap-2" },
			"children": ["macoCpuGaugeTitle", "macoCpuGaugeChart"]
		},
		{
			"id": "macoCpuGaugeTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "CPU使用率"
			}
		},
		{
			"id": "macoCpuGaugeChart",
			"component": "PatGauge",
			"props": {
				"value": { "path": "/cpuUsage" },
				"max": { "path": "/cpuMax" }
			}
		},
		{
			"id": "macoStatsBlocks",
			"component": "div",
			"props": { "className": "w-[70%] flex flex-row gap-4 items-center" },
			"children": {
				"path": "/statItems",
				"componentId": "macoStatBlock"
			}
		},
		{
			"id": "macoTrafficTrendModule",
			"component": "div",
			"props": { "className": "flex flex-col gap-2" },
			"children": ["macoTrafficTrendHeader", "macoTrafficTrendChart"]
		},
		{
			"id": "macoTrafficTrendHeader",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center" },
			"children": ["macoTrafficTitle", "macoTrafficDropdown"]
		},
		{
			"id": "macoTrafficTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": "网络流量趋势"
			}
		},
		{
			"id": "macoTrafficDropdown",
			"component": "Dropdown",
			"props": { "menu": { "path": "/dropdownMenuItems" } },
			"children": ["macoDropdownTrigger"]
		},
		{
			"id": "macoDropdownTrigger",
			"component": "div",
			"props": {
				"className": "flex items-center gap-1 cursor-pointer",
				"value": "近30天"
			}
		},
		{
			"id": "macoTrafficTrendChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/trafficData" },
					"xAxis": { "data": "时间" },
					"yAxisTitle": "流量(Mbps)"
				},
				"className": "h-[300px]"
			}
		},
		{
			"id": "macoMiniChartGroup",
			"component": "div",
			"props": { "className": "flex flex-row gap-4 items-stretch" },
			"children": {
				"path": "/graphItems",
				"componentId": "macoMiniChart"
			}
		},
		{
			"id": "macoDynamicTabItem",
			"component": "TabItem",
			"props": {
				"key": { "path": "key" },
				"label": { "path": "label" },
				"content": { "componentId": "macoTabContent" }
			}
		},
		{
			"id": "macoTabContent",
			"component": "div",
			"props": { "className": "" }
		},
		{
			"id": "macoStatBlock",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-4 p-4 bg-surface-variant rounded-lg" },
			"children": ["macoStatIcon", "macoStatText"]
		},
		{
			"id": "macoStatIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"shape": "circle",
				"className": "w-16 h-16"
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
				"className": "text-4xl font-bold text-on-surface",
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
			"id": "macoMiniChart",
			"component": "LineChart",
			"props": {
				"option": { "path": "option" },
				"className": "h-40 h-[180px]"
			}
		},
		{
			"id": "ripaOverviewPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": [
				"ripaOverviewHeader",
				"ripaTotalNumber",
				"ripaStackedBarChart"
			]
		},
		{
			"id": "ripaOverviewHeader",
			"component": "div",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "设备在线数(6119) | 异常告警(766)"
			},
			"children": []
		},
		{
			"id": "ripaTotalNumber",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaTotalValue", "ripaTotalLabel"]
		},
		{
			"id": "ripaTotalValue",
			"component": "span",
			"props": {
				"className": "text-5xl font-bold text-on-surface",
				"value": "6415"
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
			"id": "ripaMultiLayerListPanel",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["ripaListPanelTabs", "ripaListDataContainer"]
		},
		{
			"id": "ripaListPanelTabs",
			"component": "div",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "区域流量排行(TOP 27)｜异常节点追踪(处理中28)"
			},
			"children": []
		},
		{
			"id": "ripaListDataContainer",
			"component": "div",
			"props": { "className": "rounded-xl border border-base bg-transparent flex flex-col p-[0.75rem]" },
			"children": {
				"path": "/listItems",
				"componentId": "ripaListItem"
			}
		},
		{
			"id": "ripaListItem",
			"component": "div",
			"props": { "className": "flex flex-row justify-between items-center px-4 py-3 border-b border-divider last:border-b-0" },
			"children": ["ripaLeftInfo", "ripaRightMetrics"]
		},
		{
			"id": "ripaLeftInfo",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": ["ripaLeftIcon", "ripaLeftTitle"]
		},
		{
			"id": "ripaLeftIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "icon" },
				"color": "#777777",
				"shape": "square",
				"className": "w-6 h-6"
			}
		},
		{
			"id": "ripaLeftTitle",
			"component": "span",
			"props": {
				"className": "text-md font-medium text-on-surface",
				"value": { "path": "title" }
			}
		},
		{
			"id": "ripaRightMetrics",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-2" },
			"children": [
				"ripaMetricGroup1",
				"ripaMetricDivider",
				"ripaMetricGroup2"
			]
		},
		{
			"id": "ripaMetricGroup1",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaMetric1Value", "ripaMetric1Label"]
		},
		{
			"id": "ripaMetric1Value",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": { "path": "metrics/0/value" }
			}
		},
		{
			"id": "ripaMetric1Label",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "metrics/0/label" }
			}
		},
		{
			"id": "ripaMetricDivider",
			"component": "Divider",
			"props": {
				"orientation": "vertical",
				"className": "mx-2 h-8"
			}
		},
		{
			"id": "ripaMetricGroup2",
			"component": "div",
			"props": { "className": "flex flex-col items-center" },
			"children": ["ripaMetric2Value", "ripaMetric2Label"]
		},
		{
			"id": "ripaMetric2Value",
			"component": "span",
			"props": {
				"className": "text-lg font-semibold text-on-surface",
				"value": { "path": "metrics/1/value" }
			}
		},
		{
			"id": "ripaMetric2Label",
			"component": "span",
			"props": {
				"className": "text-xs text-on-surface-variant",
				"value": { "path": "metrics/1/label" }
			}
		}
	],
	state: {
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
		"cpuMax": 100,
		"statItems": [{
			"icon": "check-circle",
			"value": "1574",
			"label": "运行中",
			"color": "success"
		}, {
			"icon": "alert-triangle",
			"value": "050",
			"label": "待检修",
			"color": "warning"
		}],
		"trafficData": [
			{
				"时间": "00:00",
				"流量": 120
			},
			{
				"时间": "04:00",
				"流量": 80
			},
			{
				"时间": "08:00",
				"流量": 200
			},
			{
				"时间": "12:00",
				"流量": 350
			},
			{
				"时间": "16:00",
				"流量": 280
			},
			{
				"时间": "20:00",
				"流量": 190
			},
			{
				"时间": "24:00",
				"流量": 100
			}
		],
		"dropdownMenuItems": [
			{
				"label": "近30天",
				"key": "30d"
			},
			{
				"label": "近7天",
				"key": "7d"
			},
			{
				"label": "今天",
				"key": "today"
			}
		],
		"graphItems": [
			{ "option": {
				"data": [{
					"时间": "W1",
					"核心集群": 82,
					"高频区": 8,
					"闲置区": 10
				}, {
					"时间": "W2",
					"核心集群": 84,
					"高频区": 9,
					"闲置区": 7
				}],
				"xAxis": { "data": "时间" },
				"yAxisTitle": "百分比(%)",
				"stack": true,
				"color": [
					"#0067D1",
					"#09AA71",
					"#FCC800"
				]
			} },
			{ "option": {
				"data": [{
					"时间": "W1",
					"固态存储": 55,
					"机械硬盘": 12,
					"备份区": 33
				}, {
					"时间": "W2",
					"固态存储": 58,
					"机械硬盘": 14,
					"备份区": 28
				}],
				"xAxis": { "data": "时间" },
				"yAxisTitle": "百分比(%)",
				"stack": true,
				"color": [
					"#0067D1",
					"#09AA71",
					"#FCC800"
				]
			} },
			{ "option": {
				"data": [{
					"时间": "W1",
					"下行流量": 60,
					"上行流量": 10,
					"广播包": 30
				}, {
					"时间": "W2",
					"下行流量": 63,
					"上行流量": 12,
					"广播包": 25
				}],
				"xAxis": { "data": "时间" },
				"yAxisTitle": "百分比(%)",
				"stack": true,
				"color": [
					"#0067D1",
					"#09AA71",
					"#FCC800"
				]
			} }
		],
		"healthStatus": {
			"normal": 5345,
			"warning": 612,
			"danger": 340,
			"error": 118
		},
		"listItems": [
			{
				"title": "主控服务器",
				"icon": "server",
				"color": "primary",
				"metrics": [{
					"label": "当前连接",
					"value": "296"
				}, {
					"label": "总吞吐量",
					"value": "9902"
				}]
			},
			{
				"title": "备用控制节点",
				"icon": "cpu",
				"color": "success",
				"metrics": [{
					"label": "活跃会话",
					"value": "68"
				}, {
					"label": "写入数据",
					"value": "7613"
				}]
			},
			{
				"title": "安全网关",
				"icon": "shield",
				"color": "warning",
				"metrics": [{
					"label": "拦截次数",
					"value": "88"
				}, {
					"label": "并发数",
					"value": "3579"
				}]
			},
			{
				"title": "负载均衡器",
				"icon": "scale",
				"color": "critical",
				"metrics": [{
					"label": "异常转发",
					"value": "8"
				}, {
					"label": "总分配量",
					"value": "9498"
				}]
			},
			{
				"title": "专线接入集群",
				"icon": "network",
				"color": "info",
				"metrics": [{
					"label": "并发请求",
					"value": "57"
				}, {
					"label": "数据包量",
					"value": "2560"
				}]
			},
			{
				"title": "公网接入集群",
				"icon": "radio",
				"color": "error",
				"metrics": [{
					"label": "当前带宽",
					"value": "99"
				}, {
					"label": "丢包率",
					"value": "0347"
				}]
			},
			{
				"title": "主数据库",
				"icon": "database",
				"color": "primary",
				"metrics": [{
					"label": "查询延迟",
					"value": "3"
				}, {
					"label": "IOPS",
					"value": "5877"
				}]
			}
		]
	}
};
//#endregion
export { data_default as default };
