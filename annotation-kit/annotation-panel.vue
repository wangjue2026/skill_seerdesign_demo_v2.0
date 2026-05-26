<template>
  <div class="sase-live-agent" ref="agentRef">
    <!-- 📍 ================== 绝对坐标标定透明遮罩层 ================== -->
    <div v-if="isPlacingDot" class="lda-overlay-mask" @click="handleGridClick" @mousemove="handleGridMouseMove">
      <div class="lda-crosshair-tooltip" :style="{ left: localMouseX + 15 + 'px', top: localMouseY + 15 + 'px' }">
        <div style="display:flex;align-items:center;gap:4px;">
          <span class="lda-ping-dot"></span>
          <span>在目标位置点击打点 📍</span>
        </div>
        <span class="lda-coord-text">百分比坐标: X: {{ tempXPercent.toFixed(1) }}% , Y: {{ tempYPercent.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 📍 ================== 绝对打点渲染图层 ================== -->
    <div v-if="showAnnotateMode" class="lda-dots-layer">
      <div v-for="(item, index) in filteredComments" :key="item.id" class="lda-dot-wrapper" :style="{ left: item.xPercent + '%', top: item.yPercent + '%' }">
        <div class="lda-dot-group">
          <!-- 打点数字气泡 -->
          <div class="lda-dot-bubble" @click.stop="editDot(item)">
            {{ index + 1 }}
          </div>
          <!-- 卡片悬浮详情 -->
          <div class="lda-dot-card">
            <div class="lda-dot-card-header">
              <span class="lda-dot-card-title">
                <span class="lda-dot-indicator"></span>
                Case {{ index + 1 }}: {{ item.title }}
              </span>
              <button @click.stop="deleteComment(item.id)" class="lda-btn-delete">删除</button>
            </div>
            <p class="lda-dot-card-desc">{{ item.content }}</p>
            <div class="lda-dot-card-footer">
              <span>坐标比: ({{ item.xPercent.toFixed(1) }}%, {{ item.yPercent.toFixed(1) }}%)</span>
              <span class="lda-badge">标号: #{{ item.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局轻量 Toast 提示 -->
    <div v-if="toastMsg" class="lda-toast">
      <span>⚡</span>
      <span>{{ toastMsg }}</span>
    </div>

    <!-- 🛠️ ================== 胶囊浮动控制条 ================== -->
    <div class="lda-capsule">
      <!-- 极简说明开关 -->
      <div class="lda-capsule-section">
        <span class="lda-capsule-label">说明</span>
        <button @click="toggleAnnotations" class="lda-switch" :class="{ 'lda-switch-on': showAnnotateMode }" title="一键开启/关闭交互打点说明">
          <span class="lda-switch-knob" :class="{ 'lda-switch-knob-on': showAnnotateMode }"></span>
        </button>
      </div>

      <!-- 快捷打点按钮 -->
      <button @click="enterPlacementMode" class="lda-capsule-btn lda-capsule-btn-sep" title="快捷打点标记">
        <span>📍 打点</span>
      </button>

      <!-- 控制台展开/折叠 -->
      <button @click="toggleSidebar" class="lda-capsule-btn">
        <span class="lda-capsule-icon" :class="{ 'lda-icon-rotate': isSidebarOpen }">🛠️</span>
        <span>{{ isSidebarOpen ? '收起' : '控制台' }}</span>
        <span class="lda-count-badge">{{ comments.length }}</span>
      </button>
    </div>

    <!-- 💻 ================== 右侧：高级开发者与设计师批注控制面板 (悬浮不挤压) ================== -->
    <!-- 点击外部关闭浮层的遮罩 -->
    <div v-if="isSidebarOpen" class="lda-panel-backdrop" @click="isSidebarOpen = false"></div>

    <div class="lda-panel" :class="{ 'lda-panel-open': isSidebarOpen }">
      <header class="lda-panel-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="lda-agent-title">● LIVE DEV AGENT</span>
          <span class="lda-agent-tag">自闭环版</span>
        </div>
        <button @click="copyAndSaveSource" class="lda-btn-primary" title="将最新的打点数据复制到剪贴板">
          📋 复制最新源码
        </button>
      </header>

      <nav class="lda-tabs">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="lda-tab-btn" :class="{ 'lda-tab-active': activeTab === tab.id }">
          {{ tab.name }}
        </button>
      </nav>

      <div class="lda-panel-content">
        <!-- Tab 1: 交互说明 -->
        <template v-if="activeTab === 'spec'">
          <button @click="enterPlacementMode" class="lda-btn-block">
            🎯 开启「任意坐标自由打点」模式
          </button>

          <div class="lda-list-header">
            <span>全部批注汇总 ({{ comments.length }} 条)</span>
            <button @click="copyMarkdown" class="lda-text-btn">📋 复制 Markdown 交付件</button>
          </div>

          <div v-if="comments.length === 0" class="lda-empty-state">暂无批注，请开启打点模式在画布中点击。</div>

          <div v-for="(item, index) in comments" :key="item.id" class="lda-list-item" :class="{ 'lda-list-item-current': item.scene === props.scene }">
            <div class="lda-list-item-header">
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="lda-list-index">{{ index + 1 }}</span>
                <h4>Case {{ index + 1 }}: {{ item.title }}</h4>
              </div>
              <button @click="deleteComment(item.id)" class="lda-btn-del-hover">删除</button>
            </div>
            <p class="lda-list-item-desc">{{ item.content }}</p>
            <div class="lda-list-item-footer">
              <span class="lda-scene-tag">📍 {{ item.scene || '默认页面' }}</span>
              <span class="lda-item-coord-badge">坐标: {{ item.xPercent.toFixed(1) }}%, {{ item.yPercent.toFixed(1) }}%</span>
            </div>
          </div>
        </template>

        <!-- Tab 2: 统一业务语言 -->
        <template v-if="activeTab === 'rules'">
          <div class="lda-rule-alert">
            <h4><span>📖</span> 统一业务语言参考字典 (共识底座)</h4>
            <p>这里定义了全局业务交互红线。设计师和产品经理需要严格对齐。</p>
          </div>
          <div v-for="(rule, name) in specRules" :key="name" class="lda-rule-card">
            <div class="lda-rule-card-header">
              <span class="lda-rule-name">{{ name }}</span>
              <span class="lda-rule-tag">{{ rule.component_name }}</span>
            </div>
            <div class="lda-rule-cases">
              <div class="lda-rule-case-title">🚨 必审 Case 项：</div>
              <ul>
                <li v-for="point in rule.must_have_cases" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>
        </template>

        <!-- Tab 3: Vue 实时源码 -->
        <template v-if="activeTab === 'code'">
          <div class="lda-list-header">
            <span>Vue 单文件数据预览</span>
            <span class="lda-live-tag">内存实时映射中</span>
          </div>
          <p class="lda-help-text">
            下面是导出时的注释块结构。点击右上方"复制最新源码"即可将该数据拷贝至剪贴板，随后请粘贴至您 <code>.vue</code> 文件的最底部。
          </p>
          <div class="lda-code-preview">
            <div class="lda-code-tag">JSON</div>
            <pre><code>{{ exportCodeString }}</code></pre>
          </div>
        </template>
      </div>
    </div>

    <!-- 💾 绝对坐标打点录入 Modal -->
    <div v-if="showAddModal" class="lda-modal-mask">
      <div class="lda-modal">
        <div class="lda-modal-header">
          <div class="lda-modal-index">{{ editingId !== null ? getDisplayIndex(editingId) : filteredComments.length + 1 }}</div>
          <h3>{{ editingId !== null ? '编辑交互逻辑标点' : '建立交互逻辑标点' }}</h3>
        </div>
        <div class="lda-modal-coords">
          <div>📍 标定 X 轴: <span>{{ tempXPercent.toFixed(1) }}%</span></div>
          <div>📍 标定 Y 轴: <span>{{ tempYPercent.toFixed(1) }}%</span></div>
        </div>
        <div class="lda-form-group">
          <label>交互控制点 (标题)</label>
          <input v-model="newCommentTitle" type="text" placeholder="如: 解除绑定二次强校验机制" />
        </div>
        <div class="lda-form-group">
          <label>交互逻辑说明 (Case 规范格式)</label>
          <textarea v-model="newCommentContent" rows="4" placeholder="Case 1-1: 鼠标悬浮时触发...&#10;Case 1-2: 弹出二次确认安全警告框..."></textarea>
        </div>
        <div class="lda-modal-footer">
          <button @click="cancelDotPlacement" class="lda-btn-cancel">取消</button>
          <button @click="submitNewDot" class="lda-btn-submit">保存标点</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  filePath: { type: String, required: true },
  scene: { type: String, default: 'default' }
});

