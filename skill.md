---
name: Seerdesign_demo_Skill
description: SeerDesign 视觉规范 Skill —— 根据用户业务场景，快速生成符合 SeerDesign 规范的高保真前端 Demo (技术栈与组件库不设限)
dependency:
  python: []
  system: []
---

# SeerDesign 视觉规范 Skill

## 1. 任务目标

以**网络安全产品经理**视角理解用户的业务场景，然后根据本技能提供的设计规范，快速生成符合 SeerDesign 视觉标准的高保真前端 Demo。**本技能全面禁止使用 Vue 及其相关生态**，只推荐原生 HTML/JS 或 React 开发，确保代码能够直接运行且不出现白屏或低级报错。

## 2. 技术栈

| 项 | 值 |
|---|---|
| 框架 | 强力推荐使用 **原生 HTML/JS** + **Alpine.js**（轻量级状态管理 CDN），或使用 React。**绝对禁止使用 Vue 框架** |
| 组件库 | 推荐使用基于原生 CSS/Tailwind 配置的结构，**绝对禁止使用 Ant Design Vue 等 Vue 专属生态** |
| 图标 | 灵活不设限（推荐使用 SVG 图标、`Lucide Icons`、`FontAwesome` 等） |
| 样式 | 强力推荐 Tailwind CSS 或原生 CSS。必须使用项目视觉规范定义的 CSS 变量，并在 HTML 头部配置合规的 Tailwind Token |
| 产物 | 根据选定的骨架模板，填充业务内容后保存至 `Demos/` 目录，确保双击或开启本地服务后可即刻预览无白屏错误 |

## 3. 核心原则（必须阅读遵循！！）

### 3.1 严格执行视觉规范

无论使用原生 HTML 元素还是 React 组件，**视觉样式必须完全由本技能提供的 Token 驱动**。任何偏离 SeerDesign 规范的默认样式（如浏览器默认样式、原生元素自带样式或未经定制的第三方组件默认样式）都视为违规。再次强调，严禁引入任何 Vue 相关的组件库（如 Ant Design Vue、Element Plus 等）。

## 4. 工作流与规范按需加载协议

### 4.1 页面 Demo 制作逻辑（必须遵循！）

```
用户输入业务场景
  ↓
① 需求理解与产品判断：以网络安全产品经理身份分析需求并识别关键词
   - 识别产品关键词（如 SASE, aTrust, XDR, DR 等）
   - 确认导航模板选择（L-3.0 导航 或 Tree-5.0 导航）
  ↓
② 读取开箱即用的页面导航 HTML 骨架文件作为开发起点：
   - 若为 L 型导航 -> 读取 `SD Page Templates/boilerplate-l-nav.html` 并复制为 Demo 底座
   - 若为 纯左树导航 -> 读取 `SD Page Templates/boilerplate-tree-nav.html` 并复制为 Demo 底座
  ↓
③ 强制读取组件与避坑速查表：
   - 强制读取 `assets/seerdesign-cheat-sheet.md`，完整获取各高频组件的标准 HTML 结构、已注入的 Tailwind Token 与 Alpine.js 交互模式。
   - 强制读取 `SD patterns/dos-and-donts.md`，掌握成对实践规则（Do's & Don'ts），避免硬编码颜色、自定义高度与 class 命名冲突等设计雷区。
  ↓
④ 按需读取组件规范：
   - 当遇到非常复杂的自定义交互，且速查表内容不足以支持时，按需加载 `SD Components/` 中对应的单独组件详细规范。
  ↓
⑤ 【按需读取】具体产品菜单与导航子目录规范：
   - 若提及 SASE/云安全访问服务 -> 加载 z-SASE/nav-sase.md
   - 若提及 aTrust/零信任/SDP -> 加载 z-SASE/nav-atrust.md
   - 若提及 XDR/安全托管服务 -> 加载 z-XDR/nav-xdr.md
   - 若提及 DR/端点安全 -> 加载 z-DR/nav-dr.md
  ↓
⑥ 代码编写与高保真交互实现：
   - 在选定的 HTML 骨架上，直接利用内置的 Tailwind 视觉 Token 类名（如 `text-xs`, `rounded-control`, `bg-brand`）进行模块填充。
   - 使用 Alpine.js 轻松实现 Tab 切换、Drawer 展开折叠、Table 联动等数据交互，绝对禁止使用 Vue！
  ↓
⑦ 强制自检与修复：
   - 对照「6. 验收自检清单」与「7. 常见踩坑与绝对红线 (Anti-Patterns)」逐项验证 -> 修复 -> 将完成的 demo 文件最终输出到 `/Demos` 文件夹下。
```

### 4.2 页面模板选择规则

根据用户提及的产品关键词，自动选择对应的页面导航框架：

| 产品关键词 | 对应导航框架目录 | 导航特征 |
|---|---|---|
| **SDP, aTrust, SMG, AF** | `SD Page Templates/L-3.0-nav/` | **L 型导航**（顶部一级导航 + 左侧二三级菜单树） |
| **SASE, XDR, DR, aes, ZTP, DSP, AI安全平台, 保护AI平台** | `SD Page Templates/Tree-5.0-nav/` | **纯左树导航**（侧边树形菜单 + 右侧业务内容区） |

