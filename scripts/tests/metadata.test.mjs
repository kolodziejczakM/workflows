import assert from 'node:assert/strict';
import test from 'node:test';
import { readJson } from '../lib/bundle.mjs';
import { validatePlugin, validateSkill } from '../lib/validate-metadata.mjs';

test('portable schema accepts the manifest and rejects host-only fields and wrong types', async () => {
  const manifest = await readJson('plugin.json');
  validatePlugin(manifest);
  assert.throws(() => validatePlugin({ ...manifest, skills: './skills/' }), /Invalid portable plugin/);
  assert.throws(() => validatePlugin({ ...manifest, name: 123 }), /Invalid portable plugin/);
});

test('skill validation rejects malformed YAML, mismatched names and missing descriptions', () => {
  assert.throws(() => validateSkill('---\nname: [\n---\nBody', 'workflow'));
  assert.throws(() => validateSkill('---\nname: other\ndescription: Example\n---\nBody', 'workflow'));
  assert.throws(() => validateSkill('---\nname: workflow\n---\nBody', 'workflow'));
});
