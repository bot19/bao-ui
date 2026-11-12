---
name: bao-workflow-change-trigger
type: check
description: Relevance trigger for the workflow-change gate on in_progress -> ready. Exit 0 when the story's diff touches .satelle/, so the gate runs; exit 1 when it does not, so the gate is recorded skipped and costs no dispatch. Deterministic, no agent.
---

# Workflow change trigger

Most stories never touch the process. This trigger keeps the workflow-change
judge off those: the gate is recorded `skipped` with this output as its notes,
and no agent is dispatched.

```sh
set -u
sid=${SATELLE_ITEM:?SATELLE_ITEM is not set}
paths=$(satelle story diff "$sid" 2>/dev/null) || { echo "could not read $sid's diff; judging anyway"; exit 2; }

if printf '%s\n' "$paths" | grep -q '^\.satelle/'; then
  echo "the change touches .satelle/:"
  printf '%s\n' "$paths" | grep '^\.satelle/'
  exit 0
fi

echo "the change touches no path under .satelle/"
exit 1
```
