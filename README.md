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
- `client leads`: the Leads page now loads real workspace-scoped pipeline data and supports create + stage update interactions
- `client inbox`: the Inbox page now loads real workspace-scoped conversations, active chat detail, and create-lead flow from the sidebar
- `server`: Express + JavaScript with versioned base API routing and environment loading
- `server auth`: modular auth routes for signup, login, current user, and logout
- `server workspace`: workspace creation during signup and user-to-workspace linking
- `server leads`: modular leads routes with workspace-scoped create, list, and stage update APIs
- `server inbox`: modular inbox routes with workspace-scoped contact, conversation, message, and create-and-link lead queries
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

## Local inbox testing
1. Start the backend in development mode with `npm run server:dev`
2. Sign up or log in so the auth cookie is set for your current workspace
3. Trigger `POST /api/v1/inbox/dev/seed`
4. Open `/inbox` to verify the seeded conversation, timeline, and right sidebar context

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Realtime: Socket.io
- Queue: Redis + BullMQ
- Payments: Razorpay
- WhatsApp: Twilio first, Meta Cloud API later
