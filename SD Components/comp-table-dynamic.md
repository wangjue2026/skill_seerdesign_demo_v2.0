# 动态数据表格与列配置组件规范

## 使用声明

本规范定义了**数据驱动型动态表格（Dynamic Table）**与**列设置气泡面板（Column Settings Popover）**的整体视觉标准、交互逻辑与状态联动规则，不提供特定前端框架组件库的底层封装。

开发时，必须遵守当前项目的技术栈约束（基于原生 HTML/JS + Alpine.js，严禁使用 Vue 生态）。

---

## 目录
- [一、核心设计理念](#一核心设计理念)
- [二、显示密度规范](#二显示密度规范)
- [三、列设置气泡面板规范](#三列设置气泡面板规范)
  - [3.1 触发与定位](#31-触发与定位)
  - [3.2 视觉与尺寸](#32-视觉与尺寸)
  - [3.3 列表项交互与状态](#33-列表项交互与状态)
- [四、动态联动与状态计算](#四动态联动与状态计算)
  - [4.1 数据驱动模型 (Schema)](#41-数据驱动模型-schema)
  - [4.2 列显隐与 Colgroup 同步](#42-列显隐与-colgroup-同步)
  - [4.3 双向冻结列 (Sticky Offset) 计算](#43-双向冻结列-sticky-offset-计算)
  - [4.4 拖拽排序与重排算法](#44-拖拽排序与重排算法)
- [五、标准高保真代码骨架 (HTML + Alpine.js)](#五标准高保真代码骨架-html--alpinejs)

---

## 一、核心设计理念

传统的静态表格在字段过多时容易产生横向排版拥挤或溢出问题。**动态表格**通过将表格列的定义（Schema）数据化，结合**列设置气泡面板**，赋予用户自主定制表格视图（列显隐、列顺序、两侧冻结）的能力。

为保证用户体验一致性，动态表格的渲染、隐藏、排序、冻结等操作必须实现**像素级、无延迟的即时响应**，且在操作时不得引起表格行高抖动或错位。

---

## 二、显示密度规范

根据真实环境设计，动态表格支持三种显示密度，分别对应不同的行高与字号内边距，以适配不同的屏幕尺寸和内容承载量：

1. **紧凑 (Compact)**
   * 表头高度：`32px`，单元格上下 padding 为 `6px`（行高统一为 `20px`）
   * 表体行高：`32px`，单元格上下 padding 为 `6px`
   * 适用场景：大量纯数字审计日志、多字段密集对比视图
2. **适中 (Medium - 默认)**
   * 表头高度：`32px`，单元格上下 padding 为 `6px`
   * 表体行高：`40px`，单元格上下 padding 为 `10px`
   * 适用场景：标准后台管理数据列表，确保极佳的可读性与呼吸感
3. **宽松 (Loose)**
   * 表头高度：`40px`，单元格上下 padding 为 `10px`
   * 表体行高：`48px`，单元格上下 padding 为 `14px`
   * 适用场景：数据项稀疏、带较长标签或包含图表等复杂控件的详情表格

* **表头字重**：表格所有表头单元格的字段文字统一**不加粗**，字重设置为 `400`（`font-weight: 400`），从而获得更加柔和、精细的视觉层级。

---

## 三、列设置气泡面板规范

列设置气泡面板（`.ix-pro-table-layout-tool`）是挂载在表头最右侧 “配置列 / 触发器（`.ix-pro-table-layout-tool-trigger` / Ellipsis `...` 图标）” 处的控制浮层。

### 3.1 触发与定位
* **触发方式**：点击触发器容器中的 `ix-icon-ellipsis` 触发。再次点击或点击浮层外部（`click.outside`）时关闭。
* **传送与定位规则**：
  - **传送机制 (Teleport)**：为彻底防止表格容器（`.ix-table-container`）的 `overflow: auto/hidden` 造成浮层裁剪或布局位移，浮层元素必须通过传送机制（如 Alpine.js `x-teleport="body"`）渲染在 `<body>` 根节点下。
  - **绝对定位**：在每次展开浮层时，通过 JavaScript 获取触发器的视口矩形（`getBoundingClientRect()`）与页面滚动条偏移量，动态计算出浮层的位置（`top` = 触发器底部 + 4px，`left` = 触发器右侧 - 浮层宽度），从而实现高保真的 `bottom-end` 悬浮贴合定位。
* **层级（z-index）**：浮层层级必须在 `100` 以上（通常为 `1006`，对应 `--ix-box-shadow-md` 浮层），确保遮挡页面所有表格内容及冻结列。

### 3.2 视觉与尺寸
* **宽度**：最小宽度 `240px` (`--ix-popover-min-width`)。
* **高度**：最大高度为 `360px`，超出时列表区（`.ix-pro-table-layout-tool-tree-wrapper`）出现纵向滚动条。
* **圆角与边框**：圆角为 `2px` (`--ix-overlay-border-radius`)，无边框或一级细边框。
* **阴影**：使用二级阴影 Token `--ix-box-shadow-md` (`0 4px 16px 0px rgba(30, 35, 43, 0.14)`)。
* **背景色**：使用 `--ix-overlay-bg-color` (#ffffff)。
* **内部布局**：
  * **头部 (Header - `.ix-header-sm`)**：高度 36px，包含标题“布局设置”（`.ix-header-title`）与右侧的显示密度切换图标组。
  * **显示密度选项**：在头部右侧的 `.ix-header-suffix` 包含三个密度切换图标（`grid-compact` 紧凑, `grid-medium` 适中, `grid-loose` 宽松），当前选中状态图标呈高亮蓝色（`.ix-pro-table-layout-tool-header-icon-active`）。
  * **搜索框 (Search Box - `.ix-pro-table-layout-tool-search-wrapper`)**：高度 24px，包含搜索输入框和搜索放大镜图标（`ix-icon-search`），用于快速过滤列表字段。
  * **操作区 (Select Wrapper - `.ix-pro-table-layout-tool-select-wrapper`)**：包含“全部”复选框（左侧）与“重置”按钮（右侧链接色 `.ix-button-link`），高 32px。
  * **列表区 (List Area - `.ix-pro-table-layout-tool-tree-wrapper`)**：以树节点列表展示可配置列字段，支持滚动与拖拽。

### 3.3 列表项交互与状态
列表区中的每个树节点（`.ix-tree-node`）高度固定为 `32px`，左右 padding 为 12px。系统强制列（如 selection / serial / op）不可隐藏，列表项会增加 `.ix-tree-node-disabled` 状态。从左到右包含以下四个元素：

1. **拖拽手柄 (Drag Handle - `.ix-tree-node-draggable-icon`)**：
   * 视觉：展示手柄图标（`.ix-icon-holder`，对应六点图标），颜色为 `--ix-color-icon-info` (#bec3cc)。
   * 光标：鼠标悬浮时变为 `grab`（抓取），拖动时为 `grabbing`。如果是不可拖拽的系统强制列，此处展示占位空白元素 `.ix-tree-node-draggable-icon-noop`。
2. **复选框 (Checkbox - `.ix-checkbox`)**：
   * 包含 `.ix-checkbox-input-box`。选中态为 `.ix-checkbox-checked`，禁用态为 `.ix-checkbox-disabled`。
   * 交互：勾选代表显示，取消勾选代表隐藏。系统强制列复选框展示为选中且禁用的状态（`ix-checkbox-checked ix-checkbox-disabled`）。
3. **列名称 (Column Title - `.ix-tree-node-content-label`)**：
   * 字号 12px，字重 400，颜色为 `--ix-color-text` (#2f3540)。过长时以 `truncate` 截断，hover 时显示原生 title。
4. **冻结图钉 (Pin Icons - `.ix-tree-node-content-suffix` 内)**：
   * 提供双向固定按钮（`.ix-icon-vertical-align-top`）：
     * **向左图钉 (Pin Left)**：点击将该列固定在列首（`fixed: 'left'`）。
     * **向右图钉 (Pin Right)**：点击将该列固定在列尾（`fixed: 'right'`，操作列左侧）。
   * 状态：已固定呈蓝色高亮（`.active`），未固定呈灰色描边，悬浮时变蓝。向右图钉带有旋转样式 `transform: rotate(180deg)`。

> **⚠️ 避坑红线**：
> * **禁止隐藏/拖拽关键列**：**复选框列 (selection)**、**序号列 (serial)**、**操作列 (op)** 为系统强制列，在配置面板中**不可隐藏**（复选框展示为选中且禁用状态）且**不可被拖拽排序**（拖拽手柄隐形或置灰）。

---

## 四、动态联动与状态计算

为了实现“自动读取表格字段并支持排序、冻结”，必须将表格的列属性抽象为统一的 JavaScript 数据模型。

### 4.1 数据驱动模型 (Schema)
在 Alpine.js 状态中，标准的列定义数组结构如下：
```javascript
columns: [
  // cannotHide: 禁止隐藏, cannotDrag: 禁止拖拽, fixed: 冻结方向 ('left' | 'right' | null)
  { key: 'selection', title: '勾选', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
  { key: 'serial', title: '', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
  { key: 'type', title: '类型', width: 100, visible: true, fixed: 'left' },
  { key: 'value', title: '对象值', width: 320, visible: true },
  { key: 'desc', title: '描述', width: 260, visible: true },
  { key: 'creator', title: '创建人', width: 120, visible: true },
  { key: 'createTime', title: '创建时间', width: 180, visible: true },
  { key: 'updateTime', title: '更新时间', width: 180, visible: true },
  { key: 'remark', title: '备注', width: 200, visible: true },
  { key: 'status', title: '状态', width: 100, visible: true },
  { key: 'op', title: '操作', width: 120, visible: true, fixed: 'right', cannotHide: true, cannotDrag: true }
]
```

### 4.2 列显隐与 Colgroup 同步
为彻底解决表格渲染错位，必须：
* 在 `<table>` 内部声明 `<colgroup>` 元素。
* 无论是 `<colgroup>` 中的 `<col>` 还是 `<thead>` 和 `<tbody>` 中的单元格，**全部统一使用可见列的数组子集 `columns.filter(c => c.visible)` 进行渲染**。
* **严禁对 `<th>` 或 `<td>` 使用 `x-show` 隐藏**，隐藏列必须彻底从 DOM 中移除以保证浏览器渲染器对列数的计算绝对匹配。

### 4.3 双向冻结列 (Sticky Offset) 计算
当多列同时被冻结在左侧或右侧时，每一列的 `left` / `right` 偏移量是**其侧前方所有可见且同侧冻结列的宽度之和**。

1. **左侧冻结偏移量计算**：
```javascript
getLeftOffset(column) {
  if (column.fixed !== 'left' || !column.visible) return '';
  let offset = 0;
  for (let col of this.columns) {
    if (col.key === column.key) break;
    if (col.visible && col.fixed === 'left') {
      offset += col.width || 0;
    }
  }
  return offset + 'px';
}
```

2. **右侧冻结偏移量计算**（以配置列宽度 40px 为基准）：
```javascript
getRightOffset(column) {
  if (column.fixed !== 'right' || !column.visible) return '';
  let offset = 40; // 静态配置列宽度固定为 40px 占用最右侧 right: 0px 位置
  let found = false;
  for (let col of this.columns) {
    if (col.key === column.key) {
      found = true;
      continue;
    }
    if (found && col.visible && col.fixed === 'right') {
      offset += col.width || 0;
    }
  }
  return offset + 'px';
}
```

### 4.4 拖拽排序与重排算法
当用户重新排列或改变冻结方向时，必须通过一个确定的重排算法重组 `columns` 数组，以维持表格整体列顺序的逻辑正确性：
```javascript
reorderColumns() {
  // 1. 提取首位锁定列
  let selectionCol = this.columns.find(c => c.key === 'selection');
  let serialCol = this.columns.find(c => c.key === 'serial');
  
  // 2. 提取末尾锁定操作列
  let opCol = this.columns.find(c => c.key === 'op');
  
  // 3. 提取所有可排序列
  let others = this.columns.filter(c => c.key !== 'selection' && c.key !== 'serial' && c.key !== 'op');
  
  // 4. 按冻结状态归类
  let leftPinned = others.filter(c => c.fixed === 'left');
  let unpinned = others.filter(c => !c.fixed);
  let rightPinned = others.filter(c => c.fixed === 'right');
  
  // 5. 合并并重组原数组
  this.columns = [
    selectionCol,
    serialCol,
    ...leftPinned,
    ...unpinned,
    ...rightPinned,
    opCol
  ];
}
```

---

## 五、标准高保真代码骨架 (HTML + Alpine.js)

以下是一个开箱即用、完全自包含对齐与重排计算逻辑的高保真 HTML 骨架。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>SeerDesign 生产级动态表格与列配置骨架</title>
  <link rel="stylesheet" href="../assets/css-overrides.css">
  <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  <script src="https://cdn.tailwindcss.com"></script>
  
  <style>
    /* SeerDesign 核心 Token 映射 */
    :root {
      --ix-reset-color-text: #2f3540;
      --ix-reset-color-text-title: #2f3540;
      --ix-reset-color-bg: #ffffff;
      --ix-reset-color-link: #1c6eff;
      --ix-reset-font-family: pingfang SC, helvetica neue, arial, hiragino sans gb, microsoft yahei ui, microsoft yahei, simsun, sans-serif;
      --ix-reset-font-size: 12px;
      
      --ix-color-primary: #1c6eff;
      --ix-color-primary-hover: #458fff;
      --ix-color-primary-active: #0d51d9;
      --ix-color-text: #2f3540;
      --ix-color-border: #d3d7de;
      --ix-color-border-secondary: #e1e5eb;
      --ix-color-white: #ffffff;
      --ix-box-shadow-md: 0 4px 16px 0px rgba(30, 35, 43, 0.14);
      --ix-color-container-bg: #ffffff;
      --ix-color-container-bg-hover: #f7f9fc;
      --ix-color-container-bg-active: #e8f4ff;
      --ix-color-container-bg-disabled: #edf1f7;
      --ix-color-emphasized-container-bg: #edf1f7;
      --ix-color-emphasized-container-bg-hover: #e1e5eb;
      --ix-color-text-placeholder: #a1a7b3;
      --ix-color-text-disabled: #bec3cc;
      --ix-color-text-title: #2f3540;
      --ix-color-text-title-secondary: #454c59;
      --ix-color-text-info: #6f7785;
      --ix-color-icon: #5e6573;
      --ix-color-icon-info: #bec3cc;
      --ix-color-icon-hover: #1c6eff;
      
      --ix-component-border-radius: 2px;
      --ix-overlay-bg-color: #ffffff;
      --ix-overlay-border-radius: 2px;
      --ix-popover-font-size: 12px;
      --ix-popover-color: #6f7785;
      --ix-popover-min-width: 240px;
      --ix-control-height-sm: 24px;
    }

    /* 表格布局约束 */
    .ix-table-container {
      position: relative;
      border: 1px solid var(--ix-color-border-secondary);
      background-color: var(--ix-color-white);
      width: 100%;
      overflow: auto;
    }
    table.ix-table-table {
      table-layout: fixed !important;
      border-collapse: collapse !important;
      width: 100% !important;
      background-color: var(--ix-color-white);
    }
    
    /* 强约束单元格渲染 */
    table.ix-table-table th, table.ix-table-table td {
      background-clip: padding-box !important;
      box-sizing: border-box !important;
      font-size: 12px !important;
      font-family: var(--ix-reset-font-family) !important;
      text-align: left;
      vertical-align: middle;
      border: none !important;
      border-bottom: 1px solid var(--ix-color-border-secondary) !important;
    }
    
    /* 表头样式 */
    table.ix-table-table th {
      background-color: var(--ix-color-emphasized-container-bg) !important;
      color: var(--ix-color-text-title-secondary) !important;
      font-weight: 400 !important;
      white-space: nowrap !important;
      position: relative;
    }
    
    /* 表头分割线 */
    table.ix-table-table th:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 25%;
      height: 50%;
      width: 1px;
      background-color: var(--ix-color-border-secondary);
    }
    
    /* 表体行 hover 态 */
    table.ix-table-table tbody tr:hover td {
      background-color: var(--ix-color-container-bg-hover) !important;
    }
    
    /* 密度类定义 */
    .density-compact th { height: 32px !important; padding: 0 8px !important; }
    .density-compact td { height: 32px !important; padding: 0 8px !important; }
    .density-medium th { height: 32px !important; padding: 0 12px !important; }
    .density-medium td { height: 40px !important; padding: 0 12px !important; }
    .density-loose th { height: 40px !important; padding: 0 16px !important; }
    .density-loose td { height: 48px !important; padding: 0 16px !important; }
    
    /* 冻结列样式 */
    .ix-table-fix-start {
      position: sticky !important;
      z-index: 10;
      background-color: var(--ix-color-white) !important;
    }
    .ix-table-thead .ix-table-fix-start {
      z-index: 15;
      background-color: var(--ix-color-emphasized-container-bg) !important;
    }
    .ix-table-fix-end {
      position: sticky !important;
      z-index: 10;
      background-color: var(--ix-color-white) !important;
    }
    .ix-table-thead .ix-table-fix-end {
      z-index: 15;
      background-color: var(--ix-color-emphasized-container-bg) !important;
    }
    
    /* 气泡设置面板样式 */
    .ix-pro-table-layout-tool {
      font-family: var(--ix-reset-font-family);
      font-size: var(--ix-popover-font-size);
      color: var(--ix-color-text);
      background-color: var(--ix-overlay-bg-color);
      border-radius: var(--ix-overlay-border-radius);
      box-shadow: var(--ix-box-shadow-md);
      width: var(--ix-popover-min-width);
      box-sizing: border-box;
      z-index: 1006;
      border: 1px solid var(--ix-color-border-secondary);
    }
    .ix-popover-wrapper {
      padding: 0;
    }
    .ix-header-sm {
      height: 36px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ix-color-border-secondary);
      box-sizing: border-box;
    }
    .ix-header-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--ix-color-text-title);
    }
    .ix-space {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ix-pro-table-layout-tool-header-icon {
      font-size: 16px;
      color: var(--ix-color-icon);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .ix-pro-table-layout-tool-header-icon:hover {
      color: var(--ix-color-primary);
    }
    .ix-pro-table-layout-tool-header-icon-active {
      color: var(--ix-color-primary) !important;
    }
    .ix-pro-table-layout-tool-header-icon svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
    
    .ix-popover-content {
      padding: 0;
    }
    .ix-pro-table-layout-tool-content {
      padding: 8px 0 0 0;
    }
    
    /* 搜索框 */
    .ix-pro-table-layout-tool-search-wrapper {
      padding: 0 12px 8px 12px;
    }
    .ix-input-sm {
      display: inline-flex;
      align-items: center;
      width: 100%;
      height: var(--ix-control-height-sm);
      border: 1px solid var(--ix-color-border);
      border-radius: var(--ix-component-border-radius);
      padding: 0 8px;
      box-sizing: border-box;
      background-color: var(--ix-reset-color-bg);
      transition: border-color 0.2s;
    }
    .ix-input-sm:hover, .ix-input-sm:focus-within {
      border-color: var(--ix-color-primary-hover);
    }
    .ix-input-inner {
      border: none;
      outline: none;
      font-size: 12px;
      width: 100%;
      color: var(--ix-color-text);
      background: transparent;
    }
    .ix-input-inner::placeholder {
      color: var(--ix-color-text-placeholder);
    }
    .ix-input-suffix {
      display: flex;
      align-items: center;
      color: var(--ix-color-icon-info);
    }
    .ix-input-suffix svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }
    
    /* 全部和重置 */
    .ix-pro-table-layout-tool-select-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      padding: 0 12px;
      border-bottom: 1px solid var(--ix-color-border-secondary);
      background-color: var(--ix-color-white);
      box-sizing: border-box;
    }
    .ix-checkbox {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      cursor: pointer;
      color: var(--ix-color-text);
      user-select: none;
    }
    .ix-checkbox-input {
      position: relative;
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 8px;
    }
    .ix-checkbox-input-inner {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
    }
    .ix-checkbox-input-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 14px;
      height: 14px;
      border: 1px solid var(--ix-color-border);
      border-radius: 2px;
      background-color: var(--ix-color-white);
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .ix-checkbox:hover .ix-checkbox-input-box {
      border-color: var(--ix-color-primary-hover);
    }
    .ix-checkbox-checked .ix-checkbox-input-box {
      background-color: var(--ix-color-primary) !important;
      border-color: var(--ix-color-primary) !important;
    }
    .ix-checkbox-checked .ix-checkbox-input-box::after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 7px;
      border: 2px solid var(--ix-color-white);
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg);
    }
    .ix-checkbox-indeterminate .ix-checkbox-input-box {
      background-color: var(--ix-color-primary) !important;
      border-color: var(--ix-color-primary) !important;
    }
    .ix-checkbox-indeterminate .ix-checkbox-input-box::after {
      content: "";
      position: absolute;
      left: 3px;
      top: 5px;
      width: 6px;
      height: 2px;
      background-color: var(--ix-color-white) !important;
    }
    .ix-checkbox-disabled {
      cursor: not-allowed;
      color: var(--ix-color-text-disabled);
    }
    .ix-checkbox-disabled .ix-checkbox-input-box {
      background-color: var(--ix-color-emphasized-container-bg) !important;
      border-color: var(--ix-color-border) !important;
    }
    .ix-checkbox-disabled.ix-checkbox-checked .ix-checkbox-input-box::after {
      border-color: var(--ix-color-text-disabled) !important;
    }
    .ix-button-link {
      background: none;
      border: none;
      color: var(--ix-color-link);
      font-size: 12px;
      cursor: pointer;
      padding: 0;
      line-height: inherit;
    }
    .ix-button-link:hover {
      color: var(--ix-color-primary-hover);
    }
    
    /* 列表树区 */
    .ix-pro-table-layout-tool-tree-wrapper {
      max-height: 240px;
      overflow-y: auto;
    }
    .ix-tree-node {
      display: flex;
      align-items: center;
      height: 32px;
      padding: 0 12px;
      cursor: default;
      transition: background-color 0.2s;
      box-sizing: border-box;
    }
    .ix-tree-node:hover {
      background-color: var(--ix-color-container-bg-hover);
    }
    .ix-tree-node-disabled {
      cursor: not-allowed;
      background-color: transparent !important;
    }
    .ix-tree-node-draggable-icon {
      display: flex;
      align-items: center;
      color: var(--ix-color-icon-info);
      cursor: grab;
      margin-right: 4px;
    }
    .ix-tree-node-draggable-icon svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
    .ix-tree-node-draggable-icon-noop {
      width: 18px; /* 占位宽度 */
    }
    .ix-tree-node-checkbox {
      margin-right: 4px;
    }
    .ix-tree-node-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
    }
    .ix-tree-node-content-label {
      font-size: 12px;
      color: var(--ix-color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ix-tree-node-content-suffix {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ix-tree-node-content-suffix i {
      cursor: pointer;
      color: var(--ix-color-icon-info);
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .ix-tree-node-content-suffix i:hover {
      color: var(--ix-color-primary);
    }
    .ix-tree-node-content-suffix i.active {
      color: var(--ix-color-primary) !important;
    }
    .ix-tree-node-content-suffix i svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
    
    /* 拖动悬浮指示线 */
    .drag-hover-line {
      border-top: 2px solid var(--ix-color-primary) !important;
    }
    
    /* 配置触发器 */
    .ix-pro-table-layout-tool-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--ix-color-icon);
      width: 100%;
      height: 100%;
      transition: color 0.2s;
    }
    .ix-pro-table-layout-tool-trigger:hover {
      color: var(--ix-color-primary);
    }
    .ix-pro-table-layout-tool-trigger svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  </style>
</head>
<body class="bg-[#F7F9FC] p-6">

  <!-- 核心控制器 -->
  <div class="bg-white p-4 shadow-sm"
       x-data="{
         // 状态参数
         showPopover: false,
         density: 'medium', // 'compact' | 'medium' | 'loose'
         columnSearch: '',
         draggedKey: null,
         dragOverKey: null,
         
         // 气泡定位样式：必须渲染在 body 级别以防止被表格的 overflow: auto 裁剪，坐标由 JS 动态计算
         popoverStyle: {
           position: 'absolute',
           left: '0px',
           top: '0px',
           textAlign: 'left'
         },
         
         // 列模型定义
         columns: [
           { key: 'selection', title: '勾选', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
           { key: 'serial', title: '', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
           { key: 'type', title: '类型', width: 100, visible: true, fixed: 'left' },
           { key: 'value', title: '对象值', width: 320, visible: true },
           { key: 'desc', title: '描述', width: 260, visible: true },
           { key: 'creator', title: '创建人', width: 120, visible: true },
           { key: 'createTime', title: '创建时间', width: 180, visible: true },
           { key: 'updateTime', title: '更新时间', width: 180, visible: true },
           { key: 'remark', title: '备注', width: 200, visible: true },
           { key: 'status', title: '状态', width: 100, visible: true },
           { key: 'op', title: '操作', width: 120, visible: true, fixed: 'right', cannotHide: true, cannotDrag: true }
         ],
         
         // 模拟数据
         tableData: [
           { id: 1, type: '文件 Hash', value: 'd41d8cd98f00b204e9800998ecf8427e', desc: '信任文件校验和', creator: '张三', createTime: '2026-05-28 10:00:00', updateTime: '2026-05-29 09:30:00', remark: '系统默认导入', status: '启用' },
           { id: 2, type: '进程', value: 'C:\\Windows\\System32\\drivers\\custom.exe', desc: '白名单主进程路径', creator: '李四', createTime: '2026-05-28 11:30:00', updateTime: '2026-05-28 11:30:00', remark: '安全合规白名单', status: '禁用' },
           { id: 3, type: 'IP地址', value: '192.168.1.105', desc: '内网审计服务器IP', creator: '王五', createTime: '2026-05-29 08:00:00', updateTime: '2026-05-29 08:15:00', remark: '审计链节点', status: '启用' }
         ],
         
         // 计算左侧冻结偏移量
         getLeftOffset(column) {
           if (column.fixed !== 'left' || !column.visible) return '';
           let offset = 0;
           for (let col of this.columns) {
             if (col.key === column.key) break;
             if (col.visible && col.fixed === 'left') {
               offset += col.width || 0;
             }
           }
           return offset + 'px';
         },
         
         // 计算右侧冻结偏移量 (操作列和配置列在右侧)
         getRightOffset(column) {
           if (column.fixed !== 'right' || !column.visible) return '';
           let offset = 40; // 静态配置列宽度
           let found = false;
           for (let col of this.columns) {
             if (col.key === column.key) {
               found = true;
               continue;
             }
             if (found && col.visible && col.fixed === 'right') {
               offset += col.width || 0;
             }
           }
           return offset + 'px';
         },
         
         // 切换冻结状态
         togglePin(col, side) {
           if (col.cannotDrag) return;
           if (side === 'left') {
             col.fixed = (col.fixed === 'left') ? null : 'left';
           } else if (side === 'right') {
             col.fixed = (col.fixed === 'right') ? null : 'right';
           }
           this.reorderColumns();
         },
         
         // 数组重排逻辑
         reorderColumns() {
           let selectionCol = this.columns.find(c => c.key === 'selection');
           let serialCol = this.columns.find(c => c.key === 'serial');
           let opCol = this.columns.find(c => c.key === 'op');
           
           let others = this.columns.filter(c => c.key !== 'selection' && c.key !== 'serial' && c.key !== 'op');
           
           let leftPinned = others.filter(c => c.fixed === 'left');
           let unpinned = others.filter(c => !c.fixed);
           let rightPinned = others.filter(c => c.fixed === 'right');
           
           this.columns = [
             ...(selectionCol ? [selectionCol] : []),
             ...(serialCol ? [serialCol] : []),
             ...leftPinned,
             ...unpinned,
             ...rightPinned,
             ...(opCol ? [opCol] : [])
           ];
         },
         
         // 全部一键隐藏/展示
         get allVisible() {
           let config = this.columns.filter(c => c.key !== 'selection' && c.key !== 'serial' && c.key !== 'op');
           return config.every(c => c.visible);
         },
         get someVisible() {
           let config = this.columns.filter(c => c.key !== 'selection' && c.key !== 'serial' && c.key !== 'op');
           return config.some(c => c.visible) && !this.allVisible;
         },
         toggleAll() {
           let target = !this.allVisible;
           this.columns.forEach(c => {
             if (c.key !== 'selection' && c.key !== 'serial' && c.key !== 'op') {
               c.visible = target;
             }
           });
         },
         
         // 过滤后的可显示配置列（仅用于气泡列表的过滤显示）
         get filteredColumns() {
           if (!this.columnSearch) return this.columns;
           return this.columns.filter(col => {
             if (col.key === 'selection' || col.key === 'serial' || col.key === 'op') return true;
             return col.title && col.title.includes(this.columnSearch);
           });
         },
         
         // 拖动处理逻辑
         handleDragStart(key) {
           let col = this.columns.find(c => c.key === key);
           if (col.cannotDrag) return;
           this.draggedKey = key;
         },
         handleDragOver(key) {
           let col = this.columns.find(c => c.key === key);
           if (col.cannotDrag) return;
           this.dragOverKey = key;
         },
         handleDrop(key) {
           if (!this.draggedKey || this.draggedKey === key) return;
           
           let fromIdx = this.columns.findIndex(c => c.key === this.draggedKey);
           let toIdx = this.columns.findIndex(c => c.key === key);
           
           if (fromIdx !== -1 && toIdx !== -1) {
             let draggedCol = this.columns[fromIdx];
             let targetCol = this.columns[toIdx];
             
             if (!draggedCol.cannotDrag && !targetCol.cannotDrag) {
               this.columns.splice(fromIdx, 1);
               let newToIdx = this.columns.findIndex(c => c.key === key);
               this.columns.splice(newToIdx, 0, draggedCol);
               this.reorderColumns();
             }
           }
           
           this.draggedKey = null;
           this.dragOverKey = null;
         },
         
         resetColumns() {
           this.columns = [
             { key: 'selection', title: '勾选', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
             { key: 'serial', title: '', width: 40, visible: true, fixed: 'left', cannotHide: true, cannotDrag: true },
             { key: 'type', title: '类型', width: 100, visible: true, fixed: 'left' },
             { key: 'value', title: '对象值', width: 320, visible: true },
             { key: 'desc', title: '描述', width: 260, visible: true },
             { key: 'creator', title: '创建人', width: 120, visible: true },
             { key: 'createTime', title: '创建时间', width: 180, visible: true },
             { key: 'updateTime', title: '更新时间', width: 180, visible: true },
             { key: 'remark', title: '备注', width: 200, visible: true },
             { key: 'status', title: '状态', width: 100, visible: true },
             { key: 'op', title: '操作', width: 120, visible: true, fixed: 'right', cannotHide: true, cannotDrag: true }
           ];
           this.density = 'medium';
           this.columnSearch = '';
         },
         
         // 切换气泡显示，并在打开时计算位置
         // ⚠️ 注意：获取 event.currentTarget 以及 getBoundingClientRect() 必须同步进行！
         // 严禁放在 $nextTick 或 setTimeout 中异步获取，否则 Alpine.js 的事件对象会被池化回收释放，导致 currentTarget 变成 null
         togglePopover(event) {
           this.showPopover = !this.showPopover;
           if (this.showPopover) {
             const trigger = event.currentTarget;
             const rect = trigger.getBoundingClientRect();
             const popoverWidth = 240; // 对应 var(--ix-popover-min-width)
             const left = rect.right + window.scrollX - popoverWidth;
             const top = rect.bottom + window.scrollY + 4; // 距离按钮底部 4px
             this.popoverStyle = {
               position: 'absolute',
               left: `${left}px`,
               top: `${top}px`,
               textAlign: 'left'
             };
           }
         }
       }">

    <!-- 表格容器 -->
    <div class="ix-table-container">
      <table class="ix-table-table" :class="'density-' + density">
        
        <!-- 动态同步的列宽声明 (Colgroup) -->
        <colgroup>
          <template x-for="col in columns.filter(c => c.visible)" :key="col.key">
            <col :style="{ width: col.width + 'px' }">
          </template>
          <!-- 最右侧配置列固定 40px -->
          <col style="width: 40px;">
        </colgroup>
        
        <thead class="ix-table-thead">
          <tr class="ix-table-row">
            <!-- 渲染可见表头 -->
            <template x-for="col in columns.filter(c => c.visible)" :key="col.key">
              <th :class="{ 
                    'ix-table-cell-align-center': col.key === 'selection' || col.key === 'serial',
                    'ix-table-fix-start': col.fixed === 'left',
                    'ix-table-fix-end': col.fixed === 'right'
                  }"
                  :style="col.fixed === 'left' ? { left: getLeftOffset(col) } : (col.fixed === 'right' ? { right: getRightOffset(col) } : {})">
                  
                  <!-- 复选框表头 -->
                  <template x-if="col.key === 'selection'">
                    <label class="ix-checkbox" :class="allVisible ? 'ix-checkbox-checked' : (someVisible ? 'ix-checkbox-indeterminate' : '')" @click.prevent="toggleAll()">
                      <span class="ix-checkbox-input" role="checkbox">
                        <input type="checkbox" class="ix-checkbox-input-inner" :checked="allVisible">
                        <span class="ix-checkbox-input-box"></span>
                      </span>
                    </label>
                  </template>
                  
                  <!-- 普通表头文字 -->
                  <template x-if="col.key !== 'selection'">
                    <span x-text="col.title"></span>
                  </template>
              </th>
            </template>
            
            <!-- 最后一列配置触发器单元格 (宽度固定为 40px) -->
            <th class="ix-table-fix-end" style="position: sticky; right: 0; padding: 0; text-align: center; z-index: 20;">
              <!-- 触发器按钮：使用 @click.stop 阻止冒泡，防止触发 body 点击监听导致气泡被立即关闭 -->
              <span class="ix-pro-table-layout-tool-trigger"
                    @click.stop="togglePopover($event)">
                <i class="ix-icon ix-icon-ellipsis">
                  <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="ellipsis"><path d="M768 448a64 64 0 1 0 0 128 64 64 0 1 0 0-128Zm-256 0a64 64 0 1 0 0 128 64 64 0 1 0 0-128Zm-256 0a64 64 0 1 0 0 128 64 64 0 1 0 0-128Z"></path></svg>
                </i>
              </span>
              
              <!-- 气泡面板浮层：必须使用 x-teleport="body" 传送至根节点，防止被 .ix-table-container 的 overflow: auto 剪裁 -->
              <template x-teleport="body">
                <div class="ix-overlay ix-popover ix-pro-table-layout-tool"
                     :style="popoverStyle"
                     x-show="showPopover"
                     x-transition.opacity
                     @click.stop=""
                     @click.outside="showPopover = false">
                <div class="ix-popover-wrapper">
                  
                  <!-- 头部 (Header) -->
                  <div class="ix-header ix-header-sm">
                    <div class="ix-header-content">
                      <div class="ix-header-title-wrapper">
                        <span class="ix-header-title">布局设置</span>
                      </div>
                    </div>
                    <span class="ix-header-suffix">
                      <div class="ix-space">
                        <!-- 紧凑 -->
                        <div class="ix-space-item" @click="density = 'compact'">
                          <i class="ix-icon ix-icon-grid-compact ix-pro-table-layout-tool-header-icon" :class="density === 'compact' && 'ix-pro-table-layout-tool-header-icon-active'" title="紧凑">
                            <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="grid-compact"><path d="M907.84 713.024a12.8 12.8 0 0 0 0-18.048l-27.136-27.2a12.8 12.8 0 0 0-18.112 0l-126.72 126.72-126.72-126.72a12.8 12.8 0 0 0-18.048 0l-27.2 27.2a12.8 12.8 0 0 0 0 18.048l162.944 162.944a12.8 12.8 0 0 0 18.112 0l162.88-162.944zm0-402.048a12.8 12.8 0 0 1 0 18.048l-27.136 27.2a12.8 12.8 0 0 1-18.112 0l-126.72-126.72-126.72 126.72a12.8 12.8 0 0 1-18.048 0L563.84 328.96a12.8 12.8 0 0 1 0-18.048l162.944-162.944a12.8 12.8 0 0 1 18.112 0l162.88 162.944zM140.8 192h294.4q12.8 0 12.8 12.8v38.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8v-38.4q0-12.8 12.8-12.8Zm0 192h294.4q12.8 0 12.8 12.8v38.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8v-38.4q0-12.8 12.8-12.8Zm0 192h294.4q12.8 0 12.8 12.8v38.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8v-38.4q0-12.8 12.8-12.8Zm0 192h294.4q12.8 0 12.8 12.8v38.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8v-38.4q0-12.8 12.8-12.8Z"></path></svg>
                          </i>
                        </div>
                        <!-- 适中 -->
                        <div class="ix-space-item" @click="density = 'medium'">
                          <i class="ix-icon ix-icon-grid-medium ix-pro-table-layout-tool-header-icon" :class="density === 'medium' && 'ix-pro-table-layout-tool-header-icon-active'" title="适中">
                            <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="grid-medium"><path d="M907.84 713.024a12.8 12.8 0 0 0 0-18.048l-27.136-27.2a12.8 12.8 0 0 0-18.112 0l-126.72 126.72-126.72-126.72a12.8 12.8 0 0 0-18.048 0l-27.2 27.2a12.8 12.8 0 0 0 0 18.048l162.944 162.944a12.8 12.8 0 0 0 18.112 0l162.88-162.944zm0-402.048a12.8 12.8 0 0 1 0 18.048l-27.136 27.2a12.8 12.8 0 0 1-18.112 0l-126.72-126.72-126.72 126.72a12.8 12.8 0 0 1-18.048 0L563.84 328.96a12.8 12.8 0 0 1 0-18.048l162.944-162.944a12.8 12.8 0 0 1 18.112 0l162.88 162.944zM140.8 192h294.4q12.8 0 12.8 12.8v102.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8V204.8q0-12.8 12.8-12.8Zm0 256h294.4q12.8 0 12.8 12.8v102.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8V460.8q0-12.8 12.8-12.8Zm0 256h294.4q12.8 0 12.8 12.8v102.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8V716.8q0-12.8 12.8-12.8Z"></path></svg>
                          </i>
                        </div>
                        <!-- 宽松 -->
                        <div class="ix-space-item" @click="density = 'loose'">
                          <i class="ix-icon ix-icon-grid-loose ix-pro-table-layout-tool-header-icon" :class="density === 'loose' && 'ix-pro-table-layout-tool-header-icon-active'" title="宽松">
                            <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="grid-loose"><path d="M907.84 713.024a12.8 12.8 0 0 0 0-18.048l-27.136-27.2a12.8 12.8 0 0 0-18.112 0l-126.72 126.72-126.72-126.72a12.8 12.8 0 0 0-18.048 0l-27.2 27.2a12.8 12.8 0 0 0 0 18.048l162.944 162.944a12.8 12.8 0 0 0 18.112 0l162.88-162.944zm0-402.048a12.8 12.8 0 0 1 0 18.048l-27.136 27.2a12.8 12.8 0 0 1-18.112 0l-126.72-126.72-126.72 126.72a12.8 12.8 0 0 1-18.048 0L563.84 328.96a12.8 12.8 0 0 1 0-18.048l162.944-162.944a12.8 12.8 0 0 1 18.112 0l162.88 162.944zM140.8 192h294.4q12.8 0 12.8 12.8v230.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8V204.8q0-12.8 12.8-12.8Zm0 384h294.4q12.8 0 12.8 12.8v230.4q0 12.8-12.8 12.8H140.8q-12.8 0-12.8-12.8V588.8q0-12.8 12.8-12.8Z"></path></svg>
                          </i>
                        </div>
                      </div>
                    </span>
                  </div>
                  
                  <div class="ix-popover-content">
                    <div class="ix-pro-table-layout-tool-content">
                      
                      <!-- 搜索关键字 -->
                      <div class="ix-pro-table-layout-tool-search-wrapper">
                        <span class="ix-input ix-input-sm ix-input-with-suffix">
                          <input type="text" class="ix-input-inner" x-model="columnSearch" placeholder="搜索关键字">
                          <span class="ix-input-suffix">
                            <i class="ix-icon ix-icon-search">
                              <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="search"><path fill-rule="evenodd" d="M448 96c212.077 0 384 171.923 384 384 0 86.337-28.493 166.019-76.588 230.155l154.027 154.163c4.991 5.003 4.99 13.104-.004 18.106l-27.011 27.011c-5.002 4.993-13.103 4.995-18.106.004L712.82 758.076C643.925 823.709 550.668 864 448 864 235.923 864 64 692.077 64 480S235.923 96 448 96Zm0 64c-176.731 0-320 143.269-320 320s143.269 320 320 320 320-143.269 320-320-143.269-320-320-320Z"></path></svg>
                            </i>
                          </span>
                        </span>
                      </div>
                      
                      <!-- 全部列选择与重置区 -->
                      <div class="ix-pro-table-layout-tool-select-wrapper">
                        <label class="ix-checkbox" :class="allVisible ? 'ix-checkbox-checked' : (someVisible ? 'ix-checkbox-indeterminate' : '')" @click.prevent="toggleAll()">
                          <span class="ix-checkbox-input" role="checkbox">
                            <input type="checkbox" class="ix-checkbox-input-inner" :checked="allVisible">
                            <span class="ix-checkbox-input-box"></span>
                          </span>
                          <span class="ix-checkbox-label">全部</span>
                        </label>
                        <button class="ix-button ix-button-link ix-button-sm" type="button" @click="resetColumns()">
                          <span>重置</span>
                        </button>
                      </div>
                      
                      <!-- 字段树状/拖拽列表区 -->
                      <div class="ix-pro-table-layout-tool-tree-wrapper">
                        <div class="ix-pro-table-layout-tool-tree">
                          <div class="ix-tree ix-tree-blocked" role="tree">
                            <div class="ix-tree-content">
                              <div class="ix-tree-content-inner">
                                
                                <!-- 循环字段渲染 -->
                                <template x-for="(col, idx) in filteredColumns" :key="col.key">
                                  <div class="ix-tree-node"
                                       :class="{ 
                                         'ix-tree-node-disabled': col.cannotDrag,
                                         'drag-hover-line': dragOverKey === col.key && draggedKey !== col.key
                                       }"
                                       :draggable="!col.cannotDrag"
                                       @dragstart="handleDragStart(col.key)"
                                       @dragover.prevent="handleDragOver(col.key)"
                                       @dragleave="if (dragOverKey === col.key) dragOverKey = null"
                                       @drop="handleDrop(col.key)">
                                       
                                    <span aria-hidden="true" class="ix-tree-node-indent"></span>
                                    
                                    <!-- 拖拽手柄 -->
                                    <span :class="col.cannotDrag ? 'ix-tree-node-draggable-icon-noop' : 'ix-tree-node-draggable-icon'" role="img">
                                      <template x-if="!col.cannotDrag">
                                        <i class="ix-icon ix-icon-holder">
                                          <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="holder"><path d="M320 256a64 64 0 1 0 128 0 64 64 0 1 0-128 0Zm256 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0ZM320 512a64 64 0 1 0 128 0 64 64 0 1 0-128 0Zm256 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0ZM320 768a64 64 0 1 0 128 0 64 64 0 1 0-128 0Zm256 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"></path></svg>
                                        </i>
                                      </template>
                                    </span>
                                    
                                    <!-- 复选框 -->
                                    <label class="ix-checkbox ix-tree-node-checkbox" 
                                           :class="{ 
                                             'ix-checkbox-checked': col.visible, 
                                             'ix-checkbox-disabled': col.cannotHide 
                                           }"
                                           @click.prevent="if (!col.cannotHide) col.visible = !col.visible">
                                      <span class="ix-checkbox-input" role="checkbox">
                                        <input type="checkbox" class="ix-checkbox-input-inner" :checked="col.visible" :disabled="col.cannotHide">
                                        <span class="ix-checkbox-input-box"></span>
                                      </span>
                                    </label>
                                    
                                    <!-- 字段信息及固定按钮 -->
                                    <div class="ix-tree-node-content">
                                      <span class="ix-tree-node-content-label" x-text="col.key === 'serial' ? '序号' : col.title"></span>
                                      
                                      <span class="ix-tree-node-content-suffix">
                                        <template x-if="!col.cannotDrag">
                                          <div class="flex items-center gap-1.5">
                                            <!-- 固定在列首 -->
                                            <i class="ix-icon ix-icon-vertical-align-top" 
                                               :class="col.fixed === 'left' && 'active'" 
                                               title="固定在列首" 
                                               @click="togglePin(col, 'left')">
                                              <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="vertical-align-top"><path d="m488.96 276.032 162.88 162.944a12.8 12.8 0 0 1 0 18.048l-27.136 27.2a12.8 12.8 0 0 1-18.112 0L512 389.568V883.2a12.8 12.8 0 0 1-12.8 12.8h-38.4a12.8 12.8 0 0 1-12.8-12.8V389.312l-94.784 94.912a12.8 12.8 0 0 1-18.112 0L307.84 456.96a12.8 12.8 0 0 1 0-18.048l162.944-162.944a12.8 12.8 0 0 1 18.112 0zM819.2 128c7.04 0 12.8 5.76 12.8 12.8v38.4a12.8 12.8 0 0 1-12.8 12.8H140.8a12.8 12.8 0 0 1-12.8-12.8v-38.4c0-7.04 5.76-12.8 12.8-12.8h678.4z"></path></svg>
                                            </i>
                                            <!-- 固定在列尾 -->
                                            <i class="ix-icon ix-icon-vertical-align-top" 
                                               :class="col.fixed === 'right' && 'active'" 
                                               title="固定在列尾" 
                                               style="transform: rotate(180deg);" 
                                               @click="togglePin(col, 'right')">
                                              <svg viewBox="0 0 1024 1024" focusable="false" aria-hidden="true" data-icon="vertical-align-top"><path d="m488.96 276.032 162.88 162.944a12.8 12.8 0 0 1 0 18.048l-27.136 27.2a12.8 12.8 0 0 1-18.112 0L512 389.568V883.2a12.8 12.8 0 0 1-12.8 12.8h-38.4a12.8 12.8 0 0 1-12.8-12.8V389.312l-94.784 94.912a12.8 12.8 0 0 1-18.112 0L307.84 456.96a12.8 12.8 0 0 1 0-18.048l162.944-162.944a12.8 12.8 0 0 1 18.112 0zM819.2 128c7.04 0 12.8 5.76 12.8 12.8v38.4a12.8 12.8 0 0 1-12.8 12.8H140.8a12.8 12.8 0 0 1-12.8-12.8v-38.4c0-7.04 5.76-12.8 12.8-12.8h678.4z"></path></svg>
                                            </i>
                                          </div>
                                        </template>
                                      </span>
                                    </div>
                                  </div>
                                </template>
                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
              </template>
            </th>
          </tr>
        </thead>
        
        <tbody class="ix-table-tbody">
          <template x-for="(row, idx) in tableData" :key="row.id">
            <tr class="ix-table-row">
              <template x-for="col in columns.filter(c => c.visible)" :key="col.key">
                <td :class="{ 
                      'ix-table-cell-align-center': col.key === 'selection' || col.key === 'serial',
                      'ix-table-fix-start': col.fixed === 'left',
                      'ix-table-fix-end': col.fixed === 'right'
                    }"
                    :style="col.fixed === 'left' ? { left: getLeftOffset(col) } : (col.fixed === 'right' ? { right: getRightOffset(col) } : {})">
                  
                  <!-- 多选框单元格 -->
                  <template x-if="col.key === 'selection'">
                    <label class="ix-checkbox">
                      <span class="ix-checkbox-input" role="checkbox">
                        <input type="checkbox" class="ix-checkbox-input-inner">
                        <span class="ix-checkbox-input-box"></span>
                      </span>
                    </label>
                  </template>
                  
                  <!-- 序号单元格 -->
                  <template x-if="col.key === 'serial'">
                    <span x-text="idx + 1"></span>
                  </template>
                  
                  <!-- 数据展示单元格 -->
                  <template x-if="col.key !== 'selection' && col.key !== 'serial' && col.key !== 'op'">
                    <span x-text="row[col.key]"></span>
                  </template>
                  
                  <!-- 操作链接单元格 -->
                  <template x-if="col.key === 'op'">
                    <div class="flex items-center gap-4">
                      <a class="action-link text-[#1c6eff] hover:text-[#458fff] cursor-pointer font-medium">编辑</a>
                      <a class="action-link text-[#f52727] hover:text-[#ff837a] cursor-pointer font-medium">删除</a>
                    </div>
                  </template>
                </td>
              </template>
              
              <!-- 最后一列配置占位单元格 (保持与表头宽度 40px 对齐) -->
              <td class="ix-table-fix-end" style="position: sticky; right: 0; width: 40px; z-index: 10;"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
```
