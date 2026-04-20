# Task 008 - Workspace Foundation

## Goal
Build the workspace foundation for WACRM.

## Why
WACRM is a business SaaS product, so users, leads, chats, payments, automations, and analytics must belong to a workspace.

## Scope
This task includes:
- create workspace model
- create workspace module structure
- create workspace during signup
- link user to workspace
- update auth/me response to include workspace
- show workspace name in app shell

## Must include
Backend:
- workspace model
- workspace service
- workspace creation during signup
- user linked to workspace

Frontend:
- auth state updated to include workspace
- app shell can read and display workspace name

## Out of scope
- team invites
- multiple workspaces per user
- switching workspaces
- role permissions complexity
- workspace settings page

## Important rules
- keep it simple
- JavaScript only
- no unrelated features
- build real product foundation, not mock-only UI

## Done when
- signup creates both user and workspace
- user is linked to workspace
- /me returns workspace data
- app shell shows workspace name