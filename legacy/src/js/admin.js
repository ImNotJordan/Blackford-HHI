/* Hyacinth Legal Support · Admin area: shared store extensions, admin views, modals, actions */
'use strict';
/* =========================================================
   SHARED STORE EXTENSIONS: firms, leads, users, audit, content,
   settings, permissions, templates. Admin, portal and website all
   read and write these.
   ========================================================= */
const FIRM_STATUSES = ['Onboarding', 'Active', 'Paused'];
const FS_ICON = { Onboarding: 'clock', Active: 'check', Paused: 'block' };
const ROLES = ['Super Admin', 'Operations Manager', 'Team Lead'];
const ROLE_DESC = { 'Super Admin': 'Everything, including roles and settings', 'Operations Manager': 'Clients, workflows, team, leads and content', 'Team Lead': 'Workflows and leads; read-only elsewhere' };
const FEATURES = [
  ['clients', 'Manage client firms'], ['workflows', 'Manage workflows and bulk actions'], ['templates', 'Edit workflow templates'],
  ['team', 'Manage team and capacity'], ['leads', 'Manage leads'], ['content', 'Edit and publish website content'],
  ['users', 'Invite and manage users'], ['perms', 'Edit roles and permissions'], ['audit', 'View the audit log'],
  ['export', 'Export data'], ['settings', 'Edit settings']
];
const FEATURE_LABEL = Object.fromEntries(FEATURES);
const LEAD_STAGES = ['New', 'Contacted', 'Discovery call', 'Proposal', 'Won', 'Lost'];
const AUDIT_TYPES = ['Create', 'Edit', 'Status change', 'Publish', 'Role change', 'Delete', 'Export', 'Access'];
const ACCESS_LEVELS = ['Super Admin', 'Operations Manager', 'Team Lead', 'Specialist'];
const TPL_AREA = { intake: 'cx', records: 'lo', docket: 'lo', billing: 'fa', comms: 'cx', collection: 'cx', data: 'dv', reporting: 'dv', crm: 'go', scheduling: 'cx', finance: 'fa', filing: 'lo', custom: 'ct', followup: 'cx', collections: 'fa' };
const TPL_NAME = { intake: 'Client intake', records: 'Records request', docket: 'Deadline tracking', billing: 'Billing cycle', comms: 'Client status updates', collection: 'Document collection', data: 'Data administration', reporting: 'Management reporting', crm: 'CRM administration', scheduling: 'Deposition scheduling', finance: 'Trust reconciliation', filing: 'Settlement filing', custom: 'Lien resolution', followup: 'Claimant follow-up', collections: 'Collections' };
const OTHER_SEED = [
  ['hb', 'HL-2040', 'Client intake for new referrals', 'Firmwide', 'intake', 'cx', 'marcus', 'on-track', 3, 'Priscilla Navarro', ['ines'], 2],
  ['hb', 'HL-2034', 'Medical records request, two providers', 'Okonkwo v. Lakeshore Transit', 'records', 'lo', 'priya', 'at-risk', 1, 'Priscilla Navarro', [], 3],
  ['hb', 'HL-2026', 'Weekly client status updates', 'Firmwide', 'comms', 'cx', 'marcus', 'on-track', 6, 'Priscilla Navarro', [], 1],
  ['hb', 'HL-2021', 'Records chronology', 'Vance Estate', 'records', 'lo', 'priya', 'review', 2, 'Priscilla Navarro', [], 5],
  ['lp', 'HL-2039', 'November billing cycle', 'Firmwide', 'billing', 'fa', 'elena', 'on-track', 9, 'Desmond Achebe', ['ruth'], 1],
  ['lp', 'HL-2032', 'Deadline calendar refresh', 'Abernathy v. Crane Mutual', 'docket', 'lo', 'ruth', 'blocked', 0, 'Desmond Achebe', [], 1],
  ['lp', 'HL-2025', 'Matter data cleanup', 'Firmwide', 'data', 'dv', 'theo', 'on-track', 11, 'Desmond Achebe', [], 2],
  ['lp', 'HL-2018', 'Trust account reconciliation', 'Firmwide', 'finance', 'fa', 'elena', 'at-risk', 2, 'Desmond Achebe', [], 1],
  ['ow', 'HL-2043', 'Intake process setup', 'Firmwide', 'intake', 'cx', 'noah', 'on-track', 8, 'Helena Ostrowski', ['ines'], 1],
  ['tm', 'HL-2011', 'Collections follow-up', 'Firmwide', 'collections', 'fa', 'elena', 'on-track', 15, 'Rafael Tavares', [], 1]
];
const OTHER_DL = [
  ['D30', 'Records production due', 'Discovery', 1, 'HL-2034', true], ['D31', 'Chronology to attorney', 'Client deliverable', 2, 'HL-2021', false],
  ['D32', 'Scheduling order deadlines entered', 'Filing', 0, 'HL-2032', true], ['D33', 'Trust reconciliation sign-off', 'Billing', 2, 'HL-2018', true],
  ['D34', 'Invoices issued', 'Billing', 9, 'HL-2039', false], ['D35', 'Intake process go-live', 'Client deliverable', 8, 'HL-2043', false]
];
const KIND_TIME = { Filing: [17, 0], Discovery: [17, 0], Hearing: [9, 30], Billing: [12, 0], Report: [10, 0], 'Client deliverable': [15, 0] };
const CONTENT_SEED = {
  'hero.line': 'Add capacity. Protect focus.', 'hero.accent': 'Scale with control.',
  'hero.sub': 'A managed operating layer behind the practice of law. Hyacinth builds and manages dedicated teams around the recurring work that consumes attorney, paralegal, and leadership capacity.',
  'p0.title': 'Dedicated teams', 'p0.tag': 'Aligned to your workflows.', 'p0.text': 'A team that learns how your firm works and stays on your account.',
  'p1.title': 'Defined workflows', 'p1.tag': 'Built for consistency.', 'p1.text': 'Recurring work runs on a documented process, the same way every time.',
  'p2.title': 'Visible execution', 'p2.tag': 'Managed with accountability.', 'p2.text': 'You can see what the team is doing, what is due, and what needs you.',
  'a0.title': 'Client Experience', 'a0.text': 'Intake, communications, scheduling, and status updates that keep clients informed.',
  'a1.title': 'Legal Operations', 'a1.text': 'Records coordination, document organization, and deadline tracking under attorney direction.',
  'a2.title': 'Finance + Administration', 'a2.text': 'Billing support, finance workflows, and the back-office processes behind them.',
  'a3.title': 'Growth Operations', 'a3.text': 'CRM administration, outreach, and research that support new business.',
  'a4.title': 'Data + Management Visibility', 'a4.text': 'Data administration and reporting that show leadership what is moving.',
  'a5.title': 'Custom Operating Teams', 'a5.text': 'A dedicated team built around a workflow specific to your firm.',
  's0.fig': '120+', 's0.label': 'cities across the operating lifecycle', 's1.fig': '$270M+', 's1.label': "in settlements for the firm's clients", 's2.fig': 'End-to-end', 's2.label': 'operating ownership',
  'rep.name': 'Dana Okafor', 'rep.email': 'dana.okafor@hyacinth.example', 'rep.phone': '(312) 555-0170'
};
const PERM_SEED = () => ({
  'Super Admin': Object.fromEntries(FEATURES.map(([k]) => [k, true])),
  'Operations Manager': Object.fromEntries(FEATURES.map(([k]) => [k, !['users', 'perms', 'settings'].includes(k)])),
  'Team Lead': Object.fromEntries(FEATURES.map(([k]) => [k, ['workflows', 'leads', 'audit'].includes(k)]))
});
function seedOther() {
  OTHER_SEED.forEach(r => state.workflows.push(buildWf(r.slice(1), r[0])));
  OTHER_DL.forEach(([id, title, kind, off, wf, risk]) => state.deadlines.push({ id, title, kind, date: at(off, ...KIND_TIME[kind]), wf, atRisk: !!risk, done: false }));
}
function seedAdmin() {
  if (state.firms && state.firms.length) return;
  const mk = (id, name, city, status, since, contact, services, lead, team, sla, scale) => ({ id, name, city, status, since, contact, contacts: [{ ...contact, primary: true }], services, lead, team, sla, scale, notes: [] });
  state.firms = [
    mk('cw', 'Calder Whitmore LLP', 'Chicago, IL', 'Active', new Date(2025, 2, 3), { name: 'Morgan Hale', title: 'Director of Operations', email: 'morgan.hale@calderwhitmore.example', phone: '(312) 555-0148' }, ['cx', 'lo', 'fa', 'go', 'dv', 'ct'], 'dana', ['dana', 'marcus', 'priya', 'aisha', 'elena', 'theo', 'noah'], null, 1),
    mk('hb', 'Halvorsen & Beck LLP', 'Milwaukee, WI', 'Active', new Date(2025, 6, 14), { name: 'Priscilla Navarro', title: 'Managing Partner', email: 'pnavarro@halvorsenbeck.example', phone: '(414) 555-0193' }, ['cx', 'lo'], 'ines', ['ines', 'marcus', 'priya'], 94.8, 0.45),
    mk('lp', 'Larkspur Legal Group', 'Indianapolis, IN', 'Active', new Date(2025, 10, 3), { name: 'Desmond Achebe', title: 'Firm Administrator', email: 'dachebe@larkspurlegal.example', phone: '(317) 555-0126' }, ['lo', 'fa', 'dv'], 'ruth', ['ruth', 'elena', 'theo'], 97.2, 0.6),
    mk('ow', 'Ostrowski Wynn PC', 'Detroit, MI', 'Onboarding', addDays(-12), { name: 'Helena Ostrowski', title: 'Partner', email: 'helena@ostrowskiwynn.example', phone: '(313) 555-0161' }, ['cx'], 'ines', ['ines', 'noah'], null, 0.2),
    mk('tm', 'Tavares Mendel LLP', 'St. Louis, MO', 'Paused', new Date(2025, 0, 20), { name: 'Rafael Tavares', title: 'Partner', email: 'rtavares@tavaresmendel.example', phone: '(314) 555-0117' }, ['fa'], 'ruth', ['ruth', 'elena'], 91.5, 0.3)
  ];
  state.firms[0].contacts.push({ name: 'Rachel Calder', title: 'Managing Partner', email: 'rcalder@calderwhitmore.example', phone: '(312) 555-0101' });
  state.firms[0].notes.push({ who: 'Dana Okafor', text: 'Quarterly review scheduled. Firm wants to expand Growth Operations next quarter.', at: at(-6, 11, 0) });
  const L = (id, name, firmN, email, phone, area, msg, status, rep, followUp, created) => ({ id, name, firm: firmN, email, phone, area, msg, status, rep, followUp, created, notes: [], log: [{ who: 'Website', sys: true, text: 'Submitted the website contact form.', at: created }].concat(status !== 'New' ? [{ who: rep ? TEAM[rep].name : 'Hyacinth staff', text: `Moved to ${status}.`, at: new Date(created.getTime() + 864e5) }] : []).reverse(), convertedFirm: null });
  state.leads = [
    L('L-119', 'Chloe Martinez-Ruiz', 'Martinez Ruiz Law', 'chloe@martinezruiz.example', '(773) 555-0144', 'Legal Support', 'We need help organizing discovery documents across active matters.', 'New', null, null, at(0, 8, 45)),
    L('L-118', 'Avery Kincaid', 'Kincaid Rowe LLP', 'akincaid@kincaidrowe.example', '(608) 555-0182', 'Client Operations', 'Intake calls are taking paralegal time during trial prep.', 'New', null, null, at(-1, 14, 20)),
    L('L-117', 'Jordan Pell', 'Pell & Sato', 'jpell@pellsato.example', '(312) 555-0109', 'Legal Support', 'Records requests take too long across our med-mal matters.', 'Contacted', 'dana', at(2, 10, 30), at(-3, 9, 5)),
    L('L-115', 'Sunita Rao', 'Rao Fairbanks LLP', 'srao@raofairbanks.example', '(414) 555-0175', 'Business Operations', 'Our billing cycle runs late every month.', 'Discovery call', 'samir', at(1, 15, 0), at(-8, 10, 0)),
    L('L-112', 'Elliot Brandvold', 'Brandvold Kerr PC', 'ebrandvold@brandvoldkerr.example', '(317) 555-0133', 'Legal Support', 'Deadline tracking across 40 active matters.', 'Proposal', 'ines', at(4, 11, 0), at(-15, 13, 0)),
    L('L-109', 'Nadia Ferreira', 'Ferreira Lowe LLP', 'nferreira@ferreiralowe.example', '(314) 555-0152', 'Client Operations', 'Client status updates are inconsistent.', 'Won', 'dana', null, at(-24, 9, 30)),
    L('L-104', 'Graham Oyelaran', 'Oyelaran Associates', 'graham@oyelaran.example', '(313) 555-0190', 'Not sure yet', 'Exploring options for next year.', 'Lost', 'ruth', null, at(-30, 16, 0))
  ];
  const U = (name, email, type, role, firmId, last, status) => ({ id: 'U' + Math.random().toString(36).slice(2, 7), name, email, type, role, firm: firmId, last, status });
  state.users = [
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
  const A = (when, user, role, type, action, target) => ({ id: 'A' + Math.random().toString(36).slice(2, 8), at: when, user, role, type, action, target });
  state.audit = [
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
  state.content = { ...CONTENT_SEED };
  state.contentDraft = { ...CONTENT_SEED };
  state.contentPublishedAt = at(-1, 16, 40);
  state.settings = {
    org: { name: 'Hyacinth Industries, LLC', website: 'hyacinth.example', phone: '(312) 555-0100', address: 'Chicago, IL' },
    tz: 'CT', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], open: '8:00', close: '18:00',
    sla: { cx: 2, lo: 3, fa: 5, go: 5, dv: 5, ct: 7 },
    notify: { lead: { email: true, app: true }, risk: { email: true, app: true }, publish: { email: false, app: true }, invite: { email: true, app: false }, digest: { email: true, app: false } }
  };
  state.perms = PERM_SEED();
  state.templates = Object.entries(TEMPLATES).map(([k, steps]) => ({ id: k, name: TPL_NAME[k] || TYPE_LABEL[k], area: TPL_AREA[k] || 'ct', sla: state.settings.sla[TPL_AREA[k] || 'ct'], steps: steps.map(([t, a, r]) => ({ title: t, auto: !!a, review: !!r })) }));
}
Object.assign(state, {
  portalFirm: 'cw', viewAs: false, firms: [], leads: [], users: [], audit: [], templates: [], content: null, contentDraft: null, settings: null, perms: null, leadId: null,
  admin: {
    signedIn: false, keep: true, name: '', email: '', role: 'Super Admin', view: null, pending: null, clientId: null, wfTab: 'all', sel: new Set(), chartTable: false, pendingLead: null,
    wf: { q: '', firms: [], areas: [], statuses: [], owner: 'all', due: null, sort: 'due', dir: 'asc' },
    clients: { q: '', status: [], services: [], sort: 'name', dir: 'asc' },
    users: { tab: 'all', q: '', status: 'all' }, audit: { user: 'all', types: [], range: null },
    wiz: null, tpl: null, csv: null
  }
});

/* ---------- Selectors & helpers ---------- */
const firm = id => state.firms.find(f => f.id === id);
const firmName = id => (firm(id) || {}).name || 'Unknown firm';
const pFirm = () => firm(state.portalFirm) || state.firms[0];
const pWfs = () => state.workflows.filter(w => w.firm === state.portalFirm);
const allOpen = () => state.workflows.filter(w => w.status !== 'complete');
const allDeadlines = () => state.deadlines.filter(d => getWf(d.wf));
const typeLabel = k => ((state.templates || []).find(t => t.id === k) || {}).name || TYPE_LABEL[k] || k;
const activeStaff = () => Object.entries(TEAM).filter(([, t]) => t.active !== false);
const workload = k => allOpen().filter(w => w.owner === k).length;
const can = f => !!(state.perms && state.perms[state.admin.role] && state.perms[state.admin.role][f]);
const actorName = () => state.surface === 'admin' ? (state.admin.name || 'Hyacinth staff') : state.profile.name;
const areaOpts = () => Object.entries(AREAS).map(([k, v]) => ({ value: k, label: v }));
const firmOpts = () => state.firms.map(f => ({ value: f.id, label: f.name, sub: `${f.city} · ${f.status}` }));
function staffOpts(teamKeys) {
  return activeStaff().map(([k, t]) => ({ value: k, label: t.name, sub: `${t.role} · ${workload(k)} of ${t.capacity} in use`, group: teamKeys ? (teamKeys.includes(k) ? 'On this firm’s team' : 'Other staff') : t.access === 'Specialist' ? 'Specialists' : 'Leads and managers' }))
    .sort((a, b) => (a.group === b.group ? 0 : (teamKeys ? (a.group === 'Other staff' ? 1 : -1) : (a.group === 'Specialists' ? 1 : -1))));
}
const firmBadge = s => `<span class="badge ${s === 'Active' ? 'st-complete' : s === 'Onboarding' ? 'st-review' : 'st-blocked'}">${icon(FS_ICON[s], 12)}${s}</span>`;
function slaFor(id) {
  if (id === 'cw') { let total = state.slaBase.total, ok = state.slaBase.onTime; state.workflows.forEach(w => { if (w.firm === 'cw' && w.completedNow) { total++; if (w.completedOnTime) ok++; } }); return ok / total * 100; }
  const f = firm(id); return f ? f.sla : null;
}
function allSla() { const v = state.firms.map(f => slaFor(f.id)).filter(x => x != null); return v.length ? sum(v) / v.length : null; }
function dlMarkers(all) {
  return d => {
    const items = (all ? allDeadlines() : activeDeadlines()).filter(x => !x.done && sameDay(x.date, d));
    return { risk: items.filter(x => x.atRisk).length, normal: items.filter(x => !x.atRisk).length, titles: items.map(x => x.title) };
  };
}
function audit(type, action, target) {
  state.audit.unshift({ id: 'A' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), at: new Date(), user: state.admin.name || 'Hyacinth staff', role: state.admin.role, type, action, target });
}
const roNote = f => `<div class="ro-note" role="note">${icon('shield', 18)}<span><b>Read-only for ${esc(state.admin.role)}.</b> “${esc(FEATURE_LABEL[f])}” is off for this role in Users &amp; roles.</span><button class="btn btn-ghost btn-sm" type="button" data-action="focus-role">Switch role</button></div>`;
const aMain = () => $('#admin-main');
const aSet = (n, html) => { const el = $(`[data-aregion="${n}"]`, aMain()); if (el) el.innerHTML = html; return el; };
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; };
const csvCell = v => /[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? '');
const toCSV = rows => rows.map(r => r.map(csvCell).join(',')).join('\n');
function openCsv(title, filename, csv) {
  state.admin.csv = { filename, csv };
  openModal({
    title: esc(title), focus: '#csv-copy',
    body: `<p class="small">${canDownload() ? 'Download the CSV, or copy it and paste it into Excel or Google Sheets.' : 'File downloads are not available in this view. Copy the CSV and paste it into Excel or Google Sheets.'}</p><label class="label" for="csv-text">CSV preview · ${esc(filename)}</label><textarea class="textarea csv-box" id="csv-text" readonly>${esc(csv)}</textarea>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Close</button>${canDownload() ? `<button class="btn btn-ghost" type="button" id="csv-download" data-action="csv-download">${icon('download', 18)}Download .csv</button>` : ''}<button class="btn btn-primary" type="button" id="csv-copy" data-action="csv-copy">${icon('copy', 18)}Copy CSV</button>`
  });
}

/* ---------- Website content binding ---------- */
function renderSiteContent() {
  const C = state.content; if (!C) return;
  $$('[data-c]').forEach(el => { const v = C[el.dataset.c]; if (v != null && el.textContent !== v) el.textContent = v; });
}
function addLeadFromWebsite(v) {
  const n = Math.max(100, ...state.leads.map(l => +l.id.split('-')[1])) + 1;
  const lead = { id: `L-${n}`, name: v['c-name'], firm: v['c-firm'] || 'Firm not provided', email: v['c-email'], phone: v['c-phone'], area: v['c-area'] || 'Not specified', msg: v['c-msg'] || '', status: 'New', rep: null, followUp: null, created: new Date(), notes: [], log: [{ who: 'Website', sys: true, text: 'Submitted the website contact form.', at: new Date() }], convertedFirm: null, isNew: true };
  state.leads.unshift(lead);
  state.audit.unshift({ id: 'A' + Date.now().toString(36), at: new Date(), user: 'Website', role: 'Contact form', type: 'Create', action: `New lead from ${lead.name}`, target: lead.firm });
  updateAdminChrome();
  return lead;
}

/* =========================================================
   Admin chrome, routing, role switcher
   ========================================================= */
