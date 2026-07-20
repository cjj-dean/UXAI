### 边框和分割线
  - border-base 的使用限制：border-base 仅可用于扁平、无海拔 (无 shadow) 的元素外壳。例如：默认表单输入框、卡片内部嵌套的次级扁平区块、空状态占位图。
  - 内部线降噪：任何容器内部的分割线、列表项之间的界线，必须使用最低视觉噪音的 border-divider，严禁使用 border-base。
  - **Divider 使用约束（关键）**：
    - **禁止创建独立的分割线 div**（如 `h-[1px] bg-divider`、`border-t` 空元素）来分隔两个已有视觉边界的组件。Tabs 自带底部边框、Section 自带阴影和背景，它们之间不需要额外的分割线。
    - 需要在两个同级组件之间增加视觉分隔时，优先使用 `gap-[1rem]` 间距或 `border-b border-divider` 加在上方组件自身，而非插入独立的分割线元素。