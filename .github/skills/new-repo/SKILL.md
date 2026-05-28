---
name: new-repo
description: "Bootstrap a new project from template-repo. Use when: starting a new coding project, 'create new repo', 'new project', 'bootstrap project'. Copies all skills, agents, instructions, hooks, and memory scaffold into a new local directory and initialises git."
argument-hint: "Provide the new repo name (kebab-case) and optionally a one-sentence description."
---

# New Repo

Bootstrap a new project directory from `template-repo`, so it inherits all shared skills, instructions, hooks, and memory infrastructure.

## Prerequisites

- This skill must be invoked from within the `template-repo` workspace.
- The sibling directory `../` (i.e., the parent of `template-repo`) is where the new repo will be created — keeping everything local to the same workspace root.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| `repo-name` | Yes | Kebab-case name for the new project directory |
| `description` | No | One sentence — written into `README.md` and memory `index.md` |

## Procedure

### 1. Confirm with user

Before proceeding, confirm:
- The repo name (and that a directory with that name does not already exist alongside `template-repo`)
- The description (or leave blank to fill in later)

### 2. Create the new directory

```bash
cd "$(git -C . rev-parse --show-toplevel)/.."   # parent of template-repo
rsync -a --exclude='.git' --exclude='.github/memory-dev' template-repo/ <repo-name>/
```

### 3. Initialise git

```bash
cd <repo-name>
git init
git add -A
git commit -m "init: bootstrap from template-repo

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

### 4. Personalise

If a description was provided:
- Update `README.md` (create it if it doesn't exist) with the project name and description.
- Update `.github/memory/index.md` — fill in the `## Purpose` line.

### 5. Report

Tell the user:
- Where the new repo lives (absolute path)
- Which skills are available
- Suggested next steps: open in VS Code, set up `.vscode/mcp.json` if using local-coder, start building

## Notes

- `.github/memory/` contains only the scaffold template — no previous project's memory is carried over.
- `.github/memory-dev/` is template-repo's own development memory and is **excluded from the rsync** — it never reaches child repos.
- The `new-repo` skill itself is copied into the new project, so every child repo can spawn further projects.
- Do **not** copy any `.vscode/` directory from projects other than `template-repo` — VS Code settings are project-specific.
- If `template-repo` ever gains new skills or instructions, re-run this skill on existing projects to pull in updates (or manually rsync the specific files).
