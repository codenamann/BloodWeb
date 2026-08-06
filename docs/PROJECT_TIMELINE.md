# Project Timeline

This timeline documents the sequential phases of BloodWeb's backend development.

## Phase 1: Foundation & Schemas (Completed)
- Established `ARCHITECTURE.md` and `DOMAIN_MODEL.md`.
- Scaffolded Express server with isolated configurations (`env.js`, `db.js`, `app.js`, `server.js`).
- Created 7 core Mongoose schemas with strict validations and indexes.
- Created `requestStatus` and `volunteerStatus` transition validators.

## Phase 2: Domain Engines (Completed)
- `compatibilityEngine.js`: Stateless blood-type mapping.
- `matchingEngine.js`: Haversine-based proximity and reliability scoring algorithm.
- `fulfillmentEngine.js`: Derived state calculation.
- `requestPipeline.js`: Orchestration of the active discovery flow.

## Phase 3: Service Layer (Completed)
- `user.service.js`: Progressive registration, OTP hashing, location updates.
- `hospital.service.js`: Local DB caching + OpenStreetMap (Overpass API) fallback.
- `request.service.js`: Request lifecycle and state transitions.
- `volunteer.service.js`: Response logic and fulfillment triggers.
- `room.service.js`: Dynamically derived Coordination Room participants.
- `message.service.js`: Messaging and cooldown enforcement.
- `notification.service.js`: Delivery channel abstraction.

## Phase 4: API Layer (Pending)
- Controllers and Express Routes.
- Request validation and Error Handling Middleware.

## Phase 5: Frontend (Pending)
- React/Vite application integration.

# Source
CLAUDE_CHAT_ARCHIVE.md
