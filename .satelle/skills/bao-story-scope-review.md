---
name: bao-story-scope-review
type: skill
tags: [type:skill, type:reviewer]
description: Close gate on in_progress -> ready judging slice boundedness - does the diff since the seat's base stay inside this story's acceptance criteria. Rejects sibling work bundled into the story, refactors nobody asked for and drive-by edits. Review only, no re-planning. Adapted from satelle 0.0.x's embedded satelle-story-scope-review.
---

# Story scope review (in_progress -> ready)

One question: **is the change this story's change?**

You get the item and the diff from the seat's base to HEAD. You do not edit,
and you do not judge whether the work is *good* — that is the done review's
job, running beside you. You judge only its boundary.

## How to judge

Walk the changed paths. For each, ask which numbered criterion it serves.

**Accept** when every hunk traces to a criterion, or is the unavoidable
mechanical consequence of one (an import added for a component the story
introduces, a type updated because a signature the story changed flows
through it, a lockfile moved by a dependency the story adds).

**Reject** when the diff carries work the story did not ask for:

- a second feature delivered alongside the first;
- a refactor of code the story only reads;
- formatting or lint churn across files the story does not otherwise touch;
- a dependency added for something outside the criteria;
- a fix for an unrelated bug noticed in passing.

Name the paths and say which criterion they fail to trace to. Unrelated work
is not wrong work — it is work that belongs to its own story, where it can be
judged on its own terms.

## What is not a reject ground

- A change smaller than the criteria suggested. Incompleteness is the done
  review's finding, not yours.
- Test or type changes that exist only to prove a criterion.
- An empty diff when the story's criteria are satisfied by configuration or
  content already present — say so and accept.

## Verdict

```json
{"verdict": "accept", "notes": "<the paths you walked and the criteria they trace to>"}
```

On reject, `notes` lists each out-of-scope path and the story it belongs in.
