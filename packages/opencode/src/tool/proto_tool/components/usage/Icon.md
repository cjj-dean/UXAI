## Iconography
  Icon shape is strictly determined by its Tailwind size.
  - **Size by Context:** 顶部导航栏/侧边栏: `w-5 h-5` | 卡片标题/表头旁: `w-4 h-4` | 表格单元格: `w-4 h-4` | 下拉箭头/小辅助: `w-3 h-3`
  - **Color:** 统一用 `color` prop，禁止在 className 中用 `text-*` 设色。中性装饰: `"#777777"` | 品牌: `"primary"` | 语义: `"success"|"warning"|"error"|"primary"`
  - **Shape:** ≤ w-6 必须用 `outline` | > w-6 必须用 `circle|square`。`circle`用于全局状态/空状态，`square`用于数据指标/模块入口。
  - **Constraints:** 不要手动包裹背景形状；禁止 default(黑)/inverse(白)色值。