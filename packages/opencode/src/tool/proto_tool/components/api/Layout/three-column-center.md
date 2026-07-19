# 三列居中对齐

当蓝图描述"左侧/中间/右侧"或"左-中-右"布局且中间列必须相对于父容器水平居中时，按以下方式实现：

- 父容器：`flex flex-row items-center`（禁止 `justify-between` 或 `justify-around`）
- 左列：`flex-1`（扩展填充左侧空间，内容默认左对齐）
- 中间列：固定宽度（如 `w-[400px]`）或自然宽度，不加 `flex-1` 或 `mx-auto`
- 右列：`flex-1 flex justify-end`（扩展填充右侧空间，内容右对齐）

原理：左右列 `flex-1` 等分剩余空间，将中间列推到正中心。右列加 `justify-end` 让内容靠右排列。
