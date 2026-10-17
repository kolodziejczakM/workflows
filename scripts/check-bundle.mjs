import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const json = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'));
const config = await json('upstreams.json');
const ledger = await json('upstream-files.json');
const lock = await json('skills-lock.json');

for (const [path, record] of Object.entries(ledger.files)) {
  const data = await readFile(join(root, path));
  assert.equal(createHash('sha256').update(data).digest('hex'), record.sha256, `${path} differs from its imported snapshot`);
  assert.equal(createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex'), record.gitBlob, `${path} differs from its upstream Git blob`);
  assert(config.sources.some((source) => source.repository === record.repository && source.ref === record.ref), `Unknown source: ${path}`);
}

const expected = ['workflow', ...config.sources.flatMap((source) => source.skills)].sort();
const actual = (await readdir(join(root, 'skills'), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual(actual, expected, 'Published skill catalog differs from the selected set');
assert(!Object.keys(ledger.files).some((path) => path.startsWith('skills/workflow/references/') && path.endsWith('/SKILL.md')), 'Reference-only support must not register additional skills');

for (const name of actual) {
  const path = join(root, 'skills', name, 'SKILL.md');
  const text = await readFile(path, 'utf8');
  assert.match(text, /^---\r?\n[\s\S]+?\r?\n---/, `Missing frontmatter: ${name}`);
  await access(join(dirname(path), name === 'workflow' ? 'LICENSE.txt' : 'UPSTREAM-LICENSE.txt'));
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    await access(resolve(dirname(path), target));
  }
}
const runtimePath = join(root, 'skills/workflow/references/runtime.md');
for (const match of (await readFile(runtimePath, 'utf8')).matchAll(/`(upstream\/[^`]+)`/g)) {
  await access(resolve(dirname(runtimePath), match[1]));
}

for (const source of config.sources) {
  for (const name of [...source.skills, ...(source.support ?? []).map((item) => item.name)]) {
    assert(Object.values(lock.skills).some((entry) => entry.source === source.repository
      && entry.ref === source.ref && entry.skillPath.split('/').at(-2) === name), `Missing pinned dependency: ${name}`);
  }
}

const packageInfo = await json('package.json');
for (const path of ['plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
  const manifest = await json(path);
  assert.equal(manifest.name, 'workflows');
  assert.equal(manifest.version, packageInfo.version);
  if (manifest.skills) assert.equal(manifest.skills, './skills/');
}
for (const path of ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json']) {
  const marketplace = await json(path);
  assert.equal(marketplace.name, 'kolodziejczak-workflows');
  assert.equal(marketplace.plugins[0].name, 'workflows');
  if (marketplace.plugins[0].version) assert.equal(marketplace.plugins[0].version, packageInfo.version);
  const pluginSource = marketplace.plugins[0].source;
  assert.equal(typeof pluginSource === 'string' ? pluginSource : pluginSource.path, './');
}
console.log(`PASS: ${actual.length} published skills, ${Object.keys(ledger.files).length} unchanged upstream files, local references, pinned dependencies, and plugin metadata.`);
