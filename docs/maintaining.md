# Maintaining the bundle

`skills/` is the published catalog. `.agents/skills/` and `.claude/skills/` are ignored local installations. `upstreams.json` selects immutable upstream revisions and exports; `skills-lock.json` records the Skills CLI installations. `upstream-files.json` records the upstream Git blob and SHA-256 of each imported file.

Run with Node.js 22 or newer:

```bash
npm run sync
npm run check
npm run pack:plugin
```

Sync installs the selected upstreams through the pinned Skills CLI, then exports unchanged content and original licenses. It downloads and checks all content against the pinned Git trees before replacing any published skill directory, so a failed fetch does not leave a partially updated catalog. The `--installed` argument skips installation while exporting already-installed snapshots. GitHub API access is required for sync; `check` is offline. The custom workflow is linked into this repository's ignored local skill directories for development.

To update, change the relevant ref in `upstreams.json`, run sync, and review both source changes and workflow compatibility. Imported changes must come from upstream, never local edits to `skills/<upstream-name>/`. The preflight rejects modified or missing previously imported files. Edit only the project-owned `skills/workflow/` instructions and adapter, outside its imported `references/upstream/` resources. Apply accepted improvements to the custom layer; request upstream changes separately if needed.

Pstack's supporting instructions are reference-only resources inside `workflow`, rather than a second registered planning coordinator. Their entry files are named `INSTRUCTIONS.md` in the bundle to avoid accidental recursive skill registration; their bytes remain identical to upstream `SKILL.md`, and the ledger records the original paths. The selected checks do not use pstack's `poteto-agent`, shipping playbooks, or external `cursor-team-kit`. If the selection expands, audit its new tool, file, and skill dependencies first.

Each exported upstream skill includes its original MIT notice because Skills CLI copies skill directories rather than the repository's root license. The workflow's bundled support resources include the same notices. Preserve existing source credits, including the credits embedded in Matt's PR skill.

Before publishing, bump the version consistently in `package.json`, all three plugin manifests, and the Claude marketplace entry; run the checks and test installation into a fresh client directory. For example:

```bash
npx --yes skills@1.7.2 add /absolute/path/to/workflows --skill '*' --agent codex cursor claude-code --yes
```

Run that command from an isolated client, not this source repository. Verify discovery, installed file contents, licenses, companion references, and Claude links. Use the generated plugin directory to test native hosts. JSON/manifest checks establish package structure, not successful end-to-end behavior in every agent runtime.

`dist/workflows/` is a self-contained plugin directory. This task prepares files only; GitHub publication, releases, and official marketplace submissions are separate actions. The client application's generated verifier and run evidence are created in the client, never in the published bundle.
