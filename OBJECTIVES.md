# Blackford Benefits Platform — MVP Objectives

Source: **Hyacinth – Blackford Platform Scope of Work v2.0** (October 30, 2026).  
Brand: `docs/Blackford-brand-guidelines.md`. Prefer SOW + brand over invented scope or colors.

## What the document is about

Hyacinth is building a **Benefits CRM & Enrollment Platform** for **Blackford & Associates** (Jacksonville, FL):

- **One system** to manage clients and enroll them in benefits (Ease-style sign-up owned by Blackford).
- **Staff** run CRM: clients, onboarding, messaging, renewals, carrier files.
- **Employer HR** uses a portal: setup, census, enrollment progress.
- **Employees / clients** enroll from a secure text/email link on phone, iPad, or web.
- **17 automations** at launch handle invites, reminders, escalations, and carrier drafts.
- **MVP target** May 7, 2027 (committed June 2027). Carrier APIs / ACA filing / commissions are later releases — ACA *data* is captured from day one.

## Roles (five portals)

| Portal | Who | Primary job |
|---|---|---|
| `/admin` | Blackford admin | Users/MFA, audit, weekly reports, carrier approvals, all groups |
| `/manager` | Account manager | Assigned book: clients, inbox, onboarding, life events, renewals, drafts |
| `/employer` | Employer HR | Census, plans, setup approval, enrollment progress |
| `/employee` | Group employee | OTP → guided enroll → e-sign |
| `/client` | Individual / Medicare | Household coverage, documents, service, life events |

Legacy `/staff/*` → `/manager/*`.

## Modules A–H (done criteria)

| Code | Module | Done when |
|---|---|---|
| A | Client management | Find any client; see plans, messages, documents |
| B | Client communications | Text a whole group; see replies on each record |
| C | Employer onboarding | Signed → ready to enroll in-system |
| D | Benefits portal | Phone text link → finish enrollment in one session |
| E | Signing by text | Produce signed doc + audit trail on request |
| F | Changes & renewals | Birth from phone; test group renews end to end |
| G | Carrier submission | Carrier accepts a test file from the system |
| H | Audit & platform | Pen test passes; roles, MFA, WCAG AA |

## Navigation

All five portals share `AppShell` (`src/components/shells.tsx`) with sectioned sidebar IA from `src/lib/nav.ts`. Sign-in routes render without the chrome. Employee pages keep per-route step banners.

## Shared feature components

- `src/components/features.tsx` — module tags, automation strip, consent/quiet hours, delivery tracker, pipeline bar, enrollment stepper, validation errors, signature audit, ACA note, timeline, feature grid.
- `src/components/interactive.tsx` — working EN/ES toggle, action toasts, checklist, inbox workspace, elect/waive, census uploader, signature pad, life-event & service forms, OTP sign-in, approve/reject.
- `src/components/verification.tsx` — image proof, lightbox, manual checklist, verification queue/workspace.
- `src/components/gap-features.tsx` — staff changes/terms, delivery tracking, saved filters, renewal rates/re-enroll, new-hire intake, employer agreement sign, report drill-downs.

## Contrast rules (visibility)

- Body text on light: **Ink** or **muted** (`#4A453E`) — never Warm Gray on Ivory.
- Labels/links on light: **Gold Deep**.
- On Ink surfaces: **Ivory** or **Pale Gold**.
- Ruby: accents/errors only; one accent button per screen.