const isSidebarOpen = ref(false);
const activeTab = ref('spec');
const showAnnotateMode = ref(true);
const isPlacingDot = ref(false);

const comments = ref([]);
const filteredComments = computed(() => {
  return comments.value.filter(c => !c.scene || c.scene === props.scene);
});
const editingId = ref(null);

function getDisplayIndex(id) {
  return filteredComments.value.findIndex(c => c.id === id) + 1;
}

const agentRef = ref(null);
const localMouseX = ref(0);
const localMouseY = ref(0);
const tempXPercent = ref(0);
const tempYPercent = ref(0);
const showAddModal = ref(false);
const newCommentTitle = ref('');
const newCommentContent = ref('');
const toastMsg = ref('');

const tabs = ref([
  { id: 'spec', name: '📋 交互说明' },
  { id: 'rules', name: '📚 统一业务语言' },
  { id: 'code', name: '💻 源码数据' }
]);

const specRules = ref({
  "GlobalInteraction": {
    "component_name": "全局交互",
    "must_have_cases": [
      "所有悬停需要有明确的高亮反馈",
      "关键操作必须有二次确认弹窗",
      "成功或失败的轻量级 Toast 提示必不可少"
    ]
  }
});

const localTimestamp = ref(Date.now());

const exportCodeString = computed(() => {
  const obj = { 
    timestamp: localTimestamp.value + 1, // File will have a strictly greater timestamp than local storage
    comments: comments.value 
  };
  const jsonString = JSON.stringify(obj, null, 2);
  const inner = jsonString.replace(/^\{\n/, '').replace(/\n\}\s*$/, '');
  return `/*@annotations{\n${inner}\n}@*/`;
});

