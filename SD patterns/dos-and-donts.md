# Do's & Don'ts（成对实践规则）

> **何时使用本 skill**：写代码前自查、code review 时核对、解决"它能跑但看着不像 SASE 设计规范"的问题。每条都给反例 + 正例 + 原因。

---

## 规则 1 — 颜色硬编码

❌ **Don't**：
```css
.my-card { background: #ffffff; color: #2f3540; border: 1px solid #d3d7de; }
```

✅ **Do**：
```css
.my-card {
  background: var(--sase-color-container-bg);
  color: var(--sase-color-text);
  border: 1px solid var(--sase-color-border);
}
```

**为什么**：硬编码后，主题切换（亮↔暗）失效。SASE 设计规范 暗色模式靠重算 token + 重写 CSS var，不靠类名穿透。

---

## 规则 2 — 用语义色 Class 而不是基色

❌ **Don't**：
```html
<button style="background: #f52727">删除</button>
```

✅ **Do**：
```html
<!-- 使用规范的错误/危险状态色变量与样式 -->
<button class="bg-error hover:bg-error-hover active:bg-error-active text-white px-3 h-8 rounded-control transition-colors">
  删除
</button>
```

**为什么**：硬编码 `#f52727` 缺少 hover、active 等交互态颜色派生。SASE 设计规范规定状态色应使用专属的语义类名或变量（如 `bg-error`），确保亮暗色主题自适应并包含完整的交互态。

---

## 规则 3 — Warning vs Risk vs Error vs Fatal

❌ **Don't**：
- 提示"此操作将删除该用户" → 用 Warning 级别的 Alert
- 提示"网络不稳定" → 用 Error 级别的 Alert

✅ **Do**：

| 语义 | 视觉类型 | 颜色 Token 基础 | 典型例子 |
|---|---|---|---|
| 注意/提示 | `info` | `--sase-color-info` (蓝色) | "新版本已发布，请刷新" |
| 警告（不会出错但需注意） | `warning` | `--sase-color-warning` (棕黄) | "你尚未保存草稿" |
| 高风险（操作可逆但需防范） | `risk` | `--sase-color-risk` (橙色) | "此操作将解绑设备，可重新绑定" |
| 错误（操作不可逆但范围有限） | `error` | `--sase-color-error` (红色) | "此操作将删除文件，可从回收站找回" |
| 致命（毁灭性，灾难性后果） | `fatal` | `--sase-color-fatal` (暗红) | "此操作将清空整个集群数据库" |

**为什么**：SASE 设计规范把 `risk` 与 `error` 拆开，是为了表达"严重程度的梯度"。如果一律用红色警告，会让用户对所有红色失去敏感度。

---

## 规则 4 — 间距非 8 的倍数

❌ **Don't**：
```css
.field { margin-bottom: 14px; padding: 10px 18px; }
```

✅ **Do**：
```css
.field {
  margin-bottom: var(--sase-margin-size-lg);   /* 16 */
  padding: var(--sase-padding-size-sm) var(--sase-padding-size-lg);  /* 8 16 */
}
```

**为什么**：SASE 设计规范 全系基于 `spacing: 8`。14、18、22 这种值会破坏垂直对齐——表单控件、卡片对齐、栅格 gutter 全部基于 8 的倍数。

合法值：`2 / 4 / 8 / 12 / 16 / 24 / 32`（对应 2Xs/Xs/Sm/Md/Lg/Xl/2Xl）。

---

## 规则 5 — 圆角档位错配

❌ **Don't**：
```css
.sase-button-custom { border-radius: 4px; }   /* 按钮用了容器圆角 */
.sase-card-custom { border-radius: 8px; }     /* 卡片用了大圆角 */
```

✅ **Do**：
```css
.button-custom { border-radius: var(--sase-border-radius-sm); }   /* 2px — 控件 */
.card-custom { border-radius: var(--sase-border-radius-md); }     /* 4px — 容器 */
.hero-card { border-radius: var(--sase-border-radius-lg); }       /* 8px — 强调容器 */
.avatar { border-radius: 9999px; }                              /* 圆形 */
```

| 元素类型 | 用 |
|---|---|
| 按钮 / 输入框 / select / checkbox / radio | `borderRadiusSm` (2) |
| Tag / Badge dot | `borderRadiusXs` (1) |
| 卡片 / Modal / Popover / Tooltip | `borderRadiusMd` (4) |
| Hero 卡 / 特殊强调 | `borderRadiusLg` (8) |
| 头像 / Avatar / 圆形按钮 | `9999px` |

**为什么**：SASE 设计规范 的层级语言里，"控件圆角" < "容器圆角"。混用会让控件看起来像被放大了或卡片看起来像被压扁。

---

## 规则 6 — 字号超越 token 阶梯

