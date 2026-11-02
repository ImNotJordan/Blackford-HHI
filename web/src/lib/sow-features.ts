/**
 * Feature catalog from Hyacinth – Blackford Platform SOW v2.0
 * (Benefits CRM & Enrollment Platform).
 *
 * Product: one Blackford-branded system so staff manage the book of business,
 * employers onboard groups, and employees/clients enroll and sign — with
 * reminders, life events, renewals, and approved carrier files. Ease stays
 * until MVP go-live (target May 7, 2027).
 */

export const sowModules = [
  {
    code: "A",
    name: "Client management",
    done: "Staff can find any client and see every plan, message, and document.",
    features: [
      "Linked records: groups, individuals, employees, dependents, contacts",
      "Household view for individual and Medicare clients",
      "Plans, carriers, policy numbers, effective dates",
      "Pipelines: prospect → quoting → onboarding → enrolling → active → renewal",
      "Notes, tasks, documents, activity timeline",
      "My work today · team queues · staff assignment",
      "Search, saved filters, service requests",
      "Spreadsheet import with duplicate detection",
    ],
  },
  {
    code: "B",
    name: "Client communications",
    done: "Staff can text a whole group and see every reply on each client record.",
    features: [
      "Email and two-way text from any record",
      "Shared staff inbox",
      "Templates with merge fields (English & Spanish)",
      "Bulk send to group or filtered list (e.g. not yet enrolled)",
      "Consent and opt-out · STOP / HELP automatic",
      "Quiet hours by recipient time zone",
      "Delivery tracking with channel fallback",
    ],
  },
  {
    code: "C",
    name: "Employer onboarding",
    done: "New group goes from signed to ready to enroll without leaving the system.",
    features: [
      "Checklist with due dates counted back from effective date",
      "Employer portal invite and secure HR sign-in",
      "Census upload from Blackford template + field validation",
      "Plans, rates by tier, employer contributions",
      "Eligibility: classes, waiting periods, hours, dependent age limits",
      "OE and new-hire windows · individual intake",
    ],
  },
  {
    code: "D",
    name: "Benefits portal",
    done: "Employee opens a text link on a phone and finishes enrollment in one session.",
    features: [
      "Passwordless OTP from text or email link",
      "Guided flow: details → dependents → compare → elect/waive → beneficiaries → sign",
      "Per-paycheck and annual cost comparison",
      "Save and resume at exact step",
      "Confirmation PDF on the record",
      "Agent-assisted iPad mode",
      "Employer enrollment progress view",
    ],
  },
  {
    code: "E",
    name: "Sign-up and signing by text",
    done: "Staff can produce any signed document and its audit trail on request.",
    features: [
      "Election forms and carrier applications as PDFs",
      "E-sign on phone with electronic-records consent first",
      "Audit trail: name, time, device, IP",
      "Employer agreements signed the same way",
      "Paper fallback with staff upload",
    ],
  },
  {
    code: "F",
    name: "Policy changes and renewals",
    done: "Employee reports a birth from a phone; a test group renews end to end.",
    features: [
      "Self-service life events with document upload",
      "Staff approval before carrier file",
      "Staff-entered changes and terminations",
      "Renewal calendar, rate updates, re-enrollment window",
      "120-day renewal automation",
    ],
  },
  {
    code: "G",
    name: "Carrier submission",
    done: "A carrier accepts a test file built in the system.",
    features: [
      "Export template per carrier",
      "Change-only files: adds, changes, terminations",
      "Validation with errors listed per person",
      "Staff approval before release",
      "SFTP or encrypted download — never plain email",
      "Export log with resend · confirmation tracking",
    ],
  },
  {
    code: "H",
    name: "Audit, reporting and platform",
    done: "Outside penetration test passes with all findings fixed.",
    features: [
      "Audit log of every sign-in, view, change, export, message, signature",
      "Enrollment, carrier, onboarding, data quality reports",
      "Roles: admin, account manager, employer HR, employee (+ client)",
      "MFA for staff · HIPAA hosting under BAA",
      "Phone, iPad, desktop · WCAG 2.1 AA",
      "ACA data captured from day one (filing in R2)",
    ],
  },
] as const;

export const automations = [
  { id: 1, when: "Enrollment window opens", does: "Invite by text + email with secure link", who: "Employee", group: "Enrollment" },
  { id: 2, when: "7 / 3 / 1 days before close", does: "Status-aware reminder (not started / started / ready to sign)", who: "Employee", group: "Enrollment" },
  { id: 3, when: "Person completes or waives", does: "Stop reminders, send confirmation PDF, update employer view", who: "Employee, HR", group: "Enrollment" },
  { id: 4, when: "Group below 70% · 3 days to close", does: "Send outstanding list", who: "HR, Account manager", group: "Enrollment" },
  { id: 5, when: "Window closes with people outstanding", does: "Task per person; no auto-waive unless rules say so", who: "Account manager", group: "Enrollment" },
  { id: 6, when: "HR adds a new hire", does: "Compute eligibility date; schedule invite", who: "Employee", group: "Enrollment" },
  { id: 7, when: "Weekly while window open", does: "Progress digest for the group", who: "HR contact", group: "Enrollment" },
  { id: 8, when: "Group marked signed", does: "Build onboarding checklist with due dates", who: "Account manager", group: "Onboarding" },
  { id: 9, when: "Census upload has errors", does: "Return errors with fix-and-reupload link", who: "HR contact", group: "Onboarding" },
  { id: 10, when: "Onboarding task overdue", does: "Remind owner, then escalate", who: "Owner → admin", group: "Onboarding" },
  { id: 11, when: "Every night", does: "Flag missing dependents, age-26, turning-65", who: "Account manager", group: "Onboarding" },
  { id: 12, when: "Text fails or email bounces", does: "Other channel; if both fail → call task", who: "Account manager", group: "Onboarding" },
  { id: 13, when: "Employee reports life event", does: "Open 30-day window; queue for approval", who: "Account manager", group: "Onboarding" },
  { id: 14, when: "120 days before renewal", does: "Start renewal workflow and task list", who: "Account manager", group: "Onboarding" },
  { id: 15, when: "Window closes or weekly change day", does: "Draft change file per carrier; validate; queue approval", who: "Approver", group: "Carrier" },
  { id: 16, when: "File approved", does: "Deliver securely; log; mark submitted", who: "Account manager", group: "Carrier" },
  { id: 17, when: "No carrier confirmation in time", does: "Create follow-up task", who: "Account manager", group: "Carrier" },
] as const;

export const pipelineStages = [
  "Prospect",
  "Quoting",
  "Onboarding",
  "Enrolling",
  "Active",
  "Renewal",
] as const;

export const enrollmentFlow = [
  { step: 1, href: "/employee/details", label: "Your details" },
  { step: 2, href: "/employee/dependents", label: "Dependents" },
  { step: 3, href: "/employee/compare", label: "Compare plans" },
  { step: 4, href: "/employee/elect", label: "Elect or waive" },
  { step: 5, href: "/employee/beneficiaries", label: "Beneficiaries" },
  { step: 6, href: "/employee/review", label: "Review" },
  { step: 7, href: "/employee/sign", label: "Sign" },
] as const;
