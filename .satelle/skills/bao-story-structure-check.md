---
name: bao-story-structure-check
type: check
description: First gate of plan -> signoff. Deterministic structural check on the drafted story - a title, a body that states a goal, and at least two numbered acceptance criteria. It runs before the content judge so the judge never spends a dispatch on a story that is structurally empty, and before you read it so your time is never spent on one either.
---

# Story structure (plan -> signoff)

Structure only. Whether the criteria are any *good* is the content judge's
question, not this one's. This check exists so that neither the judge nor you
is ever handed a blank.

The rules:

- a title of at least 10 characters;
- a body of at least 120 characters;
- at least 2 acceptance criteria.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
item=$(satelle story get "$sid" --json 2>/dev/null) || { echo "could not read $sid"; exit 1; }

title=$(printf '%s' "$item" | jq -r '.title // ""')
body=$(printf '%s' "$item" | jq -r '.body // ""')
ncrit=$(printf '%s' "$item" | jq '[.criteria // .acceptance_criteria // [] | .[]] | length')

fail=0
[ "${#title}" -lt 10 ] && { echo "title is ${#title} characters; a story needs a title of at least 10"; fail=1; }
[ "${#body}" -lt 120 ] && { echo "body is ${#body} characters; state the goal in at least 120"; fail=1; }
[ "$ncrit" -lt 2 ] && { echo "$ncrit acceptance criteria; a story needs at least 2 numbered criteria"; fail=1; }

[ "$fail" -eq 0 ] && echo "structure ok: title ${#title} chars, body ${#body} chars, $ncrit criteria"
exit "$fail"
```