function updateAdminChrome() {
  const n = state.leads.filter(l => l.status === 'New').length;
  const lc = $('#lead-count'); if (lc) { lc.textContent = n; lc.hidden = !n; lc.setAttribute('aria-label', `${n} new`); }
  const nm = state.admin.name || 'Hyacinth staff';
  [$('#admin-avatar'), $('#admin-avatar-2')].forEach(a => { if (a) a.textContent = initials(nm); });
  const an = $('#admin-name'); if (an) an.textContent = nm;
  const ar = $('#admin-role-l'); if (ar) ar.textContent = state.admin.role;
  const slot = $('#role-slot');
  if (slot && state.admin.signedIn) slot.innerHTML = dd('role-switch', { kind: 'select', labelId: 'role-l', title: 'Role', value: state.admin.role, options: ROLES.map(r => ({ value: r, label: r, sub: ROLE_DESC[r], icon: 'shield' })), onChange: v => switchRole(v) });
}
function switchRole(v) {
  state.admin.role = v;
  audit('Role change', `Switched the demo role to ${v}`, 'Role switcher');
  updateAdminChrome();
  if (state.admin.view) renderAdminView(state.admin.view, { focus: false });
  toast(`Viewing as ${v}. ${v === 'Super Admin' ? 'Everything is editable.' : 'Some controls are now read-only.'}`, { icon: 'shield' });
  const t = $('#role-switch'); if (t) t.focus();
}
function routeAdmin(h, initial) {
  if (!state.admin.signedIn) { state.admin.pending = h; document.title = 'Staff sign-in · Hyacinth admin'; if (!initial) $('#signin-title').focus({ preventScroll: true }); return; }
  const pf = pendingFocus; pendingFocus = null;
  renderAdminView(h, { focus: !initial && !pf });
  if (pf) { const f = $(pf); if (f) f.focus(); }
}
const AVIEWS = {};
function renderAdminView(v, opts = {}) {
  const def = AVIEWS[v];
  if (v !== 'admin-clients') state.admin.clientId = null;
  state.admin.view = v;
  if (v !== 'admin-workflows') state.admin.sel.clear();
  const m = aMain();
  m.innerHTML = def.shell();
  m.dataset.view = v;
  if (def.mount) def.mount();
  if (def.update) def.update();
  hydrate(m);
  updateAdminChrome();
  $$('[data-aview-link]').forEach(a => { if (a.dataset.aviewLink === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#admin-crumb').textContent = def.title;
  document.title = `${def.title} · Hyacinth admin`;
  if (opts.focus !== false) { window.scrollTo(0, 0); const t = $('#view-title', m); if (t) t.focus({ preventScroll: true }); }
}
function contentDirty() { return !!(state.contentDraft && state.content && JSON.stringify(state.contentDraft) !== JSON.stringify(state.content)); }
let guardBypass = false;
function contentGuard(h) {
  if (guardBypass || state.surface !== 'admin' || state.admin.view !== 'admin-content' || h === 'admin-content' || !contentDirty()) return false;
  try { history.replaceState(null, '', '#admin-content'); } catch (_) { /* ignore */ }
  confirmDialog({ title: 'Leave without publishing?', body: 'You have unpublished changes to the website content. Leaving discards them.', confirm: 'Discard and leave', danger: true }).then(ok => {
    if (!ok) { const f = $('[data-action="ce-publish"]'); if (f && !f.disabled) f.focus(); return; }
    state.contentDraft = { ...state.content };
    guardBypass = true; location.hash = h; setTimeout(() => { guardBypass = false; }, 0);
    toast('Unpublished changes discarded.', { icon: 'refresh' });
  });
  return true;
}
window.addEventListener('beforeunload', e => { if (contentDirty()) { e.preventDefault(); e.returnValue = ''; } });

/* =========================================================
   Admin · Dashboard
   ========================================================= */
AVIEWS.admin = {
  title: 'Dashboard',
  shell: () => band({
    eyebrow: `Hyacinth admin · ${fmtD(TODAY)}`, title: `Good ${greet()}, ${esc((state.admin.name || 'there').split(' ')[0])}.`,
    sub: 'Operations across every client firm, in one view.',
    actions: `${can('clients') ? `<button class="btn btn-primary btn-sm" type="button" data-action="ad-add-firm">${icon('plus', 18)}Add client firm</button>` : ''}<a class="btn btn-ghost btn-sm" href="#admin-leads">${icon('inbox', 18)}Open leads</a>`,
    extra: '<div class="kpis k5" data-aregion="kpis"></div>'
  }) + `<div class="wrap pcontent">
    <div class="ov-grid">
      <section class="card" aria-labelledby="wl-h"><div class="card-head"><div><h2 class="h4" id="wl-h">Workload by service area</h2><p class="small">Open workflows across all client firms</p></div><button class="btn btn-quiet btn-sm" type="button" id="ad-chart-table" data-action="ad-chart-table" aria-pressed="${state.admin.chartTable}">${icon('list', 18)}${state.admin.chartTable ? 'Chart view' : 'Table view'}</button></div><div class="card-body" data-aregion="chart"></div></section>
      <section class="card" aria-labelledby="ar-h"><div class="card-head"><div style="display:flex;align-items:center;gap:10px"><h2 class="h4" id="ar-h" tabindex="-1">At-risk items</h2><span class="count-badge" data-aregion="ar-count"></span></div><a class="btn btn-quiet btn-sm" href="#admin-workflows" data-ad-status="at-risk">All at-risk ${icon('arrow-right', 18)}</a></div><div data-aregion="atrisk"></div></section>
    </div>
    <div class="ov-grid b">
      <section class="card" aria-labelledby="af-h"><div class="card-head"><div><h2 class="h4" id="af-h">Recent activity</h2><p class="small">Latest entries in the audit log</p></div><a class="btn btn-quiet btn-sm" href="#admin-audit">Audit log ${icon('arrow-right', 18)}</a></div><ul class="feed" data-aregion="feed"></ul></section>
      <section class="card" aria-labelledby="nl-h"><div class="card-head"><div><h2 class="h4" id="nl-h">New leads</h2><p class="small">From the website contact form</p></div><a class="btn btn-quiet btn-sm" href="#admin-leads">Pipeline ${icon('arrow-right', 18)}</a></div><div data-aregion="newleads"></div></section>
    </div></div>`,
  update() {
    const open = allOpen(), riskDl = allDeadlines().filter(d => !d.done && d.atRisk && diffDays(d.date) >= 0), sla = allSla();
    const weekLeads = state.leads.filter(l => (TODAY - startOf(l.created)) / DAY <= 6);
    const kpi = (href, label, value, foot, attrs = '') => `<a class="kpi" href="${href}" ${attrs}><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span><span class="kpi-foot"><span>${foot}</span>${icon('arrow-right', 18)}</span></a>`;
    aSet('kpis', [
      kpi('#admin-clients', 'Active client firms', state.firms.filter(f => f.status === 'Active').length, `${state.firms.filter(f => f.status === 'Onboarding').length} onboarding`),
      kpi('#admin-workflows', 'Open workflows, all clients', open.length, `${open.filter(w => w.status === 'at-risk').length} at risk`, 'data-ad-status="all"'),
      kpi('#admin-workflows', 'Deadlines at risk', riskDl.length, 'Flagged and upcoming', 'data-ad-status="at-risk"'),
      kpi('#admin-clients', 'SLA on time, all clients', sla == null ? '—' : sla.toFixed(1) + '%', 'Average across firms'),
      kpi('#admin-leads', 'New leads this week', weekLeads.length, `${state.leads.filter(l => l.status === 'New').length} not yet contacted`)
    ].join(''));
    adChart();
    const ar = open.filter(w => w.status === 'at-risk' || w.status === 'blocked').sort((a, b) => a.due - b.due);
    aSet('ar-count', ar.length);
    aSet('atrisk', ar.length ? `<div class="ex-list">${ar.map(w => `<article class="ex" aria-labelledby="art-${w.id}"><span class="sev ${w.status === 'at-risk' ? 'high' : ''}">${icon(w.status === 'at-risk' ? 'alert' : 'block', 16)}</span><div>
        <h3 class="ex-title" id="art-${w.id}">${esc(w.title)}</h3>
        <p class="ex-meta"><span>${esc(firmName(w.firm))}</span><span aria-hidden="true">·</span><span class="mono">${w.id}</span><span aria-hidden="true">·</span><span>${esc(TEAM[w.owner].name)}</span></p>
        <p class="ex-meta">${statusBadge(w.status)}${dueChip(w.due)}${w.escalated ? `<span class="mini-chip">${icon('flag', 12)}&nbsp;Escalated</span>` : ''}</p>
        <div class="ex-actions"><button class="btn btn-dark btn-sm" type="button" data-action="open-wf" data-id="${w.id}">${icon('eye', 16)}Open</button>${can('workflows') ? `<button class="btn btn-ghost btn-sm" type="button" id="arr-${w.id}" data-action="ad-reassign" data-id="${w.id}">${icon('users', 16)}Reassign</button><button class="btn btn-ghost btn-sm" type="button" id="are-${w.id}" data-action="ad-escalate" data-id="${w.id}" aria-pressed="${!!w.escalated}">${icon('flag', 16)}${w.escalated ? 'Escalated' : 'Escalate'}</button>` : ''}</div></div></article>`).join('')}</div>${can('workflows') ? '' : `<div style="padding:0 24px 16px">${roNote('workflows')}</div>`}`
      : emptyState({ ic: 'check', title: 'Nothing at risk', text: 'No workflow is at risk or blocked across any client firm.', actions: '<a class="btn btn-ghost btn-sm" href="#admin-workflows">Review all workflows</a>' }));
    aSet('feed', state.audit.slice(0, 7).map(a => `<li><span class="avatar" aria-hidden="true">${a.user === 'Website' ? icon('inbox', 14) : initials(a.user)}</span><div><p><b>${esc(a.user)}</b> · ${esc(a.action)}</p><p class="small">${esc(a.type)} · ${esc(a.target)} · ${relTime(a.at)}</p></div></li>`).join('') || '<li>No activity yet.</li>');
    const nl = state.leads.filter(l => l.status === 'New');
    aSet('newleads', nl.length ? `<div class="row-list">${nl.map(l => `<button type="button" class="row-item" data-action="ad-open-lead" data-id="${l.id}"><span class="avatar" aria-hidden="true">${initials(l.name)}</span><span><span class="row-title" style="display:block">${esc(l.name)}</span><span class="row-sub" style="display:block">${esc(l.firm)} · ${esc(l.area)} · ${relText(l.created)}</span></span>${icon('chevron-right', 18)}</button>`).join('')}</div>`
      : emptyState({ ic: 'inbox', title: 'No new leads', text: 'Every website submission has been contacted.', actions: '<a class="btn btn-ghost btn-sm" href="#admin-leads">Open the pipeline</a>' }));
  }
};
function adChart() {
  const el = aSet('chart', ''); if (!el) return;
  const rows = Object.entries(AREAS).map(([k, label]) => { const o = allOpen().filter(w => w.area === k); const r = o.filter(w => w.status === 'at-risk' || w.status === 'blocked').length; return { k, label, risk: r, other: o.length - r, total: o.length }; });
  if (state.admin.chartTable) {
    el.innerHTML = `<div class="table-wrap" tabindex="0" role="region" aria-label="Workload by service area table" style="border-top:0"><table class="mini-table"><thead><tr><th scope="col">Service area</th><th scope="col">At risk or blocked</th><th scope="col">Other open</th><th scope="col">Total</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.label)}</td><td>${r.risk}</td><td>${r.other}</td><td><b>${r.total}</b></td></tr>`).join('')}</tbody></table></div>`;
    return;
  }
  el.innerHTML = `<div class="chart-wrap" id="ad-chart"><div class="chart-svg"></div><div class="chart-tip" aria-hidden="true"></div></div><div class="legend"><span><i class="key-sq" style="background:var(--gold)"></i>At risk or blocked</span><span><i class="key-sq" style="background:color-mix(in srgb,var(--warm-gray) 45%,var(--white))"></i>Other open</span></div><p class="sr-only">${rows.map(r => `${r.label}: ${r.total} open, ${r.risk} at risk or blocked`).join('. ')}.</p>`;
  const wrap = $('#ad-chart'), holder = $('.chart-svg', wrap), tip = $('.chart-tip', wrap);
  const W = Math.max(260, Math.floor(holder.getBoundingClientRect().width || 560)), narrow = W < 560;
  const rowH = narrow ? 52 : 38, barH = 16, m = { l: narrow ? 0 : 210, r: 36, t: 4 };
  const iw = W - m.l - m.r, maxV = Math.max(1, ...rows.map(r => r.total)), step = niceStep(maxV / 4) || 1, max = Math.ceil(maxV / step) * step;
  const H = m.t + rowH * rows.length + 22;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  for (let v = 0; v <= max + 0.001; v += step) { const gx = m.l + v / max * iw; s += `<line x1="${gx}" x2="${gx}" y1="${m.t}" y2="${H - 22}" style="stroke:var(--hairline)" stroke-width="1"/><text x="${gx}" y="${H - 6}" text-anchor="middle" font-size="11">${v}</text>`; }
  rows.forEach((r, i) => {
    const top = m.t + i * rowH, by = narrow ? top + 24 : top + (rowH - barH) / 2;
    s += narrow ? `<text x="0" y="${top + 16}" font-size="12">${esc(r.label)}</text>` : `<text x="${m.l - 12}" y="${by + 12}" text-anchor="end" font-size="12">${esc(r.label)}</text>`;
    const wr = r.risk / max * iw, wo = r.other / max * iw;
    if (wr > 0) s += `<rect x="${m.l}" y="${by}" width="${Math.max(0, wr - (wo > 0 ? 2 : 0))}" height="${barH}" rx="${wo > 0 ? 0 : 3}" style="fill:var(--gold)"/>`;
    if (wo > 0) s += `<rect x="${m.l + wr}" y="${by}" width="${wo}" height="${barH}" rx="3" style="fill:color-mix(in srgb,var(--warm-gray) 45%,var(--white))"/>`;
    s += `<text x="${m.l + wr + wo + 8}" y="${by + 12}" font-size="12" font-weight="600">${r.total}</text>`;
    s += `<rect class="bar-hit" data-i="${i}" x="0" y="${top}" width="${W}" height="${rowH}" style="fill:transparent"/>`;
  });
  holder.innerHTML = s + '</svg>';
  $$('.bar-hit', holder).forEach(h => {
    h.addEventListener('pointerenter', () => { const r = rows[+h.dataset.i]; tip.innerHTML = `<b>${esc(r.label)}</b><div class="row"><span>At risk or blocked</span><strong>${r.risk}</strong></div><div class="row"><span>Other open</span><strong>${r.other}</strong></div>`; tip.style.left = Math.min(W - 190, m.l + r.total / max * iw + 12) + 'px'; tip.style.top = (m.t + +h.dataset.i * rowH - 4) + 'px'; tip.classList.add('show'); });
    h.addEventListener('pointerleave', () => tip.classList.remove('show'));
  });
}

/* =========================================================
   Admin · Client firms (list + detail)
   ========================================================= */
AVIEWS['admin-clients'] = {
  title: 'Client firms',
  shell() {
    if (state.admin.clientId && firm(state.admin.clientId)) return clientDetailShell();
    const f = state.admin.clients;
    return band({ eyebrow: 'Operations', title: 'Client firms', sub: 'Every firm Hyacinth runs work for, with its services, team and service levels.', actions: can('clients') ? `<button class="btn btn-primary btn-sm" type="button" data-action="ad-add-firm">${icon('plus', 18)}Add client firm</button>` : '', extra: '<div class="kpis" role="group" aria-label="Client firms by status" data-aregion="cl-stats"></div>' }) + `
    <div class="wrap pcontent">${can('clients') ? '' : roNote('clients')}
      <section class="card" aria-label="Client firm list">
        <div class="filters">
          <div class="field wide"><label class="flabel" for="cl-q">Search</label><div class="search-field">${icon('search', 18)}<input class="input" id="cl-q" type="search" data-input="cl-q" placeholder="Firm, contact or city" value="${esc(f.q)}" autocomplete="off"></div></div>
          <div class="field"><span class="flabel" id="cl-st-l">Status</span>${dd('cl-status', { kind: 'multi', labelId: 'cl-st-l', title: 'Status', placeholder: 'Any status', value: f.status, options: FIRM_STATUSES.map(s => ({ value: s, label: s, icon: FS_ICON[s] })), onChange: v => { f.status = v; clientStats(); clientsTable(); } })}</div>
          <div class="field"><span class="flabel" id="cl-sv-l">Services</span>${dd('cl-svc', { kind: 'multi', labelId: 'cl-sv-l', title: 'Services', placeholder: 'Any service', value: f.services, options: areaOpts().map(o => ({ ...o, short: o.label.split(' ')[0] })), onChange: v => { f.services = v; clientsTable(); } })}</div>
          <div class="field"><span class="flabel" aria-hidden="true">&nbsp;</span><button class="btn btn-quiet" type="button" id="cl-clear" data-action="cl-clear">Clear filters</button></div>
        </div>
        <div data-aregion="cl-table"></div>
      </section></div>`;
  },
  update() { if (state.admin.clientId && firm(state.admin.clientId)) clientDetailUpdate(); else { clientStats(); clientsTable(); } }
};
function clientStats() {
  const f = state.admin.clients;
  const items = [['all', state.firms.length, 'Total firms']].concat(['Active', 'Onboarding', 'Paused'].map(s => [s, state.firms.filter(x => x.status === s).length, s]));
  const foot = { all: 'Show all firms', Active: 'Running work now', Onboarding: 'Setting up with Hyacinth', Paused: 'Work on hold' };
  aSet('cl-stats', kpiRow(items.map(([k, v, l]) => ({ label: k === 'all' ? 'Total firms' : `${l} firms`, value: v, foot: foot[k], action: 'cl-stat', attrs: `data-k="${k}"`, id: `clst-${k}`, pressed: k === 'all' ? !f.status.length : (f.status.length === 1 && f.status[0] === k) }))));
}
function clientsTable() {
  const f = state.admin.clients, q = f.q.trim().toLowerCase();
  let list = state.firms.filter(x => (!f.status.length || f.status.includes(x.status)) && (!f.services.length || f.services.some(s => x.services.includes(s))) && (!q || [x.name, x.city, x.contact.name, x.contact.email].join(' ').toLowerCase().includes(q)));
  const key = { name: x => x.name, contact: x => x.contact.name, lead: x => TEAM[x.lead].name, open: x => firmWfs(x.id).filter(w => w.status !== 'complete').length, sla: x => slaFor(x.id) ?? -1, status: x => FIRM_STATUSES.indexOf(x.status) }[f.sort];
  list = list.sort((a, b) => { const A = key(a), B = key(b); return (A < B ? -1 : A > B ? 1 : 0) * (f.dir === 'asc' ? 1 : -1); });
  const c = $('#cl-clear'); if (c) c.disabled = !(f.q || f.status.length || f.services.length);
  if (!list.length) { aSet('cl-table', `<div style="border-top:1px solid var(--hairline)">${emptyState({ ic: 'search', title: 'No client firms match', text: 'Try a different search, status or service, or clear the filters.', actions: '<button class="btn btn-dark btn-sm" type="button" data-action="cl-clear">Clear filters</button>' })}</div>`); return; }
  const cols = [['name', 'Firm'], ['contact', 'Primary contact'], [null, 'Active services'], ['lead', 'Team lead'], ['open', 'Open workflows'], ['sla', 'SLA on time'], ['status', 'Status']];
  const th = cols.map(([k, l]) => k ? `<th scope="col" aria-sort="${f.sort === k ? (f.dir === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="sort" id="clsort-${k}" data-action="cl-sort" data-key="${k}">${l}${icon('chevron-down', 14)}</button></th>` : `<th scope="col">${l}</th>`).join('') + '<th scope="col"><span class="sr-only">Actions</span></th>';
  const rows = list.map(x => {
    const open = firmWfs(x.id).filter(w => w.status !== 'complete').length, sla = slaFor(x.id);
    const svc = x.services.map(s => AREAS[s].split(' ')[0]);
    return `<tr><td style="min-width:200px"><button type="button" class="wf-link" data-action="ad-open-firm" data-id="${x.id}">${esc(x.name)}</button><div class="cell-sub">${esc(x.city)}</div></td>
      <td style="min-width:200px">${esc(x.contact.name)}<div class="cell-sub">${esc(x.contact.email)}</div></td>
      <td><div class="chips-inline">${svc.slice(0, 2).map(s => `<span class="mini-chip">${esc(s)}</span>`).join('')}${svc.length > 2 ? `<span class="mini-chip" data-tip="${esc(x.services.slice(2).map(s => AREAS[s]).join(', '))}">+${svc.length - 2}</span>` : ''}</div></td>
      <td><span class="person"><span class="avatar" aria-hidden="true">${initials(TEAM[x.lead].name)}</span>${esc(TEAM[x.lead].name)}</span></td>
      <td class="tnum">${open}</td>
      <td>${sla == null ? '<span class="small">No data yet</span>' : `<div class="prog"><div class="prog-track"><div class="prog-fill" style="width:${sla}%"></div></div><span>${sla.toFixed(1)}%</span></div>`}</td>
      <td>${can('clients') ? dd(`fs-${x.id}`, { kind: 'select', size: 'sm', ariaLabel: `Status for ${x.name}`, title: 'Firm status', value: x.status, options: FIRM_STATUSES.map(s => ({ value: s, label: s, icon: FS_ICON[s] })), onChange: (v, c, prev) => setFirmStatus(x.id, v, prev) }) : firmBadge(x.status)}</td>
      <td><button class="icon-btn" type="button" id="clm-${x.id}" data-action="cl-menu" data-id="${x.id}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${esc(x.name)}">${icon('more')}</button></td></tr>`;
  }).join('');
  aSet('cl-table', `<div class="table-wrap" tabindex="0" role="region" aria-label="Client firms table"><table class="data"><caption class="sr-only">Client firms. Column headers sort the table.</caption><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div><div class="result-bar"><span aria-live="polite">Showing ${list.length} of ${state.firms.length} firms</span></div>`);
}
const firmWfs = id => state.workflows.filter(w => w.firm === id);
function setFirmStatus(id, v, prev) {
  const x = firm(id); if (!x || !prev) return;
  x.status = v;
  audit('Status change', `${v === 'Paused' ? 'Paused' : v === 'Active' ? 'Reactivated' : 'Set to Onboarding'} ${x.name}`, x.name);
  refresh();
  toast(`${x.name} is now ${v}.`, { undo: () => { x.status = prev; refresh(); } });
}
function clientDetailShell() {
  const x = firm(state.admin.clientId);
  const ed = can('clients');
  return `<section class="pband on-ink" aria-labelledby="view-title"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><button type="button" class="text-btn" style="color:inherit" data-action="ad-back-clients">${icon('chevron-left', 16)}Client firms</button><span aria-hidden="true">/</span><span aria-current="page">${esc(x.name)}</span></nav>
      <div class="pband-row"><div class="stack-8"><h1 class="ph1" id="view-title" tabindex="-1">${esc(x.name)}</h1><p class="pband-sub">${esc(x.city)} · Client since ${fmtD(x.since)} · ${firmBadge(x.status)}</p></div>
      <div class="pband-actions"><button class="btn btn-primary btn-sm" type="button" data-action="ad-view-as" data-id="${x.id}">${icon('eye', 18)}View as client</button>${ed ? `<button class="btn btn-ghost btn-sm" type="button" data-action="ad-edit-firm" data-id="${x.id}">Edit firm</button><button class="btn btn-ghost btn-sm" type="button" id="firm-pause" data-action="ad-pause-firm" data-id="${x.id}">${x.status === 'Paused' ? 'Reactivate' : 'Pause'}</button>` : ''}</div></div>
      <div class="kpis" data-aregion="fd-stats"></div></div><div class="sigbar" role="presentation"></div></section>
    <div class="wrap pcontent">${ed ? '' : roNote('clients')}<div class="detail-grid">
      <div class="stack-24">
        <section class="card" aria-labelledby="fdw-h"><div class="card-head"><div><h2 class="h4" id="fdw-h">Workflows</h2><p class="small">Everything Hyacinth is running for this firm</p></div><a class="btn btn-quiet btn-sm" href="#admin-workflows" data-ad-firm="${x.id}">Manage ${icon('arrow-right', 18)}</a></div><div data-aregion="fd-wfs"></div></section>
        <section class="card" aria-labelledby="fdn-h"><div class="card-head"><h2 class="h4" id="fdn-h">Notes</h2></div><div class="card-body stack-16">${ed ? `<form class="stack-8" data-form="firm-note" novalidate><label class="label" for="fn-text">Add a note</label><textarea class="textarea" id="fn-text" aria-describedby="fn-text-err" placeholder="Context for the Hyacinth team. Clients don’t see notes."></textarea><p class="err" id="fn-text-err" hidden></p><div><button class="btn btn-dark btn-sm" type="submit" id="fn-submit">Add note</button></div></form>` : ''}<ol class="log" data-aregion="fd-notes"></ol></div></section>
      </div>
      <div class="stack-24">
        <section class="card" aria-labelledby="fds-h"><div class="card-head"><h2 class="h4" id="fds-h">Enabled services</h2>${ed ? `<button class="btn btn-quiet btn-sm" type="button" data-action="ad-edit-firm" data-id="${x.id}" data-step="2">Edit</button>` : ''}</div><ul class="card-body stack-8" data-aregion="fd-svc"></ul></section>
        <section class="card" aria-labelledby="fdt-h"><div class="card-head"><h2 class="h4" id="fdt-h">Assigned team</h2>${ed ? `<button class="btn btn-quiet btn-sm" type="button" data-action="ad-edit-firm" data-id="${x.id}" data-step="3">Edit</button>` : ''}</div><ul class="card-body team-list" data-aregion="fd-team"></ul></section>
        <section class="card" aria-labelledby="fdc-h"><div class="card-head"><h2 class="h4" id="fdc-h">Contacts</h2></div><div class="card-body stack-16"><ul class="team-list" data-aregion="fd-contacts"></ul>${ed ? `<form class="form-grid" data-form="firm-contact" novalidate>${fieldHTML({ id: 'fc-name', label: 'Name' })}${fieldHTML({ id: 'fc-email', label: 'Email', type: 'email' })}${fieldHTML({ id: 'fc-title', label: 'Title', opt: true, full: true })}<div class="full"><button class="btn btn-ghost btn-sm" type="submit" id="fc-submit">${icon('plus', 16)}Add contact</button></div></form>` : ''}</div></section>
      </div></div></div>`;
}
function clientDetailUpdate() {
  const x = firm(state.admin.clientId); if (!x) return;
  const wfs = firmWfs(x.id), open = wfs.filter(w => w.status !== 'complete'), sla = slaFor(x.id);
  aSet('fd-stats', kpiRow([
    { label: 'Open workflows', value: open.length, foot: 'Manage this firm’s workflows', href: '#admin-workflows', attrs: `data-ad-firm="${x.id}"` },
    { label: 'At risk', value: open.filter(w => w.status === 'at-risk').length, foot: 'See at-risk work', href: '#admin-workflows', attrs: `data-ad-firm="${x.id}" data-ad-firm-status="at-risk"` },
    { label: 'SLA on time', value: sla == null ? '—' : sla.toFixed(1) + '%', foot: sla == null ? 'Not enough data yet' : 'Open the client’s portal', action: 'ad-view-as', attrs: `data-id="${x.id}"` },
    { label: 'Deadlines in 7 days', value: allDeadlines().filter(d => getWf(d.wf).firm === x.id && !d.done && diffDays(d.date) >= 0 && diffDays(d.date) <= 6).length, foot: 'Review workflows by due date', href: '#admin-workflows', attrs: `data-ad-firm="${x.id}"` }
  ]));
  aSet('fd-wfs', wfs.length ? `<div class="row-list">${wfs.sort((a, b) => a.due - b.due).map(w => `<button type="button" class="row-item" data-action="open-wf" data-id="${w.id}"><span class="mono">${w.id}</span><span><span class="row-title" style="display:block">${esc(w.title)}</span><span class="row-sub" style="display:block">${esc(TEAM[w.owner].name)} · ${esc(AREAS[w.area])}</span></span><span style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${statusBadge(w.status)}${w.status === 'complete' ? '' : dueChip(w.due)}</span></button>`).join('')}</div>`
    : emptyState({ ic: 'workflow', title: 'No workflows yet', text: 'Workflows appear here once the firm’s team starts work.', actions: '<a class="btn btn-ghost btn-sm" href="#admin-workflows">Go to workflows</a>' }));
  aSet('fd-svc', Object.entries(AREAS).map(([k, v]) => `<li class="person" style="white-space:normal">${x.services.includes(k) ? `<span class="badge st-complete">${icon('check', 12)}On</span>` : '<span class="badge st-on-track">Off</span>'}<span>${esc(v)}</span></li>`).join(''));
  aSet('fd-team', [x.lead, ...x.team.filter(k => k !== x.lead)].map((k, i) => `<li class="person"><span class="avatar" aria-hidden="true">${initials(TEAM[k].name)}</span><span><b style="font-size:var(--fs-14)">${esc(TEAM[k].name)}</b><span class="small" style="display:block">${i === 0 ? 'Team lead · ' : ''}${esc(TEAM[k].role)}</span></span></li>`).join(''));
  aSet('fd-contacts', x.contacts.map(c => `<li class="person" style="white-space:normal"><span class="avatar" aria-hidden="true">${initials(c.name)}</span><span><b style="font-size:var(--fs-14)">${esc(c.name)}</b>${c.primary ? ' <span class="mini-chip">Primary</span>' : ''}<span class="small" style="display:block">${esc(c.title || '')}${c.title ? ' · ' : ''}${esc(c.email)}</span></span></li>`).join(''));
  aSet('fd-notes', x.notes.length ? x.notes.map(n => `<li class="comment"><span class="avatar" aria-hidden="true">${initials(n.who)}</span><div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:baseline"><span class="who">${esc(n.who)}</span><span class="when">${relTime(n.at)}</span></div><p class="txt">${esc(n.text)}</p></div></li>`).join('') : '<li class="small">No notes yet.</li>');
}

/* Firm wizard (create / edit / convert lead) */
function openFirmWizard(mode, x, step, prefill) {
  const base = x ? { name: x.name, city: x.city, status: x.status, cname: x.contact.name, cemail: x.contact.email, cphone: x.contact.phone, services: [...x.services], since: x.since, lead: x.lead, team: x.team.filter(k => k !== x.lead) }
    : { name: '', city: '', status: 'Onboarding', cname: '', cemail: '', cphone: '', services: [], since: TODAY, lead: '', team: [], ...(prefill || {}) };
  state.admin.wiz = { mode, id: x ? x.id : null, step: step || 1, d: base, leadId: prefill && prefill.leadId };
  renderWizard(true);
}
function wizRead() {
  const w = state.admin.wiz; if (!w) return;
  const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : null; };
  if (w.step === 1) { ['name', 'city', 'cname', 'cemail', 'cphone'].forEach(k => { const v = g('wz-' + k); if (v != null) w.d[k] = v; }); w.d.status = ddVal('wz-status') || w.d.status; }
  if (w.step === 2) { w.d.services = ddVal('wz-services') || []; w.d.since = ddVal('wz-since') || w.d.since; }
  if (w.step === 3) { w.d.lead = ddVal('wz-lead') || ''; w.d.team = ddVal('wz-team') || []; }
}
function renderWizard(first) {
  const w = state.admin.wiz, d = w.d;
  const steps = ['Firm details', 'Services', 'Team', 'Review'];
  const ind = `<ol class="steps-ind" aria-label="Steps">${steps.map((s, i) => `<li class="si ${i + 1 === w.step ? 'is-on' : i + 1 < w.step ? 'is-done' : ''}" ${i + 1 === w.step ? 'aria-current="step"' : ''}><b>${i + 1 < w.step ? icon('check', 12) : i + 1}</b>${s}</li>`).join('')}</ol>`;
  let body = '';
  if (w.step === 1) body = `<div class="form-grid">${fieldHTML({ id: 'wz-name', label: 'Firm name', value: d.name, full: true, auto: 'organization' })}${fieldHTML({ id: 'wz-city', label: 'City', opt: true, value: d.city })}<div class="field"><span class="label" id="wz-status-l">Status</span>${dd('wz-status', { kind: 'select', labelId: 'wz-status-l', title: 'Status', value: d.status, options: FIRM_STATUSES.map(s => ({ value: s, label: s, icon: FS_ICON[s] })) })}</div>${fieldHTML({ id: 'wz-cname', label: 'Primary contact name', value: d.cname })}${fieldHTML({ id: 'wz-cemail', label: 'Primary contact email', type: 'email', value: d.cemail })}${fieldHTML({ id: 'wz-cphone', label: 'Phone', type: 'tel', opt: true, value: d.cphone })}</div>`;
  if (w.step === 2) body = `<div class="field"><span class="label" id="wz-svc-l">Services enabled</span>${dd('wz-services', { kind: 'multi', labelId: 'wz-svc-l', title: 'Services', placeholder: 'Choose at least one service', value: d.services, maxChips: 3, options: areaOpts().map(o => ({ ...o, short: o.label.split(' ')[0] })) })}</div><div class="field"><span class="label" id="wz-since-l">Service start date</span>${dd('wz-since', { kind: 'date', labelId: 'wz-since-l', title: 'Service start date', value: d.since, required: true })}</div>`;
  if (w.step === 3) body = `<div class="field"><span class="label" id="wz-lead-l">Team lead</span>${dd('wz-lead', { kind: 'combo', labelId: 'wz-lead-l', title: 'Team lead', placeholder: 'Search staff', value: d.lead, options: staffOpts() })}</div><div class="field"><span class="label" id="wz-team-l">Team members <span class="opt">(optional)</span></span>${dd('wz-team', { kind: 'multi', labelId: 'wz-team-l', title: 'Team members', placeholder: 'Add team members', value: d.team, searchable: true, options: staffOpts() })}</div>`;
  if (w.step === 4) body = `<dl class="dl-list">${[['Firm', d.name], ['City', d.city || 'Not set'], ['Status', d.status], ['Primary contact', `${d.cname} · ${d.cemail}${d.cphone ? ' · ' + d.cphone : ''}`], ['Services', d.services.map(s => AREAS[s]).join(', ')], ['Start date', fmtD(d.since)], ['Team lead', TEAM[d.lead].name], ['Team', d.team.map(k => TEAM[k].name).join(', ') || 'Lead only']].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  const last = w.step === 4;
  const title = w.mode === 'edit' ? `Edit ${esc(d.name || 'firm')}` : w.leadId ? 'Convert lead to client firm' : 'Add client firm';
  openModal({
    title, form: 'firm-wiz', focus: first ? (w.step === 1 ? '#wz-name' : w.step === 2 ? '#wz-services' : w.step === 3 ? '#wz-lead' : '#wz-next') : '#wz-next',
    body: `${ind}<p class="sr-only" aria-live="polite">Step ${w.step} of 4: ${steps[w.step - 1]}</p>${body}`,
    foot: `${w.step > 1 ? '<button class="btn btn-quiet" type="button" data-action="wiz-back" id="wz-back">Back</button>' : '<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button>'}<button class="btn ${last ? 'btn-primary' : 'btn-dark'}" type="submit" id="wz-next">${last ? (w.mode === 'edit' ? 'Save changes' : 'Create client firm') : 'Next'}${last ? '' : icon('arrow-right', 18)}</button>`
  });
  if (!first) { const f = $(w.step === 1 ? '#wz-name' : w.step === 2 ? '#wz-services' : w.step === 3 ? '#wz-lead' : '#wz-next'); if (f) f.focus(); }
}
function wizValidate() {
  const w = state.admin.wiz, d = w.d;
  if (w.step === 1) {
    const e1 = d.name.length < 2 ? 'Enter the firm name.' : state.firms.some(f => f.name.toLowerCase() === d.name.toLowerCase() && f.id !== w.id) ? 'A firm with this name already exists.' : '';
    const e2 = d.cname.length < 2 ? 'Enter the primary contact’s name.' : '';
    const e3 = !EMAIL_RE.test(d.cemail) ? 'Enter an email address in the format name@firm.com.' : '';
    setErr('wz-name', e1); setErr('wz-cname', e2); setErr('wz-cemail', e3);
    const first = [['wz-name', e1], ['wz-cname', e2], ['wz-cemail', e3]].find(x => x[1]);
    if (first) { $('#' + first[0]).focus(); return false; }
  }
  if (w.step === 2) {
    if (!ddCommitTyped('wz-since')) { $('#wz-since').focus(); return false; }
    w.d.since = ddVal('wz-since');
    if (!d.services.length) { ddError('wz-services', 'Choose at least one service.'); $('#wz-services').focus(); return false; }
    if (!w.d.since) { ddError('wz-since', 'Choose a start date.'); $('#wz-since').focus(); return false; }
  }
  if (w.step === 3 && !d.lead) { ddError('wz-lead', 'Choose a team lead.'); $('#wz-lead').focus(); return false; }
  return true;
}

/* =========================================================
   Admin · Workflows (all + templates)
   ========================================================= */
AVIEWS['admin-workflows'] = {
  title: 'Workflows',
  shell() {
    const tab = state.admin.wfTab, f = state.admin.wf;
    return band({ eyebrow: 'Operations', title: 'Workflows', sub: 'Every workflow across every client firm, plus the templates new workflows start from.', actions: tab === 'templates' && can('templates') ? `<button class="btn btn-primary btn-sm" type="button" data-action="tpl-new">${icon('plus', 18)}New template</button>` : '', extra: '<div class="kpis" data-aregion="aw-stats"></div>' }) + `
    <div class="wrap pcontent"><section class="card" aria-label="Workflow management">
      <div class="tabs" role="tablist" aria-label="Workflow views"><button class="tab" role="tab" type="button" id="tab-all" aria-selected="${tab === 'all'}" aria-controls="tp-wf" tabindex="${tab === 'all' ? 0 : -1}" data-action="aw-tab" data-tab="all">All workflows</button><button class="tab" role="tab" type="button" id="tab-templates" aria-selected="${tab === 'templates'}" aria-controls="tp-wf" tabindex="${tab === 'templates' ? 0 : -1}" data-action="aw-tab" data-tab="templates">Templates</button></div>
      <div id="tp-wf" role="tabpanel" aria-labelledby="tab-${tab}">${tab === 'all' ? `
        ${can('workflows') ? '' : `<div style="padding:16px 24px 0">${roNote('workflows')}</div>`}
        <div class="filters">
          <div class="field wide"><label class="flabel" for="aw-q">Search</label><div class="search-field">${icon('search', 18)}<input class="input" id="aw-q" type="search" data-input="aw-q" placeholder="Workflow, matter or ID" value="${esc(f.q)}" autocomplete="off"></div></div>
          <div class="field"><span class="flabel" id="aw-firm-l">Client</span>${dd('aw-firms', { kind: 'multi', labelId: 'aw-firm-l', title: 'Clients', placeholder: 'All clients', searchable: true, value: f.firms, options: state.firms.map(x => ({ value: x.id, label: x.name, short: x.name.split(/[ &]/)[0] })), onChange: v => { f.firms = v; awTable(); } })}</div>
          <div class="field"><span class="flabel" id="aw-area-l">Service area</span>${dd('aw-areas', { kind: 'multi', labelId: 'aw-area-l', title: 'Service areas', placeholder: 'All areas', value: f.areas, options: areaOpts().map(o => ({ ...o, short: o.label.split(' ')[0] })), onChange: v => { f.areas = v; awTable(); } })}</div>
          <div class="field"><span class="flabel" id="aw-st-l">Status</span>${dd('aw-status', { kind: 'multi', labelId: 'aw-st-l', title: 'Statuses', placeholder: 'All statuses', value: f.statuses, options: STATUS_OPTS(), onChange: v => { f.statuses = v; awTable(); } })}</div>
          <div class="field"><span class="flabel" id="aw-own-l">Owner</span>${dd('aw-owner', { kind: 'combo', labelId: 'aw-own-l', title: 'Owner', value: f.owner, options: [{ value: 'all', label: 'All owners' }].concat(Object.entries(TEAM).map(([k, t]) => ({ value: k, label: t.name, sub: t.active === false ? 'Inactive' : t.role }))), onChange: v => { f.owner = v; awTable(); } })}</div>
          <div class="field"><span class="flabel" id="aw-due-l">Due date</span>${dd('aw-due', { kind: 'range', labelId: 'aw-due-l', title: 'Due date range', placeholder: 'Any due date', value: f.due, markers: dlMarkers(true), onChange: v => { f.due = v; awTable(); } })}</div>
          <div class="field"><span class="flabel" aria-hidden="true">&nbsp;</span><button class="btn btn-quiet" type="button" id="aw-clear" data-action="aw-clear">Clear filters</button></div>
        </div>
        <div data-aregion="aw-table"></div><div data-aregion="aw-bulk"></div>` : `${can('templates') ? '' : `<div style="padding:16px 24px 0">${roNote('templates')}</div>`}<div class="tpl-grid" data-aregion="tpl-grid"></div>`}
      </div></section></div>`;
  },
  update() {
    const o = allOpen();
    const af = state.admin.wf.statuses, tab = state.admin.wfTab;
    aSet('aw-stats', kpiRow([
      { label: 'Open workflows', value: o.length, foot: 'All clients', action: 'kpi-aw', attrs: 'data-k="open"', id: 'ka-open', pressed: tab === 'all' && af.length === 4 && !af.includes('complete') },
      { label: 'At risk', value: o.filter(w => w.status === 'at-risk').length, foot: 'Filter to at-risk', action: 'kpi-aw', attrs: 'data-k="at-risk"', id: 'ka-at-risk', pressed: tab === 'all' && af.length === 1 && af[0] === 'at-risk' },
      { label: 'Blocked', value: o.filter(w => w.status === 'blocked').length, foot: 'Filter to blocked', action: 'kpi-aw', attrs: 'data-k="blocked"', id: 'ka-blocked', pressed: tab === 'all' && af.length === 1 && af[0] === 'blocked' },
      { label: 'Templates', value: state.templates.length, foot: tab === 'templates' ? 'Showing templates' : 'Open templates', action: 'kpi-aw', attrs: 'data-k="templates"', id: 'ka-templates', pressed: tab === 'templates' }
    ]));
    if (state.admin.wfTab === 'all') awTable(); else tplGrid();
  }
};
function awFiltered() {
  const f = state.admin.wf, q = f.q.trim().toLowerCase();
  const list = state.workflows.filter(w => (!f.firms.length || f.firms.includes(w.firm)) && (!f.areas.length || f.areas.includes(w.area)) && (!f.statuses.length || f.statuses.includes(w.status)) && (f.owner === 'all' || w.owner === f.owner) &&
    (!f.due || (startOf(w.due) >= startOf(f.due.start) && startOf(w.due) <= startOf(f.due.end))) && (!q || [w.id, w.title, w.matter, firmName(w.firm)].join(' ').toLowerCase().includes(q)));
  const key = { id: w => w.id, title: w => w.title.toLowerCase(), firm: w => firmName(w.firm), owner: w => TEAM[w.owner].name, status: w => STATUS_ORDER.indexOf(w.status), due: w => w.due.getTime() }[f.sort];
  return list.sort((a, b) => { const A = key(a), B = key(b); return ((A < B ? -1 : A > B ? 1 : 0) * (f.dir === 'asc' ? 1 : -1)) || a.id.localeCompare(b.id); });
}
function awTable() {
  const f = state.admin.wf, sel = state.admin.sel, ed = can('workflows');
  const list = awFiltered();
  [...sel].forEach(id => { if (!getWf(id)) sel.delete(id); });
  const c = $('#aw-clear'); if (c) c.disabled = !(f.q || f.firms.length || f.areas.length || f.statuses.length || f.owner !== 'all' || f.due);
  if (!list.length) { aSet('aw-table', `<div style="border-top:1px solid var(--hairline)">${emptyState({ ic: 'search', title: 'No workflows match these filters', text: 'Try another client, status or date range, or clear the filters.', actions: '<button class="btn btn-dark btn-sm" type="button" data-action="aw-clear">Clear filters</button>' })}</div>`); awBulk(); return; }
  const allSel = list.every(w => sel.has(w.id)), someSel = list.some(w => sel.has(w.id));
  const cols = [['id', 'ID'], ['title', 'Workflow'], ['firm', 'Client'], [null, 'Service area'], ['owner', 'Owner'], ['status', 'Status'], ['due', 'Due']];
  const th = (ed ? `<th scope="col" style="width:44px"><input type="checkbox" class="cbox" id="aw-all" data-change="aw-all" ${allSel ? 'checked' : ''} aria-label="Select all ${list.length} workflows shown"></th>` : '') + cols.map(([k, l]) => k ? `<th scope="col" aria-sort="${f.sort === k ? (f.dir === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="sort" id="awsort-${k}" data-action="aw-sort" data-key="${k}">${l}${icon('chevron-down', 14)}</button></th>` : `<th scope="col">${l}</th>`).join('') + '<th scope="col"><span class="sr-only">Actions</span></th>';
  const rows = list.map(w => `<tr>${ed ? `<td><input type="checkbox" class="cbox" id="aws-${w.id}" data-change="aw-sel" data-id="${w.id}" ${sel.has(w.id) ? 'checked' : ''} aria-label="Select ${w.id}"></td>` : ''}
    <td class="mono">${w.id}</td>
    <td style="min-width:230px"><button type="button" class="wf-link" data-action="open-wf" data-id="${w.id}">${esc(w.title)}</button><div class="cell-sub">${esc(w.matter)}</div></td>
    <td style="min-width:160px">${esc(firmName(w.firm))}</td>
    <td style="min-width:150px">${esc(AREAS[w.area])}<div class="cell-sub">${esc(typeLabel(w.type))}</div></td>
    <td><span class="person"><span class="avatar" aria-hidden="true">${initials(TEAM[w.owner].name)}</span>${esc(TEAM[w.owner].name)}</span></td>
    <td>${ed ? statusSelect(w, 'ast') : statusBadge(w.status)}</td>
    <td class="due-cell"><time datetime="${iso(w.due)}">${fmtD(w.due)}</time><div class="cell-sub">${w.status === 'complete' ? 'Completed' : dueChip(w.due)}</div></td>
    <td><button class="icon-btn" type="button" id="awm-${w.id}" data-action="aw-menu" data-id="${w.id}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${w.id}">${icon('more')}</button></td></tr>`).join('');
  aSet('aw-table', `<div class="table-wrap" tabindex="0" role="region" aria-label="All workflows table"><table class="data"><caption class="sr-only">Workflows across all clients</caption><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div><div class="result-bar"><span aria-live="polite">Showing ${list.length} of ${state.workflows.length} workflows${sel.size ? ` · ${sel.size} selected` : ''}</span></div>`);
  const all = $('#aw-all'); if (all) all.indeterminate = someSel && !allSel;
  awBulk();
}
function awBulk() {
  const n = state.admin.sel.size;
  aSet('aw-bulk', n && can('workflows') ? `<div class="bulkbar" role="region" aria-label="Bulk actions"><b>${n} selected</b><button class="btn btn-ghost btn-sm" type="button" data-action="bulk-reassign">${icon('users', 16)}Reassign</button><button class="btn btn-ghost btn-sm" type="button" data-action="bulk-status">Change status</button><button class="btn btn-ghost btn-sm" type="button" data-action="bulk-due">${icon('calendar', 16)}Set due date</button><button class="btn btn-ghost btn-sm" type="button" data-action="bulk-archive">${icon('archive', 16)}Archive</button><button class="btn btn-quiet btn-sm" type="button" data-action="bulk-clear">Clear selection</button></div>` : '');
}
function bulkApply(label, mutate, auditText) {
  const ids = [...state.admin.sel], snap = ids.map(id => { const w = getWf(id); return { w, owner: w.owner, status: w.status, due: w.due, cn: w.completedNow, ot: w.completedOnTime }; });
  snap.forEach(s => mutate(s.w));
  audit('Edit', auditText(ids.length), `${ids.length} workflows`);
  closeLayer(modalRoot(), { restoreFocus: false });
  refresh();
  const t = $('#view-title'); if (t) t.focus({ preventScroll: true });
  toast(label(ids.length), { undo: () => { snap.forEach(s => { s.w.owner = s.owner; s.w.status = s.status; s.w.due = s.due; s.w.completedNow = s.cn; s.w.completedOnTime = s.ot; }); refresh(); } });
}
function tplGrid() {
  const ed = can('templates');
  aSet('tpl-grid', state.templates.map(t => {
    const used = allOpen().filter(w => w.type === t.id).length, auto = t.steps.filter(s => s.auto).length;
    return `<article class="tpl-card" aria-labelledby="tplh-${t.id}"><h3 class="h4" id="tplh-${t.id}">${esc(t.name)}</h3><div class="chips-inline"><span class="mini-chip">${esc(AREAS[t.area])}</span><span class="mini-chip">${t.sla}-day default SLA</span></div><p class="small">${t.steps.length} steps · ${auto} automated · used by ${used} open ${used === 1 ? 'workflow' : 'workflows'}</p><div><button class="btn ${ed ? 'btn-dark' : 'btn-ghost'} btn-sm" type="button" id="tple-${t.id}" data-action="tpl-edit" data-id="${t.id}">${ed ? 'Edit template' : 'View steps'}</button></div></article>`;
  }).join(''));
}
function openTemplate(id) {
  const t = id ? state.templates.find(x => x.id === id) : null;
  state.admin.tpl = t ? { id: t.id, name: t.name, area: t.area, sla: t.sla, steps: t.steps.map(s => ({ ...s })) } : { id: null, name: '', area: 'lo', sla: state.settings.sla.lo, steps: [{ title: '', auto: false }, { title: '', auto: true }] };
  renderTemplate(true);
}
function tplRead() {
  const t = state.admin.tpl; if (!t) return;
  const n = $('#tpl-name'); if (n) t.name = n.value;
  const s = $('#tpl-sla'); if (s) t.sla = s.value;
  t.area = ddVal('tpl-area') || t.area;
  $$('[data-tpl-step]').forEach(inp => { const i = +inp.dataset.tplStep; if (t.steps[i]) t.steps[i].title = inp.value; });
}
function renderTemplate(first, focusSel) {
  const t = state.admin.tpl, ed = can('templates'), dis = ed ? '' : 'disabled';
  const stepsHTML = t.steps.map((s, i) => `<li class="tpl-step ${s.auto ? 'auto' : ''}"><span class="n" aria-hidden="true">${i + 1}</span>
    <div class="field" style="gap:4px"><label class="sr-only" for="tps-${i}">Step ${i + 1}</label><input class="input" id="tps-${i}" data-tpl-step="${i}" value="${esc(s.title)}" placeholder="Describe the step" ${dis}><span class="small" style="display:flex;align-items:center;gap:8px"><button class="switch" type="button" role="switch" id="tpa-${i}" data-action="tpl-auto" data-i="${i}" aria-checked="${s.auto}" aria-label="Step ${i + 1} is automated" ${dis}></button>${s.auto ? 'Automated (runs without staff time)' : 'Manual'}</span></div>
    <span class="acts">${ed ? `<button class="icon-btn" type="button" id="tpu-${i}" data-action="tpl-move" data-i="${i}" data-d="-1" aria-label="Move step ${i + 1} up" ${i === 0 ? 'disabled' : ''}>${icon('chevron-left', 16).replace('<svg', '<svg style="transform:rotate(90deg)"')}</button><button class="icon-btn" type="button" id="tpd-${i}" data-action="tpl-move" data-i="${i}" data-d="1" aria-label="Move step ${i + 1} down" ${i === t.steps.length - 1 ? 'disabled' : ''}>${icon('chevron-right', 16).replace('<svg', '<svg style="transform:rotate(90deg)"')}</button><button class="icon-btn" type="button" id="tpr-${i}" data-action="tpl-remove" data-i="${i}" aria-label="Remove step ${i + 1}" ${t.steps.length < 2 ? 'disabled' : ''}>${icon('x', 16)}</button>` : ''}</span></li>`).join('');
  openModal({
    title: t.id ? (ed ? 'Edit template' : 'Template steps') : 'New workflow template', form: ed ? 'template' : null, focus: focusSel || (first ? '#tpl-name' : null),
    body: `<div class="form-grid">${fieldHTML({ id: 'tpl-name', label: 'Template name', value: t.name, full: true })}<div class="field"><span class="label" id="tpl-area-l">Service area</span>${dd('tpl-area', { kind: 'select', labelId: 'tpl-area-l', title: 'Service area', value: t.area, options: areaOpts(), disabled: !ed })}</div><div class="field"><label class="label" for="tpl-sla">Default SLA (days)</label><input class="input num-input" id="tpl-sla" type="number" min="1" max="60" value="${esc(t.sla)}" aria-describedby="tpl-sla-err" ${dis}><p class="err" id="tpl-sla-err" hidden></p></div></div>
      <div class="stack-8"><p class="label">Steps, in order</p><ol class="tpl-steps" aria-label="Template steps">${stepsHTML}</ol>${ed ? `<div><button class="btn btn-ghost btn-sm" type="button" id="tpl-add" data-action="tpl-add">${icon('plus', 16)}Add step</button></div>` : ''}<p class="err" id="tpl-steps-err" hidden></p></div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">${ed ? 'Cancel' : 'Close'}</button>${ed ? `<button class="btn btn-primary" type="submit" id="tpl-save">${t.id ? 'Save template' : 'Create template'}</button>` : ''}`
  });
  if (ed) $$('#tpl-name, #tpl-sla').forEach(i => { if (!i.closest('.field')) return; });
  if (!ed) $$('#modal input').forEach(i => { i.disabled = true; });
  if (!first && focusSel) { const f = $(focusSel); if (f) f.focus(); }
}

/* =========================================================
   Admin · Team & capacity
   ========================================================= */
AVIEWS['admin-team'] = {
  title: 'Team & capacity',
  shell: () => band({ eyebrow: 'Operations', title: 'Team &amp; capacity', sub: 'Who is on which client, how much work they hold, and where there is room.', actions: can('team') ? `<button class="btn btn-primary btn-sm" type="button" data-action="tm-add">${icon('plus', 18)}Add team member</button>` : '', extra: '<div class="kpis k3" data-aregion="tm-stats"></div>' }) + `
    <div class="wrap pcontent">${can('team') ? '' : roNote('team')}
      <section class="card" aria-labelledby="tm-h"><div class="card-head"><div><h2 class="h4" id="tm-h">Staff</h2><p class="small">Workload counts open workflows across every client</p></div></div><div data-aregion="tm-table"></div></section>
      <section class="card" aria-labelledby="cap-h"><div class="card-head"><div><h2 class="h4" id="cap-h">Capacity</h2><p class="small">Most loaded first. Reassign work from anyone over capacity.</p></div></div><div data-aregion="tm-cap"></div></section></div>`,
  update() {
    const act = activeStaff();
    const over = act.filter(([k, t]) => workload(k) > t.capacity).length, slots = sum(act.map(([k, t]) => Math.max(0, t.capacity - workload(k))));
    aSet('tm-stats', kpiRow([
      { label: 'Active staff', value: act.length, foot: 'Go to the staff list', action: 'kpi-scroll', attrs: 'data-target="#tm-h"' },
      { label: 'Over capacity', value: over, foot: over ? 'Reassign work' : 'Nobody is over', action: 'kpi-scroll', attrs: 'data-target="#cap-h"' },
      { label: 'Open slots', value: slots, foot: 'See who has room', action: 'kpi-scroll', attrs: 'data-target="#cap-h"' }
    ]));
    const ed = can('team');
    const capBar = (k, t) => { const l = workload(k), c = t.capacity, o = l > c; return `<div class="cap ${o ? 'over' : ''}"><div class="cap-track" aria-hidden="true"><div class="cap-fill" style="width:${Math.min(100, l / c * 100)}%"></div></div><span>${o ? icon('alert', 14) : ''}${l} of ${c} in use${o ? ` · over by ${l - c}` : l === c ? ' · at capacity' : ` · ${c - l} open`}</span></div>`; };
    aSet('tm-table', `<div class="table-wrap" tabindex="0" role="region" aria-label="Staff table"><table class="data" style="min-width:920px"><thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Assigned clients</th><th scope="col">Workload</th><th scope="col">Capacity</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>${Object.entries(TEAM).map(([k, t]) => {
      const clients = state.firms.filter(f => f.team.includes(k) || f.lead === k);
      return `<tr><td><span class="person"><span class="avatar" aria-hidden="true">${initials(t.name)}</span><span><b>${esc(t.name)}</b><span class="cell-sub" style="display:block">${esc(t.email)}</span></span></span></td><td>${esc(t.role)}<div class="cell-sub">${esc(t.access)}</div></td><td><div class="chips-inline">${clients.map(f => `<span class="mini-chip">${esc(f.name.split(/[ &]/)[0])}</span>`).join('') || '<span class="small">None</span>'}</div></td><td class="tnum">${workload(k)}</td><td>${capBar(k, t)}</td><td>${t.active === false ? '<span class="badge st-blocked">Inactive</span>' : '<span class="badge st-complete">' + icon('check', 12) + 'Active</span>'}</td><td><button class="icon-btn" type="button" id="tmm-${k}" data-action="tm-menu" data-id="${k}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${esc(t.name)}">${icon('more')}</button></td></tr>`;
    }).join('')}</tbody></table></div>`);
    const ranked = act.map(([k, t]) => ({ k, t, l: workload(k) })).sort((a, b) => b.l / b.t.capacity - a.l / a.t.capacity);
    aSet('tm-cap', `<div class="row-list">${ranked.map(({ k, t, l }) => `<div class="row-item" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="avatar" aria-hidden="true">${initials(t.name)}</span><span style="display:grid;gap:6px"><span class="row-title">${esc(t.name)} <span class="small">· ${esc(t.role)}</span></span>${capBar(k, t)}</span>${ed && l ? `<button class="btn btn-ghost btn-sm" type="button" id="tmr-${k}" data-action="tm-reassign" data-id="${k}">Reassign</button>` : ''}</div>`).join('')}</div>`);
  }
};
function openMember(k) {
  const t = k ? TEAM[k] : { name: '', email: '', role: '', access: 'Specialist', capacity: 5 };
  const clients = k ? state.firms.filter(f => f.team.includes(k) || f.lead === k).map(f => f.id) : [];
  state.admin.member = k || null;
  openModal({
    title: k ? `Edit ${esc(t.name)}` : 'Add team member', form: 'member', focus: '#mb-name',
    body: `<div class="form-grid">${fieldHTML({ id: 'mb-name', label: 'Full name', value: t.name })}${fieldHTML({ id: 'mb-email', label: 'Work email', type: 'email', value: t.email })}${fieldHTML({ id: 'mb-role', label: 'Job title', value: t.role, placeholder: 'For example: Records coordinator' })}<div class="field"><span class="label" id="mb-access-l">Admin access</span>${dd('mb-access', { kind: 'select', labelId: 'mb-access-l', title: 'Admin access', value: t.access, options: ACCESS_LEVELS.map(a => ({ value: a, label: a, sub: ROLE_DESC[a] || 'No admin access; works in assigned workflows' })) })}</div><div class="field"><label class="label" for="mb-cap">Capacity (open workflows)</label><input class="input num-input" id="mb-cap" type="number" min="1" max="20" value="${t.capacity}" aria-describedby="mb-cap-err"><p class="err" id="mb-cap-err" hidden></p></div><div class="field full"><span class="label" id="mb-clients-l">Assigned clients <span class="opt">(optional)</span></span>${dd('mb-clients', { kind: 'multi', labelId: 'mb-clients-l', title: 'Clients', placeholder: 'No clients yet', value: clients, options: firmOpts().map(o => ({ ...o, short: o.label.split(/[ &]/)[0] })) })}</div></div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="mb-save">${k ? 'Save changes' : 'Add team member'}</button>`
  });
}
function openReassign(fromKey, wfId) {
  const own = fromKey ? allOpen().filter(w => w.owner === fromKey) : [getWf(wfId)];
  const w0 = own[0];
  state.admin.reassignFrom = fromKey;
  openModal({
    title: fromKey ? `Reassign work from ${esc(TEAM[fromKey].name)}` : `Reassign ${esc(wfId)}`, form: 'reassign-admin', focus: fromKey ? '#ra-wf' : '#ra-to',
    body: `${fromKey ? `<div class="field"><span class="label" id="ra-wf-l">Workflow</span>${dd('ra-wf', { kind: 'combo', labelId: 'ra-wf-l', title: 'Workflow', value: w0.id, options: own.map(w => ({ value: w.id, label: `${w.id} · ${w.title}`, sub: `${firmName(w.firm)} · ${fmtD(w.due)}` })) })}</div>` : `<p>${esc(w0.title)} · ${esc(firmName(w0.firm))}. Currently owned by ${esc(TEAM[w0.owner].name)}.</p><input type="hidden" id="ra-wf-fixed" value="${w0.id}">`}
      <div class="field"><span class="label" id="ra-to-l">New owner</span>${dd('ra-to', { kind: 'combo', labelId: 'ra-to-l', title: 'New owner', placeholder: 'Search staff', value: '', options: staffOpts(firm(w0.firm).team).filter(o => o.value !== w0.owner) })}</div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="ra-save">${icon('users', 18)}Reassign</button>`
  });
}

/* =========================================================
   Admin · Leads (pipeline board + drawer)
   ========================================================= */
AVIEWS['admin-leads'] = {
  title: 'Leads',
  shell: () => band({ eyebrow: 'Growth', title: 'Leads', sub: 'Submissions from the website contact form, by pipeline stage.', actions: `<a class="btn btn-ghost btn-sm" href="#contact" data-focus="#c-name">${icon('arrow-right', 18)}Open the website form</a>`, extra: '<div class="kpis k3" data-aregion="ld-stats"></div>' }) + `
    <div class="wrap pcontent">${can('leads') ? '<p class="small">Drag a card to another stage, or change its stage from the menu on the card. Website submissions appear in New right away.</p>' : roNote('leads')}<div class="board" data-aregion="board" role="list" aria-label="Lead pipeline"></div></div>`,
  mount() { if (state.admin.pendingLead) { const id = state.admin.pendingLead; state.admin.pendingLead = null; setTimeout(() => openLead(id), 0); } },
  update() {
    const L = state.leads;
    aSet('ld-stats', kpiRow([
      { label: 'New this week', value: L.filter(l => (TODAY - startOf(l.created)) / DAY <= 6).length, foot: 'Go to New', action: 'kpi-scroll', attrs: 'data-target="#bc-New"' },
      { label: 'Open pipeline', value: L.filter(l => !['Won', 'Lost'].includes(l.status)).length, foot: 'New through Proposal', action: 'kpi-scroll', attrs: 'data-target="#bc-Contacted"' },
      { label: 'Won', value: L.filter(l => l.status === 'Won').length, foot: 'Ready to convert', action: 'kpi-scroll', attrs: 'data-target="#bc-Won"' }
    ]));
    const ed = can('leads');
    aSet('board', LEAD_STAGES.map(s => {
      const items = L.filter(l => l.status === s);
      return `<section class="bcol" role="listitem" data-stage="${s}" aria-labelledby="bc-${s.replace(/\s/g, '')}"><div class="bcol-head"><h2 class="h4" id="bc-${s.replace(/\s/g, '')}">${s}</h2><span class="count-badge">${items.length}</span></div><div class="bcol-body">${items.length ? items.map(l => `<article class="lcard ${l.isNew ? 'is-new' : ''}" draggable="${ed}" data-lead="${l.id}" aria-labelledby="lc-${l.id}">
          <div><button type="button" class="wf-link" id="lc-${l.id}" data-action="ad-open-lead" data-id="${l.id}">${esc(l.name)}</button><div class="small">${esc(l.firm)}</div></div>
          <div class="lcard-meta"><span class="mini-chip">${esc(l.area)}</span>${relTime(l.created)}</div>
          ${l.followUp ? `<div class="lcard-meta">${icon('calendar', 14)}Follow-up ${esc(fmtDT(l.followUp))}</div>` : ''}${l.convertedFirm ? `<div class="lcard-meta"><span class="badge st-complete">${icon('check', 12)}Converted</span></div>` : ''}
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap"><span class="small">${l.rep ? esc(TEAM[l.rep].name) : 'Unassigned'}</span>${ed ? dd(`lst-${l.id}`, { kind: 'select', size: 'sm', ariaLabel: `Stage for ${l.name}`, title: `Stage for ${l.name}`, value: l.status, options: LEAD_STAGES.map(x => ({ value: x, label: x })), onChange: (v, c, prev) => setLeadStage(l.id, v, prev) }) : `<span class="mini-chip">${esc(l.status)}</span>`}</div></article>`).join('') : '<p class="bcol-empty">No leads in this stage.</p>'}</div></section>`;
    }).join(''));
    L.forEach(l => { l.isNew = false; });
  }
};
function setLeadStage(id, stage, prev) {
  const l = state.leads.find(x => x.id === id); if (!l) return;
  prev = prev || l.status;
  if (prev === stage) return;
  l.status = stage;
  const e = { who: actorName(), text: `Moved from ${prev} to ${stage}.`, at: new Date() };
  l.log.unshift(e);
  audit('Status change', `Moved lead ${l.name} to ${stage}`, l.firm);
  refresh();
  toast(`${l.name} moved to ${stage}.`, { undo: () => { l.status = prev; l.log = l.log.filter(x => x !== e); refresh(); } });
}
function openLead(id) {
  const l = state.leads.find(x => x.id === id); if (!l) return;
  state.leadId = id; state.detailId = null;
  renderLead();
  const root = $('#sheet-root');
  if (!isOpen(root)) openLayer(root, { focus: '#sheet-close', onClose: () => { state.leadId = null; } });
}
function renderLead() {
  const l = state.leads.find(x => x.id === state.leadId), sheet = $('#sheet');
  if (!l) { closeLayer($('#sheet-root')); return; }
  const ed = can('leads'), body = $('.sheet-body', sheet), scroll = body ? body.scrollTop : 0;
  const draft = $('#ln-text') ? $('#ln-text').value : '';
  const won = l.status === 'Won';
  sheet.innerHTML = `<div class="sheet-head on-ink"><div class="sheet-head-top"><div class="stack-8"><p class="eyebrow">${l.id} · Lead</p><h2 class="h3" id="sheet-title">${esc(l.name)}</h2><p class="small">${esc(l.firm)} · Submitted ${esc(fmtDT(l.created))}</p></div><button class="icon-btn" type="button" id="sheet-close" data-action="close-layer" aria-label="Close lead details">${icon('x')}</button></div></div>
    <div class="sheet-body">
      ${ed ? '' : `<div class="sheet-sec">${roNote('leads')}</div>`}
      <section class="sheet-sec" aria-label="Pipeline"><div class="meta-grid">
        <div class="field"><span class="lab" id="ld-stage-l">Stage</span>${dd('ld-stage', { kind: 'select', labelId: 'ld-stage-l', title: 'Stage', value: l.status, disabled: !ed, options: LEAD_STAGES.map(x => ({ value: x, label: x })), onChange: (v, c, prev) => setLeadStage(l.id, v, prev) })}</div>
        <div class="field"><span class="lab" id="ld-rep-l">Assigned representative</span>${dd('ld-rep', { kind: 'combo', labelId: 'ld-rep-l', title: 'Representative', placeholder: 'Unassigned', value: l.rep || '', disabled: !ed, options: staffOpts(), onChange: (v, c, prev) => { l.rep = v; const e = { who: actorName(), text: `Assigned to ${TEAM[v].name}.`, at: new Date() }; l.log.unshift(e); audit('Edit', `Assigned lead ${l.name} to ${TEAM[v].name}`, l.firm); refresh(); toast(`${l.name} assigned to ${TEAM[v].name}.`, { undo: () => { l.rep = prev || null; l.log = l.log.filter(x => x !== e); refresh(); } }); } })}</div>
        <div class="field" style="grid-column:1/-1"><span class="lab" id="ld-fu-l">Follow-up call</span>${dd('ld-fu', { kind: 'datetime', labelId: 'ld-fu-l', title: 'Follow-up call', value: l.followUp, disabled: !ed, min: TODAY, minReason: 'Follow-ups can’t be scheduled in the past.', onChange: (v, c, prev) => { l.followUp = v; const e = { who: actorName(), text: v ? `Scheduled a follow-up for ${fmtDT(v)}.` : 'Cleared the follow-up.', at: new Date() }; l.log.unshift(e); audit('Edit', `${v ? 'Scheduled' : 'Cleared'} follow-up for ${l.name}`, l.firm); refresh(); toast(v ? `Follow-up set for ${fmtDT(v)}.` : 'Follow-up cleared.', { icon: 'calendar', undo: () => { l.followUp = prev || null; l.log = l.log.filter(x => x !== e); refresh(); } }); } })}</div>
      </div></section>
      <section class="sheet-sec" aria-labelledby="ls-h"><h3 class="h4" id="ls-h">Submitted information</h3><dl class="dl-list">${[['Name', l.name], ['Firm', l.firm], ['Email', l.email], ['Phone', l.phone], ['Area', l.area], ['Bottleneck', l.msg || 'Not provided']].map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}${k === 'Email' ? ` <button class="text-btn" type="button" data-action="copy-text" data-text="${esc(v)}">Copy</button>` : ''}</dd></div>`).join('')}</dl></section>
      <section class="sheet-sec" aria-labelledby="lnn-h"><h3 class="h4" id="lnn-h">Notes</h3>${ed ? `<form class="stack-8" data-form="lead-note" novalidate><label class="sr-only" for="ln-text">Add a note</label><textarea class="textarea" id="ln-text" aria-describedby="ln-text-err" placeholder="What did you learn on the call?">${esc(draft)}</textarea><p class="err" id="ln-text-err" hidden></p><div><button class="btn btn-dark btn-sm" type="submit" id="ln-submit">Add note</button></div></form>` : ''}<ol class="log">${l.notes.length ? l.notes.map(n => `<li class="comment"><span class="avatar" aria-hidden="true">${initials(n.who)}</span><div><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="who">${esc(n.who)}</span><span class="when">${relTime(n.at)}</span></div><p class="txt">${esc(n.text)}</p></div></li>`).join('') : '<li class="small" style="display:block">No notes yet.</li>'}</ol></section>
      <section class="sheet-sec" aria-labelledby="lla-h"><h3 class="h4" id="lla-h">Activity</h3><ol class="log">${l.log.map(e => `<li><span class="avatar ${e.sys ? 'sys' : ''}" aria-hidden="true">${e.sys ? icon('inbox', 14) : initials(e.who)}</span><div><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="who">${esc(e.who)}</span><span class="when">${relTime(e.at)}</span></div><p class="txt">${esc(e.text)}</p></div></li>`).join('')}</ol></section>
    </div>
    <div class="sheet-foot">${l.convertedFirm ? `<span class="badge st-complete" style="height:32px">${icon('check', 14)}Converted to ${esc(firmName(l.convertedFirm))}</span><button class="btn btn-dark" type="button" data-action="ad-open-firm" data-id="${l.convertedFirm}">Open client firm</button>` : `<span class="small" id="conv-hint">${won ? (can('clients') ? 'Ready to convert into a client firm.' : 'Converting needs “Manage client firms”.') : 'Move the lead to Won to convert it.'}</span><button class="btn btn-primary" type="button" id="ld-convert" data-action="ad-convert-lead" data-id="${l.id}" ${won && can('clients') ? '' : 'disabled'} aria-describedby="conv-hint">Convert to client</button>`}</div>`;
  const nb = $('.sheet-body', sheet); if (nb) nb.scrollTop = scroll;
}

/* =========================================================
   Admin · Website content
   ========================================================= */
const CE_GROUPS = [
  ['Hero', [['hero.line', 'Headline'], ['hero.accent', 'Italic second line'], ['hero.sub', 'Positioning sentence', true]]],
  ['Three pillars', [0, 1, 2].map(i => [[`p${i}.title`, `Pillar ${i + 1} title`], [`p${i}.tag`, 'Tagline'], [`p${i}.text`, 'Description', true]])],
  ['Six service areas', [0, 1, 2, 3, 4, 5].map(i => [[`a${i}.title`, `0${i + 1} title`], [`a${i}.text`, 'Description', true]])],
  ['Proof of execution stats', [0, 1, 2].map(i => [[`s${i}.fig`, `Stat ${i + 1} figure`], [`s${i}.label`, 'Label']])],
  ['Contact representative', [['rep.name', 'Name'], ['rep.email', 'Email'], ['rep.phone', 'Phone']]]
];
const ceId = k => 'ce-' + k.replace('.', '-');
function ceField([k, label, long]) {
  const v = state.contentDraft[k], dis = can('content') ? '' : 'disabled';
  return `<div class="field"><label class="label" for="${ceId(k)}">${label}</label>${long ? `<textarea class="textarea" id="${ceId(k)}" data-ck="${k}" rows="3" aria-describedby="${ceId(k)}-err" ${dis}>${esc(v)}</textarea>` : `<input class="input" id="${ceId(k)}" data-ck="${k}" value="${esc(v)}" aria-describedby="${ceId(k)}-err" ${dis}>`}<p class="err" id="${ceId(k)}-err" hidden></p></div>`;
}
AVIEWS['admin-content'] = {
  title: 'Website content',
  shell: () => band({ eyebrow: 'Website', title: 'Website content', sub: 'Edit the marketing site’s key copy. Publishing updates the website right away.', actions: `<a class="btn btn-ghost btn-sm" href="#home">${icon('eye', 18)}View website</a>` }) + `
    <div class="wrap pcontent">${can('content') ? '' : roNote('content')}
      <div class="ce"><section class="card" aria-label="Content editor"><div class="ce-bar" data-aregion="ce-bar"></div>
        <form class="ce-form" data-form="content" novalidate>
          <div style="padding:16px 24px 0"><p class="legal-note callout" style="margin:0">${icon('file', 18)}<span>Use approved Legal Support brochure copy. New claims, statistics or client names need approval before they go live.</span></p></div>
          ${CE_GROUPS.map(([g, items]) => `<fieldset><legend>${g}</legend>${items.map(it => Array.isArray(it[0]) ? `<div class="ce-sub"><b>${esc(it[0][1])}</b>${it.map(ceField).join('')}</div>` : ceField(it)).join('')}</fieldset>`).join('')}
        </form></section>
        <aside class="ce-preview" aria-label="Live preview"><p class="eyebrow" style="margin-bottom:12px">Live preview</p><div data-aregion="ce-preview" aria-live="off"></div></aside></div></div>`,
  update() { ceBar(); cePreview(); }
};
function ceBar() {
  const dirty = contentDirty(), ed = can('content');
  aSet('ce-bar', `<span class="state" aria-live="polite">${dirty ? `<span class="badge st-review">${icon('eye', 12)}Unsaved changes</span>` : `<span class="badge st-complete">${icon('check', 12)}Published</span><span class="small">Last published ${relTime(state.contentPublishedAt)}</span>`}</span><button class="btn btn-ghost btn-sm" type="button" id="ce-discard" data-action="ce-discard" ${dirty && ed ? '' : 'disabled'}>Discard changes</button><button class="btn btn-primary btn-sm" type="button" id="ce-publish" data-action="ce-publish" ${dirty && ed ? '' : 'disabled'}>Publish</button>`);
}
function cePreview() {
  const C = state.contentDraft, e = k => esc(C[k]);
  aSet('ce-preview', `<div class="cp"><div class="cp-hero"><p class="eyebrow">Managed operations for midsize law firms</p><h3>${e('hero.line')} <span class="accent-line">${e('hero.accent')}</span></h3><p>${e('hero.sub')}</p></div><div class="sigbar"></div>
    <div class="cp-sec"><h4>How Hyacinth works</h4><div class="cp-3">${[0, 1, 2].map(i => `<div><b>${e(`p${i}.title`)}</b><p><em>${e(`p${i}.tag`)}</em> ${e(`p${i}.text`)}</p></div>`).join('')}</div></div>
    <div class="cp-sec" style="background:var(--white)"><h4>Operating model</h4><div class="cp-3">${[0, 1, 2, 3, 4, 5].map(i => `<div><span class="cp-num">0${i + 1}</span><b>${e(`a${i}.title`)}</b><p>${e(`a${i}.text`)}</p></div>`).join('')}</div></div>
    <div class="cp-sec cp-stats"><h4>Proof of execution</h4><div class="cp-3">${[0, 1, 2].map(i => `<div><span class="fig">${e(`s${i}.fig`)}</span><p>${e(`s${i}.label`)}</p></div>`).join('')}</div></div>
    <div class="cp-sec"><h4>Contact representative</h4><p><b>${e('rep.name')}</b> · ${e('rep.email')} · ${e('rep.phone')}</p></div></div>`);
}

/* =========================================================
   Admin · Users & roles
   ========================================================= */
AVIEWS['admin-users'] = {
  title: 'Users & roles',
  shell() {
    const u = state.admin.users;
    return band({ eyebrow: 'Governance', title: 'Users &amp; roles', sub: 'Portal users at client firms and staff users at Hyacinth, plus what each staff role can do.', actions: can('users') ? `<button class="btn btn-primary btn-sm" type="button" data-action="us-invite">${icon('plus', 18)}Invite user</button>` : '', extra: '<div class="kpis k3" data-aregion="us-stats"></div>' }) + `
    <div class="wrap pcontent">${can('users') ? '' : roNote('users')}
      <section class="card" aria-labelledby="us-h"><div class="card-head"><h2 class="h4" id="us-h">Users</h2><div class="card-tools"><div class="seg" role="group" aria-label="User type">${[['all', 'All'], ['Staff', 'Staff'], ['Client', 'Client users']].map(([k, l]) => `<button type="button" id="ust-${k}" data-action="us-tab" data-tab="${k}" aria-pressed="${u.tab === k}">${l}</button>`).join('')}</div><div class="search-field" style="min-width:220px">${icon('search', 18)}<label class="sr-only" for="us-q">Search users</label><input class="input" id="us-q" type="search" data-input="us-q" placeholder="Name, email or firm" value="${esc(u.q)}" style="min-height:40px"></div></div></div><div data-aregion="us-table"></div></section>
      <section class="card" aria-labelledby="pm-h"><div class="card-head"><div><h2 class="h4" id="pm-h">Roles and permissions</h2><p class="small">${can('perms') ? 'Changes apply to the role switcher in the header right away.' : 'Only roles with “Edit roles and permissions” can change this matrix.'}</p></div></div><div data-aregion="pm-matrix"></div></section></div>`;
  },
  update() {
    const U = state.users, u = state.admin.users, q = u.q.trim().toLowerCase();
    aSet('us-stats', kpiRow(['Active', 'Invited', 'Disabled'].map(st => ({ label: `${st} users`, value: U.filter(x => x.status === st).length, foot: u.status === st ? 'Showing only these · Show all' : `Show only ${st.toLowerCase()}`, action: 'kpi-us', attrs: `data-s="${st}"`, id: `ku-${st}`, pressed: u.status === st }))));
    ['all', 'Staff', 'Client'].forEach(k => { const b = $('#ust-' + k); if (b) b.setAttribute('aria-pressed', String(u.tab === k)); });
    const list = U.filter(x => (u.tab === 'all' || x.type === u.tab) && (!u.status || u.status === 'all' || x.status === u.status) && (!q || [x.name, x.email, x.firm ? firmName(x.firm) : 'Hyacinth'].join(' ').toLowerCase().includes(q)));
    const sb = s => s === 'Active' ? `<span class="badge st-complete">${icon('check', 12)}Active</span>` : s === 'Invited' ? `<span class="badge st-review">${icon('clock', 12)}Invited</span>` : `<span class="badge st-blocked">${icon('block', 12)}Disabled</span>`;
    aSet('us-table', list.length ? `<div class="table-wrap" tabindex="0" role="region" aria-label="Users table"><table class="data" style="min-width:900px"><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Role</th><th scope="col">Firm</th><th scope="col">Last active</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>${list.map(x => `<tr><td><span class="person"><span class="avatar" aria-hidden="true">${initials(x.name)}</span><span><b>${esc(x.name)}</b><span class="cell-sub" style="display:block">${esc(x.email)}</span></span></span></td><td>${x.type === 'Staff' ? 'Staff' : 'Client'}</td><td>${esc(x.role)}</td><td>${x.firm ? esc(firmName(x.firm)) : 'Hyacinth'}</td><td>${x.last ? relTime(x.last) : '<span class="small">Never signed in</span>'}</td><td>${sb(x.status)}</td><td>${can('users') ? `<button class="icon-btn" type="button" id="usm-${x.id}" data-action="us-menu" data-id="${x.id}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${esc(x.name)}">${icon('more')}</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
      : emptyState({ ic: 'search', title: 'No users match', text: 'Try another search or user type.', actions: '<button class="btn btn-dark btn-sm" type="button" data-action="us-clear">Show all users</button>' }));
    const edit = can('perms');
    aSet('pm-matrix', `<div class="table-wrap" tabindex="0" role="region" aria-label="Permissions matrix" style="border-top:0"><table class="matrix"><caption class="sr-only">Features by role. Checked means the role can use the feature.</caption><thead><tr><th scope="col">Feature</th>${ROLES.map(r => `<th scope="col">${r}${r === state.admin.role ? '<br><span class="small" style="text-transform:none;letter-spacing:0">(current)</span>' : ''}</th>`).join('')}</tr></thead><tbody>${FEATURES.map(([f, l]) => `<tr><th scope="row" style="font-weight:500">${esc(l)}</th>${ROLES.map(r => { const locked = r === 'Super Admin' && f === 'perms'; return `<td><input type="checkbox" class="cbox" id="pm-${r.replace(/\s/g, '')}-${f}" data-change="perm" data-role="${r}" data-f="${f}" ${state.perms[r][f] ? 'checked' : ''} ${!edit || locked ? 'disabled' : ''} aria-label="${esc(l)} for ${r}${locked ? ' (always on)' : ''}"></td>`; }).join('')}</tr>`).join('')}</tbody></table></div>`);
  }
};
function openInvite() {
  state.admin.inv = { type: 'Client' };
  openModal({
    title: 'Invite user', form: 'invite', focus: '#iv-email',
    body: `<div class="form-grid">${fieldHTML({ id: 'iv-name', label: 'Full name', opt: true })}${fieldHTML({ id: 'iv-email', label: 'Email', type: 'email' })}<div class="field"><span class="label" id="iv-type-l">User type</span>${dd('iv-type', { kind: 'select', labelId: 'iv-type-l', title: 'User type', value: 'Client', options: [{ value: 'Client', label: 'Client user', sub: 'Signs in to the client portal' }, { value: 'Staff', label: 'Staff user', sub: 'Signs in to admin' }], onChange: v => { state.admin.inv.type = v; invDyn(); } })}</div><div class="field" id="iv-dyn-role"></div><div class="field full" id="iv-dyn-firm"></div></div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="iv-send">${icon('send', 18)}Send invite</button>`
  });
  invDyn();
}
function invDyn() {
  const t = state.admin.inv.type;
  $('#iv-dyn-role').innerHTML = `<span class="label" id="iv-role-l">Role</span>${dd('iv-role', { kind: 'select', labelId: 'iv-role-l', title: 'Role', value: t === 'Staff' ? 'Team Lead' : 'Firm member', options: (t === 'Staff' ? ROLES : ['Firm admin', 'Firm member']).map(r => ({ value: r, label: r, sub: ROLE_DESC[r] || (r === 'Firm admin' ? 'Manages the firm’s portal users' : 'Sees workflows, deadlines and reports') })) })}`;
  $('#iv-dyn-firm').innerHTML = t === 'Client' ? `<span class="label" id="iv-firm-l">Firm</span>${dd('iv-firm', { kind: 'combo', labelId: 'iv-firm-l', title: 'Firm', placeholder: 'Search client firms', value: '', options: firmOpts() })}` : '<p class="small">Staff users join Hyacinth, not a client firm.</p>';
}

