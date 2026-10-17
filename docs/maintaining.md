# Maintaining the bundle

`skills/` is the published catalog. `.agents/skills/` and `.claude/skills/` are ignored local installations. `upstreams.json` selects immutable upstream revisions and exports; `skills-lock.json` records the Skills CLI installations. `upstream-files.json` records the upstream Git blob and SHA-256 of each imported file.

Run with Node.js 22 or newer:

```bash
npm ci
npm test
npm run sync
npm run check
npm run pack:plugin
```

Sync installs the selected upstreams through the pinned Skills CLI, then exports unchanged content and original licenses. It downloads and checks all content against the pinned Git trees before replacing any published skill directory, so a failed fetch does not leave a partially updated catalog. The `--installed` argument skips installation while exporting already-installed snapshots. GitHub API access is required for sync. After `npm ci`, `npm run check` runs offline: it compares local files with the recorded ledger, parses skill YAML, and validates the portable manifest against the pinned Agent Plugins 1.0.0 schema. It does not re-establish upstream provenance. Use `npm run check:upstream` to compare actual file hashes with freshly fetched Git trees at the configured refs; this needs GitHub API access but does not install or rewrite anything. The custom workflow is linked into this repository's ignored local skill directories for development.

To update, change the relevant ref in `upstreams.json`, run sync, and review both source changes and workflow compatibility. Imported changes must come from upstream, never local edits to `skills/<upstream-name>/`. The preflight rejects modified or missing previously imported files. Retirement is confined to the `skills/` catalog, which remains present even if it becomes empty. Removing a selection retires only its ledger-owned files and empty directories; unexpected custom files are preserved and may require manual relocation before the catalog check can pass. Edit only the project-owned `skills/workflow/` instructions and adapter, outside its imported `references/upstream/` resources. Apply accepted improvements to the custom layer; request upstream changes separately if needed.

Pstack's supporting instructions are reference-only resources inside `workflow`, rather than a second registered planning coordinator. The `selection` override handles the upstream display name `Poteto Mode`; its `files` selection keeps only the required instructions and excludes its unrelated playbooks. These fields support an existing upstream difference. Their entry files are named `INSTRUCTIONS.md` in the bundle to avoid accidental recursive skill registration; their bytes remain identical to upstream `SKILL.md`, and the ledger records the original paths. The selected checks do not use pstack's `poteto-agent`, shipping playbooks, or external `cursor-team-kit`. If the selection expands, audit its new tool, file, and skill dependencies first.

Each exported upstream skill includes its original MIT notice because Skills CLI copies skill directories rather than the repository's root license. The workflow's bundled support resources include the same notices. Preserve existing source credits, including the credits embedded in Matt's PR skill.

Before publishing, bump the version consistently in `package.json`, all three plugin manifests, and the Claude marketplace entry; run the checks and test installation into a fresh client directory. For example:

```bash
npx --yes skills@1.7.2 add /absolute/path/to/workflows --skill '*' --agent codex cursor claude-code --yes
```

Run that command from an isolated client, not this source repository. Verify discovery, installed file contents, licenses, companion references, and Claude links. Use the generated plugin directory to test native hosts. JSON/manifest checks establish package structure, not successful end-to-end behavior in every agent runtime.

`dist/workflows/` is a self-contained plugin directory. `pack:plugin` prepares files only; GitHub publication, releases, and official marketplace submissions are separate actions. The client application's generated verifier and run evidence are created in the client, never in the published bundle.

The root portable `plugin.json` uses the standard fixed `skills/` directory. Its closed schema does not allow a `skills` field; the Claude/Codex compatibility manifests declare that host-specific path separately. The schema and Apache-2.0 license live under `scripts/schemas/`, with the pinned source in its notice. Validation dependencies and schema resources are development-only and are not copied into client skills.

`npm test` exercises the actual sync export/retirement pipeline (`--installed`) with deterministic network fixtures plus deletion-boundary and metadata validation regressions. CI runs these tests, the offline catalog/schema checks, and plugin packaging. Historical app-agent evaluations in `docs/validation.md` remain manual observations rather than CI coverage.
