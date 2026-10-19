---
name: think-through
description: Help think through a problem by choosing and applying a suitable reasoning strategy, explaining why nearby alternatives fit less well, and revisiting the choice as evidence changes. Use for understanding mechanisms, explaining observations, estimating or forecasting, and comparing decisions or designs.
---

# Think through a problem

Use the user's thinking-tools framework to turn a problem description into a useful line of inquiry. Work in conversation by default. Producing code, editing files, opening issues or PRs, and executing the eventual decision require a separate request. No repository setup or other installed skill is required. Use the English instructions and selected reference during normal runs; the original PDF is archived for source audits, not loaded as a second workflow.

## 1. Find the obstacle

Identify the desired outcome, what currently prevents an answer, and any important constraints. Separate supplied observations from assumptions and missing evidence. For a forecast, define the event or quantity and its time horizon. For a decision, distinguish hard constraints from preferences.

Use the available description to make a provisional choice. Ask a focused question only when its answer could change the route, feasibility, or recommendation; do not interview the user about every method. If facts are missing, check an available source, ask for the relevant observation, or use a measurement permitted by the task. If the fact cannot be obtained yet, state the source or measurement needed. Distinguish a recommendation to collect evidence from evidence actually collected. Use provided files when relevant; the workflow does not require inspecting an unrelated codebase.

## 2. Select the smallest useful strategy

Read the chosen route/tool section below before applying it. Begin with one primary method; add a companion when it resolves a concrete obstacle. The routes and tool numbers come from the supplied framework, not a scored diagnostic test.

| What blocks the answer? | Starting strategy | Expected result |
| --- | --- | --- |
| I cannot explain how something works or predict what changes it | [Understanding path](references/understanding.md): boundary, parts, one trace, mechanism, changed-case prediction | A model with a prediction that can be checked |
| I have an observation but do not know why it happens | [2. Competing hypotheses](references/tools.md#2-competing-hypotheses-and-causal-thinking) | Plausible explanations and a test that separates them |
| I need a quantity, duration, cost, or chance of an event | [3. Outside view](references/tools.md#3-outside-view), cross-checked with [1. Decomposition/Fermi estimation](references/tools.md#1-decomposition-and-fermi-estimation) | A defensible range or probability, with assumptions |
| I need to choose or design an approach | Goal and constraints, options, comparison and risks: [8. Criteria and opportunity costs](references/tools.md#8-criteria-and-opportunity-costs), then [6. Inversion/premortem](references/tools.md#6-inversion-and-premortem) once there is a concrete plan | A choice, risk-checked plan, and next step |

Use a companion when its trigger is present:

- No useful starting model: [4. Structural analogy](references/tools.md#4-structural-analogy), followed by checking its limits.
- Recurring problems, delayed effects, or local improvements that harm the whole: [5. Systems thinking](references/tools.md#5-systems-thinking). This can be the primary method when the loop itself is the obstacle.
- You have a concrete plan: [6. Inversion/premortem](references/tools.md#6-inversion-and-premortem). A premortem needs a plan and a failure horizon.
- New evidence should change an existing assessment: [7. Bayesian updating](references/tools.md#7-bayesian-updating). This can be primary when updating is the task.

When supplied rules already explain an observation and the user wants to learn the mechanism, use the understanding path; competing hypotheses are for an unresolved cause, not a reason to invent rival stories.

Treat mixed cases as a sequence: address the blocking uncertainty first, then reassess. For example, investigate causes before ranking fixes when their effectiveness depends on the cause. If no comparable cases exist, say the outside-view check is unavailable and use an explicitly assumption-based decomposition; do not invent a base rate.

## 3. Explain the selection and start using it

On initial selection or a strategy change, give a short rationale: the obstacle, why the primary method addresses it, and the useful result. Briefly contrast the closest alternatives, usually two; one is enough when only one is credible. For each, state why it is less useful **now** and when it would become useful. A sentence can cover the comparison; reserve tables for substantive tradeoffs. Continue the exercise on later turns without repeating the method pitch or touring the toolbox.

Apply the method to the supplied problem in the same response. Show the useful model, calculation, comparison, hypotheses, or test proposal, rather than stopping at tool names. Where a decisive input is missing, produce the supported portion and ask the next focused question. Explain assumptions and decision-relevant reasoning concisely; a long internal reasoning transcript is not the deliverable.

For a request only to select a method, stop after the recommendation and a concrete opening exercise. Otherwise make one useful first pass, then ask the next focused question if further progress needs an answer; close when the result has enough support for the task. Defer additional exercises and comparisons until their inputs are available; ask several questions together only when the answers need to be considered jointly. Keep the user's values and choices visible rather than supplying invented preferences. Use English for the workflow's explanations and artifacts unless the user asks otherwise.

## 4. Check the result and loop only when useful

Use the selected method's output and pitfalls in [tools.md](references/tools.md), or the changed-case check in the understanding path. Keep observations, inferences, illustrative numbers, and untested predictions distinct. An analogy or plausible story generates a hypothesis; it does not establish a mechanism. A forecast scenario range is not a statistical confidence interval.

If the next obstacle changes, explain the switch and select the method for that obstacle. If a test has not been run or new data is unavailable, leave the conclusion conditional and give the next evidence-gathering step. Do not simulate results to keep the loop moving.

Stop when the answer has enough support for the user's purpose, or when further progress depends on a specific missing observation or user preference. Consider whether more information could change the decision enough to justify its cost; avoid an exhaustive tour of the toolbox.

When ending an exercise, record these four results for any route, including explanations and calculations. They can be combined into a concise paragraph:

- **Conclusion:** what is supported, or the conditional recommendation.
- **Key assumption:** the uncertain fact or preference most likely to change it.
- **Next step:** a concrete action or discriminating test.
- **Review trigger:** when to check the result against observation, documentation, or the prediction. The check can be immediate for a worked explanation or calculation; use a later date, event, or observation when appropriate. This does not schedule a reminder.

During an ongoing exercise, end with the next focused question; the four-part record is for closure, not every turn. Identify the unknown that could change the conclusion or choice and a credible way to check it. Keep the next step and check proportionate to the actual task, without inventing a larger decision or future deadline.

On a later return, compare the prediction with the observed result, name what the model missed, and revise it. Saving a decision record is optional and happens only when requested. The [source note](references/source.md) maps this English adaptation to the supplied PDF and preserves its evidence limits.
