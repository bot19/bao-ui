---
name: bao-story-reviewed-check
type: check
description: First gate of signoff -> in_progress. Rebuilds the story's body and criteria as they stood when the lane last admitted it to signoff, from the ledger, and compares them with the story now. A body or criterion edited while it waited for the operator is a rejection - bao-story-create-review judged the earlier text, so the operator approved a story no content judge has read. Deterministic, no agent.
---

# Story reviewed (signoff -> in_progress)

`bao-story-structure-check` and `bao-story-create-review` run on
`plan -> signoff`, and the judge's whole purpose is to spend its attention
before the operator spends theirs. Once the item is in `signoff`, nothing
re-runs them. `satelle story set` still edits the body and the criteria, so a
revision made while the story waits reaches the operator unjudged.

`bao-story-intent-review` does read the presented text afterwards, but to a
narrower bar — may work begin: a title, a body that states behaviour, numbered
testable criteria. It does not ask the create judge's questions about
coherence, alignment and scope.

The ledger holds both texts. Every field edit is an `item.updated` event
carrying the new value, and every arrival in `signoff` is an
`item.transitioned` event recorded after that transition's gates accepted.
Replaying the chain to the newest `plan -> signoff` gives the text the judge
accepted; replaying to the end gives the text now.

Accepts when the body and the criteria are identical to what they were at that
arrival. An edit that was later reverted therefore passes: what is compared is
the text, not the number of events.

`title` and `tags` are deliberately not compared, matching
`bao-criteria-unchanged-check` — a `version:` tag is routinely added between
review and engagement, and the title is orientation rather than specification.

Its sibling guards the next window. This one asks whether the operator read
what the judge accepted; `bao-criteria-unchanged-check` asks whether the
builder shipped what the operator approved.

A revision is not an obstacle to route around. Take the story back to `plan`
(`satelle story set <id> --status plan`), revise it there, and present
`plan -> signoff` again. That costs one more sign-off, which is the point.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
cd "$(git rev-parse --show-toplevel)" || exit 1

events=$(satelle ledger list "$sid" --json 2>&1) || {
  echo "cannot read the ledger for $sid: $events"; exit 1; }

out=$(printf '%s' "$events" | jq -r '
  def norm: { criteria: (.criteria // []), body: (.body // "") };
  reduce .[] as $e (
    { cur: { criteria: [], body: "" }, reviewed: null, at: null };
    if $e.kind == "item.created" then
      .cur = ($e.payload | norm)
    elif $e.kind == "item.updated" then
        (if ($e.payload | has("criteria")) then .cur.criteria = $e.payload.criteria else . end)
      | (if ($e.payload | has("body")) then .cur.body = $e.payload.body else . end)
    elif $e.kind == "item.transitioned"
         and $e.payload.from == "plan" and $e.payload.to == "signoff" then
      .reviewed = .cur | .at = $e.at
    else . end
  )
  | . as $s
  | if $s.reviewed == null then "NOREVIEW"
    else
      # Compared with leading/trailing whitespace trimmed, so a stray newline
      # is not a rejection while any real edit still is.
        ($s.reviewed.criteria | map(gsub("^\\s+|\\s+$"; ""))) as $rc
      | ($s.cur.criteria      | map(gsub("^\\s+|\\s+$"; ""))) as $cc
      | ($s.reviewed.body     | gsub("^\\s+|\\s+$"; "")) as $rb
      | ($s.cur.body          | gsub("^\\s+|\\s+$"; "")) as $cb
      | if $rc == $cc and $rb == $cb then
          "OK " + $s.at
        else
          ( [ "the story was edited after the content judge accepted it at " + $s.at + ":" ]
            + ( ($rc - $cc) | map("  criterion removed: " + .) )
            + ( ($cc - $rc) | map("  criterion added:   " + .) )
            + ( if $rb != $cb then [ "  the body was edited" ] else [] end )
          ) | join("\n")
        end
    end
') || { echo "cannot replay the ledger for $sid"; exit 1; }

case $out in
  "OK "*)
    echo "$sid: body and criteria are as accepted at ${out#OK }"
    exit 0 ;;
  NOREVIEW)
    echo "$sid carries no plan -> signoff transition on its ledger, so no content judge has accepted it"
    echo "take it to plan and present the transition:"
    echo "  satelle story set $sid --status plan"
    exit 1 ;;
esac

echo "$sid: $out"
echo "restore the accepted text, or take it back to plan so the judge reads the revision:"
echo "  satelle story set $sid --status plan"
exit 1
```
