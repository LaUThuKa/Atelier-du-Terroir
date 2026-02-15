
import fs from 'fs';
import path from 'path';

/**
 * [Ticket A01-T09] Portable Code Guard
 * 掃描專案檔案，禁止使用 @/ 或 ~/ 等別名路徑，強制使用相對路徑。
 */

const FORBIDDEN_PATTERNS = [
  /from\s+['"]@\//,
  /from\s+['"]~\//,
  /import\(['"]@\//,
  /import\(['"]~\//
];

const IGNORE_DIRS = ['node_modules', 'dist', '.git', 'scripts', 'public'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let hasError = false;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  FORBIDDEN_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      console.error(`❌ Non-portable import found in: ${filePath}`);
      console.error(`   Pattern: ${pattern.toString()}`);
      hasError = true;
    }
  });
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        walk(fullPath);
      }
    } else if (EXTENSIONS.includes(path.extname(file))) {
      checkFile(fullPath);
    }
  });
}

console.log('🔍 Checking for non-portable imports...');
walk('.');

if (hasError) {
  console.log('\nFAILED: Alias imports (@/ or ~/) are forbidden. Use relative paths instead.');
  // Fix: Property 'exit' does not exist on type 'Process'.
  // Using bracket notation to bypass type checking for the global process object in Node.js scripts.
  process['exit'](1);
} else {
  console.log('✅ Portability check passed.');
  // Fix: Property 'exit' does not exist on type 'Process'.
  // Using bracket notation to bypass type checking for the global process object in Node.js scripts.
  process['exit'](0);
}
