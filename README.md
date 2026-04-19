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
- `server`: Express + JavaScript with versioned base API routing and environment loading
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

## Tech stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Realtime: Socket.io
- Queue: Redis + BullMQ
- Payments: Razorpay
- WhatsApp: Twilio first, Meta Cloud API later
