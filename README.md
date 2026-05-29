# SeerDesign Demo Generator Skill (v2.0)

## 项目简介 (About)
本项目是一个专为**网络安全产品经理**（涉及 SASE, aTrust, XDR, DR 等业务场景）设计的 **SeerDesign 视觉规范高保真 Demo 生成辅助项目 (Skill)**。

通过内置丰富的设计规范、模板骨架（L型导航与左树导航）、标准组件库速查表及严格的避坑指南，它能够帮助你（或 AI 代码助手）快速、准确地拼装出符合 SeerDesign 规范的前端 Demo，且保证产物可直接运行，无需复杂的构建环境。

## 核心技术栈与红线 (Tech Stack & Rules)

为了根除前端组件拼凑带来的视觉偏差和运行时报错，本项目具有**严格的技术栈限制**：

- **✅ 推荐使用**：原生 HTML/JS + **Alpine.js**（用于轻量级交互和状态管理）或者 **React**。
- **✅ 样式方案**：Tailwind CSS（基于定制配置）或 原生 CSS（必须使用项目内的 CSS 变量）。
- **❌ 绝对禁止**：**全面禁止使用 Vue 框架及其相关生态**（如 Ant Design Vue、Element Plus 等），以避免混用带来样式覆盖和运行时报错。

## 目录结构 (Directory Structure)

项目提供了从全局样式到组件、模板的完整规范：

- `assets/`：核心资产。包含全局 CSS 覆盖变量（`css-overrides.css`）以及**最重要的**组件与避坑速查表（`seerdesign-cheat-sheet.md`）。
- `SD Global Styles/`：全局视觉规范（颜色、排版、间距、阴影等）。
- `SD Components/`：独立的高频组件详细规范（如 Button, Table, Drawer 等）。
- `SD Page Templates/`：内置开箱即用的页面级 HTML 骨架（支持 L-3.0 型导航和 Tree-5.0 纯左树导航），并配有对应场景的设计指南。
- `SD patterns/`：视觉主题模式及**自检清单与红线（dos-and-donts）**。
- `Demos/`：所有生成的 Demo 文件将被统一输出并保存在该目录下。
- `skill.md`：本项目的核心工作流定义文件，指导 AI 或开发者如何一步步构建 Demo。

## 如何使用本项目 (How to Use)

如果你需要基于此规范生成一个 Demo，请遵循以下标准工作流：

1. **选择导航骨架**：
   - 涉及 `SDP`, `aTrust`, `SMG`, `AF` 等场景，请复制 `SD Page Templates/boilerplate-l-nav.html`（L型导航）。
   - 涉及 `SASE`, `XDR`, `DR`, `ZTP`, `AI安全平台` 等场景，请复制 `SD Page Templates/boilerplate-tree-nav.html`（纯左树导航）。

2. **按需查阅规范**：
   - **强制查阅**：`assets/seerdesign-cheat-sheet.md` 获取组件标准 HTML 结构、Tailwind Token 与 Alpine.js 交互模式。
   - **补充查阅**：针对复杂的交互组件或特定的导航层级结构，请分别查阅 `SD Components/` 或 `z-SASE/`、`z-XDR/` 等子目录下的专门说明。

3. **模块拼装与样式控制**：
   - 在选定骨架基础上，利用内置 Tailwind 类名（如 `text-xs`, `rounded-control`）填入业务内容。
   - 涉及交互（Tab 切换、折叠、联动）请使用自带的 Alpine.js。

4. **验收自检**：
   - 完成后，请严格对照 `SD patterns/dos-and-donts.md` 和 `skill.md` 中的「验收自检清单」进行逐项核查（颜色无写死 hex、字号符合规范、动效正确、无报错等）。
   - 将最终的页面保存到 `Demos/` 目录。

## 运行 Demo
由于采用原生 HTML+JS/Alpine.js 或轻量级方案，生成的 Demo 一般可**直接双击 HTML 文件在浏览器中打开**，或使用诸如 VS Code Live Server 等简易工具启动本地服务即可即刻预览，不会出现白屏问题。
