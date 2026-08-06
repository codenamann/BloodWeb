# Engineering Guide

This guide is derived from the core architectural principles of BloodWeb.

## Core Rules
- Always start with the `ARCHITECTURE.md` before implementing a feature.
- Follow the "Design Before Code" rule.
- Do not introduce UI features that do not map to the Domain Model.

## Development Workflow ("The Loop")
From the chat archive, the required learning and development loop is defined as:
**Naman thinks -> Naman attempts -> Claude reviews -> Naman corrects**

1. **Attempt First**: Before asking AI to write a file, you must take a 15-20 minute shot at writing it yourself based on the domain model.
2. **Form Hypotheses**: When stuck, formulate a hypothesis about what the code means before asking for the answer.
3. **No Line-by-Line Copying**: Read the code, understand it, close it, and write it from memory. What you can't remember, you didn't understand.
4. **Own the Decisions**: The project's decisions must come from the human engineer's head, not the AI's.

## Error Handling
- Engines (pure functions) should **throw** errors, they do not catch them.
- Services should catch errors and decide the business logic flow.
- Controllers should handle the HTTP response mapping (e.g. 500, 400).

# Source
CLAUDE_CHAT_ARCHIVE.md