❌ **Don't**：
```css
h2 { font-size: 18px; }   /* 18 不在阶梯里 */
.tip { font-size: 13px; } /* 13 不在阶梯里 */
```

✅ **Do**：
```css
h2 { font-size: var(--sase-font-size-xl); }       /* 20 */
.tip { font-size: var(--sase-font-size-sm); }     /* 12 */
```

合法字号：`10 / 12 / 14 / 16 / 20 / 24 / 30`。

**为什么**：行高公式 `fontSize + lineHeightGutter(8)` 也按这些值反推。中间值会导致行高不对齐，垂直对齐崩。

---

## 规则 7 — 自己写阴影

❌ **Don't**：
```css
.popover { box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
.modal { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
```

✅ **Do**：
```css
.popover { box-shadow: var(--sase-box-shadow-md); }
.modal { box-shadow: var(--sase-box-shadow-lg); }
```

**为什么**：SASE 设计规范 阴影颜色是 `grey.d50 = #1e232b`（偏冷蓝灰），不是纯黑——纯黑阴影在浅蓝灰背景下会显脏。

---

## 规则 8 — 控件尺寸自定义（统一高度）

❌ **Don't**：
```css
/* 自行手写高度，导致子元素 padding 和 icon 错位 */
.app-button { height: 36px; padding: 0 14px; }
```

✅ **Do**：
```html
<!-- 使用符合 SASE 规范尺寸定义的 Tailwind 类或 CSS 组件类 -->
<!-- 中尺寸 (默认 32px) -->
<button class="h-8 px-3 text-sm rounded-control">默认</button>
<!-- 大尺寸 (40px) -->
<button class="h-10 px-4 text-base rounded-control">大</button>
<!-- 超大尺寸 (48px) -->
<button class="h-12 px-6 text-lg rounded-control">超大</button>
```

**为什么**：标准组件尺寸（如 32px / 40px / 48px）同步关联了高度、内边距（padding）、字号及图标大小。手改高度会导致内部 padding/icon 无法垂直居中对齐。

---

## 规则 9 — 按钮样式类型（Mode）使用不当

❌ **Don't**：
- 一个表单放置多个高亮的 Primary (主按钮) —— 导致视觉焦点混乱。
- 普通删除操作也使用醒目的 Primary Danger —— 与正常提交动作颜色冲突。

✅ **Do**：
| 场景 | 对应视觉样式 (Tailwind / CSS 类名) | 推荐示例 |
|---|---|---|
| 表单主提交 | 主色实底 (Primary: `bg-brand text-white`) | [保存并提交] |
| 取消 / 关闭 | 弱化次级 (Secondary/Default: `border border-border text-text`) | [取消] |
| 普通删除 | 警示次级 (Default Danger: `border-error text-error`) | [删除配置] |
| 内联操作（行内） | 无边框文本 (Text Link: `text-brand hover:underline`) | [编辑] [详情] |
| 链接式 | 标准超链接样式 (Link: `text-brand underline`) | [查看相关协议] |
| 危险大按钮 | 危险主色 (Primary Danger: `bg-error text-white`) | 仅当**唯一主操作**时使用 |

**规则**：**一屏原则上只保留一个 Primary (主色实底) 按钮**。其余动作按钮均用 Default、Text 或 Link 样式弱化。

---

## 规则 10 — 模态弹窗 (Modal) 与抽屉 (Drawer) 滥用

❌ **Don't**：
- 用 Modal 显示包含 20+ 个字段的超长表单 —— 会导致内容拥挤且滚动不便，应使用专门配置页或 Drawer。
- 用 Modal 显示纯通告/展示信息（如只有一个 "知道了" 按钮） —— 干扰性过强，应使用 Message 或 Notification。
- 多层 Modal 嵌套弹出（弹窗 A 里面又弹弹窗 B） —— 增加用户认知负担，且难以定位关闭。

✅ **Do**：
| 场景 | 推荐承载方式 |
|---|---|
| 简短确认或极简输入（≤ 2 字段） | **Modal (对话框)**（如宽度 400px 左右的确认框） |
| 中等复杂表单（3–10 字段） | **Drawer (侧边抽屉)**（通常置于右侧，宽度 480px / 600px） |
| 复杂大表单 / 多步骤配置 | **跳页** (详情配置页) 或半屏大抽屉 |
| 行内危险动作确认 | **Popconfirm (气泡确认框)**（指向性强，不干扰全局） |
| 系统通知 / 状态性轻量提醒 | **Message (全局提示)** 或 **Notification (通知提醒框)** |
| 轻量级气泡悬浮说明 | **Popover (气泡卡片)** 或 **Tooltip (文字提示)** |

---

## 规则 11 — 文字提示 (Tooltip) 承载信息过载

