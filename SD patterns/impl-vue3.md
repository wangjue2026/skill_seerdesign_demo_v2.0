# Vue3 + ant-design-vue 4.x 实现规则

本文件为 SeerDesign 设计规范在 Vue3 技术栈下的具体实现适配规则，仅在生成 Vue3 + ant-design-vue 4.x 代码时参考。

---

## Vue3 + ant-design-vue 4.x 表格生成规则

当生成表格页面时，必须遵守以下规则。

### 1. 基础技术约束

必须使用：

- Vue 3
- JavaScript
- Composition API
- `<script setup>`
- Vite
- ant-design-vue 4.x
- `.vue` 单文件组件

严禁使用：

- React
- JSX / TSX
- TypeScript，除非用户明确要求
- Vue2 Options API 作为默认写法
- `new Vue`
- `Vue.use`
- `slot-scope`
- `scopedSlots`
- `a-icon type="xxx"`
- React 的 `<Table />`、`<Column />`
- React 的 `render: () => <span>...</span>`

---

### 2. 表格基础规则

生成表格时：

1. 使用 ant-design-vue 4.x 的 `<a-table>`。
2. 表格列定义使用 JavaScript 对象数组。
3. `rowKey` 必须明确指定。
4. 序号列 `width` 固定为 `40`，`align` 为 `center`。
5. 数字列 `align` 必须为 `right`。
6. 操作列 `width` 必须明确设置。
7. 如果列较多，必须设置 `scroll.x`。
8. `scroll.x` 优先使用明确数值，例如 `1200`、`1400`、`1600`，不要使用不确定的 `max-content`。
9. 如果需要冻结操作列，操作列设置 `fixed: 'right'`，并明确设置 `scroll.x`。
10. 表格样式覆盖必须加页面级或组件级作用域类名，例如 `.seer-table`，不允许全局覆盖所有 `.ant-table`。
11. 如果需要覆盖 ant-design-vue 内部样式，必须在 Vue scoped style 中使用 `:deep()`，并加当前页面作用域前缀。
12. 不要使用全局 `.ant-table`、`.ant-table-cell`、`.ant-table-tbody` 直接覆盖所有表格。
13. 表格即使暂无数据，也必须显示表头结构或空状态，避免页面白屏。

---

### 3. 推荐表格基础写法

```vue
<template>
  <div class="seer-table-page">
    <a-table
      class="seer-table"
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :row-key="record => record.id"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record, text, index }">
        <template v-if="column.key === 'index'">
          {{ index + 1 }}
        </template>

        <template v-else-if="column.key === 'name'">
          <span class="seer-table-link" @click="handleNameClick(record)">
            {{ text }}
          </span>
        </template>

        <template v-else-if="column.key === 'actions'">
          <span class="seer-table-actions">
            <span class="seer-table-action" @click="handleEdit(record)">编辑</span>
            <span class="seer-table-action-separator">|</span>
            <span class="seer-table-action" @click="handleDelete(record)">删除</span>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    id: '1',
    name: '示例数据',
    status: 'online',
    amount: 128
  }
])

const columns = [
  {
    title: '序号',
    key: 'index',
    width: 40,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 160
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    align: 'right'
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right'
  }
]

const handleNameClick = record => {
  console.log('click name', record)
}

const handleEdit = record => {
  console.log('edit', record)
}

const handleDelete = record => {
  console.log('delete', record)
}
</script>

<style scoped>
.seer-table-page {
  width: 100%;
}

.seer-table-link {
  color: var(--color-blue);
  cursor: pointer;
}

.seer-table-link:hover {
  color: var(--color-blue-l10);
}

.seer-table-actions {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.seer-table-action {
  color: var(--color-blue);
  cursor: pointer;
}

.seer-table-action:hover {
  color: var(--color-blue-l10);
}

.seer-table-action-separator {
  margin: 0 8px;
  color: var(--color-graphite-l20);
}
</style>
```

