<template>
  <a-form v-bind="mergedAttrs" class="sd-form">
    <slot></slot>
  </a-form>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ name: 'SdForm' });

const attrs = useAttrs();

const mergedAttrs = computed(() => {
  return {
    labelAlign: 'left', // 强制左对齐
    labelCol: { flex: '100px' }, // 默认提供合理固定宽度
    wrapperCol: { flex: 'auto' },
    ...attrs,
  };
});
</script>

<style lang="less">
.sd-form {
  /* 全局强制字体大小为12px */
  font-size: 12px;

  /* Label 规范 */
  .ant-form-item-label {
    padding-right: 16px;
    height: 32px;
    display: flex;
    align-items: center;
    
    > label {
      font-size: 12px !important;
      font-weight: 400 !important;
      color: var(--color-graphite-d10, #6F7785) !important;
      height: 32px;
      align-items: center;
      
      /* 星号对齐问题：非必填也要占位 */
      &::before {
        content: '*';
        visibility: hidden; /* 默认隐藏星号占位 */
        display: inline-block;
        margin-inline-end: 4px !important;
        color: var(--color-red, #F52727) !important;
        font-family: SimSun, sans-serif;
      }
    }
    
    /* 必填项显示星号 */
    &.ant-form-item-required > label::before,
    > label.ant-form-item-required::before {
      visibility: visible !important;
    }
  }

  /* 行间距 */
  .ant-form-item {
    margin-bottom: 8px;
  }

  /* 控件尺寸规范 */
  .ant-form-item-control-input {
    min-height: 32px;
  }

  &.sd-form--drawer {
    /* 仅对普通输入框生效，排除滑块组内的输入框与日期选择器内部子项 */
    .ant-form-item-control-input-content > .ant-input,
    .ant-form-item-control-input-content > .ant-input-affix-wrapper,
    .ant-form-item-control-input-content > .ant-input-number,
    .ant-form-item-control-input-content > .sd-select,
    .ant-form-item-control-input-content > .ant-select:not(.sd-datepicker-group *),
    .ant-form-item-control-input-content > .ant-picker:not(.sd-datepicker-group *),
    .sd-datepicker-group,
    .ant-input:not(.slider-input-group *):not(.scope-condition-list *),
    .ant-input-affix-wrapper:not(.slider-input-group *):not(.scope-condition-list *),
    .ant-input-number:not(.slider-input-group *):not(.scope-condition-list *),
    .ant-select:not(.slider-input-group *):not(.scope-condition-list *):not(.sd-datepicker-group *),
    .ant-picker:not(.slider-input-group *):not(.scope-condition-list *):not(.sd-datepicker-group *) {
      width: 420px !important;
      min-width: 420px !important;
      max-width: 420px !important;
    }
    
    /* 避免把 radio/checkbox 组强行拉长导致变形 */
    .ant-radio-group,
    .ant-checkbox-group {
      width: auto !important;
      min-width: auto !important;
      max-width: none !important;
    }
  }

  .ant-input,
  .ant-select-selector,
  .ant-input-number {
    height: 32px !important;
    font-size: 12px !important;
    border-radius: 2px !important;
  }

  .ant-input-number-input {
    height: 30px !important;
  }

  /* Radio 和 Checkbox 的文字也强制12px */
  .ant-radio-wrapper,
  .ant-radio-button-wrapper,
  .ant-checkbox-wrapper {
    font-size: 12px !important;
    span {
      font-size: 12px !important;
    }
  }

  /* 修复 radio button 的高度和对齐 */
  .ant-radio-button-wrapper {
    height: 32px !important;
    line-height: 30px !important;
  }
}
</style>
