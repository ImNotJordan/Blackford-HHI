/* Hyacinth Legal Support · Utilities, icons, mock data, state, layers, website, routing, client portal views */
'use strict';
/* =========================================================
   Utilities
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DAY = 864e5;
const startOf = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const TODAY = startOf(new Date());
const addDays = (n, base = TODAY) => { const d = new Date(base); d.setDate(d.getDate() + n); return d; };
const at = (dayOffset, hour = 10, min = 0) => { const d = addDays(dayOffset); d.setHours(hour, min, 0, 0); return d; };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const diffDays = d => Math.round((startOf(d) - TODAY) / DAY);
const fmt = (d, o) => d.toLocaleDateString('en-US', o);
const fmtShort = d => fmt(d, { month: 'short', day: 'numeric', year: 'numeric' });
const fmtAxis = d => fmt(d, { month: 'short', day: 'numeric' });
const fmtDay = d => fmtShort(d);
const fmtLong = d => fmt(d, { weekday: 'long', month: 'long', day: 'numeric' });
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseISO = v => { const [y, m, dd] = v.split('-').map(Number); return new Date(y, m - 1, dd); };
const weekStart = d => addDays(-((d.getDay() + 6) % 7), startOf(d));
const sum = a => a.reduce((x, y) => x + y, 0);
const initials = n => n.split(/\s+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
const relDue = d => {
  const n = diffDays(d);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `Due in ${n} days`;
  if (n === -1) return '1 day overdue';
  return `${-n} days overdue`;
};
const timeAgo = d => {
  const m = Math.round((Date.now() - d) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  return fmtShort(d);
};
const isFramed = (() => { try { return window.self !== window.top; } catch (_) { return true; } })();
/* Viewer-mediated downloads (artifact `downloads` capability); null where unavailable */
let downloadsApi = null;
try { if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(n => { downloadsApi = n || null; }, () => { downloadsApi = null; }); } catch (_) { /* no runtime */ }
const canDownload = () => !!downloadsApi || !isFramed;

/* =========================================================
   Icons (inline SVG, simple line style)
   ========================================================= */
const P = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'chevron-left': '<path d="M15 18l-6-6 6-6"/>',
  'chevron-right': '<path d="M9 18l6-6-6-6"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  flag: '<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
  alert: '<path d="M12 3.5L2.5 20h19L12 3.5z"/><path d="M12 10v4.5M12 17.5v.01"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  export: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 19h14"/>',
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  chart: '<path d="M3 21h18"/><path d="M6 17v-5M11 17V6M16 17v-8M21 17v-3"/>',
  sliders: '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M21 18h-1"/><circle cx="16" cy="6" r="2.5"/><circle cx="10" cy="12" r="2.5"/><circle cx="18" cy="18" r="2.5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  message: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  workflow: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5V13a3 3 0 0 0 3 3h6.5"/><path d="M8.5 6H15a3 3 0 0 1 3 3v6.5"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  block: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>'
};
const icon = (n, s = 20) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[n] || ''}</svg>`;
const LOGO = `<svg class="i" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
  <path d="M17 31V9" style="stroke:var(--pale-gold)" stroke-width="1.6" stroke-linecap="round" fill="none"/>
  <circle cx="17" cy="5.5" r="3.4" style="fill:var(--ruby)"/>
  <g style="stroke:var(--pale-gold)" stroke-width="1.6" fill="none">
    <circle cx="11.6" cy="11.5" r="2.9"/><circle cx="22.4" cy="11.5" r="2.9"/>
    <circle cx="11.6" cy="18" r="2.9"/><circle cx="22.4" cy="18" r="2.9"/>
    <circle cx="11.6" cy="24.5" r="2.9"/><circle cx="22.4" cy="24.5" r="2.9"/>
  </g></svg>`;
function hydrate(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => { el.outerHTML = icon(el.dataset.icon, +(el.dataset.size || 20)); });
  root.querySelectorAll('[data-logo]').forEach(el => { el.innerHTML = LOGO; el.removeAttribute('data-logo'); });
}

/* =========================================================
   Mock data (fictional firm, people and matters)
   ========================================================= */
const AREAS = { cx: 'Client Experience', lo: 'Legal Operations', fa: 'Finance + Administration', go: 'Growth Operations', dv: 'Data + Management Visibility', ct: 'Custom Operating Teams' };
const STATUS = { 'on-track': 'On track', 'at-risk': 'At risk', review: 'Awaiting review', blocked: 'Blocked', complete: 'Complete' };
const STATUS_ORDER = ['at-risk', 'blocked', 'review', 'on-track', 'complete'];
const TEAM = {
  dana: { name: 'Dana Okafor', role: 'Engagement lead', email: 'dana.okafor@hyacinth.example', access: 'Operations Manager', capacity: 6, active: true },
  marcus: { name: 'Marcus Lin', role: 'Client operations specialist', email: 'marcus.lin@hyacinth.example', access: 'Specialist', capacity: 5, active: true },
  priya: { name: 'Priya Raman', role: 'Records coordinator', email: 'priya.raman@hyacinth.example', access: 'Specialist', capacity: 6, active: true },
  aisha: { name: 'Aisha Bello', role: 'Deadline and docket coordinator', email: 'aisha.bello@hyacinth.example', access: 'Specialist', capacity: 5, active: true },
  elena: { name: 'Elena Soto', role: 'Billing and finance specialist', email: 'elena.soto@hyacinth.example', access: 'Specialist', capacity: 6, active: true },
  theo: { name: 'Theo Brandt', role: 'Data and reporting analyst', email: 'theo.brandt@hyacinth.example', access: 'Specialist', capacity: 5, active: true },
  noah: { name: 'Noah Castellanos', role: 'Growth operations specialist', email: 'noah.castellanos@hyacinth.example', access: 'Specialist', capacity: 4, active: true },
  ines: { name: 'Inés Calloway', role: 'Engagement lead', email: 'ines.calloway@hyacinth.example', access: 'Team Lead', capacity: 5, active: true },
  ruth: { name: 'Ruth Adeyemi', role: 'Engagement lead', email: 'ruth.adeyemi@hyacinth.example', access: 'Team Lead', capacity: 5, active: true },
  samir: { name: 'Samir Haddad', role: 'Director of operations', email: 'samir.haddad@hyacinth.example', access: 'Super Admin', capacity: 3, active: true }
};
const TYPE_LABEL = { intake: 'Intake', records: 'Records', docket: 'Deadline tracking', billing: 'Billing', comms: 'Client communications', collection: 'Document collection', data: 'Data administration', reporting: 'Reporting', crm: 'CRM administration', scheduling: 'Scheduling', finance: 'Finance workflow', filing: 'Filing support', custom: 'Custom operating team', followup: 'Follow-up', collections: 'Collections' };
const TEMPLATES = {
  intake: [['Inquiry captured from web form', 1], ['Conflict check run against case management system', 1], ['Intake interview completed', 0], ['Intake summary drafted', 0], ['Attorney review of intake summary', 0, 1], ['Engagement letter sent', 1]],
  records: [['Provider list confirmed with client', 0], ['HIPAA authorizations signed', 0], ['Requests sent to providers', 1], ['Follow-up cadence running', 1], ['Records received and indexed', 0], ['Attorney review of chronology', 0, 1]],
  docket: [['Deadlines pulled from scheduling order', 1], ['Calendar entries verified against court docket', 0], ['Team reminders scheduled', 1], ['Draft responses routed to attorney', 0, 1], ['Service and filing confirmed', 0]],
  billing: [['Time entries exported from billing system', 1], ['Entries checked against client billing guidelines', 0], ['Pre-bills prepared', 0], ['Partner review of pre-bills', 0, 1], ['Invoices issued', 1]],
  comms: [['Status template merged with matter data', 1], ['Updates personalized by specialist', 0], ['Updates sent to clients', 1], ['Client replies logged and routed', 0]],
  collection: [['Document checklist sent to client', 1], ['Reminder sequence running', 1], ['Documents received and checked', 0], ['Missing items followed up by phone', 0], ['Complete set delivered to case team', 0]],
  data: [['Data export pulled', 1], ['Records validated and de-duplicated', 0], ['Exceptions flagged for review', 0], ['Cleaned data loaded', 1], ['Summary shared with operations', 0]],
  reporting: [['Source data refreshed', 1], ['Figures reconciled with billing', 0], ['Draft report prepared', 0], ['Managing partner review', 0, 1], ['Report distributed', 1]],
  crm: [['Referral sources exported', 1], ['Contacts matched and merged', 0], ['Referral activity logged', 0], ['CRM sync verified', 1]],
  scheduling: [['Availability collected from parties', 0], ['Court reporter and room booked', 0], ['Deposition notices drafted', 0], ['Attorney sign-off on notices', 0, 1], ['Calendar invitations sent', 1]],
  finance: [['Bank and trust statements imported', 1], ['Three-way reconciliation prepared', 0], ['Variances investigated', 0], ['Partner sign-off', 0, 1]],
  filing: [['Settlement figures confirmed', 0], ['Disbursement statement drafted', 0], ['Attorney review of packet', 0, 1], ['Packet filed and served', 0], ['Client copies sent', 1]],
  custom: [['Lien holders identified', 0], ['Lien requests sent', 1], ['Final lien amounts confirmed', 0], ['Resolution summary to attorney', 0, 1], ['Status filed with court', 0]],
  followup: [['Unresponsive claimant list generated', 1], ['Call and text sequence running', 1], ['Letters mailed to remaining claimants', 0], ['Responses logged in case file', 0], ['Exceptions escalated to attorney', 0]],
  collections: [['Aging report pulled', 1], ['Reminder statements sent', 1], ['Follow-up calls logged', 0], ['Payment plans routed to partner', 0, 1]]
};
const SEED = [
  ['HL-2041', 'New client intake and conflict check', 'Garza v. Summit Freight', 'intake', 'cx', 'marcus', 'review', 1, 'Rachel Calder', ['dana'], 4],
  ['HL-2038', 'Medical records request, four providers', 'Reyes v. Northgate Logistics', 'records', 'lo', 'priya', 'at-risk', 2, 'Jonah Whitmore', ['dana'], 3],
  ['HL-2036', 'Discovery response calendar', 'Ostrander v. Kell Medical', 'docket', 'lo', 'aisha', 'on-track', 4, 'Lena Ibarra', ['priya'], 2],
  ['HL-2033', 'October pre-bill review', 'Firmwide', 'billing', 'fa', 'elena', 'review', 3, 'Rachel Calder', ['theo'], 3],
  ['HL-2031', 'Weekly client status updates', 'Mass tort docket', 'comms', 'cx', 'marcus', 'on-track', 5, 'Jonah Whitmore', [], 2],
  ['HL-2029', 'Employment history document collection', 'Lindqvist v. Arcadia Health', 'collection', 'cx', 'marcus', 'blocked', 0, 'Lena Ibarra', ['priya'], 2],
  ['HL-2027', 'Case management data cleanup', 'Firmwide', 'data', 'dv', 'theo', 'on-track', 9, 'Rachel Calder', [], 2],
  ['HL-2024', 'Partner pipeline report', 'Firmwide', 'reporting', 'dv', 'theo', 'on-track', 6, 'Rachel Calder', ['elena'], 1],
  ['HL-2022', 'Referral source CRM update', 'Firmwide', 'crm', 'go', 'noah', 'on-track', 12, 'Jonah Whitmore', [], 1],
  ['HL-2019', 'Records chronology, imaging and labs', 'Ostrander v. Kell Medical', 'records', 'lo', 'priya', 'review', 2, 'Lena Ibarra', ['aisha'], 5],
  ['HL-2017', 'Deposition scheduling, three witnesses', 'Reyes v. Northgate Logistics', 'scheduling', 'cx', 'aisha', 'at-risk', 1, 'Jonah Whitmore', ['marcus'], 1],
  ['HL-2015', 'Trust account reconciliation support', 'Firmwide', 'finance', 'fa', 'elena', 'on-track', 8, 'Rachel Calder', [], 2],
  ['HL-2012', 'Settlement disbursement packet', 'Hollis Estate', 'filing', 'lo', 'aisha', 'on-track', 10, 'Lena Ibarra', ['elena'], 1],
  ['HL-2010', 'Lien resolution team', 'Delmar Water District claims', 'custom', 'ct', 'dana', 'on-track', 14, 'Jonah Whitmore', ['priya', 'elena'], 2],
  ['HL-2008', 'Unresponsive claimant follow-up', 'Delmar Water District claims', 'followup', 'cx', 'marcus', 'at-risk', 3, 'Jonah Whitmore', ['noah'], 2],
  ['HL-2005', 'Collections follow-up, 60+ days', 'Firmwide', 'collections', 'fa', 'elena', 'on-track', 7, 'Rachel Calder', [], 2],
  ['HL-2003', 'Web lead intake triage', 'Firmwide', 'intake', 'go', 'noah', 'complete', -1, 'Rachel Calder', ['marcus'], 6],
  ['HL-1998', 'Records index and Bates organization', 'Pruitt Family Trust', 'records', 'lo', 'priya', 'complete', -3, 'Lena Ibarra', [], 6]
];
const NOTES = {
  'HL-2038': 'St. Brigid Imaging requires its own release form. Sent to the client for signature. The production deadline is at risk.',
  'HL-2029': 'No reply from the client since last week. Escalating to the attorney if there is no response by tomorrow.',
  'HL-2017': 'Two of three witnesses are unavailable in the noticed window. Proposing alternate dates.',
  'HL-2008': 'Three claimants are still missing water district account numbers.',
  'HL-2041': 'Intake summary is ready for attorney review.',
  'HL-2033': 'Pre-bills are ready. 14 entries need task codes before invoices go out.',
  'HL-2019': 'Chronology drafted and ready for review.'
};
function buildWf(r, firmId = 'cw') {
  const [id, title, matter, type, area, owner, status, due, attorney, support, done] = r;
  const tpl = TEMPLATES[type];
  const steps = tpl.map(([t, auto, review], i) => {
    const isDone = i < done;
    return { title: t, auto: !!auto, review: !!review, done: isDone, by: isDone ? (auto ? 'Automation' : TEAM[owner].name) : null, at: isDone ? at(-(done - i), 9 + i, 15) : null };
  });
  const log = [{ who: TEAM.dana.name, text: 'Opened this workflow and assigned the team.', at: at(-(done + 2), 8, 40), kind: 'event' }];
  steps.forEach(s => { if (s.done) log.push({ who: s.by, sys: s.by === 'Automation', text: `Completed “${s.title}”.`, at: s.at, kind: 'event' }); });
  if (NOTES[id]) log.push({ who: TEAM[owner].name, text: NOTES[id], at: at(0, 8, 5), kind: 'comment' });
  log.sort((a, b) => b.at - a.at);
  return { id, firm: firmId, title, matter, type, area, owner, status, due: addDays(due), attorney, support: [...support], steps, log, completedNow: false, completedOnTime: false };
}
const DL_SEED = [
  ['D01', 'Medical records production deadline', 'Discovery', 2, 'HL-2038', true],
  ['D02', 'Deposition notices served', 'Filing', 1, 'HL-2017', true],
  ['D03', 'Intake decision from attorney', 'Client deliverable', 1, 'HL-2041', false],
  ['D04', 'Employment records to expert', 'Client deliverable', 0, 'HL-2029', true],
  ['D05', 'Chronology to trial team', 'Client deliverable', 2, 'HL-2019', false],
  ['D06', 'October invoices issued', 'Billing', 3, 'HL-2033', false],
  ['D07', 'Claimant response window closes', 'Client deliverable', 3, 'HL-2008', true],
  ['D08', 'Responses to second requests for production', 'Discovery', 4, 'HL-2036', false],
  ['D09', 'Weekly client updates sent', 'Client deliverable', 5, 'HL-2031', false],
  ['D10', 'Partner pipeline report', 'Report', 6, 'HL-2024', false],
  ['D11', 'Collections review with partner', 'Billing', 7, 'HL-2005', false],
  ['D12', 'Trust reconciliation sign-off', 'Billing', 8, 'HL-2015', false],
  ['D13', 'Data cleanup checkpoint', 'Report', 9, 'HL-2027', false],
  ['D14', 'Settlement disbursement filing', 'Filing', 10, 'HL-2012', false],
  ['D15', 'CRM referral sync', 'Report', 12, 'HL-2022', false],
  ['D16', 'Lien resolution status to court', 'Filing', 14, 'HL-2010', false],
  ['D17', 'Expert disclosure deadline', 'Filing', 17, 'HL-2036', false],
  ['D18', 'Mediation statement due', 'Filing', 21, 'HL-2038', false],
  ['D19', 'Hearing on motion to compel', 'Hearing', 24, 'HL-2017', false],
  ['D20', 'Records production to opposing counsel', 'Discovery', 28, 'HL-2019', false],
  ['D21', 'Response to motion filed', 'Filing', -2, 'HL-2036', false, true],
  ['D22', 'Records index delivered', 'Client deliverable', -3, 'HL-1998', false, true],
  ['D23', 'Web lead triage handoff', 'Client deliverable', -1, 'HL-2003', false, true]
];
const EX_SEED = [
  ['EX1', 'Provider requires its own authorization form', 'St. Brigid Imaging will not accept the standard HIPAA release. A client signature is needed on their form.', 'HL-2038', 'high', '2 hr ago'],
  ['EX2', 'Client unresponsive after three attempts', 'No reply to calls or texts since last Tuesday. Next step is a letter by mail.', 'HL-2029', 'high', '5 hr ago'],
  ['EX3', 'Witness availability conflict', 'Two of three deponents are unavailable in the noticed window.', 'HL-2017', 'high', 'Yesterday'],
  ['EX4', 'Time entries missing task codes', '14 entries need task codes before pre-bills go to the partner.', 'HL-2033', 'med', 'Yesterday'],
  ['EX5', 'Duplicate contacts found in case management', '38 likely duplicates are queued for confirmation before merge.', 'HL-2027', 'med', '2 days ago'],
  ['EX6', 'Claimants missing account numbers', 'Three claimants have not provided water district account numbers.', 'HL-2008', 'med', '2 days ago']
];
const TREND = (() => {
  const opened = [38, 42, 40, 47, 51, 49, 55, 53, 58, 54, 60, 57];
  const completed = [35, 39, 41, 44, 47, 50, 51, 54, 55, 56, 58, 59];
  const ws = weekStart(TODAY);
  const labels = opened.map((_, i) => fmtAxis(addDays(-7 * (11 - i), ws)));
  return { labels, opened, completed };
})();
const REP_SEED = [
  { completed: 236, onTime: 96.6, turnaround: 2.4, exRaised: 19, exResolved: 18,
    areas: [['cx', 88, 84, 97], ['lo', 71, 66, 95], ['fa', 42, 41, 98], ['go', 18, 17, 100], ['dv', 15, 15, 100], ['ct', 14, 13, 92]],
    highlights: ['Medical records requests stayed on cadence across four active matters.', 'Pre-bills were prepared three days ahead of the billing cycle.', 'Web lead intake triage was completed and handed to Growth Operations.'],
    focus: ['Clear the provider authorization backlog on Reyes v. Northgate Logistics.', 'Reschedule two deposition witnesses before the noticed window closes.', 'Finish the case management data cleanup ahead of the partner pipeline report.'] },
  { completed: 221, onTime: 95.9, turnaround: 2.6, exRaised: 22, exResolved: 20,
    areas: [['cx', 80, 79, 96], ['lo', 66, 62, 94], ['fa', 40, 38, 97], ['go', 16, 15, 100], ['dv', 14, 14, 100], ['ct', 14, 13, 93]],
    highlights: ['Discovery calendar for Ostrander v. Kell Medical was rebuilt from the amended scheduling order.', 'Collections follow-up shortened the 60+ day balance list.', 'The lien resolution team started work on Delmar Water District claims.'],
    focus: ['Bring records turnaround under three days.', 'Add task-code checks before pre-bills go to partners.', 'Start the referral source CRM update.'] },
  { completed: 204, onTime: 95.1, turnaround: 2.9, exRaised: 25, exResolved: 22,
    areas: [['cx', 74, 72, 95], ['lo', 60, 57, 94], ['fa', 37, 36, 97], ['go', 15, 14, 93], ['dv', 13, 13, 100], ['ct', 12, 12, 92]],
    highlights: ['Weekly client status updates moved to a merged template.', 'Trust reconciliation support started under partner sign-off.', 'Records index for Pruitt Family Trust began.'],
    focus: ['Stand up the lien resolution team.', 'Reduce exceptions open longer than five days.', 'Prepare the discovery calendar refresh.'] },
  { completed: 188, onTime: 94.2, turnaround: 3.1, exRaised: 27, exResolved: 23,
    areas: [['cx', 70, 66, 94], ['lo', 55, 52, 93], ['fa', 35, 33, 96], ['go', 14, 13, 92], ['dv', 12, 12, 100], ['ct', 12, 12, 92]],
    highlights: ['Intake moved to a defined six-step workflow.', 'Billing guideline checks were added before pre-bills.', 'Deadline reminders were automated for the litigation team.'],
    focus: ['Move weekly client updates to a merged template.', 'Begin trust reconciliation support.', 'Start the Pruitt Family Trust records index.'] },
  { completed: 176, onTime: 93.5, turnaround: 3.4, exRaised: 29, exResolved: 24,
    areas: [['cx', 66, 62, 93], ['lo', 52, 49, 93], ['fa', 33, 31, 95], ['go', 13, 12, 92], ['dv', 11, 11, 100], ['ct', 11, 11, 91]], highlights: [], focus: [] }
];
const REPORTS = REP_SEED.map((r, i) => {
  const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - 1 - i, 1);
  return { ...r, key: iso(d).slice(0, 7), label: fmt(d, { month: 'long', year: 'numeric' }), short: fmt(d, { month: 'short' }) };
});
const REPORT_COUNT = 4; // the fifth month exists only as the comparison base
const VIEWER = { name: 'Morgan Hale', title: 'Director of Operations', email: 'morgan.hale@calderwhitmore.example', phone: '(312) 555-0148' };
const LEGAL = {
  privacy: { title: 'Privacy notice', updated: 'October 1, 2026', sections: [
    ['What this notice covers', ['This notice explains how Hyacinth Industries, LLC (“Hyacinth”) handles personal information collected through this website and the Hyacinth client portal.']],
    ['Information we collect', [['Contact details you submit through our forms, such as your name, firm, work email and phone number.', 'Information a client firm shares with us so we can perform services under its engagement agreement.', 'Basic technical data, such as browser type and the pages you visit, used to keep the site secure and working.']]],
    ['How we use it', [['To respond to your inquiry and arrange a conversation.', 'To deliver services under a signed engagement.', 'To secure, maintain and improve the website and portal.']]],
    ['Client and matter information', ['Information we handle for client firms is processed on the firm’s instructions and under the confidentiality terms of the engagement agreement. We do not sell it or use it for marketing.']],
    ['Your choices', ['You can ask us to access, correct or delete the contact details you have submitted. Use the contact form on this site, or ask your Hyacinth representative.']]
  ] },
  terms: { title: 'Terms of use', updated: 'October 1, 2026', sections: [
    ['Using this website', ['By using this website you agree to these terms. If you do not agree, please do not use the site.']],
    ['No legal advice', ['Hyacinth provides managed operations support to law firms. Hyacinth is not a law firm, and nothing on this site is legal advice. Hyacinth teams work under the direction of the client firm’s attorneys.']],
    ['Client portal access', [['Portal access is limited to people authorized by a client firm.', 'Keep your sign-in details confidential and tell us promptly about any unauthorized use.', 'Activity in the portal is recorded so that work stays accountable.']]],
    ['Content and ownership', ['The website’s design, text and graphics belong to Hyacinth Industries, LLC. Client work product belongs to the client firm as set out in its engagement agreement.']],
    ['Changes to these terms', ['We may update these terms. The date at the top of this page shows when they last changed.']]
  ] },
  accessibility: { title: 'Accessibility', updated: 'October 1, 2026', sections: [
    ['Our commitment', ['We want this website and the client portal to work for everyone. We design and test against the Web Content Accessibility Guidelines (WCAG) 2.2, level AA.']],
    ['What we have done', [['Every control can be reached and used with a keyboard, with a visible focus indicator.', 'Text and controls meet AA contrast against their backgrounds.', 'Charts include a table view and a written summary.', 'Motion is reduced when your device asks for reduced motion.', 'Status is shown with text and icons, never color alone.']]],
    ['Known limitations', ['Some exported reports are plain CSV files without formatting. If you need a report in another format, ask your Hyacinth representative.']],
    ['Feedback', ['If something on this site is hard to use, tell us through the contact form and we will work on a fix.']]
  ] }
};

/* =========================================================
   State
   ========================================================= */
const state = {
  workflows: [], archived: [], deadlines: [], exceptions: [], notifications: [],
  surface: null, view: null, pendingView: null, signedOut: false, detailId: null,
  wf: { q: '', area: [], owner: 'all', status: 'all', sort: 'due', dir: 'asc' },
  wfLoaded: false, wfLoading: false, wfError: false,
  dl: { mode: 'week', anchor: weekStart(TODAY), riskOnly: false, day: null },
  rep: { idx: 0, compare: false, loaded: {}, failedOnce: {}, loading: false, error: false },
  trend: { range: 12, table: false },
  exView: 'open',
  simulateError: false,
  slaBase: { total: 214, onTime: 207 },
  prefs: { digest: true, alerts: true, reportReady: true },
  profile: { ...VIEWER },
  newIds: new Set(),
  contact: { values: {}, submitted: false, attempted: false }
};
function seed() {
  state.workflows = SEED.map(r => buildWf(r, 'cw'));
  state.archived = [];
  state.deadlines = DL_SEED.map(([id, title, kind, off, wf, risk, done]) => ({ id, title, kind, date: at(off, ...KIND_TIME[kind]), wf, atRisk: !!risk, done: !!done }));
  seedOther();
  seedAdmin();
  state.exceptions = EX_SEED.map(([id, title, detail, wf, sev, age]) => ({ id, title, detail, wf, sev, age, snoozedUntil: null }));
  state.notifications = [
    { id: 'N1', text: 'Priya Raman flagged the Reyes v. Northgate records request as at risk.', time: '25 min ago', wf: 'HL-2038', unread: true },
    { id: 'N2', text: 'Intake summary for Garza v. Summit Freight is ready for attorney review.', time: '1 hr ago', wf: 'HL-2041', unread: true },
    { id: 'N3', text: `The ${REPORTS[0].label} management report is ready.`, time: 'Yesterday', route: 'reports', unread: true },
    { id: 'N4', text: 'Deposition notice deadline for Reyes v. Northgate is tomorrow.', time: 'Yesterday', route: 'deadlines', unread: false },
    { id: 'N5', text: 'Records index for Pruitt Family Trust is complete.', time: '3 days ago', wf: 'HL-1998', unread: false }
  ];
}

/* Selectors (portal views are scoped to state.portalFirm) */
const getWf = id => state.workflows.find(w => w.id === id);
const openWfs = () => pWfs().filter(w => w.status !== 'complete');
const countStatus = s => pWfs().filter(w => w.status === s).length;
const activeDeadlines = () => state.deadlines.filter(d => { const w = getWf(d.wf); return w && w.firm === state.portalFirm; });
const activeExceptions = () => state.exceptions.filter(e => { const w = getWf(e.wf); return w && w.firm === state.portalFirm; });
const weekDeadlines = () => activeDeadlines().filter(d => !d.done && diffDays(d.date) >= 0 && diffDays(d.date) <= 6);
const doneCount = w => w.steps.filter(s => s.done).length;
function slaPct() { const v = slaFor(state.portalFirm); return v == null ? null : v; }
function addLog(w, text, opts = {}) {
  const entry = { who: opts.who || actorName(), text, at: new Date(), kind: opts.kind || 'event', sys: !!opts.sys };
  w.log.unshift(entry);
  return entry;
}
const removeLog = (w, entry) => { w.log = w.log.filter(e => e !== entry); };

/* =========================================================
   UI infrastructure: layers, popovers, menus, toasts, modals
   ========================================================= */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
const focusables = roots => roots.flatMap(r => $$(FOCUSABLE, r)).filter(visible);
const layers = [];
let pop = null;
const isOpen = el => layers.some(l => l.el === el);

function openLayer(el, opts = {}) {
  const prev = document.activeElement;
  el.hidden = false;
  if (opts.scrim) opts.scrim.hidden = false;
  void el.offsetWidth;
  el.classList.add('is-open');
  if (opts.scrim) opts.scrim.classList.add('is-open');
  layers.push({ el, scrim: opts.scrim, prev, onClose: opts.onClose, trap: opts.trap || [el], keepMounted: !!opts.keepMounted, allowScroll: !!opts.allowScroll });
  if (!opts.allowScroll) document.body.classList.add('no-scroll');
  if (el.id === 'sheet-root') document.body.classList.add('sheet-open');
  const target = (opts.focus && $(opts.focus, el)) || focusables([el])[0] || el;
  requestAnimationFrame(() => target.focus({ preventScroll: true }));
}
function closeLayer(el, opts = {}) {
  const i = layers.findIndex(l => l.el === el);
  if (i < 0) return;
  const l = layers.splice(i, 1)[0];
  el.classList.remove('is-open');
  if (l.scrim) l.scrim.classList.remove('is-open');
  setTimeout(() => {
    if (el.classList.contains('is-open')) return;
    if (!l.keepMounted) el.hidden = true;
    if (l.scrim && !l.scrim.classList.contains('is-open')) l.scrim.hidden = true;
  }, reduced() ? 0 : 230);
  if (!layers.some(x => !x.allowScroll)) document.body.classList.remove('no-scroll');
  if (el.id === 'sheet-root') document.body.classList.remove('sheet-open');
  if (l.onClose) l.onClose();
  if (opts.restoreFocus !== false && l.prev && document.contains(l.prev) && visible(l.prev)) l.prev.focus({ preventScroll: true });
}
function closeAllLayers() { [...layers].reverse().forEach(l => closeLayer(l.el, { restoreFocus: false })); }

function openPop(trigger, el) {
  closePop(false);
  el.hidden = false;
  void el.offsetWidth;
  el.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
  pop = { el, trigger };
  const first = el.querySelector('[role="menuitem"]:not([disabled]), button:not([disabled]), a[href]');
  if (first) first.focus({ preventScroll: true });
}
function closePop(returnFocus) {
  if (!pop) return;
  const { el, trigger } = pop;
  pop = null;
  el.classList.remove('is-open');
  el.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  if (returnFocus && document.contains(trigger)) trigger.focus({ preventScroll: true });
}
let menuItems = [];
function openFloatMenuLegacy(trigger, items) {
  const fm = $('#floatmenu');
  const list = $('#floatmenu-list');
  menuItems = items;
  list.setAttribute('aria-label', trigger.getAttribute('aria-label') || 'Actions');
  list.innerHTML = items.map((it, i) => it.sep ? '<hr role="separator">' :
    `<button type="button" role="menuitem" class="${it.danger ? 'danger' : ''}" data-action="menu-item" data-i="${i}" ${it.disabled ? 'disabled' : ''}>${icon(it.icon || 'arrow-right', 18)}${esc(it.label)}</button>`).join('');
  fm.hidden = false;
  positionFloat(trigger);
  openPop(trigger, fm);
}
function positionFloat(trigger) {
  const fm = $('#floatmenu');
  const r = trigger.getBoundingClientRect();
  const mw = fm.offsetWidth, mh = fm.offsetHeight;
  let left = Math.min(r.right - mw, window.innerWidth - mw - 8);
  left = Math.max(8, left);
  let top = r.bottom + 6;
  if (top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 6);
  fm.style.left = left + 'px';
  fm.style.top = top + 'px';
}

function toast(msg, opts = {}) {
  const box = $('#toasts');
  const maxToasts = window.matchMedia('(max-width: 560px)').matches ? 1 : 3;
  while (box.children.length >= maxToasts) box.firstElementChild.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${icon(opts.icon || 'check', 20)}<span>${esc(msg)}</span><span class="toast-actions">${opts.undo ? '<button type="button" data-t="undo">Undo</button>' : ''}${opts.action ? `<button type="button" data-t="act">${esc(opts.action.label)}</button>` : ''}<button type="button" class="icon-btn" data-t="close" aria-label="Dismiss message">${icon('x', 16)}</button></span>`;
  box.appendChild(t);
  let timer;
  const kill = () => { clearTimeout(timer); t.remove(); };
  const arm = () => { clearTimeout(timer); timer = setTimeout(kill, (opts.undo || opts.action) ? 8000 : 5000); };
  t.addEventListener('mouseenter', () => clearTimeout(timer));
  t.addEventListener('mouseleave', arm);
  t.addEventListener('focusin', () => clearTimeout(timer));
  t.addEventListener('focusout', arm);
  t.addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.t === 'undo') { kill(); opts.undo(); toast('Change undone.', { icon: 'refresh' }); }
    else if (b.dataset.t === 'act') { kill(); opts.action.fn(); }
    else kill();
  });
  arm();
}
const announce = msg => { const a = $('#announcer'); a.textContent = ''; setTimeout(() => { a.textContent = msg; }, 30); };

