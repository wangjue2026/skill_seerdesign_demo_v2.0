## Dashboard（数据总览）

### 1.1 像素蓝图（1440 × 900）

```
┌────────────────────────────────────────────────────────────────────────┐
│ Header  64h, bg #fff, border-bottom 1px #e1e5eb                        │
│  Logo (24h) ← 24 → ProductName 16/600          User 32 ← 24 →           │
└────────────────────────────────────────────────────────────────────────┘
┌────┬──────────────────────────────────────────────────────────────────┐
│    │ Page padding 24                                                   │
│    │  ┌──────────┐ ← 24 → ┌──────────┐ ← 24 → ┌──────────┐ ← 24 → ...   │
│ S  │  │ stat 1   │       │ stat 2   │       │ stat 3   │              │
│ i  │  │ 320×96   │       │          │       │          │              │
│ d  │  └──────────┘       └──────────┘       └──────────┘              │
│ e  │                                                                   │
│ r  │      ↓ marginTop 24                                               │
│    │  ┌─────────────────────┐ ← 24 → ┌─────────────────────┐          │
│ 240│  │ Chart card 670×360   │       │ Chart card 670×360   │          │
│ w  │  │  - title 16/600       │       │                     │          │
│ d  │  │  - subtitle 12 #6f7785│       │                     │          │
│ a  │  │  - chart area 600×280 │       │                     │          │
│ r  │  └─────────────────────┘       └─────────────────────┘          │
│ k  │                                                                   │
│    │      ↓ marginTop 24                                               │
│    │  ┌────────────────────────────────────────────────────────┐      │
│    │  │ Recent Activity (Pro Table)                            │      │
│    │  │  height 400 (header 40 + 8 rows × 40 + pagination 32)  │      │
│    │  └────────────────────────────────────────────────────────┘      │
└────┴──────────────────────────────────────────────────────────────────┘

Sider 240w (collapsed 80) / dark theme #2f3540 / menu items 32h
```

### 1.2 区域尺寸表

| 区域 | 尺寸 | 颜色 / 排版 |
|---|---|---|
| Header 高 | `64` | bg `#fff`, border-bottom `1px #e1e5eb` |
| Header 内 padding | `0 24` | — |
| Logo 高 | `24` | gap to product name `12` |
| Product name | font `16/600 #2f3540` | — |
| Sider 宽（展开） | `240` | bg `#2f3540`（dark theme） / `#fff`（light） |
| Sider 宽（折叠） | `80` | — |
| Page content padding | `24` | bg `#f7f9fc`（页面底色，让卡片浮起） |
| Stat card | `≈320 × 96` | gap 24 between cards |
| Stat card padding | `16` | font: title 14/400 #6f7785, value 24/600 #2f3540, trend 12 |
| Chart card | `≈670 × 360` | padding 16, header 48 + chart area 280 + footer 16 |
| Chart card 标题 | `16/600 #2f3540` | subtitle 12/400 #6f7785 |
| Table card | `1296 × 400` | 充满内容区 |
| 区块间垂直间距 | `24` | (`marginSizeXl`) |

### 1.3 SVG 线框（缩比 1/3）

```svg
<svg viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" font-family="pingfang SC, sans-serif">
  <!-- Page bg -->
  <rect width="1440" height="900" fill="#f7f9fc"/>
  <!-- Header -->
  <rect x="0" y="0" width="1440" height="64" fill="#fff"/>
  <line x1="0" y1="64" x2="1440" y2="64" stroke="#e1e5eb"/>
  <text x="24" y="38" font-size="16" font-weight="600" fill="#2f3540">SASE 设计规范 Dashboard</text>
  <circle cx="1408" cy="32" r="16" fill="#e1e5eb"/>
  <!-- Sider -->
  <rect x="0" y="64" width="240" height="836" fill="#2f3540"/>
  <rect x="12" y="80" width="216" height="32" rx="2" fill="#1c6eff"/>
  <text x="48" y="100" font-size="14" fill="#fff">Overview</text>
  <text x="48" y="140" font-size="14" fill="#bec3cc">Users</text>
  <text x="48" y="180" font-size="14" fill="#bec3cc">Reports</text>
  <text x="48" y="220" font-size="14" fill="#bec3cc">Settings</text>
  <!-- Stat cards row -->
  <g transform="translate(264, 88)">
    <rect width="320" height="96" rx="4" fill="#fff" stroke="#d3d7de"/>
    <text x="16" y="32" font-size="14" fill="#6f7785">DAU</text>
    <text x="16" y="68" font-size="24" font-weight="600" fill="#2f3540">12,345</text>
    <text x="16" y="86" font-size="12" fill="#12a679">↑ 12.3%</text>
  </g>
  <g transform="translate(608, 88)">
    <rect width="320" height="96" rx="4" fill="#fff" stroke="#d3d7de"/>
    <text x="16" y="32" font-size="14" fill="#6f7785">Revenue</text>
    <text x="16" y="68" font-size="24" font-weight="600" fill="#2f3540">¥ 86.4K</text>
    <text x="16" y="86" font-size="12" fill="#cf171d">↓ 3.1%</text>
  </g>
  <g transform="translate(952, 88)">
    <rect width="320" height="96" rx="4" fill="#fff" stroke="#d3d7de"/>
    <text x="16" y="32" font-size="14" fill="#6f7785">Conversion</text>
    <text x="16" y="68" font-size="24" font-weight="600" fill="#2f3540">4.2%</text>
    <text x="16" y="86" font-size="12" fill="#12a679">↑ 0.5%</text>
  </g>
  <!-- Chart cards -->
  <g transform="translate(264, 208)">
    <rect width="670" height="360" rx="4" fill="#fff" stroke="#d3d7de"/>
    <text x="16" y="36" font-size="16" font-weight="600" fill="#2f3540">Daily Active Users</text>
    <text x="16" y="56" font-size="12" fill="#6f7785">Last 30 days</text>
    <rect x="16" y="80" width="638" height="264" fill="#f7f9fc"/>
  </g>
  <g transform="translate(958, 208)">
    <rect width="362" height="360" rx="4" fill="#fff" stroke="#d3d7de"/>
    <text x="16" y="36" font-size="16" font-weight="600" fill="#2f3540">Channels</text>
    <rect x="16" y="80" width="330" height="264" fill="#f7f9fc"/>
  </g>
  <!-- Table -->
  <g transform="translate(264, 592)">
    <rect width="1056" height="288" rx="4" fill="#fff" stroke="#d3d7de"/>
    <rect x="0" y="0" width="1056" height="40" fill="#edf1f7"/>
    <text x="16" y="24" font-size="12" font-weight="500" fill="#454c59">User</text>
    <text x="240" y="24" font-size="12" font-weight="500" fill="#454c59">Action</text>
    <text x="480" y="24" font-size="12" font-weight="500" fill="#454c59">Time</text>
    <text x="720" y="24" font-size="12" font-weight="500" fill="#454c59">Status</text>
    <line x1="0" y1="40" x2="1056" y2="40" stroke="#e1e5eb"/>
    <line x1="0" y1="80" x2="1056" y2="80" stroke="#e1e5eb"/>
    <text x="16" y="64" font-size="14" fill="#2f3540">john@ex.com</text>
    <text x="240" y="64" font-size="14" fill="#2f3540">Created project</text>
    <text x="480" y="64" font-size="14" fill="#6f7785">2 mins ago</text>
    <rect x="720" y="52" width="56" height="22" rx="2" fill="rgba(32,204,148,0.1)"/>
    <text x="748" y="64" text-anchor="middle" font-size="12" fill="#12a679">Active</text>
  </g>
</svg>
```

---

