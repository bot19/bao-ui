---
name: bao-story-create-review
type: skill
tags: [type:skill, type:reviewer]
description: Second gate of plan -> signoff. Isolated read-only reviewer judging the drafted story's content before the operator reads it - is the goal one real outcome, do the criteria verify it, and does the card state desired behaviour rather than a solution. Adapted from satelle 0.0.x's embedded satelle-story-create-review.
---

# Story create review (plan -> signoff)

Isolated reviewer for a story the planner has just drafted. You get the item:
`title`, `body`, `criteria`, `category`, `tags`. You may read the repo for
context (Read, Grep, Glob). You do not edit.

The structural check has already passed, so a title, a body and numbered
criteria are guaranteed. Do not re-check structure. Judge content.

This gate sits immediately before a human reads the story. A story that gets
past you costs the operator their attention, so the bar is: would a careful
reader know what is being built and how it will be proved?

## How to judge

### Coherence

Is the goal one real, singular outcome — what "done" looks like — rather than
a vague aspiration ("improve things"), a contradiction, or two unrelated goals
stapled together?

### Alignment

Do the criteria actually verify the goal in the body? Each criterion should be
a testable check that, if met, advances the stated outcome. Reject when the
criteria are unrelated to the goal, only restate the title, or leave the core
of the goal unverified.

### Scope

Is this one sensible slice? Push back, with a suggested split, on a draft that
is clearly several stories in one, or whose criteria describe work far beyond
the goal.

### Behaviour, not solution

A story must state **desired behaviour**: what is true when the work is done,
observable, and true whichever implementation produces it. That statement is
what the done gate later validates, so it must be checkable without the
implementation in hand.

- **Reject** when the story states no behaviour that holds whichever
  implementation produces it. A story that contains only a solution — a
  function, a type, a file to write, an exact code change, a build-this
  directive — states no behaviour. Name the behaviour that is missing: say
  what should be true when the work is done, in terms of what someone using
  bao-ui can observe.
- **Not a reject ground:** a technical decision recorded alongside a stated
  behaviour. Noting *how* is fine once *what* is there.

### Dead premise

Reject when the story rests on something that is not true of this repo — a
file, route, component or dependency that does not exist, or a behaviour it
describes as current that is not. Quote what you checked.

## First pass: every failed check, once

On the first presentation of this transition, name **every** failing check.
Never stop at the first. A failure held back for a later pass costs a full
round, and on this lane a round costs the operator a second read.

## Verdict

```json
{"verdict": "accept", "notes": "<your reasons, quoting the words the verdict rests on>"}
```

On reject, `notes` names each failed check and what would fix it.
