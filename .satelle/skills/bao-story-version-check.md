---
name: bao-story-version-check
type: check
description: Entry gate on signoff -> in_progress. A story names the app version it ships as a single version:X.Y.Z tag, not lower than package.json's. version:none opts a story out. The tag is what .githooks/commit-msg reads to prefix each commit, so a story without one produces unprefixed commits that the close gate then refuses. Deterministic, no agent.
---

# Story version (signoff -> in_progress)

A release traces from story to commit to `package.json`. The story names the
app version it ships, once, before any work starts — because
`.githooks/commit-msg` reads that tag to prefix every commit as it is made.
Tag the story after the first commit and the earlier commits are already
unprefixed, and only a reword fixes them.

Accepts when the story:

- carries `version:none`, which opts it out (a chore, a doc fix, a spike), or
- carries exactly one `version:X.Y.Z` tag whose version is **not lower** than
  `package.json`'s.

Its close-side partner is `bao-version-commits-check`, which requires
`package.json` to have reached that exact version by the time the story closes.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
cd "$(git rev-parse --show-toplevel)" || exit 1

story=$(satelle story get "$sid" --json 2>&1) || { echo "cannot read $sid: $story"; exit 1; }
vtags=$(printf '%s' "$story" | jq -r '.tags // [] | .[] | select(startswith("version:"))')

if printf '%s\n' "$vtags" | grep -qx 'version:none'; then
  echo "$sid is tagged version:none; it ships no app version"
  exit 0
fi

fix="add one with: satelle story set $sid --add-tag version:X.Y.Z (or version:none to opt out)"
count=$(printf '%s\n' "$vtags" | grep -c . || true)

if [ "$count" -eq 0 ]; then
  echo "$sid has no version: tag naming the app version it ships; $fix"
  exit 1
fi
if [ "$count" -gt 1 ]; then
  echo "$sid carries $count version: tags ($(printf '%s ' $vtags)); keep exactly one"
  exit 1
fi

ver=${vtags#version:}
case $ver in
  [0-9]*.[0-9]*.[0-9]*) ;;
  *) echo "$sid has version:$ver, which is not X.Y.Z; $fix"; exit 1 ;;
esac
printf '%s' "$ver" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$' || {
  echo "$sid has version:$ver, which is not X.Y.Z; $fix"; exit 1; }

pkg=$(jq -r '.version // empty' package.json) || pkg=""
[ -n "$pkg" ] || { echo "cannot read version from package.json"; exit 1; }

# lower A B -> exit 0 when semver A < B
lower() {
  awk -v a="$1" -v b="$2" 'BEGIN { split(a,x,"."); split(b,y,".");
    for (i=1;i<=3;i++) { if (x[i]+0<y[i]+0) exit 0; if (x[i]+0>y[i]+0) exit 1 } exit 1 }'
}
if lower "$ver" "$pkg"; then
  echo "$sid ships $ver, lower than package.json ($pkg); pick $pkg or higher"
  exit 1
fi

echo "$sid ships app version $ver (package.json is $pkg)"
```
