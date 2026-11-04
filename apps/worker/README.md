# @blackford/worker

Node.js automation engine stub for the Blackford Platform.

Planned stack (not yet installed):

- **Graphile Worker** — durable job queue on PostgreSQL
- **Puppeteer** — PDF / carrier document generation
- **pdf-lib** — PDF manipulation
- **LiquidJS** — message and document templates

Job names are defined in `src/index.ts`. Implementation will enqueue and process tasks against `@blackford/db` and call `@blackford/core` for permissions and audit hooks.
