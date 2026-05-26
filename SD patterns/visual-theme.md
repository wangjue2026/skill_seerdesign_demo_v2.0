# Visual Theme（整体视觉风格）

> **何时使用本 skill**：在做任何视觉决策前先读——选风格倾向、定品牌气质、判断"这个设计方向对不对"。也用于向新成员/新 agent 解释 SASE 设计规范 长什么样。

## 1. 风格关键词（5–8 个）

```
克制 (restrained)
扁平 (flat)
理性 (rational)
高密度 (information-dense)
中性化 (neutral-leaning)
蓝灰冷调 (cool, graphite-tinted)
极轻拟物 (minimal skeuomorphism — 仅 box-shadow 与 wave ripple)
程序化 (systematic / token-driven)
```

## 2. 品牌气质

| 维度 | 描述 |
|---|---|
| 目标场景 | 企业级中后台（B 端 admin / SaaS / DevOps / 数据平台） |
| 受众心理预期 | 高效、专注、长时间使用不疲劳 |
| 信息密度 | 高——一屏信息量大于普通 C 端产品 |
| 情绪温度 | 冷调中性，**不**讨好、**不**炫技 |
| 与对标 | 与 Ant Design 同源（部分 shadow 直接借鉴），但更冷、更"工程师向"，主色更纯蓝（#1c6eff vs Ant 的 #1677ff） |

## 3. 视觉范式定位

| 范式 | 是否采用 | 说明 |
|---|---|---|
| 拟物（Skeuomorphism） | ❌ | |
| 扁平（Flat） | ✅ | 主基调 |
| 新拟态（Neumorphism） | ❌ | |
| 玻璃态（Glassmorphism） | ❌ | mask 仅是 `rgba(0,0,0,0.45)` 黑遮罩 |
| Material（FAB / 悬浮纸片） | ⚠️ 部分 | 仅用 box-shadow 表达浮层，无 ripple 动画外的 elevation 暗示 |
| 卡片式（Card-based） | ✅ | card / table / list 是核心容器 |
| Dashboard / 数据可视化 | ✅ | 通过 statistic / progress / table 模块化组合 |

## 4. 标志性视觉特征清单

下面这些是 SASE 设计规范 一眼能被识别的特征。生成时**至少满足前 5 条**，否则风格会偏离。

1. **`#1c6eff` 纯度高的蓝色主色**——比 Ant Design 更冷。
2. **8px 网格**——所有间距、padding、margin 都是 8 的倍数（仅极小处出现 4 / 2）。
3. **4px 主圆角**——卡片、按钮、输入框、modal 全部 `border-radius: 4px`，**不用 6/8/12**（仅 modal/drawer 内部某些区域用 8px=`borderRadiusLg`）。
4. **32px 主控件高**——按钮/输入框/select 默认 32px（md），不用 36/40。
5. **冷蓝灰中性色**（`graphite` 系：`#f7f9fc → #1e232b`），**不是**纯灰（虽然源码也提供 `grey` 系作为备选）。
6. **极淡阴影**——`boxShadowSm: 0 2px 10px 0px rgba(30,35,43,0.16)`，几乎看不见、用于卡片悬浮态；不靠重阴影制造层级。
7. **1px 实线分割**——`lineWidth: 1px`、`lineType: solid`，所有 border / divider 默认是它。
8. **图标线性为主**（`fontSizeIcon: 16px`）——配以少量 `*-filled` 实心图标用于状态强调。
9. **按钮支持 `wave`（点击涟漪）**——除非显式 `waveless`，否则点击时主色按钮有一圈轻微扩散动画。
10. **悬浮元素带 `0 0 0 2px rgba(28,110,255,0.2)` 聚焦环**——所有可交互控件 focus 态统一用 `controlBoxShadowFocus`。
11. **mask 为 `rgba(0,0,0,0.45)` 黑**——modal / drawer 遮罩永远是这个值。
12. **过渡曲线 `cubic-bezier(0.37,0,0.63,1)`（easeInOut）+ 0.24s**——大多数 hover/active 用这个组合，节奏快但不突兀。

## 5. 视觉密度参考

| 元素 | 默认尺寸 | 与典型 C 端对比 |
|---|---|---|
| 表格行高 | 32–40px (`heightMd`–`heightLg`) | C 端常见 56–64px |
| 按钮高 | 32px (md) / 40px (lg) | C 端常见 44–48px |
| 输入框高 | 32px (md) | C 端常见 40–48px |
| 字号 | 14px base | C 端常见 16px base |
| 模态框间距 | 24px (`paddingSizeXl`) | — |

