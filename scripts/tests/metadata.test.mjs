import assert from 'node:assert/strict';
import test from 'node:test';
import { readJson } from '../lib/bundle.mjs';
import { validatePlugin, validateSkill, validateOwnedSkill } from '../lib/validate-metadata.mjs';

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

test('owned skill validation applies the same policy to each local workflow', async () => {
  const { config: { localSkills } } = await readJson('package.json');
  for (const name of localSkills) {
    validateOwnedSkill(`---\nname: ${name}\ndescription: A complete description\n---\nInstructions`, name);
    assert.throws(() => validateOwnedSkill(`---\nname: ${name}\ndescription: Complete\nunknown-field: true\n---\nInstructions`, name), /frontmatter property/);
  }
});

test('owned skill invocation control accepts booleans and rejects other YAML types', () => {
  const skill = (value) => `---\nname: think-through\ndescription: Work through a problem\ndisable-model-invocation: ${value}\n---\nInstructions`;
  for (const value of ['true', 'false']) validateOwnedSkill(skill(value), 'think-through');
  for (const value of ['"true"', 'null', '1', '[]', '{}']) {
    assert.throws(() => validateOwnedSkill(skill(value), 'think-through'), /expected a boolean/);
  }
});
