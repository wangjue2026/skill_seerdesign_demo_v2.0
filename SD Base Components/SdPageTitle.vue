<template>
  <div 
    class="sd-page-title" 
    :class="{ 
      'sd-page-title--divider': showDivider,
      'sd-page-title--has-tabs': type === 'tabs'
    }"
  >
    <div class="sd-page-title__left">
      <!-- Back Arrow for Drilldown type -->
      <div 
        v-if="type === 'drilldown'" 
        class="sd-page-title__back"
        @click="handleBack"
      >
        <ArrowLeftOutlined />
      </div>

      <!-- Main Title -->
      <div class="sd-page-title__text">
        <slot name="title">{{ title }}</slot>
      </div>

      <!-- Divider & Tabs for Tabs type -->
      <template v-if="type === 'tabs'">
        <div class="sd-page-title__vertical-divider"></div>
        <div class="sd-page-title__tabs">
          <div 
            v-for="tab in tabs" 
            :key="tab.key" 
            class="sd-page-title__tab-item"
            :class="{ 'sd-page-title__tab-item--active': activeKey === tab.key }"
            @click="handleTabChange(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>
      </template>
    </div>

    <!-- Extra Right Actions -->
    <div v-if="$slots.extra" class="sd-page-title__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'SdPageTitle'
});

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'basic' | 'drilldown' | 'tabs'>,
    default: 'basic'
  },
  showDivider: {
    type: Boolean,
    default: false
  },
  tabs: {
    type: Array as PropType<Array<{ key: string; label: string }>>,
    default: () => []
  },
  activeKey: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['back', 'update:activeKey', 'tab-change']);

const handleBack = () => {
  emit('back');
};

const handleTabChange = (key: string) => {
  emit('update:activeKey', key);
  emit('tab-change', key);
};
</script>

<style lang="less">
.sd-page-title {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  height: 48px !important;
  padding: 0 16px !important; /* as per spec relative to content card */
  background-color: var(--color-white, #FFFFFF) !important;
  box-sizing: border-box !important;
  position: relative !important;
  width: 100% !important;

  &.sd-page-title--divider {
    border-bottom: 1px solid var(--color-graphite-l30, #E1E5EB) !important;
  }

  .sd-page-title__left {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
  }

  .sd-page-title__back {
    cursor: pointer !important;
    font-size: 16px !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    margin-right: 8px !important; /* standard 8px spacing */
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 24px !important;
    height: 24px !important;
    transition: color 0.2s ease !important;

    &:hover {
      color: var(--color-blue, #1C6EFF) !important;
    }
  }

  .sd-page-title__text {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    line-height: 48px !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  /* Vertical Divider for tabs view */
  .sd-page-title__vertical-divider {
    width: 1px !important;
    height: 16px !important;
    background-color: var(--color-graphite-l30, #E1E5EB) !important;
    margin: 0 12px !important;
    align-self: center !important;
  }

  /* Tabs sub-component */
  .sd-page-title__tabs {
    display: flex !important;
    height: 100% !important;
    align-items: center !important;
  }

  .sd-page-title__tab-item {
    font-size: 14px !important;
    font-weight: 400 !important;
    color: var(--color-graphite-d30, #454C59) !important;
    cursor: pointer !important;
    position: relative !important;
    height: 48px !important;
    line-height: 48px !important;
    padding: 0 12px !important;
    transition: color 0.2s ease !important;

    &:hover {
      color: var(--color-blue, #1C6EFF) !important;
    }

    &.sd-page-title__tab-item--active {
      color: var(--color-blue, #1C6EFF) !important;
      
      &::after {
        content: '' !important;
        position: absolute !important;
        bottom: 0 !important; /* aligns with parent border-bottom */
        left: 0 !important;
        right: 0 !important;
        height: 2px !important;
        background-color: var(--color-blue, #1C6EFF) !important;
        z-index: 1 !important;
      }
    }
  }

  .sd-page-title__extra {
    display: inline-flex !important;
    align-items: center !important;
    height: 100% !important;
  }
}

/* If parent has divider, pull the active underline down by 1px so it perfectly overlays the divider line */
.sd-page-title--divider.sd-page-title--has-tabs {
  .sd-page-title__tab-item--active::after {
    bottom: -1px !important;
  }
}
</style>