### 4. 表格样式覆盖规则

如果需要实现 SeerDesign 表格视觉规范，可以使用作用域样式。

推荐写法：

```css
.seer-table-page :deep(.seer-table .ant-table-thead > tr > th) {
  height: 32px;
  background: var(--color-graphite-l40);
  color: var(--color-graphite-d30);
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
}

.seer-table-page :deep(.seer-table .ant-table-tbody > tr > td) {
  height: 40px;
  padding: 0 12px;
  color: var(--color-graphite-d40);
  font-size: 12px;
  font-weight: 400;
  border-bottom: 1px solid var(--color-graphite-l30);
}

.seer-table-page :deep(.seer-table .ant-table-tbody > tr:hover > td) {
  background: var(--color-graphite-l50);
}

.seer-table-page :deep(.seer-table .ant-table) {
  border-radius: 0;
}
```

注意：
- 必须有 `.seer-table-page` 或类似页面级作用域前缀。
- 不允许直接写全局 `.ant-table {}`。
- 不允许使用 `rgba(...)`。
- 所有颜色必须使用 SeerDesign token。
- 如果 token 缺失，必须提醒补充 token，不能自行改用临时颜色。

### 5. 表格输出前自检

生成表格代码前，必须检查：

- 是否误用了 React / JSX / TSX。
- 是否误用了 Vue2 slot-scope 或 scopedSlots。
- 是否误用了 `render: () => <span>`。
- 是否明确设置了 rowKey。
- 是否为序号列设置了 `width: 40` 和 `align: 'center'`。
- 是否为数字列设置了 `align: 'right'`。
- 是否为操作列设置了明确宽度。
- 如果操作列冻结，是否设置了 `fixed: 'right'` 和 `scroll.x`。
- 是否使用 token 颜色。
- 是否避免了全局 `.ant-*` 样式污染。

---

## Vue3 + ant-design-vue 4.x 标签组件生成规则

当用户要求开发标签、状态标签、风险等级标签、可编辑标签、可切换状态标签时，必须遵守本规则。

### 1. 基础技术约束

必须使用：

- Vue 3
- JavaScript
- Composition API
- `<script setup>`
- ant-design-vue 4.x
- `.vue` 单文件组件
- `ref / computed / defineProps / defineEmits`

严禁使用：

- React
- JSX / TSX
- TypeScript，除非用户明确要求
- `useState`
- `React.cloneElement`
- Vue2 Options API 作为默认写法
- `data / methods / computed` Options API 写法
- `a-icon type="xxx"`
- `slot-scope`
- `scopedSlots`
- `@ant-design/icons`
- 不存在或不确定的图标名

Vue3 + ant-design-vue 4.x 中如果需要图标，必须使用：

```js
import { PlusOutlined } from '@ant-design/icons-vue'
```

然后在模板中使用：

```vue
<PlusOutlined />
```

不要使用：

```vue
<a-icon type="plus" />
```

### 2. 图标语义映射规则

设计规范中只描述"图标语义"，实现时映射为 `@ant-design/icons-vue` 中的稳定图标。

优先使用以下图标：

| 设计语义 | Vue3 推荐图标 |
|---------|-------------|
| 新增 | PlusOutlined |
| 关闭 | CloseOutlined |
| 删除 | DeleteOutlined |
| 加载 / 进行中 | LoadingOutlined |
| 成功 / 勾选 | CheckOutlined 或 CheckCircleOutlined |
| 失败 / 故障 | CloseCircleOutlined |
| 下拉 | DownOutlined |
| 返回 | LeftOutlined |
| 前进 / 展开 | RightOutlined |
| 等待 / 时间 | ClockCircleOutlined |
| 运行中 | PlayCircleOutlined |
| 暂停 | PauseCircleOutlined |
| 停止 / 禁用 | StopOutlined |
| 异常 / 告警 | ExclamationCircleOutlined |
| 搜索 | SearchOutlined |
| 刷新 | ReloadOutlined |
| 编辑 | EditOutlined |