❌ **Don't**：
```html
<!-- 将几百字的详细流程或说明塞进文字提示中 -->
<div data-tooltip="此操作会触发以下三个步骤：1. 删除原数据 2. 重建索引 3. 通知所有订阅者，整个过程可能需要几分钟...">
```

✅ **Do**：
- **Tooltip (文字提示)**：仅适用于单行文字（通常 ≤ 30 字），且不包含复杂的 Markdown 或 HTML 格式。
- **Popover (气泡卡片)**：如果信息超过一行，包含格式、标题或操作按钮，应使用 Popover。
- **Drawer / 独立文档**：如果属于庞大的规则说明或操作指南，应提供帮助文档链接或在右侧 Drawer 中展示。

---

## 规则 12 — 自定义图标尺寸

❌ **Don't**：
```html
<图标组件 name="user" style="font-size: 14px;" />
<图标组件 name="user" style="font-size: 18px;" />
```

✅ **Do**：
```html
<!-- 默认 16px，跟随 fontSizeIcon -->
<图标组件 />
<!-- 大尺寸：用 font-size: 1.2em（相对父） -->
<图标组件 name="user" style="font-size: 1.2em;" />
```

icon 默认 `fontSizeIcon = 16`。需要变化时用相对单位（em / 1em）跟随父字号，避免硬编码 14/18。

---

## 规则 13 — 自定义透明度 / 渐变

❌ **Don't**：
```css
.banner { background: linear-gradient(90deg, #1c6eff, #20cc94); }
.disabled-overlay { background: rgba(0, 0, 0, 0.3); }
```

✅ **Do**：
- SASE 设计规范 系统**没有渐变**——除非品牌定制场景，避免渐变
- 半透明用现成 token：`colorMask` (`rgba(0,0,0,0.45)`)、`controlBoxShadowFocus` (`rgba(28,110,255,0.2)`)
- 需要新的 alpha 色：用 `getAlphaColor(baseColor, alpha)` 函数

---

## 规则 14 — 自创动画曲线 / 时长

❌ **Don't**：
```css
.fade-in { transition: opacity 200ms ease-in-out; }
.slide { transition: transform 0.5s linear; }
```

✅ **Do**：
```css
.fade-in {
  transition: opacity var(--sase-motion-duration-medium)
              var(--sase-motion-ease-in-out);
}
```

合法时长：`motionDurationFast` (0.18s) / `motionDurationMedium` (0.24s) / `motionDurationSlow` (0.3s)

合法曲线：
```
motionEaseIn:        cubic-bezier(0.12, 0, 0.39, 0)
motionEaseOut:       cubic-bezier(0.61, 1, 0.88, 1)
motionEaseInOut:     cubic-bezier(0.37, 0, 0.63, 1)   ← 默认
motionEaseInBack:    cubic-bezier(0.36, 0, 0.66, -0.56)
motionEaseOutBack:   cubic-bezier(0.34, 1.56, 0.64, 1)
motionEaseInCirc:    cubic-bezier(0.55, 0, 1, 0.45)
motionEaseOutCirc:   cubic-bezier(0, 0.55, 0.45, 1)
motionEaseInQuint:   cubic-bezier(0.64, 0, 0.78, 0)
motionEaseOutQuint:  cubic-bezier(0.22, 1, 0.36, 1)
```

---

## 规则 15 — Class 命名不带 sase- 前缀

❌ **Don't**：
```css
.button-primary { ... }
.my-card { ... }
```

✅ **Do**：
```css
/* 业务自定义组件 */
.app-product-card { ... }
.app-side-nav { ... }

/* 扩展 sase- 组件用 BEM 子选择 */
.sase-button.app-primary-cta { ... }
```

**为什么**：sase- 前缀是 SASE 设计规范 命名空间，不要污染。业务用自己的前缀（如 `app-`、`my-`、项目名）。

---

## 规则 16 — 给 disabled 元素加 cursor: pointer

❌ **Don't**：
```css
.sase-button[disabled] { cursor: pointer; }
```

✅ **Do**：SASE 设计规范 默认已经把 disabled 状态设为 `cursor: not-allowed`，**别覆盖**。

---

## 规则 17 — 用 inline style 覆盖基础类名样式

❌ **Don't**：
```html
<!-- 使用 inline style 强行写死属性，导致样式覆写困难且主题失效 -->
<button style="background: #1c6eff; color: white; height: 40px;">提交</button>
```

✅ **Do**：
```html
<!-- 统一通过规范定义的 Utility Classes (Tailwind) 或 Class 进行配置 -->
<button class="bg-brand text-white h-10 px-4 rounded-control">提交</button>
```

**为什么**：内联样式（inline style）具有最高优先权，会破坏全局主题变量（亮暗色主题）的响应性切换，导致后期维护极其困难。

---

## 规则 18 — CSS 覆写 !important 特异性冲突

