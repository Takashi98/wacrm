# Task 018 - Automation Execution First Rule

## Goal
Implement the first real automation execution path in WACRM.

## Why
Automation rules now exist in the database, but they do not do anything yet. We need one narrow real execution flow to prove the automation engine works.

## Scope
This task includes:
- create automation run model
- create execution flow for one rule type only
- support trigger:
  - lead_created
- support action:
  - mark_followup_due
- when a lead is created, check active matching automations in the workspace
- if a matching automation exists:
  - set followUpDueAt on the lead
  - update automation lastRunAt
  - save an automation run record

## Must include
Backend:
- automation run model
- execution helper/service
- hook automation execution into lead creation flow
- update lead with followUpDueAt
- update automation rule lastRunAt
- save automation run result/status

Frontend:
- show follow-up due information on lead cards if available
- keep the current Leads page structure mostly intact
- no major Automations page rebuild

## Out of scope
- queue workers
- delayed jobs
- no-reply logic
- WhatsApp sending
- visual builder
- advanced conditions
- retries
- audit log UI

## Important rules
- JavaScript only
- keep scope very narrow
- do not build a generic complex engine yet
- implement only lead_created -> mark_followup_due
- keep everything workspace-scoped

## Done when
- an active automation with trigger lead_created and action mark_followup_due actually runs
- lead gets followUpDueAt
- automation rule gets lastRunAt
- automation run record is stored
- lead card can show follow-up due info