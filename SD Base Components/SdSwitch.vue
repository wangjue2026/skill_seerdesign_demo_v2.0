<template>
  <a-switch v-bind="$attrs" class="sd-switch" />
</template>

<script setup lang="ts">
defineOptions({ name: 'SdSwitch' });
</script>

<style scoped lang="less">
.sd-switch {
  min-width: 28px !important;
  width: 28px !important;
  height: 16px !important;
  min-height: 16px !important;
  line-height: 16px !important;
  background-color: var(--color-graphite-l20, #e8eaed) !important;
  box-shadow: none !important;

  &:focus,
  &:active {
    box-shadow: none !important;
  }

  &.ant-switch-checked {
    background-color: var(--color-blue, #1c6eff) !important;
  }

  :deep(.ant-switch-handle) {
    width: 12px !important;
    height: 12px !important;
    top: 2px !important;
    inset-inline-start: 2px !important;
  }

  &.ant-switch-checked :deep(.ant-switch-handle) {
    inset-inline-start: calc(100% - 14px) !important;
  }

  :deep(.ant-switch-inner) {
    display: none;
  }
}
</style>
