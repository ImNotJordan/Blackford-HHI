/* Mock data for the Hyacinth Legal Support prototype (fictional firms, people and matters).
   Ported verbatim from the legacy vanilla app (legacy/src/js). */
import type { AreaKey, StatusKey, Staff, RepSeed, LegalPage, Profile, FirmStatus, Role, Feature, LeadStage, AuditType, AccessLevel } from './types';
import type { IconName } from '@/components/icons';

export const AREAS: Record<AreaKey, string> = { cx: 'Client Experience', lo: 'Legal Operations', fa: 'Finance + Administration', go: 'Growth Operations', dv: 'Data + Management Visibility', ct: 'Custom Operating Teams' };

export const STATUS: Record<StatusKey, string> = { 'on-track': 'On track', 'at-risk': 'At risk', review: 'Awaiting review', blocked: 'Blocked', complete: 'Complete' };

export const STATUS_ORDER: StatusKey[] = ['at-risk', 'blocked', 'review', 'on-track', 'complete'];

export const TEAM: Record<string, Staff> = {
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

export const TYPE_LABEL: Record<string, string> = { intake: 'Intake', records: 'Records', docket: 'Deadline tracking', billing: 'Billing', comms: 'Client communications', collection: 'Document collection', data: 'Data administration', reporting: 'Reporting', crm: 'CRM administration', scheduling: 'Scheduling', finance: 'Finance workflow', filing: 'Filing support', custom: 'Custom operating team', followup: 'Follow-up', collections: 'Collections' };

export const TEMPLATES: Record<string, [string, number, number?][]> = {
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

export const SEED: [string, string, string, string, AreaKey, string, StatusKey, number, string, string[], number][] = [
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

export const NOTES: Record<string, string> = {
  'HL-2038': 'St. Brigid Imaging requires its own release form. Sent to the client for signature. The production deadline is at risk.',
  'HL-2029': 'No reply from the client since last week. Escalating to the attorney if there is no response by tomorrow.',
  'HL-2017': 'Two of three witnesses are unavailable in the noticed window. Proposing alternate dates.',
  'HL-2008': 'Three claimants are still missing water district account numbers.',
  'HL-2041': 'Intake summary is ready for attorney review.',
  'HL-2033': 'Pre-bills are ready. 14 entries need task codes before invoices go out.',
  'HL-2019': 'Chronology drafted and ready for review.'
};

export const DL_SEED: [string, string, string, number, string, boolean, boolean?][] = [
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

export const EX_SEED: [string, string, string, string, "high" | "med", string][] = [
  ['EX1', 'Provider requires its own authorization form', 'St. Brigid Imaging will not accept the standard HIPAA release. A client signature is needed on their form.', 'HL-2038', 'high', '2 hr ago'],
  ['EX2', 'Client unresponsive after three attempts', 'No reply to calls or texts since last Tuesday. Next step is a letter by mail.', 'HL-2029', 'high', '5 hr ago'],
  ['EX3', 'Witness availability conflict', 'Two of three deponents are unavailable in the noticed window.', 'HL-2017', 'high', 'Yesterday'],
  ['EX4', 'Time entries missing task codes', '14 entries need task codes before pre-bills go to the partner.', 'HL-2033', 'med', 'Yesterday'],
  ['EX5', 'Duplicate contacts found in case management', '38 likely duplicates are queued for confirmation before merge.', 'HL-2027', 'med', '2 days ago'],
  ['EX6', 'Claimants missing account numbers', 'Three claimants have not provided water district account numbers.', 'HL-2008', 'med', '2 days ago']
];

export const REP_SEED: RepSeed[] = [
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

export const LEGAL: Record<string, LegalPage> = {
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

export const VIEWER: Profile = { name: 'Morgan Hale', title: 'Director of Operations', email: 'morgan.hale@calderwhitmore.example', phone: '(312) 555-0148' };

export const SP_TOPICS: string[] = ['Workflow question', 'Deadline change', 'Report question', 'Portal access', 'Something else'];

export const FAQ: [string, string][] = [
  ['How is the SLA on-time percentage calculated?', 'It is the share of workflows completed on or before their due date over the last 30 days. When you mark a workflow complete in the portal, it counts toward the figure right away.'],
  ['How do I request a new workflow?', 'Use “New workflow” on the Workflows page or “Request a workflow” on Overview. Your engagement lead confirms the steps and owner within one business day.'],
  ['What are automated steps?', 'Steps shown on a parchment background with a gold outline run automatically, such as conflict checks or reminder sequences. You can run a queued automated step right away with “Run now”.'],
  ['Who sees comments in the activity log?', 'Everyone assigned to the workflow at Hyacinth and at your firm. Comments are timestamped and stay on the workflow’s record.']
];

export const AREA_OPTS: string[] = ['Client Operations', 'Legal Support', 'Business Operations', 'Not sure yet'];

export const FIRM_STATUSES: FirmStatus[] = ['Onboarding', 'Active', 'Paused'];

export const FS_ICON: Record<FirmStatus, IconName> = { Onboarding: 'clock', Active: 'check', Paused: 'block' };

export const ROLES: Role[] = ['Super Admin', 'Operations Manager', 'Team Lead'];

export const ROLE_DESC: Record<string, string> = { 'Super Admin': 'Everything, including roles and settings', 'Operations Manager': 'Clients, workflows, team, leads and content', 'Team Lead': 'Workflows and leads; read-only elsewhere' };

export const FEATURES: [Feature, string][] = [
  ['clients', 'Manage client firms'], ['workflows', 'Manage workflows and bulk actions'], ['templates', 'Edit workflow templates'],
  ['team', 'Manage team and capacity'], ['leads', 'Manage leads'], ['content', 'Edit and publish website content'],
  ['users', 'Invite and manage users'], ['perms', 'Edit roles and permissions'], ['audit', 'View the audit log'],
  ['export', 'Export data'], ['settings', 'Edit settings']
];

export const LEAD_STAGES: LeadStage[] = ['New', 'Contacted', 'Discovery call', 'Proposal', 'Won', 'Lost'];

export const AUDIT_TYPES: AuditType[] = ['Create', 'Edit', 'Status change', 'Publish', 'Role change', 'Delete', 'Export', 'Access'];

export const ACCESS_LEVELS: AccessLevel[] = ['Super Admin', 'Operations Manager', 'Team Lead', 'Specialist'];

export const TPL_AREA: Record<string, AreaKey> = { intake: 'cx', records: 'lo', docket: 'lo', billing: 'fa', comms: 'cx', collection: 'cx', data: 'dv', reporting: 'dv', crm: 'go', scheduling: 'cx', finance: 'fa', filing: 'lo', custom: 'ct', followup: 'cx', collections: 'fa' };

export const TPL_NAME: Record<string, string> = { intake: 'Client intake', records: 'Records request', docket: 'Deadline tracking', billing: 'Billing cycle', comms: 'Client status updates', collection: 'Document collection', data: 'Data administration', reporting: 'Management reporting', crm: 'CRM administration', scheduling: 'Deposition scheduling', finance: 'Trust reconciliation', filing: 'Settlement filing', custom: 'Lien resolution', followup: 'Claimant follow-up', collections: 'Collections' };

export const OTHER_SEED: [string, string, string, string, string, AreaKey, string, StatusKey, number, string, string[], number][] = [
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

export const OTHER_DL: [string, string, string, number, string, boolean][] = [
  ['D30', 'Records production due', 'Discovery', 1, 'HL-2034', true], ['D31', 'Chronology to attorney', 'Client deliverable', 2, 'HL-2021', false],
  ['D32', 'Scheduling order deadlines entered', 'Filing', 0, 'HL-2032', true], ['D33', 'Trust reconciliation sign-off', 'Billing', 2, 'HL-2018', true],
  ['D34', 'Invoices issued', 'Billing', 9, 'HL-2039', false], ['D35', 'Intake process go-live', 'Client deliverable', 8, 'HL-2043', false]
];

export const KIND_TIME: Record<string, [number, number]> = { Filing: [17, 0], Discovery: [17, 0], Hearing: [9, 30], Billing: [12, 0], Report: [10, 0], 'Client deliverable': [15, 0] };

export const CONTENT_SEED: Record<string, string> = {
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

export const NOTIFY_EVENTS: [string, string][] = [['lead', 'New lead from the website'], ['risk', 'Workflow or deadline at risk'], ['publish', 'Website content published'], ['invite', 'User invite accepted'], ['digest', 'Daily operations digest']];

export const CE_GROUPS: [string, ([string, string, boolean?] | [string, string, boolean?][])[]][] = [
  ['Hero', [['hero.line', 'Headline'], ['hero.accent', 'Italic second line'], ['hero.sub', 'Positioning sentence', true]]],
  ['Three pillars', [0, 1, 2].map(i => [[`p${i}.title`, `Pillar ${i + 1} title`], [`p${i}.tag`, 'Tagline'], [`p${i}.text`, 'Description', true]])],
  ['Six service areas', [0, 1, 2, 3, 4, 5].map(i => [[`a${i}.title`, `0${i + 1} title`], [`a${i}.text`, 'Description', true]])],
  ['Proof of execution stats', [0, 1, 2].map(i => [[`s${i}.fig`, `Stat ${i + 1} figure`], [`s${i}.label`, 'Label']])],
  ['Contact representative', [['rep.name', 'Name'], ['rep.email', 'Email'], ['rep.phone', 'Phone']]]
];

export const TREND_OPENED = [38, 42, 40, 47, 51, 49, 55, 53, 58, 54, 60, 57];
export const TREND_COMPLETED = [35, 39, 41, 44, 47, 50, 51, 54, 55, 56, 58, 59];
export const REPORT_COUNT = 4; // the fifth seeded month exists only as the comparison base
export const STATUS_ICON: Record<StatusKey, IconName> = { 'on-track': 'clock', 'at-risk': 'alert', review: 'eye', blocked: 'block', complete: 'check' };
export const TIME_OPTS = Array.from({ length: 96 }, (_, i) => { const h = Math.floor(i / 4), m = (i % 4) * 15; return { value: `${h}:${String(m).padStart(2, '0')}`, label: `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }; });
export const FEATURE_LABEL = Object.fromEntries(FEATURES) as Record<Feature, string>;
