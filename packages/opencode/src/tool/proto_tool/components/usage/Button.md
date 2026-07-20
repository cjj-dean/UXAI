### Buttons
  - **状态色:** 通过color属性 `default | primary | danger` 给按钮设定状态色.
  - **约束:** 
    - 不要在classname中设定色值背景色和文字色.
    - 在Table内时，当按钮包含文本内容时，必须使用`types=link`形态
    - 按钮在容器内优先靠右摆放
    - 按钮仅在Table内使用size: small，其他场景禁止使用small尺寸.
    - **Structural Parity**: Side-by-side buttons must share identical structures (All-Text, All-Icon, or All-Icon+Text). Mixing structures within a single row is prohibited to maintain visual parity.