❌ **Don't**：
```css
/* 试图用过于宽泛的选择器写死宽度 */
.form-container .input-control {
  width: 100% !important;
}

/* 试图在此处局部约束宽度，但因为选择器特异性（权重）较低，导致 100% 依然生效 */
.align-input {
  width: 440px !important; 
}
```

✅ **Do**：
```css
/* 方式一：使用 :not() 排除不需要 100% 宽度的元素 */
.form-container .input-control:not(.align-input) {
  width: 100% !important;
}

/* 方式二：局部约束类采用同等或更高的特异性选择器 */
.form-container .align-input {
  width: 440px !important;
  max-width: 440px !important;
}
```

**为什么**：当多条规则都带有 `!important` 时，浏览器会通过选择器特异性（Specificity）决定优先级。使用通配类（如 scoped CSS 中的通配类或过于宽泛的 class）容易导致局部自定义宽度失效，这是开发布局时最难排查的 CSS 冲突。

**强制要求**：
1. 避免使用过于宽泛的全局 `width: 100% !important`，优先考虑 `flex: 1` 或 `flex-grow` 的弹性布局。
2. 局部覆盖时，必须保证选择器权重至少等同于原选择器。

---

## 规则 19 — Label 宽度纯数学推算

❌ **Don't**：
```
假设：12px 字号 → 每个中文字恰好 12px 宽
计算：5字 × 12px = 60px + 12px(星号) + 16px(间距) = 88px
结论：label 列宽设 88px ✓
```

✅ **Do**：
1. 先设一个合理初始值（如最长 label 字数 × 14px + 星号占位 + 间距）
2. **必须在浏览器中实测**：用 DevTools 选中 label 元素，查看实际 `offsetWidth`
3. 根据实测结果微调，确保最长 label 右边缘到控件左边缘恰好 = 规范间距（16px）

**为什么**：中文字符在不同字体（PingFang SC / Microsoft YaHei / Noto Sans CJK）下的实际渲染宽度不等于 font-size。12px 字号的中文字实际宽度通常在 12~14px 之间（因字体 metrics、字间距、亚像素渲染差异）。纯数学推算会导致间距偏差 4~8px，肉眼可见。

**建议公式（安全初始值）**：
```
label列宽 = 最长label字数 × 14 + 星号占位(12px) + 间距(16px)
```
用 14 而非 12 作为中文字符宽度估算值，可以覆盖大多数字体的渲染差异。

---

## 规则 20 — 跳过视觉验证直接交付

❌ **Don't**：
```
修改 CSS → npm run build 通过 → 告知用户"已完成" → 用户截图发现布局不对
```

✅ **Do**：
```
修改 CSS → npm run build 通过 → 浏览器截图/DevTools 审查实际渲染 → 确认布局正确 → 告知用户已完成
```

**为什么**：`npm run build` 只验证语法和类型正确性，不验证视觉效果。CSS 特异性冲突、字体渲染差异、flex 溢出等布局问题都能通过编译但渲染错误。布局修改的唯一验收标准是**浏览器实际渲染结果**，不是编译状态。

**强制工作流**：
1. 修改样式代码后，先确保编译通过
2. 在浏览器中打开目标页面，检查修改区域的实际渲染
3. 如果有 DevTools MCP 可用，使用截图或 snapshot 工具检查
4. 如果没有 DevTools，至少向用户说明需要人工确认视觉效果，不要声称"已完成"
5. 对比参考截图（如有），逐项确认：间距、宽度、对齐、颜色

---

## 规则 21 — 标签（Tag）文字折行与截断

❌ **Don't**：
标签文字由于过长或被弹性盒挤压而折行显示，破坏页面行高及对齐。
```html
<span class="inline-flex items-center px-2 py-0.5 rounded-control text-xs bg-brand/10 text-brand">文件 Hash</span>
```

✅ **Do**：
使用 `flex-shrink-0 whitespace-nowrap` 强制禁止折行，在空间受限时通过 `truncate` 截断（需合理设置 `max-w`），并绑定 `title` 或 Tooltip 进行悬浮提示。
```html
<span class="inline-flex items-center px-2 py-0.5 rounded-control text-xs bg-brand/10 text-brand flex-shrink-0 whitespace-nowrap truncate max-w-[80px]" title="文件 Hash">文件 Hash</span>
```

**为什么**：标签主要在紧凑场景下作辅助状态/类型标识。如果允许折行会意外拉伸单元格/容器高度，从而打破整体垂直格栅和排版平衡。

---

## 自检要求

为了保证代码输出质量，我们在单独的文件中维护了完整的检视清单。

👉 **[点击查阅：SD 验收自检清单 (Inspection Checklist)](./inspection-checklist.md)**

**说明：** 在完成代码后，请务必核对该清单中的所有要求。

