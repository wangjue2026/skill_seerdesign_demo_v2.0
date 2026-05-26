<template>
  <div class="sd-input-container" :class="{ 'sd-input-container--error': status === 'error' }">
    <component
      :is="inputComponent"
      v-bind="$attrs"
      :class="[
        'sd-input',
        {
          'sd-input--error': status === 'error',
          'sd-input--sm': size === 'small',
          'sd-input--lg': size === 'large'
        }
      ]"
      :size="inputSize"
      :disabled="disabled"
    >
      <!-- Forward all slots to underlying input component -->
      <template #[slotName]="slotProps" v-for="(_, slotName) in $slots" :key="slotName">
        <slot :name="slotName" v-bind="slotProps || {}" />
      </template>
    </component>
    <!-- Error message underneath the input -->
    <div v-if="status === 'error' && errorMessage" class="sd-input-error-tip">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Input as AInput, Textarea as ATextarea, InputPassword as AInputPassword } from 'ant-design-vue';

defineOptions({
  name: 'SdInput',
  inheritAttrs: false
});

const props = defineProps({
  type: {
    type: String,
    default: 'text' // 'text' | 'password' | 'textarea'
  },
  status: {
    type: String,
    default: '' // 'error' | ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'default' // 'small' | 'default' | 'large'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const inputComponent = computed(() => {
  if (props.type === 'textarea') return ATextarea;
  if (props.type === 'password') return AInputPassword;
  return AInput;
});

const inputSize = computed<'small' | 'middle' | 'large'>(() => {
  if (props.size === 'small') return 'small';
  if (props.size === 'large') return 'large';
  return 'middle';
});
</script>

<style lang="less">
.sd-input-container {
  display: inline-block;
  width: 100%;
  position: relative;
  vertical-align: top;
}

/* Base style overrides for Ant inputs */
.sd-input.ant-input,
.sd-input.ant-input-affix-wrapper,
.sd-input.ant-input-group-wrapper {
  font-family: inherit !important;
  font-size: 12px !important;
  border-radius: 2px !important;
  border-color: var(--color-graphite-l20, #D3D7DE) !important;
  box-shadow: none !important;
  transition: all 0.2s ease !important;

  &:hover {
    border-color: var(--color-blue, #1C6EFF) !important;
  }

  &:focus,
  &.ant-input-focused,
  &.ant-input-affix-wrapper-focused,
  &.ant-input-group-wrapper-focused {
    border-color: var(--color-blue, #1C6EFF) !important;
    box-shadow: none !important;
  }
}

/* Addon wrapper and text inside addons */
.sd-input.ant-input-group-wrapper {
  .ant-input-group-addon {
    background-color: var(--color-graphite-l50, #F7F9FC) !important;
    border-color: var(--color-graphite-l20, #D3D7DE) !important;
    color: var(--color-graphite-d40, #2F3540) !important;
    font-size: 12px !important;
    padding: 0 12px !important;
    border-radius: 2px !important;
    transition: border-color 0.2s ease !important;
  }
  
  &:hover .ant-input-group-addon {
    border-color: var(--color-blue, #1C6EFF) !important;
  }

  &.ant-input-group-wrapper-focused .ant-input-group-addon {
    border-color: var(--color-blue, #1C6EFF) !important;
  }
}

/* Height variations */
.sd-input.ant-input:not(textarea),
.sd-input.ant-input-affix-wrapper {
  height: 32px !important;
  padding: 5px 12px !important;
  box-sizing: border-box !important;

  &.sd-input--sm {
    height: 24px !important;
    padding: 1px 7px !important;
    font-size: 12px !important;
  }

  &.sd-input--lg {
    height: 40px !important;
    padding: 9px 12px !important;
    font-size: 14px !important;
  }
}

/* For addon inputs, the wrapper shouldn't force height, but the input/addon inside should */
.sd-input.ant-input-group-wrapper {
  .ant-input,
  .ant-input-group-addon {
    height: 32px !important;
    box-sizing: border-box !important;
  }

  &.sd-input--sm {
    .ant-input,
    .ant-input-group-addon {
      height: 24px !important;
      font-size: 12px !important;
    }
  }

  &.sd-input--lg {
    .ant-input,
    .ant-input-group-addon {
      height: 40px !important;
      font-size: 14px !important;
    }
  }
}

/* Textarea styling */
textarea.sd-input.ant-input {
  min-height: 52px !important;
  height: auto !important;
  padding: 6px 12px !important;
  line-height: 20px !important;
}

/* Disabled state */
.sd-input {
  &.ant-input-disabled,
  &.ant-input-affix-wrapper-disabled,
  &.ant-input-group-wrapper-disabled {
    background-color: var(--color-graphite-l30, #E1E5EB) !important;
    border-color: var(--color-graphite-l20, #D3D7DE) !important;
    color: var(--color-graphite, #A1A7B3) !important;
    cursor: not-allowed !important;

    .ant-input {
      background-color: transparent !important;
      color: var(--color-graphite, #A1A7B3) !important;
      cursor: not-allowed !important;
    }

    .ant-input-group-addon {
      background-color: var(--color-graphite-l30, #E1E5EB) !important;
      border-color: var(--color-graphite-l20, #D3D7DE) !important;
      color: var(--color-graphite, #A1A7B3) !important;
    }
  }
}

/* Error status styling */
.sd-input--error,
.sd-input-container--error {
  .ant-input,
  &.ant-input,
  &.ant-input-affix-wrapper,
  &.ant-input-group-wrapper {
    border-color: var(--color-red-d10, #CF171D) !important;
    
    &:hover,
    &:focus,
    &.ant-input-focused,
    &.ant-input-affix-wrapper-focused,
    &.ant-input-group-wrapper-focused {
      border-color: var(--color-red-d10, #CF171D) !important;
    }

    .ant-input-group-addon {
      border-color: var(--color-red-d10, #CF171D) !important;
    }
  }
}

.sd-input-error-tip {
  font-size: 12px !important;
  color: var(--color-red-d10, #CF171D) !important;
  margin-top: 4px !important;
  line-height: 20px !important;
  text-align: left !important;
}

/* Placeholder color override */
.sd-input {
  &::placeholder,
  .ant-input::placeholder {
    color: var(--color-graphite, #A1A7B3) !important;
  }
}
</style>
