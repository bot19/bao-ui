---
type: constitution
title: Project constitution
description: The local/repo definition the agent reads as order-zero context, injected every session.
---

# Project constitution

## What this repo is

`@bot19/bao-ui` — the shared component library and design system for my apps.
Food Friends (`food-friends`) is the first baseline: its UI is gathered here so
the same control can be seen in every variation it currently ships with.

- React 19 + TypeScript + Vite + Tailwind v4. No test runner yet.
- `npm run build` is `tsc --noEmit && vite build`. It is the verification step
  for every story unless the story names another.
- `src/components/**` is the library. `src/catalog/**` is the catalog page that
  renders the specimens. Shared components are the real Food Friends files;
  one-off controls are reproduced with the class strings from the source file
  they came from and labelled with that path.
- This repo is where changes get made. Apps consume a published package, never a
  copy of these files.
- The current job is **resolving consistency** — the same control shipping in
  several styles — not adding features. Prefer converging a variant over
  introducing a new one.

## Ground rules

- The catalog is for resolving consistency. It is not a published API yet, so a
  breaking change to a component is acceptable; an undocumented one is not.
- Match the existing Tailwind conventions in the file you are editing. Do not
  introduce a styling abstraction (CSS modules, styled-components, a `cn()`
  wrapper) without a story that says to.
- Every working-lane story names the app version it ships (`version:X.Y.Z`) and
  its commits carry the `[X.Y.Z]` prefix. See `sty_01213f4c`.

## I sign off on every story — this is the rule that outranks the others

Satelle checks that a story exists, not that I agreed with it. That check is
mine, and it happens **before** the story is created.

1. **Draft, do not create.** When work is identified, present the complete card
   in chat first — title, body, category, and the numbered acceptance criteria.
   Do not call `satelle story create` until I have replied approving that card.
2. **Approval is explicit and per-story.** It is my reply to the drafted card, in
   my own words. Agreeing to a plan, answering a question, saying "yes" to
   something adjacent, or my having described the problem is **not** approval.
   Approval of one story never carries to the next.
3. **Never start work unprompted.** Do not call
   `satelle story set <id> --status in_progress` unless I asked for that story to
   start — including a story I wrote myself. Creating a story and engaging it in
   the same breath is the thing this rule exists to stop.
4. **Amendments need sign-off too.** `satelle story amend` changes what the close
   gate measures against. Present the new text and wait.
5. **A block is surfaced, not routed around.** If a gate, hook or fence refuses
   something, tell me what refused it and stop. Do not raise a story whose
   purpose is to get past it. This deliberately overrides the
   `satelle-agent-goals` instruction to raise a story for blocked work: in this
   repo, that story still needs my sign-off first.
6. **Once a story is approved and engaged, drive it.** Follow every transition
   the workflow declares without asking again. The sign-off is at the boundary,
   not at every step inside it.

The reason: the gates judge the diff against the card. If the agent writes the
card, nothing checks that the card was the right thing to build. I am that check.

## Where the process lives

Authored substrate under `.satelle/` — workflows, principles, skills — edited
without a binary release, and only under a `substrate` story.
