import path from 'path';
import fs from 'fs';
import { loadAnnotations, saveAnnotations, ensureAnnotations } from './annotation-data.js';

const vueFile = process.argv[2];
if (!vueFile) {
  console.error('请提供 .vue 文件路径');
  process.exit(1);
}

// 读取文件内容
let content = fs.readFileSync(vueFile, 'utf-8');

// 确保有注释块
ensureAnnotations(vueFile);

// 解析注释得到当前标注对象（用于后续可能的代码生成）
const annotations = loadAnnotations(vueFile);

// 1. 确保 import AnnotationPanel
if (!content.includes('import AnnotationPanel')) {
  // 通过 import.meta.url 获取当前脚本所在的目录
  const currentDir = new URL('.', import.meta.url).pathname;
  const panelPath = path.resolve(currentDir, 'annotation-panel.vue');
  const relativePath = path.relative(path.dirname(vueFile), panelPath).replace(/\\/g, '/');
  const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
  
  const importStatement = `import AnnotationPanel from '${importPath}';`;

  // 找到 <script> 部分并在其中插入 import
  const scriptTagMatch = content.match(/<script[^>]*>/);
  if (scriptTagMatch) {
    const insertPos = scriptTagMatch.index + scriptTagMatch[0].length;
    content = content.slice(0, insertPos) + '\n' + importStatement + content.slice(insertPos);
  } else {
    // 没有 <script>，则在文件顶端添加一个 script 块
    content = `<script setup>\n${importStatement}\n</script>\n` + content;
  }
}

// 2. 确保 components 注册 (仅在非 setup 脚本时需要)
const hasScriptSetup = /<script\s+setup[^>]*>/i.test(content);
if (!hasScriptSetup) {
  const componentsRegExp = /components\s*:\s*{[^}]*}/m;
  if (componentsRegExp.test(content)) {
    // 已有 components，加入 AnnotationPanel
    content = content.replace(componentsRegExp, (match) => {
      if (match.includes('AnnotationPanel')) return match; // 已包含
      return match.replace(/}/, '  AnnotationPanel,\n}');
    });
  } else {
    // 在 export default 中添加 components 块
    const exportDefaultMatch = content.match(/export\s+default\s*{[^}]*}/m);
    if (exportDefaultMatch) {
      const newExport = exportDefaultMatch[0].replace('{', `{\n  components: {\n    AnnotationPanel,\n  },`);
      content = content.replace(exportDefaultMatch[0], newExport);
    } else {
      // 如果没有 export default，添加一个最小的
      const scriptClose = content.indexOf('</script>');
      if (scriptClose !== -1) {
        const before = content.slice(0, scriptClose);
        const after = content.slice(scriptClose);
        const add = `\nexport default {\n  components: { AnnotationPanel }\n};\n`;
        content = before + add + after;
      }
    }
  }
}

// 3. 在 <template> 中插入 AnnotationPanel 作为覆盖层
const rootRelativePath = '/' + path.relative(process.cwd(), path.resolve(vueFile)).replace(/\\/g, '/');

if (!content.includes('<AnnotationPanel')) {
  const templateMatch = content.match(/<template[^>]*>/);
  if (templateMatch) {
    const insertPos = templateMatch.index + templateMatch[0].length;
    const panelMarkup = `\n  <AnnotationPanel :filePath="'${rootRelativePath}'" />\n`;
    content = content.slice(0, insertPos) + panelMarkup + content.slice(insertPos);
  } else {
    // 没有 template，创建一个最小模板
    const scriptClose = content.indexOf('</script>');
    const before = content.slice(0, scriptClose);
    const after = content.slice(scriptClose);
    const tmpl = `<template>\n  <AnnotationPanel :filePath="'${rootRelativePath}'" />\n</template>\n`;
    content = before + tmpl + after;
  }
} else {
  // 兼容老版本：如果已经注入过，强制将其绝对路径替换为相对路径
  content = content.replace(/<AnnotationPanel\s+:filePath="[^"]+"\s*\/>/g, `<AnnotationPanel :filePath="'${rootRelativePath}'" />`);
}

// 写回文件
fs.writeFileSync(vueFile, content, 'utf-8');
console.log('已成功注入 AnnotationPanel 到', vueFile);
