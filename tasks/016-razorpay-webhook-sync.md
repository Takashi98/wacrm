# Task 016 - Razorpay Webhook Sync

## Goal
Sync Razorpay payment status updates back into WACRM automatically.

## Why
Payment links are now created successfully, but their status remains pending unless Razorpay events are captured and stored.

## Scope
This task includes:
- create a Razorpay webhook endpoint
- verify Razorpay webhook signature
- parse payment link events
- update stored payment link status in database
- update providerStatus and app-facing status
- keep all updates workspace-safe

## Must include
Backend:
- webhook route
- webhook signature verification
- mapping of Razorpay payment-link event/status to app status
- update payment link record in MongoDB
- preserve existing payment-link creation flow

Frontend:
- no major UI rebuild
- existing Payments page and inbox lead sidebar should reflect updated status after page refresh

## Out of scope
- realtime websocket updates
- refunds
- reminder automations
- resend logic
- full billing system

## Important rules
- JavaScript only
- keep backend modular
- do not break current payment-link creation flow
- keep scope to webhook sync only

## Done when
- Razorpay webhook endpoint accepts valid events
- signature is verified
- payment link status updates in DB
- /payments and inbox sidebar show updated status after refresh