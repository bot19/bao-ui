---
name: bao-version-commits-check
type: check
description: Close gate on in_progress -> ready, the partner of bao-story-version-check. For a story tagged version:X.Y.Z it requires package.json at HEAD to be at exactly that version and every non-merge commit since the story's base to start with [X.Y.Z]. A story tagged version:none is accepted untouched. Deterministic, no agent.
---

# Version commits (in_progress -> ready)

What the entry gate promised, this one collects. For a story tagged
`version:X.Y.Z` it accepts only when:

- there is at least one commit since the story's base (`SATELLE_BASE`);
- every non-merge commit in `base..HEAD` has a subject starting `[X.Y.Z]` —
  `.githooks/commit-msg` adds that prefix automatically while the story is in
  `in_progress`, so a failure here usually means a commit was made before the
  story was engaged, or with `--no-verify`; and
- `package.json` at `HEAD` is at exactly `X.Y.Z`.

A story tagged `version:none` is accepted untouched.

Fixing a missing prefix means rewording the commit — `git rebase` is
interactive, so for a single commit `git commit --amend` is usually the way.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
base=${SATELLE_BASE:?SATELLE_BASE is not set}
cd "$(git rev-parse --show-toplevel)" || exit 1

story=$(satelle story get "$sid" --json 2>&1) || { echo "cannot read $sid: $story"; exit 1; }
vtag=$(printf '%s' "$story" | jq -r '.tags // [] | map(select(startswith("version:"))) | first // ""')

if [ -z "$vtag" ] || [ "$vtag" = "version:none" ]; then
  echo "$sid names no app version (${vtag:-no tag}); nothing to check"
  exit 0
fi
ver=${vtag#version:}

fail=0
commits=$(git log --no-merges --format='%h %s' "$base..HEAD" 2>&1) || {
  echo "cannot list commits since $base: $commits"; exit 1; }

if [ -z "$commits" ]; then
  echo "$sid has no commits since its base $(git rev-parse --short "$base"); commit the work before closing"
  fail=1
else
  bad=$(printf '%s\n' "$commits" | awk -v p="[$ver]" '{ s = substr($0, index($0," ")+1); if (index(s, p) != 1) print }')
  if [ -n "$bad" ]; then
    echo "these commits lack the [$ver] prefix; reword them:"
    printf '%s\n' "$bad" | sed 's/^/  /'
    fail=1
  fi
fi

pkg=$(git show HEAD:package.json 2>/dev/null | jq -r '.version // empty')
if [ "$pkg" != "$ver" ]; then
  echo "package.json at HEAD is ${pkg:-unreadable}, but $sid ships $ver"
  echo "run: npm version $ver --no-git-tag-version, then commit"
  fail=1
fi

[ "$fail" -eq 0 ] || exit 1
echo "$sid ships $ver: package.json matches and all $(printf '%s\n' "$commits" | grep -c .) commit(s) carry [$ver]"
```
