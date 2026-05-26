import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const targetFile = process.argv[2];
if (!targetFile || !targetFile.endsWith('.html')) {
  console.error('请提供目标 .html 文件路径');
  process.exit(1);
}

// Ensure proper path resolution in ES modules
const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// 读取文件内容
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. 读取 JS 和 CSS 资源
const jsPath = path.join(currentDir, 'annotation-panel.js');
const cssPath = path.join(currentDir, 'annotation-panel.css');

if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
  console.error('找不到 annotation-panel.js 或 annotation-panel.css，请确保它们在 annotation-kit 目录中。');
  process.exit(1);
}

let jsCode = fs.readFileSync(jsPath, 'utf-8');
const cssCode = fs.readFileSync(cssPath, 'utf-8');

// 将 CSS 内联到 JS 的 Web Component shadowDOM 模板中
jsCode = jsCode.replace('/* CSS will be injected here by the tool */', cssCode);

// 2. 【第一步】先清理所有旧的数据块（在注入工具代码之前清理，避免误匹配）
// 用正则精确匹配 <script id="sase-annotations" ...>...</script>，包括跨行内容
// 注意：data block 使用 type="application/json"，不是普通 script，可以精确定位
content = content.replace(/<script\s+id="sase-annotations"[^>]*>[\s\S]*?<\/script>/g, '');

// 3. 【第二步】清理旧的工具代码块（在注释标记之间）
const INJECT_MARKER = '<!-- SASE Annotation Kit Start -->';
const END_MARKER = '<!-- SASE Annotation Kit End -->';

if (content.includes(INJECT_MARKER) && content.includes(END_MARKER)) {
  const startIdx = content.indexOf(INJECT_MARKER);
  const endIdx = content.indexOf(END_MARKER) + END_MARKER.length;
  content = content.slice(0, startIdx) + content.slice(endIdx);
}

// 4. 【第三步】注入新的工具代码（在 </body> 之前）
const injectBlock = `
${INJECT_MARKER}
<script>
${jsCode}
</script>
<sase-annotation-panel></sase-annotation-panel>
${END_MARKER}
`;

if (content.includes('</body>')) {
  content = content.replace('</body>', injectBlock + '\n</body>');
} else {
  content += '\n' + injectBlock;
}

// 5. 【第四步】插入新的空数据块（紧接在 </body> 之前，保证在工具元素之后）
// 重要：数据块必须在 </body> 之前，且在 <sase-annotation-panel> 之后，
// 这样 DOMContentLoaded 触发时才能被 querySelectorAll 查询到
const defaultData = { timestamp: 0, comments: [] };
const dataScript = `\n<script id="sase-annotations" type="application/json">\n${JSON.stringify(defaultData, null, 2)}\n</script>\n`;
if (content.includes('</body>')) {
  content = content.replace('</body>', dataScript + '</body>');
} else {
  content += dataScript;
}

// 写回文件
fs.writeFileSync(targetFile, content, 'utf-8');
console.log('✅ 已成功注入单文件原生 Annotation Kit 到', targetFile);
console.log('   注：该 HTML 文件现在已经包含完整的打标工具和样式，您可以直接发给任何人并在离线状态下查看！');
console.log('');
console.log('📋 使用说明：');
console.log('   1. 在浏览器中打开 HTML 文件，右下角出现悬浮控制台');
console.log('   2. 打标完成后 → 打开「🛠️ 控制台」→ 切到「💻 源码数据」→ 点击「📋 复制最新源码」');
console.log('   3. 在编辑器中找到文件底部 <script id="sase-annotations"> 区块，将整个区块替换为刚复制的内容');
console.log('   4. 保存文件后即可将 HTML 文件分享给任何人，标注内容将完整保留');
