## Icon
> Lucide 图标组件。
> id: string | component: "Icon" | props: object

### props (required: name)
- `name`: string | DataBinding — 合法 kebab-case Lucide 图标名（如 "circle-check", "search", "chevron-right"）
- `color?`: "success" | "primary" | "error" | "default" | "warning" | "critical" | "inverse" | hex — 语义色
- `shape?`: "outline" | "fill" | "square" | "circle" — 图标背景形状（自动配色）
- `className?`: string — Tailwind 类，**必须显式指定 w- 和 h- 尺寸**

### Example: Icon basic
```json
{
  "id": "iconProcess",
  "component": "Icon",
  "props": { "name": "circle-check", "color": "primary", "shape": "circle", "className": "w-6 h-6" }
}
```


### Iconography
  Icon shape is strictly determined by its Tailwind size.
  - **Size by Context:** 顶部导航栏/侧边栏: `w-5 h-5` | 卡片标题/表头旁: `w-4 h-4` | 表格单元格: `w-4 h-4` | 下拉箭头/小辅助: `w-3 h-3`
  - **Color:** 统一用 `color` prop，禁止在 className 中用 `text-*` 设色。中性装饰: `"#777777"` | 品牌: `"primary"` | 语义: `"success"|"warning"|"error"|"primary"`
  - **Shape:** ≤ w-6 必须用 `outline` | > w-6 必须用 `circle|square`。`circle`用于全局状态/空状态，`square`用于数据指标/模块入口。
  - **Constraints:** 不要手动包裹背景形状；禁止 default(黑)/inverse(白)色值。