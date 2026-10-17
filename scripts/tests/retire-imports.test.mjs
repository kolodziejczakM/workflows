import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { retireImports } from '../lib/retire-imports.mjs';
import { createFixture } from './fixtures.mjs';

for (const trailingSlash of ['', '/']) {
  test(`retirement preserves catalog and repository boundary (suffix ${JSON.stringify(trailingSlash)})`, async (t) => {
    const paths = ['skills/retired/SKILL.md', 'skills/retired/UPSTREAM-LICENSE.txt'];
    const { root } = await createFixture(t, 'workflow-retirement-', Object.fromEntries(paths.map((path) => [path, 'import'])));
    await retireImports(root + trailingSlash, paths, new Set());
    assert.deepEqual(await readdir(join(root, 'skills')), []);
    await access(root);
  });
}

test('retirement removes nested support, preserves replacements and custom files', async (t) => {
  const prefix = 'skills/workflow/references/upstream/example/skills/retired';
  const files = {
    [`${prefix}/INSTRUCTIONS.md`]: 'import',
    [`${prefix}/scripts/drive.sh`]: 'script',
    'skills/retired/SKILL.md': 'import',
    'skills/retired/CUSTOM.md': 'user-owned',
    'skills/current/SKILL.md': 'retained'
  };
  const { root } = await createFixture(t, 'workflow-retirement-', files);
  const owned = Object.keys(files).filter((path) => !path.endsWith('CUSTOM.md'));
  await retireImports(root, owned, new Set(['skills/current/SKILL.md']));
  await assert.rejects(access(join(root, prefix)), { code: 'ENOENT' });
  assert.equal(await readFile(join(root, 'skills/retired/CUSTOM.md'), 'utf8'), 'user-owned');
  assert.equal(await readFile(join(root, 'skills/current/SKILL.md'), 'utf8'), 'retained');
});

test('rejects paths outside the catalog before deleting any file', async (t) => {
  const { root } = await createFixture(t, 'workflow-retirement-', { 'skills/retired/SKILL.md': 'import', 'KEEP.md': 'user-owned' });
  await assert.rejects(retireImports(root, ['skills/retired/SKILL.md', 'KEEP.md'], new Set()), /outside the skill catalog/);
  assert.equal(await readFile(join(root, 'KEEP.md'), 'utf8'), 'user-owned');
  await access(join(root, 'skills/retired/SKILL.md'));
});
