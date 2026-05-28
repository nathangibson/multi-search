---
name: code-task-delegate
description: Route code tasks to the appropriate local-coder MCP tool (local model, server model, or Claude). Use when user asks to document, test, refactor, review, explain, or generate code without specifying which tool to use.
---

# Code Task Delegator

Route code tasks to the optimal tier: local model (fast/free) → server model (medium complexity) → Claude (complex reasoning).

## Decision Tree

### 1. Documentation Tasks
**Triggers:** "add docstrings", "document this", "add comments"

→ **Use `write_docstrings` (local model)**
- Straightforward task, no reasoning needed
- Works for any language

### 2. Testing Tasks
**Triggers:** "write tests", "add tests", "test this function"

**Decision:**
- Simple function/class with no complex dependencies? → `generate_tests` (local)
- Class with mocking, fixtures, or complex setup? → `generate_tests_deep` (server, fallback to Claude)

### 3. Code Generation/Scaffolding
**Triggers:** "create boilerplate", "scaffold", "generate CRUD", "create data class"

→ **Use `generate_boilerplate` (local model)**
- CRUD endpoints, data classes, CLI scaffolds, config parsers
- Repetitive patterns that don't require design decisions

**Exception:** If the request involves architecture decisions or cross-file coordination → Use Claude directly

### 4. Summarization
**Triggers:** "summarize this file", "what does this do" (for large files)

→ **Use `summarize_code` (local model)**
- Use when file is too large to include in main context
- Output: 3-5 bullet points

**Exception:** If user asks a specific question about the code → Use `explain_code` (server) instead

### 5. Code Review
**Triggers:** "review this", "find bugs", "security check", "check for issues"

→ **Use `review_code` (server model, fallback to Claude)**
- Covers bugs, security, performance, style
- If server unavailable (RuntimeError), do the review yourself

### 6. Code Explanation
**Triggers:** "explain this", "how does this work", "why does this..."

→ **Use `explain_code` (server model, fallback to Claude)**
- Complex algorithms, library usage, non-obvious logic
- If server unavailable, explain it yourself

### 7. Refactoring
**Triggers:** "refactor this", "clean this up", "rename", "extract function"

**Decision:**
- **Simple, mechanical refactor** (add type hints, rename symbol, sort imports, extract function) → `simple_refactor` (local)
- **Architectural refactor** (change structure, multi-file, design patterns) → Claude directly

## Workflow Pattern

When implementing a feature from scratch:
1. **Plan** (Claude) - Architecture and approach
2. **Scaffold** (`generate_boilerplate`) - Repetitive structure
3. **Implement** (Claude) - Complex business logic
4. **Document** (`write_docstrings`) - Add docs to finished code
5. **Test** (`generate_tests` or `generate_tests_deep`) - Unit tests
6. **Refactor** (`simple_refactor`) - Clean up passes
7. **Review** (`review_code`) - Final check before commit

## Fallback Strategy

If a tool fails or returns poor results:
1. **RuntimeError** = Server model not available → Use Claude
2. **Poor output** = Try once more with refined prompt, then do it yourself
3. **Task too complex** = Skip the tool and use Claude directly

## When NOT to Delegate

- Cross-file reasoning or architectural decisions
- Debugging issues (requires context understanding)
- Anything requiring judgment about business requirements
- Tasks that need to understand existing patterns in the codebase

For these, use Claude's native capabilities instead.
