---
name: wip-commit
description: Stage all changes and commit a WIP checkpoint before a refactor. Use before any refactor to preserve the current working state. Triggers on "commit checkpoint", "save before refactor", "wip commit", "checkpoint".
---

# WIP Checkpoint Commit

Stage everything and commit a checkpoint before starting a refactor. This preserves a clean rollback point.

## Process

1. Confirm what refactor is about to happen (use context from the conversation — do not ask if it's already clear).

2. Run:
   ```bash
   git add -A && git commit -m "wip: before [X] refactor"
   ```
   Replace `[X]` with a short description of the upcoming refactor (e.g., "puzzle base class", "tile puzzle", "scene helpers").

3. Confirm the commit was created:
   ```bash
   git log --oneline -1
   ```

The refactor can now proceed. If something goes wrong, `git reset --hard HEAD~1` returns to this state.
