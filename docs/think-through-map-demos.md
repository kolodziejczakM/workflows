# Analysis-map demonstrations

Manual behavioral checks on 20 October 2026. These summarize actual synthetic agent replies in English; the conversations ran in Polish. Each agent read the current skill and relevant references, had no `show-me`, and was prohibited from browsing, running measurements, or changing the application. The cases check instruction-following, not improved human understanding or answer quality.

## Card synchronization: unknown rule, then a contract

**First input:** edits to cards sometimes disappear after offline synchronization between two devices. There is no controlled reproduction or relevant log. The user assumes different fields merge independently but does not know the overwrite rule.

**Observed reply:** a compact hypothesis comparison keeps the report separate from the field-merge assumption. It connects field merging, whole-card replacement, and client-side loss/display problems to predictions and discriminating checks. The next step is a proposed test with two devices and a captured server state, not an asserted reproduction.

**Next input:** the user supplies an API contract: every accepted write replaces the whole card, last server-accepted write wins, client edit timestamps are ignored, and there is no field-level merge. No tests or logging have been performed.

| Analysis state | Before the contract | After the contract |
| --- | --- | --- |
| Rule | Unknown; field merging assumed | Field merging contradicts the supplied contract; whole-card replacement is the documented rule |
| Remaining uncertainty | Which mechanism causes missing edits? | Did a stale full-card write actually arrive last in this incident? |
| Evidence status | User-reported loss; no controlled trace | Contract supplied by the user; runtime behavior still untested |
| Proposed next step | Capture both writes and intermediate server state | Capture payloads, server acceptance order, retries, and resulting state; compare the trace with the documented rule |

The reply explicitly labeled its two-write trace as a prediction derived from the contract, not an observed execution. It also distinguished server acceptance order from the order devices are connected. The revised map removed the obsolete field-merge assumption and retained a concrete incident-level unknown.

## Support workload: weak pilot, then comparable data

**First input:** one of ten pilot sessions contacts support. Earlier volume was about twenty contacts per day, with no session denominator or control group.

**Observed reply:** the evidence is insufficient to reduce staffing. A hypothesis table connects actual resolution, different traffic/case mix, and delayed contact or abandonment to different checks. A controlled comparison is proposed; no measurement is described as underway.

**Next input:** the user reports random assignment of 2,000 users, 1,000 per variant, with equal follow-up windows including seven extra days and similar task completion. The control has 200 contacts averaging ten minutes; the new help variant has 120 averaging fifteen minutes. Hourly demand and minimum coverage remain unknown. The user asks about cutting staffing by 20%.

| Updated finding | Basis and scope |
| --- | --- |
| Contacts fall by 40% | 200 versus 120 per 1,000 users in the reported trial |
| Average contact duration rises by 50% | Ten versus fifteen minutes in that trial |
| Total handling time falls by 10% | 2,000 versus 1,800 minutes, calculated from supplied inputs |
| A 20% staffing reduction remains unsupported | Peak demand, coverage, and available capacity are missing |

The next step changes from establishing a comparable effect to checking hourly workload and coverage against a reduced-staffing scenario. The effect on contact count is no longer the main unknown. The reply does not equate fewer contacts with a proportional staffing reduction or invent the missing operational measurements.

## Simple calculation

**Input:** “What is 15% of 240? A short answer is enough.”

**Actual reply, translated:** “15% of 240 is **36**.”

No map, quiz, follow-up question, or extra exercise was introduced.

## Scope

The first support follow-up repeated its conclusion in the opening and ending. A fresh repeat removed that duplication but used separate calculation and status tables with overlapping findings. The reference was tightened to give each result one home and prefer a combined view. A subsequent reply used one table linking the calculations, limitations, and next step, without a repeated closing conclusion. These are observed refinements, not a guarantee that every model will avoid repetition.

The reasoning tool cards and archived PDF are unchanged. Packaging, metadata, and installation checks are separate from these manual demonstrations. Native host rendering, an editable artifact, and the optional `show-me` integration were not exercised.
