---
name: sync-from-template
description: "Pull skills, agents, instructions, hooks, MCP servers, or prompts from template-repo INTO the current workspace. Use when: 'sync from template', 'update skills from template', 'pull latest skills', 'get new skills from template', 'update workspace from template-repo'."
argument-hint: "Optionally provide the path to template-repo. If omitted, the sibling directory ../template-repo is tried first."
---

# Sync From Template

Pull components (skills, agents, instructions, hooks, MCP servers, prompts) from `template-repo` into the **current** workspace so it stays up to date without a full re-bootstrap.

This is the counterpart to `import-components`:

| Skill | Direction |
|-------|-----------|
| `import-components` | any workspace → `template-repo` |
| `new-repo` | `template-repo` → new workspace |
| `sync-from-template` | `template-repo` → existing workspace ← **this skill** |

## Prerequisites

- Run this skill from **within the target workspace** (not from inside `template-repo`).
- `template-repo` must be accessible as a local directory.

---

## Procedure

### Step 1 — Locate template-repo

1. Try `../template-repo` relative to the current workspace root (the common case when repos are siblings).
2. If that directory does not exist, ask the user:
   > "Where is template-repo? (e.g. `/Users/you/git-local/template-repo`)"
3. Confirm the resolved path contains a `.github/skills/` directory. If not, report an error and stop.

---

### Step 2 — Discover components in template-repo

Scan `template-repo` for all importable components:

#### Skills
```bash
ls <template>/.github/skills/    # directory names
```

#### Agents
```bash
ls <template>/.github/agents/    # *.md / *.yml files
```

#### Instructions
```bash
ls <template>/.github/instructions/    # *.instructions.md files
```

#### Hooks
```bash
ls <template>/.github/hooks/           # *.json configs
ls <template>/.github/hooks/scripts/   # associated scripts
```

#### MCP Servers
Parse `<template>/.vscode/mcp.json` → list each key under `"servers"`.

#### Prompts
```bash
ls <template>/.github/prompts/    # *.md / *.prompt.md files
```

---

### Step 3 — Classify each component

For each discovered component, check whether it exists in the **current workspace** and label it:

| Label | Meaning |
|-------|---------|
| `[new]` | Not present in this workspace — safe to copy |
| `[up to date]` | Present and identical (byte-for-byte or same content) — skip by default |
| `[update available]` | Present but template version differs — opt-in overwrite |
| `[workspace-only]` | Only in this workspace (not in template) — never touched |

---

### Step 4 — Present menu and get selection

Display a structured list. Omit `[up to date]` items by default (they're noise), but mention the count. Example:

```
Template: /path/to/template-repo  →  Current workspace: /path/to/workspace-b

SKILLS
  [new]              meal-plan-to-yaml
  [update available] fresh-eyes-review
  [new]              import-components
  (3 already up to date — hidden)

AGENTS
  (all up to date — hidden)

INSTRUCTIONS
  [new]  python-package-security.instructions.md

HOOKS
  (all up to date — hidden)

MCP SERVERS
  (none in template)

PROMPTS
  (none in template)
```

Ask the user which items to sync:
- `all new` — import only `[new]` items (safe default)
- `all` — import `[new]` + overwrite all `[update available]`
- A comma-separated list of names: `meal-plan-to-yaml, fresh-eyes-review`
- `none` — cancel

---

### Step 5 — Copy selected components

Apply the same copy/merge logic as `import-components`, but sourcing from `template-repo`:

#### Skills
```bash
cp -r <template>/.github/skills/<name>/ .github/skills/<name>/
cp -r <template>/.github/skills/<name>/ .claude/skills/<name>/
```
Create `.claude/skills/` if it doesn't exist.

#### Agents
```bash
cp <template>/.github/agents/<file> .github/agents/<file>
```
Create `.github/agents/` if it doesn't exist.

#### Instructions
```bash
cp <template>/.github/instructions/<file> .github/instructions/<file>
```
Create `.github/instructions/` if it doesn't exist.

#### Hooks

Copy scripts first:
```bash
cp <template>/.github/hooks/scripts/<script> .github/hooks/scripts/<script>
```

Then **merge** each hook JSON file additively:
1. Read the template's hook JSON.
2. Read the corresponding file in the current workspace (or start from `{}`).
3. For each hook event key (e.g. `PostToolUse`), append entries from template that aren't already present (compare by `command` field).
4. Write the merged JSON back.

#### MCP Servers

Merge into `.vscode/mcp.json` (create if missing):
1. Read `<template>/.vscode/mcp.json`.
2. Read `.vscode/mcp.json` in the current workspace (or `{}`).
3. For each server key in template, add to workspace (skip if key already exists, unless overwrite was chosen).
4. Write merged JSON. Warn about any entries using `${workspaceFolder}` — the path is relative to template-repo and may need updating.

#### Prompts
```bash
cp <template>/.github/prompts/<file> .github/prompts/<file>
```

---

### Step 6 — Update `copilot-instructions.md`

If any **new skills** were synced:

1. Open `.github/copilot-instructions.md` in the **current workspace**. Create it if missing (use template's as a starting base).
2. Locate the skills table (`| Skill | When to use |`).
3. For each new skill, add a row — skill name (back-tick wrapped), and a "When to use" summary taken from the skill's `SKILL.md` description field (text after "Use when:" if present, else first sentence).
4. Do **not** remove rows for workspace-specific skills already in the table.

---

### Step 7 — Report

```
✅ Sync complete from /path/to/template-repo

Synced to /path/to/workspace-b:
  Skills:        meal-plan-to-yaml [new], fresh-eyes-review [updated]  → .github/skills/ + .claude/skills/
  Agents:        (none)
  Instructions:  python-package-security.instructions.md [new]         → .github/instructions/
  Hooks:         (none)
  MCP Servers:   (none)
  Prompts:       (none)

copilot-instructions.md updated with 1 new skill entry.
```

---

### Step 8 — Invoke `repo-memory`

After all copies are done, invoke the `repo-memory` skill to update `.github/memory/`.

---

## Notes

- **Never remove** skills, agents, or instructions that exist only in the target workspace — this skill is additive only.
- **Never sync** `.git/`, `README.md`, project-specific config files (`package.json`, `pyproject.toml`, `.env`), or `.github/memory/` (memory is workspace-specific).
- Hook merging is always additive — existing hook entries in the workspace are preserved.
- To sync in the *other* direction (workspace → template-repo), use the `import-components` skill from within `template-repo`.
- If you want to check what's changed in template-repo before syncing, you can diff manually:
  ```bash
  diff -rq --exclude='.git' <template>/.github/skills/ .github/skills/
  ```
