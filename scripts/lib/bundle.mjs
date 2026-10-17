import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const readJson = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'));
export const sha256 = (data) => createHash('sha256').update(data).digest('hex');
export const blobHash = (data) => createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
export const findPinnedSkill = (lock, source, name) => Object.values(lock.skills).find((entry) =>
  entry.source === source.repository && entry.ref === source.ref && entry.skillPath.split('/').at(-2) === name);
