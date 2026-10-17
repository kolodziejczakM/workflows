import { spawnSync } from 'node:child_process';
import { chmod, lstat, mkdir, readFile, readdir, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { root, readJson, blobHash, sha256, findPinnedSkill } from './lib/bundle.mjs';
import { retireImports } from './lib/retire-imports.mjs';

const config = await readJson('upstreams.json');
const ledgerPath = join(root, 'upstream-files.json');
const ledger = { version: 1, files: {} };
const staged = new Map();
const outputDirectories = new Set();
let previousFiles = {};

try {
  previousFiles = (await readJson('upstream-files.json')).files;
  for (const [path, record] of Object.entries(previousFiles)) {
    const current = await readFile(join(root, path));
    if (sha256(current) !== record.sha256) {
      throw new Error(`Imported file changed: ${path}. Restore it before syncing.`);
    }
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  if (error.path !== ledgerPath) throw error;
}

async function download(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'verified-ai-workflows' } });
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function filesIn(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(path));
    else if (entry.isFile()) result.push(path);
    else throw new Error(`Unexpected link or special file: ${path}`);
  }
  return result.sort();
}

function stageVerifiedImport(target, data, { source, sourcePath, blobsByPath }) {
  const expected = blobsByPath.get(sourcePath);
  if (!expected || blobHash(data) !== expected.sha) {
    throw new Error(`Upstream content mismatch: ${source.repository}/${sourcePath}`);
  }
  if (staged.has(target)) throw new Error(`Duplicate export destination: ${target}`);
  staged.set(target, { data, mode: expected.mode === '100755' ? 0o755 : 0o644 });
  ledger.files[target] = {
    repository: source.repository,
    ref: source.ref,
    path: sourcePath,
    gitBlob: expected.sha,
    sha256: sha256(data)
  };
}

const notices = ['# Third-party notices', '', 'The development-only Agent Plugins schema is Apache-2.0; see scripts/schemas/NOTICE.md and its accompanying license. It is not included in installed skills or the plugin directory.', '', 'Imported skill files retain their upstream contents. Original MIT notices are included in every exported skill and in the workflow support resources.', ''];

for (const source of config.sources) {
  const selections = [...source.skills, ...(source.support ?? []).map((item) => item.selection ?? item.name)];
  if (!process.argv.includes('--installed')) {
    const location = source.subpath
      ? `https://github.com/${source.repository}/tree/${source.ref}/${source.subpath}`
      : `${source.repository}#${source.ref}`;
    const result = spawnSync('npx', ['--yes', `skills@${config.cliVersion}`, 'add', location,
      '--skill', ...selections, '--agent', ...config.agents, '--yes'], {
      cwd: root, stdio: 'inherit', env: { ...process.env, DISABLE_TELEMETRY: '1' }
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Skills installation failed for ${source.id}`);
  }

  const lock = await readJson('skills-lock.json');
  const treeResponse = JSON.parse(await download(`https://api.github.com/repos/${source.repository}/git/trees/${source.ref}?recursive=1`));
  if (treeResponse.truncated) throw new Error(`Truncated source tree for ${source.id}`);
  const blobsByPath = new Map(treeResponse.tree.filter((entry) => entry.type === 'blob').map((entry) => [entry.path, entry]));
  const license = await download(`https://raw.githubusercontent.com/${source.repository}/${source.ref}/${source.licensePath}`);
  const entries = [...source.skills.map((name) => ({ name, exported: true })), ...(source.support ?? [])];

  for (const item of entries) {
    const installed = join(root, '.agents/skills', item.name);
    const lockEntry = findPinnedSkill(lock, source, item.name);
    if (!lockEntry) throw new Error(`Missing pinned Skills CLI installation: ${source.id}/${item.name}`);
    const upstreamDirectory = dirname(lockEntry.skillPath);
    const outputDirectory = item.exported ? `skills/${item.name}` : `skills/workflow/references/upstream/${source.id}/skills/${item.name}`;
    const installedFiles = item.files ? item.files.map((file) => join(installed, file)) : await filesIn(installed);
    outputDirectories.add(outputDirectory);
    for (const path of installedFiles) {
      const suffix = relative(installed, path).replaceAll('\\', '/');
      const sourcePath = `${upstreamDirectory}/${suffix}`;
      const filename = !item.exported && suffix === 'SKILL.md' ? 'INSTRUCTIONS.md' : suffix;
      stageVerifiedImport(`${outputDirectory}/${filename}`, await readFile(path), { source, sourcePath, blobsByPath });
    }
    stageVerifiedImport(`${outputDirectory}/UPSTREAM-LICENSE.txt`, license, { source, sourcePath: source.licensePath, blobsByPath });
  }

  for (const resource of source.resources ?? []) {
    const data = await download(`https://raw.githubusercontent.com/${source.repository}/${source.ref}/${resource.source}`);
    stageVerifiedImport(resource.target, data, { source, sourcePath: resource.source, blobsByPath });
  }
  const supportLicense = `skills/workflow/references/upstream/${source.id}/LICENSE.txt`;
  stageVerifiedImport(supportLicense, license, { source, sourcePath: source.licensePath, blobsByPath });
  notices.push(`## ${source.id}`, '', `Source: https://github.com/${source.repository}/tree/${source.ref}`, '', 'License: MIT. The full original notice follows.', '', license.toString('utf8').trim(), '');
}

// Publication begins only after all replacements have passed their upstream checks.
await retireImports(root, Object.keys(previousFiles), staged);
for (const directory of outputDirectories) {
  await rm(join(root, directory), { recursive: true, force: true });
}
for (const [target, { data, mode }] of staged) {
  const absolute = join(root, target);
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, data);
  await chmod(absolute, mode);
}
ledger.files = Object.fromEntries(Object.entries(ledger.files).sort(([left], [right]) => left.localeCompare(right)));
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
await writeFile(join(root, 'THIRD_PARTY_NOTICES.md'), `${notices.join('\n').trimEnd()}\n`);
await writeFile(join(root, 'skills/workflow/LICENSE.txt'), await readFile(join(root, 'LICENSE')));
for (const [path, target] of [
  ['.agents/skills/workflow', '../../skills/workflow'],
  ['.claude/skills/workflow', '../../.agents/skills/workflow']
]) {
  const absolute = join(root, path);
  try {
    const info = await lstat(absolute);
    if (!info.isSymbolicLink() || await readlink(absolute) !== target) {
      throw new Error(`Refusing to replace an existing custom workflow installation: ${path}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(dirname(absolute), { recursive: true });
    await symlink(target, absolute, 'dir');
  }
}
console.log(`Exported ${config.sources.flatMap((source) => source.skills).length} upstream skills; verified ${Object.keys(ledger.files).length} files against pinned Git blobs.`);
