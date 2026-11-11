/* Builds the initial in-memory data store (runs in the browser so relative dates use the viewer's clock). */
import { TEAM, TEMPLATES, TYPE_LABEL, SEED, NOTES, DL_SEED, EX_SEED, OTHER_SEED, OTHER_DL, KIND_TIME, REP_SEED, CONTENT_SEED, FEATURES, TPL_AREA, TPL_NAME, VIEWER, TREND_OPENED, TREND_COMPLETED } from './data';
import { addDays, at, fmtAxis, fmtMonth, iso, today, weekStart } from './format';
import type { Workflow, Deadline, ExceptionItem, PortalNotification, Firm, Lead, PortalUser, AuditEntry, Template, Settings, Role, Feature, Staff, ReportMonth, Contact, LeadStage, Profile, AreaKey, StatusKey } from './types';

export interface SeedData {
  team: Record<string, Staff>;
  workflows: Workflow[];
  archived: Workflow[];
  deadlines: Deadline[];
  exceptions: ExceptionItem[];
  notifications: PortalNotification[];
  firms: Firm[];
  leads: Lead[];
  users: PortalUser[];
  audit: AuditEntry[];
  templates: Template[];
  content: Record<string, string>;
  contentDraft: Record<string, string>;
  contentPublishedAt: Date;
  settings: Settings;
  perms: Record<Role, Record<Feature, boolean>>;
  profile: Profile;
  reports: ReportMonth[];
  trend: { labels: string[]; opened: number[]; completed: number[] };
}

let uid = 0;
export const newId = (p: string) => `${p}${Date.now().toString(36)}${(uid++).toString(36)}`;

export function buildWf(r: [string, string, string, string, AreaKey, string, StatusKey, number, string, string[], number], firmId = 'cw', team: Record<string, Staff> = TEAM): Workflow {
  const [id, title, matter, type, area, owner, status, due, attorney, support, done] = r;
  const tpl = TEMPLATES[type];
  const steps = tpl.map(([t, auto, review], i) => {
    const isDone = i < done;
    return { title: t, auto: !!auto, review: !!review, done: isDone, by: isDone ? (auto ? 'Automation' : team[owner].name) : null, at: isDone ? at(-(done - i), 9 + i, 15) : null };
  });
  const log: Workflow['log'] = [{ who: team.dana.name, text: 'Opened this workflow and assigned the team.', at: at(-(done + 2), 8, 40), kind: 'event' }];
  steps.forEach(s => { if (s.done && s.by && s.at) log.push({ who: s.by, sys: s.by === 'Automation', text: `Completed “${s.title}”.`, at: s.at, kind: 'event' }); });
  if (NOTES[id]) log.push({ who: team[owner].name, text: NOTES[id], at: at(0, 8, 5), kind: 'comment' });
  log.sort((a, b) => b.at.getTime() - a.at.getTime());
  return { id, firm: firmId, title, matter, type, area, owner, status, due: addDays(due), attorney, support: [...support], steps, log, completedNow: false, completedOnTime: false };
}

/** Portal data only (used by "Reset demo data" in the portal). */
export function seedPortal(team: Record<string, Staff>) {
  const workflows = SEED.map(r => buildWf(r, 'cw', team)).concat(OTHER_SEED.map(r => buildWf(r.slice(1) as Parameters<typeof buildWf>[0], r[0], team)));
  const deadlines: Deadline[] = DL_SEED.map(([id, title, kind, off, wf, risk, done]) => ({ id, title, kind, date: at(off, ...KIND_TIME[kind]), wf, atRisk: !!risk, done: !!done }))
    .concat(OTHER_DL.map(([id, title, kind, off, wf, risk]) => ({ id, title, kind, date: at(off, ...KIND_TIME[kind]), wf, atRisk: !!risk, done: false })));
  const exceptions: ExceptionItem[] = EX_SEED.map(([id, title, detail, wf, sev, age]) => ({ id, title, detail, wf, sev, age, snoozedUntil: null }));
  const reports = buildReports();
  const notifications: PortalNotification[] = [
    { id: 'N1', text: 'Priya Raman flagged the Reyes v. Northgate records request as at risk.', time: '25 min ago', wf: 'HL-2038', unread: true },
    { id: 'N2', text: 'Intake summary for Garza v. Summit Freight is ready for attorney review.', time: '1 hr ago', wf: 'HL-2041', unread: true },
    { id: 'N3', text: `The ${reports[0].label} management report is ready.`, time: 'Yesterday', route: '/portal/reports', unread: true },
    { id: 'N4', text: 'Deposition notice deadline for Reyes v. Northgate is tomorrow.', time: 'Yesterday', route: '/portal/deadlines', unread: false },
    { id: 'N5', text: 'Records index for Pruitt Family Trust is complete.', time: '3 days ago', wf: 'HL-1998', unread: false }
  ];
  return { workflows, archived: [] as Workflow[], deadlines, exceptions, notifications };
}

