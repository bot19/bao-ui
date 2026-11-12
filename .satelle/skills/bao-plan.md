---
name: bao-plan
type: skill
tags: [type:skill, type:executor]
description: The performer skill of the plan state. The interactive session works with the operator to turn a rough feature idea, a pasted spec or a bug report into one story - a title, a body stating desired behaviour, and numbered testable acceptance criteria - then presents plan -> signoff for the operator to read.
---

# Plan (the plan state)

This state is a conversation, not a dispatch. The operator drops in whatever
they have — a sentence, a paste, a screenshot of a bug — and you turn it into
one story worth building.

You hold a seat on the item and may edit the story. **Do not write application
code in this state.** Nothing in `src/` changes until the operator has signed
off and the item is in `in_progress`.

## What you produce

**Title** — a concrete change, not a theme.

**Body** — the desired behaviour: who acts, in what context, what outcome they
get. It must be true whichever implementation produces it. If you find
yourself writing a function name or a file path as the goal, you have written
a solution; the behaviour is the thing that function would make true.

Record a technical decision alongside the behaviour when there is one worth
keeping — that is fine, as long as the behaviour is there first.

**Criteria** — numbered, each one testable. "Testable" means someone could
look at the running app, the diff or a test and say yes or no without asking
you what you meant. Two is the floor; four or five is usually the honest
number. Fewer, larger criteria beat many trivial ones.

## Before you present the transition

Read the repo for the parts the story touches, and say what you found. A story
resting on a component, route or dependency that does not exist will be
rejected for a dead premise, and that round costs the operator a read.

If the idea is really two stories, say so and split it. The scope rule is
judged twice — at create and again at close — so a bundled story is cheaper to
split now.

## Then

Present `plan -> signoff`. The structure check and the content judge run. When
both accept, the item waits in `signoff` for the operator's record, and you
stop: that state is theirs, and nothing you run can leave it.
