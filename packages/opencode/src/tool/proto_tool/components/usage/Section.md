## Section
> 页面框架专用布局容器，替代 `<div>` 构建内容区块。自带 bg-surface-container-highest + shadow-sm + rounded-xl。
> className 只负责布局（flex/gap/padding/sizing/overflow）。
> 适用范围：main、footer 等内容区块。Header 和 Sidebar 不用 Section，用 `<div>` + className。

### props
- `className?`: string — 布局类名（如 flex flex-col gap-[1rem] p-[2rem] flex-1 overflow-y-auto）

### children
类型: string[] — 子元素 ID 数组

### Example: Main Content (Slot Parent)
```json
{
  "id": "main",
  "component": "Section",
  "props": { "className": "flex flex-col flex-1 min-w-0 h-full gap-[1rem] p-[2rem] items-start overflow-y-auto" },
  "children": []
}
```

### Example: Horizontal KPI Row
```json
{
  "id": "kpiRow",
  "component": "Section",
  "props": { "className": "flex flex-row gap-[1rem] items-start" },
  "children": ["kpiCard1", "kpiCard2", "kpiCard3"]
}
```