// localStorage persistency
function storageKey() {
  return 'annotations::' + props.filePath;
}

async function loadFromFile() {
  try {
    let fsPath = props.filePath;
    // 兼容老版本注入的绝对路径（如 /Users/...）。如果是 Vite 根目录的相对路径（/src/... 等），则直接使用
    if (fsPath.startsWith('/') && !fsPath.startsWith('/src') && !fsPath.startsWith('/SKillS')) {
      fsPath = '/@fs' + fsPath;
    }
    // Add cache buster query so browser module cache doesn't return stale file content
    const module = await import(/* @vite-ignore */ fsPath + '?raw&t=' + Date.now());
    const rawText = module.default || '';
    
    // Extract annotations block
    const match = rawText.match(/\/\*@annotations\{([\s\S]*?)\}@\*\//);
    if (match) {
      const jsonStr = '{' + match[1] + '}';
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.comments) {
        return {
          timestamp: parsed.timestamp || 0,
          comments: parsed.comments
        };
      }
    }
  } catch (err) {
    console.warn("Live Dev Agent: Failed to load annotations from file source.", err);
  }
  return null;
}

async function initData() {
  try {
    const raw = localStorage.getItem(storageKey());
    let localData = { timestamp: 0, comments: [] };
    
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Backward compatibility for old array format
        localData = { timestamp: 0, comments: parsed };
      } else if (parsed && parsed.comments) {
        localData = parsed;
      }
    }

    const fileData = await loadFromFile();
    
    // Determine winner based on timestamp
    if (fileData && fileData.timestamp > localData.timestamp) {
      // File has newer data (user pasted new exported string)
      comments.value = fileData.comments;
      localTimestamp.value = fileData.timestamp;
      // Sync local storage
      localStorage.setItem(storageKey(), JSON.stringify(fileData));
    } else if (localData.comments.length > 0 || raw !== null) {
      // Local storage is newer
      comments.value = localData.comments;
      localTimestamp.value = localData.timestamp;
    } else if (fileData) {
      // Both 0, prefer file if it has data
      comments.value = fileData.comments;
      localTimestamp.value = fileData.timestamp;
    }
  } catch {
    comments.value = [];
  }
}

