# Research: an end-to-end workflow from Matt Pocock, pstack, and Emil Kowalski

This research preceded implementation. See the [README](../../README.md) for the prepared bundle and [validation notes](../validation.md) for the checks actually performed.

Researched on 17 October 2026. This is a source audit and workflow recommendation, not an execution benchmark. Recommendations below are my synthesis; linked descriptions of upstream behavior come from the inspected source. No skills were installed or executed, and no tracker, PR, or account configuration was changed.

## Decision, revised around your existing workflows

Keep upstream skill files completely untouched. Matt remains the owner of requirements, planning, ticket decomposition, implementation, and his existing review. Add an independent verification phase after the selected Matt flow. Do not replace these workflows with `poteto-mode`, add another scheduler, or maintain patches to imported instructions.

| Existing workflow to preserve | Add after implementation |
| --- | --- |
| `implement` | Runtime verification of the changed behavior; relevant risk/UI checks; repair and reverify. |
| `grill-me` in chat → `implement` | The same verification phase, with the agreed behavior passed from chat. |
| `grill-with-docs` → `to-spec` → `to-tickets` → `implement-spec` | Verify the integrated application against the spec and acceptance criteria, then run relevant risk/UI checks and reverify accepted fixes. |

This is an additive integration recommendation. The upstream implementation stages retain their own behavior; the local workflow's definition of completion adds current proof. A future user-owned `verify-change` entry point could provide the same ending for all three flows, with a distinct name and files that the upstream installer does not own. Start with explicit invocation so the useful checks and costs are visible before making it automatic.

### Initial selection

| Purpose | Selection | Role |
| --- | --- | --- |
| Existing workflow | Your chosen Matt skills and their referenced support skills/files | Keep as the foundation. His TDD and test execution are already automated verification; the missing guarantee is live user-path proof. [Implement][m-implement], [Matt TDD](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md) |
| Bootstrap runtime verification | Pstack `create-verification-skill` | Run in each client application repository once its app is runnable, generating and actually exercising that client's `verify-<app>`. This repository packages the reusable workflow; app-specific verification belongs to the client. [Source][p-create] |
| Runtime proof on each change | The generated project-owned `verify-<app>` | Launch the app, exercise acceptance outcomes, retain evidence, and report blocked checks honestly. The generator is not the per-change verifier. [Generated contract][p-create] |
| Keep the verifier accurate | Pstack `maintain-verification-skill` | Maintain the generated skill and feature map as the app changes. Editing this project-owned output is separate from editing imported upstream files. [Source][p-maintain] |
| Prove downstream safety | Pstack `blast-radius` | Add for shared contracts, storage, dependencies, lifecycle, or other nonlocal risks. It requires executable proof of the important safety assumption. [Source][p-blast] |
| Independent adversarial/architecture review | Pstack `interrogate` | Add for substantial or risky changes when the host can supply the configured models. It includes a structural/code-quality lens and returns findings rather than applying fixes. [Skill][p-interrogate], [quality lens](https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/interrogate/references/code-quality-review.md) |
| UI robustness | Emil `break-ui` | Add for changed UI with realistic edge-case data, and require runtime evidence for a proof verdict. [Source][e-break] |
| Motion quality | Emil `review-animations` | Add only when motion changes. It enriches review, not functional end-to-end proof. [Source](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/review-animations/SKILL.md) |

Keep `how`, `why`, `architect`, `arena`, `correct`, and full `poteto-mode` out of the mandatory extension. They can be useful on demand or required as referenced support, but a second planning or execution flow does not address the primary gap. The `prove-it-works` principle is useful guidance, not a standalone runtime harness. Supporting imports must be checked before installation; the table above describes capabilities, not a complete dependency manifest. [Proof principle][p-prove], [pstack dependency notes][p-readme]

### Where `codebase-design` fits

`codebase-design` is a shared design reference for modules, interfaces, depth, seams, and testability. Matt's `tdd` explicitly consults it when the interface or seam is unclear, calling it a reference rather than a session to run. Matt's `code-review` does not explicitly invoke it, although its Standards axis already checks several architectural smells. Therefore “review ran” does not establish that a dedicated deep-module audit happened. [Design reference](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/codebase-design/SKILL.md), [TDD](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md), [review][m-review]

For a module-shape concern, pass the relevant design reference as context to an explicitly requested review. For an independent architecture-quality opinion, use the selected adversarial review. Neither substitutes for running the app. That division preserves Matt's flow while covering design quality, downstream risk, and observed behavior separately.

There is no evidence here that a particular combination maximizes value on your projects. The source supports this selection; compare failures caught, model cost, elapsed time, and intervention rate on representative tasks before making expensive panels mandatory.

## Source snapshots and scope

I resolved `main` through the GitHub API and read raw files at these exact revisions. Cached GitHub directory pages omitted newer skills, so their listings were not used as the final inventory.

