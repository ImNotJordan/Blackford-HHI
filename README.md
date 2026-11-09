# Blackford Platform — employer HR portal

Employer HR contacts use this portal to set up their group with Blackford during onboarding (module C, signing under E) and to follow enrollment and payroll changes (D, F). It's a separate system from the staff CRM, which lives in `../blackford-crm-and-onboarding` (http://localhost:3200).

```bash
npm install
npm run env:init     # creates apps/employer-portal/.env.local if missing
npm run dev          # http://localhost:3300
```

Opening `/` takes you to the first sidebar screen. The sidebar's Sign out goes to the invite / one-time code screen.

**Brand:** Hyacinth Ink / Ruby / Gold / Ivory — see `BRAND.md` and `packages/brand/tokens.css`

## Screens (`apps/employer-portal` · :3300)

| Screen | Module | Route |
|--------|--------|-------|
| Invite and secure sign-in | C | `/employer/invite` |
| Company, contacts and payroll schedule | C | `/employer/company` |
| Group setup and agreement | C · E | `/employer/setup` |
| Census upload | C | `/employer/census` |
| Employees and new hires | C | `/employer/employees` |
| Enrollment progress | D | `/employer/progress` |
| Payroll deduction updates | F | `/employer/payroll` |

HR sees only their own group, never anyone's plan choices or full SSNs.

## Folders

| Folder | Purpose |
|--------|---------|
| `apps/employer-portal` | Next.js app |
| `packages/brand` | Brand tokens (copy of the CRM's package) |
| `packages/core` | Env loader and shared schemas (copy of the CRM's package) |
| `design-reference/` | Sanitized `.dc.html` design references |

`packages/brand` and `packages/core` are copies of the same packages in the CRM repo. Keep them in sync when either changes.

## Demo data rules

- Phones: `(555) 010-xxxx`
- Emails: `@example.com`
- EIN / SSN masked only — never full numbers in UI
