var data_default = {
	rootId: "root",
	elements: [
		{
			"id": "root",
			"component": "div",
			"props": { "className": "flex flex-col h-screen overflow-hidden bg-surface-container-lowest overflow-x-hidden" },
			"children": [
				"header",
				"body",
				"dialog"
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
			"props": { "className": "flex flex-row flex-1 overflow-hidden" },
			"children": ["main"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] flex flex-col gap-[1rem] min-w-0" },
			"children": ["mainContent"]
		},
		{
			"id": "mainContent",
			"component": "div",
			"props": { "className": "flex flex-col flex-1 gap-[1rem] min-w-0" },
			"children": [
				"mainTitleArea",
				"mainSearchRow",
				"mainTable"
			]
		},
		{
			"id": "dialog",
			"component": "Dialog",
			"props": {
				"title": "",
				"width": "50%",
				"className": "z-[99] p-[1.5rem] flex flex-col gap-[1rem] bg-surface-container-highest shadow-sm"
			},
			"children": ["dialogContent"]
		},
		{
			"id": "dialogContent",
			"component": "div",
			"props": { "className": "flex flex-col gap-[1rem]" },
			"children": ["dialogTitleRow", "dialogTabsSection"]
		},
		{
			"id": "headerLeftGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerCollapseBtn",
				"headerPlatformName",
				"headerHealthDashboardLink",
				"headerLargeScreenLink"
			]
		},
		{
			"id": "headerCollapseBtn",
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
				"value": { "path": "/platformName" },
				"className": "text-md font-semibold text-on-surface"
			}
		},
		{
			"id": "headerHealthDashboardLink",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[4px] cursor-pointer" },
			"children": ["headerHealthDashboardIcon", "headerHealthDashboardText"]
		},
		{
			"id": "headerHealthDashboardIcon",
			"component": "Icon",
			"props": {
				"name": "activity",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headerHealthDashboardText",
			"component": "span",
			"props": {
				"value": "健康看板",
				"className": "text-md text-on-surface-variant"
			}
		},
		{
			"id": "headerLargeScreenLink",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[4px] cursor-pointer" },
			"children": ["headerLargeScreenIcon", "headerLargeScreenText"]
		},
		{
			"id": "headerLargeScreenIcon",
			"component": "Icon",
			"props": {
				"name": "monitor",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headerLargeScreenText",
			"component": "span",
			"props": {
				"value": "大屏",
				"className": "text-md text-on-surface-variant"
			}
		},
		{
			"id": "headerRightGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerStrategyCenter",
				"headerSysAlert",
				"headerSysSetting",
				"headerSysHelp",
				"headerSysFullscreen",
				"headerUserAvatar",
				"headerUserName"
			]
		},
		{
			"id": "headerStrategyCenter",
			"component": "span",
			"props": {
				"value": "策略中心",
				"className": "text-md text-on-surface-variant cursor-pointer"
			}
		},
		{
			"id": "headerSysAlert",
			"component": "Icon",
			"props": {
				"name": "bell",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerSysSetting",
			"component": "Icon",
			"props": {
				"name": "settings",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerSysHelp",
			"component": "Icon",
			"props": {
				"name": "circle-help",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerSysFullscreen",
			"component": "Icon",
			"props": {
				"name": "maximize",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "headerUserAvatar",
			"component": "img",
			"props": {
				"src": { "path": "/userInfo/avatarImage" },
				"alt": "User avatar",
				"className": "w-7 h-7 object-cover rounded-[8px]"
			}
		},
		{
			"id": "headerUserName",
			"component": "span",
			"props": {
				"value": { "path": "/userInfo/username" },
				"className": "text-md text-on-surface-variant"
			}
		},
		{
			"id": "mainTitleArea",
			"component": "div",
			"props": { "className": "flex items-center" },
			"children": ["mainTitle"]
		},
		{
			"id": "mainTitle",
			"component": "h2",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "/cardTitle" }
			}
		},
		{
			"id": "mainSearchRow",
			"component": "div",
			"props": { "className": "flex flex-row gap-[0.75rem] items-center" },
			"children": ["mainSearchSelect", "mainSearchInput"]
		},
		{
			"id": "mainSearchSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/selectedValue" },
				"placeholder": "请选择",
				"options": [
					{
						"label": "全部链路",
						"value": "all"
					},
					{
						"label": "有告警",
						"value": "alarm"
					},
					{
						"label": "正常",
						"value": "normal"
					}
				],
				"className": "w-44"
			}
		},
		{
			"id": "mainSearchInput",
			"component": "Input",
			"props": {
				"value": { "path": "/searchValue" },
				"placeholder": "请输入搜索内容",
				"prefix": "search",
				"className": "w-72"
			}
		},
		{
			"id": "mainTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/tableData" },
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedKeys" }
				},
				"pagination": true,
				"columns": [
					{
						"title": "对端端口crc(近一天)",
						"dataIndex": "peerPortCrc",
						"minWidth": 165
					},
					{
						"title": "本端光模块告警(近一天)",
						"dataIndex": "localModuleAlarm",
						"minWidth": 186
					},
					{
						"title": "对端告警(近一天)",
						"dataIndex": "peerAlarm",
						"minWidth": 162
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
						"minWidth": 360
					},
					{
						"title": "接收功率(本端)",
						"dataIndex": "rxPowerLocal",
						"minWidth": 360
					},
					{
						"title": "电流(本端)",
						"dataIndex": "currentLocal",
						"minWidth": 360
					},
					{
						"title": "信噪比(本端)",
						"dataIndex": "snrLocal",
						"minWidth": 360
					},
					{
						"title": "误码率(本端)",
						"dataIndex": "berLocal",
						"minWidth": 116
					},
					{
						"title": "发送功率(对端)",
						"dataIndex": "txPowerPeer",
						"minWidth": 360
					},
					{
						"title": "操作",
						"dataIndex": "operations",
						"minWidth": 88
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
				"mainCellPeerPortCrc",
				"mainCellLocalModuleAlarm",
				"mainCellPeerAlarm",
				"mainCellTemperature",
				"mainCellVoltage",
				"mainCellTxPowerLocal",
				"mainCellRxPowerLocal",
				"mainCellCurrentLocal",
				"mainCellSnrLocal",
				"mainCellBerLocal",
				"mainCellTxPowerPeer",
				"mainCellOperations"
			],
			"props": {}
		},
		{
			"id": "mainCellPeerPortCrc",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "peerPortCrc" }
			}
		},
		{
			"id": "mainCellLocalModuleAlarm",
			"component": "Tag",
			"props": {
				"className": "text-md",
				"value": { "path": "localModuleAlarm" },
				"color": { "path": "localAlarmColor" },
				"size": "small"
			}
		},
		{
			"id": "mainCellPeerAlarm",
			"component": "Tag",
			"props": {
				"className": "text-md",
				"value": { "path": "peerAlarm" },
				"color": { "path": "peerAlarmColor" },
				"size": "small"
			}
		},
		{
			"id": "mainCellTemperature",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "temperature" }
			}
		},
		{
			"id": "mainCellVoltage",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "voltage" }
			}
		},
		{
			"id": "mainCellTxPowerLocal",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "txPowerLocal" }
			}
		},
		{
			"id": "mainCellRxPowerLocal",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "rxPowerLocal" }
			}
		},
		{
			"id": "mainCellCurrentLocal",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "currentLocal" }
			}
		},
		{
			"id": "mainCellSnrLocal",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "snrLocal" }
			}
		},
		{
			"id": "mainCellBerLocal",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "berLocal" }
			}
		},
		{
			"id": "mainCellTxPowerPeer",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface whitespace-nowrap",
				"value": { "path": "txPowerPeer" }
			}
		},
		{
			"id": "mainCellOperations",
			"component": "div",
			"props": { "className": "flex flex-row gap-[0.5rem] items-center whitespace-nowrap" },
			"children": ["mainCellOpsEye", "mainCellOpsMore"]
		},
		{
			"id": "mainCellOpsEye",
			"component": "Icon",
			"props": {
				"name": "eye",
				"color": "#777777",
				"className": "w-4 h-4 cursor-pointer whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "mainCellOpsMore",
			"component": "Icon",
			"props": {
				"name": "more-horizontal",
				"color": "#777777",
				"className": "w-4 h-4 cursor-pointer whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "dialogTitleRow",
			"component": "div",
			"props": { "className": "flex flex-row items-center justify-between" },
			"children": [
				"dialogTitleText",
				"dialogTimeRange",
				"dialogCloseIcon"
			]
		},
		{
			"id": "dialogTitleText",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "指标详情"
			}
		},
		{
			"id": "dialogTimeRange",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": "2025/05/15 00:54:12 - 2025/05/15 14:54:12"
			}
		},
		{
			"id": "dialogCloseIcon",
			"component": "Icon",
			"props": {
				"name": "x",
				"color": "#777777",
				"className": "w-5 h-5 cursor-pointer",
				"shape": "outline"
			}
		},
		{
			"id": "dialogTabsSection",
			"component": "Tabs",
			"props": {
				"activeKey": { "path": "/activeTab" },
				"types": "line",
				"size": "small"
			},
			"children": ["dialogTabLocal", "dialogTabPeer"]
		},
		{
			"id": "dialogTabLocal",
			"component": "TabItem",
			"props": {
				"key": "local",
				"label": "本端",
				"content": { "componentId": "dialogTabContent" }
			}
		},
		{
			"id": "dialogTabPeer",
			"component": "TabItem",
			"props": {
				"key": "peer",
				"label": "对端",
				"content": { "componentId": "dialogTabContent" }
			}
		},
		{
			"id": "dialogTabContent",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"dialogDeviceInfo",
				"dialogChartRx",
				"dialogChartTx",
				"dialogChartCurrent"
			]
		},
		{
			"id": "dialogDeviceInfo",
			"component": "div",
			"props": { "className": "flex flex-col gap-[0.5rem]" },
			"children": ["dialogDeviceInfoRow1", "dialogDeviceInfoRow2"]
		},
		{
			"id": "dialogDeviceInfoRow1",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] items-center" },
			"children": [
				"dialogDeviceNameLabel",
				"dialogDeviceNameValue",
				"dialogPortNameLabel",
				"dialogPortNameValue"
			]
		},
		{
			"id": "dialogDeviceNameLabel",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": "设备名称："
			}
		},
		{
			"id": "dialogDeviceNameValue",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface font-medium",
				"value": "POD7-spine1"
			}
		},
		{
			"id": "dialogPortNameLabel",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": "端口："
			}
		},
		{
			"id": "dialogPortNameValue",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface font-medium",
				"value": "25GE1/0/4"
			}
		},
		{
			"id": "dialogDeviceInfoRow2",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.5rem]" },
			"children": ["dialogAggregationLabel", "dialogAggregationSelect"]
		},
		{
			"id": "dialogAggregationLabel",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": "聚合方式："
			}
		},
		{
			"id": "dialogAggregationSelect",
			"component": "Select",
			"props": {
				"value": { "path": "/aggregationValue" },
				"options": [
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
				"className": "w-32"
			}
		},
		{
			"id": "dialogChartRx",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"dialogRxTitle",
				"dialogRxStatsRow",
				"dialogRxLineChart"
			]
		},
		{
			"id": "dialogRxTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "接收功率"
			}
		},
		{
			"id": "dialogRxStatsRow",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": [
				"dialogRxStatMax",
				"dialogRxStatMin",
				"dialogRxStatAvg"
			]
		},
		{
			"id": "dialogRxStatMax",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogRxStatMaxLabel", "dialogRxStatMaxValue"]
		},
		{
			"id": "dialogRxStatMaxLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值"
			}
		},
		{
			"id": "dialogRxStatMaxValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogRxStatMin",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogRxStatMinLabel", "dialogRxStatMinValue"]
		},
		{
			"id": "dialogRxStatMinLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值"
			}
		},
		{
			"id": "dialogRxStatMinValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogRxStatAvg",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogRxStatAvgLabel", "dialogRxStatAvgValue"]
		},
		{
			"id": "dialogRxStatAvgLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值"
			}
		},
		{
			"id": "dialogRxStatAvgValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogRxLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/rxChartData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "dBm",
					"smooth": true
				},
				"className": "h-48"
			}
		},
		{
			"id": "dialogChartTx",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"dialogTxTitle",
				"dialogTxStatsRow",
				"dialogTxLineChart"
			]
		},
		{
			"id": "dialogTxTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "发送功率"
			}
		},
		{
			"id": "dialogTxStatsRow",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": [
				"dialogTxStatMax",
				"dialogTxStatMin",
				"dialogTxStatAvg"
			]
		},
		{
			"id": "dialogTxStatMax",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogTxStatMaxLabel", "dialogTxStatMaxValue"]
		},
		{
			"id": "dialogTxStatMaxLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值"
			}
		},
		{
			"id": "dialogTxStatMaxValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogTxStatMin",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogTxStatMinLabel", "dialogTxStatMinValue"]
		},
		{
			"id": "dialogTxStatMinLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值"
			}
		},
		{
			"id": "dialogTxStatMinValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogTxStatAvg",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogTxStatAvgLabel", "dialogTxStatAvgValue"]
		},
		{
			"id": "dialogTxStatAvgLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值"
			}
		},
		{
			"id": "dialogTxStatAvgValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "-1.74"
			}
		},
		{
			"id": "dialogTxLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/txChartData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "dBm",
					"smooth": true
				},
				"className": "h-48"
			}
		},
		{
			"id": "dialogChartCurrent",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[0.75rem]" },
			"children": [
				"dialogCurrentTitle",
				"dialogCurrentStatsRow",
				"dialogCurrentLineChart"
			]
		},
		{
			"id": "dialogCurrentTitle",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": "电流"
			}
		},
		{
			"id": "dialogCurrentStatsRow",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem]" },
			"children": [
				"dialogCurrentStatMax",
				"dialogCurrentStatMin",
				"dialogCurrentStatAvg"
			]
		},
		{
			"id": "dialogCurrentStatMax",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogCurrentStatMaxLabel", "dialogCurrentStatMaxValue"]
		},
		{
			"id": "dialogCurrentStatMaxLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最大值"
			}
		},
		{
			"id": "dialogCurrentStatMaxValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "87.23"
			}
		},
		{
			"id": "dialogCurrentStatMin",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogCurrentStatMinLabel", "dialogCurrentStatMinValue"]
		},
		{
			"id": "dialogCurrentStatMinLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "最小值"
			}
		},
		{
			"id": "dialogCurrentStatMinValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "87.23"
			}
		},
		{
			"id": "dialogCurrentStatAvg",
			"component": "div",
			"props": { "className": "flex-1 flex flex-col items-center gap-[0.25rem] min-w-0" },
			"children": ["dialogCurrentStatAvgLabel", "dialogCurrentStatAvgValue"]
		},
		{
			"id": "dialogCurrentStatAvgLabel",
			"component": "span",
			"props": {
				"className": "text-sm text-on-surface-variant",
				"value": "平均值"
			}
		},
		{
			"id": "dialogCurrentStatAvgValue",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": "87.23"
			}
		},
		{
			"id": "dialogCurrentLineChart",
			"component": "LineChart",
			"props": {
				"option": {
					"data": { "path": "/currentChartData" },
					"xAxis": { "data": "time" },
					"yAxisTitle": "mA",
					"smooth": true
				},
				"className": "h-48"
			}
		}
	],
	state: /* @__PURE__ */ JSON.parse("{\"platformName\":\"iMaster NCE-FabricInsight\",\"navLinks\":[{\"id\":\"healthDashboard\",\"text\":\"健康看板\",\"iconName\":\"activity\"},{\"id\":\"largeScreen\",\"text\":\"大屏\",\"iconName\":\"monitor\"}],\"rightLinks\":[{\"id\":\"strategyCenter\",\"text\":\"策略中心\"}],\"systemIcons\":[{\"id\":\"sysAlert\",\"iconName\":\"bell\"},{\"id\":\"sysSetting\",\"iconName\":\"settings\"},{\"id\":\"sysHelp\",\"iconName\":\"circle-help\"},{\"id\":\"sysFullscreen\",\"iconName\":\"maximize\"}],\"userInfo\":{\"avatarImage\":\"https://randomuser.me/api/portraits/men/45.jpg\",\"username\":\"Admin\"},\"selectedValue\":\"all\",\"searchValue\":\"\",\"selectedKeys\":[\"link-001\"],\"cardTitle\":\"链路结果\",\"searchOptions\":[{\"value\":\"all\",\"label\":\"全部链路\"},{\"value\":\"alarm\",\"label\":\"有告警\"},{\"value\":\"normal\",\"label\":\"正常\"}],\"tableData\":[{\"id\":\"link-001\",\"checked\":true,\"peerPortCrc\":\"未检测\",\"localModuleAlarm\":\"光模块IIC故障\",\"localAlarmColor\":\"error\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"41.40°C\",\"voltage\":\"3.35V\",\"txPowerLocal\":\"Lane1:-1dBm Lane2:0.5dBm Lane3:-2.1dBm Lane4:1.2dBm\",\"rxPowerLocal\":\"Lane0:2.43dBm Lane1:-0.8dBm Lane2:1.1dBm Lane3:-1.5dBm\",\"currentLocal\":\"Lane0:87.23mA Lane1:82.1mA Lane2:85.6mA Lane3:79.8mA\",\"snrLocal\":\"Lane0:1dB Lane1:0.5dB Lane2:0.8dB Lane3:0.3dB\",\"berLocal\":\"NA\",\"txPowerPeer\":\"Lane0:-0.95dBm Lane1:0.2dBm Lane2:-1.8dBm Lane3:0.7dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-002\",\"checked\":false,\"peerPortCrc\":\"0\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"光模块温度过高\",\"peerAlarmColor\":\"warning\",\"temperature\":\"52.10°C\",\"voltage\":\"3.28V\",\"txPowerLocal\":\"Lane0:2.5dBm Lane1:1.8dBm Lane2:3.0dBm Lane3:2.1dBm\",\"rxPowerLocal\":\"Lane0:-2.15dBm Lane1:-3.4dBm Lane2:-1.9dBm Lane3:-4.0dBm\",\"currentLocal\":\"Lane0:95.4mA Lane1:91.2mA Lane2:98.7mA Lane3:88.5mA\",\"snrLocal\":\"Lane0:1.5dB Lane1:1.2dB Lane2:1.8dB Lane3:0.9dB\",\"berLocal\":\"2.3e-6\",\"txPowerPeer\":\"Lane0:1.8dBm Lane1:1.2dBm Lane2:2.5dBm Lane3:1.5dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-003\",\"checked\":false,\"peerPortCrc\":\"5\",\"localModuleAlarm\":\"发送功率过低\",\"localAlarmColor\":\"error\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"38.75°C\",\"voltage\":\"3.41V\",\"txPowerLocal\":\"Lane0:-8.5dBm Lane1:-9.2dBm Lane2:-7.8dBm Lane3:-10.1dBm\",\"rxPowerLocal\":\"Lane0:-6.3dBm Lane1:-7.1dBm Lane2:-5.9dBm Lane3:-8.0dBm\",\"currentLocal\":\"Lane0:65.3mA Lane1:61.8mA Lane2:68.5mA Lane3:58.9mA\",\"snrLocal\":\"Lane0:0.2dB Lane1:0.1dB Lane2:0.3dB Lane3:0.05dB\",\"berLocal\":\"1.8e-4\",\"txPowerPeer\":\"Lane0:2.0dBm Lane1:1.5dBm Lane2:2.8dBm Lane3:1.7dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-004\",\"checked\":false,\"peerPortCrc\":\"0\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"35.20°C\",\"voltage\":\"3.38V\",\"txPowerLocal\":\"Lane0:1.2dBm Lane1:0.8dBm Lane2:1.5dBm Lane3:0.5dBm\",\"rxPowerLocal\":\"Lane0:-1.1dBm Lane1:-1.8dBm Lane2:-0.5dBm Lane3:-2.3dBm\",\"currentLocal\":\"Lane0:78.6mA Lane1:75.2mA Lane2:81.3mA Lane3:72.8mA\",\"snrLocal\":\"Lane0:1.8dB Lane1:1.5dB Lane2:2.0dB Lane3:1.3dB\",\"berLocal\":\"NA\",\"txPowerPeer\":\"Lane0:0.9dBm Lane1:0.3dBm Lane2:1.2dBm Lane3:-0.1dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-005\",\"checked\":false,\"peerPortCrc\":\"12\",\"localModuleAlarm\":\"接收功率过低\",\"localAlarmColor\":\"error\",\"peerAlarm\":\"链路误码率过高\",\"peerAlarmColor\":\"error\",\"temperature\":\"45.60°C\",\"voltage\":\"3.22V\",\"txPowerLocal\":\"Lane0:0.5dBm Lane1:-0.2dBm Lane2:0.8dBm Lane3:-0.5dBm\",\"rxPowerLocal\":\"Lane0:-12.5dBm Lane1:-13.8dBm Lane2:-11.2dBm Lane3:-14.5dBm\",\"currentLocal\":\"Lane0:72.1mA Lane1:68.5mA Lane2:75.8mA Lane3:65.3mA\",\"snrLocal\":\"Lane0:0.1dB Lane1:0.05dB Lane2:0.2dB Lane3:0.01dB\",\"berLocal\":\"5.2e-3\",\"txPowerPeer\":\"Lane0:1.5dBm Lane1:0.9dBm Lane2:2.0dBm Lane3:0.6dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-006\",\"checked\":false,\"peerPortCrc\":\"3\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"36.80°C\",\"voltage\":\"3.42V\",\"txPowerLocal\":\"Lane0:2.1dBm Lane1:1.6dBm Lane2:2.5dBm Lane3:1.3dBm\",\"rxPowerLocal\":\"Lane0:-0.8dBm Lane1:-1.5dBm Lane2:-0.2dBm Lane3:-2.0dBm\",\"currentLocal\":\"Lane0:80.2mA Lane1:76.8mA Lane2:83.5mA Lane3:74.1mA\",\"snrLocal\":\"Lane0:2.1dB Lane1:1.8dB Lane2:2.5dB Lane3:1.5dB\",\"berLocal\":\"1.0e-8\",\"txPowerPeer\":\"Lane0:2.0dBm Lane1:1.4dBm Lane2:2.3dBm Lane3:1.1dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-007\",\"checked\":false,\"peerPortCrc\":\"未检测\",\"localModuleAlarm\":\"光模块IIC故障\",\"localAlarmColor\":\"error\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"42.10°C\",\"voltage\":\"3.33V\",\"txPowerLocal\":\"Lane1:-0.5dBm Lane2:1.0dBm Lane3:-1.8dBm Lane4:0.8dBm\",\"rxPowerLocal\":\"Lane0:2.80dBm Lane1:-0.5dBm Lane2:1.4dBm Lane3:-1.2dBm\",\"currentLocal\":\"Lane0:88.5mA Lane1:83.2mA Lane2:86.9mA Lane3:80.5mA\",\"snrLocal\":\"Lane0:1.2dB Lane1:0.8dB Lane2:1.0dB Lane3:0.5dB\",\"berLocal\":\"NA\",\"txPowerPeer\":\"Lane0:-0.8dBm Lane1:0.3dBm Lane2:-1.5dBm Lane3:0.9dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-008\",\"checked\":false,\"peerPortCrc\":\"8\",\"localModuleAlarm\":\"温度告警\",\"localAlarmColor\":\"warning\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"58.30°C\",\"voltage\":\"3.18V\",\"txPowerLocal\":\"Lane0:-3.5dBm Lane1:-4.2dBm Lane2:-2.8dBm Lane3:-5.0dBm\",\"rxPowerLocal\":\"Lane0:-7.2dBm Lane1:-8.5dBm Lane2:-6.0dBm Lane3:-9.5dBm\",\"currentLocal\":\"Lane0:105.3mA Lane1:98.7mA Lane2:110.2mA Lane3:95.1mA\",\"snrLocal\":\"Lane0:0.4dB Lane1:0.2dB Lane2:0.5dB Lane3:0.1dB\",\"berLocal\":\"3.5e-5\",\"txPowerPeer\":\"Lane0:1.2dBm Lane1:0.5dBm Lane2:1.8dBm Lane3:0.2dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-009\",\"checked\":false,\"peerPortCrc\":\"0\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"37.50°C\",\"voltage\":\"3.40V\",\"txPowerLocal\":\"Lane0:1.8dBm Lane1:1.2dBm Lane2:2.2dBm Lane3:0.9dBm\",\"rxPowerLocal\":\"Lane0:-1.5dBm Lane1:-2.2dBm Lane2:-0.8dBm Lane3:-2.8dBm\",\"currentLocal\":\"Lane0:79.5mA Lane1:75.8mA Lane2:82.6mA Lane3:72.9mA\",\"snrLocal\":\"Lane0:1.6dB Lane1:1.3dB Lane2:1.9dB Lane3:1.0dB\",\"berLocal\":\"NA\",\"txPowerPeer\":\"Lane0:1.6dBm Lane1:1.0dBm Lane2:2.0dBm Lane3:0.7dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-010\",\"checked\":false,\"peerPortCrc\":\"2\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"光模块故障\",\"peerAlarmColor\":\"error\",\"temperature\":\"44.20°C\",\"voltage\":\"3.30V\",\"txPowerLocal\":\"Lane0:1.0dBm Lane1:0.4dBm Lane2:1.3dBm Lane3:0.1dBm\",\"rxPowerLocal\":\"Lane0:-11.0dBm Lane1:-12.5dBm Lane2:-9.8dBm Lane3:-13.2dBm\",\"currentLocal\":\"Lane0:70.8mA Lane1:67.2mA Lane2:74.5mA Lane3:64.0mA\",\"snrLocal\":\"Lane0:0.3dB Lane1:0.15dB Lane2:0.4dB Lane3:0.08dB\",\"berLocal\":\"8.9e-4\",\"txPowerPeer\":\"Lane0:1.8dBm Lane1:1.1dBm Lane2:2.2dBm Lane3:0.8dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-011\",\"checked\":false,\"peerPortCrc\":\"未检测\",\"localModuleAlarm\":\"激光器老化\",\"localAlarmColor\":\"warning\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"40.80°C\",\"voltage\":\"3.35V\",\"txPowerLocal\":\"Lane0:-5.2dBm Lane1:-6.0dBm Lane2:-4.5dBm Lane3:-6.8dBm\",\"rxPowerLocal\":\"Lane0:-4.1dBm Lane1:-5.0dBm Lane2:-3.5dBm Lane3:-5.8dBm\",\"currentLocal\":\"Lane0:120.5mA Lane1:115.2mA Lane2:125.8mA Lane3:112.3mA\",\"snrLocal\":\"Lane0:0.15dB Lane1:0.1dB Lane2:0.2dB Lane3:0.05dB\",\"berLocal\":\"6.7e-4\",\"txPowerPeer\":\"Lane0:1.3dBm Lane1:0.7dBm Lane2:1.6dBm Lane3:0.4dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]},{\"id\":\"link-012\",\"checked\":false,\"peerPortCrc\":\"0\",\"localModuleAlarm\":\"无\",\"localAlarmColor\":\"success\",\"peerAlarm\":\"无\",\"peerAlarmColor\":\"success\",\"temperature\":\"36.10°C\",\"voltage\":\"3.43V\",\"txPowerLocal\":\"Lane0:2.3dBm Lane1:1.7dBm Lane2:2.8dBm Lane3:1.4dBm\",\"rxPowerLocal\":\"Lane0:-0.5dBm Lane1:-1.2dBm Lane2:0.1dBm Lane3:-1.8dBm\",\"currentLocal\":\"Lane0:81.0mA Lane1:77.5mA Lane2:84.2mA Lane3:74.8mA\",\"snrLocal\":\"Lane0:2.2dB Lane1:1.9dB Lane2:2.6dB Lane3:1.6dB\",\"berLocal\":\"NA\",\"txPowerPeer\":\"Lane0:2.1dBm Lane1:1.5dBm Lane2:2.4dBm Lane3:1.2dBm\",\"operations\":[{\"iconName\":\"eye\",\"tooltip\":\"查看详情\"},{\"iconName\":\"more-horizontal\",\"tooltip\":\"更多操作\"}]}],\"activeTab\":\"local\",\"aggregationValue\":\"avg\",\"rxChartData\":[{\"time\":\"00:00\",\"Lane0\":-2.1,\"Lane1\":-1.5,\"Lane2\":-2.5,\"Lane3\":-1.8},{\"time\":\"01:00\",\"Lane0\":-1.8,\"Lane1\":-1.2,\"Lane2\":-2.2,\"Lane3\":-1.5},{\"time\":\"02:00\",\"Lane0\":-0.9,\"Lane1\":-0.3,\"Lane2\":-1.3,\"Lane3\":-0.6},{\"time\":\"03:00\",\"Lane0\":-1.5,\"Lane1\":-0.9,\"Lane2\":-1.9,\"Lane3\":-1.2},{\"time\":\"04:00\",\"Lane0\":-2.5,\"Lane1\":-1.9,\"Lane2\":-2.9,\"Lane3\":-2.2},{\"time\":\"05:00\",\"Lane0\":-3,\"Lane1\":-2.4,\"Lane2\":-3.4,\"Lane3\":-2.7},{\"time\":\"06:00\",\"Lane0\":-2,\"Lane1\":-1.4,\"Lane2\":-2.4,\"Lane3\":-1.7},{\"time\":\"07:00\",\"Lane0\":-1,\"Lane1\":-0.4,\"Lane2\":-1.4,\"Lane3\":-0.7},{\"time\":\"08:00\",\"Lane0\":-0.5,\"Lane1\":0.1,\"Lane2\":-0.9,\"Lane3\":-0.2},{\"time\":\"09:00\",\"Lane0\":-1.2,\"Lane1\":-0.6,\"Lane2\":-1.6,\"Lane3\":-0.9},{\"time\":\"10:00\",\"Lane0\":-2.2,\"Lane1\":-1.6,\"Lane2\":-2.6,\"Lane3\":-1.9},{\"time\":\"11:00\",\"Lane0\":-2.8,\"Lane1\":-2.2,\"Lane2\":-3.2,\"Lane3\":-2.5},{\"time\":\"12:00\",\"Lane0\":-1.6,\"Lane1\":-1,\"Lane2\":-2,\"Lane3\":-1.3},{\"time\":\"13:00\",\"Lane0\":-1.1,\"Lane1\":-0.5,\"Lane2\":-1.5,\"Lane3\":-0.8},{\"time\":\"14:00\",\"Lane0\":-1.74,\"Lane1\":-1.2,\"Lane2\":-2.1,\"Lane3\":-1.5}],\"txChartData\":[{\"time\":\"00:00\",\"Lane0\":-1.5,\"Lane1\":-0.9,\"Lane2\":-1.9,\"Lane3\":-1.2},{\"time\":\"01:00\",\"Lane0\":-1.9,\"Lane1\":-1.3,\"Lane2\":-2.3,\"Lane3\":-1.6},{\"time\":\"02:00\",\"Lane0\":-2.8,\"Lane1\":-2.2,\"Lane2\":-3.2,\"Lane3\":-2.5},{\"time\":\"03:00\",\"Lane0\":-2,\"Lane1\":-1.4,\"Lane2\":-2.4,\"Lane3\":-1.7},{\"time\":\"04:00\",\"Lane0\":-1.2,\"Lane1\":-0.6,\"Lane2\":-1.6,\"Lane3\":-0.9},{\"time\":\"05:00\",\"Lane0\":-0.5,\"Lane1\":0.1,\"Lane2\":-0.9,\"Lane3\":-0.2},{\"time\":\"06:00\",\"Lane0\":-1.3,\"Lane1\":-0.7,\"Lane2\":-1.7,\"Lane3\":-1},{\"time\":\"07:00\",\"Lane0\":-2.1,\"Lane1\":-1.5,\"Lane2\":-2.5,\"Lane3\":-1.8},{\"time\":\"08:00\",\"Lane0\":-2.7,\"Lane1\":-2.1,\"Lane2\":-3.1,\"Lane3\":-2.4},{\"time\":\"09:00\",\"Lane0\":-1.8,\"Lane1\":-1.2,\"Lane2\":-2.2,\"Lane3\":-1.5},{\"time\":\"10:00\",\"Lane0\":-0.9,\"Lane1\":-0.3,\"Lane2\":-1.3,\"Lane3\":-0.6},{\"time\":\"11:00\",\"Lane0\":-1.5,\"Lane1\":-0.9,\"Lane2\":-1.9,\"Lane3\":-1.2},{\"time\":\"12:00\",\"Lane0\":-2.3,\"Lane1\":-1.7,\"Lane2\":-2.7,\"Lane3\":-2},{\"time\":\"13:00\",\"Lane0\":-2,\"Lane1\":-1.4,\"Lane2\":-2.4,\"Lane3\":-1.7},{\"time\":\"14:00\",\"Lane0\":-1.74,\"Lane1\":-1.2,\"Lane2\":-2.1,\"Lane3\":-1.5}],\"currentChartData\":[{\"time\":\"00:00\",\"Lane0\":85.1,\"Lane1\":81.2,\"Lane2\":88.5,\"Lane3\":78.5},{\"time\":\"01:00\",\"Lane0\":86.5,\"Lane1\":82.5,\"Lane2\":89.8,\"Lane3\":79.8},{\"time\":\"02:00\",\"Lane0\":88.2,\"Lane1\":83.8,\"Lane2\":91.2,\"Lane3\":81.2},{\"time\":\"03:00\",\"Lane0\":87.8,\"Lane1\":83.5,\"Lane2\":90.5,\"Lane3\":80.5},{\"time\":\"04:00\",\"Lane0\":86,\"Lane1\":82,\"Lane2\":89,\"Lane3\":79},{\"time\":\"05:00\",\"Lane0\":84.5,\"Lane1\":80.5,\"Lane2\":87.5,\"Lane3\":77.5},{\"time\":\"06:00\",\"Lane0\":85.8,\"Lane1\":81.8,\"Lane2\":88.8,\"Lane3\":78.8},{\"time\":\"07:00\",\"Lane0\":87.1,\"Lane1\":83.1,\"Lane2\":90.1,\"Lane3\":80.1},{\"time\":\"08:00\",\"Lane0\":88.9,\"Lane1\":84.5,\"Lane2\":91.8,\"Lane3\":81.5},{\"time\":\"09:00\",\"Lane0\":87.5,\"Lane1\":83.2,\"Lane2\":90.5,\"Lane3\":80.2},{\"time\":\"10:00\",\"Lane0\":86.2,\"Lane1\":82,\"Lane2\":89.2,\"Lane3\":79},{\"time\":\"11:00\",\"Lane0\":85,\"Lane1\":80.8,\"Lane2\":88,\"Lane3\":77.8},{\"time\":\"12:00\",\"Lane0\":86.8,\"Lane1\":82.5,\"Lane2\":89.5,\"Lane3\":79.5},{\"time\":\"13:00\",\"Lane0\":87.9,\"Lane1\":83.6,\"Lane2\":90.8,\"Lane3\":80.6},{\"time\":\"14:00\",\"Lane0\":87.23,\"Lane1\":82.8,\"Lane2\":90.1,\"Lane3\":79.8}]}")
};
//#endregion
export { data_default as default };
