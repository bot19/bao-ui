---
name: bao-story-version-check
scope: project
type: skill
tags: [type:skill, type:reviewer, type:functional-check]
description: Functional-check on entry to in_progress — a working-lane story must carry a `version:X.Y.Z` tag naming the app version it ships, not lower than package.json's. `version:none` opts out. Deterministic and self-contained.
---

# Story version check (start gate)

A story names the app version it ships so a release traces from story to commit
to `package.json`. On entry to `in_progress` this check accepts when the story:

- carries `version:none` (opted out), or
- carries exactly one `version:X.Y.Z` tag whose version is **not lower** than
  `package.json`'s `version`.

Otherwise it rejects and names the fix (`satelle story set <id> --tags …`).
Its close-side partner is [[bao-version-commits-check]].

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
vtags=$(printf '%s\n' "$tags" | grep '^version:' || true)

if printf '%s\n' "$vtags" | grep -qx 'version:none'; then
  echo "$sid is tagged version:none; no app version required"
  exit 0
fi

fix="Add one with: satelle story set $sid --tags version:X.Y.Z (or version:none to opt out)"
count=$(printf '%s\n' "$vtags" | grep -c . || true)
if [ "$count" -eq 0 ]; then
  echo "$sid has no version: tag naming the app version it ships. $fix"
  exit 1
fi
if [ "$count" -gt 1 ]; then
  echo "$sid has $count version: tags ($(printf '%s ' $vtags)); keep exactly one."
  exit 1
fi

ver=${vtags#version:}
if ! printf '%s' "$ver" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "$sid has version:$ver, which is not X.Y.Z. $fix"
  exit 1
fi

pkg=$(sed -n 's/^  "version": "\([^"]*\)".*/\1/p' package.json | head -1)
if [ -z "$pkg" ]; then
  echo "cannot read version from package.json"
  exit 1
fi

# lower A B: exit 0 when semver A < B.
lower() {
  awk -v a="$1" -v b="$2" 'BEGIN { split(a,x,"."); split(b,y,".");
    for (i=1;i<=3;i++) { if (x[i]+0<y[i]+0) exit 0; if (x[i]+0>y[i]+0) exit 1 } exit 1 }'
}
if lower "$ver" "$pkg"; then
  echo "$sid targets $ver, lower than package.json ($pkg). Pick $pkg or higher."
  exit 1
fi

echo "$sid ships app version $ver (package.json is $pkg)"
exit 0
```
