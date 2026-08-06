# Decisions

See the `docs/adr/` folder for detailed Architectural Decision Records.

Key Decisions Extracted from the Chat Archive:

- **ADR-001: Notification Service**
  - Notification delivery must be abstracted into a dedicated NotificationService. Business logic calls `notify(userId, type, payload)` and never imports channel implementations (like email) directly.
  - This allows adding push notifications later with zero changes to services or controllers.
- **ADR-002: Matching Engine**
  - Matching is an active discovery pipeline, not a passive dashboard. 
  - Proximity and Reliability score are the two signals used.
  - `rankScore = (proximityScore * 0.7) + (reliabilityScore * 0.3)`
- **ADR-003: Domain Models**
  - `BloodRequest` is the central entity. Nothing is embedded inside it, everything references it by ID.
  - No permanent roles; a unified user model.
  - Progressive registration: Many User fields are nullable at creation.
  - `CoordinationRoom` stores nothing about its participants, they are derived dynamically from `VolunteerResponse` records.
- **ADR-004: State Transitions**
  - Status transitions go through a controlled pure function (validator), never raw DB writes.
  - Prevents illegal reversals (like `FULFILLED -> ACTIVE`).
- **ADR-005: Medical Logic Ownership**
  - Medical compatibility is calculated by a stateless `CompatibilityEngine` module.
  - No compatibility logic should exist in controllers or services.
- **ADR-006: Hospital Data Source**
  - Hospital data comes from OSM (OpenStreetMap / Overpass API) as a primary source.
  - Local caching is employed to avoid API rate limits (504 Gateway Time-out).
  - Manual entries are flagged for admin review (`verified: false`).

# Source
CLAUDE_CHAT_ARCHIVE.md
