精准细节型：

**项目名称：** Nexus ERP (Supply Chain Management) 响应式后台界面
**布局架构：**
* **侧边导航 (Sidebar)：** 垂直 Flex 布局。顶部 Logo 区；中部菜单组（Dashboard, Directory-Active, Qualifications, Performance, Audit Logs）；底部固定 Settings 与 Support。
* **顶部操作栏 (Top Bar)：** 水平两端对齐。左侧 Search Input（Placeholder: "搜索供应商或文件"）；右侧为 Icon Button 组（Notice, Help）及 User Profile（SCM_ADMIN）。


**主内容区 (Main Layout)：** 左右双栏布局。
* **左栏 - 供应商目录模块：**
* **Header：** 包含 `h2` 标题 "供应商商库 (Supplier Directory)" 及辅助文本 "当前管理 248 家活跃供应商"；右侧放置 Primary Button "+ 新增供应商"。
* **Table Container：** 表头包含“公司名称、类别、资质状态、综合评分、操作”。具体数据流：包含 Global Tech Logistics (有效, 94) 以及 Eco-Wrap Packaging (已过期, 评分 56 标记为 Danger 红色)。资质状态需使用颜色标签（Tag）承载。

* **右栏 - 详情透视组件 (Details Sidebar)：** 垂直间距 16px 的三段式卡片。
1. **供应商概览：** 包含企业头像、标题、18 位信用代码、4.8/5.0 星级评价器。下方双列展示联系人（张伟 Li Zhang）与所属地区。
2. **文件列表 (QUALIFICATION DOCUMENTS)：** 列表项结构为 [文件图标 + 文件名 + 到期日]。示例：营业执照副本.pdf (2026-12-31)。
3. **年度绩效矩阵 (ANNUAL PERFORMANCE)：**          * **数据表：** 维度轴 [质量, 交付, 价格] × 时间轴 [2023, 2022, 2021]。需填入对应数值（如质量：96, 94, 92）。
* **Footer：** 放置一个 Progress 条，并在下方右侧标注文本 "综合绩效提升率：+2.4% 自去年起"，要求“+2.4%”高亮显示。