# BloodWeb — Domain Model

> **Status:** Design Phase  
> **Version:** 0.1  
> **Last Updated:** June 2026  
> **Purpose:** Defines all business entities, their responsibilities, fields, relationships, and lifecycle. This document is the foundation for database schema, API design, and backend structure. Do not write schemas before understanding this document completely.

---

## Table of Contents

1. [Entity Overview](#1-entity-overview)
2. [User](#2-user)
3. [BloodRequest](#3-bloodrequest)
4. [VolunteerResponse](#4-volunteerresponse)
5. [CoordinationRoom](#5-coordinationroom)
6. [Message](#6-message)
7. [Notification](#7-notification)
8. [Hospital](#8-hospital)
9. [Compatibility Engine](#9-compatibility-engine)
10. [Entity Relationship Summary](#10-entity-relationship-summary)

---

## 1. Entity Overview

| Entity | Purpose |
|---|---|
| `User` | Any person on the platform — requester, donor, or both |
| `BloodRequest` | Central entity. Represents a patient's need for blood |
| `VolunteerResponse` | A donor's offer to help a specific request |
| `CoordinationRoom` | Temporary space for coordination tied to one request |
| `Message` | A single communication event inside a room |
| `Notification` | A delivery record for a system or action alert |
| `Hospital` | A verified or OSM-sourced hospital record |

**Core Rule:** `BloodRequest` is the center of the system. Every other entity either belongs to a request or is triggered by one.

**Referencing Rule:** `BloodRequest` does not embed other entities. Other entities reference `BloodRequest` by ID. The request stays clean.

---

## 2. User

### Purpose
Represents any person on the platform. Users are not permanently classified as donors or recipients — roles are dynamic and determined by the action being performed.

### Fields

```
_id                   ObjectId
name                  string              required at registration
phone                 string              required at registration, unique
passwordHash          string              required at registration
email                 string              optional initially
bloodGroup            enum                optional initially, required to volunteer
                                          [A+, A-, B+, B-, AB+, AB-, O+, O-]
availability          boolean             default: false
                                          true = willing to receive donation requests
location              object              optional initially, required to volunteer
  country             string
  state               string
  city                string
  area                string
  coordinates         object (lat, lng)   optional, improves matching
profileComplete       boolean             derived, true when all core fields filled
totalVolunteers       integer             default: 0, increments on each VolunteerResponse
successfulDonations   integer             default: 0, increments on request COMPLETED
reliabilityScore      float               derived: successfulDonations / totalVolunteers
accountStatus         enum                [ACTIVE, SUSPENDED, DELETED]
createdAt             datetime
```

### Registration Strategy — Progressive
Minimum required at signup: `name`, `phone`, `password`

Everything else is collected contextually:
- Trying to volunteer → prompted for `bloodGroup` + `location`
- Trying to create a request → prompted for any missing critical fields
- Never block platform entry with a long form

### Relationships
- Creates → `BloodRequest`
- Submits → `VolunteerResponse`
- Receives → `Notification`
- Participates in → `CoordinationRoom` (via VolunteerResponse or as requester)

### Business Rules
- `availability: true` is required for a user to appear in matching
- A user with no `bloodGroup` cannot volunteer
- `reliabilityScore` is used by matching engine to rank volunteers
- Roles are contextual — the same user can create a request and volunteer for another simultaneously

---

## 3. BloodRequest

### Purpose
Represents a real patient's need for blood at a hospital. This is the central entity of the platform. Every major system action originates from a request.

### Fields

```
_id                   ObjectId
patientBloodGroup     enum                required
                                          [A+, A-, B+, B-, AB+, AB-, O+, O-]
                                          stores patient's blood group, NOT donor group
                                          compatible donor groups are computed by system
unitsNeeded           integer             required, minimum 1
hospitalId            ref → Hospital      required
urgency               enum                required
                                          [NORMAL, HIGH, CRITICAL]
neededBy              datetime            optional
                                          surgery deadline or "needed before" time
                                          null = as soon as possible
status                enum                required
                                          [PENDING, ACTIVE, PARTIALLY_FULFILLED,
                                           FULFILLED, COMPLETED, CANCELLED, EXPIRED]
hospitalDocument      string              optional, file URL
                                          uploaded by requester for legitimacy
                                          visible to volunteers in room
createdBy             ref → User          required
createdAt             datetime
```

### What BloodRequest Does NOT Store
- Eligible donor groups — computed by CompatibilityEngine
- Matched donors — computed by MatchingEngine
- Volunteer list — stored in VolunteerResponse, referenced by requestId
- Messages — stored in Message, referenced by roomId
- fulfillmentCount — derived from count of ACCEPTED VolunteerResponses

### Request Lifecycle

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
  → Some volunteers accepted
  → unitsNeeded not yet met
  ↓
FULFILLED
  → Enough volunteers confirmed (met unitsNeeded threshold)
  → Backup volunteers remain in room
  ↓
COMPLETED
  → Requester confirms donation happened
  → Donor successfulDonations incremented
  → Room closes
  → Request archived as donation history
  ↓
CANCELLED         → Requester cancelled before completion
EXPIRED           → neededBy passed without fulfillment
```

### Business Rules
- `patientBloodGroup` stores medical fact. System derives compatible donor groups.
- Requests are NOT editable after creation. Status transitions are controlled.
- A request is fulfilled by donor count, not unit count (V1 simplification)
- Hospital document upload adds legitimacy, reduces fake requests
- `COMPLETED` requests become donation history — they are not deleted

### Relationships
- Created by → `User`
- Associated with → `Hospital`
- Drives → `VolunteerResponse` (many)
- Drives → `CoordinationRoom` (one)
- Drives → `Notification` (many)

---

## 4. VolunteerResponse

### Purpose
Represents a single donor's offer to help a specific blood request. This is an action record, not a person. The person is in `User`.

### Fields

```
_id                   ObjectId
requestId             ref → BloodRequest  required
donorId               ref → User          required
status                enum                required
                                          [PENDING, ACCEPTED, BACKUP, WITHDRAWN]
locationAtResponse    object              required to volunteer
  coordinates         object (lat, lng)
estimatedETA          integer             minutes, calculated by system at time of volunteering
createdAt             datetime
```

### Volunteer Status Lifecycle

```
PENDING     → donor volunteered, requester hasn't acted yet
ACCEPTED    → requester accepted this donor
BACKUP      → requester has enough accepted donors, this donor is backup
WITHDRAWN   → donor withdrew from the request
```

### Business Rules
- A donor must have `bloodGroup` and `location` set to submit a VolunteerResponse
- A donor must have `availability: true` to appear in matching (but can still volunteer manually)
- Multiple VolunteerResponses per request are expected and required
- Fulfillment is calculated from count of ACCEPTED responses vs `unitsNeeded`
- BACKUP volunteers stay in CoordinationRoom until request COMPLETED or CANCELLED
- Each submission increments `User.totalVolunteers`
- ACCEPTED + COMPLETED increments `User.successfulDonations`

### Relationships
- Belongs to → `BloodRequest`
- Submitted by → `User`
- Determines participation in → `CoordinationRoom`

---

## 5. CoordinationRoom

### Purpose
A temporary, request-scoped collaboration space. Opens when the first donor volunteers. Closes when the request is COMPLETED, CANCELLED, or EXPIRED. This is not a social chat — it is a coordination tool.

### Fields

```
_id                   ObjectId
requestId             ref → BloodRequest  required, unique (1:1 relationship)
status                enum                [ACTIVE, CLOSED]
pinnedMessageId       ref → Message       nullable
cooldownEnabled       boolean             default: false
                                          requester can enable to limit message frequency
createdAt             datetime
closedAt              datetime            null until closed
```

### What CoordinationRoom Does NOT Store
- Participants — derived from VolunteerResponses for this requestId + requester
- Messages — stored in Message, referenced by roomId
- Volunteer list — always read from VolunteerResponse

### Room Features
- **Side panel** — sorted volunteer list by estimated distance, shows status per volunteer
- **Requester controls** — accept volunteer, kick, mute, enable cooldown, pin message, mark complete
- **Volunteer actions** — Mark On My Way, Update ETA, Withdraw
- **System messages** — automatic events (joined, accepted, on the way, fulfilled)
- **Hospital document** — visible to all room participants

### Mobile Behavior
Side panel collapses on small screens. Accessible via button, slides in over room (Discord pattern).

### Room Lifecycle
```
Opens    → first VolunteerResponse created for this request
Active   → coordination happening
Closes   → request reaches COMPLETED, CANCELLED, or EXPIRED
Archived → room read-only, accessible as donation history
```

### Business Rules
- Exactly one room per BloodRequest
- Room is created automatically — never manually
- Requester has administrative controls
- All volunteers (ACCEPTED and BACKUP) are room participants
- Room does not close until request reaches a terminal state

### Relationships
- Belongs to → `BloodRequest` (1:1)
- Contains → `Message` (many)
- Participants derived from → `VolunteerResponse` + request creator

---

## 6. Message

### Purpose
A single communication event inside a CoordinationRoom. Can be a user-typed message or a system-generated event. Both types live in the same collection for chronological ordering.

### Fields

```
_id                   ObjectId
roomId                ref → CoordinationRoom  required
senderId              ref → User              null if type is SYSTEM
type                  enum                    [USER, SYSTEM]
text                  string                  required
event                 enum                    null if type is USER
                                              [VOLUNTEER_JOINED, VOLUNTEER_ACCEPTED,
                                               VOLUNTEER_WITHDRAWN, MARKED_ON_WAY,
                                               ETA_UPDATED, REQUEST_FULFILLED,
                                               REQUEST_COMPLETED, ROOM_CLOSED]
createdAt             datetime
```

### Message Types

**USER message**
- `senderId` is set
- `event` is null
- Renders with sender name + distance card
- Cannot be replied to (coordination room, not chat)

**SYSTEM message**
- `senderId` is null
- `event` is set
- Renders differently — neutral system event style
- Not interactive, cannot be replied to

### Business Rules
- Messages are append-only — no editing, no deletion
- History is the full ordered list of messages for a roomId
- System messages are generated automatically by backend events
- No threading or replies — keeps coordination focused

### Relationships
- Belongs to → `CoordinationRoom`
- Sent by → `User` (null if SYSTEM)

---

## 7. Notification

### Purpose
A delivery record for an alert sent to a user. Abstracts over delivery channels — the same notification concept is delivered via email, push, or SMS without business logic caring about the channel.

### Fields

```
_id                   ObjectId
userId                ref → User          required, who receives it
type                  enum                [INFORMATIONAL, ACTIONABLE]
title                 string              required
body                  string              required
redirectUrl           string              required
                                          always present — tapping notification navigates here
actions               array               null if INFORMATIONAL
                                          present if ACTIONABLE
  label               string              button text e.g. "View Room"
  url                 string              route e.g. "/requests/123/room"
channel               enum                [EMAIL, PUSH, SMS]
delivered             boolean             default: false
read                  boolean             default: false
createdAt             datetime
```

### Notification Types

**INFORMATIONAL**
- Has `redirectUrl`, no `actions`
- Example: "Your request has been fulfilled."
- Tapping opens the request

**ACTIONABLE**
- Has `redirectUrl` + `actions` array
- Example: "A donor has volunteered." → buttons: ["View Room", "Accept"]
- Actions are deep links to specific routes

### Business Rules
- Every notification has a `redirectUrl` — tapping always goes somewhere
- `actions` array can have multiple buttons
- Channel is abstracted — NotificationService handles routing internally
- Business logic never calls sendEmail() directly
- One notification record per user per channel per event

### Relationships
- Sent to → `User`
- Triggered by → `BloodRequest` events

---

## 8. Hospital

### Purpose
A verified hospital record used as the destination for blood requests. Sourced from OpenStreetMap via Overpass API. User-submitted entries are marked unverified until admin review.

### Fields

```
_id                   ObjectId
osmId                 string              unique, null if source is MANUAL
name                  string              required
address               string              required
city                  string              required
state                 string              required
coordinates           object              required if source is OSM
  lat                 float
  lng                 float
source                enum                [OSM, MANUAL]
verified              boolean             true if OSM, false until reviewed if MANUAL
createdAt             datetime
```

### Hospital Discovery Strategy
- Requester searches hospital by name
- System queries Overpass API (OpenStreetMap) — free, good India coverage
- If found in OSM → save with `source: OSM, verified: true`
- If not found → requester submits manually → `source: MANUAL, verified: false`
- Admin reviews MANUAL entries
- Next requester in same city sees existing record as autocomplete suggestion

### Business Rules
- Free hospital data via OpenStreetMap — no paid API dependency
- OSM records are trusted by default
- MANUAL records are unverified until admin approval
- Duplicate prevention via `osmId` uniqueness check
- Hospital name autocomplete grows organically with real usage

### Relationships
- Referenced by → `BloodRequest`

---

## 9. Compatibility Engine

### Purpose
Not a stored entity — a business rule module. Owns all blood compatibility knowledge. No other part of the system should contain compatibility logic.

### Blood Compatibility Matrix

| Patient Blood Group | Compatible Donor Groups |
|---|---|
| A+ | A+, A-, O+, O- |
| A- | A-, O- |
| B+ | B+, B-, O+, O- |
| B- | B-, O- |
| AB+ | A+, A-, B+, B-, AB+, AB-, O+, O- (universal recipient) |
| AB- | A-, B-, AB-, O- |
| O+ | O+, O- |
| O- | O- (universal donor, hardest to find) |

### Usage

```
CompatibilityEngine.getEligibleDonorGroups("A-")
→ ["A-", "O-"]
```

Called by MatchingEngine after request creation. Never called from UI or request form.

### Design Principle
The request stores `patientBloodGroup` — a medical fact the requester knows.
The system derives eligible donor groups — medical knowledge the requester doesn't need.
Users are never asked to understand compatibility rules.

---

## 10. Entity Relationship Summary

```
User
  → creates → BloodRequest
  → submits → VolunteerResponse
  → receives → Notification
  → participates in → CoordinationRoom

BloodRequest (central entity)
  → belongs to → User (requester)
  → associated with → Hospital
  → triggers → VolunteerResponse (many)
  → triggers → CoordinationRoom (one, automatic)
  → triggers → Notification (many)

VolunteerResponse
  → belongs to → BloodRequest
  → submitted by → User (donor)
  → determines participation in → CoordinationRoom

CoordinationRoom
  → belongs to → BloodRequest (1:1)
  → contains → Message (many)
  → participants derived from → VolunteerResponse

Message
  → belongs to → CoordinationRoom
  → sent by → User (null if SYSTEM type)

Notification
  → sent to → User
  → triggered by → BloodRequest events

Hospital
  → referenced by → BloodRequest
```

---

## What Comes Next

Domain model is complete. The following can now be designed in order:

1. **Database Schema** — MongoDB collections, indexes, field types
2. **API Design** — endpoints, request/response shapes
3. **Matching Engine** — distance rules, notification batching, ranking algorithm
4. **Backend Structure** — services, controllers, middleware
5. **Frontend** — after backend is designed

> Do not skip to database schema without re-reading this document. Every schema decision should trace back to a domain rule defined here.
