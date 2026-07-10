# BloodWeb — Architecture Decision Record

> **Status:** Domain Modeling Complete — Database Schema Next  
> **Version:** 0.3  
> **Last Updated:** June 2026  
> **Purpose:** Single source of truth for all architectural and product decisions made before and during implementation. Consult this before writing any feature. Refer to `DOMAIN_MODEL.md` for entity-level detail.

---

## Table of Contents

1. [Product Definition](#1-product-definition)
2. [Core Philosophy](#2-core-philosophy)
3. [Central Entity](#3-central-entity)
4. [User Model](#4-user-model)
5. [Registration Strategy](#5-registration-strategy)
6. [Availability System](#6-availability-system)
7. [Donor Discovery Strategy](#7-donor-discovery-strategy)
8. [Blood Compatibility & Matching](#8-blood-compatibility--matching)
9. [Location Strategy](#9-location-strategy)
10. [Notification System](#10-notification-system)
11. [Hospital Strategy](#11-hospital-strategy)
12. [Privacy Principles](#12-privacy-principles)
13. [Request Coordination Model](#13-request-coordination-model)
14. [Coordination Room](#14-coordination-room)
15. [Volunteer Model](#15-volunteer-model)
16. [Fulfillment Model](#16-fulfillment-model)
17. [Request Lifecycle](#17-request-lifecycle)
18. [Communication Architecture](#18-communication-architecture)
19. [Legitimacy & Trust](#19-legitimacy--trust)
20. [Domain Entities](#20-domain-entities)
21. [Unresolved Decisions](#21-unresolved-decisions)
22. [Rejected Ideas Log](#22-rejected-ideas-log)

---

## 1. Product Definition

**BloodWeb** is a real-time blood donation coordination platform designed to reduce the time required to connect blood recipients with compatible donors during both urgent and non-urgent medical situations.

### The Core Problem

People in need of blood struggle to find compatible, willing donors quickly. Existing methods are fragmented:

- Personal contacts
- Social media posts
- WhatsApp groups
- Informal donor networks

These fail during emergencies because they depend on human availability, reach, and attention — and because most people don't know blood compatibility rules, so they ask for the wrong donors.

### The Core Question

> *How do we connect a person who needs blood with people capable of helping — as fast as possible?*

Everything else — React, MongoDB, UI — is secondary to this.

---

## 2. Core Philosophy

| Principle | Meaning |
|---|---|
| **Request-Centric** | Every feature, flow, and data model originates from a BloodRequest |
| **Active over Passive** | The platform finds donors — donors don't find requests |
| **Coordination-Focused** | Structured actions over free-form chat |
| **Privacy-Aware** | Personal contact info is not immediately exposed |
| **Real-World Usable** | Design for people who are stressed, non-technical, and in a hurry |
| **System Owns Medical Logic** | Users provide facts. System derives compatible donors. |
| **Design Before Code** | Architecture → Domain Model → DB Schema → API → Backend → Frontend |

### What BloodWeb Is NOT

- Not a social network
- Not a WhatsApp clone
- Not a dashboard-only CRUD app
- Not a messaging platform
- Not a platform that makes users understand blood compatibility

---

## 3. Central Entity

**Decision:** `BloodRequest` is the central entity of the platform.

**Reasoning:** Every action on the platform originates from a request.

```
BloodRequest
    ↓ triggers CompatibilityEngine (determines eligible donor groups)
    ↓ triggers MatchingEngine (finds available nearby donors)
    ↓ triggers NotificationEngine (contacts matched donors)
    ↓ receives VolunteerResponses
    ↓ opens CoordinationRoom (on first volunteer)
    ↓ reaches Fulfillment
    ↓ closes → becomes donation history
```

Without a BloodRequest, none of the other systems activate.

> **Coding implication:** When designing APIs, data models, and services — ask "what request does this belong to?" before "what user does this belong to?" BloodRequest does not embed other entities. Other entities reference it by ID.

---

## 4. User Model

**Decision:** Unified user model. No permanent role classification.

A single user can:

- Create blood requests (acting as recipient)
- Volunteer for requests (acting as donor)
- Do both at different times

Roles are **dynamic and contextual**, not permanent profile attributes.

> **Coding implication:** There is one `User` collection. Do NOT create separate `Donor` and `Recipient` models. Role is determined by the action being performed, not a field on the user.

---

## 5. Registration Strategy

**Decision:** Progressive registration. Minimum friction at entry. Additional details collected contextually.

### The Problem with Full Registration Upfront

A family member standing outside a hospital at 11pm, father in ICU, opens BloodWeb for the first time. A full registration form asking for name, email, password, phone, blood group, location, and profile photo will cause them to close the app and post on WhatsApp instead.

### Accepted Approach

**Minimum required at signup:**
- Name
- Phone number
- Password

Everything else is collected contextually via focused popups when a feature requires it:

| Action | Additional Info Required |
|---|---|
| Volunteer for a request | Blood group + current location |
| Create a request | No extra fields (hospital + patient blood group are on the request) |
| Enable availability | Blood group + location must be set |

### Design Rule

> Never block platform entry with a long form. Surface missing information at the moment it is needed, in context.

> **Coding implication:** Many `User` fields are nullable at creation. `profileComplete` is a derived boolean. Feature guards check for required fields and trigger contextual prompts — not a generic "complete your profile" banner.

---

## 6. Availability System

**Decision:** Users explicitly control availability through a toggle.

### What Availability Means

> "I am currently willing to receive blood donation requests."

### What Availability Does NOT Mean

- Guaranteed donation
- Guaranteed response
- Any legal or platform commitment

### Matching Rule

**Only users with `availability: true` are considered for matching.**

> **Coding implication:** Every matching query must filter by `availability: true` first. This field lives on the `User` model and must be indexed.

---

## 7. Donor Discovery Strategy

**Rejected Model (Passive Discovery):**

```
Request created → Appears on dashboard → Donor manually finds it → Donor acts
```

This fails because people do not regularly open blood donation platforms.

**Accepted Model (Active Discovery):**

```
Request Created → CompatibilityEngine → MatchingEngine → NotificationEngine → Donor Responds
```

**The platform discovers donors. Donors do not discover requests.**

> **Coding implication:** A compatibility + matching + notification pipeline must execute automatically when a BloodRequest is created. This is not optional — it is the core flow of the entire platform.

---

## 8. Blood Compatibility & Matching

### ADR-004: Requests Store Patient Blood Group, Not Donor Blood Group

**Decision:** `BloodRequest.patientBloodGroup` stores the patient's actual blood group — a fact the requester knows. The system derives which donor groups are eligible.

**Reasoning:** The requester is not a hematologist. They know what the doctor told them: "Your father has A- blood." They do not know that O- donors can also help. The system must own this knowledge — not the user.

**Example:**

```
Family enters: patientBloodGroup = "A-"

CompatibilityEngine derives:
  eligible donor groups = ["A-", "O-"]

MatchingEngine notifies:
  all available A- and O- donors in the area
```

The family never sees the compatibility logic. They just get help faster.

### Compatibility Matrix

| Patient Blood Group | Compatible Donor Groups |
|---|---|
| A+ | A+, A-, O+, O- |
| A- | A-, O- |
| B+ | B+, B-, O+, O- |
| B- | B-, O- |
| AB+ | All groups (universal recipient) |
| AB- | A-, B-, AB-, O- |
| O+ | O+, O- |
| O- | O- only (universal donor, hardest to find) |

### CompatibilityEngine

A dedicated module that owns all compatibility knowledge. No other part of the system contains this logic.

```
CompatibilityEngine.getEligibleDonorGroups("A-")
→ ["A-", "O-"]
```

### Matching Factors

| Factor | Priority |
|---|---|
| Blood group compatibility | Required (filter via CompatibilityEngine) |
| Availability toggle | Required (filter first) |
| Location (city/area proximity) | High |
| Account status (ACTIVE) | High |
| Reliability score | Medium (ranking, not filtering) |

> **Coding implication:** Build CompatibilityEngine as an isolated module. Build MatchingEngine as a separate service. Neither should know about notifications. Neither should be embedded inside request creation logic.

---

## 9. Location Strategy

**Rejected Approach:** Force GPS. Block platform access if permission denied.

**Reason for rejection:** Creates unnecessary friction. Many legitimate users refuse GPS access.

### Accepted Approach

| Field | Required |
|---|---|
| Country | Yes |
| State | Yes |
| City | Yes |
| Area / Locality | Yes |
| Latitude / Longitude | No — optional, improves matching |

**Location improves matching quality. It does not gate platform access.**

### Volunteer Location

When a donor volunteers, their **current location at time of response** is captured (with permission) to calculate estimated distance and ETA to the hospital. This is separate from their profile location.

> **Coding implication:** `User.location` is profile location (city/area). `VolunteerResponse.locationAtResponse` is real-time coordinates captured at volunteering time. These are different fields with different purposes.

---

## 10. Notification System

**Core Rule:** BloodWeb must proactively notify matched donors. The platform cannot wait for donors to check in.

### Notification Types

| Type | Behavior |
|---|---|
| INFORMATIONAL | Has `redirectUrl`. No action buttons. Tapping navigates to source. |
| ACTIONABLE | Has `redirectUrl` + `actions` array (inline buttons e.g. "View Room", "Accept") |

Every notification has a `redirectUrl` — tapping always navigates somewhere. Only ACTIONABLE notifications have inline buttons.

### V1 Channel

- Email

### Planned Future Channels

- Browser Push Notifications
- Mobile Push Notifications
- SMS

### Architectural Rule

> **Notification delivery must be abstracted from business logic.**

The matching engine produces a list of matched users. The notification engine handles delivery. Business logic does not care whether delivery is email, SMS, or push.

> **Coding implication:** Build a `NotificationService` that accepts `{ userId, type, payload }` and handles channel routing internally. Do not call `sendEmail()` directly from request logic. One `Notification` record per user per channel per event.

---

## 11. Hospital Strategy

**Decision:** Blood requests are associated with a hospital, not a personal address.

### Why Hospitals

- Trust and legitimacy for donors
- Known, verifiable destination
- Foundation for future verification system
- Reduces fake or vague requests

### Hospital Data Source

**OpenStreetMap via Overpass API** — free, no API key required, good India coverage.

| Source | Verified | Use Case |
|---|---|---|
| OSM (Overpass API) | Yes — trusted by default | Most hospitals in cities |
| MANUAL (user submitted) | No — admin review required | Rural areas, smaller towns not in OSM |

**Flow:**
1. Requester searches hospital by name
2. System queries Overpass API
3. If found → save with `source: OSM, verified: true`
4. If not found → requester submits manually → `source: MANUAL, verified: false` → admin reviews
5. Next requester in same city sees existing record as autocomplete suggestion

Database grows organically with real usage. Zero paid API dependency.

> **Coding implication:** Check `osmId` uniqueness before saving a new hospital record. Do not create duplicates. Hospital autocomplete queries your own cached `Hospital` collection first, then falls back to Overpass API for misses.

---

## 12. Privacy Principles

**Decision:** Personal contact information is not immediately exposed to donors.

### Rejected Approach

Show donor phone number immediately upon matching.

**Problems:** Spam, harassment, privacy loss, trust erosion.

### Accepted Direction

Users interact through the platform-controlled Coordination Room before any personal contact is shared. Contact sharing is a deliberate, gated action.

> **Coding implication:** Phone numbers and personal addresses must never appear in public-facing API responses by default. Strip them at the serialization layer. Contact sharing requires explicit action — it is not automatic.

---

## 13. Request Coordination Model

**Rejected Model:** One donor accepts → request complete.

**Reason for rejection:** Doesn't reflect real blood donation. A single donation may be insufficient. Backup donors reduce failure risk.

**Accepted Model:** Multiple donors volunteer. Request tracks progress toward fulfillment target. Non-selected volunteers remain as backups.

```
Request: unitsNeeded = 2
  → Volunteer A → ACCEPTED
  → Volunteer B → ACCEPTED
  → Volunteer C → BACKUP (stays in room)
  → Volunteer D → BACKUP (stays in room)
  → Status: FULFILLED
```

> **Coding implication:** Fulfillment is computed from count of ACCEPTED `VolunteerResponses` vs `unitsNeeded`. It is never a manually-set field. Recalculate on every status change to a VolunteerResponse.

---

## 14. Coordination Room

**Decision:** Each BloodRequest automatically creates one temporary coordination space when the first donor volunteers.

### Room Features

**Requester controls:**
- Accept volunteer
- Kick volunteer from room
- Mute a volunteer
- Enable/disable message cooldown
- Pin a message (e.g. "Please arrive at Ward 3 by 5pm")
- Mark request as complete (closes room)

**Volunteer actions:**
- Mark "On My Way" (structured action, updates status visibly)
- Update ETA
- Withdraw from room

**System messages (automatic):**
- "Volunteer A has joined"
- "Volunteer B marked On My Way"
- "Request fulfilled — 2/2 donors confirmed"

**Side panel:**
- Sorted volunteer list by estimated distance
- Status per volunteer (PENDING / ACCEPTED / BACKUP / On My Way)
- Accept / kick / mute controls inline
- Collapses on mobile, accessible via button (Discord pattern)

**Hospital document:**
- Uploaded by requester at request creation
- Visible to all room participants for legitimacy verification

### What the Room Is NOT

- Not a social chat
- Not a permanent room
- Not WhatsApp
- Not a general messaging feature

> **Coding implication:** `CoordinationRoom` is 1:1 with `BloodRequest`. Created automatically on first volunteer — never manually. Build structured action events before free-text chat. Room participants are derived from `VolunteerResponse` records — not stored on the room itself.

---

## 15. Volunteer Model

**Decision:** Donors volunteer — they do not "accept" or "own" requests.

### Terminology

| Use This | Not This |
|---|---|
| Volunteer | Accept |
| I'm Available | I'll Handle This |
| Offer Help | Take Ownership |

A donor is offering assistance. They are not assuming sole responsibility for the entire request.

### Volunteer Status Lifecycle

```
PENDING    → volunteered, requester hasn't acted yet
ACCEPTED   → requester accepted this donor
BACKUP     → requester has enough accepted donors, this donor is backup
WITHDRAWN  → donor withdrew
```

BACKUP volunteers stay in the Coordination Room until the request reaches a terminal state.

> **Coding implication:** The action is `createVolunteerResponse(requestId, userId)` — not `acceptRequest()`. `VolunteerResponse` is an offer record, not a commitment record. Each submission increments `User.totalVolunteers`. ACCEPTED + COMPLETED increments `User.successfulDonations`.

---

## 16. Fulfillment Model

**Decision:** Requests track fulfillment progress toward a unit count target. Fulfillment is derived, never manually set.

```
unitsNeeded: 2
ACCEPTED VolunteerResponses: [A, B]
derived fulfillment: 2/2 → status becomes FULFILLED
```

### Units vs Donors — V1 Decision

Doctors tell families "we need 2 units." Families know units. However, donors think in terms of donating blood, not units.

**V1 Resolution:** Store `unitsNeeded` on the request (what the doctor said). The system maps this to donor count internally. UI shows donors needed, not units. Medical precision preserved in data, simplified in interface.

> **Coding implication:** `BloodRequest.unitsNeeded` is the stored field. Fulfillment threshold = `unitsNeeded`. Count of ACCEPTED `VolunteerResponses` is compared against this. Status transitions happen automatically when threshold is met.

---

## 17. Request Lifecycle

```
PENDING
  → Request created
  → CompatibilityEngine determines eligible donor groups
  → MatchingEngine finds available nearby donors
  → NotificationEngine contacts matched donors
  ↓
ACTIVE
  → Notifications sent
  → Donors begin volunteering
  → CoordinationRoom opens on first volunteer
  ↓
PARTIALLY_FULFILLED
  → Some volunteers ACCEPTED
  → unitsNeeded threshold not yet met
  ↓
FULFILLED
  → ACCEPTED volunteer count meets unitsNeeded
  → Backup volunteers remain in room
  ↓
COMPLETED
  → Requester confirms donation happened
  → successfulDonations incremented for confirmed donors
  → Room closes and becomes read-only
  → Request archived as donation history (never deleted)
  ↓
CANCELLED     → Requester cancelled before COMPLETED
EXPIRED       → neededBy passed without reaching FULFILLED
```

### Allowed Transitions

```
PENDING → ACTIVE
ACTIVE → PARTIALLY_FULFILLED → FULFILLED → COMPLETED
ACTIVE → CANCELLED
ACTIVE → EXPIRED
FULFILLED → COMPLETED
FULFILLED → CANCELLED
```

Reverse transitions are not permitted (e.g. FULFILLED → ACTIVE is invalid).

> **Coding implication:** `BloodRequest.status` is an enum. Status changes go through a controlled transition function that validates allowed transitions. Never update status directly with a raw DB write from a controller.

---

## 18. Communication Architecture

### Evolution of Thinking

```
1. Direct 1:1 Chat (Rejected)
   Problem: Recipient managing N parallel conversations simultaneously.

2. Group Chat (Considered)
   Better, but too close to a general messaging product.

3. Request-Centric Coordination Room (Accepted)
   Scoped, temporary, structured. Purpose-built for coordination.
```

### Message Types

Both types live in one `Message` collection for chronological ordering.

| Type | Sender | Renders As |
|---|---|---|
| USER | A user | Name + distance card + message text |
| SYSTEM | null (system) | Neutral event line, not interactive |

System messages are generated automatically by backend events. They cannot be replied to.

---

## 19. Legitimacy & Trust

### Hospital Document Upload

**Decision:** Requesters can upload a hospital document (doctor's note, prescription, admission slip) when creating a request.

**Purpose:** Reduces fake requests. Gives donors confidence the request is real. Visible to all room participants.

**V1:** Optional upload. Future: may be required for CRITICAL urgency requests.

### Reliability Score

Donors accumulate a reliability score derived from `successfulDonations / totalVolunteers`. Used by the matching engine to rank volunteers. Donors with higher scores rank higher in the side panel.

### Trust Areas Still Undesigned

- Fake request prevention beyond document upload
- Spam volunteer prevention
- Hospital verification levels
- Donor verification levels
- Abuse/harassment reporting inside rooms

> These must be designed before production launch. See Unresolved Decisions.

---

## 20. Domain Entities

All entities are fully defined in `docs/DOMAIN_MODEL.md`. Summary:

| Entity | Purpose |
|---|---|
| `User` | Any person on the platform. Unified model — no permanent donor/recipient classification. |
| `BloodRequest` | Central entity. Represents a patient's need for blood. |
| `VolunteerResponse` | A donor's offer to help a specific request. Action record, not a person. |
| `CoordinationRoom` | Temporary 1:1 space per request. Opens on first volunteer. |
| `Message` | Single communication event inside a room. USER or SYSTEM type. |
| `Notification` | Delivery record. Abstracted over email/push/SMS channels. |
| `Hospital` | OSM-sourced or manually submitted hospital record. |

**Referencing Rule:** `BloodRequest` does not embed other entities. All other entities reference `BloodRequest._id`.

---

## 21. Unresolved Decisions

Do not implement these areas without first making a decision and documenting it here.

### Contact Sharing
When should personal contact information (phone, email) be revealed to the other party?

- [ ] Never — platform-only coordination
- [ ] After requester accepts a volunteer
- [ ] After request is COMPLETED
- [ ] Other

### Donor Visibility in Coordination Room
Should volunteers see each other inside the room?

- [ ] See only the requester
- [ ] See requester and all other volunteers

### Emergency Mode Behavior
How should CRITICAL urgency requests behave differently from NORMAL?

- Expanded notification radius?
- Priority ranking above other requests?
- Direct contact permission?
- Elevated visual treatment in UI?

### Verification System
Should hospitals, donors, or recipients have verification tiers? What features are gated behind verification?

### Abuse Prevention
Strategy for: fake requests, spam volunteering, harassment inside rooms, fake hospital entries.

### Request Expiry Logic
When `neededBy` passes — automatic EXPIRED transition or manual? Who is notified?

---

## 22. Rejected Ideas Log

| Idea | Rejected Because |
|---|---|
| Passive donor discovery (dashboard browsing) | Donors don't regularly open the platform |
| Force GPS, block access if denied | Unnecessary friction, excludes legitimate users |
| One donor per request | Doesn't reflect real blood donation scenarios |
| Direct 1:1 chat per donor | Recipient managing N parallel threads |
| Immediate phone number exposure | Privacy, spam, harassment, trust erosion |
| Permanent Donor / Recipient roles | Users play both roles. Unified model is correct. |
| Feature-first development | Led to poor UX and weak architecture in original V1 |
| Full registration form upfront | Causes abandonment during emergencies |
| User-facing blood compatibility toggle | Users are not hematologists. System owns medical logic. |
| "Need [blood group] donors" framing | Ambiguous. Replaced with "Patient Blood Group" — a fact. |
| Google Places API for hospitals | Paid at scale. Replaced with OpenStreetMap / Overpass API. |
| Crowdsourced hospital names only | Fraud risk. Unverified data unsuitable for emergency platform. |
| `donorsNeeded` field name for V1 | Doctors say units, not donors. Changed to `unitsNeeded`. |

---

## Progress Tracker

| Phase | Status |
|---|---|
| Product Definition | ✅ Complete |
| Business Rules | ✅ Complete |
| Domain Modeling | ✅ Complete → see `DOMAIN_MODEL.md` |
| Database Schema | 🔲 Next |
| Matching Engine Design | 🔲 Pending |
| API Design | 🔲 Pending |
| Backend Implementation | 🔲 Pending |
| Frontend Implementation | 🔲 Pending |

---

*Update this document every time a new architectural decision is made. Resolve unresolved items here before implementing them. Do not implement anything marked 🔲 without first completing the steps above it.*
