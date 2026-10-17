import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmod, lstat, mkdir, readFile, readdir, readlink, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(join(root, 'upstreams.json'), 'utf8'));
const ledgerPath = join(root, 'upstream-files.json');
const blobHash = (data) => createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const ledger = { version: 1, files: {} };
const staged = new Map();
const outputDirectories = new Set();

try {
  const previous = JSON.parse(await readFile(ledgerPath, 'utf8'));
  for (const [path, record] of Object.entries(previous.files)) {
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

async function save(target, data, source, sourcePath, tree) {
  const expected = tree.get(sourcePath);
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

const notices = ['# Third-party notices', '', 'Imported skill files retain their upstream contents. Original MIT notices are included in every exported skill and in the workflow support resources.', ''];

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

  const lock = JSON.parse(await readFile(join(root, 'skills-lock.json'), 'utf8'));
  const treeResponse = JSON.parse(await download(`https://api.github.com/repos/${source.repository}/git/trees/${source.ref}?recursive=1`));
  if (treeResponse.truncated) throw new Error(`Truncated source tree for ${source.id}`);
  const tree = new Map(treeResponse.tree.filter((entry) => entry.type === 'blob').map((entry) => [entry.path, entry]));
  const license = await download(`https://raw.githubusercontent.com/${source.repository}/${source.ref}/${source.licensePath}`);
  const entries = [...source.skills.map((name) => ({ name, exported: true })), ...(source.support ?? [])];

  for (const item of entries) {
    const installed = join(root, '.agents/skills', item.name);
    const lockEntry = Object.values(lock.skills).find((entry) => entry.source === source.repository
      && entry.ref === source.ref && entry.skillPath.split('/').at(-2) === item.name);
    if (!lockEntry) throw new Error(`Missing pinned Skills CLI installation: ${source.id}/${item.name}`);
    const upstreamDirectory = dirname(lockEntry.skillPath);
    const outputDirectory = item.exported ? `skills/${item.name}` : `skills/workflow/references/upstream/${source.id}/skills/${item.name}`;
    const installedFiles = item.files ? item.files.map((file) => join(installed, file)) : await filesIn(installed);
    const payloads = [];
    for (const path of installedFiles) {
      const suffix = relative(installed, path).replaceAll('\\', '/');
      const data = await readFile(path);
      const upstreamPath = `${upstreamDirectory}/${suffix}`;
      if (blobHash(data) !== tree.get(upstreamPath)?.sha) throw new Error(`Installed source mismatch: ${path}`);
      payloads.push({ suffix, data, upstreamPath });
    }
    outputDirectories.add(outputDirectory);
    for (const { suffix, data, upstreamPath } of payloads) {
      const filename = !item.exported && suffix === 'SKILL.md' ? 'INSTRUCTIONS.md' : suffix;
      await save(`${outputDirectory}/${filename}`, data, source, upstreamPath, tree);
    }
    await save(`${outputDirectory}/UPSTREAM-LICENSE.txt`, license, source, source.licensePath, tree);
  }

  for (const resource of source.resources ?? []) {
    const data = await download(`https://raw.githubusercontent.com/${source.repository}/${source.ref}/${resource.source}`);
    await save(resource.target, data, source, resource.source, tree);
  }
  const supportLicense = `skills/workflow/references/upstream/${source.id}/LICENSE.txt`;
  await save(supportLicense, license, source, source.licensePath, tree);
  notices.push(`## ${source.id}`, '', `Source: https://github.com/${source.repository}/tree/${source.ref}`, '', 'License: MIT. The full original notice follows.', '', license.toString('utf8').trim(), '');
}

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
await writeFile(join(root, 'THIRD_PARTY_NOTICES.md'), `${notices.join('\n')}\n`);
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
