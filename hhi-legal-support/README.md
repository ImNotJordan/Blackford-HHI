# Hyacinth Legal Support

Clickable prototype for Hyacinth Industries, LLC — Legal Support: the marketing website, the client operations portal and the internal admin area, sharing one in-memory data store.

Built with Next.js 16 (App Router), React 19, TypeScript, Zustand + Immer. No backend: all data is mock data held in the browser and resets on a full page reload.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # http://localhost:3000
```

## Surfaces and routes

| Surface | Start at | Notes |
|---|---|---|
| Website | `/` | Sections `/#services`, `/#contact` …; legal pages `/privacy`, `/terms`, `/accessibility` |
| Client portal | `/portal` | `/portal/workflows`, `/portal/deadlines`, `/portal/reports`, `/portal/account`, `/portal/help` |
| Admin | `/admin` | Sign in with any email and password. `/admin/clients`, `/admin/workflows`, `/admin/team`, `/admin/leads`, `/admin/content`, `/admin/users`, `/admin/audit`, `/admin/settings`, `/admin/design-system` |

Unknown paths redirect to the nearest surface home.

## Project layout

```
src/
  app/                  routes: (site)/, portal/, admin/
  components/
    ui/                 shared UI kit: dropdowns, date pickers, modals, sheet, toasts, charts, blocks
    site/  portal/  admin/  shared/   surface components
    shell/              app shell: mount gate, surface switcher, global hosts
    icons.tsx
  lib/
    store.ts            shared Zustand store (state + actions; every change returns an Undo)
    selectors.ts        derived data
    seed.ts  data.ts    mock data
    format.ts           date, time-zone and display formatting
    types.ts
legacy/                 the original single-file vanilla HTML/CSS/JS prototype (reference)
```
