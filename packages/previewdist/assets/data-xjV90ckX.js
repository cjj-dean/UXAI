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
				"terminalTableDialog"
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
			"children": ["aside", "main"]
		},
		{
			"id": "aside",
			"component": "aside",
			"props": { "className": "w-[54px] shrink-0 overflow-hidden bg-surface-container-highest shadow-sm flex flex-col justify-between" },
			"children": ["asideTopGroup", "asideBotGroup"]
		},
		{
			"id": "main",
			"component": "main",
			"props": { "className": "flex-1 overflow-y-auto p-[2rem] flex flex-col gap-[1rem] min-w-0" },
			"children": ["chartCardsSectionContainer", "terminalUserManagementSectionContainer"]
		},
		{
			"id": "chartCardsSectionContainer",
			"component": "div",
			"props": { "className": "flex flex-row gap-[1rem] h-[300px] shrink-0" },
			"children": [
				"chartCard1",
				"chartCard2",
				"chartCard3",
				"chartCard4",
				"chartCard5"
			]
		},
		{
			"id": "terminalUserManagementSectionContainer",
			"component": "Section",
			"props": { "className": "flex flex-col gap-[1rem] flex-1 min-w-0" },
			"children": [
				"terminalTblTitle",
				"terminalTblToolbar",
				"terminalTblTable"
			]
		},
		{
			"id": "terminalTableDialog",
			"component": "Dialog",
			"props": {
				"title": "",
				"width": "50%",
				"className": "z-[99] flex flex-col gap-[1rem] bg-surface-container-highest shadow-sm"
			},
			"children": []
		},
		{
			"id": "headerLeftGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerBrandIcon",
				"headerBrandText",
				"headerProjectDropdown"
			]
		},
		{
			"id": "headerBrandIcon",
			"component": "Icon",
			"props": {
				"name": "hexagon",
				"color": "primary",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "headerBrandText",
			"component": "span",
			"props": {
				"className": "text-md font-semibold text-on-surface",
				"value": { "path": "/brandText" }
			}
		},
		{
			"id": "headerProjectDropdown",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[0.25rem]" },
			"children": ["headerProjectName", "headerProjectArrow"]
		},
		{
			"id": "headerProjectName",
			"component": "span",
			"props": {
				"className": "text-md text-on-surface-variant",
				"value": { "path": "/projectName" }
			}
		},
		{
			"id": "headerProjectArrow",
			"component": "Icon",
			"props": {
				"name": "chevron-down",
				"color": "#777777",
				"className": "w-3 h-3",
				"shape": "outline"
			}
		},
		{
			"id": "headerRightGroup",
			"component": "div",
			"props": { "className": "flex flex-row items-center gap-[1rem]" },
			"children": [
				"headerNotificationBadge",
				"headerUserAvatar",
				"headerHomeButton"
			]
		},
		{
			"id": "headerNotificationBadge",
			"component": "Badge",
			"props": {
				"count": { "path": "/notificationBadgeCount" },
				"color": "error",
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
				"alt": "用户头像",
				"className": "w-8 h-8 object-cover rounded-[8px]"
			}
		},
		{
			"id": "headerHomeButton",
			"component": "Button",
			"props": {
				"value": { "path": "/homeButtonText" },
				"color": "primary",
				"className": "flex-1"
			}
		},
		{
			"id": "asideTopGroup",
			"component": "div",
			"props": { "className": "flex flex-col items-center pt-[1rem] gap-[0.25rem]" },
			"children": {
				"path": "/topMenuIcons",
				"componentId": "asideTopItem"
			}
		},
		{
			"id": "asideTopItem",
			"component": "div",
			"props": { "className": "w-full flex items-center justify-center py-[0.75rem] cursor-pointer hover:bg-primary-container transition-colors duration-150" },
			"children": ["asideTopIcon"]
		},
		{
			"id": "asideTopIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "iconName" },
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "asideBotGroup",
			"component": "div",
			"props": { "className": "flex flex-col items-center pb-[1rem] gap-[0.25rem]" },
			"children": {
				"path": "/bottomMenuIcons",
				"componentId": "asideBotItem"
			}
		},
		{
			"id": "asideBotItem",
			"component": "div",
			"props": { "className": "w-full flex items-center justify-center py-[0.75rem] cursor-pointer hover:bg-primary-container transition-colors duration-150" },
			"children": ["asideBotIcon"]
		},
		{
			"id": "asideBotIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "iconName" },
				"color": "#777777",
				"className": "w-5 h-5",
				"shape": "outline"
			}
		},
		{
			"id": "chartCard1",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 h-full gap-[1rem] min-w-0" },
			"children": ["chartCard1Header", "chartCard1PieChart"]
		},
		{
			"id": "chartCard1Header",
			"component": "div",
			"props": { "className": "flex justify-between items-center" },
			"children": ["chartCard1Title"]
		},
		{
			"id": "chartCard1Title",
			"component": "span",
			"props": {
				"value": { "path": "/card1_terminalType/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "chartCard1PieChart",
			"component": "PieChart",
			"props": {
				"option": {
					"type": "doughnut",
					"data": { "path": "/card1_terminalType/chartData" },
					"title": {
						"text": { "path": "/card1_terminalType/centerNumber" },
						"subtext": { "path": "/card1_terminalType/centerLabel" }
					}
				},
				"className": "min-w-0 h-[188px]"
			}
		},
		{
			"id": "chartCard2",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 h-full gap-[1rem] min-w-0" },
			"children": ["chartCard2Header", "chartCard2PieChart"]
		},
		{
			"id": "chartCard2Header",
			"component": "div",
			"props": { "className": "flex justify-between items-center" },
			"children": ["chartCard2Title"]
		},
		{
			"id": "chartCard2Title",
			"component": "span",
			"props": {
				"value": { "path": "/card2_accessType/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "chartCard2PieChart",
			"component": "PieChart",
			"props": {
				"option": {
					"type": "doughnut",
					"data": { "path": "/card2_accessType/chartData" },
					"title": {
						"text": { "path": "/card2_accessType/centerNumber" },
						"subtext": { "path": "/card2_accessType/centerLabel" }
					}
				},
				"className": "min-w-0 h-[188px]"
			}
		},
		{
			"id": "chartCard3",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 h-full gap-[1rem] min-w-0" },
			"children": ["chartCard3Header", "chartCard3ProcessChart"]
		},
		{
			"id": "chartCard3Header",
			"component": "div",
			"props": { "className": "flex justify-between items-center" },
			"children": ["chartCard3Title", "chartCard3HeaderRight"]
		},
		{
			"id": "chartCard3Title",
			"component": "span",
			"props": {
				"value": { "path": "/card3_terminalTrafficTop5/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "chartCard3HeaderRight",
			"component": "div",
			"props": { "className": "flex items-center gap-[0.5rem]" },
			"children": ["chartCard3Dropdown", "chartCard3HelpIcon"]
		},
		{
			"id": "chartCard3Dropdown",
			"component": "Dropdown",
			"props": {
				"menu": { "path": "/card3DropdownMenu" },
				"trigger": ["click"],
				"placement": "bottomRight"
			},
			"children": ["chartCard3DropdownBtn"]
		},
		{
			"id": "chartCard3DropdownBtn",
			"component": "Button",
			"props": {
				"value": "Top5",
				"icon": "chevron-down",
				"iconPlacement": "end"
			}
		},
		{
			"id": "chartCard3HelpIcon",
			"component": "Icon",
			"props": {
				"name": "help-circle",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "chartCard3ProcessChart",
			"component": "ProcessChart",
			"props": {
				"option": {
					"name": "ProcessBarChart",
					"data": { "path": "/card3_terminalTrafficTop5/chartData" },
					"unit": "MB"
				},
				"className": "min-w-0 h-[200px]"
			}
		},
		{
			"id": "chartCard4",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 h-full gap-[1rem] min-w-0" },
			"children": ["chartCard4Header", "chartCard4ProcessChart"]
		},
		{
			"id": "chartCard4Header",
			"component": "div",
			"props": { "className": "flex justify-between items-center" },
			"children": ["chartCard4Title", "chartCard4HelpIcon"]
		},
		{
			"id": "chartCard4Title",
			"component": "span",
			"props": {
				"value": { "path": "/card4_appTrafficTop5/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "chartCard4HelpIcon",
			"component": "Icon",
			"props": {
				"name": "help-circle",
				"color": "#777777",
				"className": "w-4 h-4",
				"shape": "outline"
			}
		},
		{
			"id": "chartCard4ProcessChart",
			"component": "ProcessChart",
			"props": {
				"option": {
					"name": "ProcessBarChart",
					"data": { "path": "/card4_appTrafficTop5/chartData" },
					"unit": "MB"
				},
				"className": "min-w-0 h-[200px]"
			}
		},
		{
			"id": "chartCard5",
			"component": "Section",
			"props": { "className": "flex flex-col flex-1 h-full gap-[1rem] min-w-0" },
			"children": ["chartCard5Header", "chartCard5BarChart"]
		},
		{
			"id": "chartCard5Header",
			"component": "div",
			"props": { "className": "flex justify-between items-center" },
			"children": ["chartCard5Title"]
		},
		{
			"id": "chartCard5Title",
			"component": "span",
			"props": {
				"value": { "path": "/card5_terminalOnlineDuration/cardTitle" },
				"className": "text-lg font-bold text-on-surface"
			}
		},
		{
			"id": "chartCard5BarChart",
			"component": "BarChart",
			"props": {
				"option": {
					"data": { "path": "/card5_terminalOnlineDuration/chartData" },
					"xAxis": { "data": "name" },
					"yAxisTitle": { "path": "/card5_terminalOnlineDuration/yAxisLabel" }
				},
				"className": "min-w-0 h-[188px]"
			}
		},
		{
			"id": "terminalTblTitle",
			"component": "span",
			"props": {
				"className": "text-lg font-bold text-on-surface",
				"value": { "path": "/cardTitle" }
			}
		},
		{
			"id": "terminalTblToolbar",
			"component": "div",
			"props": { "className": "flex items-center justify-between gap-[1rem]" },
			"children": ["terminalTblToolbarLeft", "terminalTblToolbarRight"]
		},
		{
			"id": "terminalTblToolbarLeft",
			"component": "div",
			"props": { "className": "flex items-center gap-[0.5rem]" },
			"children": ["terminalTblSearchInput", "terminalTblAdvancedSearchBtn"]
		},
		{
			"id": "terminalTblSearchInput",
			"component": "Input",
			"props": {
				"value": { "path": "/searchValue" },
				"placeholder": "请输入搜索内容",
				"prefix": "search",
				"className": "w-72"
			}
		},
		{
			"id": "terminalTblAdvancedSearchBtn",
			"component": "Button",
			"props": {
				"value": "高级搜索",
				"types": "link"
			}
		},
		{
			"id": "terminalTblToolbarRight",
			"component": "div",
			"props": { "className": "flex items-center gap-[0.5rem]" },
			"children": [
				"terminalTblScanBtn",
				"terminalTblUnbindBtn",
				"terminalTblBindBtn",
				"terminalTblGuardListBtn",
				"terminalTblSpeedLimitBtn",
				"terminalTblRefreshBtn"
			]
		},
		{
			"id": "terminalTblScanBtn",
			"component": "Button",
			"props": {
				"value": "立即扫描",
				"color": "primary"
			}
		},
		{
			"id": "terminalTblUnbindBtn",
			"component": "Button",
			"props": { "value": "IP/MAC解绑" }
		},
		{
			"id": "terminalTblBindBtn",
			"component": "Button",
			"props": { "value": "IP/MAC绑定" }
		},
		{
			"id": "terminalTblGuardListBtn",
			"component": "Button",
			"props": { "value": "已守护列表" }
		},
		{
			"id": "terminalTblSpeedLimitBtn",
			"component": "Button",
			"props": { "value": "已限速列表" }
		},
		{
			"id": "terminalTblRefreshBtn",
			"component": "Button",
			"props": { "icon": "refresh-ccw" }
		},
		{
			"id": "terminalTblTable",
			"component": "Table",
			"props": {
				"rowKey": "id",
				"dataSource": { "path": "/tableData" },
				"columns": [
					{
						"title": "终端名称",
						"dataIndex": "terminalName",
						"minWidth": 223
					},
					{
						"title": "终端类型",
						"dataIndex": "terminalType",
						"minWidth": 223
					},
					{
						"title": "IP地址",
						"dataIndex": "ipAddress",
						"minWidth": 223
					},
					{
						"title": "MAC地址",
						"dataIndex": "macAddress",
						"minWidth": 223
					},
					{
						"title": "VLAN",
						"dataIndex": "vlan",
						"minWidth": 223
					},
					{
						"title": "厂商",
						"dataIndex": "manufacturer",
						"minWidth": 223
					},
					{
						"title": "型号",
						"dataIndex": "model",
						"minWidth": 223
					},
					{
						"title": "系统",
						"dataIndex": "os",
						"minWidth": 223
					},
					{
						"title": "在线时长",
						"dataIndex": "onlineDuration",
						"minWidth": 223
					},
					{
						"title": "接入时间",
						"dataIndex": "accessTime",
						"minWidth": 223
					},
					{
						"title": "上行速率",
						"dataIndex": "uplinkRate",
						"minWidth": 223
					},
					{
						"title": "下行速率",
						"dataIndex": "downlinkRate",
						"minWidth": 223
					},
					{
						"title": "流量消耗",
						"dataIndex": "trafficConsumed",
						"minWidth": 223
					},
					{
						"title": "接入设备",
						"dataIndex": "accessDevice",
						"minWidth": 223
					},
					{
						"title": "守护状态",
						"dataIndex": "guardStatus",
						"minWidth": 223
					},
					{
						"title": "连接Wifi",
						"dataIndex": "connectionWifi",
						"minWidth": 223
					},
					{
						"title": "操作",
						"dataIndex": "operate",
						"minWidth": 223
					}
				],
				"rowSelection": {
					"type": "checkbox",
					"selectedRowKeys": { "path": "/selectedRowKeys" }
				}
			},
			"children": {
				"path": "/tableData",
				"componentId": "terminalTblTableRow"
			}
		},
		{
			"id": "terminalTblTableRow",
			"component": "TableRow",
			"children": [
				"terminalTblCellTerminalName",
				"terminalTblCellUplinkRate",
				"terminalTblCellDownlinkRate",
				"terminalTblCellGuardStatus",
				"terminalTblCellOperate"
			],
			"props": {}
		},
		{
			"id": "terminalTblCellTerminalName",
			"component": "div",
			"props": {
				"dataIndex": "terminalName",
				"className": "flex items-center gap-[0.375rem] whitespace-nowrap"
			},
			"children": ["terminalTblCellNameIcon", "terminalTblCellNameText"]
		},
		{
			"id": "terminalTblCellNameIcon",
			"component": "Icon",
			"props": {
				"name": { "path": "terminalNameIcon" },
				"color": "#777777",
				"className": "w-4 h-4 whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "terminalTblCellNameText",
			"component": "span",
			"props": {
				"value": { "path": "terminalName" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "terminalTblCellUplinkRate",
			"component": "div",
			"props": {
				"dataIndex": "uplinkRate",
				"className": "flex items-center gap-[0.25rem] whitespace-nowrap"
			},
			"children": ["terminalTblCellUplinkValue", "terminalTblCellUplinkIconEl"]
		},
		{
			"id": "terminalTblCellUplinkValue",
			"component": "span",
			"props": {
				"value": { "path": "uplinkRate" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "terminalTblCellUplinkIconEl",
			"component": "Icon",
			"props": {
				"name": "arrow-up",
				"color": "primary",
				"className": "w-3 h-3 whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "terminalTblCellDownlinkRate",
			"component": "div",
			"props": {
				"dataIndex": "downlinkRate",
				"className": "flex items-center gap-[0.25rem] whitespace-nowrap"
			},
			"children": ["terminalTblCellDownlinkValue", "terminalTblCellDownlinkIconEl"]
		},
		{
			"id": "terminalTblCellDownlinkValue",
			"component": "span",
			"props": {
				"value": { "path": "downlinkRate" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "terminalTblCellDownlinkIconEl",
			"component": "Icon",
			"props": {
				"name": "arrow-down",
				"color": "success",
				"className": "w-3 h-3 whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "terminalTblCellGuardStatus",
			"component": "div",
			"props": {
				"dataIndex": "guardStatus",
				"className": "flex items-center gap-[0.375rem] whitespace-nowrap"
			},
			"children": ["terminalTblCellGuardIconEl", "terminalTblCellGuardTextEl"]
		},
		{
			"id": "terminalTblCellGuardIconEl",
			"component": "Icon",
			"props": {
				"name": { "path": "guardIcon" },
				"color": "#777777",
				"className": "w-4 h-4 whitespace-nowrap",
				"shape": "outline"
			}
		},
		{
			"id": "terminalTblCellGuardTextEl",
			"component": "span",
			"props": {
				"value": { "path": "guardStatus" },
				"className": "text-md text-on-surface whitespace-nowrap"
			}
		},
		{
			"id": "terminalTblCellOperate",
			"component": "div",
			"props": {
				"dataIndex": "operate",
				"className": "flex items-center gap-[0.25rem] whitespace-nowrap"
			},
			"children": ["terminalTblCellOperateEdit", "terminalTblCellOperateLink"]
		},
		{
			"id": "terminalTblCellOperateEdit",
			"component": "Button",
			"props": {
				"icon": "pencil",
				"types": "link",
				"size": "small"
			}
		},
		{
			"id": "terminalTblCellOperateLink",
			"component": "Button",
			"props": {
				"icon": "link",
				"types": "link",
				"size": "small"
			}
		}
	],
	state: {
		"brandLogoIcon": "huawei",
		"brandText": "华为坤灵",
		"projectName": "企业网络管理平台",
		"notificationIcon": "bell",
		"notificationBadgeCount": 5,
		"userAvatarImage": "https://randomuser.me/api/portraits/men/32.jpg",
		"homeButtonText": "返回首页",
		"topMenuIcons": [
			{
				"iconName": "layout-dashboard",
				"label": "仪表盘",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "server",
				"label": "设备管理",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "activity",
				"label": "流量监控",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "shield",
				"label": "安全中心",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "monitor",
				"label": "终端设备",
				"isActive": true,
				"color": "primary"
			},
			{
				"iconName": "settings",
				"label": "系统设置",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "users",
				"label": "用户管理",
				"isActive": false,
				"color": "#777777"
			},
			{
				"iconName": "file-text",
				"label": "日志审计",
				"isActive": false,
				"color": "#777777"
			}
		],
		"bottomMenuIcons": [{
			"iconName": "help-circle",
			"label": "帮助中心",
			"isActive": false,
			"color": "#777777"
		}, {
			"iconName": "log-out",
			"label": "退出登录",
			"isActive": false,
			"color": "#777777"
		}],
		"card1_terminalType": {
			"cardTitle": "终端类型",
			"centerNumber": 12,
			"centerLabel": "总数",
			"chartData": [
				{
					"name": "手机",
					"value": 33.33
				},
				{
					"name": "家居设备",
					"value": 33.33
				},
				{
					"name": "平板",
					"value": 16.67
				},
				{
					"name": "其他",
					"value": 16.67
				}
			]
		},
		"card2_accessType": {
			"cardTitle": "接入类型",
			"centerNumber": 12,
			"centerLabel": "总数",
			"chartData": [{
				"name": "有线",
				"value": 66.66
			}, {
				"name": "无线",
				"value": 33.34
			}]
		},
		"card3_terminalTrafficTop5": {
			"cardTitle": "终端流量使用",
			"chartData": [
				{
					"name": "iPhone12 (00:E0:4C:1A:2B:3C)",
					"value": 1869
				},
				{
					"name": "OPPO (00:E0:4C:7D:8E:9F)",
					"value": 1016
				},
				{
					"name": "Mate70 (00:E0:4C:4A:5B:6C)",
					"value": 664
				},
				{
					"name": "iPhone16 (00:E0:4C:0A:1B:2C)",
					"value": 167
				},
				{
					"name": "iPad (00:E0:4C:3A:4B:5C)",
					"value": 167
				}
			]
		},
		"card3DropdownMenu": [{
			"label": "Top5",
			"key": "top5"
		}, {
			"label": "Top10",
			"key": "top10"
		}],
		"card4_appTrafficTop5": {
			"cardTitle": "应用流量使用",
			"chartData": [
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
			]
		},
		"card5_terminalOnlineDuration": {
			"cardTitle": "终端在线时长",
			"yAxisLabel": "终端数",
			"yAxisTicks": [
				0,
				20,
				40,
				60,
				80,
				100
			],
			"xAxisLabels": [
				"小于1h",
				"1-3h",
				"3-6h",
				"6-8h",
				"大于8h"
			],
			"chartData": [
				{
					"name": "小于1h",
					"value": 42
				},
				{
					"name": "1-3h",
					"value": 68
				},
				{
					"name": "3-6h",
					"value": 55
				},
				{
					"name": "6-8h",
					"value": 30
				},
				{
					"name": "大于8h",
					"value": 15
				}
			]
		},
		"cardTitle": "终端用户",
		"searchPlaceholder": "请输入搜索内容",
		"searchValue": "",
		"tableData": [
			{
				"id": 1,
				"isSelected": false,
				"terminalName": "HUAWEI Mate60 Pro",
				"terminalNameIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.1",
				"macAddress": "0O:E0:FC:12:34:56",
				"vlan": 204,
				"manufacturer": "HUAWEI",
				"model": "Mate60 Pro",
				"os": "HarmonyOS 4.0",
				"onlineDuration": "9min",
				"accessTime": "2022-07-15 08:32:21",
				"uplinkRate": "3.30Kbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "4.61Kbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "3.4GB",
				"accessDevice": "Android AP-01",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardIconColor": "success",
				"connectionWifi": "Wifi_HUAWEI_5G",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 2,
				"isSelected": false,
				"terminalName": "iPhone 15 Pro Max",
				"terminalNameIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.2",
				"macAddress": "0O:E0:FC:AB:CD:EF",
				"vlan": 101,
				"manufacturer": "Apple",
				"model": "A2849",
				"os": "iOS 17.0",
				"onlineDuration": "1h 23min",
				"accessTime": "2022-07-15 07:10:05",
				"uplinkRate": "1.20Mbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "5.80Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "8.2GB",
				"accessDevice": "iPhone AP-01",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardIconColor": "#777777",
				"connectionWifi": "Wifi_Apple_Office",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 3,
				"isSelected": false,
				"terminalName": "iPad Pro 12.9",
				"terminalNameIcon": "tablet",
				"terminalType": "平板",
				"ipAddress": "192.168.1.3",
				"macAddress": "0O:E0:FC:11:22:33",
				"vlan": 102,
				"manufacturer": "Apple",
				"model": "A2377",
				"os": "iPadOS 16.0",
				"onlineDuration": "4h 15min",
				"accessTime": "2022-07-15 03:44:12",
				"uplinkRate": "2.10Mbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "6.30Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "15.6GB",
				"accessDevice": "iPad AP-01",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardIconColor": "success",
				"connectionWifi": "Wifi_Apple_Home",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 4,
				"isSelected": false,
				"terminalName": "OPPO Find X6",
				"terminalNameIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.4",
				"macAddress": "0O:E0:FC:44:55:66",
				"vlan": 205,
				"manufacturer": "OPPO",
				"model": "PGEM10",
				"os": "ColorOS 13.0",
				"onlineDuration": "35min",
				"accessTime": "2022-07-15 08:25:00",
				"uplinkRate": "890Kbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "1.02Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "1.8GB",
				"accessDevice": "OPPO AP-01",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardIconColor": "#777777",
				"connectionWifi": "Wifi_OPPO_Office",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 5,
				"isSelected": false,
				"terminalName": "Microsoft Surface Pro 9",
				"terminalNameIcon": "laptop",
				"terminalType": "笔记本",
				"ipAddress": "192.168.1.5",
				"macAddress": "0O:E0:FC:77:88:99",
				"vlan": 103,
				"manufacturer": "Microsoft",
				"model": "Surface Pro 9",
				"os": "Windows 11 Pro",
				"onlineDuration": "6h 42min",
				"accessTime": "2022-07-15 02:18:33",
				"uplinkRate": "4.50Mbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "10.20Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "45.2GB",
				"accessDevice": "Surface AP-01",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardIconColor": "success",
				"connectionWifi": "Wifi_Microsoft_Corp",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 6,
				"isSelected": false,
				"terminalName": "Samsung Galaxy Tab S9",
				"terminalNameIcon": "tablet",
				"terminalType": "平板",
				"ipAddress": "192.168.1.6",
				"macAddress": "0O:E0:FC:AA:BB:CC",
				"vlan": 104,
				"manufacturer": "Samsung",
				"model": "SM-X910",
				"os": "Android 14",
				"onlineDuration": "2h 08min",
				"accessTime": "2022-07-15 06:52:17",
				"uplinkRate": "1.80Mbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "3.50Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "6.7GB",
				"accessDevice": "Samsung AP-01",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardIconColor": "#777777",
				"connectionWifi": "Wifi_Samsung_Guest",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 7,
				"isSelected": false,
				"terminalName": "Xiaomi 13 Ultra",
				"terminalNameIcon": "smartphone",
				"terminalType": "手机",
				"ipAddress": "192.168.1.7",
				"macAddress": "0O:E0:FC:DD:EE:FF",
				"vlan": 206,
				"manufacturer": "Xiaomi",
				"model": "2304FPN6DC",
				"os": "MIUI 14",
				"onlineDuration": "12min",
				"accessTime": "2022-07-15 08:48:59",
				"uplinkRate": "560Kbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "720Kbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "0.5GB",
				"accessDevice": "Xiaomi AP-01",
				"guardStatus": "守护中",
				"guardIcon": "shield-check",
				"guardIconColor": "success",
				"connectionWifi": "Wifi_Xiaomi_Home",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			},
			{
				"id": 8,
				"isSelected": false,
				"terminalName": "Dell Latitude 7440",
				"terminalNameIcon": "laptop",
				"terminalType": "笔记本",
				"ipAddress": "192.168.1.8",
				"macAddress": "0O:E0:FC:11:2A:3B",
				"vlan": 105,
				"manufacturer": "Dell",
				"model": "Latitude 7440",
				"os": "Windows 10 Enterprise",
				"onlineDuration": "8h 20min",
				"accessTime": "2022-07-15 00:40:11",
				"uplinkRate": "6.10Mbps",
				"uplinkIcon": "arrow-up",
				"downlinkRate": "14.70Mbps",
				"downlinkIcon": "arrow-down",
				"trafficConsumed": "78.3GB",
				"accessDevice": "Dell AP-01",
				"guardStatus": "未守护",
				"guardIcon": "shield-off",
				"guardIconColor": "#777777",
				"connectionWifi": "Wifi_Dell_Corp",
				"operateEditIcon": "pencil",
				"operateLinkIcon": "link"
			}
		],
		"selectedRowKeys": [],
		"pageInfo": {
			"currentPage": 1,
			"pageSize": 8,
			"totalItems": 128
		}
	}
};
//#endregion
export { data_default as default };
