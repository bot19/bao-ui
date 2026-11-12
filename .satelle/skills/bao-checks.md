---
name: bao-checks
type: check
description: Second gate of in_progress -> ready. Runs bao-ui's build and its vitest suite on the committed HEAD; every one must pass for the story to close. Edit the run_checks function in this file when the repo gains a command - it is the single place the lane learns what green means.
---

# Checks (in_progress -> ready)

Green is defined here and nowhere else. Each command runs from the repo root on
the committed HEAD, and all of them must exit 0.

Today green means: `npm run build` (`tsc --noEmit && vite build`) type-checks
and bundles, and `npm test` (`vitest run`) passes. The suite is small — the
`src/lib` helpers — so the done judge still rests mostly on reading the diff.
A story that adds behaviour should add the test that proves it, and that test
runs here from then on.

```sh
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1

fail=0

run() {
  echo "--- $*"
  out=$("$@" 2>&1)
  rc=$?
  echo "$out" | tail -25
  if [ "$rc" -ne 0 ]; then
    echo "FAILED (exit $rc): $*"
    fail=1
  fi
}

# The checks. Add a line per command; nothing else in the lane needs changing.
run npm run build
run npm test

if [ "$fail" -eq 0 ]; then
  echo "all checks passed on $(git rev-parse --short HEAD)"
fi
exit "$fail"
```
