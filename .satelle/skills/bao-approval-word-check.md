---
name: bao-approval-word-check
type: check
description: First gate of signoff -> in_progress. satelle lets any operator record unlock any exit from signoff, so a record left by rework or cancel would unlock the build as well. This reads the operator's newest record since the story last entered signoff and accepts only when its first line is "approved". Deterministic, no agent.
---

# Approval word (signoff -> in_progress)

satelle refuses every exit from `signoff` until the operator has recorded
their word since the story entered it, but it does not read what the word
says. The operator verbs label it on the first line of the record:

| verb             | first line | moves the story to |
|------------------|------------|--------------------|
| `approve <id>`   | `approved` | (the session moves it forward) |
| `rework <id>`    | `rework`   | `plan`             |
| `cancel <id>`    | `cancel`   | `cancelled`        |

`rework` and `cancel` record and move in one command, so their record is
normally consumed by the move. This gate covers the case where it is not —
the move failed, or the record was made by hand — so that only an approval
ever lets a story into `in_progress`.

Replays the item's ledger: the newest `item.transitioned` into `signoff`
marks the entry, and the newest operator `attachment.added` named
`story-approval` after it is the operator's latest word. Its body is read by
sha with `satelle story attachment`.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
cd "$(git rev-parse --show-toplevel)" || exit 1

events=$(satelle ledger list "$sid" --json 2>&1) || {
  echo "cannot read the ledger for $sid: $events"; exit 1; }

latest=$(printf '%s' "$events" | jq -r '
  reduce .[] as $e (
    { entered: null, sha: null };
    if $e.kind == "item.transitioned" and $e.payload.to == "signoff" then
      .entered = $e.at | .sha = null
    elif $e.kind == "attachment.added"
         and $e.payload.name == "story-approval"
         and ($e.payload.operator // false)
         and .entered != null then
      .sha = $e.payload.sha256
    else . end
  )
  | if .entered == null then "NOENTRY"
    elif .sha == null then "NORECORD " + .entered
    else "SHA " + .sha end
') || { echo "cannot replay the ledger for $sid"; exit 1; }

case $latest in
  NOENTRY)
    echo "$sid has no entry into signoff on its ledger"; exit 1 ;;
  NORECORD*)
    echo "$sid has no operator record since it entered signoff at ${latest#NORECORD }"
    echo "the operator approves with: approve $sid"; exit 1 ;;
esac

sha=${latest#SHA }
body=$(satelle story attachment "$sid" story-approval --sha "$sha" 2>&1) || {
  echo "cannot read the operator's record $sha on $sid: $body"; exit 1; }

word=$(printf '%s\n' "$body" | head -n 1 | tr -d '[:space:]')
if [ "$word" = "approved" ]; then
  echo "$sid: the operator's latest word since entering signoff is an approval (${sha%"${sha#???????}"})"
  exit 0
fi

echo "$sid: the operator's latest word since entering signoff is \"$word\", not an approval"
echo "only an approval moves a story forward; the operator approves with: approve $sid"
exit 1
```
