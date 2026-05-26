<template>
  <a-modal
    v-bind="$attrs"
    :wrap-class-name="`sd-modal-wrapper ${$attrs['wrap-class-name'] || ''}`"
    class="sd-modal"
  >
    <!-- Forward all slots to standard modal -->
    <template #[slotName]="slotProps" v-for="(_, slotName) in $slots" :key="slotName">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </a-modal>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SdModal'
});
</script>

<style lang="less">
/* We override global modal classes using prefix selectors since Modal renders in body portal */
.sd-modal-wrapper {
  .ant-modal {
    padding: 0 !important;
    border-radius: 2px !important;
    overflow: hidden !important;
  }

  .ant-modal-content {
    border-radius: 2px !important;
    padding: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    max-height: calc(100vh - 100px) !important;
    box-shadow: var(--seer-dropshadow-s3, 0 8px 22px 0 rgba(30, 35, 43, 0.12)) !important;
  }

  /* Header style: 48px height, title left margin 16px, font 16px, semi-bold */
  .ant-modal-header {
    height: 48px !important;
    min-height: 48px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    border-bottom: none !important;
    background-color: var(--color-white, #FFFFFF) !important;

    .ant-modal-title {
      font-size: 16px !important;
      font-weight: 600 !important;
      color: var(--color-graphite-d40, #2F3540) !important;
      line-height: 48px !important;
    }
  }

  /* Close button customization */
  .ant-modal-close {
    top: 8px !important;
    height: 32px !important;
    width: 32px !important;
    
    .ant-modal-close-x {
      line-height: 32px !important;
      height: 32px !important;
      width: 32px !important;
      font-size: 14px !important;
      color: var(--color-graphite, #A1A7B3) !important;

      &:hover {
        color: var(--color-blue, #1C6EFF) !important;
      }
    }
  }

  /* Body style: 32px side margins, no top/bottom extra margins, scroll inside */
  .ant-modal-body {
    padding: 0 32px !important;
    margin: 0 !important;
    flex-grow: 1 !important;
    overflow-y: auto !important;
    font-size: 12px !important;
    color: var(--color-graphite-d40, #2F3540) !important;
  }

  /* Footer style: 56px height, no border, right-aligned, reverse order */
  .ant-modal-footer {
    height: 56px !important;
    min-height: 56px !important;
    padding: 0 16px !important;
    margin: 0 !important;
    border-top: none !important;
    display: flex !important;
    flex-direction: row-reverse !important;
    justify-content: flex-start !important;
    align-items: center !important;
    gap: 8px !important;
    background-color: var(--color-white, #FFFFFF) !important;

    /* In row-reverse, Cancel (typically first in HTML) is rendered on the right side,
       and OK (typically second in HTML) is rendered on the left side, satisfying the:
       "Primary button on the left, cancel button on the right, overall right-aligned" requirement. */
    .ant-btn {
      height: 32px !important;
      font-size: 12px !important;
      margin: 0 !important; /* clear default margin */
      padding: 4px 16px !important;
      border-radius: 2px !important;
    }
  }
}
</style>
