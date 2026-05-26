---
name: Seerdesign_demo_Skill
description: SeerDesign 视觉规范 Skill —— 根据用户业务场景，快速生成符合 SeerDesign 规范的高保真前端 Demo (技术栈与组件库不设限)
dependency:
  python: []
  system: []
---

# SeerDesign 视觉规范 Skill

## 1. 任务目标

以**网络安全产品经理**视角理解用户的业务场景，然后根据本技能提供的设计规范，快速生成符合 SeerDesign 视觉标准的高保真前端 Demo（技术栈与组件库不限，支持 Vue、React、HTML/CSS 等任意选型）。

## 2. 技术栈

技术栈与组件库选型不设限制，根据用户具体要求或项目现有架构进行开发与适配：

| 项 | 值 |
|---|---|
| 框架 | 灵活不设限（Vue 3、React、SolidJS 或原生 HTML 等，支持 TypeScript/JavaScript） |
| 组件库 | 灵活不设限（Ant Design Vue、Ant Design、Element Plus、Tailwind CSS、shadcn/ui 或原生 CSS 等） |
| 图标 | 灵活不设限（`@ant-design/icons-vue`、`Lucide Icons`、`FontAwesome` 或 SVG 等） |
| 样式 | CSS、Less、Sass、Tailwind CSS 等皆可，必须使用项目中定义的视觉规范与 CSS 变量进行样式适配 |
| 产物 | 根据所选技术栈生成对应的组件/代码文件，并保存至项目指定的 Demo 目录中 |

## 3. 核心原则（必须阅读遵循！！）

### 3.1 去壳留核

无论使用何种组件库或 HTML 元素（如 `AntD`、`Element Plus`、`shadcn/ui` 等），**只借用其交互逻辑与 DOM 骨架，视觉皮肤必须用本技能的 Token 完全覆盖**。任何残留的组件库默认风格（如 Element 默认绿、AntD 默认蓝/圆角等）都视为违规。

### 3.2 零默认值（Zero-Assumption Policy）

禁止凭经验使用前端常规默认值。所有视觉属性**必须来自本技能规范文档**：

- 颜色 → 查 `SD Global Styles/design-color.md`
- 字号/行高/字重 → 查 `SD Global Styles/design-typography.md`
- 间距/圆角/边框 → 查 `SD Global Styles/design-atomic-spacing.md`
- 布局/栅格 → 查 `SD Global Styles/layout-grid.md`

**查不到时停下来追问，不猜值。**

### 3.3 强制自检

每次生成代码后，**必须执行「6. 验收自检清单」**作为最后一步。未通过自检的产物禁止交付。

## 4. 工作流与规范按需加载协议

### 4.1 页面 Demo 制作逻辑（必须遵循！）

```
用户输入业务场景
  ↓
① 需求理解与产品判断：以网络安全产品经理身份分析需求
   - 识别产品关键词（如 SASE, aTrust, XDR, DR 等）
   - 明确页面类型（Dashboard / 列表管理 / 详情 / 表单 / 导航框架等）
   - 拆解功能模块和数据结构
   - 确认交互流程和信息层级
  ↓
② 读取通用页面模板：SD Page Templates/ 下对应模板
  ↓
③ 读取涉及的通用组件规范：SD Components/ 下对应组件
  ↓
④ 读取 Token 基础：SD Global Styles/ 下全部 4 个文件
  ↓
⑤ 读取视觉风格 & 编码模式：
   - SD patterns/visual-theme.md
   - SD patterns/impl-vue3.md (仅在选择 Vue 3 + AntD 技术栈时作为适配参考)
  ↓
⑥ 【按需读取】具体产品规范：
   - 若提及 SASE/云安全访问服务 -> 加载 z-SASE/nav-sase.md
   - 若提及 aTrust/零信任/SDP -> 加载 z-SASE/nav-atrust.md
   - 若提及 XDR/安全托管服务 -> 加载 z-XDR/nav-xdr.md
   - 若提及 DR/端点安全 -> 加载 z-DR/nav-dr.md
  ↓
⑦ 强制检视：「7. 常见踩坑与绝对红线 (Anti-Patterns)」 —— 对照此列表将视觉限制与解决思路应用到所选技术栈中。
⑧ 规范样式提取与生成：在开发制作页面 Demo 时，若使用 Vue 3 + Ant Design Vue 技术栈，优先引入并使用 `SD Base Components/` 下的二次封装组件作为基础；若选用其他技术栈，需对照 `SD Components/` 规范文件和 `SD Base Components/` 的逻辑，采用 CSS 变量或自定义样式进行视觉还原，绝不残留组件库的默认样式。
⑨ 执行「6. 验收自检清单」→ 修复 → 交付
```

