# Task 010 - Leads Interaction UI

## Goal
Make the Leads page usable from the UI by allowing lead creation and stage updates without using the browser console.

## Scope
This task includes:
- add a Create Lead button on the Leads page
- add a create lead modal or drawer
- submit the form to the existing leads API
- refresh the board after lead creation
- add a simple stage update action in the UI
- preserve the existing Leads page shell

## Must include
- create lead CTA
- lead creation form
- fields:
  - name
  - business name
  - source
  - value
  - notes
  - tags
- form submit to POST /api/v1/leads
- simple stage update UI using PATCH /api/v1/leads/:leadId/stage

## Out of scope
- drag and drop
- advanced filters
- search
- editing full lead details
- delete lead
- assignment logic

## Important rules
- JavaScript only
- keep the UI simple and aligned with the current design
- use the existing leads backend
- do not rebuild the whole Leads page
- keep scope to create + stage update only

## Done when
- user can create a lead from the UI
- new lead appears in the correct stage
- user can update stage from the UI
- leads board refreshes correctly