import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = spawnSync(process.execPath, ['scripts/check-bundle.mjs'], { cwd: root, stdio: 'inherit' });
if (check.status !== 0) process.exit(check.status ?? 1);
const output = join(root, 'dist/workflows');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const path of ['skills', 'plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'upstreams.json', 'upstream-files.json']) {
  const target = join(output, path);
  await mkdir(join(target, '..'), { recursive: true });
  await cp(join(root, path), target, { recursive: true });
}
console.log(`Prepared plugin directory: ${output}`);
