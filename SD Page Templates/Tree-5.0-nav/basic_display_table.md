# 基础展示页布局 (basicDisplayPageLayout)

## 1. 资产元数据 (Meta)
- **资产类型 (assetType):** AI 布局资产
- **名称 (name):** 基础展示页布局
- **描述 (description):** 用于还原 SASE 基础展示页结构。包含页头与内容卡片区域，内容卡片可按页面信息分段重复出现。
- **使用说明 (usageInstruction):** 当用户要求生成基础展示类页面、详情展示页、常规信息承载页面时，优先使用本资产；若无额外说明按默认单卡片布局生成。

## 2. AI 生成规则 (AI Generation Rules)

### 强制要求 (Mandatory)
1. 页头宽度为 `100%` 拉通，背景白色。
2. 页头高度固定为 `48`。
3. 页头文字左对齐，标题容器内缩进 `12`。
4. 内容卡片根据容器可用区自适应，保持上下 `8`、左右 `12` 外边距。
5. 内容卡片采用 `border-box` 盒模型。
6. 内容过多时在卡片内部滚动，不改变卡片外框尺寸。
7. 内容卡片可出现多个，卡片之间垂直间距固定为 `16`。

### 还原优先级 (Restore Priority)
1. 页头
2. 内容卡片容器适配
3. 外边距体系
4. 边框与圆角
5. 滚动策略

## 3. 布局结构拆解

### 3.1 页头 (pageHeader)
- **容器 (container):** 
  - 宽度: `100%`
  - 高度: `48`
  - 背景色: `#FFFFFF`
- **标题文本 (titleText):**
  - 字体族: `PingFang SC, 苹方-简, Helvetica Neue, Arial, Hiragino Sans GB, Microsoft YaHei, sans-serif`
  - 字号: `16`
  - 字重: `500`
  - 行高: `24`
  - 颜色: `#2F3540` (对应 Alias: `--color-graphite-d40`)
  - 对齐方式: `left`
- **布局备注 (layoutNotes):** 
  - 内容对齐: `center` (垂直居中)
  - 左侧缩进: `12`

### 3.2 内容卡片 (contentCard)
- **用途 (purpose):** 承载页面全部信息内容，可单卡片或多卡片串联使用。
- **容器 (container):**
  - 宽度: `calc(100% - 24px)`
  - 高度: `calc(100% - 64px)`
  - 圆角: `2`
  - 背景色: `#FFFFFF`
  - 边框: `1px solid #E1E5EB` (对应 Alias: `--color-graphite-l30`)
  - 盒模型: `border-box`
- **页面外边距 (pageMargin):** 
  - 上 (top): `8`, 右 (right): `12`, 下 (bottom): `8`, 左 (left): `12`
- **边框规格 (borderSpec):** `1px` (上、右、下、左)
- **圆角规格 (cornerRadiusSpec):** `2px` (左上、右上、左下、右下)
- **基准内容尺寸 (contentSize):** 宽度 `1102` × 高度 `704`
- **盒模型规则 (boxModel):** 
  - 模式: `border-box`
  - 包含: `padding+border`
- **多卡片布局 (multiCardLayout):** 垂直间距 (verticalGap) `16`

## 4. AI 提示词模板 (Prompt Template for AI)

- **指令 (instruction):**  
  > 请优先使用资产生成基础展示页。必须还原页头宽度 100% 且高度 48、内容卡片上下 8 左右 12 外边距、以及卡片内部滚动策略。
- **期望结果 (expectedResult):**  
  > 生成结果应与本资产定义的基础展示页布局规格一致