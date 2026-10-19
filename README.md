# AI workflows for thinking and building

Two independent entry points: `think-through` helps you choose and apply thinking tools; `workflow` combines Matt Pocock coding flows with real application proof and relevant pstack/Emil checks. Upstream files stay unchanged.

## Install in a repository

Run from the repository where you want the skills:

```bash
npx --yes skills@1.7.2 add kolodziejczakM/workflows --skill '*' --agent codex cursor claude-code --yes
```

Installs all required skills into `.agents/skills/`, with Claude Code links. No manual clone needed. Private repositories require GitHub access through your configured Git credentials. Keep only your runtimes in the command, then start a new agent session.

## Think through a problem

```text
$think-through I am choosing between moving closer to work and keeping more space. Help me work through the tradeoffs.
```

It identifies what blocks your answer, recommends a tool/strategy, explains why the closest alternatives fit less well, and starts applying it. It covers understanding, explanations, estimates/forecasts, and decisions, adding analogy, systems thinking, premortems, or Bayesian updating when useful. Each completed exercise records a conclusion, key assumption, next step, and when to check the result.

This is an English adaptation of your thinking-tools framework; the [original PDF](docs/sources/thinking-framework-2026-10-19.pdf) is archived for source audits and excluded from installed skills. It works in chat without Matt/pstack setup and does not start coding or create a PR. You can install it alone by replacing `--skill '*'` with `--skill think-through` above. Use `/think-through` in Claude Code/Cursor, or `/workflows:think-through` with the Claude plugin.

## Coding workflows

In Codex, use the examples below. In Claude Code or Cursor, replace `$workflow` with `/workflow`.

| Task | Invocation | Runs |
| --- | --- | --- |
| Small, clear change | `$workflow quick Add JSON output to the export command` | `implement` → verify |
| Discuss before coding | `$workflow discuss Add bulk archive` | `grill-me` → `implement` → verify |
| Larger feature | `$workflow feature Add team invitations` | `grill-with-docs` → `to-spec` → `to-tickets` → `implement-spec` → verify → ready PR |
| Build approved tickets | `$workflow build Implement the spec at docs/specs/invitations.md` | `implement-spec` → verify → ready PR |
| Check existing work | `$workflow verify Check this branch against main and its spec` | Verify and report findings; no automatic product fixes |

The first build runs Matt's setup for the client's tracker and domain docs. Planning preserves his decision and approval checkpoints.

Verification reuses or creates the **client's** `verify-<app>` skill, exercises acceptance criteria, reviews the final diff, and selects relevant extra checks. Build routes fix accepted findings and reverify. Missing tools or model diversity are reported, never counted as passes.

`feature` and `build` automatically push the task branch and create or update a PR, without a separate confirmation. The PR stays draft during implementation and becomes ready after verification passes. Say "local only" or "no PR" to opt out; unavailable Git hosting access is reported as a blocker.

You can keep using Matt's skills individually, then run `$workflow verify`. In other modes, request a PR or use `$pr` after proof. Use `$retro` after the session. Merging and deployment require separate authorization.

## Native plugins, optional

Native manifests share the same catalog. Choose one installation method per runtime. Skills CLI installation is smoke-tested; native hosts have not all been exercised.

```bash
# Claude Code, after publication
claude plugin marketplace add kolodziejczakM/workflows
claude plugin install workflows@kolodziejczak-workflows

# Codex, after publication
codex plugin marketplace add kolodziejczakM/workflows
codex plugin add workflows@kolodziejczak-workflows
```

Claude plugins use `/workflows:workflow quick ...`; select the qualified skill in other plugin hosts. Multi-family review requires host support.

## Maintain this bundle

`npm ci` installs development tools. `npm test` runs regressions; `npm run check` checks recorded snapshots and metadata offline. `npm run check:upstream` verifies against pinned GitHub trees. Update refs in `upstreams.json`, run `npm run sync`, and review the diff. `npm run pack:plugin` builds `dist/workflows/`.

See [maintenance](docs/maintaining.md), [source research](docs/research/ai-workflow.md), and [third-party notices](THIRD_PARTY_NOTICES.md). The custom glue is MIT; imported skills retain their original licenses and credits.
