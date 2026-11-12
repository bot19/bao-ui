---
name: bao-committed-check
type: check
description: First gate of in_progress -> ready. ready means committed, so this refuses a dirty tree and a detached HEAD before the build runs. The judges that follow read the committed diff; an uncommitted change is invisible to them, so letting one through would close a story over work nobody judged.
---

# Committed (in_progress -> ready)

`ready` on this lane means the work is committed on the story's branch. The
judges after this gate read the diff from the seat's base to HEAD, so anything
left uncommitted is work no judge saw. Refuse it here rather than close a
story over it.

Pushing is not required: bao-ui is a personal repo and the branch may stay
local until you decide to ship it.

```sh
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" = "HEAD" ] && { echo "HEAD is detached; check out the story's branch"; exit 1; }

dirty=$(git status --porcelain)
if [ -n "$dirty" ]; then
  echo "the tree is not clean on $branch; commit the work before closing the story:"
  printf '%s\n' "$dirty"
  exit 1
fi

echo "clean tree on $branch at $(git rev-parse --short HEAD)"
```
