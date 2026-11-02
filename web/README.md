# Blackford Benefits Platform — MVP screens

Next.js App Router UI for **Hyacinth – Blackford Platform Scope of Work v2.0** (Benefits CRM & Enrollment).

Interactive mock screens for all five SOW roles and modules **A–H**. Not wired to live messaging, carriers, or auth backends.

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and pick a role from the hub.

```bash
npm run build   # production build
npm run start   # serve production build
```

## Role portals

| Path | Role | Primary SOW job |
|------|------|-----------------|
| `/` | Hub | Switch between portals |
| `/admin/*` | Blackford admin | Users/MFA, audit, reports, carrier approvals, all groups |
| `/manager/*` | Account manager | Book of business: clients, inbox, onboarding, life events, renewals, carrier drafts |
| `/employer/*` | Employer HR | Census, plans, setup approval, enrollment progress, new hires |
| `/employee/*` | Group employee | OTP → guided enroll → elect/waive → e-sign |
| `/client/*` | Individual / Medicare | Household, coverage, life events, service, individual intake |

Legacy `/staff/*` mirrors older CRM routes; prefer `/manager/*`.

## Modules (SOW A–H)

| Code | Module | Example screens |
|------|--------|-----------------|
| **A** | Client management | Clients, contacts, pipeline, search/filters, notes, tasks, team queue, documents, import |
| **B** | Communications | Inbox, compose, templates (EN/ES), delivery tracking, consent / quiet hours |
| **C** | Employer onboarding | Checklist, census validation, plans, contributions, eligibility, windows, setup, invites |
| **D** | Benefits portal | OTP sign-in, 7-step enrollment, compare/elect, resume, agent iPad, employer progress |
| **E** | Signing | E-sign + consent, signature audit, employer agreement, paper upload |
| **F** | Changes & renewals | Life events + proof, verifications, staff changes/terms, renewal rates / re-enroll |
| **G** | Carrier submission | Draft files, per-person validation, approve/deliver, export log |
| **H** | Audit & platform | Roles, MFA, access review, audit log, reports, ACA data capture, automations (1–17) |

**Later releases (not MVP UI):** carrier APIs, ACA filing, commissions / TPA / AI.

## App structure

```
web/src/
  app/                 # App Router pages per role
  components/
    shells.tsx         # Shared AppShell sidebar for all roles
    ui.tsx             # Cards, tables, buttons, fields
    features.tsx       # SOW module tags, steppers, automations strip, audit UI
    interactive.tsx    # Inbox, checklist, elect/waive, census, e-sign, forms
    verification.tsx   # Image proof, manual verification workspace
    gap-features.tsx   # Delivery, renewals, staff changes, reports, new hire
    working.tsx        # Saves, downloads, filters, invite staff, task board
  lib/
    nav.ts             # Sidebar IA per role
    roles.ts           # Role metadata for the hub
    sow-features.ts    # Modules A–H + 17 automations catalog
    mock-data.ts       # Sample clients, tasks, plans
    verification.ts    # Mock proof assets and verification cases
```

Navigation is defined in `src/lib/nav.ts` and rendered by `AppShell` in `src/components/shells.tsx`.

## Brand & UX

- Tokens and contrast rules: Hyacinth / Blackford brand (Ink, Ruby, Gold Deep, Ivory, Parchment).
- Layout: compact panels, **vertical scroll only** (tables stack on narrow viewports).
- See `../docs/Blackford-brand-guidelines.md` and `../design-system/blackford-benefits/MASTER.md`.

## References

| Doc | Purpose |
|-----|---------|
| `../OBJECTIVES.md` | Roles, module done criteria, component map |
| `../docs/SOW-v2-extract.txt` | Text extract of SOW v2.0 |
| `../docs/Blackford-brand-guidelines.md` | Colors, type, components |
| `../docs/UX-Laws.md` | UX reference |
| `../design-system/blackford-benefits/MASTER.md` | Brand-locked design tokens |

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- TypeScript
- lucide-react

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

Generator helpers under `scripts/` (`gen-*.mjs`) scaffold SOW-aligned pages; prefer editing routes in `src/app` after generation.
