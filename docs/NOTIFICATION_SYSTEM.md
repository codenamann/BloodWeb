# Notification System

The Notification System (`notification.service.js`) is an abstraction layer that handles delivery of messages via multiple channels (Email, SMS, Push).

## Core Responsibilities
- Receives a ranked list of donors and the `BloodRequest`.
- Generates a `Notification` document for audit and in-app history.
- Dispatches the payload to the appropriate channel handler (e.g., `sendEmail`).
- Provides read/unread querying capabilities (`getNotifications`).

## Batch Processing
When notifying a ranked list of donors, the service must use `Promise.allSettled(donors.map(...))` to ensure that a failure to notify one donor (e.g. bounce, timeout) does not interrupt the loop for remaining donors.

## Abstraction
Business logic services (like `requestPipeline`) must only call `NotificationService.notifyDonors()`. They must never interact directly with underlying email or SMS providers.

# Source
CLAUDE_CHAT_ARCHIVE.md
