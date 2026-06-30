精准细节型：

 **界面类型**：Nexus ERP 系统的采购订单详情页 (PO Tracking)。
 **1. 框架与全局导航**：
 * **左侧边栏**：顶部显示 Logo，中部为垂直导航菜单（Home, **Purchase Orders-Active**, Vendors, Logistics, Analytics），底部固定一个“+ New Purchase Order” 动作按钮。
 * **顶部通栏**：左侧固定页面标题 “PO Tracking: #20240815-001”；中间为搜索框（Search resources...）；右侧为系统菜单（Dashboard, Inventory, Procurement, Reports）及用户状态区。
 
 **2. 主内容区 - 左侧（占 70% 宽度）**：
 * **订单摘要卡片**：展示订单号、状态标签（IN PROGRESS）、供应商（Global Logistics Solutions）及日期。右上角提供 [Export PDF] 与 [Edit Order] 按钮。
 * **审批工作流**：标题 “APPROVAL WORKFLOW”，横向步骤条展示：Department Head (Approved) - Finance Director (Approved) - General Manager (Pending Review)。
 * **订单明细表格**：标题 “5 Items Listed”。表头包含：Item Code, Description, Quantity, Unit Price, Total, Status。
 * 数据包含：SRV-7742 (4台, $1,240.00), CAB-9011 (12个, $85.00), RACK-2U (2个, $210.00, 状态: BACKORDERED), SUPP-MISC (1套, $350.00)。
 * **统计层**：表格右下方显著显示 Total Amount: **$6,750.00**。

 **3. 主内容区 - 右侧（占 30% 宽度）**：
 * **物流追踪卡片**：显示 DHL Express 信息及 Aug 22 预计送达。包含垂直时间轴节点：Customs Cleared, In Transit, Picked up。底部包含全宽 [Confirm Delivery] 按钮。
 * **文档中心**：标题 “RELATED DOCUMENTS”，展示 Invoice_INV-882.pdf 和 RFQ_GlobalLog_V1.pdf 列表及下载图标。
 * **动态日志**：标题 “ACTIVITY LOG”，展示 Sarah Jenkins 在 2小时前发布的 budget 确认信息。
 
>