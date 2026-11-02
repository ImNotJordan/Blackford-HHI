/** SOW Module H roles — each gets its own portal. */

export type RoleId =
  | "admin"
  | "manager"
  | "employer"
  | "employee"
  | "client";

export const roles = [
  {
    id: "admin" as const,
    href: "/admin",
    title: "Blackford admin",
    audience: "Platform admin",
    body: "Users and MFA, audit log, weekly reports, carrier approvers, and access across every group.",
    modules: "Module H · oversight",
  },
  {
    id: "manager" as const,
    href: "/manager",
    title: "Account manager",
    audience: "Blackford staff",
    body: "Your book of business: clients, inbox, onboarding, life events, renewals, and carrier drafts.",
    modules: "Modules A · B · C · F · G",
  },
  {
    id: "employer" as const,
    href: "/employer",
    title: "Employer HR",
    audience: "HR contact",
    body: "Company setup, census upload, plan confirmation, and enrollment progress for your group.",
    modules: "Module C",
  },
  {
    id: "employee" as const,
    href: "/employee",
    title: "Employee",
    audience: "Group employee",
    body: "Open a secure link, compare plans, elect or waive, and sign benefits on any phone.",
    modules: "Modules D · E · F",
  },
  {
    id: "client" as const,
    href: "/client",
    title: "Client",
    audience: "Individual / Medicare",
    body: "Household coverage, documents, messages, life events, and service requests for your policies.",
    modules: "Modules A · D · F",
  },
];

export const roleUsers = {
  admin: {
    name: "Alex Rivera",
    role: "Blackford admin",
    initials: "AR",
  },
  manager: {
    name: "Maya Chen",
    role: "Account manager",
    initials: "MC",
  },
  employer: {
    name: "Jordan Miles",
    role: "Employer HR",
    initials: "JM",
  },
  employee: {
    name: "Aisha Patel",
    role: "Employee",
    initials: "AP",
  },
  client: {
    name: "James Ortega",
    role: "Individual client",
    initials: "JO",
  },
};
