<template>
  <div class="sd-detail-card">
    <!-- Left Object Icon -->
    <div v-if="$slots.icon || icon" class="sd-detail-card__icon">
      <slot name="icon">
        <component :is="icon" class="sd-detail-card__icon-svg" />
      </slot>
    </div>

    <!-- Middle Core Info -->
    <div class="sd-detail-card__content">
      <!-- Title & Status row -->
      <div class="sd-detail-card__header">
        <div class="sd-detail-card__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="$slots.status" class="sd-detail-card__status">
          <slot name="status" />
        </div>
      </div>

      <!-- Properties / Metadata area -->
      <div v-if="items && items.length" class="sd-detail-card__properties">
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          class="sd-detail-card__property"
        >
          <span class="sd-detail-card__label">{{ item.label }}</span>
          <span class="sd-detail-card__value" :title="item.value">{{ item.value }}</span>
        </div>
      </div>
      <div v-else class="sd-detail-card__body">
        <slot />
      </div>
    </div>

    <!-- Right Action buttons -->
    <div v-if="$slots.actions" class="sd-detail-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, type Component } from 'vue';

defineOptions({
  name: 'SdDetailCard'
});

defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, String] as PropType<Component | string>,
    default: null
  },
  items: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    default: () => []
  }
});
</script>

<style lang="less">
.sd-detail-card {
  display: flex !important;
  width: 100% !important;
  background-color: var(--color-blue-l50, #E8F4FF) !important;
  border-radius: 2px !important;
  padding: 16px !important;
  box-sizing: border-box !important;
  align-items: flex-start !important;

  .sd-detail-card__icon {
    width: 32px !important;
    height: 32px !important;
    flex-shrink: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-right: 24px !important;
    color: var(--color-blue, #1C6EFF) !important;

    .sd-detail-card__icon-svg {
      width: 32px !important;
      height: 32px !important;
      font-size: 32px !important;
    }
  }

  .sd-detail-card__content {
    flex-grow: 1 !important;
    min-width: 0 !important; /* prevent overflow */
  }

  .sd-detail-card__header {
    display: flex !important;
    align-items: center !important;
    margin-bottom: 8px !important;
    height: 22px !important;
  }

  .sd-detail-card__title {
    font-size: 14px !important;
    font-weight: 600 !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    line-height: 22px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .sd-detail-card__status {
    margin-left: 8px !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  .sd-detail-card__properties {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
    column-gap: 24px !important; /* min 16px, max 32px, 24px is optimal */
    row-gap: 8px !important;
  }

  .sd-detail-card__property {
    display: flex !important;
    align-items: baseline !important;
    font-size: 12px !important;
    line-height: 20px !important;
  }

  .sd-detail-card__label {
    color: var(--color-graphite, #A1A7B3) !important;
    margin-right: 16px !important; /* label to value spacing */
    flex-shrink: 0 !important;
  }

  .sd-detail-card__value {
    color: var(--color-graphite-d40, #2F3540) !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .sd-detail-card__actions {
    flex-shrink: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 12px !important;
    margin-left: 16px !important;
    height: 32px !important; /* aligns with top right but matches action height */
    
    .ant-btn {
      height: 32px !important;
      font-size: 12px !important;
    }
  }
}
</style>