### 4.3 页面模板分布介绍

| 文件 / 目录 | 模板 |
|---|---|
| [boilerplate-l-nav.html](SD%20Page%20Templates/boilerplate-l-nav.html) | **[NEW]** L 型导航页面即刻预览 HTML 骨架（内置 Alpine.js 及 Tailwind Token 配置） |
| [boilerplate-tree-nav.html](SD%20Page%20Templates/boilerplate-tree-nav.html) | **[NEW]** 纯左树导航页面即刻预览 HTML 骨架（内置 Alpine.js 及 Tailwind Token 配置） |
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

## 5. 核心资产与规范文件

| 文件 | 内容 |
|---|---|
| [css-overrides.css](assets/css-overrides.css) | 全局样式与 Token 定义（色彩变量、字体变量等，无论何种技术栈，均需引入该样式规范） |
| [seerdesign-cheat-sheet.md](assets/seerdesign-cheat-sheet.md) | **[NEW]** 组件与避坑速查表。包含 14+ 种通用组件的标准 HTML 结构、已注入的 Tailwind Token 与 Alpine.js 交互模式，是 AI 编写页面的首要参考。 |
| [dos-and-donts.md](SD%20patterns/dos-and-donts.md) | **[NEW]** 视觉设计避坑指南。提供成对的正反例实践（Do's & Don'ts）及设计原理解释，是 AI 编码阶段的核心参考规范。 |
| [inspection-checklist.md](SD%20patterns/inspection-checklist.md) | **[NEW]** 验收自检清单。代码编写完成后、交付给用户前，AI Agent 必须在此进行逐条勾选核对。 |

---

## 6. 验收自检清单

每次生成代码后，**必须逐条核查**专属的检视清单文件：

👉 **[点击查阅：SD 验收自检清单 (Inspection Checklist)](./SD%20patterns/inspection-checklist.md)**

**说明：必须全部通过该清单中的所有要求后方可交付。任何一项不通过，必须修复后重新自检。**


## 7. 常见踩坑与绝对红线 (Anti-Patterns)

为了根治前端组件拼凑带来的视觉偏差以及避免运行时白屏或低级报错，在制作 Demo 时，**必须强制遵循以下绝对红线，并且再次重申：禁止任何形式的 Vue 或 Vue 组件库代码出现！**

| 组件 / 场景 | 常见错误现象 | 强制解决办法 (必须执行) |
|---|---|---|
| **按钮 (Button)** | 默认高度不是 32px；存在错误的圆角大小。 | 必须通过样式强制将按钮高度锁定在 32px，严禁乱猜图标。 |
| **警告提示 (Alert)** | 出现边框线；圆角过大；普通/告警背景颜色反差不明显 | 强制设定 `min-height: 32px`，去除所有边框线。 |
| **输入框 (Input/Search)** | 拥有蓝色外发光焦点阴影；高度不对（未统一在 32px） | 强制清除焦点外发光：`box-shadow: none !important;`。 |
| **弹窗 / 抽屉** | 弹窗底部操作按钮未能实现“主按钮在左，次按钮在右”，内容溢出报错 | 必须保证标题区域 48px 高，底部区域 56px 高，使用原生 CSS 或 Tailwind 等确保排版。 |
| **表格 (Table)** | 出现第一行空白行；行高与表头高度不符 | 必须通过样式强制锁定规范高度（表头 32px，行 40px/32px）。 |
| **表格冻结列** | 操作列 / 更多列无法固定，随内容滚走；或设置 `position: sticky` 后仍不生效 | `css-overrides.css` 对 `.sd-table th` 有 `position: relative !important`，必须使用 **`table.sd-table th.sticky-op-col`** 更高特异性 + `!important` 覆盖。禁止使用 `table-fixed`。详见 `seerdesign-cheat-sheet.md § 3.8` 冻结列骨架。 |
| **标签页 (Tabs)** | 线条式未激活色不正确；下划线与底边线未重合 | 必须通过 CSS 或 Tailwind 等技术栈精确控制线条样式。 |
| **标签 (Tag)** | 标签文字由于过长或被弹性盒挤压而折行显示，破坏行高及排版 | 必须加 `flex-shrink-0 whitespace-nowrap` 强制禁止折行；空间不足时使用 `truncate` 截断（合理限制最大宽度），并通过 `title` 属性或 Tooltip 提供悬浮提示。 |

> **最高指令**：在开发和拼装 Demo 页面时：
> 1. **代码必须可直接运行**：如果使用 HTML 原生或 React 进行开发，所交付的代码必须不借助复杂的构建工具即可查看结果，或者确保配置极其简单、不出错。
> 2. **视觉 100% 还原**：严禁保留任何组件库（比如任何未覆盖样式的 UI 库）的默认颜色、默认间距和默认阴影。


