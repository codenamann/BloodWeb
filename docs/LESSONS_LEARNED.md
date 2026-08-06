# Lessons Learned

- **Passive discovery (dashboards) fails in emergencies**: Donors must be actively notified based on match logic.
- **Asking users to understand blood compatibility limits matches**: The system must abstract compatibility calculation (Compatibility Engine).
- **Forcing GPS location creates unnecessary friction**: Location is optional but highly prioritized in matching. Null checks are vital at every depth (e.g. `donor.location?.coordinates?.lat`).
- **Immediate phone number exposure leads to privacy and spam issues**: Sensitive fields like `passwordHash` must use `select: false` in the schema.
- **Transcription is not engineering**: Copy-pasting AI code stunts growth. Taking a real shot at writing the code, reviewing it with the AI, and correcting it is the only way to build actual engineering intelligence.
- **Public API Rate Limits**: APIs like Overpass (OSM) frequently time out (HTTP 504). Caching responses locally and gracefully returning a `503 Retryable` to the user is essential.

# Source
CLAUDE_CHAT_ARCHIVE.md
