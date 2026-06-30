精准细节型：

请严格按照以下结构化描述生成 React/Tailwind 前端页面代码。忽略视觉装饰，聚焦于 DOM 结构与文本数据：
**1. 全局导航框架：**
* **Top Nav:** 左侧 'HRMS Core'；中间 'Overview, People, Directory'；右侧包含 Search (placeholder: "Search employees...")、通知与设置图标、带绿色状态灯的用户头像。
* **Side Nav:** 顶部 'Employee Portal - LIFECYCLE MANAGEMENT'；下方菜单包含 Overview (Active), Career Path, Compensation, Contracts, Performance。
* 
**2. 个人资料区 (Header Card):**
* 水平容器。左侧为头像；中间包含姓名 'Zhang Wei' (附绿色标签 'ACTIVE') 和职位 'Senior Product Manager'；下方展示工号 'EMP-2021008'、部门 'Product Design' 及入职日期 'Joined June 15, 2021'；右侧放置 'Edit Profile' 与 'Export PDF' 按钮。

**3. 中部核心区 (Two-Column Layout):**
* **Left (Career Path):** 标题为 'Career Path' 并带 'Full History' 链接。内部为纵向时间轴，包含四个节点（自底向上）：
1. Onboarding (June 15, 2021): 加入 Core Platform 团队。
2. Promotion (Jan 10, 2022): 晋升 PM 职位。
3. Dept Transfer (Aug 22, 2023): 转入设计团队。
4. Promotion [Present]: 晋升为 Senior PM。

* **Right (Financials & Review):**
* **Compensation Card:** 顶部展示底薪 '$142,500 (↑ 8% vs LY)' 与奖金 '$15,000'；中部为 'Compensation Growth Trend' 柱状图（横轴 2021-2024）；底部列出福利：Health (Fully Covered) 和 401(k) Match (5.0%)。
* **Review Card:** 蓝色背景，标题 'NEXT REVIEW'，内容 'Annual Appraisal'，附带右侧气泡标签 'In 45 Days'。

**4. 底部文档表格 (Contracts Table):**
* 标准 Table。表头：Document Name, Contract Type, Signed Date, Expiry Date, Actions。
* 数据行（包含 PDF 图标占位）：
1. Main Employment Agreement | Permanent | June 10, 2021 | N/A | Download
2. Promotion Addendum - SPM | Amendment | Jan 15, 2024 | N/A | Download
3. NDA & Intellectual Property | Compliance | June 10, 2021 | Indefinite | Download”