# AGENTS.md

## Project
WACRM is a WhatsApp-first CRM for Indian SMBs.
The goal of this product is to help businesses manage WhatsApp conversations, convert chats into leads, track pipeline stages, automate follow-ups, send payment links, and view business performance in one simple dashboard.

---

## Read first before making any change
Always read these files first:
- README.md
- docs/product-spec.md
- docs/tech-stack.md
- relevant file inside tasks/

If a task file exists, follow that task file strictly.

---

## Product principles
- Keep the product simple and usable for non-technical Indian SMB users
- Prioritize clarity over fancy design
- Every important screen must work properly on both mobile and desktop
- Keep flows short and obvious
- Use familiar CRM and WhatsApp patterns
- Build MVP-first, not over-engineered versions

---

## Engineering rules
- Keep changes minimal and scoped
- Do not touch unrelated files
- Do not refactor large parts unless explicitly asked
- Reuse existing components and patterns whenever possible
- Prefer readable code over clever code
- Do not add dependencies unless clearly needed
- Do not invent API routes, database fields, or business rules unless they are added to docs
- If adding a new API route, model field, or feature behavior, update relevant docs
- Update CHANGELOG.md after each completed task

---

## Frontend rules
- Use React with component-based architecture
- Use Tailwind CSS for styling
- Keep components small and reusable
- Use mobile-first responsive design
- Build clean SaaS UI with clear spacing and hierarchy
- Always include loading, empty, and error states for key screens
- Avoid UI clutter
- Keep forms simple and easy to understand
- Use consistent button, input, card, and modal patterns

---

## Backend rules
- Use Express with modular structure
- Keep controllers thin
- Put business logic in services
- Keep DB logic separated cleanly
- Use MongoDB with clear schema names
- Validate inputs before processing
- Do not trust frontend input blindly
- Keep APIs predictable and REST-style for MVP
- Keep provider-specific logic separated from core product logic

---

## Real-time and webhook rules
- Database is the source of truth
- Socket events are only for UI updates
- Webhooks must be stored and processed safely
- Avoid duplicate processing of incoming webhook events
- Keep WhatsApp provider logic abstracted from the rest of the app

---

## MVP scope discipline
For MVP, prioritize only:
- Inbox
- Lead creation from chats
- Pipeline management
- Tags and notes
- One simple automation system
- Razorpay payment links
- Basic analytics

Avoid building advanced features unless asked:
- complex workflow builder
- deep permissions system
- AI features
- advanced reports
- multi-channel inbox
- inventory or ERP logic

---

## Workflow for every task
For every task:
1. Understand the task
2. Read the relevant files
3. List files to inspect or modify
4. Make the smallest practical change
5. Verify the app still works
6. Summarize what changed
7. Suggest the next best step only if useful

---

## Verification
After important changes:
- run build
- run relevant checks
- mention what was verified
- give manual QA steps

If something cannot be verified, clearly say so.

---

## Safety rules
- Never delete large working sections unless explicitly asked
- Never overwrite unrelated code
- If something is unclear, inspect existing code first instead of guessing
- If blocked, explain the blocker clearly and suggest the smallest next step
- Do not pretend something works unless it has actually been checked

---

## Output style
When responding during implementation:
- be clear
- be practical
- be concise
- mention changed files
- mention verification status