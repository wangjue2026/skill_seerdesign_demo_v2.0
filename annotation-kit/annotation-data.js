// annotation-data.js
// Utility functions to load and save annotation data stored as an inline JSON comment
// at the end of a .vue file: /*@annotations{...}@*/

import fs from 'fs';
import path from 'path';

/**
 * Extract the annotation JSON block from the given file content.
 * Returns an object (or empty object if not present).
 */
export function parseAnnotations(fileContent) {
  const regex = /\/\*@annotations\{([\s\S]*?)\}\@\*/;
  const match = fileContent.match(regex);
  if (!match) return {};
  try {
    return JSON.parse(`{${match[1]}}`);
  } catch (e) {
    console.error('Failed to parse annotation JSON:', e);
    return {};
  }
}

/**
 * Serialize annotations object into the inline comment block.
 */
export function serializeAnnotations(annotations) {
  const jsonString = JSON.stringify(annotations, null, 2);
  // Remove outer braces because we embed inside /*@annotations{...}@*/
  const inner = jsonString.replace(/^\{/, '').replace(/\}\s*$/,'');
  return `/*@annotations{${inner}}@*/`;
}

/**
 * Load annotations from a .vue file.
 * @param {string} filePath Absolute path to .vue file.
 * @returns {object} Annotations object.
 */
export function loadAnnotations(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseAnnotations(content);
}

/**
 * Save annotations back to the .vue file, preserving other content.
 * @param {string} filePath Absolute path to .vue file.
 * @param {object} annotations Annotations object to store.
 */
export function saveAnnotations(filePath, annotations) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Remove existing annotation block if present
  const cleanContent = content.replace(/\n?\/\*@annotations\{[\s\S]*?\}\@\*/, '');
  const annotationBlock = '\n' + serializeAnnotations(annotations);
  const newContent = cleanContent.trimEnd() + annotationBlock + '\n';
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

/**
 * Helper to ensure the annotation block exists (creates empty if missing).
 */
export function ensureAnnotations(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!/\/@annotations\{/.test(content)) {
    const newContent = content.trimEnd() + '\n' + serializeAnnotations({}) + '\n';
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
}