### 4.2 页面模板选择规则

根据用户提及的产品关键词，自动选择对应的页面导航框架：

| 产品关键词 | 对应导航框架目录 | 导航特征 |
|---|---|---|
| **SDP, aTrust, SMG, AF** | `SD Page Templates/L-3.0-nav/` | **L 型导航**（顶部一级导航 + 左侧二三级菜单树） |
| **SASE, XDR, DR, aes, ZTP, DSP, AI安全平台, 保护AI平台** | `SD Page Templates/Tree-5.0-nav/` | **纯左树导航**（侧边树形菜单 + 右侧业务内容区） |

当用户未明确产品归属时，优先询问或根据功能复杂度选择。

## 5. 资源地图

### 5.1 SD Global Styles/ — 数值权威（颜色 / 字号 / 间距 / 阴影）

| 文件 | 内容 |
|---|---|
| [design-color.md](SD%20Global%20Styles/design-color.md) | 品牌色、功能色、灰阶色板、基础色板、阴影规范 |
| [design-typography.md](SD%20Global%20Styles/design-typography.md) | 字体调用顺序、字重规范、字号行高映射表 |
| [design-atomic-spacing.md](SD%20Global%20Styles/design-atomic-spacing.md) | 圆角、边框色、投影、交互手势、Placeholder、间距系统 |
| [layout-grid.md](SD%20Global%20Styles/layout-grid.md) | 布局原语、24 列栅格、间距 Token、高度系统、页面骨架蓝图 |

### 5.2 SD patterns/ — 视觉风格 / 编码模式 / Do-and-Don't

| 文件 | 内容 |
|---|---|
| [visual-theme.md](SD%20patterns/visual-theme.md) | 整体视觉风格关键词、品牌气质、标志性视觉特征、反例 |
| [dos-and-donts.md](SD%20patterns/dos-and-donts.md) | 17 条成对实践规则 + 12 条自检 checklist |
| [impl-vue3.md](SD%20patterns/impl-vue3.md) | Vue3 + ant-design-vue 4.x 表格/标签/图标实现规则 |

### 5.3 SD Base Components/ — 二开基础组件库 (仅适用于 Vue 3 + Ant Design Vue 技术栈)

如果在 Vue 3 + Ant Design Vue 项目中开发，必须优先直接引入本目录下的二次封装组件，避免重复编写 CSS 覆盖默认皮肤。若使用其他技术栈，本目录下的 Vue 组件及其 CSS 覆写逻辑作为还原设计规范的**核心参考实现**：

