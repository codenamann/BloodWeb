# ADR-003: Domain Models

Status:
- Accepted

Date:
June 2026

Context
The platform must accurately represent the real-world process of requesting and volunteering for blood donation. We need to decide how to model users (donors vs. recipients), requests, and the coordination process.

Problem
If we classify users strictly as "Donors" or "Recipients," we create friction for users who switch roles over time. If we try to merge the coordination process into a generic chat, we lose structured state transitions needed for emergency medical situations.

Alternatives Considered
- Separate `Donor` and `Recipient` collections.
- `BloodRequest` embedding its volunteers inside the document.
- Using a generic messaging or social network model for interactions.

Decision
A unified `User` model will be used. Roles are dynamic and contextual, determined by the action being performed rather than a permanent profile attribute. The `BloodRequest` is the central entity; it does not embed other entities. A `VolunteerResponse` entity acts as a donor's offer to help (an action record, not a person). A `CoordinationRoom` is created 1:1 for each request upon the first volunteer, serving as a temporary, structured space for coordination.

Reasoning
This unified user model reflects reality (a donor today may need blood tomorrow). The central `BloodRequest` ensures all features, flows, and matching logic have a clear origin. Separating `VolunteerResponse` enables tracking multiple backup volunteers without bloating the `BloodRequest` document.

Consequences
- APIs and data models must reference `BloodRequest._id` to find related data.
- The system must derive user roles contextually in the UI and permissions.

Trade-offs
- Slight increase in relational queries compared to embedded documents, but necessary for data consistency and scalability.

Affected Components
- Database Schema (User, BloodRequest, VolunteerResponse, CoordinationRoom)
- API Design

Source:
CLAUDE_CHAT_ARCHIVE.md
Conversation Section: [Unreadable section] (Derived from ARCHITECTURE.md Sections 3, 4, 14, 15)

Notes
Refer to `DOMAIN_MODEL.md` for specific entity-level schema details.