禁止使用以下不稳定或容易不存在的图标名：
- ProhibitedOutlined
- AlertOutlined
- Thunderbolt
- Shield
- SafetyCertificate
- NetworkOutlined
- ArrowLeft
- ChevronLeft
- ChevronRight

如果设计规范中出现这些图标名，必须把它们理解为"语义描述"，不要直接复制为代码。

如果不确定图标是否存在，优先省略图标，不能为了图标引入新依赖。

### 3. Tag 颜色 Token 使用规则

生成标签组件时，严禁使用 rgba、hex 透明度拼接、颜色计算函数或临时透明色。

禁止：
- `rgba(...)`
- `${color}1A`
- opacity 方式模拟浅背景
- JS 中动态计算 10% 透明度背景
- 直接写非 token 的浅背景色

必须使用 SeerDesign 色彩 token。

浅色标签背景统一使用对应色系的 l50 token。
深色标签背景使用对应语义主 token 或 d10 / d30 token。
文字颜色、圆点颜色、图标颜色必须使用 token。

如果某个 token 未在当前项目中定义，必须优先提醒补充 token，而不是改用 rgba。

基础标签颜色映射：

```js
const tagColorTokenMap = {
  blue: {
    textToken: 'var(--color-blue)',
    backgroundToken: 'var(--color-blue-l50)'
  },
  green: {
    textToken: 'var(--color-turquoise-d10)',
    backgroundToken: 'var(--color-turquoise-l50)'
  },
  cyan: {
    textToken: 'var(--color-cyan-d10)',
    backgroundToken: 'var(--color-cyan-l50)'
  },
  gray: {
    textToken: 'var(--color-graphite-d10)',
    backgroundToken: 'var(--color-graphite-l50)'
  },
  brown: {
    textToken: 'var(--color-brown)',
    backgroundToken: 'var(--color-brown-l50)'
  },
  orange: {
    textToken: 'var(--color-orange)',
    backgroundToken: 'var(--color-orange-l50)'
  },
  red: {
    textToken: 'var(--color-red-d10)',
    backgroundToken: 'var(--color-red-l50)'
  },
  darkRed: {
    textToken: 'var(--color-red-d30)',
    backgroundToken: 'var(--color-red-l50)'
  }
}
```

### 4. 标签实现优先级

开发标签时，优先使用普通 HTML 结构加样式，保证稳定和可控。

推荐：

```html
<span class="seer-tag">标签文字</span>
```

复杂标签推荐：

```html
<span class="seer-tag seer-tag-with-icon">
  <CheckCircleOutlined class="seer-tag-icon" />
  <span>成功</span>
</span>
```

只有在需要 ant-design-vue 原生能力时，才使用：

```html
<a-tag>标签文字</a-tag>
```

例如需要 closable 的简单关闭标签时可以使用 a-tag。
如果视觉要求很精细，优先使用自定义 span / div 实现。

### 5. 浅色标签实现规则

浅色标签用于次要状态、弱提示、分组标识。

视觉要求：
- 圆角：2px
- 内边距：4px 8px
- 字号：12px
- 字重：400
- 边框：无
- 背景：对应色系 l50 token
- 文字颜色：对应色系 text token

推荐 Vue3 写法：

```vue
<template>
  <span
    class="seer-tag seer-tag-light"
    :style="{
      color: colorToken,
      backgroundColor: backgroundToken
    }"
  >
    <slot />
  </span>
</template>

<script setup>
defineProps({
  colorToken: {
    type: String,
    default: 'var(--color-blue)'
  },
  backgroundToken: {
    type: String,
    default: 'var(--color-blue-l50)'
  }
})
</script>

<style scoped>
.seer-tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  border: none;
}
</style>
```

如果不是封装组件，而是在页面内直接写，推荐写成：

```html
<span class="seer-tag" style="color: var(--color-blue); background: var(--color-blue-l50);">
  在线
</span>
```