export function buildReports(): ReportMonth[] {
  const t = today();
  return REP_SEED.map((r, i) => {
    const d = new Date(t.getFullYear(), t.getMonth() - 1 - i, 1);
    return { ...r, key: iso(d).slice(0, 7), label: fmtMonth(d), short: d.toLocaleDateString('en-US', { month: 'short' }) };
  });
}

export function seedAll(): SeedData {
  const team: Record<string, Staff> = JSON.parse(JSON.stringify(TEAM));
  const portal = seedPortal(team);
  const mk = (id: string, name: string, city: string, status: Firm['status'], since: Date, contact: Contact, services: AreaKey[], lead: string, members: string[], sla: number | null, scale: number): Firm =>
    ({ id, name, city, status, since, contact, contacts: [{ ...contact, primary: true }], services, lead, team: members, sla, scale, notes: [] });
  const firms: Firm[] = [
    mk('cw', 'Calder Whitmore LLP', 'Chicago, IL', 'Active', new Date(2025, 2, 3), { name: 'Morgan Hale', title: 'Director of Operations', email: 'morgan.hale@calderwhitmore.example', phone: '(312) 555-0148' }, ['cx', 'lo', 'fa', 'go', 'dv', 'ct'], 'dana', ['dana', 'marcus', 'priya', 'aisha', 'elena', 'theo', 'noah'], null, 1),
    mk('hb', 'Halvorsen & Beck LLP', 'Milwaukee, WI', 'Active', new Date(2025, 6, 14), { name: 'Priscilla Navarro', title: 'Managing Partner', email: 'pnavarro@halvorsenbeck.example', phone: '(414) 555-0193' }, ['cx', 'lo'], 'ines', ['ines', 'marcus', 'priya'], 94.8, 0.45),
    mk('lp', 'Larkspur Legal Group', 'Indianapolis, IN', 'Active', new Date(2025, 10, 3), { name: 'Desmond Achebe', title: 'Firm Administrator', email: 'dachebe@larkspurlegal.example', phone: '(317) 555-0126' }, ['lo', 'fa', 'dv'], 'ruth', ['ruth', 'elena', 'theo'], 97.2, 0.6),
    mk('ow', 'Ostrowski Wynn PC', 'Detroit, MI', 'Onboarding', addDays(-12), { name: 'Helena Ostrowski', title: 'Partner', email: 'helena@ostrowskiwynn.example', phone: '(313) 555-0161' }, ['cx'], 'ines', ['ines', 'noah'], null, 0.2),
    mk('tm', 'Tavares Mendel LLP', 'St. Louis, MO', 'Paused', new Date(2025, 0, 20), { name: 'Rafael Tavares', title: 'Partner', email: 'rtavares@tavaresmendel.example', phone: '(314) 555-0117' }, ['fa'], 'ruth', ['ruth', 'elena'], 91.5, 0.3)
  ];
  firms[0].contacts.push({ name: 'Rachel Calder', title: 'Managing Partner', email: 'rcalder@calderwhitmore.example', phone: '(312) 555-0101' });
  firms[0].notes.push({ who: 'Dana Okafor', text: 'Quarterly review scheduled. Firm wants to expand Growth Operations next quarter.', at: at(-6, 11, 0) });

  const L = (id: string, name: string, firm: string, email: string, phone: string, area: string, msg: string, status: LeadStage, rep: string | null, followUp: Date | null, created: Date): Lead => ({
    id, name, firm, email, phone, area, msg, status, rep, followUp, created, notes: [], convertedFirm: null,
    log: ([{ who: 'Website', sys: true, text: 'Submitted the website contact form.', at: created }] as Lead['log'])
      .concat(status !== 'New' ? [{ who: rep ? team[rep].name : 'Hyacinth staff', text: `Moved to ${status}.`, at: new Date(created.getTime() + 864e5) }] : []).reverse()
  });
  const leads: Lead[] = [
    L('L-119', 'Chloe Martinez-Ruiz', 'Martinez Ruiz Law', 'chloe@martinezruiz.example', '(773) 555-0144', 'Legal Support', 'We need help organizing discovery documents across active matters.', 'New', null, null, at(0, 8, 45)),
    L('L-118', 'Avery Kincaid', 'Kincaid Rowe LLP', 'akincaid@kincaidrowe.example', '(608) 555-0182', 'Client Operations', 'Intake calls are taking paralegal time during trial prep.', 'New', null, null, at(-1, 14, 20)),
    L('L-117', 'Jordan Pell', 'Pell & Sato', 'jpell@pellsato.example', '(312) 555-0109', 'Legal Support', 'Records requests take too long across our med-mal matters.', 'Contacted', 'dana', at(2, 10, 30), at(-3, 9, 5)),
    L('L-115', 'Sunita Rao', 'Rao Fairbanks LLP', 'srao@raofairbanks.example', '(414) 555-0175', 'Business Operations', 'Our billing cycle runs late every month.', 'Discovery call', 'samir', at(1, 15, 0), at(-8, 10, 0)),
    L('L-112', 'Elliot Brandvold', 'Brandvold Kerr PC', 'ebrandvold@brandvoldkerr.example', '(317) 555-0133', 'Legal Support', 'Deadline tracking across 40 active matters.', 'Proposal', 'ines', at(4, 11, 0), at(-15, 13, 0)),
    L('L-109', 'Nadia Ferreira', 'Ferreira Lowe LLP', 'nferreira@ferreiralowe.example', '(314) 555-0152', 'Client Operations', 'Client status updates are inconsistent.', 'Won', 'dana', null, at(-24, 9, 30)),
    L('L-104', 'Graham Oyelaran', 'Oyelaran Associates', 'graham@oyelaran.example', '(313) 555-0190', 'Not sure yet', 'Exploring options for next year.', 'Lost', 'ruth', null, at(-30, 16, 0))
  ];
  const U = (name: string, email: string, type: PortalUser['type'], role: string, firm: string | null, last: Date | null, status: PortalUser['status']): PortalUser => ({ id: newId('U'), name, email, type, role, firm, last, status });
  const users: PortalUser[] = [
    U('Samir Haddad', 'samir.haddad@hyacinth.example', 'Staff', 'Super Admin', null, at(0, 8, 10), 'Active'),
    U('Dana Okafor', 'dana.okafor@hyacinth.example', 'Staff', 'Operations Manager', null, at(0, 9, 40), 'Active'),
    U('Inés Calloway', 'ines.calloway@hyacinth.example', 'Staff', 'Team Lead', null, at(-1, 17, 5), 'Active'),
    U('Ruth Adeyemi', 'ruth.adeyemi@hyacinth.example', 'Staff', 'Team Lead', null, at(-2, 12, 0), 'Active'),
    U('Morgan Hale', 'morgan.hale@calderwhitmore.example', 'Client', 'Firm admin', 'cw', at(0, 7, 55), 'Active'),
    U('Rachel Calder', 'rcalder@calderwhitmore.example', 'Client', 'Firm member', 'cw', at(-3, 10, 0), 'Active'),
    U('Jonah Whitmore', 'jwhitmore@calderwhitmore.example', 'Client', 'Firm member', 'cw', null, 'Invited'),
    U('Priscilla Navarro', 'pnavarro@halvorsenbeck.example', 'Client', 'Firm admin', 'hb', at(-1, 9, 0), 'Active'),
    U('Desmond Achebe', 'dachebe@larkspurlegal.example', 'Client', 'Firm admin', 'lp', at(-4, 15, 30), 'Active'),
    U('Helena Ostrowski', 'helena@ostrowskiwynn.example', 'Client', 'Firm admin', 'ow', null, 'Invited'),
    U('Rafael Tavares', 'rtavares@tavaresmendel.example', 'Client', 'Firm admin', 'tm', at(-40, 11, 0), 'Disabled')
  ];
  const A = (when: Date, user: string, role: string, type: AuditEntry['type'], action: string, target: string): AuditEntry => ({ id: newId('A'), at: when, user, role, type, action, target });
  const audit: AuditEntry[] = [
    A(at(0, 8, 45), 'Website', 'Contact form', 'Create', 'New lead from Chloe Martinez-Ruiz', 'Martinez Ruiz Law'),
    A(at(0, 8, 2), 'Dana Okafor', 'Operations Manager', 'Status change', 'Set HL-2038 to At risk', 'Calder Whitmore LLP'),
    A(at(-1, 16, 40), 'Samir Haddad', 'Super Admin', 'Publish', 'Published website content', 'Website'),
    A(at(-1, 11, 5), 'Inés Calloway', 'Team Lead', 'Edit', 'Reassigned HL-2040 to Marcus Lin', 'Halvorsen & Beck LLP'),
    A(at(-3, 14, 15), 'Dana Okafor', 'Operations Manager', 'Role change', 'Updated Team Lead permissions', 'Roles and permissions'),
    A(at(-4, 10, 30), 'Ruth Adeyemi', 'Team Lead', 'Export', 'Exported the audit log', 'Audit log'),
    A(at(-5, 9, 0), 'Samir Haddad', 'Super Admin', 'Create', 'Invited Helena Ostrowski', 'Ostrowski Wynn PC'),
    A(at(-6, 13, 20), 'Dana Okafor', 'Operations Manager', 'Edit', 'Edited the Records request template', 'Workflow templates'),
    A(at(-9, 15, 45), 'Samir Haddad', 'Super Admin', 'Status change', 'Paused Tavares Mendel LLP', 'Tavares Mendel LLP'),
    A(at(-12, 10, 0), 'Samir Haddad', 'Super Admin', 'Create', 'Created client firm Ostrowski Wynn PC', 'Ostrowski Wynn PC')
  ];
  const settings: Settings = {
    org: { name: 'Hyacinth Industries, LLC', website: 'hyacinth.example', phone: '(312) 555-0100', address: 'Chicago, IL' },
    tz: 'CT', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], open: '8:00', close: '18:00',
    sla: { cx: 2, lo: 3, fa: 5, go: 5, dv: 5, ct: 7 },
    notify: { lead: { email: true, app: true }, risk: { email: true, app: true }, publish: { email: false, app: true }, invite: { email: true, app: false }, digest: { email: true, app: false } }
  };
  const perms = {
    'Super Admin': Object.fromEntries(FEATURES.map(([k]) => [k, true])),
    'Operations Manager': Object.fromEntries(FEATURES.map(([k]) => [k, !['users', 'perms', 'settings'].includes(k)])),
    'Team Lead': Object.fromEntries(FEATURES.map(([k]) => [k, ['workflows', 'leads', 'audit'].includes(k)]))
  } as Record<Role, Record<Feature, boolean>>;
  const templates: Template[] = Object.entries(TEMPLATES).map(([k, steps]) => ({
    id: k, name: TPL_NAME[k] || TYPE_LABEL[k], area: TPL_AREA[k] || 'ct', sla: settings.sla[TPL_AREA[k] || 'ct'],
    steps: steps.map(([t, a, r]) => ({ title: t, auto: !!a, review: !!r }))
  }));
  const ws = weekStart(today());
  return {
    team, ...portal, firms, leads, users, audit, templates,
    content: { ...CONTENT_SEED }, contentDraft: { ...CONTENT_SEED }, contentPublishedAt: at(-1, 16, 40),
    settings, perms, profile: { ...VIEWER }, reports: buildReports(),
    trend: { labels: TREND_OPENED.map((_, i) => fmtAxis(addDays(-7 * (11 - i), ws))), opened: TREND_OPENED, completed: TREND_COMPLETED }
  };
}
