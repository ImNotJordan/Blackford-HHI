import {
  Activity,
  Baby,
  Building2,
  ClipboardList,
  FileCheck2,
  FileSignature,
  FileText,
  FolderOpen,
  Home,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  PenLine,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserPlus,
  Upload,
  UserCircle,
  Users,
  BadgeCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
};

/** Consistent sidebar IA per SOW role (Module H). */
export const roleNav: Record<string, NavItem[]> = {
  admin: [
    { href: "/admin", label: "Overview", icon: Home, section: "Platform" },
    { href: "/admin/users", label: "Users & roles", icon: Users },
    { href: "/admin/groups", label: "All groups", icon: Building2 },
    { href: "/admin/carriers", label: "Carrier approvals", icon: Shield, section: "Operations" },
    { href: "/admin/reports", label: "Weekly reports", icon: Activity },
    { href: "/admin/audit", label: "Audit log", icon: Search },
    { href: "/admin/automations", label: "Automations", icon: RefreshCw },
    { href: "/admin/aca", label: "ACA data capture", icon: FileText },
    { href: "/admin/settings", label: "Security", icon: Settings, section: "System" },
  ],
  manager: [
    { href: "/manager", label: "My work today", icon: Home, section: "Work" },
    { href: "/manager/clients", label: "Clients", icon: Users },
    { href: "/manager/groups", label: "Groups", icon: Building2 },
    { href: "/manager/pipeline", label: "Pipeline", icon: FolderOpen },
    { href: "/manager/search", label: "Search", icon: Search },
    { href: "/manager/inbox", label: "Inbox", icon: Inbox, section: "Comms" },
    { href: "/manager/compose", label: "Compose", icon: MessageSquare },
    { href: "/manager/delivery", label: "Delivery tracking", icon: Radio },
    { href: "/manager/tasks", label: "Tasks", icon: ClipboardList, section: "Service" },
    { href: "/manager/service-requests", label: "Service requests", icon: LifeBuoy },
    { href: "/manager/documents", label: "Documents", icon: FileText },
    { href: "/manager/onboarding", label: "Onboarding", icon: FileCheck2, section: "Enrollment" },
    { href: "/manager/changes", label: "Life events", icon: Baby },
    { href: "/manager/staff-changes", label: "Staff changes", icon: PenLine },
    { href: "/manager/verifications", label: "Verifications", icon: ShieldCheck },
    { href: "/manager/renewals", label: "Renewals", icon: RefreshCw },
    { href: "/manager/carriers", label: "Carrier drafts", icon: Shield, section: "Carriers" },
    { href: "/manager/signatures", label: "Signatures", icon: FileSignature },
    { href: "/manager/data-quality", label: "Data quality", icon: BadgeCheck },
    { href: "/manager/import", label: "Import book", icon: Upload },
    { href: "/manager/reports", label: "My reports", icon: Activity },
  ],
  employer: [
    { href: "/employer", label: "Enrollment progress", icon: LayoutDashboard, section: "Group" },
    { href: "/employer/company", label: "Company details", icon: Building2 },
    { href: "/employer/agreement", label: "Sign agreement", icon: FileSignature },
    { href: "/employer/census", label: "Census", icon: Upload },
    { href: "/employer/plans", label: "Plans & rates", icon: FolderOpen },
    { href: "/employer/eligibility", label: "Eligibility & windows", icon: BadgeCheck },
    { href: "/employer/new-hire", label: "New hire", icon: UserPlus },
    { href: "/employer/setup", label: "Setup approval", icon: FileCheck2 },
  ],
  employee: [
    { href: "/employee", label: "Enrollment home", icon: Home, section: "Benefits" },
    { href: "/employee/details", label: "Your details", icon: UserCircle },
    { href: "/employee/dependents", label: "Dependents", icon: Users },
    { href: "/employee/compare", label: "Compare plans", icon: FolderOpen },
    { href: "/employee/elect", label: "Elect or waive", icon: ClipboardList },
    { href: "/employee/beneficiaries", label: "Beneficiaries", icon: FileCheck2 },
    { href: "/employee/review", label: "Review", icon: FileText },
    { href: "/employee/sign", label: "Sign", icon: FileSignature },
    { href: "/employee/confirmation", label: "Confirmation", icon: BadgeCheck },
    { href: "/employee/life-event", label: "Life event", icon: Baby, section: "Changes" },
    { href: "/employee/agent", label: "Agent iPad mode", icon: LayoutDashboard },
  ],
  client: [
    { href: "/client", label: "My coverage", icon: Home, section: "Coverage" },
    { href: "/client/household", label: "Household", icon: Users },
    { href: "/client/plans", label: "Plans & IDs", icon: FolderOpen },
    { href: "/client/messages", label: "Messages", icon: Inbox },
    { href: "/client/documents", label: "Documents", icon: FileText },
    { href: "/client/enroll", label: "Enrollment", icon: ClipboardList, section: "Actions" },
    { href: "/client/life-event", label: "Life event", icon: Baby },
    { href: "/client/service", label: "Service request", icon: LifeBuoy },
  ],
};

export const roleRoots: Record<string, { root: string; signIn: string }> = {
  admin: { root: "/admin", signIn: "/admin/sign-in" },
  manager: { root: "/manager", signIn: "/manager/sign-in" },
  employer: { root: "/employer", signIn: "/employer/sign-in" },
  employee: { root: "/employee", signIn: "/employee/sign-in" },
  client: { root: "/client", signIn: "/client/sign-in" },
};
