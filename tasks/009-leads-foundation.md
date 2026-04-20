# Task 009 - Leads Foundation

## Goal
Build the first real leads foundation for WACRM.

## Why
Leads are a core business object in WACRM. They must belong to a workspace and support pipeline-based tracking.

## Scope
This task includes:
- create lead model
- create leads module structure
- create workspace-scoped lead routes
- create create-lead endpoint
- create list-leads endpoint
- create update-lead-stage endpoint
- create basic notes, tags, source, and value fields in model
- connect the Leads page to fetch real data from backend

## Must include
Backend:
- lead model
- leads routes
- leads controller
- leads service
- workspace-scoped queries
- stage support:
  - New
  - Contacted
  - Qualified
  - Won
  - Lost

Frontend:
- fetch leads from backend instead of mock data
- render pipeline columns using real API response
- keep current shell/layout intact

## Out of scope
- drag and drop
- advanced filters
- search
- pagination
- notes UI editor
- lead assignment logic
- CSV import
- conversation linking

## Important rules
- JavaScript only
- keep backend modular
- keep queries workspace-scoped
- do not build unrelated product logic
- preserve the existing leads UI shell structure as much as possible

## Done when
- leads are saved in database
- leads belong to a workspace
- /api/v1/leads returns workspace leads
- leads page uses API data instead of mock data
- stage updates work through backend