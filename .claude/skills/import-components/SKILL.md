---
name: import-components
description: "Import agents, skills, instructions, hooks, MCP servers, or prompts FROM another workspace INTO this template-repo, so they are included in every future new-repo bootstrap. Use when: 'import skill', 'copy skill from', 'bring in agent from', 'sync components from another workspace', 'add hook from project'."
argument-hint: "Optionally provide the source workspace path. If omitted, you will be prompted."
---

# Import Components

Selectively copy agents, skills, instructions, hooks, MCP servers, and prompts from any local workspace into `template-repo`, so they are baked into every future project bootstrapped with `new-repo`.

## Prerequisites

- This skill must be run from within the `template-repo` workspace.
- The source workspace must be a local directory (absolute path).

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| `source-workspace` | Yes | Absolute path to the source workspace directory |
| `component-selection` | Yes | Interactive — presented after discovery |

---

## Procedure

### Step 1 — Resolve source workspace

If no path was provided, ask the user:

> "What is the path to the source workspace you want to import from? (e.g. `/Users/you/git-local/my-project`)"

Verify the directory exists. If not, report the error and stop.

---

### Step 2 — Discover available components

Scan the source workspace for all importable components. Build a categorised inventory:

#### Skills
```bash
ls <source>/.github/skills/    # directory names → each is a skill
ls <source>/.claude/skills/    # cross-check (should mirror .github/skills)
```

#### Agents
```bash
ls <source>/.github/agents/    # *.md or *.yml files
```

#### Instructions
```bash
ls <source>/.github/instructions/   # *.instructions.md files
```

#### Hooks
```bash
ls <source>/.github/hooks/          # *.json hook configs
ls <source>/.github/hooks/scripts/  # associated scripts
```

#### MCP Servers
```bash
cat <source>/.vscode/mcp.json       # "servers" keys → each is an MCP server entry
```
Parse the JSON and list each server name under `servers`.

#### Prompts
```bash
ls <source>/.github/prompts/        # *.md or *.prompt.md files
```

---

### Step 3 — Filter: exclude already-present components

For each discovered component, check whether it already exists in `template-repo`. Mark duplicates clearly (e.g. `[already present]`) — include them in the list so the user can choose to overwrite, but make duplicates opt-in rather than opt-out.

---

### Step 4 — Present menu and get selection

Display a structured list like:

```
Source: /path/to/source-workspace

SKILLS (3 found)
  [ ] meal-plan-to-yaml
  [✓] fresh-eyes-review  [already present — overwrite?]
  [ ] my-custom-skill

AGENTS (1 found)
  [ ] food-planner

INSTRUCTIONS (0 found)
  (none)

HOOKS (1 found)
  [ ] post-tool-use (post-file-write.py)

MCP SERVERS (0 found)
  (none)

PROMPTS (0 found)
  (none)
```

Ask the user which items to import. Accept a response like:
- `all` — import everything not already present
- `all including existing` — import everything, overwrite duplicates
- A comma-separated list of names: `meal-plan-to-yaml, food-planner, post-tool-use`
- `none` — cancel

---

### Step 5 — Copy selected components

Execute the copies. For each category:

#### Skills
Copy the entire skill directory to **both** locations:
```bash
cp -r <source>/.github/skills/<name>/ .github/skills/<name>/
cp -r <source>/.github/skills/<name>/ .claude/skills/<name>/
```
If a `.claude/skills/<name>/` directory exists in the source and differs, use that as the source for `.claude/skills/` instead.

#### Agents
```bash
cp <source>/.github/agents/<file> .github/agents/<file>
```

#### Instructions
```bash
cp <source>/.github/instructions/<file> .github/instructions/<file>
```

#### Hooks

First, copy any scripts:
```bash
cp <source>/.github/hooks/scripts/<script> .github/hooks/scripts/<script>
```

Then **merge** the hook JSON config — do not overwrite. For each `*.json` in the source hooks directory:

1. Read the source JSON.
2. Read the corresponding file in `template-repo/.github/hooks/` (create it if missing).
3. Merge: for each hook event key (e.g. `PostToolUse`), append the source entries that don't already exist (compare by `command` field).
4. Write the merged JSON back.

#### MCP Servers

Merge entries into `.vscode/mcp.json` (create it if missing):

1. Read source `.vscode/mcp.json`.
2. Read `.vscode/mcp.json` in `template-repo` (or `{}`).
3. For each server in `source.servers`, add it to `template.servers` (skip if key already present, unless overwrite was chosen).
4. Write the merged JSON.

#### Prompts
```bash
cp <source>/.github/prompts/<file> .github/prompts/<file>
```

---

### Step 6 — Update `copilot-instructions.md`

If any **new skills** were imported:

1. Open `.github/copilot-instructions.md`.
2. Locate the skills table (the `| Skill | When to use |` table).
3. For each new skill, add a row:
   - Skill name (back-tick wrapped)
   - Read the `description:` field from the skill's `SKILL.md` to extract a short "When to use" summary (take the text after "Use when:" if present, otherwise use the first sentence of the description).
4. Write the updated file.

---

### Step 7 — Report

Print a summary:

```
✅ Import complete from /path/to/source

Imported:
  Skills:        meal-plan-to-yaml, my-custom-skill  → .github/skills/ + .claude/skills/
  Agents:        food-planner                         → .github/agents/
  Instructions:  (none)
  Hooks:         (none)
  MCP Servers:   (none)
  Prompts:       (none)

copilot-instructions.md updated with 2 new skill entries.

Run `new-repo` to bootstrap a project that includes these components.
```

---

### Step 8 — Invoke `repo-memory`

After all copies are done, invoke the `repo-memory` skill to update `.github/memory/`.

---

## Notes

- **Never import `.git/`, `.vscode/settings.json`, or project-specific config files** (e.g. `package.json`, `pyproject.toml`, `.env`).
- Hook JSON merging must be additive — never remove existing hooks in `template-repo`.
- MCP server entries that reference `${workspaceFolder}` are workspace-relative; warn the user that these paths may need adjustment after import.
- If the source workspace is itself a child of `template-repo` (bootstrapped via `new-repo`), its skills are likely already identical — flag this to the user.
- Skills are always synced to **both** `.github/skills/` and `.claude/skills/` because Copilot and Claude Code use different roots.
