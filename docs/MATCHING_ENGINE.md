# Matching Engine

The Matching Engine (`matchingEngine.js`) is a pure algorithmic service that ranks eligible donors.

## Input
- `patientBloodGroup`
- `hospitalId` (to fetch coordinates)
- `requesterId` (to exclude the requester)

## Execution Flow
1. Fetch compatible donor blood groups via `CompatibilityEngine`.
2. Fetch `Hospital` coordinates.
3. Query `User` collection for donors matching the eligible blood groups, who are available, active, and not the requester.
4. Filter out any donors missing valid `lat`/`lng` coordinates.
5. Compute a `distanceKm` using the **Haversine formula**.
6. Compute a `rankScore` and sort descending.

## Ranking Algorithm
The rank formula combines proximity and reliability:
```javascript
const PROXIMITY_WEIGHT = 0.7;
const RELIABILITY_WEIGHT = 0.3;

const proximityScore = 1 / (1 + distanceKm);
const reliabilityScore = donor.totalVolunteers ? donor.successfulDonations / donor.totalVolunteers : 0;
const rankScore = (proximityScore * PROXIMITY_WEIGHT) + (reliabilityScore * RELIABILITY_WEIGHT);
```

## Isolation
The engine is a pure function. It does not update the database, and it does not dispatch notifications.

# Source
CLAUDE_CHAT_ARCHIVE.md
