# Copilot Instructions

## Memory

- Store all memory, plans, and instructions in `.github/memory/` (repo-scoped).
- Never write memory outside the workspace.
- After any response that creates, modifies, or deletes a file, invoke the `repo-memory` skill to update `.github/memory/`.

## Memory — two directories

When working **within template-repo itself**, write memory to `.github/memory-dev/` (not `.github/memory/`):

| Directory | Purpose | Copied to new repos? |
|-----------|---------|----------------------|
| `.github/memory/` | Blank scaffold — placeholder that child repos start from | ✅ Yes |
| `.github/memory-dev/` | template-repo's own dev memory (skills, architecture decisions) | ❌ No |

The `repo-memory` skill, when invoked inside template-repo, should write to `.github/memory-dev/`.

## Skills available in this workspace

| Skill | When to use |
|-------|------------|
| `repo-memory` | After any file change — keeps `.github/memory/` up to date |
| `fresh-eyes-review` | Before commit, PR, or declaring work done |
| `wip-commit` | Before any refactor — commits a safe rollback point |
| `ts-check` | After TypeScript changes — runs `tsc --noEmit` and fixes errors |
| `simmer` | Iterative refinement of an artifact over multiple rounds |
| `test-kitchen` | Parallel exploration or competition between implementations |
| `new-repo` | Bootstrap a new project from this template |
| `import-components` | Import skills, agents, instructions, hooks, or MCP servers from another workspace into this template |
| `sync-from-template` | Pull updated skills, agents, instructions, hooks, or MCP servers from template-repo into an existing workspace |
| `anonymize-pii` | Anonymize PII in text before sharing with any cloud model |
| `code-task-delegate` | Route code tasks to the appropriate local-coder MCP tool |

## Local model MCP servers

### local-coder (if configured)

When a `local-coder` MCP server is available, prefer its tools for:
- Adding docstrings / inline comments → `write_docstrings`
- Writing unit tests → `generate_tests`
- Scaffolding boilerplate → `generate_boilerplate`
- Summarizing a large file → `summarize_code`
- Narrow refactors (type hints, renames, imports) → `simple_refactor`

Use the primary model for architecture decisions, complex logic, cross-file reasoning, and security review.

### local-anonymizer (if configured)

When a `local-anonymizer` MCP server is available:
- Anonymize PII before sharing sensitive text with cloud models → `anonymize_text`
- Use the `anonymize-pii` skill as the primary interface
