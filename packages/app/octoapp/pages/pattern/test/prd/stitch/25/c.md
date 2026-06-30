精准细节型：


 **Nexus ERP** 财务管理界面：
**一、 框架与导航**
* **布局**：左侧固定宽度导航栏（深色系），顶部水平搜索栏，中部响应式主体。
* **侧边栏**：顶部 Logo，中间菜单（OVERVIEW, AR/AP MANAGEMENT [Active], PROCUREMENT 等），中部嵌入‘+ NEW TRANSACTION’大按钮。
* **顶部栏**：左侧带占位符的搜索框，右侧对齐‘通知、帮助、设置’图标及用户信息（Alex Thompson, Financial Controller）。

**二、 主内容区（上下堆叠）**
1. **统计层**：4 个等宽卡片水平排列。
* **例**：'Overdue Receivables' 核心值 $12,450.00，底部左侧标注 '5 Critical Invoices'，右侧红色高亮显示 'High Alert'。

2. **表格层（白色容器）**：
* **头部**：左侧为 Tab 切换（Accounts Receivable/Payable）；右侧对齐两个下拉筛选器。
* **工具栏**：表格上方左侧为按钮组（MATCH INVOICE等），右侧为数据统计（Showing 1-10 of 124）。
* **表格细节**：7 列结构。`INVOICE ID` 列需支持双层显示（ID 下方带红/黄色的逾期天数小字）；`STATUS` 使用胶囊标签；`REMAINING` 为 0 时文本置灰；末尾 `ACTIONS` 为垂直三点图标。
* **分页**：底部左侧显示每页行数切换，右侧显示箭头分页符。

3. **辅助层（底部横向）**：
* **左侧卡片 (60%)**：Liquidity Insight，含文本段落及蓝色对齐链接 'Run Collection Workflow'。
* **右侧卡片 (40%)**：Upcoming Payables，列表每行两端对齐，展示公司名与状态（如 AUTO-PAY READY）。

**三、 文本数据**
* 版权信息置于页脚居中：© 2024 NEXUS ENTERPRISE SOLUTIONS • SYSTEM V4.2.1-STABLE。