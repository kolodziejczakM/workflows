export async function download(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'verified-ai-workflows' } });
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function fetchPinnedBlobs(source) {
  const tree = JSON.parse(await download(`https://api.github.com/repos/${source.repository}/git/trees/${source.ref}?recursive=1`));
  if (tree.truncated) throw new Error(`Truncated source tree for ${source.repository}`);
  return new Map(tree.tree.filter((entry) => entry.type === 'blob').map((entry) => [entry.path, entry]));
}
