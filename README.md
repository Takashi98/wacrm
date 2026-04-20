# WACRM

WACRM is a WhatsApp-first CRM for Indian small and medium businesses.

## Goal
Help businesses manage WhatsApp chats, convert chats into leads, track pipeline stages, automate follow-ups, and collect payments.

## Target users
- Instagram sellers
- Local shop owners
- Freelancers and consultants
- Coaching centers
- Small D2C brands

## MVP goal
Build a simple product that can:
- show WhatsApp chats in one inbox
- create leads from chats
- move leads in pipeline
- automate one basic follow-up flow
- send payment links
- show basic analytics

## Current foundation
- `client`: React + Vite + JavaScript with Tailwind CSS and React Router
- `client auth`: login, signup, protected routes, and cookie-based session hydration
- `client workspace`: auth state includes the current workspace and shows it in the app shell
- `client leads`: the Leads page now loads real workspace-scoped pipeline data, supports create + stage update interactions, shows follow-up due state, includes simple follow-up queue tabs, and supports done/snooze follow-up actions
- `client inbox`: the Inbox page now loads real workspace-scoped conversations, active chat detail, and create-lead flow from the sidebar
- `client automations`: the Automations page now loads real workspace-scoped rules and supports create + active/inactive toggle interactions
- `client payments`: the Payments page now loads real workspace-scoped payment links and supports creating links for leads
- `server`: Express + JavaScript with versioned base API routing and environment loading
- `server auth`: modular auth routes for signup, login, current user, and logout
- `server workspace`: workspace creation during signup and user-to-workspace linking
- `server leads`: modular leads routes with workspace-scoped create, list, follow-up queue, follow-up action, and stage update APIs
- `server inbox`: modular inbox routes with workspace-scoped contact, conversation, message, and create-and-link lead queries
- `server automations`: modular automation-rule routes with workspace-scoped list, create, and status update APIs
- `server automation execution`: first real execution path for `lead_created -> mark_followup_due`, with lead follow-up updates, `lastRunAt`, and stored automation run records
- `server payments`: modular payment-link routes with workspace-scoped create and list APIs
- `server razorpay`: real Razorpay payment-link creation with stored provider ids, urls, and statuses
- `server dev seed`: authenticated development-only inbox seed route for local end-to-end testing
- `root`: convenience scripts for install, client build, client lint, and server start/dev

## Repo structure
```text
.
|-- client
|   |-- public
|   `-- src
|       |-- app
|       |-- components
|       |-- layouts
|       `-- pages
|-- docs
|-- server
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   `-- routes
|   `-- server.js
`-- tasks
```

## Getting started
1. Install dependencies from the repo root with `npm run setup`
2. Create local env files:
   - copy `client/.env.example` to `client/.env`
   - copy `server/.env.example` to `server/.env`
   - add Razorpay server credentials:
     - `RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
     - `RAZORPAY_WEBHOOK_SECRET`
3. Start the frontend with `npm run client:dev`
4. Start the backend with `npm run server:dev`

## Available scripts
- `npm run setup`
- `npm run client:dev`
- `npm run client:build`
- `npm run client:lint`
- `npm run server:dev`
- `npm run server:start`
- `npm run build`
- `npm run lint`

## Base URLs
- Frontend app: `http://localhost:5173`
- Backend root: `http://localhost:5000`
- Base API health route: `http://localhost:5000/api/v1/health`
- Base API auth route: `http://localhost:5000/api/v1/auth/me`
- Base API inbox route: `http://localhost:5000/api/v1/inbox/conversations`
- Base API inbox-to-lead route: `POST http://localhost:5000/api/v1/inbox/conversations/:conversationId/lead`
- Dev-only inbox seed route: `POST http://localhost:5000/api/v1/inbox/dev/seed`
- Base API leads route: `http://localhost:5000/api/v1/leads`
- Base API lead follow-up route: `http://localhost:5000/api/v1/leads/followups`
- Lead follow-up complete route: `POST http://localhost:5000/api/v1/leads/:leadId/followup/complete`
- Lead follow-up snooze route: `POST http://localhost:5000/api/v1/leads/:leadId/followup/snooze`
- Base API automations route: `http://localhost:5000/api/v1/automations`
- Base API payments route: `http://localhost:5000/api/v1/payments/links`
- Razorpay webhook route: `POST http://localhost:5000/api/v1/payments/webhooks/razorpay`

## Local inbox testing
1. Start the backend in development mode with `npm run server:dev`
2. Sign up or log in so the auth cookie is set for your current workspace
3. Trigger `POST /api/v1/inbox/dev/seed`
4. Open `/inbox` to verify the seeded conversation, timeline, and right sidebar context

## Razorpay webhook testing
1. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in `server/.env`
2. In the Razorpay dashboard, create a webhook for `POST /api/v1/payments/webhooks/razorpay`
3. Subscribe the webhook to `payment_link.paid`, `payment_link.partially_paid`, `payment_link.expired`, and `payment_link.cancelled`
4. Use the same webhook secret in Razorpay and `server/.env`
5. Refresh `/payments` or the inbox lead sidebar after Razorpay delivers an event to see the stored status update

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Realtime: Socket.io
- Queue: Redis + BullMQ
- Payments: Razorpay
- WhatsApp: Twilio first, Meta Cloud API later