| Source | Inspected commit | Commit timestamp, UTC | Scope |
| --- | --- | --- | --- |
| Matt Pocock | [`49dd158d1076134a641b33efb035946536778336`](https://github.com/mattpocock/skills/commit/49dd158d1076134a641b33efb035946536778336) | 2026-10-09 10:56:49 | Current inventory, relevant skill bodies, supporting configuration and references, license |
| Cursor / pstack | [`101b274dd991f694e1f7024be2157e5f3adf07de`](https://github.com/cursor/plugins/commit/101b274dd991f694e1f7024be2157e5f3adf07de) | 2026-10-17 04:28:27 | `pstack/` source, 54 skill entry files, relevant playbooks/references, host adapter, license |
| Emil Kowalski | [`2d228630ba1446365f614a108cb8252f1feda202`](https://github.com/emilkowalski/skills/commit/2d228630ba1446365f614a108cb8252f1feda202) | 2026-10-11 13:58:32 | Current inventory, UI stress/design/motion instructions and references, license |

The pstack snapshot declares version `0.15.25`. Its README describes the author's everyday use, but that is not an independent effectiveness comparison. At the start of this audit, this repository contained a placeholder README and a commit-format rule, with no application or runtime harness to exercise. Accordingly, a real application verification skill cannot be validated here yet. [pstack metadata][p-plugin], [pstack README][p-readme]

## 1. Value of your proposed stages

| Proposed stage | Assessment | Recommended treatment |
| --- | --- | --- |
| `how` + `why` | Complementary, but `why` is an extensive investigation, normally querying every available evidence category. | `how` for unfamiliar affected code; `why` for defensive behavior, regressions, ownership changes, or unexplained constraints. Reuse useful findings. [How][p-how], [why][p-why] |
| `grilling` | Valuable decision discovery; current Matt guidance offers a better repository-level entry. | `grill-with-docs` for substantial ambiguous work. Product choices go to the human; observable facts should be researched or prototyped. [Matt router][m-ask], [pstack mode][p-mode] |
| `to-spec` | Useful durable intent, with a real test-seam confirmation step. | Use for substantial work, ensuring agreed runtime outcomes and test seams are captured. It is not strictly a zero-interaction summarizer. [Spec][m-spec] |
| `to-tickets` | Useful for multi-session work; includes an approval round and dependency graph. | Skip for work that fits one focused session. Use vertical slices normally and its special migration rules when appropriate. [Tickets][m-tickets] |
| `implement` | Already invokes TDD where possible, typechecking/tests, review, and commit. | Keep the upstream flow. Run runtime verification afterwards; confirm review covers the final committed result. Use your existing `implement-spec` path for a ticket graph. [Implement][m-implement], [coordinator][m-implement-spec] |
| Verify + prove | Essential, but a principle is not a runnable harness. | Bootstrap `verify-<app>` first; exercise relevant acceptance scenarios after the chosen flow, retain evidence, then maintain the feature map as the app changes. [Generator][p-create], [proof principle][p-prove], [maintenance][p-maintain] |
| `code-review` + `blast-radius` | Good complementary checks; does not fully capture pstack's review across different models. | Keep standards/spec review, add `interrogate` based on risk, and demand executable evidence for important downstream assumptions. [Matt review][m-review], [interrogate][p-interrogate], [blast radius][p-blast] |
| `pr` + `unslop` | Compatible as evidence shaping plus prose editing. Matt's current `pr` is already proof-oriented. | Preserve all evidence and risk content while tightening language. Choose one PR template. [Matt router's PR description][m-ask], [unslop][p-unslop] |
| `retro` + `correct` | More overlap than the initial description suggests. Matt's retro already calls for deterministic enforcement of mechanical mistakes. | `retro` identifies environment improvements; `correct` implements recurring mistake prevention when justified. Do not automatically run two full retrospectives on every change. [Retro][m-retro], [correct][p-correct] |

These checks emphasize different questions, but their coverage overlaps. For example, `interrogate` already asks reviewers to examine surrounding code and root causes beyond changed files. `blast-radius` earns its place by requiring a focused executable safety proof, rather than by being the only review that can inspect downstream behavior. [Interrogate rubric](https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/interrogate/references/rubric.md), [blast radius][p-blast]

Decide whether “end to end” finishes at an open PR, merge-ready, or merged. Your proposed stages finish at PR preparation. If you want merge-ready, add a CI/review-feedback loop that fixes real findings and refreshes affected proof. Pstack already provides **Babysit** for this and a separate **Shipping** playbook for independently verifying and landing changes. Its own rules make merging a separately authorized action. [Babysit][p-babysit], [shipping][p-shipping]

### High-value pstack omissions

| Addition | Why it earns consideration | When to use it |
| --- | --- | --- |
| `create-verification-skill` | Generates launch, health check, driving, evidence, cleanup, and a feature map, then must execute one mapped feature successfully. | Once per application without a usable equivalent. [Source][p-create] |
| `maintain-verification-skill` | Checks all feature files from source and live behavior; reports product defects without changing product code to make documentation pass. | On relevant app/harness changes or a chosen maintenance schedule. It is upkeep, not the ordinary per-ticket product verifier. [Source][p-maintain] |
| `interrogate` | Independent reviewers on configured models, a shared rubric, and a lead verdict. It explicitly does not auto-apply changes. | Substantial or risky changes, especially to obtain the model diversity you value. [Source][p-interrogate] |
| `architect` / `arena` | Explores competing designs, compares interface depth, synthesizes a sketch. | Difficult module or concurrency boundaries. `architect` defaults to implementation after sketching; explicitly request its checkpoint if planning must stop there. [Architect][p-architect], [arena][p-arena] |
| `setup-pstack` | Configures available models and reasoning budget per role. | Native Cursor setup, before relying on hardcoded model defaults. Available model names in source are not a guarantee of entitlement or support in another host. [Source][p-setup] |
| `show-me-your-work` | Produces a reviewable decision trail with evidence. | Long or unattended work, where a session summary is insufficient. [Source][p-trail] |
| `benchmark-checklist` | Checks whether a measured improvement is valid and matters to the end-to-end task. | Performance work, not every feature. [Source][p-benchmark] |
| `swarm` | Coordinates coverage partitions and requires exact SHAs/method for verification reports. | Independent checks with isolated state. It is not intrinsically a panel of different model families. [Source][p-swarm] |
| Babysit / Shipping playbooks | Cover CI/review follow-up to merge-ready and independent verification before landing. | Only if your definition of completion includes those phases; retain one owner for branch/PR state. [Babysit][p-babysit], [shipping][p-shipping] |

`reflect` overlaps with retrospective work but edits skills after approval; its workflow also files backlog items. `automate-me` helps derive a personal mode from repeated working habits and already favors references over copying other skills. They are useful later, rather than mandatory delivery stages. [Reflect][p-reflect], [automate me][p-automate]

I would leave `no-comments`, the general prose/personality skills, all 24 principle files as always-loaded policy, `make-bot-ui`, and the large autonomous programs out of the default route. This is a cost/scope recommendation, not a claim that they lack value. `no-comments` is an active editing workflow that can invoke architecture work, not a neutral final formatting pass. Adopt its policy deliberately if it matches your standards. [Mode and principles][p-mode], [no comments][p-no-comments], [inventory][p-inventory]

## 2. Combining them without editing upstream files

**Yes: preserve Matt's flows and add verification after they return.** No patches to upstream skill files are part of the selected design. Several conflicts below arise only when two entire workflows are activated together, which the revised selection avoids. Host capabilities and referenced dependencies still need checking; installing unchanged text does not supply missing tools or models.

| Integration issue | What the source actually does | Required resolution |
| --- | --- | --- |
| Review can miss newly written code | Matt `implement` asks for review before its final commit. Matt `code-review` scopes `git diff <fixed-point>...HEAD`, which excludes working-tree/index changes and refuses an empty diff. | Keep both source files untouched. After implementation, confirm the final committed change was reviewed against the intended fixed base and spec. If not, invoke the existing `code-review` again on that committed result. If the internal review stops before the flow completes, report that integration failure; do not silently declare it reviewed or patch the imported reviewer. This is a source-derived failure mode, not a reproduced agent execution. [Implement][m-implement], [review][m-review] |
| Duplicate review | `implement` reviews per ticket; `implement-spec` reviews the integrated branch once. | Define per-slice checks versus integration review. Do not automatically repeat the same review over an unchanged diff. [Implement][m-implement], [coordinator][m-implement-spec] |
| Different coordinators | Matt's integration-branch task graph differs from pstack's worktree, stacked PR, and playbook ownership rules. | Matt owns implementation and integration. Selected pstack skills own scoped verification or review only. Do not activate the full pstack feature/shipping flow over the same work. [Matt coordinator][m-implement-spec], [pstack feature][p-feature], [opening a PR][p-opening] |
| Draft/ready conflict | Matt `implement-spec` may open an early draft and later mark it ready. Pstack's opening playbook requires ready PRs and forbids drafts. | Keep Matt's lifecycle and leave pstack's PR-opening playbook inactive. An additive verifier cannot retroactively prevent Matt from marking ready or resolving tickets. Track verification completion separately. If strict proof-before-ready is later required, it needs an explicit external execution gate; it is not provided by merely appending another skill. [Matt coordinator][m-implement-spec], [pstack opening][p-opening] |
| Planning approval versus autonomy | Matt confirms test seams and ticket breakdown; pstack favors experiments and proceeding on reversible work. | Preserve explicit user decision gates, and record decisions already made so they need not be asked twice. State publication/merge authority in your integration policy. [Spec][m-spec], [tickets][m-tickets], [mode][p-mode] |
| Migration policy conflict | Matt prescribes expand-contract for wide refactors; pstack calls for migrating callers and deleting the old internal API in the same wave. | Retain Matt's planning policy. Select pstack proof/review skills without activating its migration principle as a competing implementation mandate. If an architectural alternative is raised during review, judge it against the actual consumers and deployment constraints. [Tickets][m-tickets], [migration principle][p-migrate] |
| Native tools and paths | pstack uses Cursor `Task`, subagent types, `.cursor` paths, model rules, and sometimes cloud agents. Its supplied Claude Code adapter maps tools/paths but drops unsupported model families and does not load `.mdc` model configuration. | Use the native host or an explicit host adapter. The inspected tree provides a Claude adapter, and I found no bundled Codex-specific adapter. Mapping everything to the parent model loses model diversity; report that honestly. [Claude adapter][p-claude], [setup][p-setup], [repository tree](https://api.github.com/repos/cursor/plugins/git/trees/101b274dd991f694e1f7024be2157e5f3adf07de?recursive=1) |
| Supporting dependencies | Full `poteto-mode` requires `/deslop`, `control-ui`/`control-cli` from `cursor-team-kit`, Cursor's built-in skill authoring, and bundled agents/reference files. Selected checks also reference other pstack instructions. | Install and check the support actually used by the selected skills; do not assume the Skills CLI resolves those dependencies. Keeping a support skill available does not mean activating its entire workflow. The verifier generator prefers an existing application harness. [README dependency list][p-readme], [mode][p-mode], [generator][p-create] |
| Review does not mean repair | `interrogate` produces a verdict without automatic application; Matt review reports two axes separately. | Triage findings explicitly, return accepted fixes to the existing implementation flow, and rerun affected proof. The local verification entry point owns the report and completion condition, not a second implementation scheduler. [Interrogate][p-interrogate], [Matt review][m-review] |
| Skill discovery and collisions | Many pstack skills disable automatic model invocation. Both packages contain `tdd`, and prototype/teaching names also overlap across these sources. | Keep one selected implementation of each overlapping skill or use host-supported qualified names. The coordinator must explicitly invoke/read manual-only skills. Preserve relative references. [pstack TDD][p-tdd], [Matt router][m-ask], [pstack README][p-readme] |

The full mode also carries side effects and policies beyond your list: broad external-action autonomy, comment cleanup, commit restructuring, and PR publication. Those are reasons to leave that mode inactive and invoke the selected verification skills instead. Imported instructions remain subordinate to the user's authorization and host restrictions. [Mode][p-mode], [opening a PR][p-opening]

### Minimum handoff contract

This is a recommended local contract, not an upstream format you must adopt. Persist it somewhere each worker can read:

| Handoff | Required information |
| --- | --- |
| Context → decisions | Affected subsystem; cited constraints; open questions; what is fact versus inference. |
| Decisions → spec | Agreed behavior, exclusions, test seams, observable acceptance outcomes, unresolved decisions. |
| Spec → slice | Spec/ticket identifier; blockers; acceptance outcomes; integration base; owned files/state. |
| Slice → proof | Exact revision, or explicit dirty-tree identity; commands and environment; exercised user path; pass predicates; artifact paths; gaps. |
| Proof → review | Fixed base and head; spec; standards; proof artifacts; known limitations. |
| Review → repair | Actionable finding; disposition; changed scope; which checks must be repeated. |
| Ready → PR | Current final head; successful applicable checks; outstanding risks; publication authority. |

Pin proof and review to the final relevant code state. A review-driven code edit invalidates affected earlier evidence; refresh it before declaring ready. Multiple models agreeing is useful review signal, but executable checks remain the gate.

## 3. On demand or orchestrated?

**Keep your three existing entry paths. Begin by invoking verification explicitly after any of them.** Once the useful checks are clear, a small user-owned `verify-change` entry point can select the right checks and consolidate their evidence. It should not replace `implement` or `implement-spec`, repeat the requirements interview, or copy upstream skill contents.

Recommended local responsibility:

1. Read the agreed behavior or spec, the implementation's final revision, and available runtime verifier.
2. Exercise relevant acceptance paths using `verify-<app>`.
3. Add `blast-radius` for nonlocal safety assumptions; `interrogate` for substantial independent review; Emil checks for relevant UI/motion changes.
4. Report observed passes, failures, and blocked checks with evidence.
5. Route accepted product fixes back through the existing Matt implementation flow, then reverify. Keep all imported source files untouched.

These are proposed responsibilities for future local glue, not a skill implemented in this research task. Matt's `ask-matt` remains available if you want help choosing among his flows; there is no need to add another whole-flow router now. [Matt router][m-ask]

An additive verification ending checks the final integrated result. It does not automatically introduce runtime proof at every internal `implement-spec` ticket boundary or prevent that skill's own PR-ready/ticket-resolution actions. The source audit's per-slice proof recommendation remains a possible later improvement, but claiming it is enforced without a real integration mechanism would be misleading. [Matt coordinator][m-implement-spec]

Compare the extension on a small bug, a UI feature, and an API or persistence change before making every optional panel mandatory. Record defects caught, false positives, elapsed time, model cost, and human intervention. The pstack eval playbook provides useful discipline about blinded comparisons and checking actual artifacts rather than self-reports; using it is optional, not a new prerequisite. [Eval playbook][p-eval]

## 4. UI verification additions

The detailed source findings below cover Emil's useful UI additions and their limits. The practical UI recommendation is `break-ui` plus selective design/motion checks, backed by the application verifier. Neither a design rubric nor a screenshot alone establishes functional end-to-end correctness.

These skills provide domain-specific craft judgment and some concrete stress procedures. They do not collectively supply a browser driver, deterministic test runner, CI integration, or general acceptance-test harness. That distinction follows inspection of their workflows and bundled files, rather than a claim that runtime testing cannot be added around them. [Complete inventory](https://api.github.com/repos/emilkowalski/skills/git/trees/2d228630ba1446365f614a108cb8252f1feda202?recursive=1), [README](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/README.md).

| Skill | Best addition to this workflow | Evidence limitations / integration requirements |
| --- | --- | --- |
| `break-ui` | Highest-value verification addition for data-heavy UI. Maps rendered fields to schema/API limits; injects realistic worst-case fixtures through the real data boundary; adds a dev-only toggle covering empty/single/huge datasets. Checks actual container width, 320px, widest layout, 200% zoom, and supported dark/RTL states. | Browser screenshots are conditional: it permits CSS reasoning when browser tooling is absent, provided inferred and visually verified findings are distinguished. Therefore require runtime artifacts in the local verification contract before accepting it as proof. Default behavior reports then stops; `<component> + fix` applies fixes that need no design decision. Preserve fixtures and keep the toggle out of production. [Skill](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/break-ui/SKILL.md), [catalog](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/break-ui/CATALOG.md). |
| `review-animations` | Specialist diff review for motion changes: purpose/frequency, easing, timing, origin, interruptibility, performance risks, reduced motion and hover gating; returns findings and an explicit Block/Approve verdict. | It reviews motion code and craft; it does not require every finding to come from a running browser. Keep its verdict separate from functional acceptance and measured frame performance. Include `STANDARDS.md` when importing. [Skill](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/review-animations/SKILL.md), [standards](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/review-animations/STANDARDS.md). |
| `animation-performance` | Conditional diagnosis for measured jank or motion under load; asks for DevTools performance/animation recordings and profiling on a real mid-range phone. | Code inspection is not device measurement. The report distinguishes code verification from a needed device recording and stops before applying fixes unless asked. Provide recording/device access or leave that portion explicitly unverified. [Source](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/animation-performance/SKILL.md). |
| `mobile-native` | Conditional checklist and implementation guidance for mobile web/PWA viewport, input, touch, scroll, safe-area, and browser-chrome behavior. | Explicitly requires hardware testing before calling the work done; reports which changes still need a phone. Desktop viewport emulation cannot satisfy its own contract. [Source](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/mobile-native/SKILL.md). |
| `emil-design-eng` | Broad implementation/reference layer for visual and interaction quality. | Large overlap with the more specific animation skills. Load relevant guidance when building UI; avoid a redundant whole-library review every time. Its required review format is a Before/After/Why table, not an executable acceptance test. [Source](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/emil-design-eng/SKILL.md). |
| `improve-animations` | Optional whole-codebase audit and self-contained improvement plans, useful before a dedicated motion cleanup. | Default workflow analyzes and writes plans, not application source changes; its `execute <plan>` variant delegates to an executor worktree then reviews. Usually overlaps planning work already handled by the main workflow. [Source](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/improve-animations/SKILL.md). |

Recommended initial addition: **`break-ui` for relevant changed screens, `review-animations` for changed motion**. Add `animation-performance` only for performance scope/signals, and `mobile-native` when mobile web is supported. Do not call all four an unconditional proof gate.

Concrete local UI evidence contract, as a recommendation: identify the acceptance criterion and fixture; run the real affected route at named viewport/input settings; assert the user-visible result; capture screenshot/recording plus console/network failures; record source revision and run command; distinguish observed success, observed failure, and checks that could not run. A screenshot supports visual state, not automatically interaction correctness, persistence, keyboard access, or performance. Keep the general functional verification loop as the authority for “works”; use these skills to enrich what it checks. `break-ui` permits props, mocks, and API stubs for component stress cases. Those are useful component checks; separately exercise the full application path to prove wiring, storage, and real boundary behavior. [Break UI][e-break], [verification evidence rules][p-create]

### Complete Emil inventory and duplication

The pinned tree has **15** skills: `animate`, `animate-expo`, `animation-performance`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `break-ui`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `prototype`, `review-animations`, `write-swift`. [Inventory](https://api.github.com/repos/emilkowalski/skills/git/trees/2d228630ba1446365f614a108cb8252f1feda202?recursive=1).

The remaining skills are implementation/design aids rather than generic verification: `animate` for web motion; `animate-expo` for React Native/Expo; `animation-vocabulary` for naming; `apple-design` for interface/motion principles; `ask-sonner` for Sonner integration; `find-animation-opportunities` for proposals; `pick-ui-library` for dependency selection; `prototype` for alternate UI directions; `write-swift` for Swift. Keep them on demand for their stacks and concerns. [Collection reference](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/README.md), [source directory](https://github.com/emilkowalski/skills/tree/2d228630ba1446365f614a108cb8252f1feda202/skills).

There is an exact name collision: both Matt and Emil publish **`prototype`**. Matt retains the prototype on a separate branch as a primary source and points to it from the implementation issue; Emil defaults to deleting the isolated prototype surface after the chosen variant is promoted. Select one for a task or namespace both, and explicitly choose artifact retention. Blindly enabling both is ambiguous. [Matt contract](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/prototype/SKILL.md), [Emil contract](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/prototype/SKILL.md).

Many Emil skills have an initial-response rule: when invoked without a concrete question, they only announce readiness and wait. A workflow should invoke them with the component/diff/task and expected evidence, not merely the skill name. Some are explicitly manual-invocation skills. Those behaviors are important for avoiding a stalled automatic handoff. [Examples: break-ui](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/break-ui/SKILL.md), [review-animations](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/review-animations/SKILL.md), [prototype](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/prototype/SKILL.md).

## 5. Matt setup and complete inventory

### Setup and host requirements

`setup-matt-pocock-skills` is an omitted prerequisite. It confirms the tracker, optional triage labels, and domain layout; drafts local configuration for review before editing the existing `AGENTS.md`/`CLAUDE.md` and `docs/agents/`. GitHub uses `gh`, GitLab uses `glab`, local markdown is supported, and other trackers are recorded as prose instructions. Remote tracker credentials/capabilities are therefore conditional dependencies, not a universal requirement. [Setup](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/SKILL.md), [local tracker template](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/setup-matt-pocock-skills/issue-tracker-local.md).

Engineering stage skills are intentionally user-invoked: Claude metadata uses `disable-model-invocation: true`, and corresponding Codex metadata uses `policy.allow_implicit_invocation: false`. Model-invoked references and reviews are distinguished in the engineering catalog. An entry point must explicitly load/delegate the selected skills using its host's mechanism; plain prose references do not supply a missing Skill tool, subagent facility, issue tracker, browser, or worktree capability. [Catalog](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/README.md), [Codex example](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/agents/openai.yaml).

`implement-spec` is the existing build orchestrator worth evaluating before writing another: it creates an integration branch, dispatches implementer subagents in separate worktrees over the ready ticket frontier, uses merger subagents, reviews the integration result, opens a draft PR where tracker closure needs one, then marks it ready or resolves tickets and cleans up worktrees. This is materially more autonomy than `implement`. Keep it as your existing robust workflow, then verify the integrated result separately. Its own ready/issue-resolution actions do not wait for a verifier appended afterwards; the local workflow must distinguish those actions from verification completion. [Source](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md).

### Complete Matt inventory and selection

The pinned tree contains **38** `SKILL.md` files: 20 engineering, 7 productivity, 4 misc, 7 in-progress; the deprecated bucket has none. Counts are computed from the [recursive source tree](https://api.github.com/repos/mattpocock/skills/git/trees/49dd158d1076134a641b33efb035946536778336?recursive=1). The following classification is a recommendation, not an upstream guarantee of quality.

| Bucket / selection | Exact skill names | Recommended treatment |
| --- | --- | --- |
| Engineering: proposed core | `to-spec`, `to-tickets`, `implement`, `tdd`, `code-review`, `pr`, `retro` | Retain with the conditional routing and contract corrections above. |
| Engineering: setup/router | `setup-matt-pocock-skills`, `ask-matt` | Highest-value omissions: configure once; reuse the router as the basis for a mixed-library entry point. |
| Engineering: planning foundation | `grill-with-docs`, `domain-modeling`, `codebase-design` | Prefer the repo-aware grill wrapper; include the references it invokes. |
| Engineering: alternate execution | `implement-spec` | Optional orchestrator for large ticket graphs; do not run it and `implement` as independent owners of the same tickets. |
| Engineering: conditional investigation | `diagnosing-bugs`, `research`, `prototype` | Use for hard bugs, external factual uncertainty, and runnable design questions respectively. |
| Engineering: conditional intake/scale | `triage`, `wayfinder`, `improve-codebase-architecture`, `wizard` | Incoming raw issues; efforts too large to plan in one session; architecture exploration; steps only a human can perform. Avoid making these universal stages. |
| Productivity: interview | `grilling`, `grill-me` | `grilling` is the primitive used by `grill-with-docs`; `grill-me` is the stateless non-repository wrapper. |
| Productivity: context/support | `handoff`, `writing-for-agents`, `to-questionnaire`, `wait-what`, `teach` | Preserve handoffs when crossing sessions/hosts; include `writing-for-agents` because `retro` invokes it. Others are situational, not delivery stages. |
| Misc | `git-guardrails-claude-code`, `migrate-to-shoehorn`, `scaffold-exercises`, `setup-pre-commit` | Host- or project-specific utilities. `setup-pre-commit` can provide a missing guardrail, but its Husky/lint-staged choices are not a universal stack. |
| In-progress | `chief-of-staff`, `claude-handoff`, `loop-me`, `setup-ts-deep-modules`, `writing-beats`, `writing-fragments`, `writing-shape` | Exclude from the initial stable core. The bucket explicitly warns these are beta, omitted from the plugin, and may change or disappear; evaluate individually only for a demonstrated need. |

Sources for catalog purposes: [engineering](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/engineering), [productivity](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/productivity), [misc](https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/misc), [beta policy](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/in-progress/README.md). The beta README does not list `chief-of-staff`, but the pinned tree contains it; the inventory above follows source files.

The current Matt `tdd` body puts refactoring in review rather than the red-to-green loop, and requires agreed test seams. Its `pr` body asks for a useful visual, before/after evidence, and merge danger. Those are relevant refinements to the initial stage descriptions. [TDD source](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md), [PR source](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/pr/SKILL.md)

## 6. License findings

Matt and Emil contain root **MIT** licenses at the pinned revisions: Matt's copyright is 2026 Matt Pocock; Emil's is 2026 Emil Kowalski. Both grant use/copy/modify/distribute rights and require retaining the copyright and permission notice in copies or substantial portions. If vendoring or adapting skills, retain the respective complete license/attribution rather than only writing “MIT” in a README. [Matt license](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/LICENSE), [Emil license](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/LICENSE).

The recursive trees expose no nested files with “license” in the path at these snapshots. This is a repository inspection finding, not a legal opinion about every external URL or referenced dependency. Matt's current `pr` also embeds credits to Dex Horthy / Humanlayer's `show-me`; preserve that existing provenance when copying the file. [Matt tree](https://api.github.com/repos/mattpocock/skills/git/trees/49dd158d1076134a641b33efb035946536778336?recursive=1), [Emil tree](https://api.github.com/repos/emilkowalski/skills/git/trees/2d228630ba1446365f614a108cb8252f1feda202?recursive=1), [PR credits](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/pr/SKILL.md).

Pstack is also **MIT** under its own `pstack/LICENSE`, copyright 2026 Lauren Tan, corroborated by `pstack/plugin.json`. This is the relevant package license within the larger Cursor plugins monorepo. Retain its full copyright and permission notice when copying or adapting substantial portions. [Pstack license](https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/LICENSE), [package metadata][p-plugin].

### Import and maintenance recommendation

Keep imported skill files untouched. Use the Skills CLI for project-local installation after selecting the skills and target agents, retain its project lockfile, and preserve upstream licenses separately where the CLI does not copy them. Keep any new verification entry point and app-specific generated verifier under distinct user-owned names. Check needed companion skills, support files, and agents before considering installation complete. Review updates and rerun a representative verification task afterwards. This is a maintenance recommendation, not an additional license requirement.

## 7. Local installation with Skills CLI

This section reflects the user's clarified preference: **keep upstream skill files untouched, retain Matt's existing flows, select skills first, install later through `npx skills add`**. No `npx` command or installation was executed during this research.

The official CLI source was audited at [`13e4063a1cf913f5606d57d42ab83a86f5001e04`](https://github.com/vercel-labs/skills/commit/13e4063a1cf913f5606d57d42ab83a86f5001e04), dated 2026-10-09. The [npm registry](https://registry.npmjs.org/skills/latest) reported published version **1.7.2**, Git revision `671e8c320810d36fed80fac5f1a2c1bf7e82d812`; main differs only in README, agent configuration and its test, so the installation/parser/lock/update implementations examined match that release. [Comparison](https://github.com/vercel-labs/skills/compare/671e8c320810d36fed80fac5f1a2c1bf7e82d812...13e4063a1cf913f5606d57d42ab83a86f5001e04).

### Scope, selection and discovery

Publishing clarification: `.agents/skills/` below is the client installation location. Export the bundle from a source `skills/` catalog; the CLI can exclude source-repository agent-directory dependencies tracked by its lockfile. See the concise [distribution note](distribution.md) for source packaging and native plugin options.

The selected approach is a shared, project-local `.agents/skills/` installation supporting several runtimes. Initial targets are Codex, Cursor, and Claude Code. Use the CLI's canonical-copy/symlink mode, with `.claude/skills/<name>` pointing to the shared copy where required. Keep project-owned verification skills under distinct names in the shared directory, outside imported skill directories, and retain `skills-lock.json`. No installation has occurred yet. This records the user's multi-runtime preference; the initial three targets are an implementation assumption based on the runtimes discussed. [Agent paths](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/agents.ts), [canonical-copy and linking behavior](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/src/installer.ts).

Shared discovery does not make every skill's execution requirements portable. Pstack's multi-model tools, named agents, paths, and rules still need checking separately for each target. Any host-specific integration belongs outside the untouched upstream files. [Pstack's supplied host adapter][p-claude]

Project installation is the default: omit `--global`/`-g`. Supported flags include `--skill`/`-s` for explicit skill names, `--agent`/`-a` for host selection, `--list`/`-l` for discovery without installing, `--yes`/`-y` to skip prompts, and `--copy` for independent copies. Avoid `--all` while choosing the set. The CLI targets Codex and Cursor project skills at `.agents/skills/`; Claude Code uses `.claude/skills/` directly or links to the canonical `.agents/skills/` copy. Use shared copies and links for the selected setup. [Official options](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/README.md), [flag parser](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/add.ts), [agent paths](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/agents.ts).

The following are **future discovery commands**, not actions taken or a chosen installation set:

```bash
npx skills@1.7.2 add 'mattpocock/skills#49dd158d1076134a641b33efb035946536778336' --list
npx skills@1.7.2 add 'https://github.com/cursor/plugins/tree/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills' --list
npx skills@1.7.2 add 'emilkowalski/skills#2d228630ba1446365f614a108cb8252f1feda202' --list
```

Matt's `skills/engineering/<skill>` and `skills/productivity/<skill>` categories fit automatic discovery: known skill containers are searched up to three levels deep. Pstack's explicit `pstack/skills` URL narrows discovery to the desired collection; its plugin support files remain outside that selected subtree. `--full-depth` broadens discovery but is not a dependency installer. [Discovery implementation](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/skills.ts), [source parser](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/source-parser.ts), [pstack tree](https://github.com/cursor/plugins/tree/101b274dd991f694e1f7024be2157e5f3adf07de/pstack).

### Untouched files are possible; automatic dependency packaging is absent

For these disk-based Git sources, installation copies each selected skill directory recursively. Default symlink mode means a **local canonical copy plus links from agent directories**, not a live link into upstream GitHub; `--copy` makes independent copies. For Codex/Cursor/Claude Code, ordinary `SKILL.md` files are copied without rewriting their content. In-directory references, scripts, assets and `agents/openai.yaml` travel with that directory. The copier excludes `metadata.json` and certain cache/Git directories; Eve has separate frontmatter transformation behavior, so this is not a universal byte-preservation claim for every host/file. [Copying and symlink implementation](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/installer.ts).

The CLI does **not** read prompt instructions to install sibling skills, follow ordinary relative Markdown references outside the selected directory, copy the repository's root license automatically, or register plugin-level agents/rules/tools. Selecting Matt's wrapper therefore does not automatically select `grilling`/`domain-modeling`; selecting pstack skills does not install `pstack/agents/poteto-agent.md` or make its model configuration available. Pstack explicitly expects sibling skill paths and a named subagent. Audit that support/dependency closure separately while leaving the skill files intact; keep attribution/license files alongside the installation. [Installer boundary](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/installer.ts), [Matt wrapper](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/grill-with-docs/SKILL.md), [pstack assumptions](https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/SKILL.md).

### Refs, lockfiles and updates

Git refs use **`#ref`**, including slash-containing branches; a GitHub `tree/<ref>/<subpath>` URL is also accepted. **`@name` selects a skill**, not a Git version. The clone implementation supports branches/tags and a fallback for a **full 40-character commit SHA**; do not rely on abbreviated commit hashes. [Parser and tests](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/source-parser.ts), [SHA fetching](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/git.ts).

Project `skills-lock.json` records source, optional ref, upstream skill path and a SHA-256 folder hash, and is designed for version control. Global tracking uses `~/.agents/.skill-lock.json`, or `$XDG_STATE_HOME/skills/.skill-lock.json`, with source/ref/path and folder tracking. A content hash records the installed state; choosing a moving/default branch does not pin an immutable upstream commit. Commit-ref installs retain that ref on updates. [Project schema](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/local-lock.ts), [global schema](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/skill-lock.ts), [ref-preserving update sources](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/update-source.ts).

**Both project and global updates are supported**: `npx skills@1.7.2 update -p` and `npx skills@1.7.2 update -g`, optionally followed by selected skill names. Bare `update` prompts for scope; `update -y` auto-selects project scope when project skills are detected, otherwise global. Updates reinstall changed skill directories, so store supplemental verification separately from upstream directories. [Update implementation](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/update.ts), [directory replacement](https://github.com/vercel-labs/skills/blob/671e8c320810d36fed80fac5f1a2c1bf7e82d812/src/installer.ts).

## Appendix: pstack inventory coverage

The pinned `pstack/skills/` tree contains 30 task/style/setup entries plus 24 principle entries. The recommendations above distinguish the high-value omissions from skills that duplicate a chosen owner or concern. The remaining task entries are `bro`, `in-your-own-words`, `ketchup`, `poteto-help`, `recall`, `sharpen`, `teach`, `technical-writing`, `typescript-best-practices`, and `make-bot-ui`. Keep them available for their own tasks; they are not missing mandatory delivery stages. In particular, `teach` overlaps explanatory work, `recall` and `ketchup` address context reconstruction, and `make-bot-ui` builds bot dashboards rather than validating ordinary changes. [Inventory][p-inventory], [catalog and descriptions][p-readme]

The 24 principles cover simplification/design, domain and boundary modeling, types, idempotency, migration, shared state, proof, root causes, verifiable units, behavioral tests, measurement, context, autonomy, and structural lesson enforcement. Prefer reading a relevant principle when it changes a decision over loading all of them for every task. Full `poteto-mode` makes several of these binding routing policies, so selecting its principles selectively is a custom integration choice. [Principles index][p-mode]

[m-ask]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/ask-matt/SKILL.md
[m-review]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review/SKILL.md
[m-spec]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-spec/SKILL.md
[m-tickets]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/to-tickets/SKILL.md
[m-implement]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement/SKILL.md
[m-implement-spec]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/implement-spec/SKILL.md
[m-retro]: https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/retro/SKILL.md
[e-break]: https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/break-ui/SKILL.md
[p-plugin]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/plugin.json
[p-readme]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/README.md
[p-inventory]: https://github.com/cursor/plugins/tree/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills
[p-mode]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/SKILL.md
[p-create]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/create-verification-skill/SKILL.md
[p-maintain]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/maintain-verification-skill/SKILL.md
[p-prove]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/principle-prove-it-works/SKILL.md
[p-units]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/principle-sequence-verifiable-units/SKILL.md
[p-how]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/how/SKILL.md
[p-why]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/why/SKILL.md
[p-blast]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/blast-radius/SKILL.md
[p-interrogate]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/interrogate/SKILL.md
[p-architect]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/architect/SKILL.md
[p-arena]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/arena/SKILL.md
[p-setup]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/setup-pstack/SKILL.md
[p-unslop]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/unslop/SKILL.md
[p-correct]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/correct/SKILL.md
[p-reflect]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/reflect/SKILL.md
[p-automate]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/automate-me/SKILL.md
[p-no-comments]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/no-comments/SKILL.md
[p-tdd]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/tdd/SKILL.md
[p-feature]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/feature.md
[p-opening]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/opening-a-pr.md
[p-bug]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/bug-fix.md
[p-migrate]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md
[p-claude]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/docs/harness/claude-code.md
[p-trail]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/show-me-your-work/SKILL.md
[p-benchmark]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/benchmark-checklist/SKILL.md
[p-swarm]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/swarm/SKILL.md
[p-eval]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/eval.md
[p-babysit]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/babysit.md
[p-shipping]: https://github.com/cursor/plugins/blob/101b274dd991f694e1f7024be2157e5f3adf07de/pstack/skills/poteto-mode/playbooks/shipping.md
