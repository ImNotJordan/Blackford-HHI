/**
 * Demo data for the Benefits Portal screens.
 * Names, plans and figures come from the design canvas. Rates the canvas does
 * not show (other coverage tiers) are SAMPLE values marked below — replace them
 * with the group's real contribution calculation when the backend exists.
 */

export const PAYCHECKS_PER_YEAR = 26;

/** The scenario's "today" and Riverside's open-enrollment window. */
export const TODAY = new Date(2027, 1, 16); // Feb 16, 2027
export const WINDOW_CLOSES = new Date(2027, 1, 28); // Feb 28, 2027
export const COVERAGE_STARTS = new Date(2027, 2, 1); // Mar 1, 2027

export function daysUntil(date: Date, from: Date = TODAY) {
  return Math.round((date.getTime() - from.getTime()) / 86_400_000);
}

export const GROUP = {
  name: "Riverside Dental Group",
  shortName: "Riverside",
  planYear: 2027,
  basicLife: 25_000,
};

export const MEMBER = {
  firstName: "Maria",
  lastName: "Delgado",
  phoneLast4: "4821",
  address: "418 Bayview Ave, Tampa FL 33606",
  mobile: "(813) 555-0142",
};

export const CONTACT = {
  name: "Dana Whitfield",
  firstName: "Dana",
  role: "Account manager",
  phoneDisplay: "(813) 555-0100",
  phoneHref: "tel:+18135550100",
};

export const CHILD_AGE_LIMIT = 26;

export type Relation = "spouse" | "child";

export type Dependent = {
  id: string;
  firstName: string;
  lastName: string;
  relation: Relation;
  /** MM/DD/YYYY, or empty when missing on file */
  dob: string;
};

export const DEPENDENTS_ON_FILE: Dependent[] = [
  { id: "d1", firstName: "Carlos", lastName: "Delgado", relation: "spouse", dob: "04/12/1988" },
  { id: "d2", firstName: "Sofia", lastName: "Delgado", relation: "child", dob: "09/30/2016" },
  { id: "d3", firstName: "Mateo", lastName: "Delgado", relation: "child", dob: "" },
];

export type Tier = "self" | "spouse" | "kids" | "family";
export const TIERS: Tier[] = ["self", "spouse", "kids", "family"];

export type MedicalPlanId = "ppo1500" | "hmo3000";
export type DentalPlanId = "dentalPpo" | "dentalHmo";
export type VisionPlanId = "visionBasic";

type Rates = Record<Tier, number>;

export type MedicalPlan = {
  id: MedicalPlanId;
  name: string;
  network: "any" | "network";
  rates: Rates;
  deductible: string;
  doctorVisit: string;
  /** Rows for the plan-details sheet; only what the canvas specifies. */
  details: { label: "deductible" | "oopMax" | "doctorVisit" | "rx"; value: string }[];
};

export const MEDICAL_PLANS: MedicalPlan[] = [
  {
    id: "ppo1500",
    name: "PPO 1500",
    network: "any",
    // spouse and family from the canvas; self and kids are SAMPLE values
    rates: { self: 96.1, spouse: 142.5, kids: 122.4, family: 212.75 },
    deductible: "$1,500",
    doctorVisit: "$25",
    details: [
      { label: "deductible", value: "$1,500 / $3,000 family" },
      { label: "oopMax", value: "$5,000 / $10,000" },
      { label: "doctorVisit", value: "$25 copay" },
      { label: "rx", value: "$10 / $40 / $70" },
    ],
  },
  {
    id: "hmo3000",
    name: "HMO 3000",
    network: "network",
    // spouse from the canvas; others are SAMPLE values
    rates: { self: 58.9, spouse: 88.2, kids: 74.8, family: 131.6 },
    deductible: "$3,000",
    doctorVisit: "$40",
    details: [
      { label: "deductible", value: "$3,000" },
      { label: "doctorVisit", value: "$40 copay" },
    ],
  },
];

export const DENTAL_PLANS: { id: DentalPlanId; name: string; rates: Rates }[] = [
  // spouse from the canvas; others are SAMPLE values
  { id: "dentalPpo", name: "Dental PPO", rates: { self: 8.2, spouse: 18.4, kids: 16.9, family: 27.3 } },
  { id: "dentalHmo", name: "Dental HMO", rates: { self: 4.35, spouse: 9.75, kids: 8.9, family: 14.6 } },
];

