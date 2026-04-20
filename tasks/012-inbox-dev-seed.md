# Task 012 - Inbox Dev Seed

## Goal
Create a safe development-only way to seed inbox test data for the current workspace.

## Why
The inbox foundation exists, but it still needs real workspace data to verify the UI and API wiring end to end.

## Scope
This task includes:
- create a dev-only seed path for inbox data
- create one contact
- create one conversation
- create a few messages
- optionally link one existing lead if available
- make it easy to run once for the logged-in workspace
- keep this for local testing only

## Must include
- development-only behavior
- seed data belongs to the authenticated workspace
- creates enough data to test:
  - conversation list
  - active chat timeline
  - right sidebar contact/lead context

## Out of scope
- WhatsApp integration
- realtime
- send message flow
- production seed logic
- bulk import

## Important rules
- JavaScript only
- do not expose unsafe seed behavior in production
- keep scope small
- do not change unrelated product logic

## Done when
- I can trigger inbox seed data in development
- /inbox shows at least one real conversation with messages
- the inbox UI can be verified end to end