/* =========================================================
   Admin · Audit log
   ========================================================= */
AVIEWS['admin-audit'] = {
  title: 'Audit log',
  shell() {
    if (!can('audit')) return band({ eyebrow: 'Governance', title: 'Audit log', sub: 'A record of every admin action.' }) + `<div class="wrap pcontent"><section class="card">${emptyState({ ic: 'shield', title: `The audit log is off for ${esc(state.admin.role)}`, text: '“View the audit log” is turned off for this role in Users & roles. Switch role to review it.', actions: '<button class="btn btn-dark btn-sm" type="button" data-action="focus-role">Switch role</button><a class="btn btn-ghost btn-sm" href="#admin-users">Users &amp; roles</a>' })}</section></div>`;
    const a = state.admin.audit, users = [...new Set(state.audit.map(x => x.user))];
    return band({ eyebrow: 'Governance', title: 'Audit log', sub: 'Every admin action in this session: creates, edits, status changes, publishing and role changes.', actions: can('export') ? `<button class="btn btn-primary btn-sm" type="button" id="au-export" data-action="au-export">${icon('export', 18)}Export CSV</button>` : '', extra: '<div class="kpis k3" data-aregion="au-stats"></div>' }) + `
    <div class="wrap pcontent"><section class="card" aria-label="Audit entries"><div class="filters">
      <div class="field"><span class="flabel" id="au-user-l">User</span>${dd('au-user', { kind: 'combo', labelId: 'au-user-l', title: 'User', value: a.user, options: [{ value: 'all', label: 'All users' }].concat(users.map(x => ({ value: x, label: x }))), onChange: v => { a.user = v; auTable(); } })}</div>
      <div class="field"><span class="flabel" id="au-type-l">Action type</span>${dd('au-type', { kind: 'multi', labelId: 'au-type-l', title: 'Action types', placeholder: 'All actions', value: a.types, options: AUDIT_TYPES.map(t => ({ value: t, label: t })), onChange: v => { a.types = v; auTable(); } })}</div>
      <div class="field wide"><span class="flabel" id="au-range-l">Date range</span>${dd('au-range', { kind: 'range', labelId: 'au-range-l', title: 'Date range', placeholder: 'All dates', value: a.range, max: TODAY, maxReason: 'The audit log has no future entries.', onChange: v => { a.range = v; auTable(); } })}</div>
      <div class="field"><span class="flabel" aria-hidden="true">&nbsp;</span><button class="btn btn-quiet" type="button" id="au-clear" data-action="au-clear">Clear filters</button></div>
    </div><div data-aregion="au-table"></div></section></div>`;
  },
  update() { if (!can('audit')) return; const ar = state.admin.audit.range, isToday = !!(ar && sameDay(ar.start, TODAY) && sameDay(ar.end, TODAY)); aSet('au-stats', kpiRow([
      { label: 'Entries', value: state.audit.length, foot: 'Show every entry', action: 'kpi-au', attrs: 'data-k="all"', id: 'kau-all' },
      { label: 'Today', value: state.audit.filter(x => sameDay(x.at, new Date())).length, foot: isToday ? 'Showing today' : 'Show today only', action: 'kpi-au', attrs: 'data-k="today"', id: 'kau-today', pressed: isToday },
      { label: 'People and systems', value: new Set(state.audit.map(x => x.user)).size, foot: 'Filter by user', action: 'kpi-au', attrs: 'data-k="people"', id: 'kau-people' }
    ])); auTable(); }
};
function auFiltered() {
  const a = state.admin.audit;
  return state.audit.filter(x => (a.user === 'all' || x.user === a.user) && (!a.types.length || a.types.includes(x.type)) && (!a.range || (startOf(x.at) >= startOf(a.range.start) && startOf(x.at) <= startOf(a.range.end))));
}
function auTable() {
  const list = auFiltered(), a = state.admin.audit;
  const c = $('#au-clear'); if (c) c.disabled = !(a.user !== 'all' || a.types.length || a.range);
  aSet('au-table', list.length ? `<div class="table-wrap" tabindex="0" role="region" aria-label="Audit log table"><table class="data" style="min-width:880px"><thead><tr><th scope="col">When</th><th scope="col">User</th><th scope="col">Action</th><th scope="col">Type</th><th scope="col">Target</th></tr></thead><tbody>${list.map(x => `<tr><td style="white-space:nowrap">${esc(fmtDT(x.at))}<div class="cell-sub">${relTime(x.at)}</div></td><td><b>${esc(x.user)}</b><div class="cell-sub">${esc(x.role)}</div></td><td style="min-width:240px">${esc(x.action)}</td><td><span class="mini-chip">${esc(x.type)}</span></td><td>${esc(x.target)}</td></tr>`).join('')}</tbody></table></div><div class="result-bar"><span aria-live="polite">Showing ${list.length} of ${state.audit.length} entries</span><span>Times in ${TZS[tzKey()].name}</span></div>`
    : emptyState({ ic: 'search', title: 'No entries match', text: 'Try another user, action type or date range.', actions: '<button class="btn btn-dark btn-sm" type="button" data-action="au-clear">Clear filters</button>' }));
}

