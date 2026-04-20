# Task 014 - Lead To Payment Link Foundation

## Goal
Allow users to create a payment link for a lead and show that payment link in the product.

## Why
WACRM should help businesses move from conversation and lead tracking to actual payment collection.

## Scope
This task includes:
- build the real backend foundation for payment links
- create a payment link model if needed
- create payment routes and service structure
- create a create-payment-link endpoint for a lead
- store the created payment link against the workspace and lead
- connect the Payments page to real backend data
- allow lead context to show payment link status if available

## Must include
Backend:
- payment link model / module structure
- workspace-scoped payment link queries
- create payment link endpoint for a lead
- list payment links endpoint
- basic payment link status field

Frontend:
- Payments page uses backend data instead of mock data
- create payment link CTA from a lead context or payments page
- show payment link records in the Payments page
- keep the existing Payments shell structure as much as possible

## Out of scope
- full Razorpay integration if not ready yet
- webhook sync
- resend logic
- reminder automation
- refunds
- full billing system

## Important rules
- JavaScript only
- keep backend modular
- keep all queries workspace-scoped
- preserve the current Payments shell layout as much as possible
- keep scope to payment link foundation only

## Done when
- payment links can be created for a lead
- payment links are stored in database
- /payments uses backend data
- lead context can show whether a payment link exists