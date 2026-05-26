<template>
  <!-- 1. Dot Tag -->
  <span 
    v-if="type === 'dot'" 
    class="sd-tag-dot"
  >
    <span class="sd-tag-dot__circle" :style="{ backgroundColor: riskColor }" />
    <span class="sd-tag-dot__text"><slot /></span>
  </span>

  <!-- 2. Text-Number Compound Tag -->
  <span 
    v-else-if="type === 'text-number'" 
    class="sd-tag-compound"
  >
    <span class="sd-tag-compound__text" :style="{ backgroundColor: riskColor }">
      {{ text }}
    </span>
    <span 
      class="sd-tag-compound__number" 
      :style="{ 
        backgroundColor: hexToRgba(riskColor, 0.1), 
        color: riskColor 
      }"
    >
      {{ number }}
    </span>
  </span>

  <!-- 3. Add Tag Button / Input -->
  <span 
    v-else-if="type === 'add'" 
    class="sd-tag-add-container"
  >
    <span 
      v-if="!isEditing" 
      class="sd-tag-add-btn"
      @click="startEdit"
    >
      <PlusOutlined style="font-size: 10px; margin-right: 4px;" /> 新增
    </span>
    <input
      v-else
      ref="inputRef"
      type="text"
      class="sd-tag-add-input"
      v-model="inputValue"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
  </span>

  <!-- 4. Default wrapper around Ant a-tag -->
  <a-tag
    v-else
    v-bind="$attrs"
    :class="[
      'sd-tag-base',
      `sd-tag-base--${theme}`,
      `sd-tag-base--${color}`
    ]"
    :closable="closable"
    @close="$emit('close', $event)"
  >
    <slot />
  </a-tag>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, type PropType } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'SdTag',
  inheritAttrs: false
});

const props = defineProps({
  type: {
    type: String as PropType<'default' | 'dot' | 'text-number' | 'add'>,
    default: 'default'
  },
  color: {
    type: String as PropType<'blue' | 'green' | 'cyan' | 'gray' | 'yellow' | 'orange' | 'red' | 'darkred'>,
    default: 'gray'
  },
  theme: {
    type: String as PropType<'light' | 'dark'>,
    default: 'light'
  },
  risk: {
    type: String as PropType<'fail' | 'high' | 'mid' | 'midlow' | 'low' | 'info' | 'safe'>,
    default: 'low'
  },
  text: {
    type: String,
    default: ''
  },
  number: {
    type: [Number, String],
    default: 1
  },
  closable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'add']);

// Editing state for 'add' type
const isEditing = ref(false);
const inputValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const startEdit = () => {
  isEditing.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  const val = inputValue.value.trim();
  if (val) {
    emit('add', val);
  }
  inputValue.value = '';
  isEditing.value = false;
};

// Color mapping for Dot and Text-Number tags
const riskColorMap: Record<string, string> = {
  fail: '#82010E',
  high: '#CF171D',
  mid: '#FA721B',
  midlow: '#FDAA1D',
  low: '#6F7785',
  info: '#0BA7B5',
  safe: '#12A679'
};

const riskColor = computed(() => {
  return riskColorMap[props.risk] || riskColorMap.low;
});

// Utility to generate matching light backgrounds
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
</script>

<style lang="less">
/* --- 1. Base / Color Tags --- */
.sd-tag-base.ant-tag {
  font-family: inherit !important;
  font-size: 12px !important;
  line-height: 20px !important;
  padding: 2px 8px !important;
  border-radius: 2px !important;
  border: none !important;
  margin: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  box-sizing: border-box !important;

  .ant-tag-close-icon {
    font-size: 10px !important;
    margin-left: 4px !important;
    color: inherit !important;
    opacity: 0.8 !important;
    transition: opacity 0.2s ease !important;
    
    &:hover {
      opacity: 1 !important;
    }
  }
}