export const VISION_PLANS: { id: VisionPlanId; name: string; rates: Rates }[] = [
  // spouse from the canvas; others are SAMPLE values
  { id: "visionBasic", name: "Vision Basic", rates: { self: 1.95, spouse: 4.1, kids: 3.8, family: 6.25 } },
];

export const WAIVE_REASONS = ["spousePlan", "otherPlan", "medicare", "noCoverage"] as const;
export type WaiveReason = (typeof WAIVE_REASONS)[number];

export function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function wholeMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Parse MM/DD/YYYY; returns null when invalid. */
export function parseUsDate(value: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const [month, day, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

export function ageOn(dob: Date, on: Date = TODAY) {
  let age = on.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    on.getMonth() < dob.getMonth() ||
    (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

// ——— Staff: enrollments list ———

export type EnrollmentStatus = "notStarted" | "started" | "readyToSign" | "done" | "waived" | "invite";

export type EnrollmentRow = {
  id: string;
  person: string;
  group: string;
  window: "Open enrollment" | "New hire" | "Life event · birth" | "Medicare";
  windowKind: "open" | "newHire" | "lifeEvent" | "individual";
  closes: string;
  status: EnrollmentStatus;
  statusLabel: string;
  lastReminder: string;
  channel: string;
  contact: string;
  timeline: { at: string; text: string }[];
};

export const ENROLLMENT_COUNTS: Record<"all" | EnrollmentStatus, number> = {
  all: 84,
  notStarted: 25,
  started: 31,
  readyToSign: 6,
  done: 14,
  waived: 8,
  invite: 0,
};

export const ENROLLMENTS: EnrollmentRow[] = [
  {
    id: "e1",
    person: "Tuan Nguyen",
    group: "Riverside Dental",
    window: "Open enrollment",
    windowKind: "open",
    closes: "Feb 28",
    status: "started",
    statusLabel: "Started · step 3",
    lastReminder: "Today 8:00",
    channel: "Text",
    contact: "Text (813) •••-0188 · English",
    timeline: [
      { at: "Feb 15 8:00", text: "invite texted and emailed (delivered)" },
      { at: "Feb 15 19:12", text: "signed in, finished details and dependents" },
      { at: "Feb 16 8:00", text: "reminder “started” sent" },
    ],
  },
  {
    id: "e2",
    person: "Leah Morgan",
    group: "Riverside Dental",
    window: "Open enrollment",
    windowKind: "open",
    closes: "Feb 28",
    status: "notStarted",
    statusLabel: "Not started",
    lastReminder: "Today 8:00",
    channel: "Text",
    contact: "Text (904) •••-0161 · English",
    timeline: [
      { at: "Feb 15 8:00", text: "invite texted and emailed (delivered)" },
      { at: "Feb 16 8:00", text: "reminder “not started” sent" },
    ],
  },
  {
    id: "e3",
    person: "Priya Nair",
    group: "Coastal Marine",
    window: "Life event · birth",
    windowKind: "lifeEvent",
    closes: "Mar 5",
    status: "readyToSign",
    statusLabel: "Ready to sign",
    lastReminder: "Feb 14",
    channel: "Email",
    contact: "Email p•••@coastalmarine.example · English",
    timeline: [
      { at: "Feb 4 10:21", text: "birth reported with hospital record" },
      { at: "Feb 14 9:00", text: "change approved; signing link emailed" },
    ],
  },
  {
    id: "e4",
    person: "Jordan Price",
    group: "Riverside Dental",
    window: "New hire",
    windowKind: "newHire",
    closes: "May 1",
    status: "invite",
    statusLabel: "Invite Apr 1",
    lastReminder: "—",
    channel: "Text",
    contact: "Text (813) •••-0117 · English",
    timeline: [{ at: "Feb 12 14:02", text: "added by HR as a new hire; invite scheduled for Apr 1" }],
  },
  {
    id: "e5",
    person: "Grace Okafor",
    group: "Individual",
    window: "Medicare",
    windowKind: "individual",
    closes: "Oct 31",
    status: "notStarted",
    statusLabel: "Not started",
    lastReminder: "—",
    channel: "Text · Spanish",
    contact: "Text (727) •••-0190 · Spanish",
    timeline: [{ at: "Feb 10 11:30", text: "individual intake completed by Dana" }],
  },
  {
    id: "e6",
    person: "Maria Delgado",
    group: "Riverside Dental",
    window: "Open enrollment",
    windowKind: "open",
    closes: "Feb 28",
    status: "done",
    statusLabel: "Done · signed",
    lastReminder: "Stopped",
    channel: "Text",
    contact: "Text (813) •••-0142 · English",
    timeline: [
      { at: "Feb 15 8:00", text: "invite texted and emailed (delivered)" },
      { at: "Feb 16 9:05", text: "signed; confirmation PDF sent; reminders stopped" },
    ],
  },
];

// ——— Staff: in-person (iPad) session ———

export const ASSIST_SESSION = {
  title: "Riverside Dental · Feb 16",
  people: [
    { id: "p1", name: "Ashley Kim", status: "signed" as const },
    { id: "p2", name: "Tuan Nguyen", status: "inProgress" as const, step: 3 },
    { id: "p3", name: "Leah Morgan", status: "notStarted" as const },
    { id: "p4", name: "Omar Haddad", status: "notStarted" as const },
    { id: "p5", name: "Jordan Price", status: "notStarted" as const },
  ],
  covering: "Tuan, Linh (spouse), 2 children · Family tier",
  plans: [
    { id: "hdhp", name: "HDHP 3500 + HSA", sub: "Deductible $7,000 family", price: 118.4, perYear: "$3,078 a year", current: false },
    { id: "ppo", name: "PPO 1500", sub: "Deductible $3,000 family", price: 212.75, perYear: "$5,532 a year", current: true },
    { id: "waive", name: "Waive medical", sub: "Reason required", price: 0, perYear: "ACA waiver recorded", current: false },
  ],
  note: "Asked about HSA. Wants to stay on PPO because of son's orthodontist.",
};

// ——— Employer: progress ———

export const EMPLOYER = {
  hrName: "Kevin Brooks",
  hrInitials: "KB",
};

export const PROGRESS = {
  total: 64,
  enrolled: 29,
  waived: 8,
  started: 11,
  notStarted: 16,
};

export type OutstandingRow = {
  name: string;
  department: string;
  status: "readyToSign" | "notStarted" | "started";
  lastReminder: string;
};

export const OUTSTANDING: OutstandingRow[] = [
  { name: "Ashley Kim", department: "Front office", status: "readyToSign", lastReminder: "Today" },
  { name: "Marcus Bell", department: "Hygiene", status: "notStarted", lastReminder: "Today" },
  { name: "Luis Ortega", department: "Lab", status: "notStarted", lastReminder: "Blackford is calling" },
  { name: "Sofia Ramirez", department: "Hygiene", status: "started", lastReminder: "Today" },
  { name: "Derek Owens", department: "Front office", status: "started", lastReminder: "Today" },
];

// ——— Employer: payroll deduction updates ———

export type PayrollRow = {
  id: string;
  employee: string;
  why: string;
  benefit: string;
  oldAmount: number;
  newAmount: number;
  fromPaycheck: string;
  status: "toEnter" | "noChange" | "entered";
};

export const PAYROLL_ROWS: PayrollRow[] = [
  { id: "r1", employee: "Maria Delgado", why: "Open enrollment", benefit: "Medical PPO 1500 · EE + spouse", oldAmount: 118.2, newAmount: 142.5, fromPaycheck: "Mar 6", status: "toEnter" },
  { id: "r2", employee: "Maria Delgado", why: "Open enrollment", benefit: "Dental PPO · EE + spouse", oldAmount: 18.4, newAmount: 18.4, fromPaycheck: "—", status: "noChange" },
  { id: "r3", employee: "Tuan Nguyen", why: "Open enrollment", benefit: "Medical PPO 1500 · Family", oldAmount: 0, newAmount: 212.75, fromPaycheck: "Mar 6", status: "toEnter" },
  { id: "r4", employee: "Priya Nair", why: "Life event · birth (approved Feb 16)", benefit: "Medical · EE → EE + child", oldAmount: 96.1, newAmount: 122.4, fromPaycheck: "Mar 6", status: "toEnter" },
  { id: "r5", employee: "James Porter", why: "Termination", benefit: "All benefits end Feb 28", oldAmount: 146.3, newAmount: 0, fromPaycheck: "Mar 6", status: "toEnter" },
];

export const PAYROLL_HISTORY = [
  { paycheck: "Feb 20 paycheck", changes: 6, by: "Kevin Brooks", on: "Feb 18" },
  { paycheck: "Feb 6 paycheck", changes: 3, by: "Kevin Brooks", on: "Feb 4" },
];

/** Builds a CSV string, quoting every cell and neutralising formula prefixes. */
export function toCsv(rows: (string | number)[][]) {
  const cell = (c: string | number) => {
    let s = String(c);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replaceAll('"', '""')}"`;
  };
  return rows.map((r) => r.map(cell).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
