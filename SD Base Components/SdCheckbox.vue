<template>
  <a-checkbox
    v-bind="checkboxProps"
    class="sd-checkbox"
    :class="[`sd-checkbox--${type}`]"
  >
    <slot></slot>
  </a-checkbox>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  name: 'SdCheckbox',
  inheritAttrs: false
});

const props = defineProps({
  type: {
    type: String,
    default: 'checkbox' // 'checkbox' or 'button'
  }
});

const attrs = useAttrs();

const checkboxProps = computed(() => {
  return {
    ...attrs
  };
});
</script>

<style lang="less">
/* Base Checkbox Styles */
.sd-checkbox.ant-checkbox-wrapper {
  font-size: 12px !important;
  color: var(--color-graphite-d40, #2F3540) !important;
  line-height: 20px !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important; /* spacing: 4px */
  cursor: pointer !important;

  .ant-checkbox {
    top: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
  }

  // Box size: 16px x 16px
  .ant-checkbox-inner {
    width: 16px !important;
    height: 16px !important;
    border-radius: 2px !important;
    border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
    background-color: var(--color-white, #FFFFFF) !important;
    transition: all 0.2s ease;
    box-shadow: none !important;

    // Checked mark icon centering
    &::after {
      width: 5px !important;
      height: 9px !important;
      left: 4px !important;
      top: 1px !important;
    }
  }

  // Checked and Indeterminate state (No outer border line)
  &.ant-checkbox-wrapper-checked,
  .ant-checkbox-indeterminate {
    .ant-checkbox-inner {
      border-color: var(--color-blue, #1C6EFF) !important;
      background-color: var(--color-blue, #1C6EFF) !important;
    }
  }

  // Hover & Focus (Clear default focus shadow)
  &:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-focused .ant-checkbox-inner {
    border-color: var(--color-blue, #1C6EFF) !important;
    box-shadow: none !important;
  }

  // Disabled states
  &.ant-checkbox-wrapper-disabled {
    color: var(--color-graphite, #A1A7B3) !important;
    cursor: not-allowed !important;

    .ant-checkbox-inner {
      background-color: var(--color-graphite-l30, #E1E5EB) !important;
      border-color: var(--color-graphite-l20, #D3D7DE) !important;
      cursor: not-allowed !important;
    }

    &.ant-checkbox-wrapper-checked {
      .ant-checkbox-inner::after {
        border-color: var(--color-graphite-d10, #6F7785) !important;
      }
    }

    .ant-checkbox-indeterminate {
      .ant-checkbox-inner::after {
        background-color: var(--color-graphite-d10, #6F7785) !important;
      }
    }
  }
}

/* Button Style Checkbox */
.sd-checkbox--button.ant-checkbox-wrapper {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 32px !important;
  border-radius: 2px !important;
  border: 1px solid var(--color-graphite-l20, #D3D7DE) !important;
  background-color: var(--color-white, #FFFFFF) !important;
  color: var(--color-graphite-d40, #2F3540) !important;
  padding: 0 16px !important;
  font-size: 12px !important;
  cursor: pointer !important;
  user-select: none !important;
  position: relative !important;
  transition: all 0.2s ease !important;
  box-shadow: none !important;

  // Hide original checkbox elements
  .ant-checkbox {
    display: none !important;
  }

  // Reset inner label text padding
  span:last-child {
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px; /* icon spacing: 8px */
  }

  // Checked button style
  &.ant-checkbox-wrapper-checked {
    border-color: var(--color-blue, #1C6EFF) !important;
    background-color: var(--color-blue, #1C6EFF) !important;
    color: var(--color-white, #FFFFFF) !important;

    // Triangle block on top right
    &::after {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
      width: 0 !important;
      height: 0 !important;
      border-style: solid !important;
      border-width: 0 8px 8px 0 !important;
      border-color: transparent var(--color-blue, #1C6EFF) transparent transparent !important;
      // In dark blue background, make triangle white/light so it is visible, or keep it blue as specified
      filter: brightness(1.5) !important; 
    }
  }

  // Hover states
  &:not(.ant-checkbox-wrapper-disabled):hover {
    border-color: var(--color-blue, #1C6EFF) !important;
    background-color: transparent !important;
    color: var(--color-blue, #1C6EFF) !important;
    
    &.ant-checkbox-wrapper-checked {
      border-color: var(--color-blue-d10, #1458CC) !important;
      background-color: var(--color-blue-d10, #1458CC) !important;
      color: var(--color-white, #FFFFFF) !important;
      
      &::after {
        border-color: transparent var(--color-blue-d10, #1458CC) transparent transparent !important;
      }
    }
  }

  // Active / Click states
  &:not(.ant-checkbox-wrapper-disabled):active {
    border-color: var(--color-blue-d10, #1458CC) !important;
    background-color: var(--color-blue-l50, #E8F4FF) !important;
    color: var(--color-blue, #1C6EFF) !important;
  }

  // Disabled states
  &.ant-checkbox-wrapper-disabled {
    background-color: var(--color-graphite-l40, #EDF1F7) !important;
    border-color: var(--color-graphite-l20, #D3D7DE) !important;
    color: var(--color-graphite-d10, #6F7785) !important;
    cursor: not-allowed !important;

    &.ant-checkbox-wrapper-checked {
      // In checked disabled state, do not hide triangle!
      &::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        width: 0 !important;
        height: 0 !important;
        border-style: solid !important;
        border-width: 0 8px 8px 0 !important;
        border-color: transparent var(--color-graphite-d10, #6F7785) transparent transparent !important;
      }
    }
  }
}
</style>