### 6. 深色标签实现规则

深色标签用于强调状态、重要标识、品牌标签。

视觉要求：
- 圆角：2px
- 内边距：4px 8px
- 字号：12px
- 字重：400
- 文字颜色：var(--color-white)
- 背景色：对应语义色 token

示例：

```html
<span class="seer-tag seer-tag-dark" style="background: var(--color-red-d10);">
  高危
</span>
```

样式：

```css
.seer-tag-dark {
  color: var(--color-white);
}
```

### 7. 点状标签实现规则

点状标签用于风险等级、状态指示、安全等级。

视觉要求：
- 左侧圆点 + 右侧文字
- 圆点尺寸：6px x 6px
- 圆点与文字间距：4px
- 文字颜色：var(--color-graphite-d40)
- 背景透明
- 不使用色块背景

推荐写法：

```vue
<template>
  <span class="seer-dot-tag">
    <span
      class="seer-dot"
      :style="{ backgroundColor: currentRisk.dotToken }"
    ></span>
    <span>{{ currentRisk.label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  risk: {
    type: String,
    default: 'safe'
  }
})

const riskDotTokenMap = {
  compromised: {
    label: '失陷',
    dotToken: 'var(--color-red-d30)'
  },
  high: {
    label: '高危',
    dotToken: 'var(--color-red-d10)'
  },
  medium: {
    label: '中危',
    dotToken: 'var(--color-orange)'
  },
  mediumLow: {
    label: '中低危',
    dotToken: 'var(--color-brown)'
  },
  low: {
    label: '低危',
    dotToken: 'var(--color-graphite-d10)'
  },
  info: {
    label: '信息',
    dotToken: 'var(--color-cyan-d10)'
  },
  safe: {
    label: '安全',
    dotToken: 'var(--color-turquoise-d10)'
  }
}

const currentRisk = computed(() => {
  return riskDotTokenMap[props.risk] || riskDotTokenMap.safe
})
</script>

<style scoped>
.seer-dot-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-graphite-d40);
  line-height: 16px;
  white-space: nowrap;
}

.seer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  flex: 0 0 auto;
}
</style>
```

### 8. Icon + 色块标签实现规则

Icon + 色块标签用于任务状态、流程状态、执行状态。

要求：
- 使用浅色标签样式
- 左侧为语义图标
- 右侧为状态文字
- 图标尺寸：12px
- 图标与文字间距：4px
- 图标颜色与文字颜色一致

推荐状态映射：

```vue
<template>
  <span
    class="seer-tag seer-tag-with-icon"
    :style="{
      color: currentStatus.colorToken,
      backgroundColor: currentStatus.backgroundToken
    }"
  >
    <component
      :is="currentStatusIcon"
      v-if="currentStatusIcon"
      class="seer-tag-icon"
    />
    <span>{{ currentStatus.label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import {
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  status: {
    type: String,
    default: 'pending'
  }
})

const iconMap = {
  clock: ClockCircleOutlined,
  loading: LoadingOutlined,
  success: CheckCircleOutlined,
  failed: CloseCircleOutlined
}

const taskStatusMap = {
  pending: {
    label: '等待中',
    iconKey: 'clock',
    colorToken: 'var(--color-blue)',
    backgroundToken: 'var(--color-blue-l50)'
  },
  processing: {
    label: '进行中',
    iconKey: 'loading',
    colorToken: 'var(--color-blue)',
    backgroundToken: 'var(--color-blue-l50)'
  },
  success: {
    label: '成功',
    iconKey: 'success',
    colorToken: 'var(--color-turquoise-d10)',
    backgroundToken: 'var(--color-turquoise-l50)'
  },
  failed: {
    label: '失败',
    iconKey: 'failed',
    colorToken: 'var(--color-red-d10)',
    backgroundToken: 'var(--color-red-l50)'
  },
  incomplete: {
    label: '未完成',
    iconKey: 'clock',
    colorToken: 'var(--color-graphite-d10)',
    backgroundToken: 'var(--color-graphite-l50)'
  }
}

const currentStatus = computed(() => {
  return taskStatusMap[props.status] || taskStatusMap.pending
})

const currentStatusIcon = computed(() => {
  return iconMap[currentStatus.value.iconKey]
})
</script>

<style scoped>
.seer-tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  border: none;
}

.seer-tag-with-icon {
  display: inline-flex;
  align-items: center;
}

.seer-tag-icon {
  margin-right: 4px;
  font-size: 12px;
}
</style>
```