function persist() {
  localTimestamp.value = Date.now();
  const data = {
    timestamp: localTimestamp.value,
    comments: comments.value
  };
  localStorage.setItem(storageKey(), JSON.stringify(data));
}

// Logic
const showToast = (msg) => {
  toastMsg.value = msg;
  setTimeout(() => { toastMsg.value = ''; }, 3500);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleAnnotations = () => {
  showAnnotateMode.value = !showAnnotateMode.value;
  showToast(showAnnotateMode.value ? '💡 交互点位已全局展示' : '🔇 交互点位已隐藏');
};

const enterPlacementMode = () => {
  isPlacingDot.value = true;
  isSidebarOpen.value = false; // Hide sidebar while placing to give full view
  showToast('请在屏幕【任意坐标位置】点击打点');
};

const handleGridMouseMove = (e) => {
  if (!agentRef.value || !agentRef.value.parentElement) return;
  const rect = agentRef.value.parentElement.getBoundingClientRect();
  
  const relativeX = e.clientX - rect.left;
  const relativeY = e.clientY - rect.top;
  
  localMouseX.value = relativeX;
  localMouseY.value = relativeY;
  
  tempXPercent.value = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
  tempYPercent.value = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
};

const handleGridClick = () => {
  isPlacingDot.value = false;
  editingId.value = null;
  newCommentTitle.value = '';
  newCommentContent.value = '';
  showAddModal.value = true;
};

const editDot = (item) => {
  editingId.value = item.id;
  newCommentTitle.value = item.title;
  newCommentContent.value = item.content;
  tempXPercent.value = item.xPercent;
  tempYPercent.value = item.yPercent;
  showAddModal.value = true;
};

const cancelDotPlacement = () => {
  showAddModal.value = false;
  editingId.value = null;
  showToast('已取消坐标标定');
};

const submitNewDot = () => {
  if (!newCommentTitle.value || !newCommentContent.value) {
    showToast('⚠️ 标题与说明皆为必填项');
    return;
  }
  
  if (editingId.value !== null) {
    // Edit existing
    const idx = comments.value.findIndex(c => c.id === editingId.value);
    if (idx !== -1) {
      comments.value[idx].title = newCommentTitle.value;
      comments.value[idx].content = newCommentContent.value;
    }
    showToast(`Case 更新成功`);
  } else {
    // Add new
    comments.value.push({
      id: comments.value.length > 0 ? Math.max(...comments.value.map(c => c.id)) + 1 : 1,
      title: newCommentTitle.value,
      content: newCommentContent.value,
      xPercent: tempXPercent.value,
      yPercent: tempYPercent.value,
      scene: props.scene
    });
    showToast(`成功标定！数据已写入运行内存。`);
  }
  
  showAnnotateMode.value = true;
  showAddModal.value = false;
  editingId.value = null;
  persist();
};

const deleteComment = (id) => {
  const idx = comments.value.findIndex(c => c.id === id);
  if (idx !== -1) {
    comments.value.splice(idx, 1);
    persist();
    showToast('批注已删除，最新源码数据已重写');
  }
};

const copyAndSaveSource = () => {
  // Using document.execCommand to support copying text simply
  const codeBlock = exportCodeString.value;
  
  const textarea = document.createElement('textarea');
  textarea.value = codeBlock;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  showToast('💾 成功！完整标注源码已复制，请粘贴至您的 .vue 文件最底部！');
};

const copyMarkdown = () => {
  // Group all comments by scene
  const grouped = {};
  comments.value.forEach(c => {
    const sceneKey = c.scene || '默认页面';
    if (!grouped[sceneKey]) grouped[sceneKey] = [];
    grouped[sceneKey].push(c);
  });

  let md = `# 交互说明交付书\n\n`;
  md += `> 共 ${comments.value.length} 条批注，覆盖 ${Object.keys(grouped).length} 个页面\n\n`;

  Object.entries(grouped).forEach(([scene, items]) => {
    md += `## 🗺 页面：${scene}\n\n`;
    items.forEach((c, idx) => {
      md += `### 📝 Case ${idx + 1}: ${c.title}\n`;
      md += `**页面路由**: \`${scene}\` | **坐标**: (${c.xPercent.toFixed(1)}%, ${c.yPercent.toFixed(1)}%)\n\n`;
      md += `${c.content}\n\n---\n\n`;
    });
  });
  
  const textarea = document.createElement('textarea');
  textarea.value = md;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('📋 Markdown 已成功复制到剪贴板！');
};

onMounted(() => {
  if (agentRef.value && agentRef.value.parentElement) {
    const parent = agentRef.value.parentElement;
    const style = window.getComputedStyle(parent);
    if (style.position === 'static') {
      parent.style.position = 'relative';
    }
  }
  initData();
});
</script>

<style>
/* =====================================================
   LIVE DEV AGENT - Annotation Panel Styles
   All rules are namespaced under .sase-live-agent
   to avoid conflicts with host application styles.
   ===================================================== */

.sase-live-agent {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  position: absolute;
  inset: 0;
  z-index: 9999999;
  pointer-events: none;
}

/* Overlay mask for placement mode */
.sase-live-agent .lda-overlay-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(30, 27, 75, 0.1);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  z-index: 999998;
  cursor: crosshair;
  user-select: none;
  pointer-events: auto;
}

