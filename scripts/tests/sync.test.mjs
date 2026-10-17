import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { access, cp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { root, blobHash, sha256 } from '../lib/bundle.mjs';
import { createFixture } from './fixtures.mjs';

async function syncFixture(t) {
  const { root: client, put } = await createFixture(t, 'workflow-sync-');
  await cp(join(root, 'scripts'), join(client, 'scripts'), { recursive: true });
  const source = { id: 'example', repository: 'example/skills', ref: 'a'.repeat(40), licensePath: 'LICENSE', skills: ['current'] };
  await put('upstreams.json', JSON.stringify({ sources: [source] }));
  await put('skills-lock.json', JSON.stringify({ skills: { current: { source: source.repository, ref: source.ref, skillPath: 'skills/current/SKILL.md' } } }));
  const skill = '---\nname: current\ndescription: Example\n---\nCurrent instructions\n';
  const license = 'Fixture license\n';
  await put('.agents/skills/current/SKILL.md', skill);
  await put('LICENSE', license);
  const owned = {
    'skills/current/SKILL.md': skill,
    'skills/retired/SKILL.md': 'old export',
    'skills/workflow/references/upstream/example/skills/retired/scripts/run.sh': 'old helper',
    'skills/custom-retired/INSTRUCTIONS.md': 'old instructions'
  };
  for (const [path, text] of Object.entries(owned)) await put(path, text);
  await put('skills/custom-retired/CUSTOM.md', 'user-owned');
  await put('upstream-files.json', JSON.stringify({ files: Object.fromEntries(Object.entries(owned).map(([path, text]) => [path, { sha256: sha256(text) }])) }));
  const tree = { tree: [
    { type: 'blob', path: 'skills/current/SKILL.md', sha: blobHash(skill), mode: '100644' },
    { type: 'blob', path: 'LICENSE', sha: blobHash(license), mode: '100644' }
  ] };
  await put('mock-sync.mjs', `
    globalThis.fetch = async (url) => new Response(url.includes('/git/trees/') ? ${JSON.stringify(JSON.stringify(tree))} : ${JSON.stringify(license)});
    process.argv.push('--installed');
    await import('./scripts/sync-skills.mjs');
  `);
  const run = () => spawnSync(process.execPath, ['mock-sync.mjs'], { cwd: client, encoding: 'utf8', timeout: 10000 });
  return { client, put, run };
}

test('sync retires deselected exports and support, preserves custom files, and rejects edited imports', async (t) => {
  const { client, put, run } = await syncFixture(t);
  const skill = await readFile(join(client, '.agents/skills/current/SKILL.md'), 'utf8');
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  await assert.rejects(access(join(client, 'skills/retired')), { code: 'ENOENT' });
  await assert.rejects(access(join(client, 'skills/workflow/references/upstream/example/skills/retired')), { code: 'ENOENT' });
  assert.equal(await readFile(join(client, 'skills/custom-retired/CUSTOM.md'), 'utf8'), 'user-owned');
  assert.equal(await readFile(join(client, 'skills/current/SKILL.md'), 'utf8'), skill);
  const ledger = await readFile(join(client, 'upstream-files.json'), 'utf8');
  assert(!ledger.includes('retired'));
  await put('skills/current/SKILL.md', 'local modification');
  const rejected = run();
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /Imported file changed/);
  assert.equal(await readFile(join(client, 'upstream-files.json'), 'utf8'), ledger);
  assert.equal(await readFile(join(client, 'skills/current/SKILL.md'), 'utf8'), 'local modification');
});

test('sync rejects out-of-catalog ledger paths before any publication or retirement', async (t) => {
  const { client, put, run } = await syncFixture(t);
  await put('KEEP.md', 'user-owned');
  const ledger = JSON.parse(await readFile(join(client, 'upstream-files.json'), 'utf8'));
  ledger.files['KEEP.md'] = { sha256: sha256('user-owned') };
  const recorded = JSON.stringify(ledger);
  await put('upstream-files.json', recorded);
  const before = new Map();
  for (const path of Object.keys(ledger.files)) before.set(path, await readFile(join(client, path), 'utf8'));
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside the skill catalog/);
  assert.equal(await readFile(join(client, 'upstream-files.json'), 'utf8'), recorded);
  for (const [path, data] of before) assert.equal(await readFile(join(client, path), 'utf8'), data);
  await assert.rejects(access(join(client, 'skills/current/UPSTREAM-LICENSE.txt')), { code: 'ENOENT' });
});
