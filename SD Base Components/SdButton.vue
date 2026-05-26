<template>
  <a-button v-bind="$attrs" class="sd-button">
    <slot></slot>
  </a-button>
</template>

<script setup lang="ts">
defineOptions({ name: 'SdButton' });
</script>

<style scoped lang="less">
.sd-button {
  height: 32px;
  padding: 4px 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 基础颜色覆盖，避免出现莫名的红色 */
  &:not(.ant-btn-dangerous):not(.ant-btn-primary) {
    color: var(--sd-text-title, rgba(0,0,0,0.85));
  }
}
</style>
