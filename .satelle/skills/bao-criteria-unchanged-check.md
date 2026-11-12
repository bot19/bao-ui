---
name: bao-criteria-unchanged-check
type: check
description: Close gate on in_progress -> ready. Rebuilds the story's criteria and body as they stood at the operator's most recent approval, from the ledger, and compares them with the story now. Any criterion added or removed after the approval, or an edited body, is a rejection - the done judge measures against live story text, so an edit made during the build silently moves the yardstick. Deterministic, no agent.
---

# Criteria unchanged (in_progress -> ready)

`bao-story-intent-review` checks the criteria on the way **into** `in_progress`.
`bao-story-done-review` then measures the diff against the criteria **as they
stand when it runs**. It holds no memory of what the operator approved, so a
story whose criteria were edited mid-build is judged, correctly and
consistently, against a story the operator never signed.

Nothing else catches this. The seat watches the git diff, not the item;
`bao-workflow-change-review` only wakes on a diff that touches `.satelle/`; and
`satelle story set --remove-criteria` / `--criteria --replace` are ordinary
verbs available in any session.

The ledger does catch it. Every field edit is an `item.updated` event carrying
the new value, hash-chained and timestamped, and the operator's approval is an
`attachment.added` event with `operator: true`. Replaying the chain gives both
the approved text and the current text.

Accepts when the criteria list and the body are identical to what they were at
the newest operator approval. An edit that was later reverted therefore passes:
what is compared is the text, not the number of events.

`title` and `tags` are deliberately not compared — a version tag is routinely
added between approval and engagement, and the title is orientation rather than
specification.

A criterion that turns out to be wrong is not an obstacle to route around. Take
the story back to `plan` (`satelle story set <id> --status plan`), fix it, and
collect a second approval. That is one extra sign-off, which is the point.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
cd "$(git rev-parse --show-toplevel)" || exit 1

events=$(satelle ledger list "$sid" --json 2>&1) || {
  echo "cannot read the ledger for $sid: $events"; exit 1; }

out=$(printf '%s' "$events" | jq -r '
  def norm: { criteria: (.criteria // []), body: (.body // "") };
  reduce .[] as $e (
    { cur: { criteria: [], body: "" }, approved: null, at: null };
    if $e.kind == "item.created" then
      .cur = ($e.payload | norm)
    elif $e.kind == "item.updated" then
        (if ($e.payload | has("criteria")) then .cur.criteria = $e.payload.criteria else . end)
      | (if ($e.payload | has("body")) then .cur.body = $e.payload.body else . end)
    elif $e.kind == "attachment.added" and ($e.payload.operator == true) then
      .approved = .cur | .at = $e.at
    else . end
  )
  | . as $s
  | if $s.approved == null then "NOAPPROVAL"
    else
      # Compared with leading/trailing whitespace trimmed, so a stray newline
      # is not a rejection while any real edit still is.
        ($s.approved.criteria | map(gsub("^\\s+|\\s+$"; ""))) as $ac
      | ($s.cur.criteria      | map(gsub("^\\s+|\\s+$"; ""))) as $cc
      | ($s.approved.body     | gsub("^\\s+|\\s+$"; "")) as $ab
      | ($s.cur.body          | gsub("^\\s+|\\s+$"; "")) as $cb
      | if $ac == $cc and $ab == $cb then
          "OK " + $s.at
        else
          ( [ "the story was edited after the approval recorded at " + $s.at + ":" ]
            + ( ($ac - $cc) | map("  criterion removed: " + .) )
            + ( ($cc - $ac) | map("  criterion added:   " + .) )
            + ( if $ab != $cb then [ "  the body was edited" ] else [] end )
          ) | join("\n")
        end
    end
') || { echo "cannot replay the ledger for $sid"; exit 1; }

case $out in
  "OK "*)
    echo "$sid: criteria and body are as approved at ${out#OK }"
    exit 0 ;;
  NOAPPROVAL)
    echo "$sid carries no operator approval on its ledger, so it cannot have left signoff"
    exit 1 ;;
esac

echo "$sid: $out"
echo "restore the approved text, or take it back to plan for a second sign-off:"
echo "  satelle story set $sid --status plan"
exit 1
```