function withLoading(btn, fn, ms = 600) {
  if (!btn || btn.getAttribute('aria-busy') === 'true') return;
  btn.setAttribute('aria-busy', 'true');
  btn.disabled = true;
  setTimeout(() => {
    btn.removeAttribute('aria-busy');
    btn.disabled = false;
    fn();
  }, reduced() ? 250 : ms);
}

const modalRoot = () => $('#modal-root');
function openModal({ title, body, foot, focus, onClose, form }) {
  const m = $('#modal');
  m.innerHTML = `${form ? `<form data-form="${form}" novalidate>` : ''}<div class="modal-head"><h2 class="h3" id="modal-title">${title}</h2><button class="icon-btn" type="button" data-action="close-layer" aria-label="Close dialog">${icon('x')}</button></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div>${form ? '</form>' : ''}`;
  const root = modalRoot();
  if (isOpen(root)) {
    const l = layers.find(x => x.el === root);
    l.onClose = onClose;
    ((focus && $(focus, m)) || focusables([m])[0]).focus();
  } else {
    openLayer(root, { focus, onClose });
  }
}
function confirmDialog({ title, body, confirm = 'Confirm', danger = false }) {
  return new Promise(resolve => {
    let done = false;
    const finish = v => { if (!done) { done = true; resolve(v); } };
    openModal({
      title: esc(title),
      body: `<p>${esc(body)}</p>`,
      foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn ${danger ? 'btn-primary' : 'btn-dark'}" type="button" id="confirm-ok">${esc(confirm)}</button>`,
      focus: '#confirm-ok',
      onClose: () => finish(false)
    });
    $('#confirm-ok').addEventListener('click', () => { finish(true); closeLayer(modalRoot()); });
  });
}
function setErr(id, msg) {
  const inp = document.getElementById(id), e = document.getElementById(id + '-err');
  if (!inp || !e) return;
  if (msg) { inp.setAttribute('aria-invalid', 'true'); e.innerHTML = `${icon('alert', 16)}<span>${esc(msg)}</span>`; e.hidden = false; }
  else { inp.removeAttribute('aria-invalid'); e.hidden = true; e.textContent = ''; }
}
const fieldHTML = ({ id, label, type = 'text', opt, auto, full, placeholder = '', value = '', inputmode }) =>
  `<div class="field ${full ? 'full' : ''}"><label class="label" for="${id}">${label}${opt ? ' <span class="opt">(optional)</span>' : ''}</label><input class="input" id="${id}" name="${id}" type="${type}" ${auto ? `autocomplete="${auto}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''} ${opt ? '' : 'aria-required="true"'} aria-describedby="${id}-err" placeholder="${esc(placeholder)}" value="${esc(value)}"><p class="err" id="${id}-err" hidden></p></div>`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = v => (v.match(/\d/g) || []).length;

/* =========================================================
   Website: contact form, legal pages, scroll-spy
   ========================================================= */
