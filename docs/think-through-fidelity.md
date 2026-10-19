# Think-through source-fidelity review

Reviewed on 19 October 2026 against the user's [original six-page PDF](sources/thinking-framework-2026-10-19.pdf). The [archive manifest](sources/thinking-framework.json) records its identity. The copy matches the supplied attachment byte for byte.

The review covered the complete source and all runtime instruction files: `SKILL.md`, `references/understanding.md`, `references/tools.md`, `references/source.md`, and `agents/openai.yaml`. README usage claims were also checked. The source was read in Polish; the implementation remains English.

## Coverage

| Source | English implementation and meaning checked |
| --- | --- |
| Page 1: entry routes | Obstacle, goal, known facts versus assumptions, forecast event/deadline, one starting point; understanding, explanation, estimation, decision/design |
| Page 1: additional obstacles | Analogy without an anchor, systems for recurrence/side effects, failure check once there is a plan, Bayesian update for new evidence |
| Page 1: completion and loop | Conclusion, key assumption, next step, when to check; consequential unknown and reliable check; stop with sufficient support; compare information value with cost; revisit prediction after action |
| Pages 2–3: understanding | Depth and boundary; inputs, state, environment, purpose/output/effect; decomposition, trace, reconstruction, mechanism/feedback, changed-case prediction; genuine gaps; optional recall after a few days; successful prediction is not proof of mechanism |
| Page 4: tools 1–3 | General decomposition versus numerical Fermi estimation; provisional estimates, low/high scenarios, sensitivity and cross-check; competing/coexisting hypotheses and discriminating tests; common causes/reversal; comparable completed cases including failures; justified adjustments and sample limits |
| Page 5: tools 4–6 | Structural mapping, predictions and analogy limits; signed influences, feedback/delays and side effects; inversion versus a concrete-plan premortem, independent team contributions, prioritized safeguards/owners/warnings/fallbacks |
| Page 6: tools 7–8 | Justified prior including comparable-case frequencies; evidence under both hypothesis states; qualitative updates without numeric grounds, illustrative 50/50 and dependent-evidence caveats; goal/constraints, 2–4 criteria and importance, smaller/no-change options, sensitivity, best-forgone opportunity cost |
| Page 6: evidence and bibliography | All twelve original links; synthesis and absence of independent testing of the whole framework; examples remain illustrative |

## Corrections

| Initial difference | Restored source meaning |
| --- | --- |
| Full closure limited to actions/predictions | All completed exercises keep the four results from page 1. Ongoing turns can ask the next question; a worked calculation can be checked immediately without inventing a larger decision. |
| Bayes only identified a supplied prior | State and justify its basis, including comparable-case frequencies where applicable; distinguish illustrative assumptions from practical numerical grounds. |
| Unknown Fermi inputs led only to a formula/measurement | Allow defensible provisional estimates explicitly labeled with their basis; identify how to improve influential inputs. Leave values unresolved only when no defensible estimate is possible. |
| Quantity/units required for every decomposition | General decomposition separates parts and dependencies. Quantity, units, formulas, and numerical scenarios apply when estimating a number. |
| Decision route lacked its explicit risk check | Restore options, comparison, and risks, linking tools 8 and 6. Premortem follows once a concrete plan exists. |
| Every understanding result needed an uncertainty | Record actual gaps when present; do not manufacture uncertainty to fill an output field. |
| Odds or natural frequencies required for numeric Bayes | Representations are optional equivalent calculation aids, not additional method requirements. |

The audit also clarified direct fact checking, the broader use of structural analogy, inversion before a concrete plan exists, and criterion importance. The understanding reference explicitly preserves how including a sensor changes an external measurement into an internal signal. None introduces another thinking method.

## Interface and archive policy

English interaction, automatic method selection, concise reasons for rejected alternatives, and chat-first use implement the user's requested interface. They do not replace the source's method steps or stopping criteria. Illustrations may be shortened; they must retain their assumptions and meaning.

The Polish PDF is maintainer-only provenance in `docs/sources/`. Agents ordinarily use the English skill and chosen reference. The PDF is neither installed as a skill nor copied into the plugin payload; source audits and translation maintenance are the occasions to consult it. `npm run check` verifies its checksum, not the quality of the translation. Future instruction changes still require this semantic comparison.

This is a source-fidelity review, not empirical validation of the framework or a guarantee about every future model response. Hypothetical behavioral trials remain limited to their observed replies.
