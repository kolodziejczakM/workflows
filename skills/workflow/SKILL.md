---
name: workflow
description: Coordinate a requested Matt Pocock workflow with real application verification and relevant pstack or UI checks. Use when the user asks to run this workflow bundle, build a feature through its stages, or verify work already implemented.
---

# Verified workflow

Keep Matt's implementation flow and add proof of its output. Imported skill files remain untouched. Read [runtime.md](references/runtime.md) before delegating to an imported skill; it defines path, tool, namespace, and model resolution for this bundle.

## Select the route

| Mode | Run in order |
| --- | --- |
| `quick` | `implement`, then verification below. |
| `discuss` | `grill-me`, then `implement`, then verification. |
| `feature` | `grill-with-docs`, `to-spec`, `to-tickets`, `implement-spec`, then verification and a ready PR. |
| `build` | Read the supplied spec and tickets, run `implement-spec`, then verification and a ready PR. |
| `verify` | Verify the existing change without starting a planning or implementation flow. |

Use the requested mode. If no mode was supplied, choose `quick` for a clear task, `discuss` for unresolved requirements, or `feature` for a multi-session build, and state the choice. Ask for a task if none was given.

Load only the next stage's `SKILL.md`, follow it, and keep its user checkpoints. A user-invoked stage can be composed by reading its instructions when the native skill tool refuses invocation. Preserve the agreed behavior between stages. In `feature`, user confirmation during grilling, testing-seam confirmation, and ticket approval remain real gates. Continue after the answer; do not treat an unanswered question as approval.

## Ground the run in the client repository

The client is the application repository the user is working on. Keep its root separate from this skill's installed location. Run git, build, test, and app commands in the client, even when this bundle is installed globally or in a plugin cache.

Capture the starting revision, existing dirty files, relevant acceptance criteria, and a fixed review base before implementation. Use a supplied base when given; otherwise freeze the starting `HEAD`. For `verify`, use the supplied change range or determine the feature branch's merge-base with its actual target branch. If the range is ambiguous, ask rather than picking a range that omits the change.

In `feature` and `build`, creating/updating the task PR and pushing its branch are part of the requested route; proceed without a separate PR confirmation unless the user opts out. Follow the draft-to-ready lifecycle in the runtime adapter.

For a build route, run `setup-matt-pocock-skills` if the client's tracker/domain configuration is absent. Keep its confirmation steps. Reuse configured trackers, standards, glossary, and ADRs. PR publication follows the mode-specific scope above; merging, deploying, contacting people, and global configuration changes require their own authorization.

Carry the task, approved decisions, spec/ticket references, fixed base, current phase, and evidence paths across handoffs. Keep useful run notes in a task-specific directory under the client's `.scratch/workflow/`; keep that directory out of task commits unless the user wants an auditable artifact.

## Verify the integrated result

1. **Resolve the app verifier.** Look in the client for a `verify-*` skill with launch, health-check, drive, evidence, and cleanup instructions. Check `.agents/skills/`, plus existing `.cursor/skills/` or `.claude/skills/` locations. Reuse a suitable verifier; ask if several target different apps and the target is unclear.
2. **Bootstrap only when missing.** Once the actual app builds and starts, run `create-verification-skill` in the client. Set the output destination to the client's `.agents/skills/verify-<app>/` through the runtime adapter. Prefer its existing automation harness. The generated verifier must execute one mapped feature and retain evidence before it is usable. A missing credential, device, service, or working app is a specific blocker, not a reason to write imaginary selectors or claim a pass.
3. **Exercise acceptance criteria.** Run the verifier against the current app build and the changed user journeys. Include relevant regression paths and failure cases. Save the commands, revision, observed results, and evidence in the client. A screenshot proves visible state; persistence, network effects, CLI exit status, and other required behavior need their own observation.
4. **Check the final diff.** Confirm Matt's `code-review` covered the intended committed result and spec. Run it on the final committed range if it did not, or if accepted fixes changed that range. For `verify` with no spec, use the agreed acceptance criteria as an explicit local spec, or report the unavailable spec axis honestly. Resolve the review-before-commit case as described in the runtime adapter.
5. **Add relevant checks.** Use the table below, without repeating irrelevant reviews. Each selected check becomes a required gate for this run. Record why a check was selected or deliberately deferred.
6. **Repair and repeat.** Triage findings. In build modes, return accepted product fixes to `implement` with the original scope, then rerun affected tests, live proof, and review against the new revision. In `verify`, report findings and wait for a fix request. After two attempts fail for the same reason, report the evidence and blocker rather than loop unchanged; a user-supplied budget takes precedence.

| Condition | Additional check |
| --- | --- |
| Shared contracts, storage, dependency semantics, lifecycle, or downstream callers changed | `blast-radius`; prove its load-bearing safety fact by running code. |
| Substantial architecture change, contested design, security-sensitive behavior, or explicitly requested independent review | `interrogate`; pass the spec, fixed diff, standards, and evidence. Report actual reviewer models and any lost model diversity. |
| Data-rendering UI or responsive layout changed | `break-ui` with the concrete screen and acceptance criteria. Keep its design decisions for the user; run its dev-only fixtures through a real browser before counting visual behavior as proven. |
| Motion changed | `review-animations` on the changed motion; distinguish its code review from measured frame performance. |
| Verifier instructions or feature map drifted | `maintain-verification-skill`, scoped to the client's generated verifier. Product regressions remain product findings. |

If a selected check cannot run, mark that check blocked. Never substitute CSS inference for browser proof, a repeated model for a different model family, or a stand-in environment for an untested target without stating the limitation. Keep inferred findings separate from observed results.

## Finish

Before declaring verified, compare the current revision and working tree with the code actually exercised and reviewed. Refresh affected evidence after any intervening product edit, fixture change, merge, or rebase. Use a fresh launch where needed so a stale process cannot certify a newer build.

Report the final revision, each acceptance criterion and its evidence, selected review outcomes, and remaining blockers. Verified means every required check passed on the current result. Distinguish implementation completion, tracker state, and verification completion. Apply the runtime adapter so the task PR stays draft until this outer proof phase passes.

For `feature` and `build` with PR publication enabled, invoke `pr` after proof, update the task PR with real evidence, and mark it ready without asking for a separate confirmation. For other modes, prepare or publish a PR when requested. `retro` remains available after the session; do not run a second planning coordinator or edit upstream skills to record lessons.
