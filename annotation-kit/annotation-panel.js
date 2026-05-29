class SaseAnnotationPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    this.state = {
      filePath: this.getAttribute('file-path') || window.location.pathname,
      scene: this.getAttribute('scene') || 'default',
      isSidebarOpen: false,
      activeTab: 'spec',
      showAnnotateMode: true,
      isPlacingDot: false,
      comments: [],
      editingId: null,
      localMouseX: 0,
      localMouseY: 0,
      tempXPercent: 0,
      tempYPercent: 0,
      showAddModal: false,
      newCommentTitle: '',
      newCommentContent: '',
      newCommentImage: '',
      toastMsg: '',
      localTimestamp: Date.now()
    };
    
    this.isRendered = false;
  }

  connectedCallback() {
    // 数据块 <script id="sase-annotations"> 在 HTML 中位于本元素之后，
    // 必须等待整个 DOM 解析完毕再读取，否则 querySelectorAll 找不到它
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initData();
        this.render();
        this.setupObserver();
      });
    } else {
      // DOM 已完全加载（例如动态插入场景）
      this.initData();
      this.render();
      this.setupObserver();
    }
  }

  setupObserver() {
    if (this.observer) return;
    this.observer = new MutationObserver(() => {
      if (this.state.showAnnotateMode) {
        this.updateDots();
        // 增加 300ms 延时检查，处理 CSS transform 过渡动画（如抽屉滑出视口）
        setTimeout(() => {
          if (this.state.showAnnotateMode) this.updateDots();
        }, 300);
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }

  storageKey() {
    return 'annotations::' + this.state.filePath;
  }

  getUniqueSelector(el) {
    if (!el || el === document.body) return 'body';
    if (el.hasAttribute('data-sase-target')) return `[data-sase-target="${el.getAttribute('data-sase-target')}"]`;
    if (el.id) return `#${el.id}`;
    
    let path = [];
    let current = el;
    while (current && current !== document.body) {
      if (current.id) {
        path.unshift(`#${current.id}`);
        break;
      }
      let selector = current.tagName.toLowerCase();
      let sib = current, nth = 1;
      while (sib = sib.previousElementSibling) nth++;
      selector += `:nth-child(${nth})`;
      path.unshift(selector);
      current = current.parentElement;
    }
    return 'body > ' + path.join(' > ');
  }

  findClosestContainer(el) {
    let current = el;
    while (current && current !== document.body) {
      if (current.hasAttribute('data-sase-target')) return current;
      const style = window.getComputedStyle(current);
      if (style.position === 'fixed' || style.position === 'absolute') {
        if (current.offsetWidth > 50 && current.offsetHeight > 50) return current;
      }
      if (current.hasAttribute('x-show') || current.hasAttribute('v-show') || current.hasAttribute('v-if')) {
        return current;
      }
      if (typeof current.className === 'string' && /(modal|drawer|dialog|popup|page|tab-pane|content-viewport)/i.test(current.className)) {
        return current;
      }
      current = current.parentElement;
    }
    return document.body;
  }

  getContainerName(el) {
    const docTitle = document.title || '当前页面';
    if (el === document.body) return docTitle;
    if (el.hasAttribute('data-sase-target')) return el.getAttribute('data-sase-target');
    
    const heading = el.querySelector('h1, h2, h3, h4, h5, .title, .header');
    if (heading && heading.innerText) {
      let text = heading.innerText.trim().split('\n')[0];
      if (text.length > 20) text = text.substring(0, 20) + '...';
      if (text) return text;
    }
    
    const cls = typeof el.className === 'string' ? el.className.toLowerCase() : '';
    if (cls.includes('drawer')) return '侧边抽屉';
    if (cls.includes('modal') || cls.includes('dialog')) return '弹窗面板';
    if (cls.includes('page') || cls.includes('viewport')) return '局部页面';
    if (el.hasAttribute('x-show') || el.hasAttribute('v-show') || el.hasAttribute('v-if')) return '切换面板';
    
    return docTitle + ' (局部区域)';
  }

  isTargetVisible(item) {
    let selector = item.selector;
    if (!selector) {
      if (!item.scene || item.scene === 'global' || item.scene === 'default' || item.scene === '全局默认页面') return true;
      selector = `[data-sase-target="${item.scene}"]`;
    }
    if (selector === 'body') return true;
    
    let el;
    try {
      el = document.querySelector(selector);
    } catch(e) { return false; }
    
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.right <= 1 || rect.left >= vw - 1 || rect.bottom <= 1 || rect.top >= vh - 1) {
      return false;
    }
    
    return true;
  }

  getFilteredComments() {
    return this.state.comments.filter(c => this.isTargetVisible(c));
  }

  initData() {
    try {
      const raw = localStorage.getItem(this.storageKey());
      let localData = { timestamp: 0, comments: [] };
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localData = { timestamp: 0, comments: parsed };
        else if (parsed && parsed.comments) localData = parsed;
      }

      // Try to load from the inline script block (new approach for HTML)
      let fileData = null;
      const scriptBlocks = document.querySelectorAll('#sase-annotations');
      if (scriptBlocks && scriptBlocks.length > 0) {
        for (const block of scriptBlocks) {
          try {
            const parsed = JSON.parse(block.textContent);
            if (parsed && typeof parsed.timestamp === 'number') {
              if (!fileData || parsed.timestamp > fileData.timestamp) {
                fileData = parsed;
              }
            }
          } catch (e) { }
        }
      }

      if (fileData && fileData.timestamp > localData.timestamp) {
        this.state.comments = fileData.comments;
        this.state.localTimestamp = fileData.timestamp;
        localStorage.setItem(this.storageKey(), JSON.stringify(fileData));
      } else if (localData.comments.length > 0 || raw !== null) {
        this.state.comments = localData.comments;
        this.state.localTimestamp = localData.timestamp;
      } else if (fileData) {
        this.state.comments = fileData.comments;
        this.state.localTimestamp = fileData.timestamp;
      }
    } catch (e) {
      this.state.comments = [];
    }
  }

  persist() {
    this.state.localTimestamp = Date.now();
    const data = { timestamp: this.state.localTimestamp, comments: this.state.comments };
    localStorage.setItem(this.storageKey(), JSON.stringify(data));
  }

  showToast(msg) {
    this.state.toastMsg = msg;
    this.updateToast();
    setTimeout(() => {
      this.state.toastMsg = '';
      this.updateToast();
    }, 3500);
  }

  getExportCodeString() {
    const obj = { 
      timestamp: this.state.localTimestamp + 1, 
      comments: this.state.comments 
    };
    return JSON.stringify(obj, null, 2);
  }

  copyAndSaveSource() {
    // Generate the script block
    const codeBlock = `<script id="sase-` + `annotations" type="application/json">\n${this.getExportCodeString()}\n<\/script>`;
    const textarea = document.createElement('textarea');
    textarea.value = codeBlock;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.showToast('💾 成功！完整数据已复制，请替换或粘贴至您的 .html 文件最底部！');
  }

  copyAsMarkdown() {
    if (this.state.comments.length === 0) {
      this.showToast('⚠️ 暂无批注内容可复制');
      return;
    }
    const lines = ['# 交互说明批注\n'];
    this.state.comments.forEach((item, index) => {
      lines.push(`## ${index + 1}. ${item.title}`);
      lines.push(`> **场景**: ${item.scene || '默认页面'} | **坐标**: (${item.xPercent.toFixed(1)}%, ${item.yPercent.toFixed(1)}%)\n`);
      lines.push(item.content);
      if (item.image) {
        lines.push(`\n![截图](${item.image})\n`);
      }
      lines.push('\n---\n');
    });
    const mdText = lines.join('\n');
    const textarea = document.createElement('textarea');
    textarea.value = mdText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.showToast('📝 Markdown 批注文档已复制到剪贴板！');
  }

  render() {
    if (!this.isRendered) {
      this.shadowRoot.innerHTML = `
        <style>
          /* CSS will be injected here by the tool */
        </style>
        <div class="sase-live-agent">
          <div id="mask-layer"></div>
          <div id="dots-layer"></div>
          <div id="toast-layer"></div>
          <div id="capsule-layer"></div>
          <div id="sidebar-layer"></div>
          <div id="modal-layer"></div>
        </div>
      `;
      this.isRendered = true;
    }
    this.update();
  }

  update() {
    this.updateMask();
    this.updateDots();
    this.updateToast();
    this.updateCapsule();
    this.updateSidebar();
    this.updateModal();
  }

  updateMask() {
    const layer = this.shadowRoot.getElementById('mask-layer');
    if (!this.state.isPlacingDot) {
      layer.innerHTML = '';
      layer.onclick = null;
      layer.onmousemove = null;
      return;
    }
    layer.innerHTML = `
      <div class="lda-overlay-mask">
        <div class="lda-crosshair-tooltip" style="left: ${this.state.localMouseX + 15}px; top: ${this.state.localMouseY + 15}px;">
          <div style="display:flex;align-items:center;gap:4px;">
            <span class="lda-ping-dot"></span>
            <span>在目标位置点击打点 📍</span>
          </div>
          <span class="lda-coord-text">百分比坐标: X: ${this.state.tempXPercent.toFixed(1)}% , Y: ${this.state.tempYPercent.toFixed(1)}%</span>
        </div>
      </div>
    `;
    const mask = layer.querySelector('.lda-overlay-mask');
    mask.onclick = (e) => {
      mask.style.pointerEvents = 'none';
      const clickedEl = document.elementFromPoint(e.clientX, e.clientY);
      mask.style.pointerEvents = 'auto';
      
      let selector = 'body';
      let sceneName = '全局默认页面';
      if (clickedEl) {
        const container = this.findClosestContainer(clickedEl);
        selector = this.getUniqueSelector(container);
        sceneName = this.getContainerName(container);
      }
      this.state.tempSelector = selector;
      this.state.tempSceneName = sceneName;
      this.state.scene = sceneName; // for legacy UI usage
      
      this.state.isPlacingDot = false;
      this.state.editingId = null;
      this.state.newCommentTitle = '';
      this.state.newCommentContent = '';
      this.state.showAddModal = true;
      this.update();
    };
    mask.onmousemove = (e) => {
      const rect = this.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      this.state.localMouseX = relativeX;
      this.state.localMouseY = relativeY;
      this.state.tempXPercent = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
      this.state.tempYPercent = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
      this.updateMask(); // Only update mask to avoid full re-render lag
    };
  }

  updateDots() {
    const layer = this.shadowRoot.getElementById('dots-layer');
    if (!this.state.showAnnotateMode) {
      layer.innerHTML = '';
      return;
    }
    const filtered = this.getFilteredComments();
    let html = '<div class="lda-dots-layer">';
    filtered.forEach((item) => {
      const globalIndex = this.state.comments.findIndex(c => c.id === item.id) + 1;
      html += `
        <div class="lda-dot-wrapper" style="left: ${item.xPercent}%; top: ${item.yPercent}%">
          <div class="lda-dot-group">
            <div class="lda-dot-bubble" data-id="${item.id}">${globalIndex}</div>
            <div class="lda-dot-card">
              <div class="lda-dot-card-header">
                <span class="lda-dot-card-title"><span class="lda-dot-indicator"></span> ${globalIndex}. ${item.title}</span>
                <button class="lda-btn-delete" data-id="${item.id}">删除</button>
              </div>
              <p class="lda-dot-card-desc">${item.content}</p>
              ${item.image ? `
                <div class="lda-dot-card-media">
                  <img src="${item.image}" alt="截图说明" />
                </div>
              ` : ''}
              <div class="lda-dot-card-footer">
                <span>坐标比: (${item.xPercent.toFixed(1)}%, ${item.yPercent.toFixed(1)}%)</span>
                <span class="lda-badge">标号: #${item.id}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    layer.innerHTML = html;

    // Attach events
    layer.querySelectorAll('.lda-dot-bubble').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const item = filtered.find(c => c.id === parseInt(el.getAttribute('data-id')));
        if(item) {
          this.state.editingId = item.id;
          this.state.newCommentTitle = item.title;
          this.state.newCommentContent = item.content;
          this.state.newCommentImage = item.image || '';
          this.state.tempXPercent = item.xPercent;
          this.state.tempYPercent = item.yPercent;
          this.state.showAddModal = true;
          this.update();
        }
      };
    });
    layer.querySelectorAll('.lda-btn-delete').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(el.getAttribute('data-id'));
        const idx = this.state.comments.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.state.comments.splice(idx, 1);
          this.persist();
          this.showToast('批注已删除');
          this.update();
        }
      };
    });
  }

  updateToast() {
    const layer = this.shadowRoot.getElementById('toast-layer');
    if (this.state.toastMsg) {
      layer.innerHTML = `<div class="lda-toast"><span>⚡</span><span>${this.state.toastMsg}</span></div>`;
    } else {
      layer.innerHTML = '';
    }
  }

  updateCapsule() {
    const layer = this.shadowRoot.getElementById('capsule-layer');
    layer.innerHTML = `
      <div class="lda-capsule">
        <div class="lda-capsule-section">
          <span class="lda-capsule-label">说明</span>
          <button class="lda-switch ${this.state.showAnnotateMode ? 'lda-switch-on' : ''}" id="btn-toggle-ann">
            <span class="lda-switch-knob ${this.state.showAnnotateMode ? 'lda-switch-knob-on' : ''}"></span>
          </button>
        </div>
        <button class="lda-capsule-btn lda-capsule-btn-sep" id="btn-place-dot"><span>📍 打点</span></button>
        <button class="lda-capsule-btn" id="btn-toggle-sidebar">
          <span class="lda-capsule-icon ${this.state.isSidebarOpen ? 'lda-icon-rotate' : ''}">🛠️</span>
          <span>${this.state.isSidebarOpen ? '收起' : '控制台'}</span>
          <span class="lda-count-badge">${this.state.comments.length}</span>
        </button>
      </div>
    `;
    layer.querySelector('#btn-toggle-ann').onclick = () => {
      this.state.showAnnotateMode = !this.state.showAnnotateMode;
      this.showToast(this.state.showAnnotateMode ? '💡 交互点位已全局展示' : '🔇 交互点位已隐藏');
      this.updateDots();
      this.updateCapsule();
    };
    layer.querySelector('#btn-place-dot').onclick = () => {
      this.state.isPlacingDot = true;
      this.state.isSidebarOpen = false;
      this.showToast('请在屏幕【任意坐标位置】点击打点');
      this.update();
    };
    layer.querySelector('#btn-toggle-sidebar').onclick = () => {
      this.state.isSidebarOpen = !this.state.isSidebarOpen;
      this.updateSidebar();
      this.updateCapsule();
    };
  }

  updateSidebar() {
    const layer = this.shadowRoot.getElementById('sidebar-layer');
    if (!this.state.isSidebarOpen) {
      layer.innerHTML = '<div class="lda-panel"></div>';
      return;
    }
    
    let contentHtml = '';
    if (this.state.activeTab === 'spec') {
      contentHtml += `
        <button class="lda-btn-block" id="btn-sidebar-place">🎯 开启「任意坐标自由打点」模式</button>
        <div class="lda-list-header">
          <span>全部批注汇总 (${this.state.comments.length} 条)</span>
          <button class="lda-text-btn" id="btn-copy-md" title="将所有批注复制为 Markdown 文档">📝 复制 MD</button>
        </div>
      `;
      if (this.state.comments.length === 0) {
        contentHtml += `<div class="lda-empty-state">暂无批注，请开启打点模式在画布中点击。</div>`;
      } else {
        this.state.comments.forEach((item, index) => {
          contentHtml += `
            <div class="lda-list-item ${this.isTargetVisible(item) ? 'lda-list-item-current' : ''}">
              <div class="lda-list-item-header">
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="lda-list-index">${index + 1}</span>
                  <h4>${index + 1}. ${item.title}</h4>
                </div>
                <button class="lda-btn-del-hover" data-id="${item.id}">删除</button>
              </div>
              <p class="lda-list-item-desc">${item.content}</p>
              ${item.image ? `
                <div class="lda-list-item-media">
                  <img src="${item.image}" alt="截图" />
                </div>
              ` : ''}
              <div class="lda-list-item-footer">
                <span class="lda-scene-tag">📍 ${item.scene || '默认页面'}</span>
                <span class="lda-item-coord-badge">坐标: ${item.xPercent.toFixed(1)}%, ${item.yPercent.toFixed(1)}%</span>
              </div>
            </div>
          `;
        });
      }
    } else if (this.state.activeTab === 'code') {
      contentHtml += `
        <div class="lda-list-header"><span>数据预览</span></div>
        <p class="lda-help-text">点击上方复制最新源码。</p>
        <div class="lda-code-preview">
          <pre><code>${this.getExportCodeString()}</code></pre>
        </div>
      `;
    }

    layer.innerHTML = `
      <div class="lda-panel-backdrop" id="sidebar-backdrop"></div>
      <div class="lda-panel lda-panel-open">
        <header class="lda-panel-header">
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="lda-agent-title">● LIVE DEV AGENT</span>
            <span class="lda-agent-tag">HTML版</span>
          </div>
          <button class="lda-btn-primary" id="btn-copy-src">📋 复制最新源码</button>
        </header>
        <nav class="lda-tabs">
          <button class="lda-tab-btn ${this.state.activeTab === 'spec' ? 'lda-tab-active' : ''}" data-tab="spec">📋 交互说明</button>
          <button class="lda-tab-btn ${this.state.activeTab === 'code' ? 'lda-tab-active' : ''}" data-tab="code">💻 源码数据</button>
        </nav>
        <div class="lda-panel-content">${contentHtml}</div>
      </div>
    `;

    layer.querySelector('#sidebar-backdrop').onclick = () => { this.state.isSidebarOpen = false; this.update(); };
    layer.querySelector('#btn-copy-src').onclick = () => this.copyAndSaveSource();
    layer.querySelectorAll('.lda-tab-btn').forEach(el => {
      el.onclick = () => { this.state.activeTab = el.getAttribute('data-tab'); this.updateSidebar(); };
    });
    
    if (this.state.activeTab === 'spec') {
      const btnPlace = layer.querySelector('#btn-sidebar-place');
      if (btnPlace) btnPlace.onclick = () => {
        this.state.isPlacingDot = true;
        this.state.isSidebarOpen = false;
        this.showToast('请在屏幕点击打点');
        this.update();
      };
      const btnCopyMd = layer.querySelector('#btn-copy-md');
      if (btnCopyMd) btnCopyMd.onclick = () => this.copyAsMarkdown();
      layer.querySelectorAll('.lda-btn-del-hover').forEach(el => {
        el.onclick = () => {
          const id = parseInt(el.getAttribute('data-id'));
          const idx = this.state.comments.findIndex(c => c.id === id);
          if (idx !== -1) {
            this.state.comments.splice(idx, 1);
            this.persist();
            this.showToast('已删除');
            this.update();
          }
        };
      });
    }
  }

  compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxW = 1200;
        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  updateModal(force = false) {
    const layer = this.shadowRoot.getElementById('modal-layer');
    if (!this.state.showAddModal) {
      layer.innerHTML = '';
      return;
    }
    // Only re-render if empty to preserve input states/focus
    if (layer.innerHTML === '' || force) {
      const isEdit = this.state.editingId !== null;
      const indexDisplay = isEdit ? (this.state.comments.findIndex(c => c.id === this.state.editingId) + 1) : (this.state.comments.length + 1);
      layer.innerHTML = `
        <div class="lda-modal-mask">
          <div class="lda-modal">
            <div class="lda-modal-header">
              <div class="lda-modal-index">${indexDisplay}</div>
              <h3>${isEdit ? '编辑交互逻辑标点' : '建立交互逻辑标点'}</h3>
            </div>
            <div class="lda-modal-coords">
              <div>📍 标定 X 轴: <span>${this.state.tempXPercent.toFixed(1)}%</span></div>
              <div>📍 标定 Y 轴: <span>${this.state.tempYPercent.toFixed(1)}%</span></div>
            </div>
            <div class="lda-form-group">
              <label>交互控制点 (标题)</label>
              <input type="text" id="modal-title" placeholder="如: 解除绑定二次强校验机制" value="${this.state.newCommentTitle}" />
            </div>
            <div class="lda-form-group">
              <label>交互逻辑说明 (Case 规范格式)</label>
              <textarea id="modal-content" rows="4" placeholder="Case 1-1..."></textarea>
            </div>
            <div class="lda-form-group">
              <label>相关图片截图 (支持截图粘贴或点击上传)</label>
              <div class="lda-image-dropzone" id="modal-image-zone">
                ${this.state.newCommentImage ? `
                  <div class="lda-image-preview-wrapper">
                    <img src="${this.state.newCommentImage}" class="lda-image-preview" />
                    <button class="lda-btn-remove-image" id="btn-remove-image">✕ 删除图片</button>
                  </div>
                ` : `
                  <div class="lda-image-placeholder">
                    <span>📋 点击此区域上传图片，或在此窗口任意位置按 Ctrl+V / Cmd+V 粘贴截图</span>
                    <input type="file" id="modal-image-input" accept="image/*" style="display:none;" />
                  </div>
                `}
              </div>
            </div>
            <div class="lda-modal-footer">
              <button class="lda-btn-cancel" id="btn-modal-cancel">取消</button>
              <button class="lda-btn-submit" id="btn-modal-submit">保存标点</button>
            </div>
          </div>
        </div>
      `;
      layer.querySelector('#modal-content').value = this.state.newCommentContent;
      
      // Paste listener on the modal mask (so user can paste anywhere when the modal is open)
      const modalMask = layer.querySelector('.lda-modal-mask');
      modalMask.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            e.preventDefault();
            const file = item.getAsFile();
            this.compressImage(file, (base64) => {
              this.state.newCommentImage = base64;
              this.state.newCommentTitle = layer.querySelector('#modal-title').value;
              this.state.newCommentContent = layer.querySelector('#modal-content').value;
              this.updateModal(true);
            });
          }
        }
      });

      // Drag and drop / file input click support
      const zone = layer.querySelector('#modal-image-zone');
      if (zone) {
        zone.onclick = (e) => {
          if (e.target.id === 'btn-remove-image') return;
          const input = zone.querySelector('#modal-image-input');
          if (input) input.click();
        };
        
        const input = zone.querySelector('#modal-image-input');
        if (input) {
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              this.compressImage(file, (base64) => {
                this.state.newCommentImage = base64;
                this.state.newCommentTitle = layer.querySelector('#modal-title').value;
                this.state.newCommentContent = layer.querySelector('#modal-content').value;
                this.updateModal(true);
              });
            }
          };
        }
      }
      
      const btnRemoveImg = layer.querySelector('#btn-remove-image');
      if (btnRemoveImg) {
        btnRemoveImg.onclick = (e) => {
          e.stopPropagation();
          this.state.newCommentImage = '';
          this.state.newCommentTitle = layer.querySelector('#modal-title').value;
          this.state.newCommentContent = layer.querySelector('#modal-content').value;
          this.updateModal(true);
        };
      }

      layer.querySelector('#btn-modal-cancel').onclick = () => {
        this.state.showAddModal = false;
        this.state.editingId = null;
        this.state.newCommentImage = '';
        this.showToast('已取消');
        this.update();
      };
      layer.querySelector('#btn-modal-submit').onclick = () => {
        const title = layer.querySelector('#modal-title').value;
        const content = layer.querySelector('#modal-content').value;
        if (!title || !content) {
          this.showToast('⚠️ 标题与说明皆为必填项');
          return;
        }
        if (this.state.editingId !== null) {
          const idx = this.state.comments.findIndex(c => c.id === this.state.editingId);
          if (idx !== -1) {
            this.state.comments[idx].title = title;
            this.state.comments[idx].content = content;
            this.state.comments[idx].image = this.state.newCommentImage;
          }
        } else {
          this.state.comments.push({
            id: this.state.comments.length > 0 ? Math.max(...this.state.comments.map(c => c.id)) + 1 : 1,
            title, content,
            image: this.state.newCommentImage,
            xPercent: this.state.tempXPercent,
            yPercent: this.state.tempYPercent,
            scene: this.state.tempSceneName,
            selector: this.state.tempSelector
          });
        }
        this.state.showAddModal = false;
        this.state.editingId = null;
        this.state.newCommentImage = '';
        this.state.showAnnotateMode = true;
        this.persist();
        this.showToast('✅ 成功标定并写入内存');
        this.update();
      };
    }
  }
}

customElements.define('sase-annotation-panel', SaseAnnotationPanel);
