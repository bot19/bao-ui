---
name: bao-verdict-notes-check
type: check
description: After check listed by every judged gate on this lane. Each judge's own notes must hold at least 40 non-whitespace characters, whatever its verdict; a judge that answered with fewer gave no reasons, and the gate's result becomes reject with the judge's raw answer kept. A carry or a check gate has no judges and passes. Deterministic, no agent.
---

# Verdict notes rule

A verdict is only worth its reasons. The binary holds no notes length: this
rule belongs to the gates that list it in `after`, and a gate that does not
list it records its judge's verdict as given.

The rule: each judge's own notes hold at least 40 characters that are not
whitespace. It applies to an accept exactly as it does to a reject — a
one-word "looks good" is the failure mode this exists to catch. When a judge
falls short the check names it and exits 1, the gate's result becomes reject,
and the judge's raw answer is kept on the gate.run.

A carried result or a check gate has no `members`; nothing is judged and the
check passes.

```sh
set -u
min=40
p=$(cat)
n=$(printf '%s' "$p" | jq '.members // [] | length') || { echo "the payload is not JSON"; exit 2; }
failed=0
i=0
while [ "$i" -lt "$n" ]; do
  binding=$(printf '%s' "$p" | jq -r ".members[$i].binding")
  result=$(printf '%s' "$p" | jq -r ".members[$i].result")
  count=$(printf '%s' "$p" | jq ".members[$i].notes // \"\" | gsub(\"\\\\s\"; \"\") | length")
  if [ "$count" -lt "$min" ]; then
    echo "the judge gave no reasons: $binding answered $result with $count characters of notes (this gate's notes rule wants at least $min)"
    failed=1
  fi
  i=$((i + 1))
done
exit "$failed"
```