/* =========================================================
   Admin · Settings
   ========================================================= */
const TIME_OPTS = Array.from({ length: 96 }, (_, i) => { const h = Math.floor(i / 4), m = (i % 4) * 15; return { value: `${h}:${String(m).padStart(2, '0')}`, label: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }; });
const NOTIFY_EVENTS = [['lead', 'New lead from the website'], ['risk', 'Workflow or deadline at risk'], ['publish', 'Website content published'], ['invite', 'User invite accepted'], ['digest', 'Daily operations digest']];
AVIEWS['admin-settings'] = {
  title: 'Settings',
  shell() {
    const S = state.settings, ed = can('settings'), dis = ed ? '' : 'disabled';
    return band({ eyebrow: 'Governance', title: 'Settings', sub: 'Organization details, hours, service levels, notifications and data export.' }) + `
    <div class="wrap pcontent">${ed ? '' : roNote('settings')}<div class="two-col">
      <div class="stack-24">
        <section class="card" aria-labelledby="so-h"><div class="card-head"><h2 class="h4" id="so-h">Organization profile</h2></div><form class="card-body" data-form="set-org" novalidate><div class="form-grid">${fieldHTML({ id: 'so-name', label: 'Organization name', value: S.org.name, full: true })}${fieldHTML({ id: 'so-web', label: 'Website', value: S.org.website })}${fieldHTML({ id: 'so-phone', label: 'Main phone', type: 'tel', value: S.org.phone })}${fieldHTML({ id: 'so-addr', label: 'Address', value: S.org.address, full: true })}${ed ? '<div class="full form-actions"><span class="small">Shown on invoices and staff emails.</span><button class="btn btn-dark" type="submit" id="so-save">Save profile</button></div>' : ''}</div></form></section>
        <section class="card" aria-labelledby="sh-h"><div class="card-head"><div><h2 class="h4" id="sh-h">Business hours and time zone</h2><p class="small">Every date-time in the website, portal and admin follows this time zone.</p></div></div><form class="card-body" data-form="set-hours" novalidate><div class="form-grid">
          <div class="field full"><span class="label" id="sh-days-l">Working days</span>${dd('sh-days', { kind: 'multi', labelId: 'sh-days-l', title: 'Working days', value: [...S.days], maxChips: 7, disabled: !ed, options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ value: d, label: d })) })}</div>
          <div class="field"><span class="label" id="sh-open-l">Opens</span>${dd('sh-open', { kind: 'select', labelId: 'sh-open-l', title: 'Opens', value: S.open, disabled: !ed, options: TIME_OPTS })}</div>
          <div class="field"><span class="label" id="sh-close-l">Closes</span>${dd('sh-close', { kind: 'select', labelId: 'sh-close-l', title: 'Closes', value: S.close, disabled: !ed, options: TIME_OPTS })}</div>
          <div class="field full"><span class="label" id="sh-tz-l">Time zone</span>${dd('sh-tz', { kind: 'select', labelId: 'sh-tz-l', title: 'Time zone', value: S.tz, disabled: !ed, options: Object.entries(TZS).map(([k, v]) => ({ value: k, label: `${v.name} (${k})`, sub: v.id })), onChange: () => { const p = $('#tz-preview'); if (p) p.textContent = tzExample(ddVal('sh-tz')); } })}<p class="hint" id="tz-preview">${esc(tzExample(S.tz))}</p></div>
          ${ed ? '<div class="full form-actions"><span class="small">Saving applies everywhere right away.</span><button class="btn btn-dark" type="submit" id="sh-save">Save hours</button></div>' : ''}</div></form></section>
        <section class="card" aria-labelledby="ss-h"><div class="card-head"><div><h2 class="h4" id="ss-h">SLA defaults by service area</h2><p class="small">New workflows get a due date this many days out unless someone sets one.</p></div></div><form class="card-body stack-16" data-form="set-sla" novalidate><div class="sla-grid">${Object.entries(AREAS).map(([k, v]) => `<div class="field"><label class="label" for="sla-${k}">${esc(v)}</label><input class="input num-input" id="sla-${k}" type="number" min="1" max="30" value="${S.sla[k]}" aria-describedby="sla-${k}-err" ${dis}><p class="err" id="sla-${k}-err" hidden></p></div>`).join('')}</div>${ed ? '<div class="form-actions"><span class="small">Days, 1 to 30.</span><button class="btn btn-dark" type="submit" id="ss-save">Save SLA defaults</button></div>' : ''}</form></section>
      </div>
      <div class="stack-24">
        <section class="card" aria-labelledby="sn-h"><div class="card-head"><div><h2 class="h4" id="sn-h">Notification preferences</h2><p class="small">Each switch saves as you change it.</p></div></div><div class="table-wrap" style="border-top:0"><table class="notify-table"><thead><tr><th scope="col">Event</th><th scope="col" class="c">Email</th><th scope="col" class="c">In-app</th></tr></thead><tbody>${NOTIFY_EVENTS.map(([k, l]) => `<tr><th scope="row" style="font-weight:500" id="nt-${k}">${esc(l)}</th>${['email', 'app'].map(ch => `<td class="c"><button class="switch" type="button" role="switch" id="nt-${k}-${ch}" data-action="set-notify" data-k="${k}" data-ch="${ch}" aria-checked="${S.notify[k][ch]}" aria-label="${esc(l)}, ${ch === 'email' ? 'email' : 'in-app'}" ${dis}></button></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
        <section class="card" aria-labelledby="se-h"><div class="card-head"><div><h2 class="h4" id="se-h">Data export</h2><p class="small">CSV files of the shared demo data.</p></div></div><div class="card-body stack-8">${can('export') ? [['clients', 'Client firms'], ['workflows', 'Workflows'], ['leads', 'Leads'], ['audit', 'Audit log']].map(([k, l]) => `<button class="btn btn-ghost btn-block" type="button" id="ex-${k}" data-action="set-export" data-k="${k}" style="justify-content:space-between">${l}${icon('export', 18)}</button>`).join('') : roNote('export')}</div></section>
      </div></div></div>`;
  }
};
const tzExample = k => { const d = new Date(); return `Example: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZS[k].id })} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZS[k].id })} ${k}`; };
function exportData(k) {
  const W = state.workflows;
  const sets = {
    clients: ['client-firms', [['Firm', 'City', 'Status', 'Primary contact', 'Email', 'Services', 'Team lead', 'Open workflows', 'SLA on time (%)']].concat(state.firms.map(f => [f.name, f.city, f.status, f.contact.name, f.contact.email, f.services.map(s => AREAS[s]).join('; '), TEAM[f.lead].name, firmWfs(f.id).filter(w => w.status !== 'complete').length, slaFor(f.id) == null ? '' : slaFor(f.id).toFixed(1)]))],
    workflows: ['workflows', [['ID', 'Workflow', 'Matter', 'Client', 'Service area', 'Owner', 'Status', 'Due']].concat(W.map(w => [w.id, w.title, w.matter, firmName(w.firm), AREAS[w.area], TEAM[w.owner].name, STATUS[w.status], fmtD(w.due)]))],
    leads: ['leads', [['ID', 'Name', 'Firm', 'Email', 'Phone', 'Area', 'Stage', 'Representative', 'Follow-up', 'Submitted']].concat(state.leads.map(l => [l.id, l.name, l.firm, l.email, l.phone, l.area, l.status, l.rep ? TEAM[l.rep].name : '', l.followUp ? fmtDT(l.followUp) : '', fmtDT(l.created)]))],
    audit: ['audit-log', [['When', 'User', 'Role', 'Type', 'Action', 'Target']].concat((state.admin.view === 'admin-audit' ? auFiltered() : state.audit).map(x => [fmtDT(x.at), x.user, x.role, x.type, x.action, x.target]))]
  };
  const [name, rows] = sets[k];
  audit('Export', `Exported ${name.replace('-', ' ')} CSV`, name.replace('-', ' '));
  openCsv(`Export ${name.replace('-', ' ')}`, `hyacinth-${name}-${iso(TODAY)}.csv`, toCSV(rows));
}

/* =========================================================
   Admin · Design system showcase
   ========================================================= */
AVIEWS['admin-design-system'] = {
  title: 'Design system',
  shell() {
    const v = (id, txt) => `<p class="small" id="dsv-${id}" aria-live="polite">${txt}</p>`;
    const onV = id => (val) => { const el = $('#dsv-' + id); if (el) el.textContent = 'Value: ' + dsFmt(DD.get(id)); };
    const areas = areaOpts();
    const owners = staffOpts();
    const ex = (cap, inner, note) => `<div class="ds-ex"><span class="cap-l">${cap}</span>${inner}${note ? `<p class="ds-note">${note}</p>` : ''}</div>`;
    const lab = (id, t) => `<span class="sr-only" id="${id}-l">${t}</span>`;
    return band({ eyebrow: 'Reference', title: 'Design system', sub: 'Every dropdown and date component, live. These are the same components used on the website, in the client portal and in admin.' }) + `
    <div class="wrap pcontent">
      <section class="card ds-sec" aria-labelledby="ds1"><div class="card-head"><div><h2 class="h4" id="ds1">Select</h2><p class="small">Single choice: status, role, service area. Enter, Space or ↓ opens; type a letter to jump.</p></div></div><div class="card-body ds-grid">
        ${ex('Default', lab('ds-a', 'Service area') + dd('ds-a', { kind: 'select', labelId: 'ds-a-l', title: 'Service area', placeholder: 'Choose an area', value: '', options: areas, onChange: onV('ds-a') }) + v('ds-a', 'Value: none'))}
        ${ex('Hover', lab('ds-b', 'Service area, hover state') + dd('ds-b', { kind: 'select', labelId: 'ds-b-l', title: 'Service area', value: 'lo', options: areas, demo: 'is-hover', onChange: onV('ds-b') }) + v('ds-b', 'Border darkens to Warm Gray.'))}
        ${ex('Focus', lab('ds-c', 'Service area, focus state') + dd('ds-c', { kind: 'select', labelId: 'ds-c-l', title: 'Service area', value: 'fa', options: areas, demo: 'is-focus', onChange: onV('ds-c') }) + v('ds-c', '2px Gold ring with offset.'))}
        ${ex('Open', lab('ds-d', 'Service area, open state') + dd('ds-d', { kind: 'select', labelId: 'ds-d-l', title: 'Service area', value: 'cx', options: areas, onChange: onV('ds-d') }) + `<button class="btn btn-ghost btn-sm" type="button" data-action="ds-open" data-id="ds-d">Show open state</button>`, 'Gold border, chevron rotates, panel flips above when there is no room below.')}
        ${ex('Selected', lab('ds-e', 'Role') + dd('ds-e', { kind: 'select', labelId: 'ds-e-l', title: 'Role', value: 'Team Lead', options: ROLES.map(r => ({ value: r, label: r, sub: ROLE_DESC[r] })), onChange: onV('ds-e') }) + v('ds-e', 'Selected option shows a Gold check.'))}
        ${ex('Disabled', lab('ds-f', 'Service area, disabled') + dd('ds-f', { kind: 'select', labelId: 'ds-f-l', title: 'Service area', value: 'dv', options: areas, disabled: true }) + '<p class="small">Ivory fill, Warm Gray text, not-allowed cursor.</p>')}
        ${ex('Error', lab('ds-g', 'Service area, required') + dd('ds-g', { kind: 'select', labelId: 'ds-g-l', title: 'Service area', placeholder: 'Choose an area', value: '', options: areas, error: 'Choose a service area to continue.', onChange: onV('ds-g') }) + v('ds-g', 'Pick a value to clear the error.'))}
      </div></section>
      <section class="card ds-sec" aria-labelledby="ds2"><div class="card-head"><div><h2 class="h4" id="ds2">Searchable select (combobox)</h2><p class="small">Long lists: firms, owners, team members. Type to filter; matches are highlighted.</p></div></div><div class="card-body ds-grid">
        ${ex('Grouped', lab('ds-h', 'Owner') + dd('ds-h', { kind: 'combo', labelId: 'ds-h-l', title: 'Owner', placeholder: 'Search staff', value: '', options: owners, onChange: onV('ds-h') }) + v('ds-h', 'Value: none'), 'Group headings use the eyebrow style.')}
        ${ex('No results', lab('ds-i', 'Client firm') + dd('ds-i', { kind: 'combo', labelId: 'ds-i-l', title: 'Client firm', placeholder: 'Search firms', value: '', initialQuery: 'zzz', options: firmOpts(), onChange: onV('ds-i') }) + v('ds-i', 'Opens with “zzz” typed to show the no-results state.'))}
        ${ex('Loading', lab('ds-j', 'Team member') + dd('ds-j', { kind: 'combo', labelId: 'ds-j-l', title: 'Team member', placeholder: 'Search staff', value: '', loadMs: 1200, alwaysLoad: true, options: owners, onChange: onV('ds-j') }) + v('ds-j', 'Shows 3 skeleton rows while the list loads.'))}
      </div></section>
      <section class="card ds-sec" aria-labelledby="ds3"><div class="card-head"><div><h2 class="h4" id="ds3">Multi-select, action menu, status dropdown</h2><p class="small">Filters use multi-select; row actions use the action menu; tables change status with the status dropdown.</p></div></div><div class="card-body ds-grid">
        ${ex('Multi-select with overflow', lab('ds-k', 'Services') + dd('ds-k', { kind: 'multi', labelId: 'ds-k-l', title: 'Services', placeholder: 'Any service', value: ['cx', 'lo', 'fa', 'dv'], options: areas.map(o => ({ ...o, short: o.label.split(' ')[0] })), onChange: onV('ds-k') }) + v('ds-k', 'Chips are removable; extras collapse into “+2”.'))}
        ${ex('Multi-select, empty', lab('ds-l', 'Statuses') + dd('ds-l', { kind: 'multi', labelId: 'ds-l-l', title: 'Statuses', placeholder: 'All statuses', value: [], options: STATUS_OPTS(), onChange: onV('ds-l') }) + v('ds-l', 'Select all and Clear sit at the top of the panel.'))}
        ${ex('Action menu', `<div><button class="icon-btn" type="button" id="ds-menu" data-action="ds-menu" aria-haspopup="menu" aria-expanded="false" aria-label="Example row actions" style="border:1px solid var(--hairline)">${icon('more')}</button></div>`, 'Icons on every item; the destructive item is last, in Ruby, after a divider.')}
        ${ex('Status dropdown', `<div class="ds-inline">${['on-track', 'at-risk', 'review', 'blocked', 'complete'].map(s => dd('ds-st-' + s, { kind: 'status', size: 'sm', ariaLabel: `Example status ${STATUS[s]}`, title: 'Status', value: s, options: STATUS_OPTS(), onChange: (val) => toast(`Example status set to ${STATUS[val]}.`) })).join('')}</div>`, 'A badge that opens a status list. Color always comes with an icon and a label.')}
      </div></section>
      <section class="card ds-sec" aria-labelledby="ds4"><div class="card-head"><div><h2 class="h4" id="ds4">Date and time</h2><p class="small">Type a date (11/02/2026, 2026-11-02, Nov 2 2026) or pick one. Arrows move by day, PageUp/PageDown by month, Shift+PageUp/PageDown by year.</p></div></div><div class="card-body ds-grid">
        ${ex('Date picker', lab('ds-m', 'Date') + dd('ds-m', { kind: 'date', labelId: 'ds-m-l', title: 'Date', value: null, onChange: onV('ds-m') }) + v('ds-m', 'Value: none'))}
        ${ex('With min date and deadline markers', lab('ds-n', 'Due date') + dd('ds-n', { kind: 'date', labelId: 'ds-n-l', title: 'Due date', value: addDays(3), min: TODAY, minReason: 'Due dates can’t be before today.', markers: dlMarkers(true), onChange: onV('ds-n') }) + v('ds-n', 'Past days are disabled with a tooltip. Ruby dot: at-risk deadline. Gold dot: deadline.'))}
        ${ex('Error', lab('ds-o', 'Date with an error') + dd('ds-o', { kind: 'date', labelId: 'ds-o-l', title: 'Date', value: null, onChange: onV('ds-o') }) + v('ds-o', 'Type “13/45/2026” and leave the field to see the inline error.'))}
        ${ex('Disabled', lab('ds-p', 'Date, disabled') + dd('ds-p', { kind: 'date', labelId: 'ds-p-l', title: 'Date', value: TODAY, disabled: true }) + '<p class="small">Read-only dates keep their formatting.</p>')}
        ${ex('Date range with presets', lab('ds-q', 'Date range') + dd('ds-q', { kind: 'range', labelId: 'ds-q-l', title: 'Date range', placeholder: 'Any date', value: null, onChange: onV('ds-q') }) + v('ds-q', 'Hover previews the range before the second click. Apply commits it.'))}
        ${ex('Date and time', lab('ds-r', 'Scheduled call') + dd('ds-r', { kind: 'datetime', labelId: 'ds-r-l', title: 'Scheduled call', value: at(1, 15, 30), min: TODAY, onChange: onV('ds-r') }) + v('ds-r', `15-minute steps. Times in ${TZS[tzKey()].name}.`))}
        ${ex('Month picker', lab('ds-s', 'Report month') + dd('ds-s', { kind: 'month', labelId: 'ds-s-l', title: 'Report month', value: { y: TODAY.getFullYear(), m: TODAY.getMonth() }, required: true, onChange: onV('ds-s') }) + v('ds-s', '12-month grid with year navigation.'))}
        ${ex('Inline date display', `<ul class="stack-8" style="font-size:var(--fs-14)"><li>Date: <b>${fmtD(TODAY)}</b></li><li>Date and time: <b>${esc(fmtDT(at(0, 15, 30)))}</b></li><li>Range: <b>${fmtRange(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0))}</b></li><li>Relative (hover for full date): ${relTime(new Date(Date.now() - 2 * 3600e3))}</li><li class="ds-inline">${dueChip(addDays(-2))}${dueChip(TODAY)}${dueChip(addDays(2))}${dueChip(addDays(9))}</li></ul>`, 'Due chips: Overdue (Ruby icon), Due today (Gold), Due in 1–3 days (Parchment), Later (neutral). Always with a text label.')}
      </div></section>
    </div>`;
  }
};
function dsFmt(c) {
  const v = c.value;
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return 'none';
  if (c.kind === 'date') return fmtD(v);
  if (c.kind === 'datetime') return fmtDT(v);
  if (c.kind === 'range') return fmtRange(v.start, v.end);
  if (c.kind === 'month') return monthLabel(v);
  if (Array.isArray(v)) return v.map(x => (c.options.find(o => o.value === x) || {}).label || x).join(', ');
  return (c.options.find(o => o.value === v) || {}).label || v;
}

/* =========================================================
   Admin actions, forms and change handlers
   ========================================================= */
function viewAsClient(id) {
  const x = firm(id); if (!x) return;
  state.portalFirm = id; state.viewAs = true;
  state.wf = { ...state.wf, q: '', area: [], owner: 'all', status: 'all' };
  state.rep.loaded = {}; state.rep.idx = 0;
  audit('Access', `Viewed the client portal as ${x.name}`, x.name);
  if (location.hash === '#overview') route({ same: true }); else location.hash = 'overview';
  toast(`Previewing the portal as ${x.name}.`, { icon: 'eye' });
}
function archiveIds(ids) {
  const items = ids.map(id => { const w = getWf(id); return { w, i: state.workflows.indexOf(w) }; }).filter(x => x.w);
  items.forEach(({ w }) => { state.workflows.splice(state.workflows.indexOf(w), 1); state.archived.push(w); });
  state.admin.sel.clear();
  audit('Delete', `Archived ${items.length} ${items.length === 1 ? 'workflow' : 'workflows'}`, items.map(x => x.w.id).join(', '));
  refresh();
  const t = $('#view-title'); if (t) t.focus({ preventScroll: true });
  toast(`${items.length} ${items.length === 1 ? 'workflow' : 'workflows'} archived.`, { icon: 'archive', undo: () => { items.sort((a, b) => a.i - b.i).forEach(({ w, i }) => { state.archived = state.archived.filter(x => x !== w); state.workflows.splice(Math.min(i, state.workflows.length), 0, w); }); refresh(); } });
}
Object.assign(ACTIONS, {
  'profile-menu': btn => openMenu(btn, [
    { label: 'Account & preferences', icon: 'user', fn: () => { location.hash = 'account'; } },
    { label: 'Help & support', icon: 'help', fn: () => { location.hash = 'help'; } },
    { label: 'Switch to website', icon: 'home', fn: () => { location.hash = 'home'; } },
    { sep: true },
    { label: 'Sign out', icon: 'logout', danger: true, fn: () => ACTIONS['sign-out']() }
  ], 'Account menu'),
  'admin-user-menu': btn => openMenu(btn, [
    { label: 'Settings', icon: 'sliders', fn: () => { location.hash = 'admin-settings'; } },
    { label: 'Audit log', icon: 'list', fn: () => { location.hash = 'admin-audit'; } },
    { label: 'Open the client portal', icon: 'eye', fn: () => { location.hash = 'overview'; } },
    { sep: true },
    { label: 'Sign out of admin', icon: 'logout', danger: true, fn: () => confirmDialog({ title: 'Sign out of admin?', body: 'You will need to sign in again to use the admin area.', confirm: 'Sign out' }).then(ok => { if (!ok) return; audit('Access', 'Signed out of admin', 'Admin'); state.admin.signedIn = false; state.admin.pending = state.admin.view; closeAllLayers(); showSurface('admin'); const p = $('#as-pass'); if (p) p.value = ''; $('#signin-title').focus(); toast('Signed out of admin.', { icon: 'logout' }); }) }
  ], 'Staff account menu'),
  'toggle-pw': btn => { const p = $('#as-pass'), on = p.type === 'password'; p.type = on ? 'text' : 'password'; btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', on ? 'Hide password' : 'Show password'); },
  'toggle-keep': btn => { const on = btn.getAttribute('aria-checked') !== 'true'; btn.setAttribute('aria-checked', String(on)); state.admin.keep = on; },
  'open-admin-sidebar': btn => { btn.setAttribute('aria-expanded', 'true'); openLayer($('#admin-sidebar'), { scrim: $('#admin-scrim'), keepMounted: true, onClose: () => btn.setAttribute('aria-expanded', 'false') }); },
  'close-admin-sidebar': () => closeLayer($('#admin-sidebar')),
  'focus-role': () => { const t = $('#role-switch'); if (t) { t.scrollIntoView({ block: 'nearest' }); t.focus(); ddOpen('role-switch'); } },
  'copy-text': btn => {
    const txt = btn.dataset.text || (state.content && state.content[btn.dataset.c]) || '';
    try { navigator.clipboard.writeText(txt).then(() => toast(`Copied ${txt}.`, { icon: 'copy' }), () => toast(`Select and copy: ${txt}`, { icon: 'copy' })); } catch (_) { toast(`Select and copy: ${txt}`, { icon: 'copy' }); }
  },
  'ad-chart-table': () => { state.admin.chartTable = !state.admin.chartTable; const b = $('#ad-chart-table'); b.setAttribute('aria-pressed', String(state.admin.chartTable)); b.lastChild.textContent = state.admin.chartTable ? 'Chart view' : 'Table view'; adChart(); },
  'ad-reassign': btn => openReassign(null, btn.dataset.id),
  'ad-escalate': btn => {
    const w = getWf(btn.dataset.id); if (!w) return;
    const was = !!w.escalated; w.escalated = !was;
    const e = addLog(w, was ? 'Removed the escalation.' : 'Escalated to the engagement lead.');
    audit('Status change', `${was ? 'De-escalated' : 'Escalated'} ${w.id}`, firmName(w.firm));
    refresh();
    toast(was ? `${w.id} is no longer escalated.` : `${w.id} escalated to ${TEAM[firm(w.firm).lead].name}.`, { icon: 'flag', undo: () => { w.escalated = was; removeLog(w, e); refresh(); } });
  },
  'ad-open-lead': btn => { if (state.admin.view !== 'admin-leads') { state.admin.pendingLead = btn.dataset.id; location.hash = 'admin-leads'; } else openLead(btn.dataset.id); },
  'ad-add-firm': () => openFirmWizard('create'),
  'ad-open-firm': btn => { closeLayer($('#sheet-root'), { restoreFocus: false }); state.admin.clientId = btn.dataset.id; if (location.hash !== '#admin-clients') location.hash = 'admin-clients'; else renderAdminView('admin-clients'); },
  'ad-back-clients': () => { state.admin.clientId = null; renderAdminView('admin-clients'); },
  'ad-view-as': btn => viewAsClient(btn.dataset.id),
  'ad-edit-firm': btn => openFirmWizard('edit', firm(btn.dataset.id), +(btn.dataset.step || 1)),
  'ad-pause-firm': btn => {
    const x = firm(btn.dataset.id), pausing = x.status !== 'Paused', prev = x.status;
    confirmDialog({ title: pausing ? `Pause ${x.name}?` : `Reactivate ${x.name}?`, body: pausing ? 'The firm’s portal stays available, but the firm is marked Paused across admin. You can undo this right after.' : 'The firm returns to Active.', confirm: pausing ? 'Pause firm' : 'Reactivate', danger: pausing }).then(ok => { if (ok) setFirmStatus(x.id, pausing ? 'Paused' : 'Active', prev); });
  },
  'ad-convert-lead': btn => {
    const l = state.leads.find(x => x.id === btn.dataset.id); if (!l) return;
    const area = { 'Client Operations': ['cx'], 'Legal Support': ['lo'], 'Business Operations': ['fa'] }[l.area] || [];
    closeLayer($('#sheet-root'), { restoreFocus: false });
    openFirmWizard('create', null, 1, { name: l.firm === 'Firm not provided' ? '' : l.firm, cname: l.name, cemail: l.email, cphone: l.phone, services: area, lead: l.rep || '', leadId: l.id });
  },
  'wiz-back': () => { wizRead(); state.admin.wiz.step--; renderWizard(false); },
  'cl-sort': btn => { const f = state.admin.clients, k = btn.dataset.key; if (f.sort === k) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = k; f.dir = 'asc'; } clientsTable(); const b = $('#clsort-' + k); if (b) b.focus(); },
  'cl-clear': () => { Object.assign(state.admin.clients, { q: '', status: [], services: [] }); const q = $('#cl-q'); if (q) q.value = ''; ddSet('cl-status', []); ddSet('cl-svc', []); clientStats(); clientsTable(); if (q) q.focus(); },
  'cl-stat': btn => { const f = state.admin.clients, k = btn.dataset.k; f.status = k === 'all' || (f.status.length === 1 && f.status[0] === k) ? [] : [k]; ddSet('cl-status', f.status); clientStats(); clientsTable(); const b = $('#clst-' + k); if (b) b.focus(); announce(f.status.length ? `Showing ${k.toLowerCase()} firms` : 'Showing all firms'); },
  'cl-menu': btn => { const x = firm(btn.dataset.id); openMenu(btn, [
    { label: 'Open firm', icon: 'eye', fn: () => { state.admin.clientId = x.id; renderAdminView('admin-clients'); } },
    { label: 'View as client', icon: 'user', fn: () => viewAsClient(x.id) },
    { label: 'Edit firm', icon: 'file', disabled: !can('clients'), fn: () => openFirmWizard('edit', x) },
    { sep: true },
    { label: x.status === 'Paused' ? 'Reactivate firm' : 'Pause firm', icon: x.status === 'Paused' ? 'refresh' : 'block', danger: x.status !== 'Paused', disabled: !can('clients'), fn: () => ACTIONS['ad-pause-firm']({ dataset: { id: x.id } }) }
  ], `Actions for ${x.name}`); },
  'aw-tab': btn => { state.admin.wfTab = btn.dataset.tab; renderAdminView('admin-workflows', { focus: false }); const t = $('#tab-' + state.admin.wfTab); if (t) t.focus(); },
  'aw-sort': btn => { const f = state.admin.wf, k = btn.dataset.key; if (f.sort === k) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = k; f.dir = 'asc'; } awTable(); const b = $('#awsort-' + k); if (b) b.focus(); },
  'aw-clear': () => { Object.assign(state.admin.wf, { q: '', firms: [], areas: [], statuses: [], owner: 'all', due: null }); const q = $('#aw-q'); if (q) q.value = ''; ['aw-firms', 'aw-areas', 'aw-status'].forEach(id => ddSet(id, [])); ddSet('aw-owner', 'all'); ddSet('aw-due', null); awTable(); if (q) q.focus(); },
  'aw-menu': btn => { const w = getWf(btn.dataset.id); openMenu(btn, [
    { label: 'Open details', icon: 'eye', fn: () => openDetail(w.id) },
    { label: 'Reassign owner', icon: 'users', disabled: !can('workflows'), fn: () => openReassign(null, w.id) },
    { label: 'View client firm', icon: 'briefcase', fn: () => ACTIONS['ad-open-firm']({ dataset: { id: w.firm } }) },
    { sep: true },
    { label: 'Archive workflow', icon: 'archive', danger: true, disabled: !can('workflows'), fn: () => confirmDialog({ title: `Archive ${w.id}?`, body: `“${w.title}” will leave active workflows for ${firmName(w.firm)}. You can undo this right after.`, confirm: 'Archive workflow', danger: true }).then(ok => { if (ok) archiveIds([w.id]); }) }
  ], `Actions for ${w.id}`); },
  'bulk-clear': () => { state.admin.sel.clear(); awTable(); const a = $('#aw-all'); if (a) a.focus(); },
  'bulk-reassign': () => openModal({ title: `Reassign ${state.admin.sel.size} workflows`, form: 'bulk-reassign', focus: '#bk-owner', body: `<div class="field"><span class="label" id="bk-owner-l">New owner</span>${dd('bk-owner', { kind: 'combo', labelId: 'bk-owner-l', title: 'New owner', placeholder: 'Search staff', value: '', options: staffOpts() })}</div>`, foot: '<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="bk-go">Reassign</button>' }),
  'bulk-status': () => openModal({ title: `Change status of ${state.admin.sel.size} workflows`, form: 'bulk-status', focus: '#bk-status', body: `<div class="field"><span class="label" id="bk-status-l">New status</span>${dd('bk-status', { kind: 'select', labelId: 'bk-status-l', title: 'Status', placeholder: 'Choose a status', value: '', options: STATUS_OPTS() })}</div>`, foot: '<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="bk-go">Change status</button>' }),
  'bulk-due': () => openModal({ title: `Set due date for ${state.admin.sel.size} workflows`, form: 'bulk-due', focus: '#bk-due', body: `<div class="field"><span class="label" id="bk-due-l">New due date</span>${dd('bk-due', { kind: 'date', labelId: 'bk-due-l', title: 'Due date', value: addDays(7), min: TODAY, minReason: 'Due dates can’t be before today.', required: true, markers: dlMarkers(true) })}</div>`, foot: '<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="bk-go">Set due date</button>' }),
  'bulk-archive': () => { const n = state.admin.sel.size; confirmDialog({ title: `Archive ${n} workflows?`, body: 'They will leave active workflows across all clients. You can undo this right after.', confirm: 'Archive workflows', danger: true }).then(ok => { if (ok) archiveIds([...state.admin.sel]); }); },
  'tpl-new': () => openTemplate(null),
  'tpl-edit': btn => openTemplate(btn.dataset.id),
  'tpl-auto': btn => { tplRead(); const i = +btn.dataset.i; state.admin.tpl.steps[i].auto = !state.admin.tpl.steps[i].auto; renderTemplate(false, `#tpa-${i}`); },
  'tpl-move': btn => { tplRead(); const i = +btn.dataset.i, d = +btn.dataset.d, s = state.admin.tpl.steps; [s[i], s[i + d]] = [s[i + d], s[i]]; renderTemplate(false, `#${d < 0 ? 'tpu' : 'tpd'}-${i + d}`); },
  'tpl-remove': btn => { tplRead(); state.admin.tpl.steps.splice(+btn.dataset.i, 1); renderTemplate(false, '#tpl-add'); announce('Step removed'); },
  'tpl-add': () => { tplRead(); state.admin.tpl.steps.push({ title: '', auto: false }); renderTemplate(false, `#tps-${state.admin.tpl.steps.length - 1}`); },
  'tm-add': () => openMember(null),
  'tm-reassign': btn => openReassign(btn.dataset.id),
  'tm-menu': btn => { const k = btn.dataset.id, t = TEAM[k], ed = can('team'); openMenu(btn, [
    { label: 'Edit team member', icon: 'file', disabled: !ed, fn: () => openMember(k) },
    { label: 'Reassign work', icon: 'users', disabled: !ed || !workload(k), fn: () => openReassign(k) },
    { sep: true },
    t.active === false ? { label: 'Reactivate', icon: 'refresh', disabled: !ed, fn: () => { t.active = true; audit('Status change', `Reactivated ${t.name}`, 'Team'); refresh(); toast(`${t.name} is active again.`); } }
      : { label: 'Deactivate', icon: 'block', danger: true, disabled: !ed, fn: () => confirmDialog({ title: `Deactivate ${t.name}?`, body: `${t.name} will no longer appear in owner and representative lists. Their ${workload(k)} open workflows keep their owner until you reassign them.`, confirm: 'Deactivate', danger: true }).then(ok => { if (!ok) return; t.active = false; audit('Status change', `Deactivated ${t.name}`, 'Team'); refresh(); toast(`${t.name} deactivated.`, { undo: () => { t.active = true; refresh(); } }); }) }
  ], `Actions for ${t.name}`); },
  'ce-discard': () => confirmDialog({ title: 'Discard unpublished changes?', body: 'The editor goes back to the content that is live on the website now.', confirm: 'Discard changes', danger: true }).then(ok => { if (!ok) return; const snap = { ...state.contentDraft }; state.contentDraft = { ...state.content }; renderAdminView('admin-content', { focus: false }); toast('Changes discarded.', { icon: 'refresh', undo: () => { state.contentDraft = snap; renderAdminView('admin-content', { focus: false }); } }); }),
  'ce-publish': btn => {
    const empty = Object.keys(state.contentDraft).find(k => !String(state.contentDraft[k]).trim());
    Object.keys(state.contentDraft).forEach(k => setErr(ceId(k), ''));
    if (empty) { setErr(ceId(empty), 'This field can’t be empty.'); $('#' + ceId(empty)).focus(); return; }
    if (!EMAIL_RE.test(state.contentDraft['rep.email'])) { setErr(ceId('rep.email'), 'Enter an email address in the format name@firm.com.'); $('#' + ceId('rep.email')).focus(); return; }
    withLoading(btn, () => {
      const prev = { ...state.content }, prevAt = state.contentPublishedAt;
      state.content = { ...state.contentDraft }; state.contentPublishedAt = new Date();
      renderSiteContent();
      audit('Publish', 'Published website content', 'Website');
      ceBar(); $('#ce-publish').focus();
      toast('Published. The website is updated.', { action: { label: 'View website', fn: () => { location.hash = 'home'; } } });
      state.lastPublishUndo = () => { state.content = prev; state.contentDraft = { ...prev }; state.contentPublishedAt = prevAt; renderSiteContent(); };
    }, 700);
  },
  'us-tab': btn => { state.admin.users.tab = btn.dataset.tab; AVIEWS['admin-users'].update(); btn.focus(); },
  'us-clear': () => { state.admin.users = { tab: 'all', q: '', status: 'all' }; const q = $('#us-q'); if (q) q.value = ''; AVIEWS['admin-users'].update(); },
  'us-invite': () => openInvite(),
  'us-menu': btn => { const u = state.users.find(x => x.id === btn.dataset.id); openMenu(btn, [
    ...(u.status === 'Invited' ? [{ label: 'Resend invite', icon: 'send', fn: () => { audit('Edit', `Resent invite to ${u.name}`, u.email); refresh(); toast(`Invite resent to ${u.email}.`, { icon: 'send' }); } }] : []),
    { label: 'Reset password', icon: 'refresh', disabled: u.status !== 'Active', fn: () => confirmDialog({ title: `Reset ${u.name}’s password?`, body: `A reset link goes to ${u.email}. Their current password stops working right away.`, confirm: 'Send reset link' }).then(ok => { if (!ok) return; audit('Edit', `Reset password for ${u.name}`, u.email); refresh(); toast(`Reset link sent to ${u.email} (prototype: nothing was sent).`, { icon: 'send' }); }) },
    { sep: true },
    u.status === 'Disabled' ? { label: 'Enable user', icon: 'check', fn: () => { u.status = 'Active'; audit('Status change', `Enabled ${u.name}`, u.email); refresh(); toast(`${u.name} can sign in again.`); } }
      : { label: 'Disable user', icon: 'block', danger: true, fn: () => confirmDialog({ title: `Disable ${u.name}?`, body: 'They will not be able to sign in until you enable them again.', confirm: 'Disable user', danger: true }).then(ok => { if (!ok) return; const prev = u.status; u.status = 'Disabled'; audit('Status change', `Disabled ${u.name}`, u.email); refresh(); toast(`${u.name} disabled.`, { undo: () => { u.status = prev; refresh(); } }); }) }
  ], `Actions for ${u.name}`); },
  'au-clear': () => { state.admin.audit = { user: 'all', types: [], range: null }; ddSet('au-user', 'all'); ddSet('au-type', []); ddSet('au-range', null); auTable(); },
  'au-export': btn => withLoading(btn, () => exportData('audit')),
  'set-notify': btn => { const S = state.settings.notify[btn.dataset.k], ch = btn.dataset.ch; S[ch] = !S[ch]; btn.setAttribute('aria-checked', String(S[ch])); const l = NOTIFY_EVENTS.find(x => x[0] === btn.dataset.k)[1]; audit('Edit', `${S[ch] ? 'Turned on' : 'Turned off'} ${ch === 'email' ? 'email' : 'in-app'} for “${l}”`, 'Notification settings'); toast(`${ch === 'email' ? 'Email' : 'In-app'} notifications for “${l}” ${S[ch] ? 'on' : 'off'}. Saved.`); },
  'set-export': btn => withLoading(btn, () => exportData(btn.dataset.k)),
  'ds-open': btn => { const t = document.getElementById(btn.dataset.id); if (t) { t.focus(); ddOpen(btn.dataset.id); } },
  'ds-menu': btn => openMenu(btn, [{ label: 'Open', icon: 'eye', fn: () => toast('Menu item: Open.') }, { label: 'Duplicate', icon: 'copy', fn: () => toast('Menu item: Duplicate.') }, { label: 'Reassign', icon: 'users', fn: () => toast('Menu item: Reassign.') }, { label: 'Disabled item', icon: 'block', disabled: true }, { sep: true }, { label: 'Delete', icon: 'archive', danger: true, fn: () => toast('Menu item: Delete. Real deletes confirm first and offer Undo.', { icon: 'alert' }) }], 'Example row actions'),
  'exit-viewas': () => { state.viewAs = false; state.portalFirm = 'cw'; state.rep.loaded = {}; location.hash = state.admin.signedIn ? 'admin-clients' : 'overview'; if (!state.admin.signedIn) refresh(); }
});
Object.assign(SUBMITS, {
  'admin-signin': (f, btn) => {
    const email = $('#as-email').value.trim(), pass = $('#as-pass').value;
    const e1 = !email ? 'Enter your work email.' : !EMAIL_RE.test(email) ? 'Enter an email address in the format name@hyacinth.example.' : '';
    const e2 = !pass ? 'Enter your password.' : '';
    setErr('as-email', e1); setErr('as-pass', e2);
    if (e1 || e2) { $(e1 ? '#as-email' : '#as-pass').focus(); return; }
    withLoading(btn, () => {
      const local = email.split('@')[0].split(/[._-]+/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
      Object.assign(state.admin, { signedIn: true, email, name: local || 'Hyacinth staff' });
      audit('Access', 'Signed in to admin', 'Admin');
      showSurface('admin');
      const target = state.admin.pending && AVIEWS[state.admin.pending] ? state.admin.pending : 'admin';
      state.admin.pending = null;
      if (location.hash !== '#' + target) location.hash = target; else renderAdminView(target);
      toast(`Signed in as ${state.admin.name}.`, { icon: 'user' });
    }, 800);
  },
  'firm-wiz': (f, btn) => {
    wizRead();
    if (!wizValidate()) return;
    const w = state.admin.wiz;
    if (w.step < 4) { w.step++; renderWizard(false); return; }
    withLoading(btn, () => {
      const d = w.d;
      if (w.mode === 'edit') {
        const x = firm(w.id);
        Object.assign(x, { name: d.name, city: d.city, status: d.status, services: d.services, since: d.since, lead: d.lead, team: [d.lead, ...d.team.filter(k => k !== d.lead)] });
        Object.assign(x.contact, { name: d.cname, email: d.cemail, phone: d.cphone });
        x.contacts[0] = { ...x.contact, primary: true };
        audit('Edit', `Edited client firm ${x.name}`, x.name);
        closeLayer(modalRoot(), { restoreFocus: false }); refresh();
        toast(`${x.name} saved.`);
        return;
      }
      let id = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 10) || 'firm';
      while (firm(id)) id += 'x';
      const contact = { name: d.cname, title: 'Primary contact', email: d.cemail, phone: d.cphone };
      const x = { id, name: d.name, city: d.city || 'City not set', status: d.status, since: d.since, contact, contacts: [{ ...contact, primary: true }], services: d.services, lead: d.lead, team: [d.lead, ...d.team.filter(k => k !== d.lead)], sla: null, scale: 0.3, notes: [] };
      state.firms.push(x);
      if (w.leadId) { const l = state.leads.find(y => y.id === w.leadId); if (l) { l.convertedFirm = id; l.log.unshift({ who: actorName(), text: `Converted to client firm ${x.name}.`, at: new Date() }); } }
      audit('Create', w.leadId ? `Converted lead to client firm ${x.name}` : `Created client firm ${x.name}`, x.name);
      closeLayer(modalRoot(), { restoreFocus: false });
      state.admin.clients = { q: '', status: [], services: [], sort: 'name', dir: 'asc' };
      if (state.admin.view !== 'admin-clients') location.hash = 'admin-clients'; else refresh();
      toast(`${x.name} added.`, { icon: 'plus', action: { label: 'View as client', fn: () => viewAsClient(id) } });
    }, 700);
  },
  'firm-note': (f, btn) => {
    const ta = $('#fn-text'), v = ta.value.trim();
    if (!v) { setErr('fn-text', 'Write a note before adding it.'); ta.focus(); return; }
    setErr('fn-text', '');
    withLoading(btn, () => { const x = firm(state.admin.clientId); x.notes.unshift({ who: actorName(), text: v, at: new Date() }); audit('Edit', `Added a note to ${x.name}`, x.name); ta.value = ''; clientDetailUpdate(); $('#fn-text').focus(); toast('Note added.'); });
  },
  'firm-contact': (f, btn) => {
    const n = $('#fc-name').value.trim(), e = $('#fc-email').value.trim();
    setErr('fc-name', n.length < 2 ? 'Enter a name.' : ''); setErr('fc-email', EMAIL_RE.test(e) ? '' : 'Enter an email address in the format name@firm.com.');
    if (n.length < 2 || !EMAIL_RE.test(e)) { $(n.length < 2 ? '#fc-name' : '#fc-email').focus(); return; }
    withLoading(btn, () => { const x = firm(state.admin.clientId); x.contacts.push({ name: n, email: e, title: $('#fc-title').value.trim() }); audit('Edit', `Added contact ${n}`, x.name); ['fc-name', 'fc-email', 'fc-title'].forEach(id => { $('#' + id).value = ''; }); clientDetailUpdate(); $('#fc-name').focus(); toast(`${n} added to contacts.`); });
  },
  'reassign-admin': (f, btn) => {
    const id = $('#ra-wf-fixed') ? $('#ra-wf-fixed').value : ddVal('ra-wf'), to = ddVal('ra-to'), w = getWf(id);
    if (!to) { ddError('ra-to', 'Choose who takes over this workflow.'); $('#ra-to').focus(); return; }
    withLoading(btn, () => {
      const prev = w.owner; w.owner = to;
      const e = addLog(w, `Reassigned owner from ${TEAM[prev].name} to ${TEAM[to].name}.`);
      audit('Edit', `Reassigned ${w.id} to ${TEAM[to].name}`, firmName(w.firm));
      closeLayer(modalRoot(), { restoreFocus: true }); refresh();
      toast(`${w.id} reassigned to ${TEAM[to].name}.`, { icon: 'users', undo: () => { w.owner = prev; removeLog(w, e); refresh(); } });
    });
  },
  'bulk-reassign': (f, btn) => { const to = ddVal('bk-owner'); if (!to) { ddError('bk-owner', 'Choose a new owner.'); $('#bk-owner').focus(); return; } withLoading(btn, () => bulkApply(n => `${n} workflows reassigned to ${TEAM[to].name}.`, w => { w.owner = to; }, n => `Reassigned ${n} workflows to ${TEAM[to].name}`)); },
  'bulk-status': (f, btn) => { const s = ddVal('bk-status'); if (!s) { ddError('bk-status', 'Choose a status.'); $('#bk-status').focus(); return; } withLoading(btn, () => bulkApply(n => `${n} workflows set to ${STATUS[s]}.`, w => { w.status = s; w.completedNow = s === 'complete'; w.completedOnTime = s === 'complete' && diffDays(w.due) >= 0; }, n => `Set ${n} workflows to ${STATUS[s]}`)); },
  'bulk-due': (f, btn) => { if (!ddCommitTyped('bk-due')) { $('#bk-due').focus(); return; } const d = ddVal('bk-due'); if (!d) { ddError('bk-due', 'Choose a due date.'); $('#bk-due').focus(); return; } withLoading(btn, () => bulkApply(n => `${n} workflows now due ${fmtD(d)}.`, w => { w.due = d; }, n => `Set due date ${fmtD(d)} on ${n} workflows`)); },
  template: (f, btn) => {
    tplRead();
    const t = state.admin.tpl, sla = +t.sla;
    setErr('tpl-name', t.name.trim().length < 3 ? 'Give the template a name of at least 3 characters.' : '');
    setErr('tpl-sla', sla >= 1 && sla <= 60 ? '' : 'Enter a number of days from 1 to 60.');
    const blank = t.steps.findIndex(s => !s.title.trim());
    const se = $('#tpl-steps-err');
    if (blank >= 0) { se.innerHTML = `${icon('alert', 16)}<span>Describe step ${blank + 1}, or remove it.</span>`; se.hidden = false; } else se.hidden = true;
    if (t.name.trim().length < 3) { $('#tpl-name').focus(); return; }
    if (!(sla >= 1 && sla <= 60)) { $('#tpl-sla').focus(); return; }
    if (blank >= 0) { $('#tps-' + blank).focus(); return; }
    withLoading(btn, () => {
      const data = { name: t.name.trim(), area: t.area, sla, steps: t.steps.map(s => ({ title: s.title.trim(), auto: !!s.auto, review: /review|sign-off/i.test(s.title) })) };
      if (t.id) Object.assign(state.templates.find(x => x.id === t.id), data);
      else state.templates.push({ id: 'tpl' + Date.now().toString(36), ...data });
      audit(t.id ? 'Edit' : 'Create', `${t.id ? 'Edited' : 'Created'} the ${data.name} template`, 'Workflow templates');
      closeLayer(modalRoot(), { restoreFocus: false }); refresh();
      toast(`${data.name} template ${t.id ? 'saved' : 'created'}. It’s available in New workflow.`);
    });
  },
  member: (f, btn) => {
    const n = $('#mb-name').value.trim(), e = $('#mb-email').value.trim(), c = +$('#mb-cap').value;
    setErr('mb-name', n.length < 2 ? 'Enter a full name.' : ''); setErr('mb-email', EMAIL_RE.test(e) ? '' : 'Enter an email address in the format name@hyacinth.example.'); setErr('mb-cap', c >= 1 && c <= 20 ? '' : 'Enter a capacity from 1 to 20.');
    const first = [['mb-name', n.length < 2], ['mb-email', !EMAIL_RE.test(e)], ['mb-cap', !(c >= 1 && c <= 20)]].find(x => x[1]);
    if (first) { $('#' + first[0]).focus(); return; }
    withLoading(btn, () => {
      let k = state.admin.member;
      const data = { name: n, email: e, role: $('#mb-role').value.trim() || 'Specialist', access: ddVal('mb-access'), capacity: c };
      if (k) Object.assign(TEAM[k], data); else { k = n.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'staff'; while (TEAM[k]) k += 'x'; TEAM[k] = { ...data, active: true }; }
      const clients = ddVal('mb-clients') || [];
      state.firms.forEach(x => { const has = x.team.includes(k); if (clients.includes(x.id) && !has) x.team.push(k); if (!clients.includes(x.id) && has && x.lead !== k) x.team = x.team.filter(y => y !== k); });
      audit(state.admin.member ? 'Edit' : 'Create', `${state.admin.member ? 'Edited' : 'Added'} team member ${n}`, 'Team');
      closeLayer(modalRoot(), { restoreFocus: false }); refresh();
      toast(`${n} ${state.admin.member ? 'saved' : 'added to the team'}.`, { icon: 'users' });
    });
  },
  'lead-note': (f, btn) => {
    const ta = $('#ln-text'), v = ta.value.trim();
    if (!v) { setErr('ln-text', 'Write a note before adding it.'); ta.focus(); return; }
    setErr('ln-text', '');
    withLoading(btn, () => { const l = state.leads.find(x => x.id === state.leadId); l.notes.unshift({ who: actorName(), text: v, at: new Date() }); audit('Edit', `Added a note to lead ${l.name}`, l.firm); ta.value = ''; refresh(); $('#ln-text').focus(); toast('Note added.'); });
  },
  invite: (f, btn) => {
    const e = $('#iv-email').value.trim(), t = state.admin.inv.type, fid = ddVal('iv-firm');
    setErr('iv-email', EMAIL_RE.test(e) ? '' : 'Enter an email address in the format name@firm.com.');
    if (!EMAIL_RE.test(e)) { $('#iv-email').focus(); return; }
    if (state.users.some(u => u.email.toLowerCase() === e.toLowerCase())) { setErr('iv-email', 'This person already has an account.'); $('#iv-email').focus(); return; }
    if (t === 'Client' && !fid) { ddError('iv-firm', 'Choose the firm this user belongs to.'); $('#iv-firm').focus(); return; }
    withLoading(btn, () => {
      const name = $('#iv-name').value.trim() || e.split('@')[0];
      state.users.unshift({ id: 'U' + Date.now().toString(36), name, email: e, type: t, role: ddVal('iv-role'), firm: t === 'Client' ? fid : null, last: null, status: 'Invited' });
      audit('Create', `Invited ${name}`, t === 'Client' ? firmName(fid) : 'Hyacinth');
      closeLayer(modalRoot(), { restoreFocus: false }); refresh();
      toast(`Invite sent to ${e} (prototype: nothing was sent).`, { icon: 'send' });
    });
  },
  'set-org': (f, btn) => {
    const n = $('#so-name').value.trim();
    setErr('so-name', n.length < 2 ? 'Enter the organization name.' : ''); if (n.length < 2) { $('#so-name').focus(); return; }
    withLoading(btn, () => { Object.assign(state.settings.org, { name: n, website: $('#so-web').value.trim(), phone: $('#so-phone').value.trim(), address: $('#so-addr').value.trim() }); audit('Edit', 'Updated the organization profile', 'Settings'); toast('Organization profile saved.'); });
  },
  'set-hours': (f, btn) => {
    const days = ddVal('sh-days'), o = ddVal('sh-open'), c = ddVal('sh-close');
    const mins = v => { const [h, m] = v.split(':').map(Number); return h * 60 + m; };
    if (!days.length) { ddError('sh-days', 'Choose at least one working day.'); $('#sh-days').focus(); return; }
    if (mins(c) <= mins(o)) { ddError('sh-close', 'Closing time must be after opening time.'); $('#sh-close').focus(); return; }
    withLoading(btn, () => {
      const prevTz = state.settings.tz;
      Object.assign(state.settings, { days, open: o, close: c, tz: ddVal('sh-tz') });
      audit('Edit', `Updated business hours${prevTz !== state.settings.tz ? ` and time zone to ${state.settings.tz}` : ''}`, 'Settings');
      toast(prevTz !== state.settings.tz ? `Saved. Date-times now show in ${TZS[state.settings.tz].name}.` : 'Business hours saved.');
    });
  },
  'set-sla': (f, btn) => {
    let bad = null;
    Object.keys(AREAS).forEach(k => { const v = +$('#sla-' + k).value, ok = v >= 1 && v <= 30; setErr('sla-' + k, ok ? '' : 'Enter 1 to 30 days.'); if (!ok && !bad) bad = k; });
    if (bad) { $('#sla-' + bad).focus(); return; }
    withLoading(btn, () => { Object.keys(AREAS).forEach(k => { state.settings.sla[k] = +$('#sla-' + k).value; }); audit('Edit', 'Updated SLA defaults', 'Settings'); toast('SLA defaults saved. New workflows use them for their default due date.'); });
  }
});
Object.assign(CHANGES, {
  'aw-sel': el => { const s = state.admin.sel; if (el.checked) s.add(el.dataset.id); else s.delete(el.dataset.id); awTable(); const n = $('#aws-' + el.dataset.id); if (n) n.focus(); },
  'aw-all': el => { const list = awFiltered(); list.forEach(w => { if (el.checked) state.admin.sel.add(w.id); else state.admin.sel.delete(w.id); }); awTable(); const a = $('#aw-all'); if (a) a.focus(); announce(el.checked ? `${list.length} workflows selected` : 'Selection cleared'); },
  perm: el => {
    const r = el.dataset.role, f = el.dataset.f, v = el.checked;
    state.perms[r][f] = v;
    audit('Role change', `${v ? 'Granted' : 'Removed'} “${FEATURE_LABEL[f]}” for ${r}`, 'Roles and permissions');
    const after = () => { if (r === state.admin.role) renderAdminView('admin-users', { focus: false }); else AVIEWS['admin-users'].update(); const n = document.getElementById(el.id); if (n) n.focus(); };
    after();
    toast(`${v ? 'Granted' : 'Removed'} “${FEATURE_LABEL[f]}” for ${r}.`, { icon: 'shield', undo: () => { state.perms[r][f] = !v; after(); } });
  }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset && t.dataset.ck) { state.contentDraft[t.dataset.ck] = t.value; if (t.getAttribute('aria-invalid') === 'true' && t.value.trim()) setErr(t.id, ''); cePreview(); ceBar(); return; }
  const k = t.dataset && t.dataset.input;
  if (k === 'cl-q') { state.admin.clients.q = t.value; clientsTable(); }
  if (k === 'aw-q') { state.admin.wf.q = t.value; awTable(); }
  if (k === 'us-q') { state.admin.users.q = t.value; AVIEWS['admin-users'].update(); }
  if (['as-email', 'as-pass', 'fn-text', 'ln-text', 'fc-name', 'fc-email', 'iv-email', 'mb-name', 'mb-email', 'mb-cap', 'so-name', 'tpl-name', 'tpl-sla', 'wz-name', 'wz-cname', 'wz-cemail'].includes(t.id) && t.getAttribute('aria-invalid') === 'true' && t.value.trim()) setErr(t.id, '');
});
document.addEventListener('keydown', e => {
  const t = e.target;
  if (t.getAttribute && t.getAttribute('role') === 'tab' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    const tabs = $$('[role="tab"]', t.closest('[role="tablist"]')), i = tabs.indexOf(t), n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    e.preventDefault(); n.click();
  }
});
/* Lead board drag and drop (mouse); stage menus cover keyboard and touch */
let dragLead = null;
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.lcard[draggable="true"]'); if (!c) return; dragLead = c.dataset.lead; c.classList.add('is-dragging'); try { e.dataTransfer.setData('text/plain', dragLead); e.dataTransfer.effectAllowed = 'move'; } catch (_) { /* ignore */ } });
document.addEventListener('dragend', e => { const c = e.target.closest && e.target.closest('.lcard'); if (c) c.classList.remove('is-dragging'); $$('.bcol.is-drop').forEach(x => x.classList.remove('is-drop')); dragLead = null; });
document.addEventListener('dragover', e => { const col = e.target.closest && e.target.closest('.bcol'); if (!col || !dragLead) return; e.preventDefault(); $$('.bcol.is-drop').forEach(x => { if (x !== col) x.classList.remove('is-drop'); }); col.classList.add('is-drop'); });
document.addEventListener('drop', e => { const col = e.target.closest && e.target.closest('.bcol'); if (!col || !dragLead) return; e.preventDefault(); col.classList.remove('is-drop'); const id = dragLead; dragLead = null; setLeadStage(id, col.dataset.stage); });
