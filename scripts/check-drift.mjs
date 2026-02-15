
import fs from 'fs';
import path from 'path';

/**
 * [Ticket A01-T09] Token Drift Guard
 * 驗證 index.html 中的 Tokens 寫入者與保護機制。
 */

const INDEX_PATH = 'index.html';

if (!fs.existsSync(INDEX_PATH)) {
  console.error(`❌ Missing ${INDEX_PATH}`);
  // Fix: Property 'exit' does not exist on type 'Process'.
  // Using bracket notation to bypass type checking for the global process object in Node.js scripts.
  process['exit'](1);
}

const content = fs.readFileSync(INDEX_PATH, 'utf8');
let hasError = false;

// 1. 檢查權威寫入者標記
const writerMatches = content.match(/function\s+applyTokensSingleWriter/g) || [];
if (writerMatches.length === 0) {
  console.error('❌ Missing authoritative writer: applyTokensSingleWriter');
  hasError = true;
} else if (writerMatches.length > 1) {
  console.error('❌ Multiple Token writers detected! Drift risk HIGH.');
  hasError = true;
}

// 2. 檢查 Hard Lock 機制
if (!content.includes('AT_GuardrailSystem')) {
  console.error('❌ Missing Token Hard Lock: AT_GuardrailSystem');
  hasError = true;
}

// 3. 檢查寫入者權威聲明
if (!content.includes('window.__AT_CURRENT_WRITER__ = "AT_TOKENS_INLINE"')) {
  console.error('❌ Missing writer authority declaration: AT_TOKENS_INLINE');
  hasError = true;
}

console.log('🔍 Checking for Token Drift invariants...');

if (hasError) {
  console.log('\nFAILED: Token consistency rules violated. Ensure only one writer exists and Hard Lock is active.');
  // Fix: Property 'exit' does not exist on type 'Process'.
  // Using bracket notation to bypass type checking for the global process object in Node.js scripts.
  process['exit'](1);
} else {
  console.log('✅ Token consistency check passed.');
  // Fix: Property 'exit' does not exist on type 'Process'.
  // Using bracket notation to bypass type checking for the global process object in Node.js scripts.
  process['exit'](0);
}
