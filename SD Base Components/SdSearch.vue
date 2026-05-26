<template>
  <div class="sd-search-wrapper">
    <a-input
      v-bind="$attrs"
      class="sd-search-input"
    >
      <template #suffix>
        <SearchOutlined style="color: var(--color-graphite, #A1A7B3); font-size: 14px;" />
      </template>
      <!-- 透传其它插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot v-if="name !== 'suffix'" :name="name" v-bind="slotProps || {}"></slot>
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue';
defineOptions({ name: 'SdSearch' });
</script>

<style scoped lang="less">
.sd-search-wrapper {
  display: inline-block;
  
  /* 针对 a-input 自带的外层 wrapper 进行样式覆写，防止双层边框 */
  :deep(.ant-input-affix-wrapper) {
    height: 32px !important;
    border-radius: 2px !important;
    padding: 0 12px !important;
    border-color: var(--color-graphite-l20, #D3D7DE) !important;
    background-color: var(--color-white, #FFFFFF) !important;
    
    &:hover, &-focused {
      border-color: var(--color-blue, #226DFA) !important;
      box-shadow: none !important;
    }
    
    input.ant-input {
      font-size: 12px !important;
      color: var(--color-graphite-d40, #1F2329) !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      height: 100% !important;
      
      &::placeholder {
        color: var(--color-graphite, #A1A7B3) !important;
      }
    }
  }
}
</style>
