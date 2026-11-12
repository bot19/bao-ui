---
name: bao-checks
type: check
description: Second gate of in_progress -> ready. Runs bao-ui's own build and test commands on the committed HEAD; every one must pass for the story to close. Edit the run_checks function in this file when the repo gains a command - it is the single place the lane learns what green means.
---

# Checks (in_progress -> ready)

Green is defined here and nowhere else. Each command runs from the repo root on
the committed HEAD, and all of them must exit 0.

bao-ui today has no test script in `package.json`: `npm run build` is
`tsc --noEmit && vite build`, so this gate currently proves the types check and
the bundle builds. **Add the test command below the moment the repo has one** —
until then "green" means compiled, not tested.

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

if [ "$fail" -eq 0 ]; then
  echo "all checks passed on $(git rev-parse --short HEAD)"
fi
exit "$fail"
```
