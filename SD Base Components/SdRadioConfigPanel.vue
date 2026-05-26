<template>
  <div class="sd-radio-config-panel" :style="{ '--arrow-offset': arrowOffset }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SdRadioConfigPanel'
});

defineProps({
  arrowOffset: {
    type: String,
    default: '24px' /* Default left offset to align with radio circle */
  }
});
</script>

<style lang="less">
.sd-radio-config-panel {
  position: relative !important;
  background-color: var(--color-graphite-l50, #F7F9FC) !important;
  border: 1px solid var(--color-graphite-l30, #E1E5EB) !important;
  border-radius: 2px !important;
  padding: 8px 16px !important; /* vertical 8px, horizontal 16px */
  margin-top: 8px !important; /* Tight spacing under the Radio row */
  width: 100% !important;
  box-sizing: border-box !important;

  /* Upward arrow border line */
  &::before {
    content: '' !important;
    position: absolute !important;
    bottom: 100% !important;
    left: var(--arrow-offset, 24px) !important;
    margin-left: -6px !important;
    border-width: 6px !important;
    border-style: solid !important;
    border-color: transparent transparent var(--color-graphite-l30, #E1E5EB) transparent !important;
    pointer-events: none !important;
  }

  /* Upward arrow background fill */
  &::after {
    content: '' !important;
    position: absolute !important;
    bottom: 100% !important;
    left: var(--arrow-offset, 24px) !important;
    margin-left: -5px !important;
    border-width: 5px !important;
    border-style: solid !important;
    border-color: transparent transparent var(--color-graphite-l50, #F7F9FC) transparent !important;
    pointer-events: none !important;
  }
}
</style>
