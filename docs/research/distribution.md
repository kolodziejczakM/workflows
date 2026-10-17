# Distributing the workflow bundle

This research preceded implementation. The current package and usage instructions are in the [README](../../README.md); observed checks are in [validation notes](../validation.md).

Research date: 2026-10-17. Source/documentation audit only; no installation, implementation or publication.

**Recommendation:** publish one reusable source catalog, with optional thin native plugin manifests over the same untouched skills. A GitHub repository is enough for installation from other application repositories; users need not clone it manually or submit it to an official directory first.

## Shared installation through Skills CLI

Once this catalog is implemented and published, an application repository can use the following command to fetch it and select skills. `OWNER` is a placeholder for the publisher's GitHub account:

```bash
npx skills add OWNER/workflows --agent codex cursor claude-code
```

Codex/Cursor use project `.agents/skills`; Claude Code can receive links to that canonical copy. `--skill` selects an agreed subset; `--yes` skips prompts. The installer copies selected directories, including internal supporting files; it does not resolve prose dependencies on other skills or install plugin-level agents. [Official CLI](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/README.md), [installer](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/installer.ts).

**Publishing-layout caveat:** the CLI discovers `.agents/skills`, but excludes agent-directory skills tracked in the *source repository's* `skills-lock.json`, treating them as installed dependencies rather than exported source. Therefore, blindly publishing this repo's installed `.agents/skills` plus its lockfile may export nothing. A dedicated `skills/` distribution catalog avoids that filter while still installing into consumers' shared `.agents/skills`. Preserve complete upstream directories and licenses. [Discovery filter](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/skills.ts).

## Optional Claude Code plugin

A repository with `.claude-plugin/marketplace.json` can host its own catalog. After publishing valid manifests, users can run:

```bash
claude plugin marketplace add OWNER/workflows
claude plugin install workflows@YOUR-MARKETPLACE
```

The marketplace name comes from its JSON, not necessarily the repository name. User-scope installation is available across projects; project scope is also supported. Your own marketplace requires no official-directory submission. [Hosting](https://code.claude.com/docs/en/plugins/host-marketplace), [install scopes](https://code.claude.com/docs/en/plugins/install), [publication](https://code.claude.com/docs/en/plugins/publish).

Native packaging can register skills, agents, hooks and MCP configuration together. Manifest paths must remain inside the plugin root; a `skills` path can reuse a contained catalog without editing its files. [Manifest](https://code.claude.com/docs/en/plugins-reference).

Plugin skills always gain a prefix, such as `/workflows:tdd`, and agents gain scoped names too. Consequently, unchanged Matt calls such as “Skill tool with tdd” and pstack's named agents need invocation tests; packaging alone does not establish runtime compatibility. This is a compatibility concern, not proof that every unqualified call fails. [Component naming](https://code.claude.com/docs/en/plugins/components).

Claude also supports declared plugin dependencies, including version constraints; cross-marketplace dependencies have an explicit allowlist. That can install other published plugins, but is distinct from Skills CLI installation or resolving instructions embedded in `SKILL.md`. [Dependency documentation](https://code.claude.com/docs/en/plugins/dependencies).

## Optional Codex plugin

Codex supports skill-only plugins and Git-backed marketplaces. Its current portable package uses root `plugin.json` and `skills/`; `.codex-plugin/plugin.json` remains a compatibility option. After configuring a marketplace, `codex plugin marketplace add OWNER/workflows` registers its source; follow the supported client install flow afterward. [Official OpenAI packaging documentation](https://developers.openai.com/plugins/build/plugins)

A public directory listing is a separate submission and review, not required for Git-backed marketplace distribution. Claude-only agents and settings are not automatically portable. [OpenAI submission guidance](https://developers.openai.com/plugins/guides/submit-claude-plugin)

## Redistribution permission

The audited [Matt license](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/LICENSE), [pstack license](https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/LICENSE), and [Emil license](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/LICENSE) are MIT. They permit redistribution, modification and sublicensing; retain each original copyright and permission notice with substantial copied material. Copyright holders are Matt Pocock, Lauren Tan and Emil Kowalski respectively. Describe your work as a curated integration and preserve existing attribution; do not imply you authored the imported skills. Platform directory submission requirements remain separate from license permission.

OpenAI's guidelines permit intellectual property you own or have permission to use and prohibit misleading presentation. MIT grants redistribution permission subject to its notice requirement; it does not guarantee directory approval. [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