### 9. Icon 标签实现规则

Icon 标签用于设备状态、运行状态、告警状态。

要求：
- 背景透明
- 左侧语义图标
- 右侧文字
- 图标尺寸：12px
- 图标与文字间距：4px
- 文字颜色：var(--color-graphite-d40)
- 图标颜色根据状态选择

推荐状态映射：

```js
const iconStatusMap = {
  disabled: { label: '禁用', iconKey: 'stop', colorToken: 'var(--color-red-d10)' },
  abnormal: { label: '异常', iconKey: 'warning', colorToken: 'var(--color-orange)' },
  running: { label: '运行中', iconKey: 'play', colorToken: 'var(--color-turquoise-d10)' },
  fault: { label: '故障', iconKey: 'failed', colorToken: 'var(--color-red-d10)' },
  paused: { label: '暂停', iconKey: 'pause', colorToken: 'var(--color-orange)' },
  alarm: { label: '告警', iconKey: 'warning', colorToken: 'var(--color-orange)' },
  success: { label: '成功', iconKey: 'success', colorToken: 'var(--color-turquoise-d10)' },
  failed: { label: '失败', iconKey: 'failed', colorToken: 'var(--color-red-d10)' },
  stopped: { label: '停止', iconKey: 'stop', colorToken: 'var(--color-red-d10)' }
}
```

推荐图标映射：

```js
import {
  StopOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const iconMap = {
  stop: StopOutlined,
  warning: ExclamationCircleOutlined,
  play: PlayCircleOutlined,
  failed: CloseCircleOutlined,
  pause: PauseCircleOutlined,
  success: CheckCircleOutlined
}
```

推荐模板：

```html
<span class="seer-icon-tag">
  <component
    :is="currentStatusIcon"
    v-if="currentStatusIcon"
    class="seer-icon-tag-icon"
    :style="{ color: currentStatus.colorToken }"
  />
  <span>{{ currentStatus.label }}</span>
</span>
```

### 10. 可编辑标签实现规则

可编辑标签用于动态添加、删除标签。

必须使用 Vue3 状态写法，不得使用 useState。

状态使用 ref：

```js
const inputVisible = ref(false)
const inputValue = ref('')
const localTags = ref([])
```

交互规则：
- 点击新增入口，显示输入框。
- 输入框显示后自动聚焦。
- 按 Enter 提交新增标签。
- 输入框失焦时，如果有有效内容，也可以提交。
- 空内容不新增。
- 已存在标签不重复新增。
- 新增完成后清空输入框并隐藏输入框。
- 点击关闭入口删除对应标签。
- 标签变化后触发 change 事件。

推荐 Vue3 模板：

