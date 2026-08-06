# Project Memory

This file serves as a summary of the project's state, mindset, and evolution.

## Current State
- **Database Schema**: 7 core models (`Hospital`, `User`, `BloodRequest`, `VolunteerResponse`, `CoordinationRoom`, `Message`, `Notification`) and 2 transition validators completed.
- **Engines**: `compatibilityEngine.js`, `matchingEngine.js`, `fulfillmentEngine.js`, and `requestPipeline.js` are fully implemented as pure functions.
- **Services**: Completed core domain logic (`user`, `hospital`, `request`, `volunteer`, `room`, `message`, `notification`).
- **Scaffolding**: Production-ready Express setup with isolated `config/env.js`, `config/db.js`, `app.js`, and `server.js` (graceful shutdown).

## Development Mindset
We are operating under a strict "Design Before Code" mandate. The developer is actively transitioning from a "transcription" learning model to an active "attempt -> review -> correct" loop to build genuine software engineering intelligence.

## Next Phase
- Implement the API layer (Controllers/Routes) to expose the services over HTTP.
- Move towards the Frontend (React/Vite).

# Source
CLAUDE_CHAT_ARCHIVE.md
