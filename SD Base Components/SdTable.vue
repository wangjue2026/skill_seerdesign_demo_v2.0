<template>
  <a-table
    v-bind="$attrs"
    :columns="processedColumns"
    class="sd-table"
    size="middle"
  >
    <!-- 透传所有的插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ name: 'SdTable' });

const attrs = useAttrs();

const processedColumns = computed(() => {
  const cols = (attrs.columns as any[]) || [];
  if (cols.length > 5) {
    const newCols = [...cols];
    const lastCol = newCols[newCols.length - 1];
    // 自动冻结最后一列（操作列）
    if (lastCol && !lastCol.fixed) {
      lastCol.fixed = 'right';
    }
    return newCols;
  }
  return cols;
});
</script>

<style lang="less">
.sd-table {
  /* 强行清除第一行空白行（常见由于外边距或padding导致的） */
  .ant-table-tbody > tr:first-child > td {
    border-top: none;
  }
  .ant-table-title {
    padding: 0;
  }
  
  /* 表格内 Switch 开关样式异常修复 */
  .ant-switch {
    min-width: 28px !important;
    height: 16px !important;
    min-height: 16px !important;
    line-height: 16px !important;
    .ant-switch-handle {
      width: 12px !important;
      height: 12px !important;
      top: 2px !important;
    }
  }
}
</style>
