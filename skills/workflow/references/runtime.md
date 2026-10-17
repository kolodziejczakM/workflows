# Runtime adapter for this bundle

These are local integration instructions. They select execution context and supported host tools without editing imported skill files.

## Two roots

`client_root` is the user's application checkout. `bundle_skills` is the parent of this `workflow` directory, which also contains `implement`, `interrogate`, and the other exported skills. Resolve both to absolute paths. If the user deliberately targets this bundle repository, use it as the client only for that requested maintenance task; do not generate an application verifier for an unrelated package.

Resolve a named exported skill to `bundle_skills/<name>/SKILL.md`. Read references relative to that skill's own directory. A native plugin may expose the same skill as `workflows:<name>`; use the installed plugin namespace, not an assumed global alias. If the native skill tool rejects a manual-only skill or is absent, read that file and follow the requested stage directly. Carry these integration instructions into implementer and reviewer briefs so nested calls resolve the same way.

## Tools and host capabilities

Map the requested operation to the host's available tool with the same purpose. Cursor's `Task` corresponds to Claude Code's `Agent` or Codex's subagent tools; map arguments to the actual schema rather than forwarding unsupported fields. Treat readonly review as a scope restriction even when the tool has no readonly field. Use supported worktree or branch isolation when the upstream stage needs independent writable workers. If that capability is absent, report it; do not claim `implement-spec` ran while silently using a different scheduler.

For Claude Code, consult the unchanged [pstack adapter](upstream/pstack/claude-code.md) for relevant tool/model mappings. For all hosts, read only the sections needed for the invoked check. Shell, tracker, browser, device, and model access come from the client runtime; installing this bundle does not supply them.

Use a configured and actually available model per role. Keep supported explicit model choices; omit the model argument to inherit when the host requires inheritance. The upstream defaults are not proof those model IDs exist in this host. Avoid selecting unavailable provider slugs or launching an external provider CLI without the user's configuration. If independent reviewers can run but only one model family is available, report the reduced diversity. If the request requires multiple families, that requirement remains blocked. Never label same-family reviews as multi-model-family proof.

## App verification output

For generated client verification skills, map pstack's `.cursor/skills/verify-<app>/` destination to `client_root/.agents/skills/verify-<app>/`. Pass that destination explicitly when composing the generator. The instructions and helpers it creates are client-owned output, not changes to this bundle or its imported source. Reuse existing client verifiers where they live instead of moving them unnecessarily. Add an agent-specific discovery link only if needed, without overwriting an existing client skill.

Verification commands execute in the client and use client-specific ports, state, and artifacts. Preserve proof through cleanup. Do not write runtime evidence inside an installed skill or plugin cache. `maintain-verification-skill` may edit the generated client verifier but not the imported generator or product code.

## UI stress-test fixtures

`break-ui` writes dev-only fixtures and a toggle even when it only reports findings. State these verification writes before running it. Prefer an existing harness or an isolated client checkout for the fixtures. A read-only request does not authorize changes to the client's product checkout; if the check needs writes and isolation is unavailable, report it blocked. Preserve evidence before removing task-owned temporary fixtures, and never overwrite or restore pre-existing dirty work. If a build retains new fixtures, include them in the final diff review and refresh proof after their integration.

## Review before commit

Matt's `implement` requests `code-review` before its final commit, while that reviewer uses a committed `base...HEAD` range. When a nested review reaches this situation, preserve the client's unrelated changes and ensure the task result has a task-scoped checkpoint commit before invoking the unchanged reviewer, provided committing this work is already authorized by the chosen implementation flow. Give it the frozen base and spec explicitly. Otherwise report why a committed review cannot run; do not pretend it covered working-tree or untracked changes. Verify mode itself does not grant permission to commit a user's existing work.

After accepted review fixes, ensure the new intended result is committed where required and review the updated range. This is an execution-order adapter; both upstream files remain byte-for-byte unchanged. Check the final dirty-tree status so later uncommitted changes cannot inherit an earlier verdict.

## Reference-only pstack support

The following upstream resources are packaged inside this skill, outside discovery as independent coordinators. Resolve their names here when a selected check references them. Read only the named section when one is specified; the rest of that file does not activate a workflow.

| Reference | Location relative to this directory | Read when |
| --- | --- | --- |
| `why` | `upstream/pstack/skills/why/INSTRUCTIONS.md` | `blast-radius` needs **Step 2. Establish the Code Anchor**, not the full investigation. |
| Epistemics | `upstream/pstack/skills/why/references/epistemics.md` | Assessing blast-radius evidence, confidence, or unknowns. |
| `unslop` | `upstream/pstack/skills/unslop/INSTRUCTIONS.md` | A routed check requests prose cleanup. |
| `poteto-mode` | `upstream/pstack/skills/poteto-mode/INSTRUCTIONS.md` | **Subagents** section only, for role selection; do not activate its coordinator, playbooks, or global triggers. |
| `arena` | `upstream/pstack/skills/arena/INSTRUCTIONS.md` | The wide-change branch of `blast-radius` requires competing independent candidates. |
| Shared-state principle | `upstream/pstack/skills/principle-separate-before-serializing-shared-state/INSTRUCTIONS.md` | Arena needs isolated writable outputs. |
| Redesign principle | `upstream/pstack/skills/principle-redesign-from-first-principles/INSTRUCTIONS.md` | Arena synthesizes candidates. |
| Laziness principle | `upstream/pstack/skills/principle-laziness-protocol/INSTRUCTIONS.md` | Arena compares equivalent designs. |
| Proof principle | `upstream/pstack/skills/principle-prove-it-works/INSTRUCTIONS.md` | A routed artifact needs direct verification. |
| `show-me-your-work` | `upstream/pstack/skills/show-me-your-work/INSTRUCTIONS.md` | Large work calls for an auditable decision trail. |
| Structural lessons | `upstream/pstack/skills/principle-encode-lessons-in-structure/INSTRUCTIONS.md` | The trail or review identifies repeated mistakes. |

This selected verification path does not use `poteto-agent`, Bugbot, `/deslop`, `/no-comments`, or pstack's PR/shipping playbooks. It does not require registering those agents or installing their unrelated plugins. If the user explicitly requests a wider pstack workflow, resolve its separate dependencies before running it.
