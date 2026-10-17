import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, readJson, blobHash } from './lib/bundle.mjs';
import { fetchPinnedBlobs } from './lib/upstream.mjs';

const config = await readJson('upstreams.json');
const ledger = await readJson('upstream-files.json');
let checked = 0;
for (const source of config.sources) {
  const blobsByPath = await fetchPinnedBlobs(source);
  for (const [path, record] of Object.entries(ledger.files)) {
    if (record.repository !== source.repository || record.ref !== source.ref) continue;
    assert.equal(blobHash(await readFile(join(root, path))), blobsByPath.get(record.path)?.sha, `Upstream mismatch: ${path}`);
    checked++;
  }
}
assert.equal(checked, Object.keys(ledger.files).length, 'Some imports have no configured upstream');
console.log(`PASS: ${checked} local files match freshly fetched pinned upstream Git trees.`);
