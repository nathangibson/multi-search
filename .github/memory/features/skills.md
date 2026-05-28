# Skills

This workspace inherits a set of shared skills bootstrapped from `template-repo`.

## Available Skills

| Skill | When to use |
|-------|-------------|
| `repo-memory` | After any file change — keeps `.github/memory/` up to date |
| `fresh-eyes-review` | Before commit, PR, or declaring work done |
| `wip-commit` | Before any refactor — commits a safe rollback point |
| `ts-check` | After TypeScript changes — runs `tsc --noEmit` and fixes errors |
| `simmer` | Iterative refinement of an artifact over multiple rounds |
| `test-kitchen` | Parallel exploration or competition between implementations |
| `new-repo` | Bootstrap a new project from this workspace |
| `import-components` | Import skills/agents/instructions/hooks/MCP servers from another workspace into this one |
| `sync-from-template` | Pull updated components from `template-repo` into this workspace |

## Key Files

- `.github/skills/<name>/SKILL.md` — skill definition
- `.claude/skills/<name>/SKILL.md` — mirror for Claude Code
- `.github/copilot-instructions.md` — skills table loaded on every Copilot turn

## Adding Skills

- To bring a skill in from another workspace: use `import-components` (run from this workspace).
- To pull updates from `template-repo`: use `sync-from-template` (run from this workspace).
