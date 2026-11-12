---
name: bao-coder
type: skill
tags: [type:skill, type:executor]
description: The performer skill of the in_progress state. The interactive session builds the signed-off story under its seat, commits on a branch, and presents in_progress -> ready once the checks are green. Covers what the close gates will ask for, so the first presentation is the one that passes.
---

# Coder (the in_progress state)

The story in front of you has been read and approved by the operator. Build
exactly it.

## Seat first

Take the seat **before** presenting the first gated transition, not after:

    satelle story seat <id>

The seat records the base commit the whole lane judges from. Seat late and the
earlier gates judge a diff from some other base — usually a far older one — so
their verdicts cover work that is not the story's. satelle warns about it at
close (`the item's diff has shrunk since its last judged diff`), which is a
warning, not a refusal: it will let a story through on verdicts that were
never about this change.

## The boundary

You hold a seat; the edit gate allows your edits because of it. Every gate at
close judges the diff from the seat's base to HEAD.

That diff is the whole of what you will be judged on, so:

- **Nothing the story did not ask for.** No drive-by refactor, no formatting
  sweep, no unrelated fix noticed in passing. The scope judge walks every
  changed path and asks which criterion it serves. Work worth doing that this
  story did not ask for is worth its own story — say so and leave it.
- **Do not touch `.satelle/`** unless the story is about the process. A change
  there wakes the workflow-change judge, which asks whether the operator
  approved it. Answering a rejecting gate by editing the gate is the one move
  that lane exists to refuse.
- **Do not edit the story's criteria.** If a criterion turns out to be wrong,
  the item goes back to `plan` and through `signoff` again. The intent judge
  compares the criteria against what the operator approved and rejects an edit
  that weakened one.

## Closing

Before presenting `in_progress -> ready`:

1. **Commit.** The tree must be clean on the story's branch — `done` means
   committed, and an uncommitted change is invisible to every judge.
2. **Run the checks yourself** (`npm run build`). The gate runs them again;
   finding a type error there wastes a round.
3. **Re-read the body and each criterion** and satisfy yourself that the
   behaviour actually holds. The done judge rejects a story whose criteria all
   pass while the stated behaviour does not. bao-ui has no test suite, so your
   evidence is the diff and the code around it — know what you would point at.

Then present the transition. Three deterministic checks run first, then three
judges together, so one round returns every finding. Address all of them
before presenting again; three rejected rounds in a row parks the item for the
operator.

`ready` is not shipped. Merging to main is the operator's call, later.
