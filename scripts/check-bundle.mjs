import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { root, readJson, blobHash, sha256, findPinnedSkill } from './lib/bundle.mjs';
import { validatePlugin, validateSkill, validateOwnedSkill } from './lib/validate-metadata.mjs';

const config = await readJson('upstreams.json');
const ledger = await readJson('upstream-files.json');
const lock = await readJson('skills-lock.json');
const packageInfo = await readJson('package.json');
const localSkills = new Set(packageInfo.config.localSkills);
const thinkingSource = await readJson('docs/sources/thinking-framework.json');
assert.equal(sha256(await readFile(join(root, 'docs/sources', thinkingSource.file))), thinkingSource.sha256, 'Archived thinking-framework PDF differs from its recorded source');

for (const [path, record] of Object.entries(ledger.files)) {
  const data = await readFile(join(root, path));
  assert.equal(sha256(data), record.sha256, `${path} differs from its imported snapshot`);
  assert.equal(blobHash(data), record.gitBlob, `${path} differs from its recorded Git blob`);
  assert(config.sources.some((source) => source.repository === record.repository && source.ref === record.ref), `Unknown source: ${path}`);
}

const expected = [...localSkills, ...config.sources.flatMap((source) => source.skills)].sort();
const actual = (await readdir(join(root, 'skills'), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual(actual, expected, 'Published skill catalog differs from the selected set');
assert(!Object.keys(ledger.files).some((path) => path.startsWith('skills/workflow/references/') && path.endsWith('/SKILL.md')), 'Reference-only support must not register additional skills');

for (const name of actual) {
  const path = join(root, 'skills', name, 'SKILL.md');
  const text = await readFile(path, 'utf8');
  (localSkills.has(name) ? validateOwnedSkill : validateSkill)(text, name);
  await access(join(dirname(path), localSkills.has(name) ? 'LICENSE.txt' : 'UPSTREAM-LICENSE.txt'));
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
    assert(findPinnedSkill(lock, source, name), `Missing pinned dependency: ${name}`);
  }
}

for (const path of ['plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
  const manifest = await readJson(path);
  if (path === 'plugin.json') validatePlugin(manifest);
  assert.equal(manifest.name, 'workflows');
  assert.equal(manifest.version, packageInfo.version);
  if (manifest.skills) assert.equal(manifest.skills, './skills/');
}
for (const path of ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json']) {
  const marketplace = await readJson(path);
  assert.equal(marketplace.name, 'kolodziejczak-workflows');
  assert.equal(marketplace.plugins[0].name, 'workflows');
  if (marketplace.plugins[0].version) assert.equal(marketplace.plugins[0].version, packageInfo.version);
  const pluginSource = marketplace.plugins[0].source;
  assert.equal(typeof pluginSource === 'string' ? pluginSource : pluginSource.path, './');
}
console.log(`PASS: ${actual.length} published skills, ${Object.keys(ledger.files).length} files matching recorded upstream snapshots, local references, pinned dependencies, archived source identity, and plugin metadata.`);
