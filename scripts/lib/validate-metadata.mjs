import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';
import { readJson } from './bundle.mjs';

const ajv = new Ajv2020({ allErrors: true });
const pluginSchema = ajv.compile(await readJson('scripts/schemas/plugin.schema.json'));

export function validatePlugin(manifest) {
  assert(pluginSchema(manifest), `Invalid portable plugin manifest: ${ajv.errorsText(pluginSchema.errors)}`);
}

export function validateSkill(text, directoryName) {
  const match = text.match(/^---\r?\n([\s\S]+?)\r?\n---(?:\r?\n|$)/);
  assert(match, `Missing frontmatter: ${directoryName}`);
  const metadata = parse(match[1]);
  assert(metadata && typeof metadata === 'object' && !Array.isArray(metadata), `Invalid frontmatter: ${directoryName}`);
  assert.equal(metadata.name, directoryName, `Skill name must match directory: ${directoryName}`);
  assert.match(metadata.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert(metadata.name.length <= 64, `Skill name too long: ${directoryName}`);
  assert(typeof metadata.description === 'string' && metadata.description.trim().length > 0
    && metadata.description.length <= 1024, `Invalid description: ${directoryName}`);
  if (directoryName === 'workflow') {
    const allowed = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata']);
    assert(Object.keys(metadata).every((key) => allowed.has(key)), 'Unexpected workflow frontmatter property');
    assert(!metadata.description.startsWith('[TODO:'), 'Unfinished workflow description');
  }
}
