import { rmdir, unlink } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export async function retireImports(root, previousPaths, replacementPaths) {
  const catalogRoot = resolve(root, 'skills');
  const retired = previousPaths.filter((path) => !replacementPaths.has(path)).map((path) => resolve(root, path));
  for (const absolute of retired) {
    const path = relative(catalogRoot, absolute);
    if (!path || path === '..' || path.startsWith('../') || isAbsolute(path)) {
      throw new Error(`Imported path is outside the skill catalog: ${absolute}`);
    }
  }
  for (const absolute of retired) {
    await unlink(absolute);
    let directory = dirname(absolute);
    while (directory !== catalogRoot) {
      try {
        await rmdir(directory);
      } catch (error) {
        if (error.code === 'ENOTEMPTY' || error.code === 'ENOENT') break;
        throw error;
      }
      directory = dirname(directory);
    }
  }
}
