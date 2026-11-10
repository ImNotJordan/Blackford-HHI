/* Domain types shared by the website, client portal and admin. */

export type AreaKey = 'cx' | 'lo' | 'fa' | 'go' | 'dv' | 'ct';
export type StatusKey = 'on-track' | 'at-risk' | 'review' | 'blocked' | 'complete';
export type FirmStatus = 'Onboarding' | 'Active' | 'Paused';
export type Role = 'Super Admin' | 'Operations Manager' | 'Team Lead';
export type AccessLevel = Role | 'Specialist';
export type Feature = 'clients' | 'workflows' | 'templates' | 'team' | 'leads' | 'content' | 'users' | 'perms' | 'audit' | 'export' | 'settings';
export type LeadStage = 'New' | 'Contacted' | 'Discovery call' | 'Proposal' | 'Won' | 'Lost';
export type AuditType = 'Create' | 'Edit' | 'Status change' | 'Publish' | 'Role change' | 'Delete' | 'Export' | 'Access';
export type TzKey = 'CT' | 'ET' | 'MT' | 'PT';
export type Surface = 'site' | 'portal' | 'admin';

/** Every state-changing store action returns an Undo function the caller can pass to a toast. */
export type Undo = () => void;

export interface Step { title: string; auto: boolean; review: boolean; done: boolean; by: string | null; at: Date | null }
export interface LogEntry { who: string; text: string; at: Date; kind: 'event' | 'comment'; sys?: boolean }
export interface Workflow {
  id: string; firm: string; title: string; matter: string; type: string; area: AreaKey; owner: string; status: StatusKey;
  due: Date; attorney: string; support: string[]; steps: Step[]; log: LogEntry[];
  completedNow: boolean; completedOnTime: boolean; escalated?: boolean;
}
export interface Deadline { id: string; title: string; kind: string; date: Date; wf: string; atRisk: boolean; done: boolean }
export interface ExceptionItem { id: string; title: string; detail: string; wf: string; sev: 'high' | 'med'; age: string; snoozedUntil: Date | null }
export interface PortalNotification { id: string; text: string; time: string; wf?: string; route?: string; unread: boolean }
export interface Staff { name: string; role: string; email: string; access: AccessLevel; capacity: number; active: boolean }
export interface Contact { name: string; title?: string; email: string; phone?: string; primary?: boolean }
export interface Note { who: string; text: string; at: Date }
export interface Firm {
  id: string; name: string; city: string; status: FirmStatus; since: Date; contact: Contact; contacts: Contact[];
  services: AreaKey[]; lead: string; team: string[]; sla: number | null; scale: number; notes: Note[];
}
export interface LeadLog { who: string; text: string; at: Date; sys?: boolean }
export interface Lead {
  id: string; name: string; firm: string; email: string; phone: string; area: string; msg: string; status: LeadStage;
  rep: string | null; followUp: Date | null; created: Date; notes: Note[]; log: LeadLog[]; convertedFirm: string | null; isNew?: boolean;
}
export interface PortalUser { id: string; name: string; email: string; type: 'Staff' | 'Client'; role: string; firm: string | null; last: Date | null; status: 'Active' | 'Invited' | 'Disabled' }
export interface AuditEntry { id: string; at: Date; user: string; role: string; type: AuditType; action: string; target: string }
export interface TemplateStep { title: string; auto: boolean; review: boolean }
export interface Template { id: string; name: string; area: AreaKey; sla: number; steps: TemplateStep[] }
export interface Settings {
  org: { name: string; website: string; phone: string; address: string };
  tz: TzKey; days: string[]; open: string; close: string;
  sla: Record<AreaKey, number>;
  notify: Record<string, { email: boolean; app: boolean }>;
}
export interface Profile { name: string; title: string; email: string; phone: string }
export type ReportArea = [AreaKey, number, number, number]; // area, opened, completed, on-time %
export interface RepSeed { completed: number; onTime: number; turnaround: number; exRaised: number; exResolved: number; areas: ReportArea[]; highlights: string[]; focus: string[] }
export interface ReportMonth extends RepSeed { key: string; label: string; short: string }
export interface LegalPage { title: string; updated: string; sections: [string, (string | string[])[]][] }
export interface DateRange { start: Date; end: Date; preset?: string }
export interface MonthValue { y: number; m: number }
export interface ContactValues { name: string; firm: string; email: string; phone: string; area: string; msg: string }
