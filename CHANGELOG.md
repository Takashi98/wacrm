## 2026-04-20

- added a root-level project script entrypoint and repo `.gitignore`
- replaced the Vite demo client with a JavaScript React Router + Tailwind foundation
- restructured the Express backend into modular app, config, routes, controllers, and middleware layers
- added client and server `.env.example` files for local setup
- added the first Inbox UI shell at `/inbox` with responsive conversation, chat, and lead panels
- introduced mock inbox data and mobile lead drawer behavior without backend integration
- refined the Inbox shell into three distinct desktop panels with a stronger chat-first hierarchy
- reduced the Inbox intro area into a slim header and converted the page into a fuller-height operator workspace
- added the Leads pipeline shell at `/leads` with a responsive mock pipeline board and empty states
- added the Automations shell at `/automations` with a responsive mock rules workspace and empty states
- added the Payments shell at `/payments` with a responsive mock payment records workspace and empty states
- added the Analytics shell at `/analytics` with a responsive mock business dashboard and empty states
- added the first auth foundation with login, signup, protected routes, and modular backend auth endpoints
- added the first workspace foundation with workspace creation on signup, user linkage, and workspace-aware auth state
- added the first leads foundation with workspace-scoped lead APIs and real backend data on the Leads page
