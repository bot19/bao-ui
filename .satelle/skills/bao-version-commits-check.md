---
name: bao-version-commits-check
scope: project
type: skill
tags: [type:skill, type:reviewer, type:functional-check]
description: Functional-check on entry to done — for a story tagged `version:X.Y.Z`, committed package.json is at that version and every non-merge commit since the engagement baseline starts with `[X.Y.Z]`. `version:none` opts out. Deterministic and self-contained.
---

# Version commits check (close gate)

The close-side partner of [[bao-story-version-check]]. For a story tagged
`version:X.Y.Z` it accepts only when:

- there is at least one commit since the story's engagement baseline
  (`satelle story diff <id> --json` → `baseline_sha`),
- every non-merge commit in `baseline..HEAD` has a subject starting `[X.Y.Z]`
  (`.githooks/commit-msg` adds it), and
- `package.json` at `HEAD` is at `X.Y.Z`.

A story tagged `version:none`, or with no `version:` tag (the start gate was
waived), is accepted untouched.

```check
#!/usr/bin/env bash
set -uo pipefail

payload=$(cat)
sid=$(printf '%s' "$payload" | grep -oE '"id":[[:space:]]*"sty_[a-f0-9]+"' | head -1 | grep -oE 'sty_[a-f0-9]+')
if [ -z "$sid" ]; then
  echo "could not read the story id from the transition payload"
  exit 1
fi

story=$(satelle story get "$sid" --json 2>&1) || { echo "cannot read $sid: $story"; exit 1; }
tags=$(printf '%s\n' "$story" | awk '/^  "tags": \[\]/{next} /^  "tags": \[/{f=1;next} f&&/^  \]/{f=0} f{gsub(/^[ \t]*"|",?$/,""); print}')
vtag=$(printf '%s\n' "$tags" | grep '^version:' | head -1)

if [ -z "$vtag" ] || [ "$vtag" = "version:none" ]; then
  echo "$sid names no app version (${vtag:-no tag}); nothing to check"
  exit 0
fi
ver=${vtag#version:}

diff=$(satelle story diff "$sid" --json 2>&1) || { echo "cannot read $sid's baseline: $diff"; exit 1; }
base=$(printf '%s\n' "$diff" | sed -n 's/^[[:space:]]*"baseline_sha":[[:space:]]*"\([0-9a-f]*\)".*/\1/p' | head -1)
if [ -z "$base" ]; then
  echo "cannot resolve $sid's engagement baseline"
  exit 1
fi

fail=0
commits=$(git log --no-merges --format='%h %s' "$base..HEAD" 2>&1) || { echo "cannot list commits since $base: $commits"; exit 1; }
if [ -z "$commits" ]; then
  echo "$sid has no commits since its baseline ${base:0:7}. Commit the slice before done."
  fail=1
else
  bad=$(printf '%s\n' "$commits" | awk -v p="[$ver]" 'index(substr($0, index($0," ")+1), p) != 1')
  if [ -n "$bad" ]; then
    echo "These commits since ${base:0:7} lack the [$ver] prefix (reword them, or waive this check):"
    printf '  %s\n' "$bad"
    fail=1
  fi
fi

pkg=$(git show HEAD:package.json 2>/dev/null | sed -n 's/^  "version": "\([^"]*\)".*/\1/p' | head -1)
if [ "$pkg" != "$ver" ]; then
  echo "package.json at HEAD is ${pkg:-unreadable}, but $sid ships $ver. Run: npm version $ver --no-git-tag-version, then commit."
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  exit 1
fi
echo "$sid ships $ver: package.json matches and all $(printf '%s\n' "$commits" | grep -c .) commits carry [$ver]"
exit 0
```
