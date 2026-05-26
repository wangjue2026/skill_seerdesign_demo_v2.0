<template>
  <a-alert
    v-bind="alertProps"
    class="sd-alert"
    :class="[`sd-alert--${type}`, { 'sd-alert--banner': banner }]"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </a-alert>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  name: 'SdAlert',
  inheritAttrs: false
});

const props = defineProps({
  type: {
    type: String,
    default: 'info' // 'info', 'warning', 'success', 'error'
  },
  banner: {
    type: Boolean,
    default: false
  }
});

const attrs = useAttrs();

const alertProps = computed(() => {
  return {
    ...attrs,
    type: props.type
  };
});
</script>

<style lang="less">
.sd-alert {
  min-height: 32px !important;
  padding: 6px 8px !important; /* Left/right padding: 8px */
  border: none !important;
  border-radius: 2px !important;
  display: flex !important;
  align-items: center !important;
  font-size: 12px !important;
  line-height: 20px !important;

  &.sd-alert--banner {
    border-radius: 0 !important;
  }

  .ant-alert-icon {
    font-size: 16px !important;
    margin-right: 8px !important; /* Gap between icon and text: 8px */
    display: inline-flex !important;
    align-items: center !important;
  }

  .ant-alert-content {
    flex: 1 !important;
    min-width: 0 !important;
  }

  .ant-alert-message {
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 20px !important;
    display: flex !important;
    align-items: center !important;
    flex-wrap: wrap !important;
  }

  .ant-alert-close-icon {
    margin-left: auto !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  /* Info / Normal style */
  &.sd-alert--info {
    background-color: #F7F7F8 !important;
    color: var(--color-graphite-d10, #6F7785) !important;
    .ant-alert-icon {
      color: var(--color-graphite-d10, #6F7785) !important;
    }
    .ant-alert-message {
      color: var(--color-graphite-d10, #6F7785) !important;
    }
  }

  /* Warning / Alarm style */
  &.sd-alert--warning {
    background-color: #FFFAF2 !important;
    color: var(--color-bronze-d10, #A35F40) !important;
    .ant-alert-icon {
      color: var(--color-bronze-d10, #A35F40) !important;
    }
    .ant-alert-message {
      color: var(--color-bronze-d10, #A35F40) !important;
    }
  }

  /* Success style */
  &.sd-alert--success {
    background-color: #F2FAF6 !important;
    color: var(--color-turquoise-d10, #12A679) !important;
    .ant-alert-icon {
      color: var(--color-turquoise-d10, #12A679) !important;
    }
    .ant-alert-message {
      color: var(--color-turquoise-d10, #12A679) !important;
    }
  }

  /* Error style */
  &.sd-alert--error {
    background-color: #FFF2F0 !important;
    color: var(--color-red-d10, #CF171D) !important;
    .ant-alert-icon {
      color: var(--color-red-d10, #CF171D) !important;
    }
    .ant-alert-message {
      color: var(--color-red-d10, #CF171D) !important;
    }
  }

  /* Link rules conforming to comp-alert.md */
  .sd-alert-link {
    color: var(--color-blue, #1C6EFF) !important;
    margin-left: 16px !important;
    font-size: 12px !important;
    text-decoration: none !important;
    display: inline-flex !important;
    align-items: center !important;
    cursor: pointer;
    
    &:hover {
      color: var(--color-blue-l10, #4FA1FF) !important;
    }
  }

  .sd-alert-link-divider {
    display: inline-block !important;
    width: 1px !important;
    height: 10px !important;
    background-color: var(--color-graphite-l20, #D3D7DE) !important;
    margin: 0 8px !important;
  }
}
</style>
