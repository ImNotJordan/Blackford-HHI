/** Sample data for MVP screens — SOW workflows A–H. Replace with live data later. */

/** @deprecated Use roleUsers from @/lib/roles */
export const staffUser = {
  name: "Maya Chen",
  role: "Account manager",
  initials: "MC",
};

export const clients = [
  {
    id: "cl-1042",
    name: "Harbor Light Manufacturing",
    type: "Group",
    pipeline: "Enrolling",
    owner: "Maya Chen",
    employees: 186,
    enrolled: 142,
    effective: "2027-01-01",
    city: "Jacksonville, FL",
  },
  {
    id: "cl-1088",
    name: "Rivers & Reed LLP",
    type: "Group",
    pipeline: "Onboarding",
    owner: "Maya Chen",
    employees: 42,
    enrolled: 0,
    effective: "2027-03-01",
    city: "Jacksonville, FL",
  },
  {
    id: "cl-2210",
    name: "James Ortega",
    type: "Individual",
    pipeline: "Active",
    owner: "Sam Ortiz",
    employees: 1,
    enrolled: 1,
    effective: "2026-06-01",
    city: "St. Augustine, FL",
  },
  {
    id: "cl-0901",
    name: "Palm Coast Logistics",
    type: "Group",
    pipeline: "Renewal",
    owner: "Maya Chen",
    employees: 310,
    enrolled: 288,
    effective: "2027-05-01",
    city: "Palm Coast, FL",
  },
];

export const tasks = [
  {
    id: "t-1",
    title: "Approve Florida Blue change file",
    due: "Today · 4:00 PM",
    type: "Carrier",
    client: "Harbor Light Manufacturing",
    priority: "high",
  },
  {
    id: "t-2",
    title: "Census validation follow-up",
    due: "Today · 2:00 PM",
    type: "Onboarding",
    client: "Rivers & Reed LLP",
    priority: "high",
  },
  {
    id: "t-3",
    title: "Life event — birth proof review",
    due: "Tomorrow",
    type: "Change",
    client: "Harbor Light Manufacturing",
    priority: "medium",
  },
  {
    id: "t-4",
    title: "Call: undeliverable text",
    due: "Today",
    type: "Comms",
    client: "Palm Coast Logistics",
    priority: "medium",
  },
];

export const inbox = [
  {
    id: "m-1",
    from: "Aisha Patel",
    channel: "Text",
    preview: "Got the link — starting enrollment now",
    time: "10:14 AM",
    client: "Harbor Light Manufacturing",
    unread: true,
  },
  {
    id: "m-2",
    from: "HR · Rivers & Reed",
    channel: "Email",
    preview: "Re-uploading census with hire dates fixed",
    time: "9:42 AM",
    client: "Rivers & Reed LLP",
    unread: true,
  },
  {
    id: "m-3",
    from: "System",
    channel: "Text",
    preview: "STOP — opt-out recorded for M. Alvarez",
    time: "Yesterday",
    client: "Palm Coast Logistics",
    unread: false,
  },
];

export const onboardingChecklist = [
  { id: "c1", label: "Broker agreement signed", done: true, owner: "Staff", due: "Done" },
  { id: "c2", label: "HR portal invite accepted", done: true, owner: "HR", due: "Done" },
  { id: "c3", label: "Company details confirmed", done: true, owner: "HR", due: "Done" },
  { id: "c4", label: "Census uploaded & validated", done: false, owner: "HR", due: "Feb 10" },
  { id: "c5", label: "Plans, rates & contributions", done: false, owner: "Staff", due: "Feb 14" },
  { id: "c6", label: "Eligibility & windows set", done: false, owner: "Staff", due: "Feb 16" },
  { id: "c7", label: "Setup summary approved", done: false, owner: "HR", due: "Feb 18" },
  { id: "c8", label: "Ready to enroll · invites scheduled", done: false, owner: "System", due: "Feb 20" },
];

export const carrierFiles = [
  {
    id: "cf-88",
    carrier: "Florida Blue",
    group: "Harbor Light Manufacturing",
    kind: "Change file",
    status: "Pending approval",
    records: 14,
    errors: 2,
    created: "Mar 3, 2027 · 7:02 AM",
  },
  {
    id: "cf-87",
    carrier: "Guardian Dental",
    group: "Harbor Light Manufacturing",
    kind: "Change file",
    status: "Delivered",
    records: 9,
    errors: 0,
    created: "Feb 24, 2027 · 7:01 AM",
  },
  {
    id: "cf-80",
    carrier: "MetLife Vision",
    group: "Palm Coast Logistics",
    kind: "Full file",
    status: "Awaiting confirmation",
    records: 288,
    errors: 0,
    created: "Feb 10, 2027 · 6:58 AM",
  },
];

export const plans = [
  {
    id: "p1",
    name: "Florida Blue Gold PPO 1500",
    type: "Medical",
    paycheck: 186.4,
    annual: 4473.6,
    deductible: 1500,
    oop: 6500,
  },
  {
    id: "p2",
    name: "Florida Blue Silver HMO 3000",
    type: "Medical",
    paycheck: 124.1,
    annual: 2978.4,
    deductible: 3000,
    oop: 8000,
  },
  {
    id: "p3",
    name: "Guardian Dental PPO",
    type: "Dental",
    paycheck: 18.5,
    annual: 444,
    deductible: 50,
    oop: null,
  },
];

export const enrollmentSteps = [
  { href: "/employee/details", label: "Your details" },
  { href: "/employee/dependents", label: "Dependents" },
  { href: "/employee/compare", label: "Compare plans" },
  { href: "/employee/elect", label: "Elect or waive" },
  { href: "/employee/beneficiaries", label: "Beneficiaries" },
  { href: "/employee/review", label: "Review" },
  { href: "/employee/sign", label: "Sign" },
];

export const auditEntries = [
  {
    id: "a1",
    when: "2027-03-03 10:14:22",
    who: "maya.chen@blackford.com",
    action: "Export approved",
    what: "Florida Blue change file cf-88",
    where: "203.0.113.22 · Chrome",
  },
  {
    id: "a2",
    when: "2027-03-03 09:58:01",
    who: "aisha.patel@harborlight.com",
    action: "Signed",
    what: "Election form · medical + dental",
    where: "iPhone · Safari",
  },
  {
    id: "a3",
    when: "2027-03-03 08:02:44",
    who: "system",
    action: "Reminder sent",
    what: "OE window closes in 3 days",
    where: "Automation #2",
  },
];
