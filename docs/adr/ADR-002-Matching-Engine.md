# ADR-002: Matching Engine

Status:
- Accepted

Date:
June 2026

Context
The platform needs to connect blood requests with compatible, available, and nearby donors. To achieve this, an Active Discovery model is required where the platform discovers donors, rather than relying on donors to browse requests.

Problem
Passive discovery (where donors look for requests) fails during emergencies because donors do not regularly open blood donation platforms. The matching needs to happen automatically and consider medical compatibility, real-time availability, and location proximity.

Alternatives Considered
- Passive discovery (donors manually find requests on a dashboard).
- Matching engine embedded within request creation logic.

Decision
The platform will utilize an Active Discovery model. A dedicated `MatchingEngine` service will be implemented. It will first trigger a `CompatibilityEngine` to determine eligible donor blood groups based on the patient's blood group. Then, it will query the database for users who have their availability toggle set to `true`, match the eligible blood groups, and sort them based on location and reliability score.

Reasoning
Active discovery shifts the burden of finding help from the distressed requester to the system. By isolating the Matching Engine from the Compatibility Engine and Notification Engine, we ensure a modular pipeline (`CompatibilityEngine → MatchingEngine → NotificationEngine`) that executes automatically upon request creation.

Consequences
- Requires a robust background job or pipeline to run matching immediately upon request creation.
- Location and availability must be heavily indexed in the database for performance.

Trade-offs
- Increased backend complexity compared to a passive CRUD dashboard.
- Guarantees much faster response times during emergencies.

Affected Components
- MatchingEngine
- CompatibilityEngine
- Database (User collection indexes)
- BloodRequest Lifecycle

Source:
CLAUDE_CHAT_ARCHIVE.md
Conversation Section: [Unreadable section] (Derived from ARCHITECTURE.md Section 7 & 8)

Notes
Only users with `availability: true` are considered for matching. Location and account status are high priority factors.
