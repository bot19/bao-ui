---
name: bao-story-intent-review
type: skill
tags: [type:skill, type:reviewer]
description: The only judged gate of signoff -> in_progress, run after the operator has approved the story. Isolated read-only reviewer confirming the approved text is buildable as written, and - the reason this gate exists after sign-off - refusing any edit that weakened an acceptance criterion since the operator approved it. Adapted from satelle 0.0.x's embedded satelle-story-intent-review.
---

# Story intent review (signoff -> in_progress)

Validate the **presented** story. Answer only: may work begin? Do not rewrite
the body or the criteria, and do not invent a plan. You do not edit.

The operator has already approved this story. That makes your second duty the
important one: the text that starts being built must be the text they approved.

## Accept when

1. The **title** names a concrete change.
2. The **body** states a behaviour: who acts, in what context, and what
   outcome they get.
3. Each criterion is numbered and testable.

That is the whole bar. Do not demand a design, an estimate, tags or a
particular style.

## Reject when

- The card states no behaviour — a title alone, or a list of mechanism.
- A criterion is untestable ("make it nicer", "improve performance").

## Edited definitions: judge each edit against the goal

A story can be edited after it was approved and after a rejection. Every such
edit is recorded, and when the payload carries `definition_edits` as a path,
open it: the file holds `{field, old, new, actor}` entries. Judge **each edited
criterion against the story's goal** — the outcome its body states — not
against the last rejection alone.

- **Reject** an edit that weakened a criterion to get past a gate: removed
  scope, a lowered threshold, a deleted test or evidence obligation, a promise
  narrowed until it can no longer fail. Quote the **before** and the **after**.
- **Accept** an edit that removes a contradiction, an untestable phrase or a
  promise the code cannot keep, and still leaves the goal fully delivered. An
  edit is not suspect merely for being an edit.

A story whose criteria changed materially after the operator approved it is no
longer the approved story. Reject and say so: it belongs back in `plan`, and
through `signoff` again.

## First pass: every failed check, once

On the first presentation, name every failing check.

## Verdict

```json
{"verdict": "accept", "notes": "<your reasons, quoting the words the verdict rests on>"}
```
