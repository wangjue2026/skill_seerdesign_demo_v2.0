<template>
  <div 
    class="sd-datepicker-group" 
    :class="{ 'sd-datepicker-group--focused': isFocused }"
  >
    <a-select
      v-model:value="shortcutValue"
      class="sd-datepicker-group__select"
      :dropdown-match-select-width="false"
      @change="handleShortcutChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <a-select-option value="today">今天</a-select-option>
      <a-select-option value="24h">近24小时</a-select-option>
      <a-select-option value="3d">近3天</a-select-option>
      <a-select-option value="7d">近7天</a-select-option>
      <a-select-option value="30d">近30天</a-select-option>
      <a-select-option value="3m">近3个月</a-select-option>
      <a-select-option value="6m">近6个月</a-select-option>
      <a-select-option value="custom">自定义</a-select-option>
    </a-select>
    
    <div class="sd-datepicker-group__divider"></div>
    
    <a-range-picker
      v-model:value="dateRange"
      class="sd-datepicker-group__picker"
      :show-time="{ format: 'HH:mm:ss' }"
      format="YYYY-MM-DD HH:mm:ss"
      :allow-clear="false"
      :open="isPickerOpen"
      @openChange="onPickerOpenChange"
      @change="handleDateRangeChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

defineOptions({
  name: 'SdDatePicker'
});

const props = defineProps({
  value: {
    type: Array as () => any[],
    default: () => []
  }
});

const emit = defineEmits(['update:value', 'change']);

const shortcutValue = ref('30d');
const isFocused = ref(false);
const isPickerOpen = ref(false);

const dateRange = computed({
  get() {
    return props.value as Dayjs[];
  },
  set(val) {
    emit('update:value', val);
    emit('change', val);
  }
});

const getShortcutRange = (key: string): [Dayjs, Dayjs] => {
  const now = dayjs();
  const todayStart = dayjs().startOf('day');
  const todayEnd = dayjs().endOf('day');
  
  switch (key) {
    case 'today':
      return [todayStart, todayEnd];
    case '24h':
      return [now.subtract(24, 'hour'), now];
    case '3d':
      return [dayjs().subtract(2, 'day').startOf('day'), todayEnd];
    case '7d':
      return [dayjs().subtract(6, 'day').startOf('day'), todayEnd];
    case '30d':
      return [dayjs().subtract(29, 'day').startOf('day'), todayEnd];
    case '3m':
      return [dayjs().subtract(3, 'month').startOf('day'), todayEnd];
    case '6m':
      return [dayjs().subtract(6, 'month').startOf('day'), todayEnd];
    default:
      return [dayjs().subtract(29, 'day').startOf('day'), todayEnd];
  }
};

const handleShortcutChange = (val: string) => {
  if (val === 'custom') {
    isPickerOpen.value = true;
  } else {
    isPickerOpen.value = false;
    dateRange.value = getShortcutRange(val);
  }
};

const handleDateRangeChange = (val: any) => {
  shortcutValue.value = 'custom';
};

const onPickerOpenChange = (open: boolean) => {
  isPickerOpen.value = open;
};

onMounted(() => {
  if (!props.value || props.value.length === 0) {
    dateRange.value = getShortcutRange('30d');
    shortcutValue.value = '30d';
  }
});
</script>

<style lang="less">
.sd-datepicker-group {
  display: inline-flex !important;
  align-items: center !important;
  height: 32px !important;
  border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
  border-radius: 2px !important;
  background-color: var(--color-white, #FFFFFF) !important;
  box-sizing: border-box !important;
  transition: border-color 0.2s ease !important;
  width: 100% !important;
  max-width: 428px !important;
  
  &.sd-datepicker-group--focused,
  &:hover {
    border-color: var(--color-blue, #1C6EFF) !important;
  }

  .sd-datepicker-group__select.ant-select {
    width: 88px !important;
    min-width: 88px !important;
    flex-shrink: 0 !important;
    height: 30px !important;
    
    .ant-select-selector {
      border: none !important;
      background-color: var(--color-graphite-l50, #F7F9FC) !important;
      box-shadow: none !important;
      height: 30px !important;
      border-radius: 2px 0 0 2px !important;
      padding: 0 8px !important;
      display: flex !important;
      align-items: center !important;
    }

    .ant-select-selection-item {
      line-height: 28px !important;
      font-size: 12px !important;
      color: var(--color-graphite-d40, #2F3540) !important;
    }
    
    .ant-select-arrow {
      right: 8px !important;
    }
  }

  .sd-datepicker-group__divider {
    width: 1px !important;
    height: 30px !important;
    background-color: var(--color-graphite-l30, #E1E5EB) !important;
    flex-shrink: 0 !important;
  }

  .sd-datepicker-group__picker.ant-picker {
    border: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    flex-grow: 1 !important;
    width: 0 !important;
    height: 30px !important;
    padding: 0 4px !important; /* as per spec */
    border-radius: 0 2px 2px 0 !important;
    display: inline-flex !important;
    align-items: center !important;

    .ant-picker-input {
      input {
        font-size: 12px !important;
        color: var(--color-graphite-d40, #2F3540) !important;
        text-align: center !important;
      }
    }
    
    .ant-picker-range-separator {
      padding: 0 4px !important;
    }
    
    .ant-picker-suffix {
      margin-left: 0 !important;
      margin-right: 4px !important;
      color: var(--color-graphite, #A1A7B3) !important;
    }
  }
}

</style>