```vue
<template>
  <div class="seer-editable-tags">
    <span
      v-for="tag in localTags"
      :key="tag"
      class="seer-editable-tag"
    >
      <span>{{ tag }}</span>
      <CloseOutlined
        class="seer-editable-tag-close"
        @click="handleRemoveTag(tag)"
      />
    </span>

    <a-input
      v-if="inputVisible"
      ref="tagInputRef"
      v-model:value="inputValue"
      size="small"
      class="seer-editable-tag-input"
      @pressEnter="handleConfirmInput"
      @blur="handleConfirmInput"
    />

    <span
      v-else
      class="seer-editable-tag-add"
      @click="showInput"
    >
      <PlusOutlined />
    </span>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change'])

const inputVisible = ref(false)
const inputValue = ref('')
const localTags = ref([...props.tags])
const tagInputRef = ref(null)

watch(
  () => props.tags,
  value => {
    localTags.value = [...value]
  }
)

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    if (tagInputRef.value) {
      tagInputRef.value.focus()
    }
  })
}

const handleConfirmInput = () => {
  const value = inputValue.value.trim()

  if (value && !localTags.value.includes(value)) {
    localTags.value = localTags.value.concat(value)
    emit('change', localTags.value)
  }

  inputValue.value = ''
  inputVisible.value = false
}

const handleRemoveTag = tag => {
  localTags.value = localTags.value.filter(item => item !== tag)
  emit('change', localTags.value)
}
</script>

<style scoped>
.seer-editable-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.seer-editable-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  margin: 0 4px 4px 0;
  padding: 4px 4px 4px 8px;
  box-sizing: border-box;
  border-radius: 2px;
  color: var(--color-graphite-d10);
  background: var(--color-graphite-l50);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.seer-editable-tag-close {
  margin-left: 4px;
  font-size: 12px;
  cursor: pointer;
}

.seer-editable-tag-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 28px;
  margin: 0 0 4px 0;
  border: 1px solid var(--color-graphite-l20);
  border-radius: 2px;
  background: var(--color-white);
  color: var(--color-graphite-d10);
  cursor: pointer;
}

.seer-editable-tag-input {
  width: 78px;
  height: 28px;
  margin: 0 4px 4px 0;
  font-size: 12px;
}
</style>
```

### 11. 可变更标签实现规则

可变更标签用于状态切换、类型选择、动态配置。

必须使用 Vue3 状态写法。

推荐交互：
- 当前标签展示当前状态。
- 点击标签或下拉图标，展开下拉菜单。
- 下拉菜单中展示可切换状态。
- 点击选项后更新当前状态。
- 状态更新后同步更新文字、图标语义和颜色。
- 状态变化后触发 change 事件。

推荐使用 ant-design-vue 4.x 的：
- `<a-dropdown>`
- `<a-menu>`
- `<a-menu-item>`

推荐模板：

```vue
<template>
  <a-dropdown :trigger="['click']">
    <span class="seer-switchable-tag" @click.prevent>
      <component
        :is="currentOptionIcon"
        v-if="currentOptionIcon"
        class="seer-switchable-tag-icon"
        :style="{ color: currentOption.colorToken }"
      />
      <span>{{ currentOption.label }}</span>
      <DownOutlined class="seer-switchable-tag-down" />
    </span>

    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item
          v-for="option in options"
          :key="option.value"
        >
          <span class="seer-switchable-tag-option">
            <component
              :is="iconMap[option.iconKey]"
              v-if="iconMap[option.iconKey]"
              class="seer-switchable-tag-icon"
              :style="{ color: option.colorToken }"
            />
            <span>{{ option.label }}</span>
          </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import {
  DownOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change'])

const iconMap = {
  stop: StopOutlined,
  warning: ExclamationCircleOutlined,
  play: PlayCircleOutlined,
  failed: CloseCircleOutlined,
  pause: PauseCircleOutlined,
  success: CheckCircleOutlined
}

const currentOption = computed(() => {
  const matched = props.options.find(item => item.value === props.value)
  return matched || props.options[0] || {}
})

const currentOptionIcon = computed(() => {
  return iconMap[currentOption.value.iconKey]
})

const handleMenuClick = event => {
  emit('change', event.key)
}
</script>
```

注意：
- 不要使用 React.cloneElement。
- 不要使用 `Dropdown overlay={menu}` 这种 React 写法。
- 不要使用 `Menu.Item` JSX 写法。
- Vue3 中下拉内容使用 `#overlay` 插槽。
- 不要使用 Vue2 的 `slot="overlay"`。

