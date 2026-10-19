# Show the current analysis state

Read only when the problem needs a map: dependent stages, competing explanations, or consequential uncertainty. This is a user-requested presentation extension to the PDF adaptation, not another reasoning method or a proven improvement in human understanding.

## Choose the view that exposes the dependency

Use a small Markdown table, plain-text diagram, timeline, or hypothesis comparison. Prefer one combined view over separate evidence and status tables that repeat the same findings. Match the structure to the problem rather than impose a fixed sequence of methods. Include:

- The actual question or decision.
- Findings with their basis: a supplied observation, inspected source, or actual test result.
- The current blocker or consequential unknown, showing which conclusion depends on it.
- A concrete next step and what its possible results would distinguish or permit.

For causes, connect each hypothesis to a different prediction and a discriminating test. For mechanisms, show state, rule, and consequence. For forecasts, connect inputs and evidence quality to a conditional estimate. Use a timeline only when order or delay matters. Leave irrelevant fields out; the view should help solve the user's problem rather than display the toolbox.

Use readable status labels such as **reported**, **observed**, **assumed**, **to check**, **predicted**, **supported within this scope**, and **rejected by this evidence**. Include scope and source where they affect interpretation. A reported observation is not independently verified, and one contradictory result may reject only part of an explanation. Neither color alone nor invented progress percentages communicate status.

## Update knowledge without suggesting unperformed work

Update after meaningful evidence, a rejected hypothesis, a changed main unknown, or a changed recommendation. Briefly state what changed and which evidence caused it. Replace stale assumptions in the current view; keep a rejected candidate only if it helps explain the decision. Preserve the distinction between rejecting a candidate and proving its rival.

Reuse one editable artifact when supported and permitted by the task. In ordinary chat, publish a revised view only when the analysis materially changes; a short continuation needs no repeated map. Give each finding, unknown, and action one home in the view or adjacent text. At closure, include the conclusion, key assumption, next step, and review trigger once, adding only information the view lacks. If the answer opens with the recommendation, omit a second conclusion at the end.

A proposed test remains **proposed** until an actual result is available. A prediction remains **untested** until compared with evidence. Missing data should appear as the dependency blocking a conclusion, with a credible way to obtain it. Keep the conclusion conditional; proposing a measurement does not mean collection is underway. Illustrative values must stay labeled as examples.

## Presentation capabilities

Check the available skill catalog for the exact `show-me` skill. If available, read its instructions and use it only if they allow this context and its presentation helps. Respect explicit user-invocation requirements. A similarly named skill is not a substitute. If unavailable, restricted, or unsuitable, use a simple diagram or Markdown table without asking the user to install anything or select a presentation mode. `think-through` must work independently of `show-me`.

Build the view from the existing conversation and evidence. Keep any questions about the actual problem; the map introduces no quiz, request to repeat an explanation, or request for the user to predict a result. The agent still develops predictions and checks them against sources or observations as the selected method requires. Show useful task state and evidence, not an internal reasoning transcript.

## Example: competing explanations

Illustrative conversation, with no measurements performed by the agent:

**Question:** Why are deliveries late? **Reported:** orders wait two days before dispatch, according to the user. **Blocker:** waiting location alone does not establish its cause.

| Candidate — status | Prediction if it contributes | Proposed check and what it distinguishes |
| --- | --- | --- |
| Approval queue — to check | Orders ready for packing still wait for approval | Compare approval and packing timestamps to distinguish approval delay from stock delay |
| Missing stock — to check | Waiting orders lack at least one required item | Inspect those orders' stock records; stock availability would weaken this explanation for those cases |

If the user later supplies timestamped records showing approvals were immediate, update that candidate to **not supported for these orders**, retain any still-open stock explanation, and identify the remaining check. Do not report that stock shortages are proven or that a stock audit has started.
