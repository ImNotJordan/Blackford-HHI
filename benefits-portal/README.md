# Blackford Benefits Portal

Module D of the Blackford Benefits Platform (SOW v2.0): employees and clients open a text or email link on any device, confirm with a one-time code, and finish enrollment in one session. Staff and employers watch the same enrollment records.

This is a fresh project containing **only the Benefits Portal screens** from the design canvas "Blackford Platform — MVP Screens" → *Platform map · where every screen lives* → **Benefits portal (15)**, plus the portal states from the W3 build-ready boards.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the build
npm run lint
```

`/` lists every screen. Demo rules: sample data, no backend, any 6-digit code signs in, and portal choices live in memory only (they reset on reload; the design forbids caching client data in browser storage).

## Screens

| Canvas screen | Route |
|---|---|
| 1 · Sign in | `/portal/sign-in` |
| 2 · Start and your details | `/portal/start` |
| 3 · Dependents | `/portal/dependents` |
| 4 · Compare plans | `/portal/compare` |
| 5 · Elect or waive | `/portal/elect` |
| 6 · Beneficiaries | `/portal/beneficiaries` |
| 7 · Review and sign | `/portal/sign` |
| 8 · Confirmation | `/portal/done` |
| After · My benefits and renewal | `/portal/my-benefits` |
| After · Report a life event | `/portal/life-event` |
| After · Ask for help | `/portal/help` |
| iPad · Agent-assisted enrollment | `/staff/assist` |
| D · Enrollments list | `/staff/enrollments` |
| D · Employer enrollment progress | `/employer/progress` |
| F · Payroll deduction updates | `/employer/payroll` |

W3 build-ready states: `/portal/link/{expired,welcome-back,enrolled,closed,signed-out,not-mine}`; in-flow validation (child over 26, waive without a reason, shares not totalling 100%, consent before signing, drawn signature), an offline banner, the staff side panel, and the employer "below 70%" alert.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, lucide-react
- `next-intl` for English and Spanish (portal screens); the switch is on Sign in, Start and the entry states
- `signature_pad` for drawn signatures (typed signatures also supported)
- Fonts self-hosted with `next/font`: Inter (body), Manrope (headings), JetBrains Mono (figures)

## Structure

```
src/
  app/
    page.tsx              # screen index
    portal/               # employees and clients · phone (one provider keeps choices across steps)
      <step>/page.tsx     # route + metadata
      <step>/screen.tsx   # client screen
      link/[state]/       # entry states (expired, welcome back, ...)
    staff/                # enrollments list, in-person iPad session
    employer/             # enrollment progress, payroll deduction updates
  components/
    ui.tsx                # buttons, inputs, tags, alerts, brand mark
    shells.tsx            # staff sidebar and employer top bar
    toast.tsx             # status toasts for demo actions
    portal/               # providers, phone chrome, signature pad
  lib/
    demo-data.ts          # scenario data (Maria Delgado, Riverside Dental)
    enrollment-store.tsx  # in-memory enrollment state
  messages/en.ts, es.ts   # portal copy (Spanish typed against English)
```

## Theme

Colors, type and spacing follow the design canvas and are defined once as tokens in `src/app/globals.css` (`@theme`). Components use token classes only (`bg-brand`, `text-muted`, `border-line`...), so a palette change is a one-file edit.

Note: `docs/Blackford-brand-guidelines.md` and `design-system/blackford-benefits/MASTER.md` specify a different palette (Ink / Ruby / Gold / Ivory, DM Serif Display + IBM Plex). The screens here follow the canvas; confirm which one is final with Blackford.

## Reference

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Working guidelines for coding agents |
| `.agents/skills/`, `skills-lock.json` | Design and engineering skills |
| `design-system/blackford-benefits/MASTER.md` | Brand-locked design tokens |
| `docs/` | SOW v2.0 extract, brand guidelines, brand colors, UX laws |

## Placeholders to confirm

- Rates for tiers the canvas doesn't show are sample values (marked in `src/lib/demo-data.ts`).
- E-records consent text, carrier names (`[Carrier]`) and the portal idle timeout come from Blackford.
- Spanish copy needs a professional review before launch.
