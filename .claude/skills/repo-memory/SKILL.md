---
name: repo-memory
description: "Update workspace memory after code changes. Use when: any file in the repo was created, modified, or deleted during a response. Updates .copilot/memory/ with a brief repo index and links to per-feature or per-architecture detail files. Never stores memory outside the repo."
argument-hint: "Briefly describe what changed (e.g. 'added cart component', 'refactored auth flow')"
---

# Repo Memory

Keeps `.copilot/memory/` accurate and lightweight after every code-changing response.

## When to Invoke

Run this skill **at the end of any response** that creates, modifies, or deletes a file in this repo. Skip for responses that only read files or answer questions.

## Memory Layout

```
.github/memory/
├── index.md           # One-screen repo overview — always kept brief
└── features/          # One file per significant feature or module
└── architecture/      # One file per architectural concern
```

### index.md contract

- **Max ~30 lines** — must load into context without bloat
- Sections:
  - `## Purpose` — one sentence describing what the app does
  - `## Stack` — key technologies, one line each
  - `## Features` — bullet list of feature names, each linking to `./features/<name>.md`
  - `## Architecture` — bullet list of concerns, each linking to `./architecture/<name>.md`
  - `## Recent Changes` — last 3–5 changes, newest first, with date (YYYY-MM-DD)

### Feature detail files (`./features/<name>.md`)

Created or updated when a feature is added or substantially changed. Include:
- What the feature does
- Key files / entry points
- Important implementation decisions

### Architecture detail files (`./architecture/<name>.md`)

Created or updated when an architectural concern is introduced or changed. Include:
- What problem it solves
- How it is implemented
- Constraints or tradeoffs

## Procedure

1. **Read** `.github/memory/index.md` if it exists.
2. **Determine** which memory files are affected by the changes made this response.
3. **Update `index.md`**:
   - Add or update the relevant `## Features` or `## Architecture` bullet + link.
   - Prepend a new entry to `## Recent Changes` (keep only the last 5).
   - Do **not** expand other sections beyond the 30-line budget.
4. **Create or update detail files** for any feature or architecture area that was meaningfully changed. Keep each file under ~60 lines.
5. **Do not** write to `/memories/`, `/memories/session/`, `.copilot/memory/`, or any path outside `.github/memory/`.

## File Naming

Use lowercase kebab-case matching the feature or module name:
- `features/product-list.md`
- `features/shopping-cart.md`
- `architecture/state-management.md`
- `architecture/api-client.md`
