# ADR-004: Requests Store Patient Blood Group, Not Donor Blood Group

Status:
- Accepted

Date:
June 2026

Context
When a family member or friend creates a blood request during an emergency, they must specify the type of blood needed. 

Problem
Most users are not hematologists and do not understand the rules of blood compatibility. If the system asks them "What donor blood groups do you need?", they will likely only select the exact match (e.g., A-), missing out on compatible universal donors (like O-), reducing their chances of finding a donor quickly.

Alternatives Considered
- Adding a user-facing blood compatibility toggle or checklist during request creation.
- Framing the input as "Need [blood group] donors".

Decision
`BloodRequest.patientBloodGroup` stores the patient's actual blood group—a known fact. The system owns the medical logic. A dedicated `CompatibilityEngine` module derives which donor groups are eligible based on the patient's blood group.

Reasoning
The system must own this knowledge, not the user. By having the user input a fact (the patient's blood group) and letting the CompatibilityEngine derive eligible donors, we ensure accuracy and maximize the pool of potential donors without requiring the requester to understand hematology.

Consequences
- The `CompatibilityEngine` must be an isolated module containing the compatibility matrix.
- UI must frame the question as "Patient Blood Group".

Trade-offs
- None. This is strictly better for UX and medical safety.

Affected Components
- CompatibilityEngine
- Request Creation UI
- BloodRequest (schema field `patientBloodGroup`)

Source:
CLAUDE_CHAT_ARCHIVE.md
Conversation Section: [Unreadable section] (Derived from ARCHITECTURE.md Section 8)

Notes
This decision is central to the "System Owns Medical Logic" core philosophy.