| 文件 / 组件 | 基础底座 | 说明与调用方式 |
|---|---|---|
| [index.ts](SD%20Base%20Components/index.ts) | - | 导出全部封装组件与全局 `SdMessage` 消息提示对象 |
| [SdAlert.vue](SD%20Base%20Components/SdAlert.vue) | `a-alert` | 警告提示组件（高 32px，无边框，2px 圆角，普通/告警双色） |
| [SdButton.vue](SD%20Base%20Components/SdButton.vue) | `a-button` | 按钮组件（默认锁定 SeerDesign 规范高度 32px） |
| [SdCheckbox.vue](SD%20Base%20Components/SdCheckbox.vue) | `a-checkbox` | 复选框组件（支持 type="button" 按钮式右上角三角色块，禁用不隐藏） |
| [SdDatePicker.vue](SD%20Base%20Components/SdDatePicker.vue) | `a-select` + `a-range-picker` | 复合日期筛选器组件（整合左侧快捷和右侧输入，自适应宽度） |
| [SdDetailCard.vue](SD%20Base%20Components/SdDetailCard.vue) | - | 详情概览卡片布局组件（左32px图标，中间Label+Value网格，右上角动作按钮组） |
| [SdDrawer.vue](SD%20Base%20Components/SdDrawer.vue) | `a-drawer` | 抽屉组件（48px头、56px底部左对齐按钮，内容32px边距，隐藏横向滚动条） |
| [SdForm.vue](SD%20Base%20Components/SdForm.vue) | `a-form` | 表单组件（强制左对齐，抽屉类下输入组件强缩为 420px 宽度） |
| [SdInput.vue](SD%20Base%20Components/SdInput.vue) | `a-input` / `a-textarea` / `a-input-password` | 输入框组件（高度 24/32/40px，无焦点发光，前后置无缝贴合） |
| [SdModal.vue](SD%20Base%20Components/SdModal.vue) | `a-modal` | 弹窗组件（48px头，56px底部右对齐“主左取消右”按钮，32px侧内边距） |
| [SdPageTitle.vue](SD%20Base%20Components/SdPageTitle.vue) | - | 页头标题组件（支持 basic/drilldown/tabs 多样化，固定高度 48px） |
| [SdRadio.vue](SD%20Base%20Components/SdRadio.vue) / [SdRadioConfigPanel.vue](SD%20Base%20Components/SdRadioConfigPanel.vue) | `a-radio` | 单选框组件与关联配置面板（向上箭头支持 arrowOffset 变量对齐鱼眼） |
| [SdSearch.vue](SD%20Base%20Components/SdSearch.vue) | `a-input` | 搜索输入框（无双层边框，32px 锁定高度，无外发光） |
| [SdSelect.vue](SD%20Base%20Components/SdSelect.vue) | `a-select` | 下拉选择器（高度32px，移除对勾，多选 maxTagCount 响应式） |
| [SdSwitch.vue](SD%20Base%20Components/SdSwitch.vue) | `a-switch` | 开关组件（16px 超轻量高度，无文字显示，清除焦点外发光） |
| [SdTabs.vue](SD%20Base%20Components/SdTabs.vue) | `a-tabs` | 标签页组件（下划线激活指示器，分段式 segment-heavy/light 按钮风格） |
| [SdTag.vue](SD%20Base%20Components/SdTag.vue) | `a-tag` | 标签组件（多色轻重、风险点状、无缝数字拼接、交互式 add 新增标签） |
| [SdTree.vue](SD%20Base%20Components/SdTree.vue) | `a-tree` | 树形组件（32px行高，方形展开 +/- 键，连接线对齐，右Hover操作区，受控搜索快照） |

### 5.4 SD Components/ — 通用组件视觉规范

| 文件 | 组件 |
|---|---|
| [comp-alert.md](SD%20Components/comp-alert.md) | 警告提示（普通/告警提示条） |
| [comp-basic-search.md](SD%20Components/comp-basic-search.md) | 基础搜索框 |
| [comp-button.md](SD%20Components/comp-button.md) | 按钮（主按钮/普通按钮） |
| [comp-checkbox.md](SD%20Components/comp-checkbox.md) | 复选框（基础/按钮样式） |
| [comp-date-picker.md](SD%20Components/comp-date-picker.md) | 复合日期筛选器 |
| [comp-detail-card.md](SD%20Components/comp-detail-card.md) | 详情概览卡片 |
| [comp-drawer.md](SD%20Components/comp-drawer.md) | 抽屉 |
| [comp-input.md](SD%20Components/comp-input.md) | 输入框（标准/密码/文本域） |
| [comp-message.md](SD%20Components/comp-message.md) | 全局提示（成功/信息/警告/错误/加载） |
| [comp-modal.md](SD%20Components/comp-modal.md) | 弹窗 |
| [comp-page-title.md](SD%20Components/comp-page-title.md) | 页面标题/页头 |
| [comp-pro-search.md](SD%20Components/comp-pro-search.md) | 复合搜索框 |
| [comp-radio.md](SD%20Components/comp-radio.md) | 单选框 |
| [comp-select.md](SD%20Components/comp-select.md) | 选择器（单选/多选） |
| [comp-stepper.md](SD%20Components/comp-stepper.md) | 步骤条（横向/纵向） |
| [comp-table.md](SD%20Components/comp-table.md) | 表格（含分页器） |
| [comp-tabs.md](SD%20Components/comp-tabs.md) | 标签页 |
| [comp-tag.md](SD%20Components/comp-tag.md) | 标签（浅色/深色/点状/Icon+色块等） |
| [comp-tree.md](SD%20Components/comp-tree.md) | 树组件 |
| [design-form.md](SD%20Components/design-form.md) | 表单规范（表单项、布局模式、场景示例） |

