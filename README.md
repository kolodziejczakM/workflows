# Verified AI workflows

Matt Pocock workflows followed by proof in the running application, with relevant pstack risk/review and Emil Kowalski UI checks. Upstream files stay unchanged.

## Install in your application repository

Once this bundle is merged into the default branch, run from the **client application repository**:

```bash
npx --yes skills@1.7.2 add kolodziejczakM/workflows --skill '*' --agent codex cursor claude-code --yes
```

Installs all required skills into `.agents/skills/`, with Claude Code links. No manual clone needed. Private repositories require GitHub access through your configured Git credentials. Keep only your runtimes in the command, then start a new agent session.

## Typical workflows

In Codex, use the examples below. In Claude Code or Cursor, replace `$workflow` with `/workflow`.

| Task | Invocation | Runs |
| --- | --- | --- |
| Small, clear change | `$workflow quick Add JSON output to the export command` | `implement` → verify |
| Discuss before coding | `$workflow discuss Add bulk archive` | `grill-me` → `implement` → verify |
| Larger feature | `$workflow feature Add team invitations` | `grill-with-docs` → `to-spec` → `to-tickets` → `implement-spec` → verify |
| Build approved tickets | `$workflow build Implement the spec at docs/specs/invitations.md` | `implement-spec` → verify |
| Check existing work | `$workflow verify Check this branch against main and its spec` | Verify and report findings; no automatic product fixes |

The first build runs Matt's setup for the client's tracker and domain docs. Planning preserves his decision and approval checkpoints.

Verification reuses or creates the **client's** `verify-<app>` skill, exercises acceptance criteria, reviews the final diff, and selects relevant extra checks. Build routes fix accepted findings and reverify. Missing tools or model diversity are reported, never counted as passes.

You can keep using Matt's skills individually, then run `$workflow verify`. Use `$pr` after proof or `$retro` after the session. Publishing and merging require authorization.

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

`npm run check` checks integrity and packaging. Update refs in `upstreams.json`, run `npm run sync`, and review the diff. `npm run pack:plugin` builds `dist/workflows/`.

See [maintenance](docs/maintaining.md), [source research](docs/research/ai-workflow.md), and [third-party notices](THIRD_PARTY_NOTICES.md). The custom glue is MIT; imported skills retain their original licenses and credits.
