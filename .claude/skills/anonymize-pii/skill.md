---
name: anonymize-pii
description: Anonymize PII in text before sharing it with any cloud model. Use when you have text containing names, emails, phone numbers, addresses, IDs, passwords, dates of birth, grades, or IP addresses that you want to sanitize first. Triggers on "anonymize this", "sanitize this", "remove PII", "scrub this", "clean this before sharing".
---

# Anonymize PII

Strips personal information from text using the local `local-anonymizer` MCP server before the sanitized result is used in any cloud prompt.

## Why this matters

Cloud models see everything in your prompt. Call this skill **before** pasting sensitive text into a question — the cloud model only ever receives the anonymized version.

## Process

1. **Extract the text** to anonymize from the user's message (everything after "anonymize this:" or similar, or the full pasted block).

2. **Call the MCP tool** — use the `local-anonymizer` server's `anonymize_text` tool. In VS Code Copilot the tool is named `local-anonymizer_anonymize_text`. Pass the full raw text as the `text` parameter.

   This sends the text to the local LM Studio model only — nothing leaves the machine.

3. **Return the anonymized result** clearly formatted, e.g.:
   ```
   Anonymized text:
   ─────────────────
   [NAME] ([EMAIL], [PHONE]) lives at [ADDRESS].
   Student ID: [ID_NUMBER], final grade: [GRADE].
   ─────────────────
   ```

4. **Remind the user** to use this sanitized version in their actual prompt.

## If the MCP server is unavailable

Report: "The `local-anonymizer` MCP server is not running. Start LM Studio and the server before sharing sensitive text with a cloud model."

Do not attempt to anonymize manually or pass the raw text anywhere.
