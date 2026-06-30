精准细节型：

任务：生成高度结构化的‘Nexus ERP’总账中心前端页面。请严格按照以下文本和布局实现：
**【全局架构】**
* **System & Path:** 系统名 Nexus ERP (Financial Enterprise Suite)；面包屑路径为 FINANCE GENERAL LEDGER。
* **Sidebar:** 垂直导航包含 Overview, AR/AP, Procurement, Logistics, Vendors, General Ledger (Active), Audit Logs。底部含 [+ New Voucher] 按钮及 Settings/Support。
* **Header:** 搜索框占位符 'Search accounts, vouchers, or reports...'；右侧集成 [Export Report] 按钮及用户信息 (Zhou Wei, Financial Officer)。

**【主内容区】**
* **Metric Cards:** 横向布局四个卡片：
1. TOTAL ASSETS: ¥45,280,400.00 (+12.5% from last month)。
2. TOTAL LIABILITIES: ¥21,150,200.50 (+4.2% from last month)。
3. EQUITY: ¥24,130,199.50 (Updated 5m ago)。
4. TRIAL BALANCE STATUS: 'BALANCED' (Difference: ¥0.00)。

* **Filter Bar:** 包含 Date Range (mm/dd/yyyy 双选框)、Account Type 下拉框 (All Accounts)、Status 切换组 (ALL/POSTED/DRAFT)，以及 [Advanced Filters] 与 [+ New Journal Voucher] 按钮。

**【数据展现层】**
* **Data Table:** 表头字段包含 Voucher ID, Date, Primary Account, Debit, Credit, Status。
* 数据示例：#GL-2024-0892, 2024-10-15, 1002-Bank Deposit, 借方 ¥12,450.00, POSTED。

* **Pagination:** 左侧显示 'Showing 1-15 of 2,450 results'，右侧为数字页码及翻页箭头。

**【辅助信息层】**
* **Detail Panel (Voucher Details):** 右侧悬浮/侧滑展示。
* 信息块：ID (#GL-2024-0892)、Period (2024-10)、Description (Payment for quarterly office supply replenishment...)。
* 记账明细：Double Entry 区域明确区分 DEBIT (1002-Bank Deposit) 与 CREDIT (1122-Accounts Receivable)，金额均为 ¥12,450.00。
* 附件区：SOURCE DOCUMENT 模块，显示 PDF 文档预览及 [View Full Attachment] 按钮。