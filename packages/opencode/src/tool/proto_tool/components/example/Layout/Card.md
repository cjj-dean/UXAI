# Card | 卡片

### Example: Basic Card with children
```json
{
  "id": "basicCard",
  "component": "Card",
  "props": {
    "className": "flex flex-row gap-[1rem] p-[1.5rem]"
  },
  "children": ["cardIcon", "cardContent"]
}
```

### Example: Card with title
```json
{
  "id": "titleCard",
  "component": "Card",
  "props": {
    "title": "安全策略概览",
    "className": "flex flex-col gap-[1rem] p-[1.5rem]"
  },
  "children": ["cardStat1", "cardStat2"]
}
```

### Example: Card with template children (list)
```json
{
  "id": "strategyCard",
  "component": "Card",
  "props": {
    "className": "flex flex-row gap-[1rem] p-[1.5rem]"
  },
  "children": {
    "path": "/strategies",
    "componentId": "strategyItem"
  }
}
```

### Card styling rules
- **default variant**: Built-in bg-surface-container-highest + shadow-sm + rounded-xl. Do NOT add these manually.
- **二级卡片**: Use Card + `bg-surface-variant rounded-[16px]` in className, no shadow.
- Card className is for LAYOUT ONLY (flex, gap, padding, sizing). Do NOT add bg-*, shadow-*, rounded-* that conflict with built-in styles.
- Card already provides padding (p-[1.5rem]). Do NOT add redundant p-* unless overriding.
