import { execSync } from 'node:child_process';
import { platform, arch } from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rollupNativePackage = '@rollup/rollup-linux-x64-gnu';

if (platform !== 'linux' || arch !== 'x64') {
  process.exit(0);
}

try {
  require.resolve(rollupNativePackage);
} catch {
  execSync(`npm install --no-save --ignore-scripts ${rollupNativePackage}`, {
    stdio: 'inherit'
  });
}
