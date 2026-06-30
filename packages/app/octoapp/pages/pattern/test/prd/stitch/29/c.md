精准细节型：

**系统原型：** 企业级 HR 管理系统 “HRConnect Pro”，当前路由路径：`Global Ops / HR Administration / Rostering`。
**一、 全局框架布局：**
* **顶部导航：** 左侧显示系统文本；中间为搜索框（Placeholder: "Search employees, schedules, rules..."）；右侧集成通知、帮助图标及圆形用户头像。
* **侧边导航：** 顶部标注业务组 “Global Ops”；菜单项垂直排列（Dashboard, Team Schedule, Attendance, Leave Management, **Rostering [Active]**, Reports）；底部固定一个全宽蓝色 “Clock In/Out” 按钮及设置/支持入口。

**二、 主视图头部 (Header Section)：**
* 左侧：H1 标题 “Attendance & Rostering”，副标题 “Manage shift cycles, team schedules, and resolve punch-in anomalies.”。
* 右侧：并排操作按钮组 [Export Report] 与 蓝色带 “+” 图标的 [New Shift Rule]。

**三、 核心交互区 (Main Layout)：**
* **左侧纵向双卡片 (Column 1)：**
1. **Shift Configuration：** 包含下拉选框（选中值: "General R&D (Flexible)"）；弹性规则开关 [On]；两个时间输入（08:30 AM / 10:30 AM）；休息间隔列表（午休 12:00-13:00，下午休 15:30-15:45）；底部显示夜班补贴 ¥120/day。
2. **Exception Workbench：** 标题带红色徽标 [8 Pending]。展示两个异常实例：员工 Chen, Wei（定位异常，偏移 5.2km）；员工 Sarah Jenkins（未打下班卡，系统自动登出）。

* **右侧调度日历 (Column 2)：**
1. **头部控件：** 显示 "September 2023"，带 Today 快捷键及 [Week]/Month/Team View 切换器。
2. **警告横幅：** 顶部悬浮橙色 Banner：“Shift Conflict Detected: 3 Engineers on leave simultaneously for Sept 14th. Operational risk is HIGH.”。
3. **周历视图 (Mon 11 - Sun 17)：** 详细渲染每日班次块。**Thu 14** 需特别标红显示“Ops Team B (Conflict) 09:00-18:00”。底部显示四色图例（R&D, CS, Ops, Conflict）。

**四、 底部状态区 (Footer Module)：**
* 标题 “Recent Schedule Adjustments”，链接 “View History Log”。
* 并排三个信息单元：Elena Rodriguez（换班请求-待审批）、Mark Zuckerberg（加班确认-3.5h）、Li Na（请假批准-9月20-22日）。所有单元均含员工头像与时间戳状态。
