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

## 规则 2 — 用语义色而不是基色

❌ **Don't**：
```vue
<a-button style="background: #f52727">删除</a-button>
```

✅ **Do**：
```vue
<a-button danger>删除</a-button>
<!-- 或 -->
<a-button mode="primary" danger>删除</a-button>
```

**为什么**：`danger` prop 派生整套色（bg/border/text/hover/active），不是单个红色。手写 `#f52727` 缺 hover/active 状态。

---

## 规则 3 — Warning vs Risk vs Error vs Fatal

❌ **Don't**：
- 提示"此操作将删除该用户" → 用 `alert.warning`
- 提示"网络不稳定" → 用 `alert.error`

✅ **Do**：

| 语义 | 组件状态 | 颜色基底 | 例子 |
|---|---|---|---|
| 注意/提示 | `info` | blue.l10 | "新版本已发布，请刷新" |
| 警告（不会出错但需注意） | `warning` | brown `#fdaa1d` | "你尚未保存草稿" |
| 高风险（可恢复） | `risk` | orange `#fa721b` | "此操作将解绑设备，可重新绑定" |
| 错误（不可恢复但有限） | `error` | red `#f52727` | "此操作将删除文件，可从回收站找回" |
| 致命（毁灭性） | `fatal` | red.d30（暗红） | "此操作将清空整个集群数据库" |

**为什么**：SASE 设计规范 把 risk 与 error 拆开，是为了表达"严重程度梯度"。用错会让用户对所有红色都麻木。

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

## 规则 8 — 控件 size 自定义

❌ **Don't**：
```css
.sase-button { height: 36px; padding: 0 14px; }
```

✅ **Do**：
```vue
<a-button size="md">默认 32</a-button>
<a-button size="lg">大 40</a-button>
<a-button size="xl">超大 48</a-button>
```

**为什么**：组件 `size` prop 同步调整高度、padding、字号、icon size。手改 height 会让 padding/icon 对不齐。

---

## 规则 9 — 按钮 mode 用错

❌ **Don't**：
- 一个表单 5 个 `mode="primary"` 按钮 — 视觉抢
- 删除按钮用 `mode="primary"` `danger` — 与提交按钮颜色重

✅ **Do**：
| 场景 | mode | extra |
|---|---|---|
| 表单主提交 | `primary` | — |
| 取消 / 关闭 | `default` | — |
| 删除（warning popconfirm 后） | `default` `danger` | — |
| 主流程引导 | `primary` | block (满宽) |
| 内联操作（表格行内） | `text` | size=sm |
| 链接式 | `link` | — |
| 反白浮于图上 | `default` `ghost` | — |
| 危险大按钮 | `primary` `danger` | 仅当**唯一**操作 |

**规则**：**一屏一个 primary**。其余是 default/text/link。

---

## 规则 10 — Modal 滥用

❌ **Don't**：
- 用 modal 显示长表单（30+ 字段）— 应该用页面或 drawer
- 用 modal 显示纯展示信息（只有"知道了"按钮）— 应该用 notification 或 popover
- 多层 modal 嵌套（A 打开 B 打开 C）— 难关闭

✅ **Do**：
| 场景 | 用 |
|---|---|
| 简短确认（≤ 2 字段） | `a-modal` 或 `a-modalService.confirm()` |
| 中等表单（3–10 字段） | `a-drawer` placement="end" width=480 |
| 大表单 / 多步骤 | 跳详情页 / 半屏 drawer |
| 危险操作确认 | `a-popconfirm`（行内）或 `Modal.warning()` |
| 通知 / 提醒 | `a-notification` / `a-message` |
| 简短信息查看 | `a-popover` |

---

## 规则 11 — Tooltip / Popover 文本过长

❌ **Don't**：
```vue
<a-tooltip title="此操作会触发以下三个步骤：1. 删除原数据 2. 重建索引 3. 通知所有订阅者，整个过程可能需要几分钟">
```

✅ **Do**：
- Tooltip ≤ 1 行（≤ 30 字），不带 markdown
- 信息超过 1 行 → 用 `<a-popover>`（可放标题 + 内容 + 链接）
- 复杂帮助 → 跳文档或用 `<a-drawer>`

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

## 规则 17 — 用 inline style 覆盖组件样式

❌ **Don't**：
```vue
<a-button style="background: #1c6eff; color: white; height: 40px;">提交</a-button>
```

✅ **Do**：
```vue
<a-button mode="primary" size="lg">提交</a-button>
```

**为什么**：组件 prop 比 style 优先级低（默认）但更可维护。inline style 会让响应式 / 主题失效。

---

## 规则 18 — CSS 覆写 !important 特异性冲突

❌ **Don't**：
```css
/* 通配式规则 */
:deep(.ant-form) .ant-select,
:deep(.ant-form) .slider-input-group {
  width: 100% !important;
}

/* 然后在外层写约束 */
.align-with-slider {
  width: 440px !important;    /* 被上面的规则覆盖，因为特异性更高 */
}
```

✅ **Do**：
```css
/* 方式一：用 :not() 排除需要约束的元素 */
:deep(.ant-form) .ant-select:not(.align-with-slider) {
  width: 100% !important;
}

/* 方式二：约束规则使用相同或更高的特异性 */
:deep(.ant-form) .align-with-slider {
  width: 440px !important;
  max-width: 440px !important;
}
```

**为什么**：两条规则都带 `!important` 时，CSS 层叠不看 `!important`，而是比较选择器特异性。`:deep(.ant-form) .ant-select` 比 `.align-with-slider` 特异性更高，所以 `100%` 永远赢。这种"自己写的样式打架"是最难排查的布局 Bug。

**强制要求**：
1. 写任何 `!important` 规则前，先搜索当前文件中是否已有针对同一属性的其他 `!important` 规则
2. 如果存在冲突，必须在同一处统一处理，不要在不同位置分别写
3. 避免通配式 `width: 100% !important`，优先用 `flex: 1; min-width: 0` 等自适应方案替代

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

## 自检 15 条 checklist（下游 agent 写代码前过一遍）

1. ✅ 颜色全部用 `var(--sase-color-*)` 而不是 hex？
2. ✅ 间距是 2/4/8/12/16/24/32 之一？
3. ✅ 字号是 10/12/14/16/20/24/30 之一？
4. ✅ 圆角按层级用对了（控件 sm=2 / 容器 md=4）？
5. ✅ 阴影用 `boxShadowSm/Md/Lg`？
6. ✅ 按钮 mode 用了对的语义（一屏一 primary）？
7. ✅ 危险/警告级别选对了（risk/warning/error/fatal）？
8. ✅ 浮层用 `a-modal/Drawer/Popover` 而不是自写？
9. ✅ class 加了项目前缀（不污染 sase-）？
10. ✅ 动效用 motion token？
11. ✅ disabled 状态 cursor 是 not-allowed？
12. ✅ 响应式用了 4 断点之一（不是任意 px）？
13. ✅ 同一属性是否存在多条 `!important` 规则互相覆盖？（规则 18）
14. ✅ Label 宽度是否在浏览器中实测过，而非纯数学推算？（规则 19）
15. ✅ 布局/样式修改后是否在浏览器中做过视觉验证？（规则 20）

