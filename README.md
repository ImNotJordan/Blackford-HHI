# Blackford Platform — CRM and onboarding MVP

Modules **A, B, C**, and staff side of **F**. Blackford staff on desktop or iPad, plus employer HR during onboarding.

```bash
npm install
npm run dev          # both apps: staff :3000 + portal :3001
npm run dev:staff    # staff CRM only — http://localhost:3000
npm run dev:portal   # employer portal only — http://localhost:3001
```

**Staff entry points:** `/` landing · `/login` staff sign-in · `/work` my work today  
**Brand:** Hyacinth Ink / Ruby / Gold / Ivory — see `BRAND.md` and `packages/brand/tokens.css`

## Staff CRM (`apps/staff` · :3000)

| Screen | Module | Route |
|--------|--------|-------|
| My work today | A | `/` |
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

## Employer HR onboarding (`apps/portal` · :3001)

| Screen | Module | Route |
|--------|--------|-------|
| Invite and secure sign-in | C | `/employer/invite` |
| Company, contacts and payroll schedule | C | `/employer/company` |
| Group setup and agreement | C · E | `/employer/setup` |
| Census upload | C | `/employer/census` |
| Employees and new hires | C | `/employer/employees` |

There is **no benefits / employee enrollment portal** in this MVP scope.

## Shared packages

| Package | Purpose |
|---------|---------|
| `@blackford/core` | Zod schemas, permission and audit stubs |
| `@blackford/db` | Drizzle schema stubs |
| `apps/worker` | Automation job-name stub (used later for reminders, eligibility, etc.) |

## Legacy design canvas

Sanitized `.dc.html` references in `1-staff/` and `2-employer-hr-onboarding/`.

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
- Per app: `apps/staff/.env.example`, `apps/portal/.env.example`, `apps/worker/.env.example`
- Secrets go in `.env.local` / `apps/worker/.env` (gitignored)

Typed loader: `@blackford/core` → `loadEnv()` / `getStaffEnv()` / `getPortalEnv()`. Staging and production fail fast if database, identity, or AWS messaging are missing.

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
