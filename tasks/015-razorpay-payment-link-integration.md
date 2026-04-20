# Task 015 - Razorpay Payment Link Integration

## Goal
Replace the placeholder payment-link creation with real Razorpay payment-link creation.

## Why
WACRM should not just store payment link records. It should generate real payment links that businesses can actually send to customers.

## Scope
This task includes:
- add Razorpay integration in backend
- create real payment links through Razorpay API
- store provider payment link id
- store real payment link URL
- keep the existing payment-link creation UI intact
- preserve workspace-scoped payment records

## Must include
Backend:
- Razorpay config/env support
- payment provider integration in payments service
- real POST /api/v1/payments/links behavior using Razorpay
- store:
  - provider
  - providerPaymentLinkId
  - linkUrl
  - status
  - amount
  - leadId
  - workspaceId

Frontend:
- keep current create-payment-link UI working
- show the real link URL returned from backend
- keep current Payments page structure intact
- keep inbox lead sidebar payment-link display intact

## Out of scope
- webhook sync
- payment success/failure auto updates
- refunds
- resend flow
- reminder automations
- full billing system

## Important rules
- JavaScript only
- keep backend modular
- keep all queries workspace-scoped
- preserve the current Payments shell and creation flow as much as possible
- keep scope to real payment-link creation only

## Done when
- creating a payment link generates a real Razorpay payment link
- the link is stored in database
- the real link URL appears in Payments page and inbox lead context
- existing UI flow continues to work