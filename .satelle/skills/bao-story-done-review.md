---
name: bao-story-done-review
type: skill
tags: [type:skill, type:reviewer]
description: Close gate on in_progress -> ready judging the behaviour the story states, then each numbered acceptance criterion, against the change presented. Judges behaviour first - a story whose criteria all pass while the stated behaviour does not is a refusal. Does not re-plan at close. Adapted from satelle 0.0.x's embedded satelle-story-done-review.
---

# Story done review (in_progress -> ready)

Validate the **presented** change against the **story**. Answer only: may we
close? Do not re-plan or redesign at close. You do not edit.

The deterministic checks have already passed, so the tree is committed and the
build is green. Green is not done — green only means nothing is broken.

## How to judge

**Judge the behaviour first.**

1. **Read the body** and name the behaviour it states.
2. **Judge the change against that behaviour**, using evidence you can see:
   the diff, the tree, the tests, the story's attachments.
3. **Record it as criterion 0.** When the behaviour holds, say so and quote
   it. When it does not hold, reject and quote it — **even when every numbered
   criterion is met**. A technical criterion that passes while the behaviour
   does not is a refusal, and the refusal names the behaviour.
4. **Then walk the numbered criteria.** Each must be plausibly met by the same
   evidence. Reject unmet criteria and name them by number. Judge the criteria
   as written: a fair gate, not a stricter one.
5. **A criterion that cannot be met while the behaviour holds** — a proof that
   could only have been captured earlier, say — is recorded as unmet beside
   the criterion 0 accept, named in your notes. It is not amended, not waived
   and not silently passed.

## Evidence

bao-ui has no test suite yet, so for most stories your evidence is the diff
and the code around it. Say which it was. "The build passes" is not evidence
that a behaviour holds, and a verdict that rests on it alone is a verdict with
no reasons.

## Verdict

```json
{"verdict": "accept", "notes": "<criterion 0 and each numbered criterion, with the evidence each rests on>"}
```
