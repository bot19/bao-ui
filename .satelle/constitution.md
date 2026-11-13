---
type: constitution
title: bao-ui constitution
description: Order-zero context for bao-ui - what the repo is, how work moves through the delivery lane, and the rules the lane cannot enforce. Injected at session start.
---

# bao-ui constitution

## What this repo is

`@bot19/bao-ui` — the shared component library and design system for my apps.
Food Friends (`food-friends`) is the first baseline: its UI is gathered here so
the same control can be seen in every variation it currently ships with.

- React 19 + TypeScript + Vite + Tailwind v4, tested with vitest.
- `npm run build` is `tsc --noEmit && vite build`. `npm test` is `vitest run`.
  Both must pass before a story closes; `.satelle/skills/bao-checks.md` is the
  single place that list lives.
- `src/components/**` is the library. `src/catalog/**` is the catalog page that
  renders the specimens. Shared components are the real Food Friends files;
  one-off controls are reproduced with the class strings from the source file
  they came from and labelled with that path.
- This repo is where changes get made. Apps consume a published package, never
  a copy of these files.
- The current job is **resolving consistency** — the same control shipping in
  several styles — not adding features. Prefer converging a variant over
  introducing a new one.
- The repo is **public**. Nothing here names an employer, a client, a private
  repository or an internal tool.

## How work moves

One workflow, `.satelle/workflows/delivery.toml`. Read it rather than guessing;
`satelle workflow show delivery` prints it.

    plan ──► signoff ──► in_progress ──► ready ──► done
     shape    operator      build        built    on main
                                        + green

- **plan** — the session and the operator shape one story: a title, a body
  stating desired behaviour, numbered testable criteria. No application code is
  written in this state.
- **signoff** — the operator's. No agent performs here, no agent may edit under
  a seat here, and no transition out runs until the operator records approval
  at their own terminal. `.satelle/operator.sh` carries the short verbs they
  use there — `waiting`, `story <id>`, `approve <id>` — and says how to install
  them. A session names the verb and stops; it cannot run it.
- **in_progress** — the session builds, under a seat, committing on a branch.
  Three rejected rounds in a row park the story in `held`.
- **ready** — committed with the checks green and the judges satisfied. Built,
  not shipped.
- **done** — on `origin/main`. Terminal.

Take the seat before presenting the first gated transition, not after: the seat
records the base every gate judges from.

**Every reply opens with a lane header**, one line, so the operator sees where
the work stands without reading the reply:

    📍 sto_1234abcd · plan ▸ [signoff] ▸ in_progress ▸ ready ▸ done

Name the story in focus and mark its current state with brackets. A parked or
cancelled story shows that state in place of the five (`📍 sto_1234abcd ·
[held]`). With no story in focus, say so: `📍 no story in focus`.

## Versioning

Every story that ships product behaviour names the app version it ships, as a
single `version:X.Y.Z` tag, **before** work starts — `.githooks/commit-msg`
reads that tag to prefix each commit `[X.Y.Z]` as it is made, so a tag added
later leaves earlier commits unprefixed.

`version:none` opts a story out: a chore, a doc fix, a spike, a change to
`.satelle/` itself.

By the time the story closes, `package.json` is at exactly that version
(`npm version X.Y.Z --no-git-tag-version`) and every commit since the story's
base carries the prefix. Two gates enforce this — `bao-story-version-check` on
the way in, `bao-version-commits-check` on the way out.

## Ground rules

- The catalog is for resolving consistency. It is not a published API yet, so a
  breaking change to a component is acceptable; an undocumented one is not.
- Match the Tailwind conventions already in the file you are editing. Do not
  introduce a styling abstraction — CSS modules, styled-components, a `cn()`
  wrapper — without a story that says to.
- A story that adds behaviour adds the test that proves it. The suite is small,
  so the done judge rests mostly on reading the diff; every test added moves a
  little of that weight onto something deterministic.
- Never commit a secret, and never copy one found in a tracked file.

## What the lane cannot enforce

Most of what used to be written here is now structure: the operator's sign-off
is the `signoff` state, approval is per-entry because a record from an earlier
visit does not count, work cannot start unprompted because nothing performs in
`signoff`, and the story that was approved is the story that gets judged —
`bao-criteria-unchanged-check` replays the ledger on the way out of
`in_progress` and rejects a criterion or body edited since the approval. Those
rules are deleted from this document rather than repeated: a rule stated in two
places drifts in one of them.

Two things remain the session's own discipline, because no gate watches them:

1. **A block is surfaced, not routed around.** When a gate, hook or check
   refuses something, say what refused it and what it said, then stop. Do not
   open a second story whose purpose is to get past the first refusal, and do
   not look for a path the refusal did not name. A refusal is information about
   the work, not an obstacle between you and a green status.

2. **Once a story is approved and engaged, drive it.** Follow every transition
   the workflow declares without asking again. The sign-off is at the boundary,
   not at every step inside it. Stopping mid-lane to ask a question the lane
   already answers wastes the approval that was given.

If a criterion turns out to be wrong, that is the first rule, not a reason to
edit it: say so and take the story back to `plan`. `in_progress -> plan` is a
declared transition, and it costs one more sign-off, which is the point.

## Where the process lives

Authored under `.satelle/` — the workflow, the skills, this file. The binary
holds no process of its own: every state, gate and rubric is here, and editing
any of it is a change to how work is judged. A story whose diff touches
`.satelle/` wakes `bao-workflow-change-review`, which asks whether the operator
approved that change. Answering a rejecting gate by editing the gate is the one
move this repo refuses outright.
