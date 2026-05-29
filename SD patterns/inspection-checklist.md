# 验收自检清单 (Inspection Checklist)

> **何时使用**：在代码编写完成后、交付给用户前，AI Agent 和开发者**必须**逐条核对本清单。全部通过后方可交付；任何一项不通过，必须修复后重新自检。

## 1. 颜色与视觉
- [ ] **无硬编码颜色**：全部使用 CSS 变量或 Token（`var(--sase-color-*)`），严禁出现硬编码 hex（如 `#ffffff`、`#f52727`）。（来源：[design-color.md](../SD%20Global%20Styles/design-color.md)）
- [ ] **状态色语义正确**：正确区分 info(蓝) / warning(黄) / risk(橙) / error(红) / fatal(暗红) 级别。（来源：[design-color.md](../SD%20Global%20Styles/design-color.md)）
- [ ] **阴影 Token**：阴影使用标准 Token（`boxShadowSm / Md / Lg`），严禁手写 `rgba` 阴影。
- [ ] **去除外发光**：禁止蓝色外发光阴影（focus 态 `box-shadow: none`）。

## 2. 尺寸与排版
- [ ] **间距规范**：margin / padding 必须严格属于 `{2, 4, 8, 12, 16, 24, 32}`。（来源：[design-atomic-spacing.md](../SD%20Global%20Styles/design-atomic-spacing.md)）
- [ ] **字号规范**：font-size 必须属于 `{10, 12, 14, 16, 20, 24, 30}`。（来源：[design-typography.md](../SD%20Global%20Styles/design-typography.md)）
- [ ] **字重与行高**：字重仅为 400 或 600；行高 = 字号 + 8px。
- [ ] **层级圆角**：控件 2px (`sm`) / 容器 4px (`md`) / 强调容器 8px (`lg`) / 表格 0px。严禁混用。
- [ ] **Label 宽度实测**：表单 Label 宽度必须在浏览器中实测对齐，禁止纯数学推算。

## 3. 组件与交互
- [ ] **主按钮唯一性**：按钮 `mode` 语义正确，原则上**一屏只有一个 primary 按钮**。（来源：[dos-and-donts.md](./dos-and-donts.md)）
- [ ] **动效 Token**：动效时长和曲线必须使用 motion Token（`0.18s / 0.24s / 0.3s`）。（来源：[visual-theme.md](./visual-theme.md)）
- [ ] **指针状态**：可点击元素 hover 时必须有 `cursor: pointer`；disabled 状态保持 `cursor: not-allowed`，不要被覆盖。
- [ ] **规范化浮层**：弹窗/抽屉/气泡必须使用 `a-modal / a-drawer / a-popover` 等规范组件，严禁自行实现基础浮层。
- [ ] **单行标签 (Tag)**：标签仅允许单行文字，禁止折行；空间不足时以省略号截断（`truncate`）并在悬浮时显示全称（`title` 或 Tooltip）。（来源：[comp-tag.md](../SD%20Components/comp-tag.md)）
- [ ] **高频组件达标**：检视使用到的基础组件（button, input, select, table, switch, search 等）是否完全符合 SASE 组件规范。

## 4. 架构与质量
- [ ] **响应式断点**：响应式布局必须使用规范的 4 个断点之一，而不是任意写 px 值。
- [ ] **CSS 命名空间**：业务 Class 命名必须加项目前缀，严禁污染 `sase-` 命名空间。
- [ ] **无 !important 冲突**：检查同一属性是否存在多条 `!important` 规则互相覆盖（避免特异性冲突）。
- [ ] **视觉验证交付**：布局/样式修改后，**必须**在浏览器（或借助 DevTools 截图）中完成实际渲染视觉验证，不能仅凭 `build` 成功就认为完成。
