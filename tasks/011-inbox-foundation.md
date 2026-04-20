# Task 011 - Inbox Foundation

## Goal
Build the first real inbox foundation for WACRM.

## Why
WACRM is a WhatsApp-first CRM. The Inbox must move from mock UI to real workspace-scoped data.

## Scope
This task includes:
- create contact model
- create conversation model
- create message model
- create inbox module structure
- create workspace-scoped inbox routes
- create list conversations endpoint
- create get conversation detail endpoint
- create basic seed/sample creation path if needed for testing
- connect the Inbox page to fetch real data from backend

## Must include
Backend:
- contact model
- conversation model
- message model
- inbox routes
- inbox controller
- inbox service
- workspace-scoped queries
- conversation list response
- active conversation detail response with messages

Frontend:
- replace mock inbox data with API data
- keep the existing Inbox shell layout as much as possible
- load conversation rail from backend
- load active chat panel from backend
- load lead/contact side panel from backend data shape

## Out of scope
- WhatsApp API integration
- realtime socket updates
- sending messages
- assignment logic
- typing indicators
- file/media uploads
- unread sync from external providers

## Important rules
- JavaScript only
- keep backend modular
- keep queries workspace-scoped
- do not build unrelated product logic
- preserve the existing Inbox UI shell structure as much as possible

## Done when
- contacts, conversations, and messages are saved in database
- inbox routes return workspace-scoped data
- /inbox uses backend data instead of mock data
- active conversation loads real messages
- lead/contact context panel uses backend-backed data shape