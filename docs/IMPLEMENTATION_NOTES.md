# Implementation Notes

[Archive note: Detailed implementation walkthroughs and debugging sessions were captured in the chat archive but cannot be fully reproduced due to OCR limitations on the source images. The following notes are derived from the available chat text.]

## Mongoose Gotchas
- `isNew` quirk: By the time `post('save')` fires, `this.isNew` is already false. Capture it in `pre('save')` as `this.wasNew = this.isNew`.
- `countDocuments` vs `find`: Use `countDocuments` for fulfillment engines instead of loading the entire array of responses into memory.
- `toObject()`: When mapping over Mongoose documents to attach computed fields (like distance in the matching engine), always call `donor.toObject()` first.

## Node.js Module System
- We are using CommonJS (`require`), but explicitly naming files with `.js` and configuring VS Code auto-import (`javascript.preferences.importModuleSpecifierEnding`: `js`) to ease future transitions to ESM if needed. 

## Promises & Async
- Do not await fire-and-forget orchestrators (e.g., `requestPipeline` in `createRequest`), but attach `.catch()` to log errors.
- Use `Promise.allSettled()` instead of `Promise.all()` for batch processing (like `notifyDonors`) to prevent one failure from dropping all other notifications.

# Source
CLAUDE_CHAT_ARCHIVE.md
