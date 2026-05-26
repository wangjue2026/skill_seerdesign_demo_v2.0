<template>
  <div 
    class="sd-tree-container"
    :class="{ 
      'sd-tree-container--no-icons': noBusinessIcons || !hasAnyIcon
    }"
  >
    <a-tree
      v-bind="$attrs"
      :tree-data="displayTreeData"
      :show-line="{ showLeafIcon: false }"
      :show-icon="false"
      :block-node="true"
      v-model:expanded-keys="localExpandedKeys"
      v-model:selected-keys="localSelectedKeys"
      class="sd-tree"
    >
      <!-- Custom Switcher Icon: Square +/- -->
      <template #switcherIcon="{ expanded, isLeaf }">
        <span v-if="!isLeaf" class="sd-tree-switcher-btn">
          <svg v-if="expanded" viewBox="0 0 16 16" width="16" height="16">
            <rect x="1" y="1" width="14" height="14" rx="2" fill="#F7F9FC" stroke="#BEC3CC" stroke-width="1"/>
            <line x1="4" y1="8" x2="12" y2="8" stroke="#5E6573" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <svg v-else viewBox="0 0 16 16" width="16" height="16">
            <rect x="1" y="1" width="14" height="14" rx="2" fill="#F7F9FC" stroke="#BEC3CC" stroke-width="1"/>
            <line x1="4" y1="8" x2="12" y2="8" stroke="#5E6573" stroke-width="1.2" stroke-linecap="round"/>
            <line x1="8" y1="4" x2="8" y2="12" stroke="#5E6573" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </span>
        <span v-else class="sd-tree-switcher-btn sd-tree-switcher-btn--leaf">
          <!-- Connector line drawn by CSS for leaf -->
        </span>
      </template>

      <!-- Custom Title Slot -->
      <template #title="node">
        <div class="sd-tree-node-title">
          <div class="sd-tree-node-title__left">
            <!-- Business Icon -->
            <component 
              v-if="node.icon && !noBusinessIcons" 
              :is="node.icon" 
              class="sd-tree-node-title__icon" 
            />
            
            <!-- Node Title/Name -->
            <span class="sd-tree-node-title__text">{{ node.title }}</span>
            
            <!-- Count -->
            <span 
              v-if="node.count !== undefined && node.count !== null" 
              class="sd-tree-node-title__count"
            >
              ({{ node.count }})
            </span>
          </div>

          <!-- Hover Actions -->
          <div class="sd-tree-node-title__actions" @click.stop>
            <slot name="node-actions" :node="node">
              <a-dropdown v-if="node.hasActions" :trigger="['click']" placement="bottomRight">
                <div class="sd-tree-node-title__action-trigger">
                  <MoreOutlined />
                </div>
                <template #overlay>
                  <slot name="node-menu" :node="node" />
                </template>
              </a-dropdown>
            </slot>
          </div>
        </div>
      </template>

      <!-- Forward other slots -->
      <template #[slotName]="slotProps" v-for="(_, slotName) in $slots" :key="slotName">
        <slot v-if="slotName !== 'switcherIcon' && slotName !== 'title'" :name="slotName" v-bind="slotProps || {}" />
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue';
import { MoreOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'SdTree',
  inheritAttrs: false
});