> **结论**：SASE设计规范 是为「鼠标 + 桌面 + 多窗口 + 长时间」设计的，**不是**移动端优先。生成移动端时需要主动适配布局。

## 6. 何时违反这些特征是合理的

- **品牌定制场景**：客户要求换主色/换 base font。但所有派生 token 仍按本系统的派生规则重算。
- **数据可视化区**：图表内部色板可走独立配色（参考 d3 / observable 习惯），但卡片外壳、坐标轴文字仍用本系统 token。
- **内嵌第三方组件**：可保留第三方原生外观，但容器、按钮、tooltip 必须替换为 sase-。

## 7. 反例（一眼不像 SASE 设计规范 的样子）

- 大圆角（≥ 12px）的卡片
- 渐变按钮、彩色阴影
- 紫色/品红/绿色作为主色但保留默认蓝色控件
- 非 8 倍数间距（例如 14px、18px）
- 厚重阴影（多层 + 大模糊半径）
- 圆形头像之外的圆形容器
- 字号 16/18px 作为 body base

## 8. 视觉 Swatch（可直接渲染）

> 设计 agent 可直接复用以下 HTML 块到 HTML mockup 或拆出 hex 值粘到 Figma fill。

### 8.1 主色 + 状态色总览

```html
<div style="display:flex;gap:8px;font-family:pingfang SC,sans-serif">
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#1c6eff;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Primary</div>
    <div style="font-size:10px;color:#6f7785">#1c6eff</div>
  </div>
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#20cc94;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Success</div>
    <div style="font-size:10px;color:#6f7785">#20cc94</div>
  </div>
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#fdaa1d;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Warning</div>
    <div style="font-size:10px;color:#6f7785">#fdaa1d</div>
  </div>
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#fa721b;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Risk</div>
    <div style="font-size:10px;color:#6f7785">#fa721b</div>
  </div>
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#f52727;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Error</div>
    <div style="font-size:10px;color:#6f7785">#f52727</div>
  </div>
  <div style="text-align:center">
    <div style="width:64px;height:64px;background:#82010e;border-radius:4px"></div>
    <div style="margin-top:8px;font-size:12px;color:#2f3540">Fatal</div>
    <div style="font-size:10px;color:#6f7785">#82010e</div>
  </div>
</div>
```

### 8.2 Primary 11 阶（蓝色派生）

```html
<div style="display:flex;border-radius:4px;overflow:hidden;width:550px">
  <div title="l50" style="flex:1;height:48px;background:#e8f4ff"></div>
  <div title="l40" style="flex:1;height:48px;background:#bfdfff"></div>
  <div title="l30" style="flex:1;height:48px;background:#96c7ff"></div>
  <div title="l20" style="flex:1;height:48px;background:#6eadff"></div>
  <div title="l10 (hover)" style="flex:1;height:48px;background:#458fff"></div>
  <div title="base (primary)" style="flex:1;height:48px;background:#1c6eff;outline:2px solid #2f3540;outline-offset:-2px"></div>
  <div title="d10 (active)" style="flex:1;height:48px;background:#0d51d9"></div>
  <div title="d20" style="flex:1;height:48px;background:#0237b3"></div>
  <div title="d30" style="flex:1;height:48px;background:#00258c"></div>
  <div title="d40" style="flex:1;height:48px;background:#001866"></div>
  <div title="d50" style="flex:1;height:48px;background:#000d40"></div>
</div>
```

### 8.3 中性色 graphite 11 阶

```html
<div style="display:flex;border-radius:4px;overflow:hidden;width:550px;border:1px solid #e1e5eb">
  <div title="l50" style="flex:1;height:48px;background:#f7f9fc"></div>
  <div title="l40" style="flex:1;height:48px;background:#edf1f7"></div>
  <div title="l30" style="flex:1;height:48px;background:#e1e5eb"></div>
  <div title="l20 (border)" style="flex:1;height:48px;background:#d3d7de"></div>
  <div title="l10 (disabled)" style="flex:1;height:48px;background:#bec3cc"></div>
  <div title="base (placeholder)" style="flex:1;height:48px;background:#a1a7b3"></div>
  <div title="d10 (info text)" style="flex:1;height:48px;background:#6f7785"></div>
  <div title="d20 (icon)" style="flex:1;height:48px;background:#5e6573"></div>
  <div title="d30" style="flex:1;height:48px;background:#454c59"></div>
  <div title="d40 (text)" style="flex:1;height:48px;background:#2f3540"></div>
  <div title="d50 (shadow base)" style="flex:1;height:48px;background:#1e232b"></div>
</div>
```

