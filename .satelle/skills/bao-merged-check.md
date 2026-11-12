---
name: bao-merged-check
type: check
description: The only gate of ready -> done. Confirms the story's branch is an ancestor of origin/main, so a story reaches done only once its work is actually on main. Shipping is optional and yours to start; this check only refuses the claim when it is not true.
---

# Released: on main (ready -> done)

`ready` means built; `done` means shipped. Nothing on this lane moves a story
here on its own — you merge or open the PR when you want main to move, then
present the transition.

This check refuses the claim when the work is not on main. It does not merge
anything.

```sh
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

git fetch origin main --quiet 2>/dev/null || echo "note: could not fetch origin; judging the local ref"

head=$(git rev-parse HEAD)
if git merge-base --is-ancestor "$head" origin/main 2>/dev/null; then
  echo "$(git rev-parse --short HEAD) is on origin/main"
  exit 0
fi

echo "$(git rev-parse --short HEAD) is not an ancestor of origin/main: the work is not shipped yet"
echo "merge the branch or complete its PR, then present this transition again"
exit 1
```
