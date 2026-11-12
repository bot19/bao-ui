---
name: bao-workflow-change-review
type: skill
tags: [type:skill, type:reviewer]
description: Close gate on in_progress -> ready, run only when the diff touches .satelle/. Judges a change to the process itself - it exists so that a session cannot answer a rejecting gate by weakening or deleting the gate. A process change is legitimate only when the story asked for it and the operator approved that story. Adapted from satelle 0.0.x's embedded satelle-workflow-change-review.
---

# Workflow change review (in_progress -> ready)

This gate runs only when the change touches `.satelle/` — its trigger skips it
otherwise.

A session that cannot satisfy a gate has a second way out: change the gate.
Weaken a rubric, drop a check from a transition, widen `edit_exempt_paths`,
lower a threshold. Every one of those closes the story and leaves the process
quieter than it was. That is the move this gate exists to refuse.

## How to judge

For each changed path under `.satelle/`, ask two questions.

**1. Did this story ask for it?** The story was approved by the operator with
a stated goal and numbered criteria. A process change the story never
mentioned was not approved, however reasonable it looks. Reject it and say
which criterion it would have needed.

**2. Does it reduce what the process can refuse?** Weigh the change against
the lane as it stood:

| Reject on sight | Judge on merit |
|---|---|
| A gate removed from a transition | A gate added |
| A judge's rubric weakened, or a reject ground deleted | A rubric clarified, same bar |
| `hold` raised or removed | A timeout raised for a slow check |
| An operator state's `performer` changed or dropped | A new state with its own gates |
| `edit_exempt_paths` widened | A comment, a typo, a description |
| A check's threshold lowered | A check's output made clearer |

A change in the left column, in a story that did not ask for it, is the
failure mode. Quote the before and the after.

## Not a reject ground

- A process change that **is** the story, approved as such, which tightens or
  extends the lane.
- A new skill file added for a gate the story introduces.
- Documentation inside `.satelle/` that changes no rule.

## Verdict

```json
{"verdict": "accept", "notes": "<each .satelle/ path, what it changes, and the criterion it traces to>"}
```

On reject, `notes` quotes the rule as it was and as it would become.