const AREA_OPTS = ['Client Operations', 'Legal Support', 'Business Operations', 'Not sure yet'];
function renderContactForm() {
  const v = state.contact.values;
  $('#contact-card').innerHTML = `
  <form id="contact-form" data-form="contact" novalidate aria-labelledby="cf-title">
    <div class="stack-24">
      <div class="stack-8"><h3 class="h3" id="cf-title">Request a conversation</h3><p class="small">Fields are required unless marked optional.</p></div>
      <div id="cf-summary" class="error-summary" tabindex="-1" role="alert" hidden></div>
      <div class="form-grid">
        ${fieldHTML({ id: 'c-name', label: 'Representative name', auto: 'name', placeholder: 'Full name', value: v['c-name'] })}
        ${fieldHTML({ id: 'c-firm', label: 'Firm name', opt: true, auto: 'organization', placeholder: 'Your firm', value: v['c-firm'] })}
        ${fieldHTML({ id: 'c-email', label: 'Work email', type: 'email', auto: 'email', placeholder: 'name@firm.com', value: v['c-email'] })}
        ${fieldHTML({ id: 'c-phone', label: 'Phone', type: 'tel', auto: 'tel', inputmode: 'tel', placeholder: '(312) 555-0100', value: v['c-phone'] })}
        <div class="field full"><span class="label" id="c-area-l">Where do you need capacity? <span class="opt">(optional)</span></span>
          ${dd('c-area', { kind: 'select', labelId: 'c-area-l', title: 'Area of focus', placeholder: 'Choose an area', value: v['c-area'] || '', options: AREA_OPTS.map(a => ({ value: a, label: a })), onChange: val => { state.contact.values['c-area'] = val; } })}</div>
        <div class="field full"><label class="label" for="c-msg">What is the bottleneck? <span class="opt">(optional)</span></label>
          <textarea class="textarea" id="c-msg" name="c-msg" placeholder="For example: records requests are taking paralegal time away from trial prep.">${esc(v['c-msg'] || '')}</textarea></div>
      </div>
      <div class="form-actions"><p class="small" style="max-width:36ch">We use these details only to respond to your request. Read the <a href="#privacy">privacy notice</a>.</p>
        <button class="btn btn-primary" type="submit" id="c-submit">Request a conversation ${icon('arrow-right', 18)}</button></div>
    </div>
  </form>`;
}
function validateContact(show) {
  const g = id => $('#' + id).value.trim();
  const errs = [];
  const name = g('c-name'), email = g('c-email'), phone = g('c-phone');
  const e1 = name.length < 2 ? 'Enter the name of the person we should contact.' : '';
  const e2 = !email ? 'Enter a work email address.' : !EMAIL_RE.test(email) ? 'Enter an email address in the format name@firm.com.' : '';
  const e3 = !phone ? 'Enter a phone number.' : (digits(phone) < 10 || digits(phone) > 15) ? 'Enter a phone number with at least 10 digits, for example (312) 555-0100.' : '';
  [['c-name', e1, 'Representative name'], ['c-email', e2, 'Work email'], ['c-phone', e3, 'Phone']].forEach(([id, m, label]) => { if (show) setErr(id, m); if (m) errs.push({ id, m, label }); });
  return errs;
}
function showContactSummary(errs) {
  const s = $('#cf-summary');
  if (!errs.length) { s.hidden = true; return; }
  s.innerHTML = `<h3>${icon('alert', 18)}Fix ${errs.length === 1 ? 'this field' : `these ${errs.length} fields`} to continue</h3><ul>${errs.map(e => `<li><button type="button" class="text-btn" data-action="focus-field" data-target="${e.id}">${esc(e.label)}: ${esc(e.m)}</button></li>`).join('')}</ul>`;
  s.hidden = false;
}
function renderContactSuccess() {
  const v = state.contact.values;
  const rows = [['Representative', v['c-name']], ['Firm', v['c-firm'] || 'Not provided'], ['Work email', v['c-email']], ['Phone', v['c-phone']], ['Area', v['c-area'] || 'Not specified'], ['Bottleneck', v['c-msg'] || 'Not provided']];
  $('#contact-card').innerHTML = `<div class="success" id="cf-success" tabindex="-1" role="status">
    <span class="success-mark">${icon('check', 28)}</span>
    <h3 class="h3">Thanks, ${esc(v['c-name'].split(' ')[0])}. Your request is in.</h3>
    <p>A Hyacinth representative will follow up using the details below.</p>
    <dl class="summary-list">${rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
    <div class="form-actions"><button class="btn btn-ghost" type="button" data-action="cf-edit">Edit details</button><button class="btn btn-dark" type="button" data-action="cf-new">Start a new request</button></div>
  </div>`;
}

function legalHTML(key) {
  const L = LEGAL[key];
  const sec = L.sections.map(([h, parts]) => `<section><h2 class="h3">${esc(h)}</h2>${parts.map(p => Array.isArray(p) ? `<ul>${p.map(li => `<li>${esc(li)}</li>`).join('')}</ul>` : `<p>${esc(p)}</p>`).join('')}</section>`).join('');
  const links = Object.entries(LEGAL).map(([k, v]) => `<a href="#${k}" ${k === key ? 'aria-current="page"' : ''}>${esc(v.title)}${icon('chevron-right', 18)}</a>`).join('');
  return `<section class="legal-hero on-ink"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span aria-hidden="true">/</span><span aria-current="page">${esc(L.title)}</span></nav>
      <p class="eyebrow">Hyacinth Industries, LLC</p>
      <h1 class="h2" id="legal-title" tabindex="-1">${esc(L.title)}</h1>
      <p>Last updated ${esc(L.updated)}</p></div><div class="sigbar" role="presentation"></div></section>
    <section class="legal-body on-light"><div class="wrap">
      <article class="legal-doc">
        <p class="legal-note callout">${icon('file', 20)}<span>Prototype copy for design review. Final language requires review by counsel before launch.</span></p>
        ${sec}
        <section><h2 class="h3">Contact</h2><p>Questions about this page? Reach us through the contact form.</p><p><a class="btn btn-dark" href="#contact" data-focus="#c-name">Go to the contact form</a></p></section>
      </article>
      <aside class="legal-aside" aria-label="Related pages"><p class="eyebrow">Legal</p>${links}<a href="#home">Back to home${icon('home', 18)}</a></aside>
    </div></section>`;
}
function showSitePage(page) {
  const home = page === 'home';
  $('#page-home').hidden = !home;
  const lg = $('#page-legal');
  lg.hidden = home;
  if (!home) { lg.innerHTML = legalHTML(page); setSpy(null); }
}
const SPY_ORDER = ['pillars', 'services', 'model', 'difference', 'proof', 'approach', 'contact'];
const spyVisible = new Set();
function setSpy(id) {
  $$('.site-nav a[data-nav]').forEach(a => { if (a.dataset.nav === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
}
function initSpy() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) spyVisible.add(en.target.id); else spyVisible.delete(en.target.id); });
    const cur = [...SPY_ORDER].reverse().find(id => spyVisible.has(id));
    setSpy(cur || null);
  }, { rootMargin: '-45% 0px -50% 0px' });
  SPY_ORDER.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
}

/* =========================================================
   Routing
   ========================================================= */
const SITE_SECTIONS = ['home', 'pillars', 'services', 'model', 'difference', 'proof', 'approach', 'contact'];
let pendingFocus = null, pendingArea = null, firstRoute = true;