const props = defineProps({
  treeData: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  searchQuery: {
    type: String,
    default: ''
  },
  noBusinessIcons: {
    type: Boolean,
    default: false
  },
  expandedKeys: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  selectedKeys: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

const emit = defineEmits(['update:expandedKeys', 'update:selectedKeys']);

// Setup local keys sync
const localExpandedKeys = computed({
  get() {
    return props.expandedKeys;
  },
  set(val) {
    emit('update:expandedKeys', val);
  }
});

const localSelectedKeys = computed({
  get() {
    return props.selectedKeys;
  },
  set(val) {
    emit('update:selectedKeys', val);
  }
});

// Expanded Keys snapshot cache for search restoration
const expandedSnapshot = ref<any[] | null>(null);

// Determine if any node in the treeData has an icon attribute
const hasAnyIcon = computed(() => {
  const checkHasIcon = (nodes: any[]): boolean => {
    for (const node of nodes) {
      if (node.icon) return true;
      if (node.children && checkHasIcon(node.children)) return true;
    }
    return false;
  };
  return checkHasIcon(props.treeData);
});

// Recursively filter tree nodes and collect expanding parent keys
const filterTree = (nodes: any[], query: string): { matches: any[], expandKeys: any[] } => {
  const matches: any[] = [];
  let expandKeys: any[] = [];
  
  for (const node of nodes) {
    const titleStr = String(node.title || '');
    const isMatch = titleStr.toLowerCase().includes(query.toLowerCase());
    
    let childrenMatches: any[] = [];
    let childrenExpandKeys: any[] = [];
    
    if (node.children && node.children.length) {
      const res = filterTree(node.children, query);
      childrenMatches = res.matches;
      childrenExpandKeys = res.expandKeys;
    }
    
    if (isMatch || childrenMatches.length) {
      matches.push({
        ...node,
        children: childrenMatches.length ? childrenMatches : undefined
      });
      if (childrenMatches.length) {
        expandKeys.push(node.key);
        expandKeys = [...expandKeys, ...childrenExpandKeys];
      }
    }
  }
  return { matches, expandKeys };
};

// Filtered Tree Data and key management based on search queries
const displayTreeData = computed(() => {
  const query = props.searchQuery.trim();
  if (!query) return props.treeData;
  const { matches } = filterTree(props.treeData, query);
  return matches;
});

watch(() => props.searchQuery, (newQuery, oldQuery) => {
  const query = newQuery.trim();
  if (query) {
    // Save snapshot once when starting search
    if (expandedSnapshot.value === null) {
      expandedSnapshot.value = [...localExpandedKeys.value];
    }
    const { expandKeys } = filterTree(props.treeData, query);
    localExpandedKeys.value = Array.from(new Set(expandKeys));
  } else {
    // Restore snapshot when search is cleared
    if (expandedSnapshot.value !== null) {
      localExpandedKeys.value = expandedSnapshot.value;
      expandedSnapshot.value = null;
    }
  }
});
</script>

<style lang="less">
/* Outer tree container */
.sd-tree-container {
  padding: 0 12px !important; /* aligned with search toolbars */
  box-sizing: border-box !important;
  width: 100% !important;

  .sd-tree.ant-tree {
    background: transparent !important;
    font-size: 12px !important;
    font-family: inherit !important;
    color: var(--color-graphite-d40, #2F3540) !important;
  }

  /* Node heights and alignments */
  .ant-tree-treenode {
    padding: 0 !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
    position: relative !important;
    width: 100% !important;

    /* Hover effect */
    &:hover {
      .ant-tree-node-content-wrapper {
        background-color: var(--color-graphite-l50, #F7F9FC) !important;
      }
      .sd-tree-node-title__actions {
        opacity: 1 !important;
      }
    }

    /* Selected state */
    &.ant-tree-treenode-selected {
      .ant-tree-node-content-wrapper {
        background-color: var(--color-blue-l50, #E8F4FF) !important;
        color: var(--color-blue, #1C6EFF) !important;
      }
      .sd-tree-node-title__actions {
        opacity: 1 !important; /* Keep actions visible when selected */
      }
    }
  }

  /* Switcher container customization */
  .ant-tree-switcher {
    width: 20px !important;
    height: 32px !important;
    line-height: 32px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
    z-index: 2 !important;
  }

  .sd-tree-switcher-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 16px !important;
    height: 16px !important;
    
    svg {
      width: 16px !important;
      height: 16px !important;
    }
  }

  /* Content wrapper (block node) */
  .ant-tree-node-content-wrapper {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 8px 0 4px !important; /* right padding 8px留白 */
    border-radius: 2px !important;
    transition: all 0.2s ease !important;
    flex-grow: 1 !important;
    display: flex !important;
    align-items: center !important;
    min-width: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }

  /* Indent and nesting rules */
  .ant-tree-indent {
    height: 32px !important;
    display: inline-flex !important;
  }
  
  .ant-tree-indent-unit {
    width: 16px !important; /* 16px indent per level */
    height: 32px !important;
  }

  /* Custom Title Flex structure */
  .sd-tree-node-title {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
  }

  .sd-tree-node-title__left {
    display: flex !important;
    align-items: center !important;
    min-width: 0 !important;
    flex-grow: 1 !important;
  }

  .sd-tree-node-title__icon {
    width: 16px !important;
    height: 16px !important;
    font-size: 16px !important;
    margin-right: 4px !important; /* standard spacing */
    color: var(--color-graphite-d20, #5E6573) !important;
    flex-shrink: 0 !important;
  }

  .sd-tree-node-title__text {
    font-size: 12px !important;
    color: inherit !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .sd-tree-node-title__count {
    font-size: 12px !important;
    color: var(--color-graphite, #A1A7B3) !important;
    margin-left: 4px !important;
    flex-shrink: 0 !important;
  }

  /* Right aligned Actions */
  .sd-tree-node-title__actions {
    margin-left: auto !important;
    flex-shrink: 0 !important;
    opacity: 0;
    transition: opacity 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 24px !important;
    height: 24px !important;
  }

  .sd-tree-node-title__action-trigger {
    width: 24px !important;
    height: 24px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    color: var(--color-graphite-d20, #5E6573) !important;
    border-radius: 2px !important;
    transition: all 0.2s ease !important;

    &:hover {
      background-color: var(--color-graphite-l30, #E1E5EB) !important;
    }
  }

  /* --- Connection Lines Styling (showLine) --- */
  .sd-tree.ant-tree-show-line {
    .ant-tree-indent-unit {
      position: relative !important;
      
      &::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        right: 8px !important; /* half of 16px width to draw vertical line center of block */
        bottom: 0 !important;
        border-right: 1px solid var(--color-graphite-l30, #E1E5EB) !important;
      }
    }

    /* Switcher connection lines */
    .ant-tree-switcher-noop {
      position: relative !important;
      
      &::after {
        content: '' !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        width: 8px !important; /* connects to start of text */
        height: 1px !important;
        background-color: var(--color-graphite-l30, #E1E5EB) !important;
      }
    }
  }
}

/* --- No Business Icons Mode (Aligns switcher and lines directly to text) --- */
.sd-tree-container--no-icons.sd-tree-container {
  .ant-tree-indent-unit::before {
    right: 8px !important;
  }
}
</style>
