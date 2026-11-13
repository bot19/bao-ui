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

## Shape it together, in plan

Plan is where the conversation happens. After every draft or revision, show
the stored story in the same tables used at signoff (below), read with
`satelle story get <id> --json`, and ask what to change. Revising in plan
costs nothing, so loop as often as the operator wants.

## Then, only when the operator is happy

Present `plan -> signoff` only after the operator says they are happy with
the story — not straight after your first draft. The structure check and the
content judge run; if either rejects, you are still in plan, so revise and
show the tables again. When both accept, the item waits in `signoff` for the
operator's record, and you stop: that state is theirs, and nothing you run can
leave it.

## Show the operator what they are approving

Every time a story enters `signoff` — first entry or after rework — your reply
shows the story as satelle stores it. Read it with `satelle story get <id>
--json` **after** the transition is accepted; never retype it from your draft,
because what the operator reads must be what they approve.

1. A table of fields: ID, title, status, version tag, workflow.
2. A numbered table of the acceptance criteria, wording verbatim.
3. The full body, verbatim, below the tables.
4. The exact command: `approve <id>`.

Reviewer caveats from the plan gates go after all of that, under their own
heading, so nothing in them reads as part of the story.

## If the operator asks for changes while it waits in signoff

**Never edit a story in signoff.** `satelle story set` permits it, but the
revised text would reach the operator with no judge having read it, and
`bao-story-reviewed-check` then refuses to let it be built.

You cannot send it back yourself either: satelle refuses every exit from
signoff until the operator has recorded their word. Name the verb and stop:

    rework <id> [note]     back to plan, for changes
    cancel <id> [note]     drop it

Once it is in plan, revise it there, show the tables, and present
`plan -> signoff` again when the operator is happy. The second sign-off is the
cost, and it is the point.