### 8.4 Typography Pairing Demo

```html
<div style="font-family:pingfang SC,sans-serif;color:#2f3540;background:#fff;padding:24px;border-radius:4px;border:1px solid #d3d7de;max-width:560px">
  <div style="font-size:24px;font-weight:600;line-height:32px">页面标题（24/600）</div>
  <div style="font-size:12px;color:#6f7785;margin-top:4px">辅助说明文字（12/400）</div>
  <div style="height:1px;background:#e1e5eb;margin:16px 0"></div>
  <div style="font-size:16px;font-weight:600;line-height:24px">模块标题（16/600）</div>
  <div style="font-size:14px;font-weight:400;line-height:22px;margin-top:8px">这里是正文段落，14px 字号、400 字重、22 行高，正文与标题之间用 8px 间距形成呼吸节奏。</div>
  <div style="height:8px"></div>
  <div style="font-size:12px;color:#6f7785;line-height:20px">Caption / 时间戳：2026-04-28 12:00</div>
</div>
```

### 8.5 按钮组 sample

```html
<div style="display:flex;gap:8px;font-family:pingfang SC,sans-serif">
  <button style="height:32px;padding:0 16px;border-radius:2px;border:none;background:#1c6eff;color:#fff;font-size:14px;cursor:pointer">Primary</button>
  <button style="height:32px;padding:0 16px;border-radius:2px;border:1px solid #d3d7de;background:#fff;color:#2f3540;font-size:14px;cursor:pointer">Default</button>
  <button style="height:32px;padding:0 16px;border-radius:2px;border:1px dashed #d3d7de;background:#fff;color:#2f3540;font-size:14px;cursor:pointer">Dashed</button>
  <button style="height:32px;padding:0 16px;border-radius:2px;border:none;background:transparent;color:#2f3540;font-size:14px;cursor:pointer">Text</button>
  <button style="height:32px;padding:0 16px;border-radius:2px;border:none;background:transparent;color:#1c6eff;font-size:14px;cursor:pointer">Link</button>
</div>
```

### 8.6 状态 Tag 组

```html
<div style="display:flex;gap:8px;font-family:pingfang SC,sans-serif;font-size:12px">
  <span style="height:22px;line-height:22px;padding:0 8px;border-radius:2px;background:rgba(32,204,148,0.1);color:#12a679;border:1px solid #12a679">Success</span>
  <span style="height:22px;line-height:22px;padding:0 8px;border-radius:2px;background:rgba(28,110,255,0.1);color:#458fff;border:1px solid #458fff">Info</span>
  <span style="height:22px;line-height:22px;padding:0 8px;border-radius:2px;background:rgba(253,170,29,0.1);color:#fdaa1d;border:1px solid #fdaa1d">Warning</span>
  <span style="height:22px;line-height:22px;padding:0 8px;border-radius:2px;background:rgba(245,39,39,0.1);color:#cf171d;border:1px solid #cf171d">Error</span>
  <span style="height:22px;line-height:22px;padding:0 8px;border-radius:2px;background:#f7f9fc;color:#5e6573;border:1px solid #d3d7de">Default</span>
</div>
```

### 8.7 Card 三态 sample

```html
<div style="display:flex;gap:24px;font-family:pingfang SC,sans-serif">
  <div style="width:240px;background:#fff;border:1px solid #d3d7de;border-radius:4px;padding:16px">
    <div style="font-size:14px;font-weight:600;color:#2f3540">Borderless</div>
    <div style="font-size:12px;color:#6f7785;margin-top:8px">无 shadow，平铺感</div>
  </div>
  <div style="width:240px;background:#fff;border:1px solid #d3d7de;border-radius:4px;padding:16px;box-shadow:0 2px 10px 0 rgba(30,35,43,0.16)">
    <div style="font-size:14px;font-weight:600;color:#2f3540">Default Card</div>
    <div style="font-size:12px;color:#6f7785;margin-top:8px">boxShadowSm，常态</div>
  </div>
  <div style="width:240px;background:#fff;border:1px solid #d3d7de;border-radius:4px;padding:16px;box-shadow:0 4px 16px 0 rgba(30,35,43,0.14)">
    <div style="font-size:14px;font-weight:600;color:#2f3540">Hovered Card</div>
    <div style="font-size:12px;color:#6f7785;margin-top:8px">boxShadowMd，hover 状态</div>
  </div>
</div>
```

> 这些 swatch 直接拷贝到 HTML/iframe 即可渲染，是给设计 agent 输出 mockup 时的"视觉脚手架"。
