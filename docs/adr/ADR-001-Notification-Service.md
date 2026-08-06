# ADR-001: Notification Service

Status:
- Accepted

Date:
June 2026

Context
BloodWeb needs to proactively contact matched donors when a blood request is created. The matching engine finds donors, but delivering the notification requires a separate abstraction layer to support multiple channels (email, push, SMS) without cluttering business logic.

Problem
If the request logic directly invokes email or SMS sending APIs, the system becomes tightly coupled to specific delivery mechanisms. This makes adding new channels (like push notifications) complex and prone to breaking core flows.

Alternatives Considered
- Direct API calls (e.g., `sendEmail()`) within request creation logic.
- A monolithic matching-and-notification service.

Decision
Notification delivery must be abstracted from business logic. A dedicated `NotificationService` will be built that accepts `{ userId, type, payload }` and handles channel routing internally. There are two notification types: INFORMATIONAL (with `redirectUrl`) and ACTIONABLE (with `redirectUrl` + `actions` array). One `Notification` record will be created per user, per channel, per event.

Reasoning
This separation of concerns ensures that the Matching Engine focuses only on finding donors, while the Notification Engine handles delivery. It allows scaling communication channels (V1: Email; Future: Push, SMS) without touching core business logic.

Consequences
- Requires building a standalone NotificationService module.
- Introduces an asynchronous step between matching and delivery.

Trade-offs
- Slight increase in architectural complexity for V1.
- Provides high flexibility for future channel expansions.

Affected Components
- NotificationEngine
- BloodRequest Lifecycle (triggers NotificationEngine)
- Database (`Notification` collection)

Source:
CLAUDE_CHAT_ARCHIVE.md
Conversation Section: [Unreadable section] (Derived from ARCHITECTURE.md Section 10)

Notes
Currently supports Email for V1. Browser/Mobile Push and SMS are planned.
