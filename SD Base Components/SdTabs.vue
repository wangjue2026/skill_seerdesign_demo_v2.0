<template>
  <a-tabs
    v-bind="$attrs"
    :type="antType"
    :class="[
      'sd-tabs',
      `sd-tabs--${type}`
    ]"
  >
    <!-- Forward all slots to standard tabs component -->
    <template #[slotName]="slotProps" v-for="(_, slotName) in $slots" :key="slotName">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </a-tabs>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';

defineOptions({
  name: 'SdTabs'
});

const props = defineProps({
  type: {
    type: String as PropType<'underline' | 'segment-heavy' | 'segment-light'>,
    default: 'underline'
  }
});

const antType = computed(() => {
  if (props.type === 'underline') return 'line';
  return 'card';
});
</script>

<style lang="less">
/* --- 1. Underline Style --- */
.sd-tabs--underline.ant-tabs {
  .ant-tabs-nav {
    margin: 0 !important;
    
    &::before {
      border-bottom: 1px solid var(--color-graphite-l30, #E1E5EB) !important;
    }
  }

  .ant-tabs-tab {
    padding: 12px 16px !important;
    margin: 0 !important;
    background: transparent !important;
    border: none !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    transition: color 0.2s ease !important;

    &:hover {
      color: var(--color-blue, #1C6EFF) !important;
    }
    
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: var(--color-blue, #1C6EFF) !important;
        font-weight: 500 !important;
      }
    }

    &.ant-tabs-tab-disabled {
      color: var(--color-graphite, #A1A7B3) !important;
      cursor: not-allowed !important;
      .ant-tabs-tab-btn {
        color: var(--color-graphite, #A1A7B3) !important;
      }
    }
  }

  /* Ink bar (active underline indicator) */
  .ant-tabs-ink-bar {
    background: var(--color-blue, #1C6EFF) !important;
    height: 2px !important;
    border-radius: 2px 2px 0 0 !important;
    bottom: 0px !important;
  }
}

/* --- 2. Segment Styles (Heavy & Light) --- */
.sd-tabs--segment-heavy.ant-tabs,
.sd-tabs--segment-light.ant-tabs {
  .ant-tabs-nav {
    margin: 0 0 16px 0 !important;
    &::before {
      display: none !important; /* hide default bottom border */
    }
  }

  .ant-tabs-nav-wrap {
    overflow: visible !important;
  }

  .ant-tabs-nav-list {
    gap: 8px !important; /* 8px spacing between segment tab items */
  }

  .ant-tabs-tab {
    height: 32px !important;
    line-height: 30px !important; /* height - 2px border */
    padding: 0 16px !important;
    margin: 0 !important;
    border-radius: 2px !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease !important;
    
    .ant-tabs-tab-btn {
      transition: all 0.2s ease !important;
    }
  }
}

/* --- Segment Heavy --- */
.sd-tabs--segment-heavy.ant-tabs {
  .ant-tabs-tab {
    background: var(--color-white, #FFFFFF) !important;
    border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
    color: var(--color-graphite-d40, #2F3540) !important;

    .ant-tabs-tab-btn {
      color: var(--color-graphite-d40, #2F3540) !important;
    }

    &:hover:not(.ant-tabs-tab-disabled) {
      background: var(--color-blue-l50, #E8F4FF) !important;
      border-color: #B3CCFF !important; /* var(--seer-blue-l20) */
      color: var(--color-blue, #1C6EFF) !important;
      
      .ant-tabs-tab-btn {
        color: var(--color-blue, #1C6EFF) !important;
      }
    }

    &.ant-tabs-tab-active {
      background: var(--color-blue, #1C6EFF) !important;
      border-color: var(--color-blue, #1C6EFF) !important;
      
      .ant-tabs-tab-btn {
        color: var(--color-white, #FFFFFF) !important;
        font-weight: 500 !important;
      }
    }

    &.ant-tabs-tab-disabled {
      background: var(--color-graphite-l50, #F7F9FC) !important;
      border-color: var(--color-graphite-l30, #E1E5EB) !important;
      color: var(--color-graphite-l10, #BEC3CC) !important;
      cursor: not-allowed !important;
      .ant-tabs-tab-btn {
        color: var(--color-graphite-l10, #BEC3CC) !important;
      }
    }
  }
}

/* --- Segment Light --- */
.sd-tabs--segment-light.ant-tabs {
  .ant-tabs-tab {
    background: var(--color-white, #FFFFFF) !important;
    border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
    color: var(--color-graphite-d40, #2F3540) !important;

    .ant-tabs-tab-btn {
      color: var(--color-graphite-d40, #2F3540) !important;
    }

    &:hover:not(.ant-tabs-tab-disabled) {
      border-color: var(--color-blue-l10, #458FFF) !important;
      color: var(--color-blue-l10, #458FFF) !important;
      
      .ant-tabs-tab-btn {
        color: var(--color-blue-l10, #458FFF) !important;
      }
    }

    &.ant-tabs-tab-active {
      border-color: var(--color-blue, #1C6EFF) !important;
      background: var(--color-white, #FFFFFF) !important;
      
      .ant-tabs-tab-btn {
        color: var(--color-blue, #1C6EFF) !important;
        font-weight: 500 !important;
      }
    }

    &.ant-tabs-tab-disabled {
      background: var(--color-graphite-l50, #F7F9FC) !important;
      border-color: var(--color-graphite-l30, #E1E5EB) !important;
      color: var(--color-graphite-l10, #BEC3CC) !important;
      cursor: not-allowed !important;
      .ant-tabs-tab-btn {
        color: var(--color-graphite-l10, #BEC3CC) !important;
      }
    }
  }
}
</style>
