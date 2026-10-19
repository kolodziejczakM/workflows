# Thinking tools

These eight cards retain the source PDF's numbering. Use the selected card; they are not eight mandatory stages. The examples and numerical inputs in the original document are illustrations, not evidence about the user's case.

## 1. Decomposition and Fermi estimation

**Use:** separate a problem into parts, or estimate a quantity from simpler terms. PDF p. 4.

**Do:** for any problem, separate parts or subproblems and record their dependencies. If estimating a number, define the quantity and units, combine simpler estimates with an explicit formula, calculate low/high scenarios, vary the main assumptions separately, and cross-check against comparable cases. Uncertain inputs can use defensible provisional ranges: label them as estimates or assumptions, explain their basis, and identify the observation or sample that would improve the influential unknown. If no defensible estimate is possible, leave that input unresolved rather than present a fabricated fact.

**Output:** a decomposition, or a scenario range with assumptions and its most influential unknown.

**Check:** units, omissions, double counting, dependencies, and sensitivity. A low/high scenario range is not a confidence interval. Work effort is not elapsed completion time: include waiting and dependencies when forecasting a finish date.

## 2. Competing hypotheses and causal thinking

**Use:** an observation needs an explanation. PDF p. 4.

**Do:** separate the observed result from its interpretation. Develop two or three plausible explanations, including a credible challenge to the favored story. State what each predicts. Choose an observation or test for which their predictions differ. Consider common causes, reverse causality, and explanations that coexist. The true explanation may be outside the current list.

**Output:** a narrowed set of explanations, or the next discriminating test with expected observations under each hypothesis.

**Check:** locating the slow stage of a process does not establish why it is slow. An association or a plausible mechanism alone does not establish causation. Do not announce a winner before the needed evidence arrives.

## 3. Outside view

**Use:** forecast duration, cost, or outcome using what happened in comparable situations. PDF p. 4.

**Do:** define what makes cases comparable, seek completed cases including failures, and examine typical outcomes and spread. Adjust for specific, relevant differences rather than confidence that this case is special. Cross-check with a decomposition of this case. If no credible reference class is available, make that gap explicit and identify where to find or measure one.

**Output:** a reference-class forecast or baseline, justified adjustments, and limitations of the data.

**Check:** selection and survivorship bias, poor comparability, and small samples. A handful of examples cannot justify a precise probability or reliable statistical interval. Do not manufacture historical cases or base rates.

## 4. Structural analogy

**Use:** transfer relationships from a familiar domain to a new one; this is especially helpful when there is no useful starting model. PDF p. 5.

**Do:** map elements and relationships between the familiar and target situations. Derive a specific hypothesis or prediction from that mapping. Identify differences that could break it and a way to check those differences.

**Output:** an explicit mapping, a new hypothesis, and the analogy's limits.

**Check:** resemblance in names or appearance is insufficient. A PR review queue can resemble a service queue, but reviews may repeat and require different experts. The analogy helps find a possible constraint; measurements must establish whether it exists in this case. Do not treat the analogy itself as proof.

## 5. Systems thinking

**Use:** a problem recurs, effects arrive late, or improving one part makes the whole worse. PDF p. 5.

**Do:** set a boundary and identify the important elements. Draw or describe directed influences, marking whether an increase in one tends to increase or decrease another with other conditions held constant. Look for feedback loops and delays. Predict side effects of a proposed intervention and select observations over enough cycles to see them. A small signed loop in text is enough when a diagram would add little.

**Output:** a dependency/feedback map, a candidate intervention, and a prediction to monitor.

**Check:** arrows are hypotheses, not demonstrated causal links. Reinforcing feedback amplifies change and is not synonymous with something beneficial; balancing feedback does not guarantee stability. Distinguish overall outcomes from local productivity measures.

## 6. Inversion and premortem

**Use:** challenge a concrete plan before committing to it. Inversion can also expose what would prevent success when the plan is still forming. PDF p. 5.

**Do:** for inversion, reverse the question from achieving success to what would prevent it. For a premortem, define success and a horizon, then imagine the concrete plan failed by that point. Identify plausible causes. In a team exercise, suggest independent contributions before group discussion; one agent inventing several voices is not independent input. Prioritize risks by plausibility, impact, and ability to intervene. Change the plan through safeguards, proposed owners, warning signals, and fallbacks. Ask who can own an action when ownership is unknown.

**Output:** a modified plan with prioritized risks and safeguards.

**Check:** avoid an unranked catastrophe list. When there is no concrete plan, use inversion to generate obstacles or first compare options rather than pretending a full premortem is possible. Do not present suggested owners or deadlines as agreed commitments.

## 7. Bayesian updating

**Use:** new evidence should change an existing probability assessment. PDF p. 6.

**Do:** identify the hypothesis, prior assessment, and new evidence. Ground and justify the prior, using frequencies in comparable cases among other relevant information; label a stipulated illustrative prior as an assumption. Ask how likely the evidence would be both if the hypothesis were true and if it were false. Equal likelihoods leave the assessment unchanged. Reason qualitatively when the inputs cannot support numbers. Natural frequencies, as in the PDF example, or an equivalent formula can help with a justified numerical update; no representation is mandatory. For a binary hypothesis, the equivalent calculation is P(H|E) = P(E|H)P(H) / [P(E|H)P(H) + P(E|not H)P(not H)].

**Output:** a revised assessment, the assumptions behind it, and what further evidence could change it.

**Check:** ignorance is not automatically a 50/50 prior. Do not confuse P(E|H) with P(H|E), treat success as proof of benefit, or count dependent observations as independent evidence. An illustrative calculation must be labeled illustrative.

## 8. Criteria and opportunity costs

**Use:** choose between options or design an approach around a goal. PDF p. 6.

**Do:** state the objective and separate real constraints from habits. Select two to four decision criteria and establish their importance; qualitative priorities are sufficient. Compare alternatives, including a smaller change and no change. If an option violates a hard constraint, say so. Once a concrete plan emerges, check possible failure with tool 6 before treating the decision/design as complete. Vary decisive assumptions or weights to see whether the choice changes. Identify the unknown worth checking before commitment.

**Output:** a choice or conditional recommendation, its rationale, the best forgone alternative, and a reconsideration condition.

**Check:** rankings structure preferences; they do not make subjective scores objective facts. Do not invent the user's priorities or make hard constraints disappear in a weighted average. Opportunity cost concerns the best forgone option, not the sum of all rejected options; avoid double counting costs already represented elsewhere.