### 5.5 SD Page Templates/ — 页面模板 & 导航框架

| 文件 / 目录 | 模板 |
|---|---|
| [page-left-nav.md](SD%20Page%20Templates/page-left-nav.md) | 左侧导航页面通用内容模块规范 |
| [page-l-nav.md](SD%20Page%20Templates/page-l-nav.md) | L 型导航页面通用内容模块规范 |
| [L-3.0-nav/framework.md](SD%20Page%20Templates/L-3.0-nav/framework.md) | L 型导航基本框架与尺寸规范 |
| [L-3.0-nav/base-table-page.md](SD%20Page%20Templates/L-3.0-nav/base-table-page.md) | L 型导航基础表格页规范 |
| [L-3.0-nav/left-tree-table-page.md](SD%20Page%20Templates/L-3.0-nav/left-tree-table-page.md) | L 型导航左树右表页规范 |
| [L-3.0-nav/form-config-page.md](SD%20Page%20Templates/L-3.0-nav/form-config-page.md) | L 型导航表单配置页规范 |
| [L-3.0-nav/step-config-page.md](SD%20Page%20Templates/L-3.0-nav/step-config-page.md) | L 型导航步骤配置页规范 |
| [Tree-5.0-nav/framework.md](SD%20Page%20Templates/Tree-5.0-nav/framework.md) | 纯左树导航基本框架与尺寸规范 |
| [Tree-5.0-nav/base-table-page.md](SD%20Page%20Templates/Tree-5.0-nav/base-table-page.md) | 纯左树导航基础表格页规范 |
| [Tree-5.0-nav/left-tree-table-page.md](SD%20Page%20Templates/Tree-5.0-nav/left-tree-table-page.md) | 纯左树导航左树右表页规范 |
| [Tree-5.0-nav/form-config-page.md](SD%20Page%20Templates/Tree-5.0-nav/form-config-page.md) | 纯左树导航表单配置页规范 |
| [Tree-5.0-nav/overview-table-page.md](SD%20Page%20Templates/Tree-5.0-nav/overview-table-page.md) | 纯左树导航总览展示表格页规范 |
| [Tree-5.0-nav/dashboard.md](SD%20Page%20Templates/Tree-5.0-nav/dashboard.md) | 纯左树导航数据大屏总览页规范 |
| [Tree-5.0-nav/detail.md](SD%20Page%20Templates/Tree-5.0-nav/detail.md) | 纯左树导航详情页规范 |
| [Tree-5.0-nav/basic_display_table.md](SD%20Page%20Templates/Tree-5.0-nav/basic_display_table.md) | 纯左树导航基础展示表格页规范 |


### 5.6 业务产品专属导航规范目录（按提示词需求读取）

这些是各具体产品的专属业务规范和导航布局，与 SD 公共规范存在扩充关系。开发时请根据具体的提示词动态调用：

| 产品分类 | 物理文件路径 | 包含内容 |
|---|---|---|
| **SASE** | [nav-sase.md](z-SASE/nav-sase.md) | SASE 产品导航框架（图标 / 间距 / 色彩 / 菜单树） |
| **SASE (aTrust)** | [nav-atrust.md](z-SASE/nav-atrust.md) | aTrust 零信任导航框架及客户端菜单对齐体系 |
| **XDR** | [nav-xdr.md](z-XDR/nav-xdr.md) | Sangfor XDR 导航框架规范（GPT 标签 / 双行 Header / 互斥手风琴） |
| **DR** | [nav-dr.md](z-DR/nav-dr.md) | DR 下一代端点安全导航框架及视觉红线说明 |

### 5.7 assets/ — 资产文件

| 文件 | 内容 |
|---|---|
| [css-overrides.css](assets/css-overrides.css) | 全局样式与 Token 定义（色彩变量、字体变量等，无论何种技术栈，均需引入该样式规范或提取其 Token 变量） |

---

## 6. 验收自检清单

每次生成代码后，**必须逐条核查**（来源：`SD patterns/dos-and-donts.md`）：

