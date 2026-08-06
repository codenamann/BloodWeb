# Engineering Rules

1. **System Owns Medical Logic**: Users provide facts (e.g. patient blood group). The system derives compatible donors via the `CompatibilityEngine`.
2. **Notification Isolation**: Notification delivery must be abstracted from business logic into a dedicated `NotificationService`.
3. **No GPS Blocking**: Location improves matching quality, it does not gate platform access.
4. **Data References**: `BloodRequest` does not embed other entities. Other entities reference it by ID.
5. **No Controllers Doing Business Logic**: Controllers strictly receive requests, call services, and return responses.
6. **State Transitions**: Status changes must be validated by transition functions to enforce sequence rules (e.g. `PENDING` -> `ACTIVE`). `runValidators: true` is for type correctness, transition validators are for business logic sequence enforcement.
7. **Early Returns**: Use early returns instead of `else if` ladders to flatten nesting and improve readability.
8. **Lean Queries**: Use `.lean()` in Mongoose for read-only queries to improve performance and memory usage.
9. **Fail Fast**: Validate preconditions (like state transitions) before executing expensive database queries or matching logic.

# Source
CLAUDE_CHAT_ARCHIVE.md
