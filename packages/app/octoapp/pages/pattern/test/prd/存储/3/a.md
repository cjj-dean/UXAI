
头部导航[两端对齐]；左侧是华为Logo与 DME IQ 的组合，右侧是：搜索图标、通知图标、文档列表图标、带有用户名 Jasper 的用户头像，以及一个帮助图标。

侧边导航采用手风琴（accordion）布局。数据如下
第 1 组：Home。
第 2 组：Assets（已展开），包含当前高亮激活的子项 Storage (21)，以及 Servers (25)。
第 3 组：Analytics（已展开），包含 Applications、VMs、Storage Performance 和 Disk Risk。
第 4 组：Planning（已展开），包含 Workload 和 Capacity。
第 5 组：Messages（已展开），包含 Alerts。
第 6 组：Support（已展开），包含 Service Requests 和 Warranty Contracts。
第 7 组：Admin（已展开），包含 Multi-tenant、Authorization、Notification 和 Operation Logs。
第 8 组：Report。

主内容区自上而下排列，边距统一。顶部是一个粗体大字号的“Storage”标题。

下方是选项卡（Tab）导航区，包含“Enterprise Storage”（当前激活状态，底部有高亮指示线）和“Distributed Storage”。整个选项卡区域底部有一条全宽边框线。

选项卡下方是两端对齐的工具栏。左侧是一个固定宽度的搜索输入框，带有搜索放大镜图标和占位符“Filter”。右侧水平对齐排列以下元素：文本“Total: 18/18”、一个显示“Sort by Health Score”的下拉选择器，以及一个列表/网格视图切换图标按钮。

工具栏下方是核心数据展示区,一共16个卡片，采用网格布局，一行4个卡片。每个卡片是一个{{独立区块}}，具有完全相同的结构。

卡片顶部信息区包含两行。第一行左侧为设备名称Huawei_Dorado79，紧跟一个向上箭头图标，右侧是“Critical”或“Major”的状态徽章。下面显示文本“Site: Chengdu, Sichua Model: Dorado5000 V3”。

第三行分为左右两列（重要），宽度比例为 5:5。
1、左侧圆环进度图（单值进度），图表固定宽高150px。
2、右侧为文本展示区，全部用纯文本信息展示。容量部分包含标题Capcity，下方一行左侧为已使用比例（纯文本），右侧为可用空间（Free TB）。部分卡片在此下方还有额外一行，带有一个文档图标和数据缩减率（Data Reduction）。性能部分包含标题Performance，随后是三行数据，分别是延迟（Latency）、IOPS 和带宽（Bandwidth），每行均采用左侧标签、右侧数值的对齐方式。