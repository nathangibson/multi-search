---
name: ts-check
description: Run TypeScript build check and fix all errors. Use after any code changes to confirm no type errors before testing or committing. Triggers on "check types", "build check", "tsc", "type errors".
---

# TypeScript Build Check

Run `npx tsc --noEmit` and fix all reported errors before marking any phase done.

## Process

1. Run the compiler:
   ```bash
   npx tsc --noEmit
   ```

2. If errors appear, read each one, locate the file and line, and fix it. Common issues in this codebase:
   - Missing properties on the `Level` return object → check `src/types/index.ts`
   - Puzzle UI class imported in the wrong place or not at all → check `src/core/Game.ts`
   - Missing `break` or `return` in a `case` block in `levelBuilder.ts`
   - Using `any` — add an explicit type or a typed cast with a comment explaining why

3. Re-run after each round of fixes. Repeat until output is clean (exit 0, no errors).

4. **Never mark this step done while type errors remain.** A clean build is a hard gate, not optional.