.sase-live-agent .lda-crosshair-tooltip {
  position: absolute;
  background-color: #4f46e5;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #818cf8;
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: none;
}

.sase-live-agent .lda-ping-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #34d399;
  animation: lda-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes lda-ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}

.sase-live-agent .lda-coord-text {
  font-size: 9px;
  color: #c7d2fe;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Dots layer */
.sase-live-agent .lda-dots-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999997;
}

.sase-live-agent .lda-dot-wrapper {
  position: absolute;
  pointer-events: auto;
}

.sase-live-agent .lda-dot-group {
  position: relative;
  transform: translate(-50%, -50%);
}

.sase-live-agent .lda-dot-bubble {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: white;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.2s;
  background-color: #4f46e5;
  animation: lda-radar-pulse 2s infinite;
}

.sase-live-agent .lda-dot-bubble:hover {
  transform: scale(1.15);
  background-color: #4338ca;
}

@keyframes lda-radar-pulse {
  0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0); }
  100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
}

.sase-live-agent .lda-dot-card {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  width: 320px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.85);
  padding: 16px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease-out;
  color: #1e293b;
  text-align: left;
}

.sase-live-agent .lda-dot-group:hover .lda-dot-card {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) scale(1);
}

.sase-live-agent .lda-dot-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.sase-live-agent .lda-dot-card-title {
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sase-live-agent .lda-dot-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4f46e5;
}

.sase-live-agent .lda-btn-delete {
  color: #f43f5e;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
}
.sase-live-agent .lda-btn-delete:hover { background-color: #fff1f2; color: #be123c; }

.sase-live-agent .lda-dot-card-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
}

.sase-live-agent .lda-dot-card-footer {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;
  font-family: monospace;
}

.sase-live-agent .lda-badge {
  background-color: #eef2ff;
  color: #4f46e5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: sans-serif;
}

/* Toast */
.sase-live-agent .lda-toast {
  position: fixed;
  bottom: 80px;
  left: 24px;
  z-index: 100000;
  background-color: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid #1e293b;
  color: #f1f5f9;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  pointer-events: none;
  animation: lda-bounce 1s infinite;
}

@keyframes lda-bounce {
  0%, 100% { transform: translateY(-4px); animation-timing-function: cubic-bezier(0.8,0,1,1); }
  50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}