| # | 检查项 | 查询来源 |
|---|---|---|
| 1 | 颜色全部使用 CSS 变量或 Token，无硬编码 hex | `SD Global Styles/design-color.md` |
| 2 | 间距值属于 {2, 4, 8, 12, 16, 24, 32} | `SD Global Styles/design-atomic-spacing.md` |
| 3 | 字号属于 {12, 14, 16, 20, 24, 30} | `SD Global Styles/design-typography.md` |
| 4 | 字重仅为 400 或 600 | `SD Global Styles/design-typography.md` |
| 5 | 行高 = 字号 + 8px | `SD Global Styles/design-typography.md` |
| 6 | 圆角按层级：控件 2px / 容器 4px / 表格 0px | `SD Global Styles/design-atomic-spacing.md` |
| 7 | 阴影使用 Token（dropshadow-s1/s2/s3） | `SD Global Styles/design-color.md` |
| 8 | 按钮 mode 语义正确（一屏一个 primary） | `SD patterns/dos-and-donts.md` |
| 9 | 状态色级别选对（info/warning/risk/error/fatal） | `SD Global Styles/design-color.md` |
| 10 | 禁止蓝色外发光阴影（focus 态 box-shadow: none） | `SD Global Styles/design-atomic-spacing.md` |
| 11 | 动效使用 motion Token（0.18s/0.24s/0.3s） | `SD patterns/visual-theme.md` |
| 12 | 可点击元素 hover 时 cursor: pointer | `SD Global Styles/design-atomic-spacing.md` |

**全部通过后方可交付。任何一项不通过，必须修复后重新自检。**

## 7. 常见踩坑与绝对红线 (Anti-Patterns)

为了根治由于默认组件样式导致的各类视觉偏差，在制作 Demo 时，**必须强制检视以下常见问题。如果使用 Vue 3 + Ant Design Vue，请直接套用给出的二开组件或解决办法；如果是其他技术栈，必须用对应框架的样式或配置逻辑达到相同的视觉约束**：

