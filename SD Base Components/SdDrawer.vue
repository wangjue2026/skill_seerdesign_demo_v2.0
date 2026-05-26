<template>
  <a-drawer
    v-bind="$attrs"
    :closable="true"
    class="sd-drawer"
  >
    <!-- 透传所有的插槽 -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
defineOptions({ name: 'SdDrawer' });
</script>

<style lang="less">
/* 全局覆盖当前抽屉的样式 */
.sd-drawer {
  .ant-drawer-header {
    height: 48px !important;
    min-height: 48px !important; /* 清除默认的 min-height 56px */
    padding: 0 16px !important;
    border-bottom: none !important;

    /* 专项适配指南：改变DOM顺序，让标题居左，关闭按钮居右 */
    .ant-drawer-header-title {
      flex-direction: row-reverse !important;
      width: 100%;
      height: 100%;
      align-items: center;
    }

    .ant-drawer-title {
      font-size: 16px !important;
      font-weight: 600 !important;
      color: var(--color-graphite-d40, #1F2329) !important;
      flex: 1;
      text-align: left;
    }

    .ant-drawer-close {
      margin-right: 0 !important;
      padding-right: 0 !important;
    }
  }

  .ant-drawer-body {
    padding: 0 32px !important; /* 内容左右边距32px */
    overflow-x: hidden !important; /* 强制二开抽屉绝不允许出现横向滚动条 */
  }

  .ant-drawer-footer {
    height: 56px !important;
    padding: 12px 32px !important;
    border-top: none !important;
    display: flex !important;
    align-items: center;
    justify-content: flex-start !important; /* 按钮区域：左对齐 */
    gap: 8px; /* 按钮间距 */
    
    .ant-btn {
      height: 32px !important;
      font-size: 14px !important;
    }
  }
}
</style>