/* Capsule */
.sase-live-agent .lda-capsule {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999998;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 7px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px rgba(224, 231, 255, 0.5);
  height: 36px;
  box-sizing: border-box;
  pointer-events: auto;
}

.sase-live-agent .lda-capsule-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 12px;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
}

.sase-live-agent .lda-capsule-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  user-select: none;
}

.sase-live-agent .lda-switch {
  width: 28px;
  height: 16px;
  border-radius: 9999px;
  background-color: #e2e8f0;
  position: relative;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 0;
  pointer-events: auto;
}
.sase-live-agent .lda-switch-on { background-color: #4f46e5; }

.sase-live-agent .lda-switch-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.sase-live-agent .lda-switch-knob-on { transform: translateX(12px); }

.sase-live-agent .lda-capsule-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 11px;
  font-weight: 800;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  padding: 0;
  pointer-events: auto;
}
.sase-live-agent .lda-capsule-btn:hover { color: #4f46e5; }
.sase-live-agent .lda-capsule-btn-sep { padding-right: 12px; border-right: 1px solid rgba(226, 232, 240, 0.8); }

.sase-live-agent .lda-capsule-icon { font-size: 12px; transition: transform 0.3s; }
.sase-live-agent .lda-icon-rotate { transform: rotate(45deg); color: #4f46e5; }

.sase-live-agent .lda-count-badge {
  background-color: #eef2ff;
  color: #4338ca;
  font-weight: 700;
  border-radius: 9999px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  border: 1px solid #e0e7ff;
  user-select: none;
}

/* Control Panel Sidebar */
.sase-live-agent .lda-panel-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999998;
  background: transparent;
  pointer-events: auto;
}

.sase-live-agent .lda-panel {
  position: fixed;
  top: 16px;
  bottom: 16px;
  right: -430px;
  width: 410px;
  background-color: rgba(14, 19, 31, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
  z-index: 999999;
  transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
}
.sase-live-agent .lda-panel-open { right: 16px; }

.sase-live-agent .lda-panel-header {
  padding: 20px;
  border-bottom: 1px solid #1e293b;
  background-color: #12192c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.sase-live-agent .lda-agent-title { color: #818cf8; font-weight: 700; font-size: 14px; }
.sase-live-agent .lda-agent-tag {
  background-color: #1e1b4b; color: #a5b4fc; font-size: 10px;
  font-weight: 800; padding: 2px 8px; border-radius: 4px; border: 1px solid #312e81;
}

.sase-live-agent .lda-btn-primary {
  padding: 6px 16px; background-color: #059669; color: white; font-size: 11px;
  font-weight: 800; border-radius: 8px; display: flex; align-items: center; gap: 6px;
  border: 1px solid #10b981; box-shadow: 0 10px 15px -3px rgba(5,150,105,0.2);
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.sase-live-agent .lda-btn-primary:hover { background-color: #047857; }
.sase-live-agent .lda-btn-primary:active { transform: scale(0.95); }

.sase-live-agent .lda-tabs {
  display: flex;
  border-bottom: 1px solid #1e293b;
  background-color: #0b0f19;
  flex-shrink: 0;
}

.sase-live-agent .lda-tab-btn {
  flex: 1; padding: 12px 0; text-align: center; font-size: 12px; font-weight: 700;
  background: transparent; border: none; border-bottom: 2px solid transparent;
  color: #94a3b8; cursor: pointer; transition: all 0.2s;
}
.sase-live-agent .lda-tab-btn:hover { color: #e2e8f0; background-color: rgba(15,23,42,0.4); }
.sase-live-agent .lda-tab-active { border-bottom-color: #6366f1; color: #818cf8; background-color: rgba(30,27,75,0.2); }

.sase-live-agent .lda-panel-content {
  flex: 1; overflow-y: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 16px;
}
.sase-live-agent .lda-panel-content::-webkit-scrollbar { width: 4px; }
.sase-live-agent .lda-panel-content::-webkit-scrollbar-track { background: transparent; }
.sase-live-agent .lda-panel-content::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

.sase-live-agent .lda-btn-block {
  width: 100%; padding: 12px; background-color: #4f46e5; color: white; font-weight: 700;
  font-size: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  gap: 8px; border: 1px solid #6366f1; box-shadow: 0 10px 15px -3px rgba(49,46,129,0.3);
  cursor: pointer; transition: all 0.2s;
}
.sase-live-agent .lda-btn-block:hover { background-color: #4338ca; }
.sase-live-agent .lda-btn-block:active { transform: scale(0.99); }

.sase-live-agent .lda-list-header {
  display: flex; justify-content: space-between; align-items: center; padding: 0 4px;
  font-size: 12px; font-weight: 700; color: #94a3b8;
}

.sase-live-agent .lda-text-btn {
  font-size: 10px; color: #818cf8; font-weight: 600; background: transparent;
  border: none; cursor: pointer; display: flex; align-items: center; gap: 4px;
}
.sase-live-agent .lda-text-btn:hover { color: #a5b4fc; }

.sase-live-agent .lda-empty-state {
  text-align: center; padding: 32px 0; color: #64748b; font-size: 12px;
  border: 1px dashed #1e293b; border-radius: 12px;
}

.sase-live-agent .lda-list-item {
  background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px;
  padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s;
  position: relative;
}
.sase-live-agent .lda-list-item:hover { border-color: #1e1b4b; }
.sase-live-agent .lda-list-item:hover .lda-btn-del-hover { opacity: 1; }

.sase-live-agent .lda-list-item-header { display: flex; justify-content: space-between; align-items: flex-start; }
.sase-live-agent .lda-list-index {
  width: 20px; height: 20px; border-radius: 50%;
  background-color: rgba(79,70,229,0.35); border: 1px solid rgba(99,102,241,0.5);
  color: #a5b4fc; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 10px;
}
.sase-live-agent .lda-list-item-header h4 { margin: 0; font-weight: 700; color: #e2e8f0; font-size: 12px; }
.sase-live-agent .lda-btn-del-hover {
  color: #f43f5e; font-size: 10px; font-weight: 700; opacity: 0; transition: opacity 0.2s;
  background: transparent; border: none; cursor: pointer;
}
.sase-live-agent .lda-btn-del-hover:hover { color: #fb7185; }
.sase-live-agent .lda-list-item-desc { margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6; white-space: pre-line; }
.sase-live-agent .lda-list-item-footer {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 9px; color: #64748b; font-family: monospace;
  border-top: 1px solid #1e293b; padding-top: 8px;
}
.sase-live-agent .lda-item-coord-badge {
  background-color: rgba(30,27,75,0.8); color: #818cf8; border: 1px solid #312e81;
  padding: 2px 6px; border-radius: 4px; font-family: sans-serif;
}

.sase-live-agent .lda-scene-tag {
  font-size: 10px; font-weight: 700; color: #6ee7b7;
  background-color: rgba(6, 78, 59, 0.3); border: 1px solid rgba(52, 211, 153, 0.3);
  padding: 2px 8px; border-radius: 4px; max-width: 180px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.sase-live-agent .lda-list-item-current {
  border-color: rgba(99, 102, 241, 0.4) !important;
  background-color: rgba(49, 46, 129, 0.15) !important;
}
.sase-live-agent .lda-list-item-current::before {
  content: '当前页';
  position: absolute; right: 12px; top: 10px;
  font-size: 9px; font-weight: 800; color: #818cf8;
  background-color: rgba(30,27,75,0.9); border: 1px solid #312e81;
  padding: 1px 6px; border-radius: 4px;
}

.sase-live-agent .lda-rule-alert {
  background-color: rgba(30,27,75,0.5); border: 1px solid rgba(49,46,129,0.5);
  padding: 14px; border-radius: 12px;
}
.sase-live-agent .lda-rule-alert h4 { margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #a5b4fc; display: flex; align-items: center; gap: 6px; }
.sase-live-agent .lda-rule-alert p { margin: 0; font-size: 10px; color: #94a3b8; line-height: 1.6; }

.sase-live-agent .lda-rule-card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sase-live-agent .lda-rule-card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
.sase-live-agent .lda-rule-name { font-weight: 700; color: #818cf8; font-size: 12px; font-family: monospace; }
.sase-live-agent .lda-rule-tag { font-size: 9px; color: #64748b; background-color: #020617; padding: 2px 8px; border-radius: 4px; border: 1px solid #1e293b; }
.sase-live-agent .lda-rule-cases { display: flex; flex-direction: column; gap: 8px; }
.sase-live-agent .lda-rule-case-title { font-size: 10px; font-weight: 700; color: #94a3b8; }
.sase-live-agent .lda-rule-cases ul { margin: 0; padding-left: 16px; font-size: 10px; color: #64748b; line-height: 1.6; font-family: sans-serif; }
.sase-live-agent .lda-rule-cases li { margin-bottom: 4px; }

.sase-live-agent .lda-live-tag { font-size: 9px; background-color: #0f172a; border: 1px solid #1e293b; color: #10b981; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: 700; }
.sase-live-agent .lda-help-text { font-size: 10px; color: #94a3b8; line-height: 1.6; margin: 0; }
.sase-live-agent .lda-code-preview { background-color: #020617; border-radius: 12px; padding: 14px; border: 1px solid #1e293b; position: relative; overflow-x: auto; }
.sase-live-agent .lda-code-tag { position: absolute; right: 12px; top: 12px; font-size: 9px; background-color: #0f172a; color: #64748b; padding: 2px 6px; border-radius: 4px; user-select: none; }
.sase-live-agent .lda-code-preview pre { margin: 0; font-family: monospace; font-size: 10px; color: #34d399; white-space: pre-wrap; }

/* Modal */
.sase-live-agent .lda-modal-mask {
  position: fixed; inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  z-index: 1000000;
  display: flex; align-items: center; justify-content: center;
  pointer-events: auto;
}

.sase-live-agent .lda-modal {
  background-color: white; border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  border: 1px solid #f1f5f9; padding: 24px;
  width: 100%; max-width: 448px;
  animation: lda-zoomIn 0.2s ease-out;
}

@keyframes lda-zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.sase-live-agent .lda-modal-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.sase-live-agent .lda-modal-index { width: 24px; height: 24px; border-radius: 50%; background-color: #4f46e5; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 12px; }
.sase-live-agent .lda-modal-header h3 { margin: 0; font-weight: 900; color: #1e293b; font-size: 16px; }

.sase-live-agent .lda-modal-coords {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  font-size: 10px; font-family: monospace; color: #94a3b8;
  background-color: #f8fafc; padding: 10px; border-radius: 8px;
  border: 1px solid #f1f5f9; margin-bottom: 16px;
}
.sase-live-agent .lda-modal-coords span { color: #4f46e5; font-weight: 700; }

.sase-live-agent .lda-form-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.sase-live-agent .lda-form-group label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.sase-live-agent .lda-form-group input,
.sase-live-agent .lda-form-group textarea {
  width: 100%; box-sizing: border-box; font-size: 12px; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 10px 12px; outline: none; transition: box-shadow 0.2s;
  font-family: inherit; color: #1e293b;
}
.sase-live-agent .lda-form-group input:focus,
.sase-live-agent .lda-form-group textarea:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.2); }

.sase-live-agent .lda-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.sase-live-agent .lda-btn-cancel { padding: 10px 16px; font-size: 12px; font-weight: 700; color: #64748b; background-color: #f1f5f9; border-radius: 8px; transition: background-color 0.2s; border: none; cursor: pointer; }
.sase-live-agent .lda-btn-cancel:hover { background-color: #e2e8f0; }
.sase-live-agent .lda-btn-submit { padding: 10px 16px; font-size: 12px; font-weight: 700; color: white; background-color: #4f46e5; border-radius: 8px; transition: background-color 0.2s; border: none; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(199,210,254,0.5); }
.sase-live-agent .lda-btn-submit:hover { background-color: #4338ca; }
</style>
