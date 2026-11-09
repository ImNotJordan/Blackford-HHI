# Blackford Platform — staff CRM and onboarding MVP

Modules **A, B, C**, staff side of **D** and **F**, and the carrier file queue (**G**). Blackford staff on desktop or iPad.

The employer HR portal is a separate system in its own folder: `../blackford-employer-portal` (runs on http://localhost:3300).

```bash
npm install
npm run dev          # staff CRM — http://localhost:3200
```

Port 3200 is used so the CRM doesn't clash with other local projects on 3000.

**Staff entry points:** `/` opens My work today · `/login` staff sign-in with MFA (also the sidebar's Sign out)  
**Brand:** Hyacinth Ink / Ruby / Gold / Ivory — see `BRAND.md` and `packages/brand/tokens.css`

## Staff CRM (`apps/staff` · :3200)

| Screen | Module | Route |
|--------|--------|-------|
| Staff sign-in with MFA | H | `/login` |
| My work today | A | `/work` |
| Clients and pipeline | A | `/clients` |
| Group record | A | `/groups/[id]` |
| Household record | A | `/households/[id]` |
| New individual client | C | `/clients/new` |
| Import the book | A | `/import` |
| Shared inbox | B | `/inbox` |
| Bulk send | B | `/bulk-send` |
| Message templates | B | `/templates` |
| Onboarding checklist and setup | C | `/onboarding` |
| Changes and renewals | F | `/changes` |
| Group renewal | F | `/renewals` |
| Enrollments list | D | `/enrollments` |
| Agent-assisted enrollment (iPad) | D | `/agent-assist` |
| Carrier files and status | G | `/carrier-files` |
| Carrier file approval | G | `/carrier-files/[id]` |
| Exceptions: escalations and data checks | H | `/exceptions` |
| Signed document and audit trail | E | `/documents/[id]` |

On iPad widths (under 1200px) the sidebar collapses to a 76px icon rail with 52px touch targets.

## Employer HR portal

Moved to `../blackford-employer-portal` (its own `npm install` / `npm run dev`). It holds invite and sign-in, company and payroll schedule, group setup and agreement, census upload, employees and new hires, enrollment progress, and payroll deduction updates.

There is **no benefits / employee enrollment portal** in this MVP scope.

## Shared packages

| Package | Purpose |
|---------|---------|
| `@blackford/core` | Zod schemas, permission and audit stubs |
| `@blackford/db` | Drizzle schema stubs |
| `apps/worker` | Automation job-name stub (used later for reminders, eligibility, etc.) |

## Legacy design canvas

Sanitized `.dc.html` references in `1-staff/` (the employer references moved with the employer portal).

## Tech stack doc

`docs/tech-stack/` — HTML recreation of the platform tech-stack PDF (reference only).

## Environment setup

Local UI runs in **demo mode** — no cloud credentials required.

```bash
npm run env:init      # copies .env.example → .env.local / worker .env if missing
npm run check-env     # validates APP_ENV and required vars
```

| Mode | `APP_ENV` | What you need |
|------|-----------|----------------|
| Local UI (default) | `demo` | Nothing — uses `apps/*/ .env.local` stubs |
| Local + real services | `development` | Fill only the services you wire |
| Staging / production | `staging` / `production` | `DATABASE_URL`, Identity Platform, AWS SES/SMS |

Templates:
- Root reference: `.env.example`
- Per app: `apps/staff/.env.example`, `apps/worker/.env.example`
- Secrets go in `.env.local` / `apps/worker/.env` (gitignored)

Typed loader: `@blackford/core` → `loadEnv()` / `getStaffEnv()`. Staging and production fail fast if database, identity, or AWS messaging are missing.

### Setup links (BAAs and consoles)

Sign BAAs before client data leaves the apps.

| Area | Links |
|------|--------|
| Agreements | [Google Cloud BAA](https://cloud.google.com/terms/hipaa-baa) · [Google HIPAA covered products](https://docs.cloud.google.com/docs/security/compliance/hipaa) · [AWS HIPAA eligible services](https://aws.amazon.com/compliance/hipaa-eligible-services-reference/) · [Accept AWS BAA in Artifact](https://docs.aws.amazon.com/artifact/latest/ug/manage-agreements.html) |
| Database (`DATABASE_URL`) | [Create Cloud SQL Postgres](https://cloud.google.com/sql/docs/postgres/create-instance) · [Connect overview](https://cloud.google.com/sql/docs/postgres/connect-overview) · [Console](https://console.cloud.google.com/sql) |
| Sign-in (Identity Platform) | [Email/password quickstart](https://cloud.google.com/identity-platform/docs/quickstart-email-password) · [Phone OTP](https://cloud.google.com/identity-platform/docs/phone) · [MFA](https://cloud.google.com/identity-platform/docs/admin/manage-mfa-users) · [vs Firebase Auth](https://docs.cloud.google.com/identity-platform/docs/product-comparison) · [HIPAA guide](https://cloud.google.com/security/compliance/hipaa/identity-platform) · [Console](https://console.cloud.google.com/customer-identity) |
| Files & encryption | [Create Storage buckets](https://cloud.google.com/storage/docs/creating-buckets) · [Storage console](https://console.cloud.google.com/storage) · [Public access prevention](https://cloud.google.com/storage/docs/using-public-access-prevention) · [Create KMS key](https://cloud.google.com/kms/docs/create-key) · [KMS console](https://console.cloud.google.com/security/kms) |
| Email & text (AWS) | [SES setup](https://docs.aws.amazon.com/ses/latest/dg/setting-up.html) · [SES console](https://console.aws.amazon.com/ses/home) · [End User Messaging SMS](https://docs.aws.amazon.com/sms-voice/latest/userguide/what-is-service.html) · [SMS compliance](https://docs.aws.amazon.com/sms-voice/latest/userguide/compliance-validation.html) · [A2P 10DLC](https://docs.aws.amazon.com/sms-voice/latest/userguide/registrations-10dlc.html) · [IAM access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) |

The same URLs are mirrored as comments in `.env.example`.

## Demo data rules

- Phones: `(555) 010-xxxx`
- Emails: `@example.com`
- EIN / SSN masked only — never full numbers in UI
