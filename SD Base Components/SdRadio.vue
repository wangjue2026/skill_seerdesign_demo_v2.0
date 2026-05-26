<template>
  <a-radio
    v-bind="radioProps"
    class="sd-radio"
  >
    <slot></slot>
  </a-radio>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  name: 'SdRadio',
  inheritAttrs: false
});

const attrs = useAttrs();

const radioProps = computed(() => {
  return {
    ...attrs
  };
});
</script>

<style lang="less">
.sd-radio.ant-radio-wrapper {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: var(--color-graphite-d40, #2F3540) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important; /* spacing: 4px */
  cursor: pointer !important;

  .ant-radio {
    top: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  // Radio circle: 16px x 16px
  .ant-radio-inner {
    width: 16px !important;
    height: 16px !important;
    border-width: 1px !important;
    border-color: var(--color-graphite-l20, #D3D7DE) !important;
    background-color: transparent !important;
    box-shadow: none !important;
    transition: all 0.2s ease;
    
    // Checked dot: 8px size
    &::after {
      width: 8px !important;
      height: 8px !important;
      margin-left: -4px !important;
      margin-top: -4px !important;
      background-color: var(--color-blue, #1C6EFF) !important;
      transform: scale(0);
      transition: all 0.2s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }
  }

  // Checked state
  &.ant-radio-wrapper-checked {
    .ant-radio-inner {
      border-color: var(--color-blue, #1C6EFF) !important;
      &::after {
        transform: scale(1) !important;
      }
    }
  }

  // Hover states
  &:hover .ant-radio-inner,
  .ant-radio:hover .ant-radio-inner {
    border-color: var(--color-blue, #1C6EFF) !important;
  }

  // Active state (click)
  &:active .ant-radio-inner,
  .ant-radio:active .ant-radio-inner {
    border-color: var(--color-blue-d10, #1458CC) !important;
  }

  // Disabled states
  &.ant-radio-wrapper-disabled {
    color: var(--color-graphite, #A1A7B3) !important;
    cursor: not-allowed !important;

    .ant-radio-inner {
      border-color: var(--color-graphite-l20, #D3D7DE) !important;
      background-color: var(--color-graphite-l30, #E1E5EB) !important;
      cursor: not-allowed !important;
      
      &::after {
        background-color: var(--color-graphite, #A1A7B3) !important;
      }
    }
  }
}
</style>