### 12. 文字 + 数字标签实现规则

文字 + 数字标签用于风险等级、安全等级、威胁等级。

结构：
- 左侧为文字区
- 右侧为数字区
- 两段无间距拼接
- 中间拼接处无圆角
- 整体圆角 2px

推荐模板：

```html
<span class="seer-text-number-tag">
  <span
    class="seer-text-number-tag-label"
    :style="{ backgroundColor: currentLevel.colorToken }"
  >
    {{ currentLevel.label }}
  </span>
  <span
    class="seer-text-number-tag-number"
    :style="{
      color: currentLevel.colorToken,
      backgroundColor: currentLevel.backgroundToken
    }"
  >
    {{ displayNumber }}
  </span>
</span>
```

推荐配置：

```js
const levelConfig = {
  undefined: {
    label: '未定级',
    value: 1,
    colorToken: 'var(--color-graphite-d10)',
    backgroundToken: 'var(--color-graphite-l50)'
  },
  safe: {
    label: '安全',
    value: 2,
    colorToken: 'var(--color-turquoise-d10)',
    backgroundToken: 'var(--color-turquoise-l50)'
  },
  info: {
    label: '信息',
    value: 3,
    colorToken: 'var(--color-cyan-d10)',
    backgroundToken: 'var(--color-cyan-l50)'
  },
  low: {
    label: '低危',
    value: 4,
    colorToken: 'var(--color-graphite-d10)',
    backgroundToken: 'var(--color-graphite-l50)'
  },
  medium: {
    label: '中危',
    value: 5,
    colorToken: 'var(--color-orange)',
    backgroundToken: 'var(--color-orange-l50)'
  },
  mediumLow: {
    label: '中低危',
    value: 5,
    colorToken: 'var(--color-brown)',
    backgroundToken: 'var(--color-brown-l50)'
  },
  high: {
    label: '高危',
    value: 6,
    colorToken: 'var(--color-red-d10)',
    backgroundToken: 'var(--color-red-l50)'
  },
  severe: {
    label: '严重',
    value: 7,
    colorToken: 'var(--color-red-d30)',
    backgroundToken: 'var(--color-red-l50)'
  }
}
```

推荐样式：

```css
.seer-text-number-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 2px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
}

.seer-text-number-tag-label,
.seer-text-number-tag-number {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  box-sizing: border-box;
}

.seer-text-number-tag-label {
  color: var(--color-white);
}

.seer-text-number-tag-number {
  color: inherit;
}
```

### 13. 输出前自检

#### 技术栈自检

生成 Vue3 + ant-design-vue 4.x 代码前，必须检查：

- 是否误用了 React / JSX / TSX。
- 是否误用了 Vue2 Options API。
- 是否误用了 `data / methods` Options API 作为默认写法。
- 是否误用了 `<a-icon type="xxx" />`。
- 是否误用了 `slot="overlay"`。
- 是否误用了 `slot-scope`。
- 是否误用了 `scopedSlots`。
- 是否误用了 React.cloneElement。
- 是否生成了 .tsx 文件。
- 是否使用了 `<script setup>`。
- 是否使用了 `@ant-design/icons-vue` 中明确存在的图标。
- 如果不确定图标名，是否已经省略图标。
- 样式是否限制在当前组件或页面作用域内，避免污染全局。

#### Tag 颜色自检

1. 是否出现 rgba，如果出现必须改为 token。
2. 是否出现 `${color}1A`、透明度拼接或颜色计算，如果出现必须删除。
3. 是否出现非 token 的背景色，如果出现必须替换为 SeerDesign token。
4. 浅色标签背景是否使用对应色系的 l50 token。
5. 风险等级圆点颜色是否使用安全等级 token。
6. 深色标签背景是否使用语义色 token。
7. 可编辑标签背景是否使用 graphite-l50，而不是 rgba。
8. 如果 token 缺失，必须提醒补充 token，不能临时使用 rgba。
