import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, readJson, blobHash } from './lib/bundle.mjs';

const config = await readJson('upstreams.json');
const ledger = await readJson('upstream-files.json');
let checked = 0;
for (const source of config.sources) {
  const response = await fetch(`https://api.github.com/repos/${source.repository}/git/trees/${source.ref}?recursive=1`, {
    headers: { 'User-Agent': 'verified-ai-workflows' }
  });
  assert(response.ok, `GitHub tree fetch failed: ${source.repository} (${response.status})`);
  const tree = await response.json();
  assert(!tree.truncated, `Truncated tree: ${source.repository}`);
  const blobsByPath = new Map(tree.tree.filter((item) => item.type === 'blob').map((item) => [item.path, item.sha]));
  for (const [path, record] of Object.entries(ledger.files)) {
    if (record.repository !== source.repository || record.ref !== source.ref) continue;
    assert.equal(blobHash(await readFile(join(root, path))), blobsByPath.get(record.path), `Upstream mismatch: ${path}`);
    checked++;
  }
}
assert.equal(checked, Object.keys(ledger.files).length, 'Some imports have no configured upstream');
console.log(`PASS: ${checked} local files match freshly fetched pinned upstream Git trees.`);