| 组件 | 常见错误现象 | 强制解决办法 (必须执行) |
|---|---|---|
| **按钮 (Button)** | 自动添加未声明的图标；文字变成红色；默认高度不是 32px | **必须使用 `<SdButton>`**。该组件已默认锁死 32px 高度。若使用原生 `<a-button>`，必须显式加上 `style="height: 32px;"` 且绝不能乱猜图标、禁止红色文字。 |
| **警告提示 (Alert)** | 出现边框线；圆角过大；普通/告警背景颜色反差不明显 | **必须使用 `<SdAlert>`**。原生使用必须强制设定 `min-height: 32px` 并去除边框线。 |
| **复选框 (Checkbox)** | 按钮样式没有右上角直角三角色块；禁用时错把已选三角色块隐藏 | **必须使用 `<SdCheckbox>`**。按钮样式需支持 `type="button"` 并使用 CSS 伪元素绘制三角色块。 |
| **日期选择器 (DatePicker)** | 快捷选择与日期框分离成两个带边框控件；抽屉内宽度无法自适应拉伸 | **必须使用 `<SdDatePicker>`**。该组件进行了响应式重构，自适应宽度并锁定外边框及 1px 分割线。 |
| **详情卡片 (DetailCard)** | 属性 Label 与 Value 无法对齐；右侧操作按钮垂直居中 | **必须使用 `<SdDetailCard>`**。支持 Label-Value 网格自适应列和顶部对齐右上角操作按钮。 |
| **输入框 (Input)** | 拥有蓝色外发光焦点阴影；文本域高度不够；前后置拼接存在空隙或双边框 | **必须使用 `<SdInput>`**。原生 `a-input` 必须加上 `:box-shadow: none !important; border-color: var(--color-blue) !important;`。 |
| **弹窗 (Modal)** | 标题高度和底部高度不满足 SeerDesign 规范；主/次操作按钮顺序反常（右对齐时主在右） | **必须使用 `<SdModal>`**。支持标题 48px，底部 56px，内部滚动，且底部按钮“主按钮在左，取消按钮在右，整体右对齐”。 |
| **页面标题 (PageTitle)** | 没有返回键；Tab 下划线与底边线分离出现双底线 | **必须使用 `<SdPageTitle>`**。支持 basic/drilldown/tabs 并实现了下划线 2px 与底线重合。 |
| **单选框 (Radio)** | 顶部的配置面板小箭头无法和 Radio 鱼眼对齐 | **必须使用 `<SdRadio>` 与 `<SdRadioConfigPanel>`**。配置面板通过传递 `arrowOffset` 控制直角小箭头的偏移位置。 |
| **表格 (Table)** | 出现第一行空白行；字段过多时不会自动冻结操作列；表格内 Switch 开关样式异常 | **必须使用 `<SdTable>`**。若无法使用，则必须：1. CSS 强行清除第一行空白；2. Columns 中最后的操作列必须加上 `fixed: 'right'`；3. 覆盖 Switch 高度至规范尺寸。 |
| **选择器 (Select)** | 高度不对；描边圆角不对；下拉面板里面的样式不对 | **必须使用 `<SdSelect>`**。若无法使用，原生 `a-select` 必须手动约束 `.ant-select-selector { height: 32px !important; border-radius: 2px !important; }`。 |
| **开关 (Switch)** | 尺寸过大；内部塞入了“开启/关闭”文字导致变形 | **必须使用 `<SdSwitch>`**。锁死 28px * 16px 尺寸，隐藏所有内嵌文本并去除焦点阴影。 |
| **标签页 (Tabs)** | 线条式未激活色不正确；分段重标签/轻量样式颜色与圆角混淆 | **必须使用 `<SdTabs>`**。通过 `type="underline" / "segment-heavy" / "segment-light"` 属性无缝覆盖底座。 |
| **标签 (Tag)** | 圆角和内边距不对；点状没有居中；双色数字拼接不贴合 | **必须使用 `<SdTag>`**。包含 dot、text-number 及 add 模式，全面锁死 SeerDesign 调色板及 10% 透明度规则。 |
| **树组件 (Tree)** | 默认三角键过小；缺失连接线；没有操作 Hover 菜单或统计数字 | **必须使用 `<SdTree>`**。封装了方形 +/- 键，统一 32px 行高，对齐连接线和受控搜索过滤。 |
| **表单 (Form)** | 星号不对齐；Label 与内容间距过大；内容区的组件长短不一无法两端对齐 | **必须使用 `<SdForm>`**。原生使用时必须：1. 统一设定表单项宽度（如 `width: 100%`）；2. 使用统一的 Label 栅格比例；3. CSS 强行修正 `::before` 星号的对齐。 |
| **抽屉 (Drawer)** | 关闭按钮自动跑到最左上角；保存/取消按钮在右下方（位置异常）；内容溢出出现横向滚动条 | **必须使用 `<SdDrawer>`**。支持标题 48px，底部 56px，内容左右 32px 内边距与 x 方向 overflow 隐藏。 |
| **搜索框 (Search)** | 尺寸默认给了 40px；输入框内又套了一个框 | **必须使用 `<SdSearch>`**。若使用原生 `<a-input-search>`，必须强制设置 `size="middle"` (对应 32px，千万别用 large)，并仔细检查 DOM 结构避免二次嵌套。 |

> **最高指令**：在开发和拼装 Demo 页面时：
> 1. **若使用 Vue 3 + Ant Design Vue**：首选方案是引入并使用 `SD Base Components` 中的二次封装组件（如 `SdButton` 等），以避免每次写冗长的 CSS 来修补 `a-xxx` 默认样式。
> 2. **若使用其他技术栈**：必须确保视觉效果完全等同于下表中的「强制解决办法」，严禁保留组件库的默认尺寸、颜色和交互阴影。

- **焦点阴影**：严禁使用默认的蓝色焦点外发光阴影（focus 态 box-shadow: none）。
- **表格行高**：严禁使用组件库的 small 属性来控制，必须通过样式强制锁定规范高度（表头 32px，行 40px/32px）。
- **透明色**：严禁使用自定义 rgba 或 hex 拼接透明度作为标签背景色，必须使用 SeerDesign Token 规定的浅色背景色。
- **变量化**：所有颜色必须使用 SeerDesign Token CSS 变量（如 `var(--color-blue)` 等）。
- **图标选型**：使用主流稳定图标，且必须遵循设计语义映射，不确定是否存在时优先省略。
- **未知数值**：如果规范中查不到某个值，**停下来追问用户**，不得猜测。
- **全局提示**：若使用 Vue，直接引用 `SdMessage`；使用其他框架时，需对全局提示组件样式进行覆写，使其背景与间距符合 SeerDesign 规范。
