<template>
  <a-select v-bind="selectProps" class="sd-select">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </a-select>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  name: 'SdSelect',
  inheritAttrs: false
});

const attrs = useAttrs();

const selectProps = computed(() => {
  const isMultiple = attrs.mode === 'multiple' || attrs.mode === 'tags';
  const defaults: Record<string, any> = {};
  if (isMultiple) {
    defaults['maxTagCount'] = 'responsive';
    defaults['showArrow'] = true;
  }
  
  // Standardize the popupClassName to append 'sd-select-dropdown'
  const currentPopupClass = (
    attrs.popupClassName || 
    attrs['popup-class-name'] || 
    attrs.dropdownClassName || 
    attrs['dropdown-class-name'] || 
    ''
  ) as string;
  
  const newPopupClass = currentPopupClass 
    ? `${currentPopupClass} sd-select-dropdown` 
    : 'sd-select-dropdown';

  return {
    ...defaults,
    ...attrs,
    popupClassName: newPopupClass
  };
});
</script>

<style lang="less">
/* sd-select global styles */
.sd-select {
  height: 32px !important;

  // Unselected status & base visual rules
  .ant-select-selector {
    height: 32px !important;
    min-height: 32px !important;
    border-radius: 2px !important;
    border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
    background-color: var(--color-white, #FFFFFF) !important;
    padding: 0 12px !important;
    box-shadow: none !important;
    display: flex !important;
    align-items: center !important;
    transition: all 0.2s ease;
  }

  // Placeholder styling
  .ant-select-selection-placeholder {
    font-size: 12px !important;
    color: var(--color-graphite, #A1A7B3) !important;
    left: 12px !important;
    line-height: 30px !important;
  }

  // Dropdown arrow icon styling
  .ant-select-arrow {
    right: 12px !important;
    color: var(--color-graphite, #A1A7B3) !important;
    font-size: 12px !important;
  }

  // Single select - text color & center alignment
  &.ant-select-single {
    .ant-select-selection-item {
      line-height: 30px !important;
      font-size: 12px !important;
      color: var(--color-graphite-d40, #2F3540) !important;
      background: transparent !important;
      background-color: transparent !important;
    }
  }

  // Multiple select - tags styling
  &.ant-select-multiple {
    .ant-select-selection-overflow {
      display: flex !important;
      align-items: center !important;
      flex-wrap: nowrap !important;
      overflow: hidden !important;
      height: 30px !important;
    }

    .ant-select-selection-overflow-item {
      align-self: center !important;
    }

    .ant-select-selection-item {
      display: inline-flex !important;
      align-items: center !important;
      height: 20px !important;
      line-height: 18px !important;
      background-color: var(--color-graphite-l40, #EDF1F7) !important;
      border: none !important;
      border-radius: 2px !important;
      margin: 0 2px 0 0 !important; /* tag spacing: 2px */
      padding: 0 8px !important; /* tag left/right padding: 8px */
      font-size: 12px !important;
      color: var(--color-graphite-d40, #2F3540) !important;

      // Close icon styling
      .ant-select-selection-item-remove {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 12px !important;
        height: 12px !important;
        margin-left: 8px !important; /* close space to text: 8px */
        color: var(--color-graphite, #A1A7B3) !important;
        font-size: 10px !important;
        
        &:hover {
          color: var(--color-blue, #1C6EFF) !important;
        }
      }
    }
  }

  // Hover & Focus state styling (No blue glow shadow allowed)
  &:not(.ant-select-disabled):hover {
    .ant-select-selector {
      border-color: var(--color-blue, #1C6EFF) !important;
    }
  }

  &.ant-select-focused:not(.ant-select-disabled) {
    .ant-select-selector {
      border-color: var(--color-blue, #1C6EFF) !important;
      box-shadow: none !important;
    }
  }

  // Disabled state styling
  &.ant-select-disabled {
    .ant-select-selector {
      background-color: var(--color-graphite-l30, #E1E5EB) !important;
      border-color: var(--color-graphite-l20, #D3D7DE) !important;
      color: var(--color-graphite, #A1A7B3) !important;
      cursor: not-allowed !important;
    }
    .ant-select-selection-item {
      color: var(--color-graphite, #A1A7B3) !important;
    }
  }
}

// Dropdown Panel styling
.sd-select-dropdown {
  border-radius: 2px !important;
  padding: 4px 0 !important;
  box-shadow: var(--seer-dropshadow-s2, 0 4px 16px 0 rgba(30, 35, 43, 0.14)) !important;
  
  .ant-select-item {
    min-height: 32px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    font-size: 12px !important;
    transition: background 0.2s ease, color 0.2s ease;
  }

  // Hover state (active option)
  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: var(--color-graphite-l50, #F7F9FC) !important;
  }

  // Selected state (no checkmark icon displayed, text color and background)
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: var(--color-blue-l50, #E8F4FF) !important;
    color: var(--color-blue, #1C6EFF) !important;
    font-weight: normal !important;
  }

  // Hide the check icon
  .ant-select-item-option-state {
    display: none !important;
  }
}
</style>