/* Light Theme overrides */
.sd-tag-base--light {
  &.sd-tag-base--blue    { color: #1C6EFF !important; background-color: rgba(28, 110, 255, 0.1) !important; }
  &.sd-tag-base--green   { color: #12A679 !important; background-color: rgba(18, 166, 121, 0.1) !important; }
  &.sd-tag-base--cyan    { color: #0BA7B5 !important; background-color: rgba(11, 167, 181, 0.1) !important; }
  &.sd-tag-base--gray    { color: #6F7785 !important; background-color: rgba(111, 119, 133, 0.1) !important; }
  &.sd-tag-base--yellow  { color: #D6860D !important; background-color: rgba(214, 134, 13, 0.1) !important; }
  &.sd-tag-base--orange  { color: #FA721B !important; background-color: rgba(250, 114, 27, 0.1) !important; }
  &.sd-tag-base--red     { color: #CF171D !important; background-color: rgba(207, 23, 29, 0.1) !important; }
  &.sd-tag-base--darkred { color: #82010E !important; background-color: rgba(130, 1, 14, 0.1) !important; }
}

/* Dark Theme overrides */
.sd-tag-base--dark {
  color: var(--color-white, #FFFFFF) !important;
  
  &.sd-tag-base--blue    { background-color: #1C6EFF !important; }
  &.sd-tag-base--green   { background-color: #12A679 !important; }
  &.sd-tag-base--cyan    { background-color: #0BA7B5 !important; }
  &.sd-tag-base--gray    { background-color: #6F7785 !important; }
  &.sd-tag-base--yellow  { background-color: #FDAA1D !important; }
  &.sd-tag-base--orange  { background-color: #FA721B !important; }
  &.sd-tag-base--red     { background-color: #CF171D !important; }
  &.sd-tag-base--darkred { background-color: #82010E !important; }
}

/* --- 2. Dot Tags (No background, transparent) --- */
.sd-tag-dot {
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  height: 20px !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;

  .sd-tag-dot__circle {
    width: 6px !important;
    height: 6px !important;
    border-radius: 50% !important;
    margin-right: 6px !important; /* as per spacing specs */
    flex-shrink: 0 !important;
  }

  .sd-tag-dot__text {
    font-size: 12px !important;
    font-weight: 400 !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    line-height: 20px !important;
  }
}

/* --- 3. Text-Number Compound Tags (Gapless connection) --- */
.sd-tag-compound {
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  height: 20px !important;
  border-radius: 2px !important;
  overflow: hidden !important;
  box-sizing: border-box !important;

  .sd-tag-compound__text {
    font-size: 12px !important;
    font-weight: 400 !important;
    color: var(--color-white, #FFFFFF) !important;
    padding: 0 6px !important;
    height: 100% !important;
    line-height: 20px !important;
    border-radius: 2px 0 0 2px !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  .sd-tag-compound__number {
    font-size: 12px !important;
    font-weight: 400 !important;
    padding: 0 6px !important;
    height: 100% !important;
    line-height: 20px !important;
    border-radius: 0 2px 2px 0 !important;
    display: inline-flex !important;
    align-items: center !important;
  }
}

/* --- 4. Editable Add Tags --- */
.sd-tag-add-container {
  display: inline-flex !important;
  vertical-align: middle !important;
}

.sd-tag-add-btn {
  font-size: 12px !important;
  color: var(--color-graphite-d10, #6F7785) !important;
  background: var(--color-white, #FFFFFF) !important;
  border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
  border-radius: 2px !important;
  padding: 0 8px !important;
  height: 24px !important;
  line-height: 22px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  transition: all 0.2s ease !important;

  &:hover {
    color: var(--color-blue, #1C6EFF) !important;
    border-color: var(--color-blue, #1C6EFF) !important;
  }
}

.sd-tag-add-input {
  width: 70px !important;
  height: 24px !important;
  padding: 0 8px !important;
  font-size: 12px !important;
  color: var(--color-graphite-d40, #2F3540) !important;
  border: 1px solid var(--color-blue, #1C6EFF) !important;
  border-radius: 2px !important;
  background: var(--color-white, #FFFFFF) !important;
  outline: none !important;
  box-sizing: border-box !important;
}
</style>
