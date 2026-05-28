#!/usr/bin/env python3
"""
PostToolUse hook: injects a system message reminding the agent to invoke
the repo-memory skill after any file-write tool call.
"""
import json
import sys

WRITE_TOOLS = {
    "create_file",
    "replace_string_in_file",
    "multi_replace_string_in_file",
    "edit_file",
    "write_file",
}

def main():
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        sys.exit(0)

    tool_name = data.get("tool_name") or data.get("toolName") or ""

    if tool_name.lower() not in WRITE_TOOLS:
        sys.exit(0)

    output = {
        "systemMessage": (
            "A file was just written. "
            "Before finishing this response, invoke the `repo-memory` skill "
            "to update `.copilot/memory/` with any relevant changes."
        )
    }
    print(json.dumps(output))
    sys.exit(0)

if __name__ == "__main__":
    main()