function showSurface(s) {
  if (state.surface !== s) {
    if (s !== 'portal') { $('#portal-main').innerHTML = ''; $('#portal-main').dataset.view = ''; state.view = null; }
    if (s !== 'admin') { $('#admin-main').innerHTML = ''; $('#admin-main').dataset.view = ''; state.admin.view = null; }
  }
  state.surface = s;
  ddClose(false);
  $('#site').hidden = s !== 'site';
  $('#portal').hidden = s !== 'portal' || state.signedOut;
  $('#signed-out').hidden = !(s === 'portal' && state.signedOut);
  $('#admin').hidden = s !== 'admin' || !state.admin.signedIn;
  $('#admin-signin').hidden = !(s === 'admin' && !state.admin.signedIn);
  document.body.classList.toggle('mode-portal', s !== 'site');
  $$('[data-surface-link]').forEach(a => { if (a.dataset.surfaceLink === s) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
function goSection(h, initial) {
  document.title = 'Hyacinth Legal Support · Managed operations for midsize law firms';
  const el = h === 'home' ? null : document.getElementById(h);
  if (pendingArea) {
    if (state.contact.submitted) { state.contact.submitted = false; renderContactForm(); }
    if ($('#c-area')) ddSet('c-area', pendingArea);
    state.contact.values['c-area'] = pendingArea;
    pendingArea = null;
  }
  const behavior = (initial || reduced()) ? 'auto' : 'smooth';
  const pf = pendingFocus;
  pendingFocus = null;
  requestAnimationFrame(() => {
    if (!el) window.scrollTo({ top: 0, behavior });
    else el.scrollIntoView({ behavior, block: 'start' });
    if (!initial) {
      const f = (pf && $(pf)) || (el ? el.querySelector('h1[tabindex],h2[tabindex]') : $('#hero-title'));
      if (f) f.focus({ preventScroll: true });
    }
  });
}
function closeTransient() {
  closePop(false);
  ddClose(false);
  const asb = $('#admin-sidebar');
  if (isOpen(asb)) closeLayer(asb, { restoreFocus: false });
  const mm = $('#mobile-menu');
  if (isOpen(mm)) closeLayer(mm, { restoreFocus: false });
  const sb = $('#sidebar');
  if (isOpen(sb)) closeLayer(sb, { restoreFocus: false });
  closeLayer(modalRoot(), { restoreFocus: false });
  closeLayer($('#sheet-root'), { restoreFocus: false });
  const ms = $('#mobile-search');
  if (ms.classList.contains('is-open')) { ms.classList.remove('is-open'); $('[data-action="toggle-search"]').setAttribute('aria-expanded', 'false'); }
}
function route(opts = {}) {
  const initial = firstRoute;
  firstRoute = false;
  let h = '';
  try { h = decodeURIComponent((location.hash || '').slice(1)); } catch (_) { h = ''; }
  h = h || 'home';
  if (contentGuard(h)) { firstRoute = initial; return; }
  closeTransient();
  if (SITE_SECTIONS.includes(h)) {
    showSurface('site'); showSitePage('home'); goSection(h, initial);
  } else if (LEGAL[h]) {
    showSurface('site'); showSitePage(h);
    window.scrollTo(0, 0);
    document.title = `${LEGAL[h].title} · Hyacinth Legal Support`;
    if (!initial) $('#legal-title').focus({ preventScroll: true });
  } else if (VIEWS[h]) {
    showSurface('portal');
    if (state.signedOut) { state.pendingView = h; document.title = 'Signed out · Hyacinth client portal'; $('#so-title').focus(); return; }
    const pf = pendingFocus; pendingFocus = null;
    if (opts.same || state.view !== h || $('#portal-main').dataset.view !== h) renderView(h, { focus: !initial && !pf });
    if (pf) { const f = $(pf); if (f) f.focus(); }
  } else if (AVIEWS[h]) {
    showSurface('admin');
    routeAdmin(h, initial);
  } else {
    const fb = h.startsWith('admin') || state.surface === 'admin' ? 'admin' : state.surface === 'portal' ? 'overview' : 'home';
    firstRoute = initial;
    let replaced = false;
    try { history.replaceState(null, '', '#' + fb); replaced = location.hash === '#' + fb; } catch (_) { replaced = false; }
    toast(`Nothing lives at “#${h.slice(0, 40)}”. Showing ${fb === 'home' ? 'the home page' : fb === 'admin' ? 'the admin dashboard' : 'Overview'} instead.`, { icon: 'alert' });
    if (replaced) route(opts); else location.hash = fb;
  }
}

/* =========================================================
   Portal: shared pieces
   ========================================================= */
const main = () => $('#portal-main');
const setRegion = (name, html) => { const el = $(`[data-region="${name}"]`, main()); if (el) el.innerHTML = html; return el; };
const band = ({ eyebrow, title, sub, actions = '', extra = '' }) => `
  <section class="pband on-ink" aria-labelledby="view-title"><div class="wrap">
    <div class="pband-row"><div class="stack-8">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1 class="ph1" id="view-title" tabindex="-1">${title}</h1>${sub ? `<p class="pband-sub">${sub}</p>` : ''}</div>${actions ? `<div class="pband-actions">${actions}</div>` : ''}</div>
    ${extra}</div><div class="sigbar" role="presentation"></div></section>`;
const bandStats = items => items.map(([v, l]) => `<div class="band-stat"><b>${v}</b><span>${l}</span></div>`).join('');
const avatar = (key, cls = '') => `<span class="avatar ${cls}" aria-hidden="true">${initials(TEAM[key].name)}</span>`;
const statusBadge = s => `<span class="badge st-${s}">${icon({ 'on-track': 'clock', 'at-risk': 'alert', review: 'eye', blocked: 'block', complete: 'check' }[s], 14)}${STATUS[s]}</span>`;
const statusSelect = (w, prefix, size = 'sm') => dd(`${prefix}-${w.id}`, { kind: 'status', size, ariaLabel: `Status for ${w.id}`, title: `Status for ${w.id}`, value: w.status, options: STATUS_OPTS(), onChange: v => setStatus(w.id, v) });
const emptyState = ({ ic = 'inbox', title, text, actions = '' }) => `<div class="state-panel"><span class="state-icon">${icon(ic, 24)}</span><h3 class="h4">${title}</h3><p class="small">${text}</p>${actions ? `<div class="state-actions">${actions}</div>` : ''}</div>`;
const errorState = ({ title, text, retry, extra = '' }) => `<div class="state-panel error" role="alert"><span class="state-icon">${icon('alert', 24)}</span><h3 class="h4">${title}</h3><p class="small">${text}</p><div class="state-actions"><button class="btn btn-dark btn-sm" type="button" id="${retry}-btn" data-action="${retry}">${icon('refresh', 16)}Try again</button>${extra}</div></div>`;

function updateChrome() {
  const open = openWfs().length, wk = weekDeadlines().length;
  const so = $('[data-count="open"]'), sw = $('[data-count="week"]');
  so.textContent = open; so.setAttribute('aria-label', `${open} open`);
  sw.textContent = wk; sw.setAttribute('aria-label', `${wk} due this week`);
  const unread = state.notifications.filter(n => n.unread).length;
  const dot = $('#bell-dot');
  dot.textContent = unread; dot.hidden = unread === 0;
  $('#bell-btn').setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications, none unread');
  $('[data-action="notif-read-all"]').disabled = unread === 0;
  $('#notif-list').innerHTML = state.notifications.map(n => `<button type="button" class="notif ${n.unread ? 'unread' : ''}" data-action="notif-open" data-id="${n.id}"><span class="dot" aria-hidden="true"></span><span><span class="n-text">${esc(n.text)}</span><span class="small">${esc(n.time)}${n.unread ? ' · Unread' : ''}</span></span></button>`).join('');
  const p = state.profile;
  $$('#profile-btn .avatar').forEach(a => { a.textContent = initials(p.name); });
  $('#profile-btn .who b').textContent = p.name;
  $('#profile-btn .who span').textContent = p.title;
  const F = pFirm();
  if (F) {
    $('#firm-chip').innerHTML = `<b>${esc(F.name)}</b><span>${F.status === 'Onboarding' ? 'Onboarding with Hyacinth' : `Managed by Hyacinth since ${F.since.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}</span>`;
    $('#crumb-firm').textContent = F.name;
    const L = TEAM[F.lead];
    $('#portal-lead').innerHTML = `<span class="person"><span class="avatar">${initials(L.name)}</span><span><b>${esc(L.name)}</b><span class="small">Your engagement lead</span></span></span><button class="btn btn-ghost btn-sm" type="button" data-action="message" data-member="${F.lead}">${icon('message', 18)}Message ${esc(L.name.split(' ')[0])}</button>`;
  }
  const va = $('#viewas');
  va.hidden = !state.viewAs;
  if (state.viewAs && F && !(ddo && ddo.id === 'va-firm')) va.innerHTML = `<div class="wrap"><span>${icon('eye', 16)} <b>Admin preview.</b> You are viewing the client portal as ${esc(F.name)}. Changes here update the shared demo data.</span><span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="sr-only" id="va-firm-l">Preview firm</span><span style="min-width:220px">${dd('va-firm', { kind: 'combo', size: 'sm', labelId: 'va-firm-l', title: 'Preview firm', value: F.id, options: firmOpts(), onChange: v => viewAsClient(v) })}</span><button class="btn btn-dark btn-sm" type="button" data-action="exit-viewas">Exit preview</button></span></div>`;
}

/* =========================================================
   Overview
   ========================================================= */
function ovShell() {
  const h = new Date().getHours();
  const g = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  return band({
    eyebrow: fmtLong(TODAY),
    title: `Good ${g}, ${esc(state.profile.name.split(' ')[0])}.`,
    sub: `Here is what your Hyacinth team is running for ${esc(pFirm().name)} right now.`,
    actions: `<a class="btn btn-ghost btn-sm" href="#reports">${icon('file', 18)}${esc(REPORTS[0].label)} report</a><button class="btn btn-primary btn-sm" type="button" data-action="new-wf">${icon('plus', 18)}Request a workflow</button>`,
    extra: '<div class="kpis" data-region="kpis"></div>'
  }) + `
  <div class="wrap pcontent">
    <div class="ov-grid">
      <section class="card" aria-labelledby="trend-h">
        <div class="card-head"><div><h2 class="h4" id="trend-h">Workload trend</h2><p class="small">Items opened and completed by your Hyacinth team each week</p></div>
          <div class="card-tools"><div class="seg" role="group" aria-label="Trend range"><button type="button" id="tr-6" data-action="trend-range" data-range="6" aria-pressed="false">6 weeks</button><button type="button" id="tr-12" data-action="trend-range" data-range="12" aria-pressed="false">12 weeks</button></div>
          <button class="btn btn-quiet btn-sm" type="button" id="tr-table" data-action="trend-table" aria-pressed="false">${icon('list', 18)}Table view</button></div></div>
        <div class="card-body" data-region="trend"></div>
      </section>
      <section class="card" aria-labelledby="ex-h">
        <div class="card-head"><div style="display:flex;align-items:center;gap:10px"><h2 class="h4" id="ex-h" tabindex="-1">Exceptions</h2><span class="count-badge" data-region="ex-count"></span></div>
          <div class="seg" role="group" aria-label="Which exceptions to show"><button type="button" id="exv-open" data-action="ex-view" data-v="open" aria-pressed="true">Open</button><button type="button" id="exv-snoozed" data-action="ex-view" data-v="snoozed" aria-pressed="false">Snoozed <span data-region="snz-count"></span></button></div></div>
        <div data-region="exceptions"></div>
      </section>
    </div>
    <div class="ov-grid b">
      <section class="card" aria-labelledby="nd-h">
        <div class="card-head"><div><h2 class="h4" id="nd-h">Next deadlines</h2><p class="small">Filings and deliverables coming up</p></div><a class="btn btn-quiet btn-sm" href="#deadlines">Open calendar ${icon('arrow-right', 18)}</a></div>
        <div data-region="next-dl"></div>
      </section>
      <section class="card" aria-labelledby="team-h">
        <div class="card-head"><div><h2 class="h4" id="team-h">Your Hyacinth team</h2><p class="small">Dedicated to ${esc(pFirm().name)}</p></div><a class="btn btn-quiet btn-sm" href="#help">Get support ${icon('arrow-right', 18)}</a></div>
        <div data-region="team"></div>
      </section>
    </div>
  </div>`;
}
function ovUpdate() {
  const open = openWfs().length, risk = countStatus('at-risk'), review = countStatus('review');
  const wk = weekDeadlines(), wkRisk = wk.filter(d => d.atRisk).length;
  const kpi = (href, label, value, foot, attrs = '') => `<a class="kpi" href="${href}" ${attrs}><span class="kpi-label">${label}</span><span class="kpi-value">${value}</span><span class="kpi-foot"><span>${foot}</span>${icon('arrow-right', 18)}</span></a>`;
  setRegion('kpis', [
    kpi('#workflows', 'Open workflows', open, `${risk} at risk`, 'data-wf-status="all"'),
    kpi('#deadlines', 'Deadlines this week', wk.length, `${wkRisk} flagged at risk`),
    kpi('#workflows', 'Awaiting attorney review', review, 'Waiting on your attorneys', 'data-wf-status="review"'),
    kpi('#reports', 'SLA on time, last 30 days', slaPct() == null ? '—' : slaPct().toFixed(1) + '%', slaPct() == null ? 'Not enough data yet' : 'Target 95%')
  ].join(''));
  ['6', '12'].forEach(r => { const b = $('#tr-' + r); if (b) b.setAttribute('aria-pressed', String(state.trend.range === +r)); });
  const tb = $('#tr-table');
  if (tb) { tb.setAttribute('aria-pressed', String(state.trend.table)); tb.lastChild.textContent = state.trend.table ? 'Chart view' : 'Table view'; }
  renderTrend();
  renderExceptions();
  const up = activeDeadlines().filter(d => !d.done && diffDays(d.date) >= 0).sort((a, b) => a.date - b.date).slice(0, 5);
  setRegion('next-dl', up.length ? `<div class="row-list">${up.map(d => {
    const w = getWf(d.wf);
    return `<button type="button" class="row-item" data-action="open-wf" data-id="${d.wf}"><span class="date-chip ${diffDays(d.date) === 0 ? 'today' : ''}"><small>${fmt(d.date, { month: 'short' })}</small><b>${d.date.getDate()}</b></span><span><span class="row-title" style="display:block">${esc(d.title)}</span><span class="row-sub" style="display:block">${esc(d.kind)} · ${esc(w.matter)} · ${relDue(d.date)}</span></span>${d.atRisk ? `<span class="risk-tag">${icon('flag', 16)}At risk</span>` : icon('chevron-right', 18)}</button>`;
  }).join('')}</div>` : emptyState({ ic: 'calendar', title: 'No upcoming deadlines', text: 'Nothing is due in the coming weeks.', actions: '<a class="btn btn-ghost btn-sm" href="#deadlines">Open the calendar</a>' }));
  setRegion('team', `<div class="row-list">${pFirm().team.slice(0, 5).map(k => [k, TEAM[k]]).map(([k, t]) => {
    const n = openWfs().filter(w => w.owner === k).length;
    return `<div class="row-item">${avatar(k)}<span><span class="row-title" style="display:block">${esc(t.name)}</span><span class="row-sub" style="display:block">${esc(t.role)} · ${n} active ${n === 1 ? 'workflow' : 'workflows'}</span></span><button class="btn btn-quiet btn-sm" type="button" id="msg-${k}" data-action="message" data-member="${k}" aria-label="Message ${esc(t.name)}">${icon('message', 18)}<span>Message</span></button></div>`;
  }).join('')}</div>`);
}
function renderExceptions() {
  const all = activeExceptions();
  const openList = all.filter(e => !e.snoozedUntil), snoozed = all.filter(e => e.snoozedUntil);
  setRegion('ex-count', openList.length);
  setRegion('snz-count', `(${snoozed.length})`);
  ['open', 'snoozed'].forEach(v => { const b = $('#exv-' + v); if (b) b.setAttribute('aria-pressed', String(state.exView === v)); });
  const list = state.exView === 'open' ? openList : snoozed;
  let html;
  if (!list.length) {
    html = state.exView === 'open'
      ? emptyState({ ic: 'check', title: 'No open exceptions', text: 'Your Hyacinth team has nothing waiting on a decision right now.', actions: snoozed.length ? `<button class="btn btn-ghost btn-sm" type="button" data-action="ex-view" data-v="snoozed">Show snoozed (${snoozed.length})</button>` : '<a class="btn btn-ghost btn-sm" href="#workflows">Review workflows</a>' })
      : emptyState({ ic: 'clock', title: 'Nothing snoozed', text: 'Snoozed exceptions appear here until their snooze ends.', actions: '<button class="btn btn-ghost btn-sm" type="button" data-action="ex-view" data-v="open">Back to open exceptions</button>' });
  } else {
    html = `<div class="ex-list">${list.map(e => {
      const w = getWf(e.wf);
      const acts = state.exView === 'open'
        ? `<button class="btn btn-dark btn-sm" type="button" id="exr-${e.id}" data-action="ex-resolve" data-id="${e.id}">${icon('check', 16)}Resolve</button><button class="btn btn-ghost btn-sm" type="button" id="exs-${e.id}" data-action="ex-snooze" data-id="${e.id}" aria-haspopup="menu" aria-expanded="false" aria-label="Snooze: ${esc(e.title)}">${icon('clock', 16)}Snooze${icon('chevron-down', 16)}</button>`
        : `<span class="small">Snoozed until ${fmtDay(e.snoozedUntil)}</span><button class="btn btn-ghost btn-sm" type="button" id="exu-${e.id}" data-action="ex-unsnooze" data-id="${e.id}">Unsnooze</button>`;
      return `<article class="ex" aria-labelledby="ext-${e.id}"><span class="sev ${e.sev}">${icon(e.sev === 'high' ? 'alert' : 'clock', 16)}</span><div>
        <h3 class="ex-title" id="ext-${e.id}">${esc(e.title)}</h3><p class="ex-detail">${esc(e.detail)}</p>
        <p class="ex-meta"><span>${e.sev === 'high' ? 'High priority' : 'Normal priority'}</span><span aria-hidden="true">·</span><span>${esc(e.age)}</span><span aria-hidden="true">·</span><button class="text-btn" type="button" data-action="open-wf" data-id="${e.wf}">${e.wf}: ${esc(w.title)}</button></p>
        <div class="ex-actions">${acts}</div></div></article>`;
    }).join('')}</div>`;
  }
  setRegion('exceptions', html);
}

/* ---------- Line chart (inline SVG) ---------- */
function niceStep(raw) { const p = Math.pow(10, Math.floor(Math.log10(raw))); const n = raw / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function renderTrend() {
  const el = $('[data-region="trend"]', main());
  if (!el) return;
  const n = state.trend.range;
  const labels = TREND.labels.slice(-n), op = TREND.opened.slice(-n), cp = TREND.completed.slice(-n);
  if (state.trend.table) {
    el.innerHTML = `<div class="table-wrap" tabindex="0" role="region" aria-label="Workload trend table" style="border-top:0"><table class="mini-table"><caption class="sr-only">Items opened and completed per week</caption><thead><tr><th scope="col">Week of</th><th scope="col">Opened</th><th scope="col">Completed</th></tr></thead><tbody>${labels.map((l, i) => `<tr><td>${l}</td><td>${op[i]}</td><td>${cp[i]}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">Total</th><td><b>${sum(op)}</b></td><td><b>${sum(cp)}</b></td></tr></tfoot></table></div>`;
    return;
  }
  el.innerHTML = `<div class="chart-wrap" tabindex="0" role="group" aria-roledescription="chart" aria-label="Workload trend chart. Use the left and right arrow keys to read each week." aria-describedby="trend-sum"><div class="chart-svg"></div><div class="chart-tip" aria-hidden="true"></div></div>
    <div class="legend"><span><i class="key-line" style="background:var(--ink)"></i>Opened</span><span><i class="key-line" style="background:var(--gold)"></i>Completed</span></div>
    <p class="sr-only" id="trend-sum">Over the last ${n} weeks your team opened ${sum(op)} items and completed ${sum(cp)}. Most recent week: ${op[n - 1]} opened, ${cp[n - 1]} completed.</p>
    <p class="chart-hint">Hover or use arrow keys for weekly values.</p>`;
  drawLine($('.chart-wrap', el), labels, [{ name: 'Opened', values: op, color: 'var(--ink)' }, { name: 'Completed', values: cp, color: 'var(--gold)', area: true }]);
}
function drawLine(wrap, labels, series) {
  const holder = $('.chart-svg', wrap), tip = $('.chart-tip', wrap);
  const W = Math.max(280, Math.floor(holder.getBoundingClientRect().width || 600));
  const H = W < 520 ? 220 : 260;
  const m = { t: 16, r: 40, b: 30, l: 36 };
  const n = labels.length;
  const maxV = Math.max(...series.flatMap(s => s.values));
  const step = niceStep(maxV / 4);
  const max = Math.ceil(maxV * 1.08 / step) * step;
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const x = i => m.l + (n === 1 ? iw / 2 : i * iw / (n - 1));
  const y = v => m.t + ih - (v / max) * ih;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  for (let v = 0; v <= max + 0.001; v += step) s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--hairline)" stroke-width="1"/><text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11">${v}</text>`;
  const every = W < 520 ? Math.ceil(n / 4) : (n > 8 ? 2 : 1);
  labels.forEach((l, i) => { if ((n - 1 - i) % every === 0) s += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11">${l}</text>`; });
  const ends = [];
  series.forEach(sr => {
    const pts = sr.values.map((v, i) => [x(i), y(v)]);
    const d = 'M' + pts.map(p => p.map(c => c.toFixed(1)).join(',')).join('L');
    if (sr.area) s += `<path d="${d}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z" style="fill:${sr.color};fill-opacity:.12"/>`;
    s += `<path d="${d}" fill="none" style="stroke:${sr.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    ends.push({ y: pts[n - 1][1], v: sr.values[n - 1], color: sr.color });
  });
  ends.forEach(e => { s += `<circle cx="${x(n - 1)}" cy="${e.y}" r="4.5" style="fill:${e.color};stroke:var(--white)" stroke-width="2"/>`; });
  if (ends.length === 2 && Math.abs(ends[0].y - ends[1].y) >= 14) ends.forEach(e => { s += `<text x="${x(n - 1) + 10}" y="${e.y + 4}" font-size="12" font-weight="600">${e.v}</text>`; });
  s += `<g class="hover" visibility="hidden"><line class="xh" y1="${m.t}" y2="${m.t + ih}" style="stroke:var(--ink)" stroke-opacity=".3" stroke-width="1"/>${series.map((sr, k) => `<circle class="hd${k}" r="5" style="fill:${sr.color};stroke:var(--white)" stroke-width="2"/>`).join('')}</g>`;
  s += `<rect class="hit" x="${m.l - 10}" y="0" width="${iw + 20}" height="${H}" style="fill:transparent"/></svg>`;
  holder.innerHTML = s;
  const svg = $('svg', holder), g = $('.hover', svg);
  let idx = -1;
  const show = i => {
    idx = Math.max(0, Math.min(n - 1, i));
    g.setAttribute('visibility', 'visible');
    const xl = $('.xh', g); xl.setAttribute('x1', x(idx)); xl.setAttribute('x2', x(idx));
    series.forEach((sr, k) => { const c = $('.hd' + k, g); c.setAttribute('cx', x(idx)); c.setAttribute('cy', y(sr.values[idx])); });
    tip.innerHTML = `<b>Week of ${labels[idx]}</b>${series.map(sr => `<div class="row"><span><i class="key-line" style="background:${sr.color === 'var(--ink)' ? 'var(--ivory)' : sr.color}"></i>${sr.name}</span><strong>${sr.values[idx]}</strong></div>`).join('')}`;
    const tw = 180;
    let left = x(idx) + 14;
    if (left + tw > W) left = x(idx) - tw - 14;
    tip.style.left = Math.max(0, left) + 'px';
    tip.style.top = m.t + 'px';
    tip.classList.add('show');
  };
  const hide = () => { g.setAttribute('visibility', 'hidden'); tip.classList.remove('show'); idx = -1; };
  svg.addEventListener('pointermove', e => { const r = svg.getBoundingClientRect(); const px = (e.clientX - r.left) * (W / r.width); show(Math.round((px - m.l) / (iw / (n - 1)))); });
  svg.addEventListener('pointerleave', hide);
  wrap.onkeydown = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx < 0 ? n - 1 : idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx < 0 ? n - 1 : idx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0); }
    else if (e.key === 'End') { e.preventDefault(); show(n - 1); }
  };
  wrap.onfocus = () => show(n - 1);
  wrap.onblur = hide;
}

/* =========================================================
   Workflows
   ========================================================= */
const WF_COLS = [['id', 'ID'], ['title', 'Workflow'], ['area', 'Service area'], ['owner', 'Owner'], ['status', 'Status'], ['due', 'Due'], ['progress', 'Progress']];
const CHIP_STATUSES = ['all', 'on-track', 'at-risk', 'review', 'blocked', 'complete'];
function wfShell() {
  return band({
    eyebrow: 'Visible execution', title: 'Workflows',
    sub: 'Every workflow your Hyacinth team is running, by service area.',
    actions: `<button class="btn btn-primary btn-sm" type="button" data-action="new-wf">${icon('plus', 18)}New workflow</button>`,
    extra: '<div class="kpis" data-region="wf-stats"></div>'
  }) + `
  <div class="wrap pcontent"><section class="card" aria-label="Workflow list">
    <div class="toolbar">
      <div class="search-field">${icon('search', 18)}<label class="sr-only" for="wf-q">Search workflows</label><input class="input" id="wf-q" type="search" placeholder="Search by workflow, matter, owner or ID" value="${esc(state.wf.q)}" data-input="wf-q" autocomplete="off"></div>
      <div class="field-inline"><span class="flabel-i" id="wf-area-l">Service area</span>${dd('wf-area', { kind: 'multi', labelId: 'wf-area-l', title: 'Service areas', placeholder: 'All service areas', value: state.wf.area, options: areaOpts().map(o => ({ ...o, short: o.label.split(' ')[0] })), onChange: v => { state.wf.area = v; wfUpdate(); } })}</div>
      <div class="field-inline"><span class="flabel-i" id="wf-owner-l">Owner</span>${dd('wf-owner', { kind: 'combo', labelId: 'wf-owner-l', title: 'Owner', value: state.wf.owner, options: [{ value: 'all', label: 'All owners' }].concat(pFirm().team.map(k => ({ value: k, label: TEAM[k].name, sub: TEAM[k].role }))), onChange: v => { state.wf.owner = v; wfUpdate(); } })}</div>
      <div class="toolbar-actions"><button class="btn btn-quiet" type="button" id="wf-clear" data-action="wf-clear">Clear filters</button><button class="icon-btn" type="button" id="wf-refresh" data-action="wf-refresh" aria-label="Refresh workflows">${icon('refresh')}</button></div>
    </div>
    <div class="chips" role="group" aria-label="Filter by status">${CHIP_STATUSES.map(s => `<button type="button" class="chip" id="chip-${s}" data-action="wf-chip" data-status="${s}" aria-pressed="false">${s === 'all' ? 'All' : STATUS[s]} <span class="n" data-n="${s}"></span></button>`).join('')}</div>
    <div data-region="wf-table"></div>
  </section></div>`;
}
function wfMount() { if (!state.wfLoaded) wfLoad(); }
function wfLoad(fromRefresh) {
  state.wfLoading = true; state.wfError = false;
  const reg = setRegion('wf-table', `<div aria-busy="true"><p class="sr-only">Loading workflows</p><div class="table-wrap"><table class="data" aria-hidden="true"><thead><tr>${WF_COLS.map(c => `<th>${c[1]}</th>`).join('')}<th></th></tr></thead><tbody>${Array.from({ length: 7 }, () => `<tr class="sk-row">${[50, 220, 140, 120, 100, 80, 96, 24].map(w => `<td><span class="sk" style="height:12px;width:${w}px"></span></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`);
  if (reg) reg.setAttribute('aria-busy', 'true');
  const fail = state.simulateError;
  setTimeout(() => {
    state.wfLoading = false;
    if (fail) { state.simulateError = false; state.wfError = true; }
    else { state.wfLoaded = true; if (fromRefresh) toast('Workflows refreshed.'); }
    if (state.view === 'workflows') { const r = $('[data-region="wf-table"]'); if (r) r.removeAttribute('aria-busy'); wfUpdate(); if (fail) { const b = $('#wf-retry-btn'); if (b && fromRefresh !== 'quiet') b.focus({ preventScroll: true }); } }
  }, reduced() ? 300 : 800);
}
function filteredWfs() {
  const { q, area, owner, status, sort, dir } = state.wf;
  const ql = q.trim().toLowerCase();
  const list = pWfs().filter(w => (!area.length || area.includes(w.area)) && (owner === 'all' || w.owner === owner) && (status === 'all' || w.status === status) &&
    (!ql || [w.id, w.title, w.matter, TEAM[w.owner].name, AREAS[w.area], typeLabel(w.type), STATUS[w.status]].join(' ').toLowerCase().includes(ql)));
  const key = { id: w => w.id, title: w => w.title.toLowerCase(), area: w => AREAS[w.area], owner: w => TEAM[w.owner].name, status: w => STATUS_ORDER.indexOf(w.status), due: w => w.due.getTime(), progress: w => doneCount(w) / w.steps.length }[sort];
  return list.sort((a, b) => { const A = key(a), B = key(b); return ((A < B ? -1 : A > B ? 1 : 0) * (dir === 'asc' ? 1 : -1)) || a.id.localeCompare(b.id); });
}
const hasFilters = () => !!(state.wf.q.trim() || state.wf.area.length || state.wf.owner !== 'all' || state.wf.status !== 'all');
function wfUpdate() {
  setRegion('wf-stats', kpiRow([
    { label: 'Open workflows', value: openWfs().length, foot: state.wf.status === 'all' ? `${pWfs().length} including complete` : 'Show all workflows', action: 'kpi-wf', attrs: 'data-s="all"', id: 'kw-all', pressed: state.wf.status === 'all' },
    { label: 'At risk', value: countStatus('at-risk'), foot: 'Needs attention now', action: 'kpi-wf', attrs: 'data-s="at-risk"', id: 'kw-at-risk', pressed: state.wf.status === 'at-risk' },
    { label: 'Awaiting attorney review', value: countStatus('review'), foot: 'Waiting on your attorneys', action: 'kpi-wf', attrs: 'data-s="review"', id: 'kw-review', pressed: state.wf.status === 'review' },
    { label: 'Blocked', value: countStatus('blocked'), foot: 'Waiting on a decision', action: 'kpi-wf', attrs: 'data-s="blocked"', id: 'kw-blocked', pressed: state.wf.status === 'blocked' }
  ]));
  CHIP_STATUSES.forEach(s => {
    const b = $('#chip-' + s); if (!b) return;
    b.setAttribute('aria-pressed', String(state.wf.status === s));
    $('[data-n]', b).textContent = s === 'all' ? pWfs().length : countStatus(s);
  });
  const q = $('#wf-q'); if (q && q.value !== state.wf.q && document.activeElement !== q) q.value = state.wf.q;
  if (DD.get('wf-area') && JSON.stringify(ddVal('wf-area')) !== JSON.stringify(state.wf.area)) ddSet('wf-area', state.wf.area);
  if (DD.get('wf-owner') && ddVal('wf-owner') !== state.wf.owner) ddSet('wf-owner', state.wf.owner);
  const c = $('#wf-clear'); if (c) c.disabled = !hasFilters();
  if (state.wfLoading) return;
  if (state.wfError) {
    setRegion('wf-table', errorState({ title: 'Workflows didn’t load', text: 'The connection to the workflow service timed out. Your filters are kept. Try again, or come back in a minute.', retry: 'wf-retry', extra: '<a class="btn btn-ghost btn-sm" href="#overview">Go to Overview</a>' }));
    return;
  }
  const list = filteredWfs();
  if (!list.length) {
    setRegion('wf-table', `<div style="border-top:1px solid var(--hairline)">${emptyState({ ic: 'search', title: 'No workflows match these filters', text: state.wf.q ? `Nothing matches “${esc(state.wf.q)}” with the current filters. Try a different search or clear the filters.` : 'Try another status or service area, or clear the filters to see every workflow.', actions: `<button class="btn btn-dark btn-sm" type="button" data-action="wf-clear">Clear filters</button><button class="btn btn-ghost btn-sm" type="button" data-action="new-wf">${icon('plus', 16)}New workflow</button>` })}</div>`);
    return;
  }
  const th = WF_COLS.map(([k, l]) => `<th scope="col" aria-sort="${state.wf.sort === k ? (state.wf.dir === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="sort" id="sort-${k}" data-action="wf-sort" data-key="${k}">${l}${icon('chevron-down', 14)}</button></th>`).join('') + '<th scope="col"><span class="sr-only">Actions</span></th>';
  const rows = list.map(w => {
    const d = doneCount(w), n = w.steps.length, dd = diffDays(w.due);
    const dueSub = w.status === 'complete' ? 'Completed' : dd < 0 ? `<span class="overdue">${icon('alert', 14)}${relDue(w.due)}</span>` : relDue(w.due);
    return `<tr class="${state.newIds.has(w.id) ? 'is-new' : ''}">
      <td class="mono">${w.id}</td>
      <td style="min-width:240px"><button type="button" class="wf-link" data-action="open-wf" data-id="${w.id}">${esc(w.title)}</button><div class="cell-sub">${esc(w.matter)}</div></td>
      <td style="min-width:170px">${esc(AREAS[w.area])}<div class="cell-sub">${esc(typeLabel(w.type))}</div></td>
      <td><span class="person">${avatar(w.owner)}${esc(TEAM[w.owner].name)}</span></td>
      <td>${statusSelect(w, 'st')}</td>
      <td class="due-cell"><time datetime="${iso(w.due)}">${fmtD(w.due)}</time><div class="cell-sub">${w.status === 'complete' ? 'Completed' : dueChip(w.due)}</div></td>
      <td><div class="prog"><div class="prog-track"><div class="prog-fill" style="width:${Math.round(d / n * 100)}%"></div></div><span>${d} of ${n} steps</span></div></td>
      <td><button class="icon-btn" type="button" id="more-${w.id}" data-action="wf-menu" data-id="${w.id}" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for ${w.id}">${icon('more')}</button></td></tr>`;
  }).join('');
  const sortLabel = WF_COLS.find(c => c[0] === state.wf.sort)[1];
  setRegion('wf-table', `<div class="table-wrap" tabindex="0" role="region" aria-label="Workflows table, scrolls sideways on small screens"><table class="data"><caption class="sr-only">Active workflows. Column headers sort the table.</caption><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="result-bar"><span aria-live="polite">Showing ${list.length} of ${pWfs().length} workflows</span><span>Sorted by ${sortLabel.toLowerCase()}, ${state.wf.dir === 'asc' ? 'ascending' : 'descending'}</span></div>`);
  state.newIds.clear();
}

/* =========================================================
   Deadlines
   ========================================================= */
function dlShell() {
  return band({ eyebrow: 'Filings and deliverables', title: 'Deadlines', sub: 'Filings, discovery dates and client deliverables your Hyacinth team is tracking.', extra: '<div class="kpis k3" data-region="dl-stats"></div>' }) + `
  <div class="wrap pcontent">
    <section class="card" aria-labelledby="dl-range-h" style="overflow:hidden">
      <div class="cal-bar">
        <div class="cal-nav"><button class="icon-btn" type="button" id="dl-prev" data-action="dl-prev" aria-label="Previous week">${icon('chevron-left')}</button><button class="btn btn-ghost btn-sm" type="button" id="dl-today" data-action="dl-today">Today</button><button class="icon-btn" type="button" id="dl-next" data-action="dl-next" aria-label="Next week">${icon('chevron-right')}</button><h2 class="range-label" id="dl-range-h" data-region="dl-range" aria-live="polite"></h2></div>
        <div class="card-tools"><span class="sr-only" id="dl-goto-l">Go to date</span><div style="width:190px">${dd('dl-goto', { kind: 'date', size: 'sm', labelId: 'dl-goto-l', title: 'Go to date', placeholder: 'Go to date', value: null, markers: dlMarkers(false), onChange: v => { if (!v) return; state.dl.day = state.dl.mode === 'month' ? v : null; state.dl.anchor = state.dl.mode === 'week' ? weekStart(v) : new Date(v.getFullYear(), v.getMonth(), 1); dlUpdate(); announce(`Showing ${fmtD(v)}`); } })}</div></div>
        <div class="card-tools"><span class="risk-toggle"><button class="switch" type="button" role="switch" id="dl-risk" data-action="dl-risk" aria-checked="false" aria-labelledby="dl-risk-l"></button><span id="dl-risk-l">At-risk only</span></span>
          <div class="seg" role="group" aria-label="Calendar view"><button type="button" id="dlm-week" data-action="dl-mode" data-mode="week" aria-pressed="true">Week</button><button type="button" id="dlm-month" data-action="dl-mode" data-mode="month" aria-pressed="false">Month</button></div></div>
      </div>
      <div data-region="dl-cal"></div>
    </section>
    <section class="card" aria-labelledby="agenda-h">
      <div class="card-head"><div><h2 class="h4" id="agenda-h">Agenda</h2><p class="small" data-region="agenda-sub"></p></div><div data-region="agenda-tools"></div></div>
      <div data-region="agenda"></div>
    </section>
  </div>`;
}
function dlRange() {
  const a = state.dl.anchor;
  if (state.dl.mode === 'week') return [a, addDays(6, a)];
  return [new Date(a.getFullYear(), a.getMonth(), 1), new Date(a.getFullYear(), a.getMonth() + 1, 0)];
}
const dlVisible = () => activeDeadlines().filter(d => !state.dl.riskOnly || d.atRisk);
const inRange = (d, [s, e]) => startOf(d) >= s && startOf(d) <= e;
function dlChip(d) {
  const cls = `${d.atRisk && !d.done ? 'risk' : ''} ${d.done ? 'done' : ''}`;
  const k = d.done ? `${icon('check', 12)}Met · ${esc(d.kind)}` : d.atRisk ? `${icon('flag', 12)}At risk · ${esc(d.kind)}` : esc(d.kind);
  return `<button type="button" class="dl-chip ${cls}" data-action="open-wf" data-id="${d.wf}"><span class="k">${k}</span><b>${esc(d.title)}</b><span class="k">${d.wf}</span></button>`;
}
function dlUpdate() {
  const all = activeDeadlines();
  const upcoming = all.filter(d => !d.done && diffDays(d.date) >= 0);
  setRegion('dl-stats', kpiRow([
    { label: 'Due in the next 7 days', value: weekDeadlines().length, foot: 'Show this week', action: 'kpi-dl', attrs: 'data-k="week"', id: 'kd-week' },
    { label: 'Flagged at risk', value: upcoming.filter(d => d.atRisk).length, foot: state.dl.riskOnly ? 'Showing at-risk only' : 'Show at-risk only', action: 'kpi-dl', attrs: 'data-k="risk"', id: 'kd-risk', pressed: state.dl.riskOnly },
    { label: 'Due in the next 30 days', value: upcoming.filter(d => diffDays(d.date) <= 30).length, foot: 'Show the month', action: 'kpi-dl', attrs: 'data-k="month"', id: 'kd-month' }
  ]));
  const [s, e] = dlRange();
  const wk = state.dl.mode === 'week';
  setRegion('dl-range', wk ? fmtRange(s, e) : fmt(s, { month: 'long', year: 'numeric' }));
  $('#dl-prev').setAttribute('aria-label', wk ? 'Previous week' : 'Previous month');
  $('#dl-next').setAttribute('aria-label', wk ? 'Next week' : 'Next month');
  $('#dlm-week').setAttribute('aria-pressed', String(wk));
  $('#dlm-month').setAttribute('aria-pressed', String(!wk));
  $('#dl-risk').setAttribute('aria-checked', String(state.dl.riskOnly));
  const vis = dlVisible();
  const on = day => vis.filter(d => sameDay(d.date, day)).sort((a, b) => Number(b.atRisk) - Number(a.atRisk));
  if (wk) {
    setRegion('dl-cal', `<div class="week">${Array.from({ length: 7 }, (_, i) => {
      const day = addDays(i, s), items = on(day), we = day.getDay() === 0 || day.getDay() === 6;
      return `<div class="day ${sameDay(day, TODAY) ? 'is-today' : ''} ${we ? 'is-weekend' : ''}" role="group" aria-label="${fmtLong(day)}${sameDay(day, TODAY) ? ', today' : ''}, ${items.length} ${items.length === 1 ? 'deadline' : 'deadlines'}"><div class="day-head"><span>${fmt(day, { weekday: 'short' })}</span><span class="day-num">${day.getDate()}</span></div><div class="day-items">${items.length ? items.map(dlChip).join('') : '<span class="day-empty">No deadlines</span>'}</div></div>`;
    }).join('')}</div>`);
  } else {
    const gs = weekStart(s);
    const weeks = Math.ceil((((e - gs) / DAY) + 1) / 7);
    let cells = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="m-dow" aria-hidden="true">${d}</div>`).join('');
    for (let i = 0; i < weeks * 7; i++) {
      const day = addDays(i, gs), items = on(day), out = day.getMonth() !== s.getMonth();
      const sel = state.dl.day && sameDay(state.dl.day, day);
      const lbl = `${fmtLong(day)}, ${items.length} ${items.length === 1 ? 'deadline' : 'deadlines'}. Show in agenda`;
      cells += `<div class="m-cell ${out ? 'out' : ''} ${sameDay(day, TODAY) ? 'is-today' : ''} ${sel ? 'is-selected' : ''}">${items.length ? `<button type="button" class="m-day" data-action="dl-day" data-date="${iso(day)}" aria-pressed="${sel ? 'true' : 'false'}" aria-label="${lbl}">${day.getDate()}</button>` : `<span class="m-day">${day.getDate()}</span>`}<span class="m-count" aria-hidden="true">${items.length ? `${items.length} due` : ''}</span>${items.slice(0, 2).map(dlChip).join('')}${items.length > 2 ? `<button type="button" class="m-more" data-action="dl-day" data-date="${iso(day)}">+${items.length - 2} more</button>` : ''}</div>`;
    }
    setRegion('dl-cal', `<div class="month">${cells}</div>`);
  }
  // Agenda
  const range = state.dl.day ? [state.dl.day, state.dl.day] : [s, e];
  const list = vis.filter(d => inRange(d.date, range)).sort((a, b) => a.date - b.date);
  const label = state.dl.day ? fmtLong(state.dl.day) : (wk ? 'This range' : fmt(s, { month: 'long' }));
  setRegion('agenda-sub', `${label} · ${list.length} ${list.length === 1 ? 'deadline' : 'deadlines'}${state.dl.riskOnly ? ' flagged at risk' : ''}`);
  setRegion('agenda-tools', state.dl.day ? `<button class="btn btn-ghost btn-sm" type="button" data-action="dl-all">Show all of ${fmt(s, { month: 'long' })}</button>` : '');
  if (!list.length) {
    const next = vis.filter(d => !d.done && startOf(d.date) > range[1]).sort((a, b) => a.date - b.date)[0];
    setRegion('agenda', emptyState({ ic: 'calendar', title: state.dl.riskOnly ? 'No at-risk deadlines in this range' : 'No deadlines in this range', text: next ? `The next one is “${esc(next.title)}” on ${fmtDay(next.date)}.` : 'There is nothing further on the calendar.', actions: `${next ? '<button class="btn btn-dark btn-sm" type="button" data-action="dl-jump">Jump to next deadline</button>' : ''}${state.dl.riskOnly ? '<button class="btn btn-ghost btn-sm" type="button" data-action="dl-risk">Show all deadlines</button>' : ''}` }));
    return;
  }
  setRegion('agenda', list.map(d => {
    const w = getWf(d.wf);
    return `<div class="agenda-row"><span class="date-chip ${sameDay(d.date, TODAY) ? 'today' : ''}"><small>${fmt(d.date, { weekday: 'short' })}</small><b>${d.date.getDate()}</b></span>
      <div><p class="row-title">${esc(d.title)}</p><p class="row-sub">${esc(d.kind)} · ${esc(w.matter)} · ${esc(fmtDT(d.date))}</p><p class="ds-inline" style="margin-top:6px">${dueChip(d.date, d.done)}${d.atRisk && !d.done ? `<span class="risk-tag">${icon('flag', 14)}Flagged at risk</span>` : ''}</p></div>
      <div class="agenda-actions"><button class="icon-btn flag" type="button" id="flag-${d.id}" data-action="dl-flag" data-id="${d.id}" aria-pressed="${d.atRisk}" aria-label="${d.atRisk ? 'Remove at-risk flag from' : 'Flag as at risk:'} ${esc(d.title)}" title="${d.atRisk ? 'Remove at-risk flag' : 'Flag as at risk'}" ${d.done ? 'disabled' : ''}>${icon('flag')}</button><button class="btn btn-ghost btn-sm" type="button" data-action="open-wf" data-id="${d.wf}">Open ${d.wf}</button></div></div>`;
  }).join(''));
}

/* =========================================================
   Reports
   ========================================================= */
function repShell() {
  return band({
    eyebrow: 'Management reporting', title: 'Reports', sub: `The monthly management report your engagement lead prepares for ${esc(pFirm().name)}.`,
    actions: `<div class="month-nav"><button class="icon-btn" type="button" id="rep-prev" data-action="rep-prev" aria-label="Previous month">${icon('chevron-left')}</button><span class="sr-only" id="rep-month-l">Report month</span><div style="width:200px">${dd('rep-month', { kind: 'month', size: 'sm', labelId: 'rep-month-l', title: 'Report month', required: true, value: repMonthVal(state.rep.idx), monthAllowed: (y, m) => repIdxFor(y, m) >= 0, monthReason: 'No management report for this month.', onChange: v => { const i = repIdxFor(v.y, v.m); if (i >= 0) { state.rep.idx = i; repUpdate(); } } })}</div><button class="icon-btn" type="button" id="rep-next" data-action="rep-next" aria-label="Next month">${icon('chevron-right')}</button></div><button class="btn btn-primary btn-sm" type="button" id="rep-export" data-action="rep-export">${icon('export', 18)}Export CSV</button>`,
    extra: `<div class="band-stats"><span class="risk-toggle"><button class="switch" type="button" role="switch" id="rep-compare" data-action="rep-compare" aria-checked="false" aria-labelledby="rep-compare-l"></button><span id="rep-compare-l">Compare with the previous month</span></span></div>`
  }) + '<div class="wrap pcontent"><div data-region="rep-doc"></div></div>';
}
function repUpdate() {
  const i = state.rep.idx;
  if (DD.get('rep-month')) { const mv = repMonthVal(i), cv = ddVal('rep-month'); if (!cv || cv.y !== mv.y || cv.m !== mv.m) ddSet('rep-month', mv); }
  $('#rep-prev').disabled = i >= REPORT_COUNT - 1;
  $('#rep-next').disabled = i <= 0;
  $('#rep-compare').setAttribute('aria-checked', String(state.rep.compare));
  $('#rep-export').disabled = !state.rep.loaded[i] || state.rep.loading;
  if (state.rep.loading) return;
  repLoad();
}
function repLoad() {
  const k = state.rep.idx;
  if (state.rep.loaded[k]) { renderReport(); return; }
  state.rep.loading = true;
  $('#rep-export').disabled = true;
  setRegion('rep-doc', `<div class="card report" aria-busy="true"><p class="sr-only">Loading report</p><div class="report-cover on-ink"><span class="sk" style="height:12px;width:180px;opacity:.25"></span><div class="report-figs">${'<div class="report-fig"><span class="sk" style="height:32px;width:90px;opacity:.25"></span><span class="sk" style="height:10px;width:120px;opacity:.25"></span></div>'.repeat(4)}</div></div><div class="report-sec">${[60, 92, 80, 70, 45].map(w => `<span class="sk" style="height:14px;width:${w}%"></span>`).join('')}</div></div>`);
  const fail = state.simulateError || (k === 2 && !state.rep.failedOnce[k]);
  setTimeout(() => {
    state.rep.loading = false;
    if (state.view !== 'reports' || state.rep.idx !== k) { if (state.view === 'reports') repUpdate(); return; }
    if (fail) {
      state.simulateError = false;
      state.rep.failedOnce[k] = true;
      setRegion('rep-doc', `<div class="card">${errorState({ title: `The ${REPORTS[k].label} report didn’t load`, text: 'The report service did not respond in time. Other months and views are unaffected. Try again in a moment.', retry: 'rep-retry', extra: '<button class="btn btn-ghost btn-sm" type="button" data-action="rep-latest">View the latest report</button>' })}</div>`);
      $('#rep-export').disabled = true;
      return;
    }
    state.rep.loaded[k] = true;
    repUpdate();
  }, reduced() ? 300 : 700);
}
const pctFmt = v => v.toFixed(1) + '%';
function delta(cur, prev, { unit = '', lowerBetter = false, digitsN = 0 } = {}) {
  const d = +(cur - prev).toFixed(digitsN);
  if (d === 0) return 'No change';
  const up = d > 0;
  const good = lowerBetter ? !up : up;
  return `<span class="${up ? 'delta-up' : 'delta-down'}">${up ? '+' : '−'}${Math.abs(d).toFixed(digitsN)}${unit}</span> vs. prior month${good ? '' : ' (watch)'}`;
}
function renderReport() {
  const k = state.rep.idx, r = repFor(k), p = repFor(k + 1), cmp = state.rep.compare, F = pFirm();
  const monthEnd = new Date(+r.key.slice(0, 4), +r.key.slice(5, 7), 0);
  if (F.since > monthEnd || !r.areas.length) {
    setRegion('rep-doc', `<div class="card">${emptyState({ ic: 'file', title: `No ${r.label} report for ${esc(F.name)}`, text: F.since > monthEnd ? `${esc(F.name)} started with Hyacinth on ${fmtD(F.since)}. The first report covers its first full month.` : 'This firm has no services enabled for this month.', actions: '<a class="btn btn-dark btn-sm" href="#overview">Go to Overview</a>' })}</div>`);
    $('#rep-export').disabled = true;
    return;
  }
  const fig = (val, label, dl) => `<div class="report-fig"><b>${val}</b><span>${label}</span>${cmp ? `<span class="delta">${dl}</span>` : ''}</div>`;
  const rows = r.areas.map(([a, op, cp, ot], i) => {
    const pa = p.areas[i];
    return `<tr><td>${esc(AREAS[a])}</td><td>${op}</td><td>${cp}</td>${cmp ? `<td>${cp - pa[2] >= 0 ? '+' : '−'}${Math.abs(cp - pa[2])}</td>` : ''}<td>${ot}%</td></tr>`;
  }).join('');
  setRegion('rep-doc', `<article class="card report" aria-labelledby="rep-title">
    <header class="report-cover on-ink">
      <div class="report-meta"><div class="stack-8"><p class="eyebrow">Monthly management report</p><h2 class="h3" id="rep-title">${r.label}</h2><p class="small">Prepared for ${esc(F.name)} by ${esc(TEAM[F.lead].name)}, engagement lead</p></div><span>${LOGO}</span></div>
      <div class="report-figs">
        ${fig(r.completed, 'Items completed', delta(r.completed, p.completed))}
        ${fig(pctFmt(r.onTime), 'Completed on time', delta(r.onTime, p.onTime, { unit: ' pts', digitsN: 1 }))}
        ${fig(r.turnaround.toFixed(1) + ' days', 'Median turnaround', delta(r.turnaround, p.turnaround, { unit: ' days', lowerBetter: true, digitsN: 1 }))}
        ${fig(`${r.exResolved} of ${r.exRaised}`, 'Exceptions resolved', delta(r.exResolved, p.exResolved))}
      </div>
    </header>
    <section class="report-sec" aria-labelledby="rep-chart-h"><div><h3 class="h4" id="rep-chart-h">Completed work by service area</h3><p class="small">Items completed in ${r.label}${cmp ? `, with change from ${p.label}` : ''}. Values are also in the table below.</p></div>
      <div class="chart-wrap" id="rep-chart"><div class="chart-svg"></div><div class="chart-tip" aria-hidden="true"></div></div></section>
    <section class="report-sec" aria-labelledby="rep-table-h"><h3 class="h4" id="rep-table-h">Service area detail</h3>
      <div class="table-wrap" tabindex="0" role="region" aria-labelledby="rep-table-h" style="border-top:0"><table class="mini-table"><thead><tr><th scope="col">Service area</th><th scope="col">Opened</th><th scope="col">Completed</th>${cmp ? `<th scope="col">Change vs. ${esc(p.short)}</th>` : ''}<th scope="col">On time</th></tr></thead><tbody>${rows}</tbody>
      <tfoot><tr><th scope="row">All areas</th><td><b>${sum(r.areas.map(a => a[1]))}</b></td><td><b>${r.completed}</b></td>${cmp ? `<td><b>${r.completed - p.completed >= 0 ? '+' : '−'}${Math.abs(r.completed - p.completed)}</b></td>` : ''}<td><b>${pctFmt(r.onTime)}</b></td></tr></tfoot></table></div></section>
    <section class="report-sec"><div class="report-cols"><div class="stack-16"><h3 class="h4">Highlights</h3><ul class="bul">${r.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div><div class="stack-16"><h3 class="h4">Focus for next month</h3><ul class="bul">${r.focus.map(h => `<li>${esc(h)}</li>`).join('')}</ul></div></div></section>
    <footer class="report-foot"><span>Hyacinth Industries, LLC · Legal Support</span><span>Report period ${r.label}</span></footer>
  </article>`);
  drawReportBars();
}
function drawReportBars() {
  const wrap = $('#rep-chart'); if (!wrap) return;
  const k = state.rep.idx, r = repFor(k), p = repFor(k + 1), cmp = state.rep.compare;
  const holder = $('.chart-svg', wrap), tip = $('.chart-tip', wrap);
  const W = Math.max(260, Math.floor(holder.getBoundingClientRect().width || 600));
  const narrow = W < 560;
  const rowH = narrow ? 54 : 40, barH = 16;
  const m = { l: narrow ? 0 : 220, r: cmp ? 80 : 48, t: 4 };
  const iw = W - m.l - m.r;
  const vals = r.areas.map(a => a[2]);
  const step = niceStep(Math.max(...vals) / 4);
  const max = Math.ceil(Math.max(...vals) / step) * step;
  const H = m.t + rowH * vals.length + 22;
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  for (let v = 0; v <= max + 0.001; v += step) { const gx = m.l + v / max * iw; s += `<line x1="${gx}" x2="${gx}" y1="${m.t}" y2="${H - 22}" style="stroke:var(--hairline)" stroke-width="1"/><text x="${gx}" y="${H - 6}" text-anchor="middle" font-size="11">${v}</text>`; }
  r.areas.forEach(([a, , cp], i) => {
    const top = m.t + i * rowH;
    const by = narrow ? top + 24 : top + (rowH - barH) / 2;
    const w = Math.max(2, cp / max * iw), rr = Math.min(4, w);
    const label = AREAS[a];
    s += narrow ? `<text x="0" y="${top + 16}" font-size="12">${esc(label)}</text>` : `<text x="${m.l - 12}" y="${by + 12}" text-anchor="end" font-size="12">${esc(label)}</text>`;
    s += `<path d="M${m.l},${by}h${w - rr}a${rr},${rr} 0 0 1 ${rr},${rr}v${barH - 2 * rr}a${rr},${rr} 0 0 1 -${rr},${rr}h-${w - rr}z" style="fill:var(--gold)"/>`;
    const dv = cp - p.areas[i][2];
    s += `<text x="${m.l + w + 8}" y="${by + 12}" font-size="12" font-weight="600">${cp}${cmp ? ` (${dv >= 0 ? '+' : '−'}${Math.abs(dv)})` : ''}</text>`;
    s += `<rect class="bar-hit" data-i="${i}" x="0" y="${top}" width="${W}" height="${rowH}" style="fill:transparent"/>`;
  });
  holder.innerHTML = s + '</svg>';
  $$('.bar-hit', holder).forEach(h => {
    h.addEventListener('pointerenter', () => {
      const i = +h.dataset.i, a = r.areas[i];
      tip.innerHTML = `<b>${esc(AREAS[a[0]])}</b><div class="row"><span>Completed</span><strong>${a[2]}</strong></div><div class="row"><span>Opened</span><strong>${a[1]}</strong></div><div class="row"><span>On time</span><strong>${a[3]}%</strong></div>${cmp ? `<div class="row"><span>${esc(p.short)} completed</span><strong>${p.areas[i][2]}</strong></div>` : ''}`;
      tip.style.left = Math.min(W - 190, m.l + a[2] / max * iw + 12) + 'px';
      tip.style.top = (m.t + i * rowH - 4) + 'px';
      tip.classList.add('show');
    });
    h.addEventListener('pointerleave', () => tip.classList.remove('show'));
  });
}
function reportCSV() {
  const r = repFor(state.rep.idx), p = repFor(state.rep.idx + 1);
  const c = v => /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
  const lines = [
    ['Hyacinth monthly management report', r.label], ['Prepared for', pFirm().name], ['Prepared by', `${TEAM[pFirm().lead].name}, engagement lead`], [],
    ['Metric', 'Value', `Prior month (${p.label})`],
    ['Items completed', r.completed, p.completed], ['Completed on time (%)', r.onTime.toFixed(1), p.onTime.toFixed(1)],
    ['Median turnaround (days)', r.turnaround.toFixed(1), p.turnaround.toFixed(1)], ['Exceptions raised', r.exRaised, p.exRaised], ['Exceptions resolved', r.exResolved, p.exResolved], [],
    ['Service area', 'Opened', 'Completed', 'On time (%)'],
    ...r.areas.map(a => [AREAS[a[0]], a[1], a[2], a[3]]), [],
    ['Highlights'], ...r.highlights.map(h => [h]), [],
    ['Focus for next month'], ...r.focus.map(h => [h])
  ];
  return lines.map(l => l.map(c).join(',')).join('\n');
}

/* =========================================================
   Account & Help
   ========================================================= */
const pref = (id, title, desc, key, on) => `<div class="pref"><div><b id="${id}-l">${title}</b><span class="small" id="${id}-d" style="display:block">${desc}</span></div><button class="switch" type="button" role="switch" id="${id}" data-action="pref" data-key="${key}" aria-checked="${on}" aria-labelledby="${id}-l" aria-describedby="${id}-d"></button></div>`;
function accShell() {
  const p = state.profile;
  return band({ eyebrow: 'Account', title: 'Account &amp; preferences', sub: 'Your profile, notification settings and prototype review controls.' }) + `
  <div class="wrap pcontent"><div class="two-col">
    <section class="card" aria-labelledby="pf-h"><div class="card-head"><div><h2 class="h4" id="pf-h">Profile</h2><p class="small">Shown to your Hyacinth team on comments and requests.</p></div></div>
      <form class="card-body" data-form="profile" novalidate><div class="form-grid">
        ${fieldHTML({ id: 'pf-name', label: 'Full name', auto: 'name', value: p.name })}
        ${fieldHTML({ id: 'pf-title', label: 'Title', opt: true, auto: 'organization-title', value: p.title })}
        ${fieldHTML({ id: 'pf-email', label: 'Work email', type: 'email', auto: 'email', value: p.email })}
        ${fieldHTML({ id: 'pf-phone', label: 'Phone', type: 'tel', opt: true, auto: 'tel', value: p.phone })}
        <div class="full form-actions"><span class="small">Changes apply across the portal right away.</span><button class="btn btn-dark" type="submit" id="pf-save">Save profile</button></div>
      </div></form></section>
    <div class="stack-24">
      <section class="card" aria-labelledby="nt-h"><div class="card-head"><h2 class="h4" id="nt-h">Notifications</h2></div><div class="pref-list">
        ${pref('pref-digest', 'Daily digest', 'A morning summary of deadlines and exceptions.', 'digest', state.prefs.digest)}
        ${pref('pref-alerts', 'At-risk alerts', 'Tell me when a workflow or deadline is flagged at risk.', 'alerts', state.prefs.alerts)}
        ${pref('pref-report', 'Monthly report ready', 'Tell me when the management report is published.', 'reportReady', state.prefs.reportReady)}
      </div></section>
      <section class="card" aria-labelledby="pt-h"><div class="card-head"><div><h2 class="h4" id="pt-h">Prototype review controls</h2><p class="small">For design review only. Not part of the client product.</p></div></div><div class="pref-list">
        ${pref('pref-error', 'Simulate a failed load', 'The next time Workflows or Reports loads, it fails once so you can review the error state.', 'simulateError', state.simulateError)}
        <div class="pref"><div><b>Reset demo data</b><span class="small" style="display:block">Restore every workflow, deadline, exception and notification to its starting state.</span></div><button class="btn btn-ghost btn-sm" type="button" id="reset-demo" data-action="reset-demo">Reset</button></div>
      </div></section>
    </div>
  </div></div>`;
}
const FAQ = [
  ['How is the SLA on-time percentage calculated?', 'It is the share of workflows completed on or before their due date over the last 30 days. When you mark a workflow complete in the portal, it counts toward the figure right away.'],
  ['How do I request a new workflow?', 'Use “New workflow” on the Workflows page or “Request a workflow” on Overview. Your engagement lead confirms the steps and owner within one business day.'],
  ['What are automated steps?', 'Steps shown on a parchment background with a gold outline run automatically, such as conflict checks or reminder sequences. You can run a queued automated step right away with “Run now”.'],
  ['Who sees comments in the activity log?', 'Everyone assigned to the workflow at Hyacinth and at your firm. Comments are timestamped and stay on the workflow’s record.']
];
function helpShell() {
  return band({ eyebrow: 'Support', title: 'Help &amp; support', sub: 'Reach your Hyacinth team or find answers about how the portal works.' }) + `
  <div class="wrap pcontent"><div class="two-col">
    <div class="stack-24">
      <section class="card" aria-labelledby="faq-h"><div class="card-head"><h2 class="h4" id="faq-h">Common questions</h2></div>
        <div>${FAQ.map(([q, a], i) => `<div class="faq"><h3 style="margin:0;font-size:inherit"><button type="button" id="faq-${i}" data-action="faq" aria-expanded="false" aria-controls="faq-a-${i}">${esc(q)}${icon('chevron-down', 18)}</button></h3><div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-${i}" hidden><p>${esc(a)}</p></div></div>`).join('')}</div></section>
      <section class="card" aria-labelledby="sp-h"><div class="card-head"><div><h2 class="h4" id="sp-h">Request support</h2><p class="small">Goes to Dana Okafor and the Hyacinth operations desk.</p></div></div><div class="card-body" data-region="support"></div></section>
    </div>
    <section class="card" aria-labelledby="el-h"><div class="card-head"><h2 class="h4" id="el-h">Your engagement lead</h2></div>
      <div class="card-body stack-16"><span class="person">${avatar('dana', 'lg')}<span><b>Dana Okafor</b><span class="small" style="display:block">Engagement lead, Hyacinth</span></span></span>
        <p class="small">Dana manages your dedicated team, sets weekly priorities and owns escalations.</p>
        <div><button class="btn btn-dark" type="button" data-action="message" data-member="dana">${icon('message', 18)}Message Dana</button></div>
        <h3 class="h4" style="margin-top:8px">Team on your account</h3>
        <ul class="team-list">${Object.entries(TEAM).filter(([k]) => k !== 'dana').map(([k, t]) => `<li class="person">${avatar(k)}<span><b style="font-size:var(--fs-14)">${esc(t.name)}</b><span class="small" style="display:block">${esc(t.role)}</span></span></li>`).join('')}</ul>
      </div></section>
  </div></div>`;
}
const SP_TOPICS = ['Workflow question', 'Deadline change', 'Report question', 'Portal access', 'Something else'];
function renderSupport(done) {
  if (done) {
    setRegion('support', `<div class="success" role="status"><span class="success-mark">${icon('check', 24)}</span><h3 class="h4">Request ${done.ref} logged</h3><p class="small">${esc(done.topic)}: “${esc(done.msg.length > 120 ? done.msg.slice(0, 117) + '…' : done.msg)}”. Dana Okafor will reply in the portal.</p><div><button class="btn btn-ghost btn-sm" type="button" id="sp-new" data-action="sp-new">Send another request</button></div></div>`);
    return;
  }
  setRegion('support', `<form class="stack-16" data-form="support" novalidate>
    <div class="field"><span class="label" id="sp-topic-l">Topic</span>${dd('sp-topic', { kind: 'select', labelId: 'sp-topic-l', title: 'Topic', value: SP_TOPICS[0], options: SP_TOPICS.map(t => ({ value: t, label: t })) })}</div>
    <div class="field"><label class="label" for="sp-msg">What do you need?</label><textarea class="textarea" id="sp-msg" aria-describedby="sp-msg-err" placeholder="Include the workflow ID or matter if it relates to one."></textarea><p class="err" id="sp-msg-err" hidden></p></div>
    <div><button class="btn btn-dark" type="submit" id="sp-submit">${icon('send', 18)}Send request</button></div></form>`);
}

const VIEWS = {
  overview: { title: 'Overview', shell: ovShell, update: ovUpdate },
  workflows: { title: 'Workflows', shell: wfShell, mount: wfMount, update: wfUpdate },
  deadlines: { title: 'Deadlines', shell: dlShell, update: dlUpdate },
  reports: { title: 'Reports', shell: repShell, update: repUpdate },
  account: { title: 'Account & preferences', shell: accShell, update: () => {} },
  help: { title: 'Help & support', shell: helpShell, mount: () => renderSupport(), update: () => {} }
};
function renderView(v, opts = {}) {
  const def = VIEWS[v];
  state.view = v;
  const m = main();
  m.innerHTML = def.shell();
  m.dataset.view = v;
  if (def.mount) def.mount();
  def.update();
  updateChrome();
  $$('[data-view-link]').forEach(a => { if (a.dataset.viewLink === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#crumb-view').textContent = def.title;
  document.title = `${def.title} · Hyacinth client portal`;
  window.scrollTo(0, 0);
  if (opts.focus !== false) { const t = $('#view-title'); if (t) t.focus({ preventScroll: true }); }
}
function refresh() {
  const activeId = document.activeElement && document.activeElement.id;
  updateChrome();
  updateAdminChrome();
  if (state.surface === 'portal' && state.view && VIEWS[state.view]) VIEWS[state.view].update();
  if (state.surface === 'admin' && state.admin.view && AVIEWS[state.admin.view] && AVIEWS[state.admin.view].update) AVIEWS[state.admin.view].update();
  if ((state.detailId || state.leadId) && isOpen($('#sheet-root')) && !(ddo && $('#sheet').contains(ddo.trigger))) renderDetail();
  if (activeId) { const el = document.getElementById(activeId); if (el && el !== document.activeElement && visible(el)) el.focus({ preventScroll: true }); }
}

/* =========================================================
   Workflow detail slide-over
   ========================================================= */
function openDetail(id, focusSel) {
  state.leadId = null;
  const w = getWf(id);
  if (!w) {
    const a = state.archived.find(x => x.id === id);
    toast(a ? `${id} is archived.` : `Workflow ${id} is no longer available.`, a ? { icon: 'archive', action: { label: 'Restore', fn: () => restoreWf(id) } } : { icon: 'alert' });
    return;
  }
  state.detailId = id;
  renderDetail();
  const root = $('#sheet-root');
  if (!isOpen(root)) openLayer(root, { focus: focusSel || '#sheet-close', onClose: () => { state.detailId = null; } });
  else { const f = $(focusSel || '#sheet-close'); if (f) f.focus(); }
}
function renderDetail() {
  if (state.leadId) { renderLead(); return; }
  const w = getWf(state.detailId);
  const sheet = $('#sheet');
  if (!w) { closeLayer($('#sheet-root')); return; }
  const body = $('.sheet-body', sheet);
  const scroll = body ? body.scrollTop : 0;
  const draft = $('#comment-text') ? $('#comment-text').value : '';
  const d = doneCount(w), n = w.steps.length, allDone = d === n;
  const team = [w.owner, ...w.support.filter(k => k !== w.owner)];
  const steps = w.steps.map((s, i) => `<li class="step ${s.auto ? 'auto' : ''} ${s.done ? 'done' : ''}"><span class="step-mark" aria-hidden="true">${s.done ? icon('check', 14) : i + 1}</span><div>
      <p class="step-title">${esc(s.title)}<span class="sr-only">, ${s.done ? 'completed' : 'not completed'}</span></p>
      <p class="step-meta">${s.auto ? `<span class="badge auto-badge">${icon('zap', 12)}Automated</span>` : ''}${s.review ? `<span class="badge st-review">${icon('eye', 12)}Attorney review</span>` : ''}<span>${s.done ? `Completed by ${esc(s.by)} · ${fmtShort(s.at)}` : s.auto ? 'Queued. Runs automatically.' : 'Not started'}</span></p>
      ${s.done ? '' : `<div class="step-actions">${s.auto ? `<button class="btn btn-ghost btn-sm" type="button" id="step-${i}" data-action="step-run" data-i="${i}">${icon('zap', 16)}Run now</button>` : `<button class="btn btn-dark btn-sm" type="button" id="step-${i}" data-action="step-done" data-i="${i}">${icon('check', 16)}${s.review ? 'Record review' : 'Mark complete'}</button>`}</div>`}
    </div></li>`).join('');
  const log = w.log.map(e => `<li class="${e.kind === 'comment' ? 'comment' : ''}"><span class="avatar ${e.sys ? 'sys' : ''}" aria-hidden="true">${e.sys ? icon('zap', 14) : initials(e.who)}</span><div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:baseline"><span class="who">${esc(e.who)}</span><span class="when">${relTime(e.at)}</span>${e.kind === 'comment' ? '<span class="when">· Comment</span>' : ''}</div><p class="txt">${esc(e.text)}</p></div></li>`).join('');
  sheet.innerHTML = `
    <div class="sheet-head on-ink">
      <div class="sheet-head-top"><div class="stack-8"><p class="eyebrow">${w.id} · ${esc(AREAS[w.area])}</p><h2 class="h3" id="sheet-title">${esc(w.title)}</h2><p class="small">${esc(w.matter)} · ${esc(typeLabel(w.type))}</p></div>
        <button class="icon-btn" type="button" id="sheet-close" data-action="close-layer" aria-label="Close workflow details">${icon('x')}</button></div>
      <div class="prog" style="margin-top:8px"><div class="prog-track" style="background:var(--ink-line)"><div class="prog-fill" style="width:${Math.round(d / n * 100)}%;background:var(--pale-gold)"></div></div><span>${d} of ${n} steps complete</span></div>
    </div>
    <div class="sheet-body">
      <section class="sheet-sec" aria-label="Summary"><div class="meta-grid">
        <div><div class="lab">Status</div>${statusSelect(w, 'dst')}</div>
        <div class="field"><span class="lab" id="dd-due-l">Due</span>${dd('dd-due-' + w.id, { kind: 'date', labelId: 'dd-due-l', title: 'Due date', value: w.due, required: true, min: w.status === 'complete' ? null : TODAY, minReason: 'Due dates can’t be moved into the past.', markers: dlMarkers(true), onChange: (v, c, prev) => { if (!v) return; w.due = v; const e = addLog(w, `Moved the due date from ${fmtD(prev)} to ${fmtD(v)}.`); if (state.surface === 'admin') audit('Edit', `Set due date ${fmtD(v)} on ${w.id}`, firmName(w.firm)); refresh(); toast(`${w.id} now due ${fmtD(v)}.`, { icon: 'calendar', undo: () => { w.due = prev; removeLog(w, e); refresh(); } }); } })}<div>${w.status === 'complete' ? '<span class="small">Completed</span>' : dueChip(w.due)}</div></div>
        <div><div class="lab">Owner</div><span class="person">${avatar(w.owner)}${esc(TEAM[w.owner].name)}</span></div>
        <div><div class="lab">Reviewing attorney</div>${esc(w.attorney)}<div class="small">${esc(firmName(w.firm))}</div></div>
      </div></section>
      <section class="sheet-sec" aria-labelledby="steps-h"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h3 class="h4" id="steps-h">Steps</h3><span class="small" style="display:inline-flex;gap:8px;align-items:center"><span class="badge auto-badge">${icon('zap', 12)}Automated</span>runs without staff time</span></div><ol class="steps">${steps}</ol></section>
      <section class="sheet-sec" aria-labelledby="tm-h"><h3 class="h4" id="tm-h">Assigned team</h3>
        <ul class="team-list">${team.map((k, i) => `<li class="person">${avatar(k)}<span><b style="font-size:var(--fs-14)">${esc(TEAM[k].name)}</b><span class="small" style="display:block">${i === 0 ? 'Owner · ' : ''}${esc(TEAM[k].role)}</span></span></li>`).join('')}</ul>
        <form class="inline-form" data-form="reassign" novalidate><div class="field"><span class="label" id="reassign-owner-l">Reassign owner</span>${dd('reassign-owner', { kind: 'combo', labelId: 'reassign-owner-l', title: 'New owner', value: w.owner, options: staffOpts(firm(w.firm).team) })}</div><button class="btn btn-dark" type="submit" id="reassign-save">Save owner</button></form>
      </section>
      <section class="sheet-sec" aria-labelledby="act-h"><h3 class="h4" id="act-h">Activity</h3>
        <form class="stack-8" data-form="comment" novalidate><label class="label" for="comment-text">Add a comment</label><textarea class="textarea" id="comment-text" aria-describedby="comment-text-err" placeholder="Share context or instructions with the Hyacinth team">${esc(draft)}</textarea><p class="err" id="comment-text-err" hidden></p><div><button class="btn btn-dark btn-sm" type="submit" id="comment-submit">${icon('send', 16)}Post comment</button></div></form>
        <ol class="log" aria-label="Activity log, newest first">${log}</ol>
      </section>
    </div>
    <div class="sheet-foot"><button class="btn btn-quiet" type="button" id="sheet-archive" data-action="wf-archive" data-id="${w.id}">${icon('archive', 18)}Archive</button>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">${allDone || w.status === 'complete' ? '' : `<span class="small" id="complete-hint">${n - d} ${n - d === 1 ? 'step' : 'steps'} remaining</span>`}${w.status === 'complete' ? `<span class="badge st-complete" style="height:36px;padding:0 14px;font-size:var(--fs-14)">${icon('check', 16)}Workflow complete</span>` : `<button class="btn btn-primary" type="button" id="sheet-complete" data-action="wf-complete" data-id="${w.id}" ${allDone ? '' : 'disabled aria-describedby="complete-hint"'}>Mark workflow complete</button>`}</div></div>`;
  const nb = $('.sheet-body', sheet);
  if (nb) nb.scrollTop = scroll;
}
function setStatus(id, s) {
  const w = getWf(id);
  if (!w || w.status === s) return;
  const prev = w.status, prevNow = w.completedNow, prevOT = w.completedOnTime;
  w.status = s;
  w.completedNow = s === 'complete';
  w.completedOnTime = s === 'complete' && diffDays(w.due) >= 0;
  const entry = addLog(w, `Changed status from ${STATUS[prev]} to ${STATUS[s]}.`);
  refresh();
  toast(`${w.id} is now ${STATUS[s]}.`, { undo: () => { w.status = prev; w.completedNow = prevNow; w.completedOnTime = prevOT; removeLog(w, entry); refresh(); } });
}
function completeStep(i, btn, auto) {
  const w = getWf(state.detailId); if (!w) return;
  withLoading(btn, () => {
    const s = w.steps[i];
    if (s.done) return;
    s.done = true; s.by = auto ? 'Automation' : state.profile.name; s.at = new Date();
    const entry = addLog(w, auto ? `Ran “${s.title}” on request.` : s.review ? `Recorded attorney review: “${s.title}”.` : `Marked “${s.title}” complete.`, auto ? { who: 'Automation', sys: true } : {});
    const prevStatus = w.status;
    let msg = auto ? `“${s.title}” ran.` : `“${s.title}” marked complete.`;
    if (s.review && w.status === 'review') { w.status = 'on-track'; msg = 'Review recorded. Status set to On track.'; }
    const all = w.steps.every(x => x.done);
    if (all && w.status !== 'complete') msg += ' All steps are done.';
    refresh();
    const next = $('#step-' + w.steps.findIndex(x => !x.done)) || $('#sheet-complete:not([disabled])') || $('#steps-h');
    if (next) { if (next.id === 'steps-h') next.setAttribute('tabindex', '-1'); next.focus({ preventScroll: false }); }
    toast(msg, { undo: () => { s.done = false; s.by = null; s.at = null; w.status = prevStatus; removeLog(w, entry); refresh(); } });
  });
}
function archiveWf(id) {
  const w = getWf(id); if (!w) return;
  confirmDialog({ title: `Archive ${id}?`, body: `“${w.title}” will leave active workflows, and its deadlines and exceptions will be hidden. You can undo this right after.`, confirm: 'Archive workflow', danger: true }).then(ok => {
    if (!ok) return;
    const i = state.workflows.indexOf(w);
    state.workflows.splice(i, 1);
    state.archived.push(w);
    if (state.detailId === id) closeLayer($('#sheet-root'), { restoreFocus: false });
    refresh();
    const t = $('#view-title'); if (t) t.focus({ preventScroll: true });
    toast(`${id} archived.`, { icon: 'archive', undo: () => { state.archived = state.archived.filter(x => x !== w); state.workflows.splice(Math.min(i, state.workflows.length), 0, w); refresh(); } });
  });
}
function restoreWf(id) {
  const w = state.archived.find(x => x.id === id); if (!w) return;
  state.archived = state.archived.filter(x => x !== w);
  state.workflows.unshift(w);
  refresh();
  toast(`${id} restored.`, { action: { label: 'Open', fn: () => openDetail(id) } });
}
function openNewWf() {
  const F = pFirm();
  state.nwDueTouched = false;
  openModal({
    title: 'Request a new workflow', form: 'new-wf', focus: '#nw-title',
    body: `<p class="small">Your Hyacinth team picks it up and adds steps based on the workflow type.</p>
      <div class="form-grid">
        ${fieldHTML({ id: 'nw-title', label: 'Workflow name', full: true, placeholder: 'For example: Records request, three providers' })}
        ${fieldHTML({ id: 'nw-matter', label: 'Matter', full: true, placeholder: 'For example: Reyes v. Northgate Logistics, or Firmwide' })}
        <div class="field"><span class="label" id="nw-area-l">Service area</span>${dd('nw-area', { kind: 'select', labelId: 'nw-area-l', title: 'Service area', value: F.services[0] || 'lo', options: areaOpts().filter(o => F.services.includes(o.value)), onChange: v => { const t = state.templates.find(x => x.area === v); if (t) ddSet('nw-type', t.id); if (!state.nwDueTouched) ddSet('nw-due', addDays(state.settings.sla[v])); } })}</div>
        <div class="field"><span class="label" id="nw-type-l">Workflow type</span>${dd('nw-type', { kind: 'combo', labelId: 'nw-type-l', title: 'Workflow template', value: (state.templates.find(x => x.area === (F.services[0] || 'lo')) || state.templates[0]).id, options: state.templates.map(t => ({ value: t.id, label: t.name, sub: `${t.steps.length} steps · ${AREAS[t.area]}`, group: AREAS[t.area] })).sort((a, b) => a.group.localeCompare(b.group)) })}</div>
        <div class="field"><span class="label" id="nw-owner-l">Owner</span>${dd('nw-owner', { kind: 'combo', labelId: 'nw-owner-l', title: 'Owner', value: F.lead, options: staffOpts(F.team) })}</div>
        <div class="field"><span class="label" id="nw-due-l">Due date</span>${dd('nw-due', { kind: 'date', labelId: 'nw-due-l', title: 'Due date', value: addDays(state.settings.sla[F.services[0] || 'lo']), required: true, requiredMsg: 'Choose a due date.', min: TODAY, minReason: 'Due dates can’t be before today.', markers: dlMarkers(false), onChange: () => { state.nwDueTouched = true; } })}<p class="hint">Defaults to the service area’s SLA from admin settings.</p></div>
      </div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-primary" type="submit" id="nw-submit">${icon('plus', 18)}Create workflow</button>`
  });
}
function openMessage(member) {
  openModal({
    title: 'Message your Hyacinth team', form: 'message', focus: '#msg-body',
    body: `<div class="field"><span class="label" id="msg-to-l">To</span>${dd('msg-to', { kind: 'combo', labelId: 'msg-to-l', title: 'Recipient', value: member, options: staffOpts(state.surface === 'portal' ? pFirm().team : null) })}</div>
      <div class="field"><label class="label" for="msg-body">Message</label><textarea class="textarea" id="msg-body" aria-describedby="msg-body-err" placeholder="What do you need from the team?"></textarea><p class="err" id="msg-body-err" hidden></p></div>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Cancel</button><button class="btn btn-dark" type="submit" id="msg-send">${icon('send', 18)}Send message</button>`
  });
}
function openExport() {
  const r = REPORTS[state.rep.idx];
  openCsv(`Export ${r.label} report`, `hyacinth-report-${r.key}.csv`, reportCSV());
}
function openExportLegacy() {
  const r = REPORTS[state.rep.idx];
  const csv = reportCSV();
  openModal({
    title: `Export ${esc(r.label)} report`, focus: '#csv-copy',
    body: `<p class="small">${canDownload() ? 'Download the CSV, or copy it and paste it into Excel or Google Sheets.' : 'File downloads are not available in this view. Copy the CSV and paste it into Excel or Google Sheets.'}</p>
      <label class="label" for="csv-text">CSV preview</label><textarea class="textarea csv-box" id="csv-text" readonly>${esc(csv)}</textarea>`,
    foot: `<button class="btn btn-quiet" type="button" data-action="close-layer">Close</button>${!canDownload() ? '' : `<button class="btn btn-ghost" type="button" id="csv-download" data-action="csv-download">${icon('download', 18)}Download .csv</button>`}<button class="btn btn-primary" type="button" id="csv-copy" data-action="csv-copy">${icon('copy', 18)}Copy CSV</button>`
  });
}

/* =========================================================
   Actions (every control maps to one of these)
   ========================================================= */
let resetSnapshot = null;
const ACTIONS = {
  skip: () => { const m = state.surface === 'portal' ? main() : $('#site-main'); m.focus(); },
  'site-menu': btn => {
    const mm = $('#mobile-menu');
    if (isOpen(mm)) { closeLayer(mm); return; }
    mm.style.top = Math.max(0, $('.site-header').getBoundingClientRect().bottom) + 'px';
    btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Close menu'); btn.innerHTML = icon('x');
    openLayer(mm, { trap: [mm, $('.site-header')], onClose: () => { btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu'); btn.innerHTML = icon('menu'); } });
  },
  lane: btn => {
    const card = document.getElementById(btn.dataset.target);
    card.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    card.classList.add('is-flash');
    setTimeout(() => card.classList.remove('is-flash'), 1800);
    const link = $('.link-arrow', card); if (link) link.focus({ preventScroll: true });
  },
  'close-layer': btn => { const root = btn.closest('.layer-root'); if (root) closeLayer(root); },
  'open-sidebar': btn => { btn.setAttribute('aria-expanded', 'true'); openLayer($('#sidebar'), { scrim: $('#sidebar-scrim'), keepMounted: true, onClose: () => btn.setAttribute('aria-expanded', 'false') }); },
  'close-sidebar': () => closeLayer($('#sidebar')),
  'toggle-search': btn => {
    const box = $('#mobile-search'); const open = !box.classList.contains('is-open');
    box.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
    if (open) $('#global-q-m').focus();
  },
  'toggle-pop': btn => { const el = document.getElementById(btn.dataset.pop); if (pop && pop.el === el) closePop(true); else openPop(btn, el); },
  'notif-read-all': () => {
    const was = state.notifications.filter(n => n.unread);
    was.forEach(n => { n.unread = false; });
    updateChrome();
    $('#notif-list .notif') && $('#notif-list .notif').focus();
    toast(`Marked ${was.length} ${was.length === 1 ? 'notification' : 'notifications'} as read.`, { undo: () => { was.forEach(n => { n.unread = true; }); updateChrome(); } });
  },
  'notif-open': btn => {
    const n = state.notifications.find(x => x.id === btn.dataset.id);
    n.unread = false;
    closePop(false);
    updateChrome();
    $('#bell-btn').focus({ preventScroll: true });
    if (n.wf) openDetail(n.wf);
    else if (location.hash === '#' + n.route) route({ same: true }); else location.hash = n.route;
  },
  'sign-out': () => {
    closePop(false);
    confirmDialog({ title: 'Sign out of the portal?', body: 'You will need to sign back in to see your workflows, deadlines and reports.', confirm: 'Sign out' }).then(ok => {
      if (!ok) return;
      state.signedOut = true; state.pendingView = state.view;
      closeAllLayers();
      showSurface('portal');
      document.title = 'Signed out · Hyacinth client portal';
      $('#so-title').focus();
    });
  },
  'sign-in': btn => withLoading(btn, () => {
    state.signedOut = false;
    showSurface('portal');
    const v = state.pendingView && VIEWS[state.pendingView] ? state.pendingView : 'overview';
    if (location.hash !== '#' + v) location.hash = v; else renderView(v);
    toast(`Signed in as ${state.profile.name}.`);
  }),
  message: btn => openMessage(btn.dataset.member || 'dana'),
  'new-wf': () => openNewWf(),
  'open-wf': btn => openDetail(btn.dataset.id),
  'trend-range': btn => { state.trend.range = +btn.dataset.range; ovUpdate(); },
  'trend-table': () => { state.trend.table = !state.trend.table; ovUpdate(); },
  'ex-view': btn => { state.exView = btn.dataset.v; renderExceptions(); const b = $('#exv-' + state.exView); if (b) b.focus(); },
  'ex-resolve': btn => withLoading(btn, () => {
    const e = state.exceptions.find(x => x.id === btn.dataset.id); if (!e) return;
    const i = state.exceptions.indexOf(e);
    state.exceptions.splice(i, 1);
    const w = getWf(e.wf);
    const entry = w ? addLog(w, `Resolved exception: ${e.title}.`) : null;
    refresh();
    const nextBtn = $('[data-action="ex-resolve"]') || $('#ex-h'); if (nextBtn) nextBtn.focus({ preventScroll: true });
    toast(`Resolved “${e.title}”.`, { undo: () => { state.exceptions.splice(i, 0, e); if (w && entry) removeLog(w, entry); refresh(); } });
  }),
  'ex-snooze': btn => {
    const id = btn.dataset.id;
    openMenu(btn, [1, 3, 7].map(dn => ({ label: dn === 7 ? 'Snooze for 1 week' : `Snooze for ${dn} ${dn === 1 ? 'day' : 'days'}`, icon: 'clock', fn: () => {
      const e = state.exceptions.find(x => x.id === id); if (!e) return;
      e.snoozedUntil = addDays(dn);
      refresh();
      const f = $('[data-action="ex-resolve"]') || $('#ex-h'); if (f) f.focus({ preventScroll: true });
      toast(`Snoozed until ${fmtDay(e.snoozedUntil)}.`, { icon: 'clock', undo: () => { e.snoozedUntil = null; refresh(); } });
    } })));
  },
  'ex-unsnooze': btn => { const e = state.exceptions.find(x => x.id === btn.dataset.id); e.snoozedUntil = null; refresh(); const f = $('#exv-snoozed'); if (f) f.focus(); toast(`“${e.title}” is back in open exceptions.`); },
  'menu-item': btn => { const it = menuItems[+btn.dataset.i]; const trig = pop && pop.trigger; closePop(false); if (trig && document.contains(trig)) trig.focus({ preventScroll: true }); if (it && it.fn) it.fn(); },
  'wf-sort': btn => { const k = btn.dataset.key; if (state.wf.sort === k) state.wf.dir = state.wf.dir === 'asc' ? 'desc' : 'asc'; else { state.wf.sort = k; state.wf.dir = 'asc'; } wfUpdate(); const b = $('#sort-' + k); if (b) b.focus(); },
  'wf-chip': btn => { state.wf.status = btn.dataset.status; wfUpdate(); btn.focus(); },
  'wf-clear': () => { const had = hasFilters(); state.wf = { ...state.wf, q: '', area: [], owner: 'all', status: 'all' }; const q = $('#wf-q'); if (q) q.value = ''; wfUpdate(); const s = $('#wf-q'); if (s) s.focus(); if (had) toast('Filters cleared.'); },
  'wf-refresh': () => { if (!state.wfLoading) wfLoad(true); },
  'wf-retry': btn => withLoading(btn, () => wfLoad(true), 300),
  'wf-menu': btn => {
    const w = getWf(btn.dataset.id); if (!w) return;
    openMenu(btn, [
      { label: 'Open details', icon: 'eye', fn: () => openDetail(w.id) },
      { label: 'Reassign owner', icon: 'users', fn: () => openDetail(w.id, '#reassign-owner') },
      { label: w.status === 'complete' ? 'Already complete' : 'Mark complete', icon: 'check', disabled: w.status === 'complete', fn: () => setStatus(w.id, 'complete') },
      { sep: true },
      { label: 'Archive workflow', icon: 'archive', danger: true, fn: () => archiveWf(w.id) }
    ]);
  },
  'wf-archive': btn => archiveWf(btn.dataset.id),
  'wf-complete': btn => withLoading(btn, () => setStatus(btn.dataset.id, 'complete')),
  'step-done': btn => completeStep(+btn.dataset.i, btn, false),
  'step-run': btn => completeStep(+btn.dataset.i, btn, true),
  'dl-prev': () => dlShift(-1),
  'dl-next': () => dlShift(1),
  'dl-today': () => { state.dl.day = null; state.dl.anchor = state.dl.mode === 'week' ? weekStart(TODAY) : new Date(TODAY.getFullYear(), TODAY.getMonth(), 1); dlUpdate(); announce('Showing the current ' + state.dl.mode); },
  'dl-mode': btn => {
    const mode = btn.dataset.mode; if (mode === state.dl.mode) return;
    const [s] = dlRange();
    state.dl.mode = mode; state.dl.day = null;
    if (mode === 'month') state.dl.anchor = new Date(state.dl.anchor.getFullYear(), state.dl.anchor.getMonth(), 1);
    else state.dl.anchor = (TODAY.getMonth() === s.getMonth() && TODAY.getFullYear() === s.getFullYear()) ? weekStart(TODAY) : weekStart(s);
    dlUpdate(); $('#dlm-' + mode).focus();
  },
  'dl-risk': () => { state.dl.riskOnly = !state.dl.riskOnly; dlUpdate(); const b = $('#dl-risk'); if (b && document.activeElement === document.body) b.focus(); },
  'dl-day': btn => { const d = parseISO(btn.dataset.date); state.dl.day = (state.dl.day && sameDay(state.dl.day, d)) ? null : d; dlUpdate(); const f = $(`.m-day[data-date="${btn.dataset.date}"]`); if (f) f.focus(); },
  'dl-all': () => { state.dl.day = null; dlUpdate(); $('#agenda-h').setAttribute('tabindex', '-1'); $('#agenda-h').focus(); },
  'dl-flag': btn => {
    const d = state.deadlines.find(x => x.id === btn.dataset.id); if (!d) return;
    d.atRisk = !d.atRisk;
    refresh();
    toast(d.atRisk ? `Flagged “${d.title}” as at risk.` : `Removed the at-risk flag from “${d.title}”.`, { icon: 'flag', undo: () => { d.atRisk = !d.atRisk; refresh(); } });
  },
  'dl-jump': () => {
    const [, e] = state.dl.day ? [state.dl.day, state.dl.day] : dlRange();
    const next = dlVisible().filter(d => !d.done && startOf(d.date) > e).sort((a, b) => a.date - b.date)[0];
    if (!next) return;
    state.dl.day = null;
    state.dl.anchor = state.dl.mode === 'week' ? weekStart(next.date) : new Date(next.date.getFullYear(), next.date.getMonth(), 1);
    dlUpdate(); announce(`Jumped to ${fmtLong(next.date)}`);
  },
  'rep-prev': () => { if (state.rep.idx < REPORT_COUNT - 1) { state.rep.idx++; repUpdate(); } },
  'rep-next': () => { if (state.rep.idx > 0) { state.rep.idx--; repUpdate(); } },
  'rep-latest': () => { state.rep.idx = 0; repUpdate(); },
  'rep-compare': () => { state.rep.compare = !state.rep.compare; $('#rep-compare').setAttribute('aria-checked', String(state.rep.compare)); if (state.rep.loaded[state.rep.idx] && !state.rep.loading) renderReport(); },
  'rep-retry': btn => withLoading(btn, () => repLoad(), 300),
  'rep-export': btn => withLoading(btn, openExport),
  'csv-copy': () => {
    const ta = $('#csv-text');
    const fallback = () => { ta.focus(); ta.select(); toast('CSV selected. Press Ctrl+C or Cmd+C to copy it.', { icon: 'copy' }); };
    try { navigator.clipboard.writeText(ta.value).then(() => toast('CSV copied to your clipboard.', { icon: 'copy' }), fallback); } catch (_) { fallback(); }
  },
  'csv-download': btn => {
    const filename = state.admin.csv.filename, csvData = state.admin.csv.csv;
    if (downloadsApi) {
      btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
      downloadsApi.save({ filename, data: csvData })
        .then(() => toast(`Saved ${filename}.`, { icon: 'download' }))
        .catch(e => {
          const c = e && e.code;
          if (c === 'declined') toast('Download cancelled. Nothing was saved.', { icon: 'download' });
          else if (c === 'rate_limited') toast('A save prompt is already open. Finish it, then try again.', { icon: 'alert' });
          else { downloadsApi = null; toast('Downloads are not available here. Use Copy CSV instead.', { icon: 'alert' }); }
        })
        .finally(() => { btn.removeAttribute('aria-busy'); btn.disabled = false; });
      return;
    }
    try {
      const url = URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }));
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast(`Downloading ${filename}.`, { icon: 'download' });
    } catch (_) { toast('The download could not start. Use Copy CSV instead.', { icon: 'alert' }); }
  },
  pref: btn => {
    const key = btn.dataset.key, on = btn.getAttribute('aria-checked') !== 'true';
    btn.setAttribute('aria-checked', String(on));
    if (key === 'simulateError') {
      state.simulateError = on;
      if (on) { state.wfLoaded = false; state.rep.loaded = {}; }
      toast(on ? 'The next Workflows or Reports load will fail once.' : 'Failed-load simulation is off.', { icon: 'alert' });
    } else {
      state.prefs[key] = on;
      toast(`${$('#' + btn.id + '-l').textContent} turned ${on ? 'on' : 'off'}.`);
    }
  },
  'reset-demo': () => confirmDialog({ title: 'Reset demo data?', body: 'Every workflow, deadline, exception and notification returns to its starting state. You can undo this right after.', confirm: 'Reset data', danger: true }).then(ok => {
    if (!ok) return;
    resetSnapshot = structuredClone({ workflows: state.workflows, archived: state.archived, deadlines: state.deadlines, exceptions: state.exceptions, notifications: state.notifications });
    seed();
    refresh();
    toast('Demo data reset.', { icon: 'refresh', undo: () => { Object.assign(state, structuredClone(resetSnapshot)); refresh(); } });
  }),
  faq: btn => { const open = btn.getAttribute('aria-expanded') !== 'true'; btn.setAttribute('aria-expanded', String(open)); document.getElementById(btn.getAttribute('aria-controls')).hidden = !open; },
  'sp-new': () => { renderSupport(); $('#sp-msg').focus(); },
  'focus-field': btn => { const el = document.getElementById(btn.dataset.target); if (el) { el.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); el.focus({ preventScroll: true }); } },
  'cf-edit': () => { state.contact.submitted = false; renderContactForm(); $('#c-name').focus(); },
  'cf-new': () => { state.contact = { values: {}, submitted: false, attempted: false }; renderContactForm(); $('#c-name').focus(); toast('Ready for a new request.'); }
};
function dlShift(dir) {
  state.dl.day = null;
  const a = state.dl.anchor;
  state.dl.anchor = state.dl.mode === 'week' ? addDays(7 * dir, a) : new Date(a.getFullYear(), a.getMonth() + dir, 1);
  dlUpdate();
}

/* Change handlers (selects) */
const CHANGES = {
  'wf-status': el => setStatus(el.dataset.id, el.value),
};
/* Form submissions */
const SUBMITS = {
  contact: (f, btn) => {
    state.contact.attempted = true;
    const errs = validateContact(true);
    showContactSummary(errs);
    if (errs.length) { $('#cf-summary').focus(); return; }
    withLoading(btn, () => {
      ['c-name', 'c-firm', 'c-email', 'c-phone', 'c-msg'].forEach(id => { state.contact.values[id] = $('#' + id).value.trim(); });
      state.contact.values['c-area'] = ddVal('c-area') || '';
      addLeadFromWebsite(state.contact.values);
      state.contact.submitted = true;
      renderContactSuccess();
      $('#cf-success').focus();
    }, 700);
  },
  'global-search': f => globalSearch($('input', f).value),
  'global-search-m': f => globalSearch($('input', f).value),
  reassign: (f, btn) => {
    const w = getWf(state.detailId); const to = ddVal('reassign-owner');
    if (to === w.owner) { toast(`${TEAM[to].name} already owns this workflow.`, { icon: 'alert' }); return; }
    withLoading(btn, () => {
      const prev = w.owner, prevSupport = [...w.support];
      w.owner = to;
      w.support = [...new Set([prev, ...w.support.filter(k => k !== to)])];
      const entry = addLog(w, `Reassigned owner from ${TEAM[prev].name} to ${TEAM[to].name}.`);
      refresh();
      $('#reassign-save').focus();
      toast(`${w.id} reassigned to ${TEAM[to].name}.`, { icon: 'users', undo: () => { w.owner = prev; w.support = prevSupport; removeLog(w, entry); refresh(); } });
    });
  },
  comment: (f, btn) => {
    const ta = $('#comment-text'); const v = ta.value.trim();
    if (!v) { setErr('comment-text', 'Write a comment before posting.'); ta.focus(); return; }
    if (v.length > 1000) { setErr('comment-text', 'Keep comments under 1,000 characters.'); ta.focus(); return; }
    setErr('comment-text', '');
    withLoading(btn, () => {
      const w = getWf(state.detailId);
      addLog(w, v, { kind: 'comment' });
      ta.value = '';
      refresh();
      $('#comment-text').focus();
      toast('Comment posted to the activity log.', { icon: 'message' });
    });
  },
  'new-wf': (f, btn) => {
    const title = $('#nw-title').value.trim(), matter = $('#nw-matter').value.trim();
    const dueOk = ddCommitTyped('nw-due'), due = ddVal('nw-due');
    const e1 = title.length < 3 ? 'Give the workflow a name of at least 3 characters.' : '';
    const e2 = !matter ? 'Enter the matter, or “Firmwide” if it is not tied to one.' : '';
    if (dueOk && !due) ddError('nw-due', 'Choose a due date.');
    const e3 = !dueOk || !due ? 'due' : '';
    setErr('nw-title', e1); setErr('nw-matter', e2);
    const first = [['nw-title', e1], ['nw-matter', e2], ['nw-due', e3]].find(x => x[1]);
    if (first) { $('#' + first[0]).focus(); return; }
    withLoading(btn, () => {
      const num = Math.max(...[...state.workflows, ...state.archived].map(w => +w.id.split('-')[1])) + 1;
      const type = ddVal('nw-type'), owner = ddVal('nw-owner') || pFirm().lead, tpl = state.templates.find(x => x.id === type);
      const w = { id: `HL-${num}`, firm: state.portalFirm, title, matter, type, area: ddVal('nw-area'), owner, status: 'on-track', due, attorney: pFirm().contact.name, support: owner === pFirm().lead ? [] : [pFirm().lead],
        steps: tpl.steps.map(st => ({ title: st.title, auto: !!st.auto, review: !!st.review, done: false, by: null, at: null })), log: [], completedNow: false, completedOnTime: false };
      addLog(w, 'Requested this workflow from the client portal.');
      state.workflows.unshift(w);
      state.newIds.add(w.id);
      closeLayer(modalRoot(), { restoreFocus: false });
      refresh();
      const visibleNow = state.view === 'workflows' && filteredWfs().includes(w);
      toast(`${w.id} created${state.view === 'workflows' && !visibleNow ? '. Clear filters to see it in the table' : ''}.`, { icon: 'plus', action: { label: 'Open', fn: () => openDetail(w.id) } });
      const t = $('#view-title'); if (t) t.focus({ preventScroll: true });
    });
  },
  message: (f, btn) => {
    const v = $('#msg-body').value.trim();
    if (!v) { setErr('msg-body', 'Write a message before sending.'); $('#msg-body').focus(); return; }
    setErr('msg-body', '');
    withLoading(btn, () => { const to = TEAM[ddVal('msg-to')].name; closeLayer(modalRoot()); toast(`Message sent to ${to}.`, { icon: 'send' }); });
  },
  profile: (f, btn) => {
    const name = $('#pf-name').value.trim(), email = $('#pf-email').value.trim(), phone = $('#pf-phone').value.trim();
    const e1 = name.length < 2 ? 'Enter your full name.' : '';
    const e2 = !EMAIL_RE.test(email) ? 'Enter an email address in the format name@firm.com.' : '';
    const e3 = phone && digits(phone) < 10 ? 'Enter a phone number with at least 10 digits, or leave it blank.' : '';
    setErr('pf-name', e1); setErr('pf-email', e2); setErr('pf-phone', e3);
    const first = [['pf-name', e1], ['pf-email', e2], ['pf-phone', e3]].find(x => x[1]);
    if (first) { $('#' + first[0]).focus(); return; }
    withLoading(btn, () => { state.profile = { name, title: $('#pf-title').value.trim() || 'Client team member', email, phone }; updateChrome(); toast('Profile saved.', { icon: 'user' }); });
  },
  support: (f, btn) => {
    const v = $('#sp-msg').value.trim();
    if (v.length < 10) { setErr('sp-msg', 'Describe what you need in at least 10 characters.'); $('#sp-msg').focus(); return; }
    setErr('sp-msg', '');
    withLoading(btn, () => { const ref = 'SR-' + (4100 + Math.floor(Math.random() * 800)); renderSupport({ ref, topic: ddVal('sp-topic'), msg: v }); $('#sp-new').focus(); toast(`Support request ${ref} logged.`); });
  }
};
function globalSearch(q) {
  state.wf = { ...state.wf, q: q.trim(), area: [], owner: 'all', status: 'all' };
  const ms = $('#mobile-search');
  if (ms.classList.contains('is-open')) { ms.classList.remove('is-open'); $('[data-action="toggle-search"]').setAttribute('aria-expanded', 'false'); }
  if (state.view === 'workflows' && location.hash === '#workflows') { const i = $('#wf-q'); if (i) i.value = state.wf.q; wfUpdate(); const t = $('#wf-q'); if (t) t.focus(); }
  else location.hash = 'workflows';
  announce(q.trim() ? `Showing workflows matching ${q.trim()}` : 'Showing all workflows');
}

/* =========================================================
   Global events
   ========================================================= */
document.addEventListener('click', e => {
  if (pop && !pop.el.contains(e.target) && !pop.trigger.contains(e.target)) closePop(false);
  const act = e.target.closest('[data-action]');
  if (act && !act.disabled && ACTIONS[act.dataset.action]) { e.preventDefault(); ACTIONS[act.dataset.action](act, e); return; }
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    if (a.dataset.wfStatus) state.wf = { ...state.wf, q: '', area: 'all', owner: 'all', status: a.dataset.wfStatus };
    if (a.dataset.area) pendingArea = a.dataset.area;
    pendingFocus = a.dataset.focus || null;
    if (pop && pop.el.contains(a)) closePop(false);
    const h = a.getAttribute('href');
    if (h === (location.hash || '#home')) { e.preventDefault(); route({ same: true }); }
  }
});
document.addEventListener('change', e => { const t = e.target.closest('[data-change]'); if (t && CHANGES[t.dataset.change]) CHANGES[t.dataset.change](t, e); });
let qTimer;
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset && t.dataset.input === 'wf-q') { clearTimeout(qTimer); qTimer = setTimeout(() => { state.wf.q = t.value; wfUpdate(); }, 140); }
  if (t.closest && t.closest('#contact-form') && state.contact.attempted) { const errs = validateContact(false); ['c-name', 'c-email', 'c-phone'].forEach(id => { if (id === t.id && !errs.some(x => x.id === id)) setErr(id, ''); }); }
  if (t.id === 'comment-text' || t.id === 'msg-body' || t.id === 'sp-msg' || t.id.startsWith('nw-') || t.id.startsWith('pf-')) { if (t.getAttribute('aria-invalid') === 'true' && t.value.trim()) setErr(t.id, ''); }
});
document.addEventListener('focusout', e => {
  const t = e.target;
  if (t.closest && t.closest('#contact-form') && state.contact.attempted && ['c-name', 'c-email', 'c-phone'].includes(t.id)) {
    const err = validateContact(false).find(x => x.id === t.id);
    setErr(t.id, err ? err.m : '');
    showContactSummary(validateContact(false));
  }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  const fn = SUBMITS[f.dataset.form];
  if (fn) fn(f, e.submitter || $('[type="submit"]', f));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (pop) { e.preventDefault(); closePop(true); return; }
    const top = layers[layers.length - 1];
    if (top) { e.preventDefault(); closeLayer(top.el); return; }
    const ms = $('#mobile-search');
    if (ms.classList.contains('is-open')) { ms.classList.remove('is-open'); const b = $('[data-action="toggle-search"]'); b.setAttribute('aria-expanded', 'false'); b.focus(); }
    return;
  }
  if (pop && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key) && pop.el.contains(document.activeElement)) {
    const items = $$('[role="menuitem"]:not([disabled]), .notif, .pop-head button:not([disabled])', pop.el).filter(visible);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next].focus();
    return;
  }
  if (e.key === 'Tab') {
    if (pop && pop.el.id === 'floatmenu') { closePop(true); return; }
    const top = layers[layers.length - 1];
    if (!top) return;
    const f = focusables(top.trap);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    const inside = top.trap.some(r => r.contains(document.activeElement));
    if (!inside) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.addEventListener('scroll', () => {
  if (!pop || pop.el.id !== 'floatmenu') return;
  const r = pop.trigger.getBoundingClientRect();
  if (!document.contains(pop.trigger) || r.bottom < 0 || r.top > window.innerHeight) closePop(false); else positionFloat(pop.trigger);
}, true);
let lastW = window.innerWidth, rTimer;
window.addEventListener('resize', () => {
  clearTimeout(rTimer);
  rTimer = setTimeout(() => {
    const w = window.innerWidth;
    if (w === lastW) return;
    lastW = w;
    if (pop && pop.el.id === 'floatmenu') closePop(false);
    const mm = $('#mobile-menu'); if (w >= 1080 && isOpen(mm)) closeLayer(mm, { restoreFocus: false });
    const sb = $('#sidebar'); if (w > 900 && isOpen(sb)) closeLayer(sb, { restoreFocus: false });
    if (state.surface === 'portal' && state.view === 'overview' && !state.trend.table) renderTrend();
    if (state.surface === 'portal' && state.view === 'reports' && state.rep.loaded[state.rep.idx] && !state.rep.loading) drawReportBars();
  }, 150);
});
window.addEventListener('hashchange', () => route());
