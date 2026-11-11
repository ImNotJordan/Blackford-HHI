'use client';
/* One shared in-memory store for the website, client portal and admin.
   Rules:
   - Components read with `useApp(selector)` and call actions from `useApp.getState()` or the hook.
   - Every action that changes data returns an `Undo` function (pass it to `toast(msg, { undo })`).
   - Actions taken on the admin surface write an audit entry automatically. */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { seedAll, seedPortal, newId, type SeedData } from './seed';
import { diffDays, fmtD, fmtDT, today } from './format';
import { STATUS, FEATURE_LABEL, NOTIFY_EVENTS } from './data';
import type {
  Workflow, StatusKey, Undo, Surface, Role, Feature, FirmStatus, LeadStage, AuditType, Contact, Firm, Template, Settings,
  AreaKey, ContactValues, PortalUser, Staff, Profile, Lead
} from './types';

enableMapSet();

export interface AdminSession { signedIn: boolean; name: string; email: string; role: Role; keep: boolean }
export interface Session {
  surface: Surface;
  portalFirm: string;
  viewAs: boolean;
  portalSignedOut: boolean;
  admin: AdminSession;
  simulateError: boolean;
  prefs: { digest: boolean; alerts: boolean; reportReady: boolean };
  slaBase: { total: number; onTime: number };
  workflowsLoaded: boolean;
}
export interface FirmInput {
  name: string; city: string; status: FirmStatus; contact: Contact; services: AreaKey[]; since: Date; lead: string; team: string[];
}
export interface NewWorkflowInput { title: string; matter: string; area: AreaKey; type: string; owner: string; due: Date }

export interface AppActions {
  /* session */
  setSurface(s: Surface): void;
  viewAsClient(firmId: string): void;
  exitViewAs(): void;
  portalSignOut(): void;
  portalSignIn(): void;
  adminSignIn(email: string, keep: boolean): void;
  adminSignOut(): void;
  setRole(role: Role): void;
  setSimulateError(on: boolean): void;
  consumeSimulatedError(): boolean;
  setWorkflowsLoaded(): void;
  setPref(key: keyof Session['prefs'], on: boolean): void;
  updateProfile(p: Profile): void;
  resetPortalDemo(): Undo;
  /* workflows (portal + admin) */
  setWorkflowStatus(id: string, status: StatusKey): Undo;
  completeStep(id: string, index: number, opts?: { auto?: boolean }): { undo: Undo; reviewed: boolean; allDone: boolean };
  reassignWorkflow(id: string, owner: string): Undo;
  setWorkflowDue(id: string, due: Date): Undo;
  addComment(id: string, text: string): void;
  createWorkflow(input: NewWorkflowInput): string;
  archiveWorkflows(ids: string[]): Undo;
  restoreWorkflow(id: string): void;
  toggleEscalation(id: string): Undo;
  bulkReassign(ids: string[], owner: string): Undo;
  bulkStatus(ids: string[], status: StatusKey): Undo;
  bulkDue(ids: string[], due: Date): Undo;
  /* portal items */
  resolveException(id: string): Undo;
  snoozeException(id: string, days: number): Undo;
  unsnoozeException(id: string): void;
  toggleDeadlineRisk(id: string): Undo;
  readNotification(id: string): void;
  readAllNotifications(): Undo;
  /* leads */
  addLeadFromWebsite(v: ContactValues): Lead;
  setLeadStage(id: string, stage: LeadStage): Undo;
  setLeadRep(id: string, rep: string): Undo;
  setLeadFollowUp(id: string, when: Date | null): Undo;
  addLeadNote(id: string, text: string): void;
  /* firms */
  createFirm(input: FirmInput, leadId?: string): string;
  updateFirm(id: string, input: FirmInput): void;
  setFirmStatus(id: string, status: FirmStatus): Undo;
  addFirmNote(id: string, text: string): void;
  addFirmContact(id: string, c: Contact): void;
  /* templates, team */
  saveTemplate(t: Omit<Template, 'id'> & { id?: string | null }): string;
  saveMember(key: string | null, data: Omit<Staff, 'active'>, clients: string[]): string;
  setMemberActive(key: string, active: boolean): Undo;
  /* content */
  setDraft(key: string, value: string): void;
  discardDraft(): Undo;
  publishContent(): Undo;
  /* users, permissions, settings, audit */
  inviteUser(u: Omit<PortalUser, 'id' | 'last' | 'status'>): void;
  setUserStatus(id: string, status: PortalUser['status']): Undo;
  logUserAction(action: string, target: string): void;
  setPerm(role: Role, feature: Feature, on: boolean): Undo;
  saveSettings(patch: Partial<Settings>, auditText: string): void;
  setNotify(key: string, channel: 'email' | 'app', on: boolean): void;
  logAudit(type: AuditType, action: string, target: string): void;
}
export type AppState = SeedData & Session & AppActions;

/* "Keep me signed in on this device": only the staff session (name, email, role) is saved, never data. */
const ADMIN_KEY = 'hhi-admin-session';
function loadAdminSession(): AdminSession {
  const base: AdminSession = { signedIn: false, name: '', email: '', role: 'Super Admin', keep: true };
  if (typeof window === 'undefined') return base;
  try {
    const v = JSON.parse(window.localStorage.getItem(ADMIN_KEY) || 'null');
    if (v && v.signedIn === true && typeof v.email === 'string' && typeof v.name === 'string' && ['Super Admin', 'Operations Manager', 'Team Lead'].includes(v.role)) {
      return { ...base, signedIn: true, email: v.email, name: v.name, role: v.role, keep: true };
    }
  } catch { /* storage unavailable: stay signed out */ }
  return base;
}
function saveAdminSession(a: AdminSession | null) {
  try {
    if (a && a.signedIn && a.keep) window.localStorage.setItem(ADMIN_KEY, JSON.stringify({ signedIn: true, email: a.email, name: a.name, role: a.role }));
    else window.localStorage.removeItem(ADMIN_KEY);
  } catch { /* ignore */ }
}

const initialSession = (): Session => ({
  surface: 'site', portalFirm: 'cw', viewAs: false, portalSignedOut: false,
  admin: loadAdminSession(),
  simulateError: false,
  prefs: { digest: true, alerts: true, reportReady: true },
  slaBase: { total: 214, onTime: 207 },
  workflowsLoaded: false
});

export const useApp = create<AppState>()(immer((set, get) => {
  /* ---------- internal helpers ---------- */
  const actor = () => { const s = get(); return s.surface === 'admin' ? (s.admin.name || 'Hyacinth staff') : s.profile.name; };
  const firmName = (id: string) => get().firms.find(f => f.id === id)?.name || 'Unknown firm';
  const auditIfAdmin = (type: AuditType, action: string, target: string) => { if (get().surface === 'admin') get().logAudit(type, action, target); };
  const wfIndex = (id: string) => get().workflows.findIndex(w => w.id === id);
  /** Snapshot workflows by id and return an Undo that puts those exact objects back. */
  const snapWorkflows = (ids: string[]): Undo => {
    const prev = get().workflows.filter(w => ids.includes(w.id));
    return () => set(d => { prev.forEach(p => { const i = d.workflows.findIndex(w => w.id === p.id); if (i >= 0) d.workflows[i] = p as Workflow; }); });
  };
  const applyStatus = (w: Workflow, s: StatusKey) => { w.status = s; w.completedNow = s === 'complete'; w.completedOnTime = s === 'complete' && diffDays(w.due) >= 0; };
  const log = (w: Workflow, text: string, extra: Partial<Workflow['log'][number]> = {}) => { w.log.unshift({ who: actor(), text, at: new Date(), kind: 'event', ...extra }); };

  return {
    ...seedAll(),
    ...initialSession(),

    /* ---------- session ---------- */
    setSurface: s => set(d => { d.surface = s; }),
    viewAsClient: firmId => { set(d => { d.portalFirm = firmId; d.viewAs = true; }); get().logAudit('Access', `Viewed the client portal as ${firmName(firmId)}`, firmName(firmId)); },
    exitViewAs: () => set(d => { d.viewAs = false; d.portalFirm = 'cw'; }),
    portalSignOut: () => set(d => { d.portalSignedOut = true; }),
    portalSignIn: () => set(d => { d.portalSignedOut = false; }),
    adminSignIn: (email, keep) => {
      const local = email.split('@')[0].split(/[._-]+/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
      set(d => { d.admin.signedIn = true; d.admin.email = email; d.admin.name = local || 'Hyacinth staff'; d.admin.keep = keep; });
      saveAdminSession(get().admin);
      get().logAudit('Access', 'Signed in to admin', 'Admin');
    },
    adminSignOut: () => { get().logAudit('Access', 'Signed out of admin', 'Admin'); set(d => { d.admin.signedIn = false; }); saveAdminSession(null); },
    setRole: role => { set(d => { d.admin.role = role; }); saveAdminSession(get().admin); get().logAudit('Role change', `Switched the demo role to ${role}`, 'Role switcher'); },
    setSimulateError: on => set(d => { d.simulateError = on; if (on) d.workflowsLoaded = false; }),
    consumeSimulatedError: () => { const on = get().simulateError; if (on) set(d => { d.simulateError = false; }); return on; },
    setWorkflowsLoaded: () => set(d => { d.workflowsLoaded = true; }),
    setPref: (key, on) => set(d => { d.prefs[key] = on; }),
    updateProfile: p => set(d => { d.profile = p; }),
    resetPortalDemo: () => {
      const s = get(), prev = { workflows: s.workflows, archived: s.archived, deadlines: s.deadlines, exceptions: s.exceptions, notifications: s.notifications };
      set(d => { Object.assign(d, seedPortal(s.team)); });
      return () => set(d => { Object.assign(d, prev); });
    },

    /* ---------- workflows ---------- */
    setWorkflowStatus: (id, status) => {
      const i = wfIndex(id); if (i < 0) return () => {};
      const undo = snapWorkflows([id]);
      const from = get().workflows[i].status;
      set(d => { const w = d.workflows[i]; applyStatus(w, status); log(w, `Changed status from ${STATUS[from]} to ${STATUS[status]}.`); });
      auditIfAdmin('Status change', `Set ${id} to ${STATUS[status]}`, firmName(get().workflows[i].firm));
      return undo;
    },
    completeStep: (id, index, opts = {}) => {
      const i = wfIndex(id), undo = snapWorkflows([id]);
      let reviewed = false;
      set(d => {
        const w = d.workflows[i], st = w.steps[index];
        if (!st || st.done) return;
        st.done = true; st.by = opts.auto ? 'Automation' : actor(); st.at = new Date();
        if (opts.auto) log(w, `Ran “${st.title}” on request.`, { who: 'Automation', sys: true });
        else log(w, st.review ? `Recorded attorney review: “${st.title}”.` : `Marked “${st.title}” complete.`);
        if (st.review && w.status === 'review') { w.status = 'on-track'; reviewed = true; }
      });
      const w = get().workflows[i];
      auditIfAdmin('Edit', `Completed a step on ${id}`, firmName(w.firm));
      return { undo, reviewed, allDone: w.steps.every(s => s.done) };
    },
    reassignWorkflow: (id, owner) => {
      const i = wfIndex(id), undo = snapWorkflows([id]), team = get().team;
      const prev = get().workflows[i].owner;
      set(d => { const w = d.workflows[i]; w.owner = owner; w.support = [...new Set([prev, ...w.support.filter(k => k !== owner)])]; log(w, `Reassigned owner from ${team[prev].name} to ${team[owner].name}.`); });
      auditIfAdmin('Edit', `Reassigned ${id} to ${team[owner].name}`, firmName(get().workflows[i].firm));
      return undo;
    },
    setWorkflowDue: (id, due) => {
      const i = wfIndex(id), undo = snapWorkflows([id]), prev = get().workflows[i].due;
      set(d => { const w = d.workflows[i]; w.due = due; log(w, `Moved the due date from ${fmtD(prev)} to ${fmtD(due)}.`); });
      auditIfAdmin('Edit', `Set due date ${fmtD(due)} on ${id}`, firmName(get().workflows[i].firm));
      return undo;
    },
    addComment: (id, text) => set(d => { const w = d.workflows.find(x => x.id === id); if (w) w.log.unshift({ who: actor(), text, at: new Date(), kind: 'comment' }); }),
    createWorkflow: input => {
      const s = get(), firm = s.firms.find(f => f.id === s.portalFirm)!;
      const num = Math.max(...[...s.workflows, ...s.archived].map(w => +w.id.split('-')[1])) + 1;
      const tpl = s.templates.find(t => t.id === input.type) || s.templates[0];
      const id = `HL-${num}`;
      const w: Workflow = {
        id, firm: firm.id, title: input.title, matter: input.matter, type: tpl.id, area: input.area, owner: input.owner, status: 'on-track', due: input.due,
        attorney: firm.contact.name, support: input.owner === firm.lead ? [] : [firm.lead],
        steps: tpl.steps.map(st => ({ title: st.title, auto: st.auto, review: st.review, done: false, by: null, at: null })),
        log: [{ who: actor(), text: 'Requested this workflow from the client portal.', at: new Date(), kind: 'event' }],
        completedNow: false, completedOnTime: false
      };
      set(d => { d.workflows.unshift(w); });
      return id;
    },
    archiveWorkflows: ids => {
      const s = get(), items = ids.map(id => ({ w: s.workflows.find(x => x.id === id)!, i: s.workflows.findIndex(x => x.id === id) })).filter(x => x.w);
      set(d => { d.workflows = d.workflows.filter(w => !ids.includes(w.id)); d.archived.push(...(items.map(x => x.w) as Workflow[])); });
      auditIfAdmin('Delete', `Archived ${items.length} ${items.length === 1 ? 'workflow' : 'workflows'}`, ids.join(', '));
      return () => set(d => {
        d.archived = d.archived.filter(w => !ids.includes(w.id));
        items.sort((a, b) => a.i - b.i).forEach(({ w, i }) => d.workflows.splice(Math.min(i, d.workflows.length), 0, w as Workflow));
      });
    },
    restoreWorkflow: id => set(d => { const w = d.archived.find(x => x.id === id); if (!w) return; d.archived = d.archived.filter(x => x.id !== id); d.workflows.unshift(w); }),
    toggleEscalation: id => {
      const i = wfIndex(id), undo = snapWorkflows([id]), was = !!get().workflows[i].escalated;
      set(d => { const w = d.workflows[i]; w.escalated = !was; log(w, was ? 'Removed the escalation.' : 'Escalated to the engagement lead.'); });
      auditIfAdmin('Status change', `${was ? 'De-escalated' : 'Escalated'} ${id}`, firmName(get().workflows[i].firm));
      return undo;
    },
    bulkReassign: (ids, owner) => {
      const undo = snapWorkflows(ids), name = get().team[owner].name;
      set(d => { d.workflows.forEach(w => { if (ids.includes(w.id)) { w.owner = owner; w.log.unshift({ who: actor(), text: `Reassigned to ${name} in a bulk update.`, at: new Date(), kind: 'event' }); } }); });
      auditIfAdmin('Edit', `Reassigned ${ids.length} workflows to ${name}`, `${ids.length} workflows`);
      return undo;
    },
    bulkStatus: (ids, status) => {
      const undo = snapWorkflows(ids);
      set(d => { d.workflows.forEach(w => { if (ids.includes(w.id)) { applyStatus(w, status); w.log.unshift({ who: actor(), text: `Set to ${STATUS[status]} in a bulk update.`, at: new Date(), kind: 'event' }); } }); });
      auditIfAdmin('Edit', `Set ${ids.length} workflows to ${STATUS[status]}`, `${ids.length} workflows`);
      return undo;
    },
    bulkDue: (ids, due) => {
      const undo = snapWorkflows(ids);
      set(d => { d.workflows.forEach(w => { if (ids.includes(w.id)) { w.due = due; w.log.unshift({ who: actor(), text: `Due date set to ${fmtD(due)} in a bulk update.`, at: new Date(), kind: 'event' }); } }); });
      auditIfAdmin('Edit', `Set due date ${fmtD(due)} on ${ids.length} workflows`, `${ids.length} workflows`);
      return undo;
    },

    /* ---------- portal items ---------- */
    resolveException: id => {
      const s = get(), i = s.exceptions.findIndex(e => e.id === id), ex = s.exceptions[i];
      if (!ex) return () => {};
      const wfUndo = snapWorkflows([ex.wf]);
      set(d => { d.exceptions.splice(i, 1); const w = d.workflows.find(x => x.id === ex.wf); if (w) log(w, `Resolved exception: ${ex.title}.`); });
      return () => { set(d => { d.exceptions.splice(i, 0, ex); }); wfUndo(); };
    },
    snoozeException: (id, days) => {
      const prev = get().exceptions.find(e => e.id === id)?.snoozedUntil ?? null;
      const until = new Date(today()); until.setDate(until.getDate() + days);
      set(d => { const e = d.exceptions.find(x => x.id === id); if (e) e.snoozedUntil = until; });
      return () => set(d => { const e = d.exceptions.find(x => x.id === id); if (e) e.snoozedUntil = prev; });
    },
    unsnoozeException: id => set(d => { const e = d.exceptions.find(x => x.id === id); if (e) e.snoozedUntil = null; }),
    toggleDeadlineRisk: id => {
      const flip = () => set(d => { const x = d.deadlines.find(y => y.id === id); if (x) x.atRisk = !x.atRisk; });
      flip(); return flip;
    },
    readNotification: id => set(d => { const n = d.notifications.find(x => x.id === id); if (n) n.unread = false; }),
    readAllNotifications: () => {
      const ids = get().notifications.filter(n => n.unread).map(n => n.id);
      set(d => { d.notifications.forEach(n => { n.unread = false; }); });
      return () => set(d => { d.notifications.forEach(n => { if (ids.includes(n.id)) n.unread = true; }); });
    },

    /* ---------- leads ---------- */
    addLeadFromWebsite: v => {
      const n = Math.max(100, ...get().leads.map(l => +l.id.split('-')[1])) + 1;
      const lead: Lead = {
        id: `L-${n}`, name: v.name, firm: v.firm || 'Firm not provided', email: v.email, phone: v.phone, area: v.area || 'Not specified', msg: v.msg || '',
        status: 'New', rep: null, followUp: null, created: new Date(), notes: [], convertedFirm: null, isNew: true,
        log: [{ who: 'Website', sys: true, text: 'Submitted the website contact form.', at: new Date() }]
      };
      set(d => {
        d.leads.unshift(lead);
        d.audit.unshift({ id: newId('A'), at: new Date(), user: 'Website', role: 'Contact form', type: 'Create', action: `New lead from ${lead.name}`, target: lead.firm });
      });
      return lead;
    },
    setLeadStage: (id, stage) => {
      const l = get().leads.find(x => x.id === id); if (!l || l.status === stage) return () => {};
      const prev = l;
      set(d => { const x = d.leads.find(y => y.id === id)!; x.log.unshift({ who: actor(), text: `Moved from ${x.status} to ${stage}.`, at: new Date() }); x.status = stage; x.isNew = false; });
      get().logAudit('Status change', `Moved lead ${l.name} to ${stage}`, l.firm);
      return () => set(d => { const i = d.leads.findIndex(y => y.id === id); if (i >= 0) d.leads[i] = prev as Lead; });
    },
    setLeadRep: (id, rep) => {
      const prev = get().leads.find(x => x.id === id)!, name = get().team[rep].name;
      set(d => { const x = d.leads.find(y => y.id === id)!; x.rep = rep; x.log.unshift({ who: actor(), text: `Assigned to ${name}.`, at: new Date() }); });
      get().logAudit('Edit', `Assigned lead ${prev.name} to ${name}`, prev.firm);
      return () => set(d => { const i = d.leads.findIndex(y => y.id === id); if (i >= 0) d.leads[i] = prev as Lead; });
    },
    setLeadFollowUp: (id, when) => {
      const prev = get().leads.find(x => x.id === id)!, tz = get().settings.tz;
      set(d => { const x = d.leads.find(y => y.id === id)!; x.followUp = when; x.log.unshift({ who: actor(), text: when ? `Scheduled a follow-up for ${fmtDT(when, tz)}.` : 'Cleared the follow-up.', at: new Date() }); });
      get().logAudit('Edit', `${when ? 'Scheduled' : 'Cleared'} follow-up for ${prev.name}`, prev.firm);
      return () => set(d => { const i = d.leads.findIndex(y => y.id === id); if (i >= 0) d.leads[i] = prev as Lead; });
    },
    addLeadNote: (id, text) => {
      const l = get().leads.find(x => x.id === id)!;
      set(d => { d.leads.find(y => y.id === id)!.notes.unshift({ who: actor(), text, at: new Date() }); });
      get().logAudit('Edit', `Added a note to lead ${l.name}`, l.firm);
    },

    /* ---------- firms ---------- */
    createFirm: (input, leadId) => {
      let id = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 10) || 'firm';
      while (get().firms.some(f => f.id === id)) id += 'x';
      const contact = { ...input.contact, title: input.contact.title || 'Primary contact' };
      const firm: Firm = {
        id, name: input.name, city: input.city || 'City not set', status: input.status, since: input.since, contact, contacts: [{ ...contact, primary: true }],
        services: input.services, lead: input.lead, team: [input.lead, ...input.team.filter(k => k !== input.lead)], sla: null, scale: 0.3, notes: []
      };
      set(d => {
        d.firms.push(firm);
        if (leadId) { const l = d.leads.find(x => x.id === leadId); if (l) { l.convertedFirm = id; l.log.unshift({ who: actor(), text: `Converted to client firm ${firm.name}.`, at: new Date() }); } }
      });
      get().logAudit('Create', leadId ? `Converted lead to client firm ${firm.name}` : `Created client firm ${firm.name}`, firm.name);
      return id;
    },
    updateFirm: (id, input) => {
      set(d => {
        const f = d.firms.find(x => x.id === id); if (!f) return;
        Object.assign(f, { name: input.name, city: input.city, status: input.status, services: input.services, since: input.since, lead: input.lead, team: [input.lead, ...input.team.filter(k => k !== input.lead)] });
        Object.assign(f.contact, input.contact);
        f.contacts[0] = { ...f.contact, primary: true };
      });
      get().logAudit('Edit', `Edited client firm ${input.name}`, input.name);
    },
    setFirmStatus: (id, status) => {
      const f = get().firms.find(x => x.id === id)!, prev = f.status;
      set(d => { d.firms.find(x => x.id === id)!.status = status; });
      get().logAudit('Status change', `${status === 'Paused' ? 'Paused' : status === 'Active' ? 'Reactivated' : 'Set to Onboarding'} ${f.name}`, f.name);
      return () => set(d => { d.firms.find(x => x.id === id)!.status = prev; });
    },
    addFirmNote: (id, text) => { const f = get().firms.find(x => x.id === id)!; set(d => { d.firms.find(x => x.id === id)!.notes.unshift({ who: actor(), text, at: new Date() }); }); get().logAudit('Edit', `Added a note to ${f.name}`, f.name); },
    addFirmContact: (id, c) => { const f = get().firms.find(x => x.id === id)!; set(d => { d.firms.find(x => x.id === id)!.contacts.push(c); }); get().logAudit('Edit', `Added contact ${c.name}`, f.name); },

    /* ---------- templates, team ---------- */
    saveTemplate: t => {
      const id = t.id || newId('tpl');
      const data = { name: t.name, area: t.area, sla: t.sla, steps: t.steps.map(s => ({ title: s.title, auto: s.auto, review: s.review || /review|sign-off/i.test(s.title) })) };
      set(d => { const ex = d.templates.find(x => x.id === id); if (ex) Object.assign(ex, data); else d.templates.push({ id, ...data }); });
      get().logAudit(t.id ? 'Edit' : 'Create', `${t.id ? 'Edited' : 'Created'} the ${t.name} template`, 'Workflow templates');
      return id;
    },
    saveMember: (key, data, clients) => {
      let k = key;
      if (!k) { k = data.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'staff'; while (get().team[k]) k += 'x'; }
      const kk = k;
      set(d => {
        d.team[kk] = { ...(d.team[kk] || { active: true }), ...data, active: d.team[kk]?.active ?? true };
        d.firms.forEach(f => { const has = f.team.includes(kk); if (clients.includes(f.id) && !has) f.team.push(kk); if (!clients.includes(f.id) && has && f.lead !== kk) f.team = f.team.filter(y => y !== kk); });
      });
      get().logAudit(key ? 'Edit' : 'Create', `${key ? 'Edited' : 'Added'} team member ${data.name}`, 'Team');
      return kk;
    },
    setMemberActive: (key, active) => {
      const name = get().team[key].name;
      set(d => { d.team[key].active = active; });
      get().logAudit('Status change', `${active ? 'Reactivated' : 'Deactivated'} ${name}`, 'Team');
      return () => set(d => { d.team[key].active = !active; });
    },

    /* ---------- content ---------- */
    setDraft: (key, value) => set(d => { d.contentDraft[key] = value; }),
    discardDraft: () => { const snap = { ...get().contentDraft }; set(d => { d.contentDraft = { ...d.content }; }); return () => set(d => { d.contentDraft = snap; }); },
    publishContent: () => {
      const s = get(), prev = { ...s.content }, prevAt = s.contentPublishedAt;
      set(d => { d.content = { ...d.contentDraft }; d.contentPublishedAt = new Date(); });
      get().logAudit('Publish', 'Published website content', 'Website');
      return () => set(d => { d.content = prev; d.contentDraft = { ...prev }; d.contentPublishedAt = prevAt; });
    },

    /* ---------- users, permissions, settings ---------- */
    inviteUser: u => {
      set(d => { d.users.unshift({ ...u, id: newId('U'), last: null, status: 'Invited' }); });
      get().logAudit('Create', `Invited ${u.name}`, u.firm ? firmName(u.firm) : 'Hyacinth');
    },
    setUserStatus: (id, status) => {
      const u = get().users.find(x => x.id === id)!, prev = u.status;
      set(d => { d.users.find(x => x.id === id)!.status = status; });
      get().logAudit('Status change', `${status === 'Disabled' ? 'Disabled' : 'Enabled'} ${u.name}`, u.email);
      return () => set(d => { d.users.find(x => x.id === id)!.status = prev; });
    },
    logUserAction: (action, target) => get().logAudit('Edit', action, target),
    setPerm: (role, feature, on) => {
      set(d => { d.perms[role][feature] = on; });
      get().logAudit('Role change', `${on ? 'Granted' : 'Removed'} “${FEATURE_LABEL[feature]}” for ${role}`, 'Roles and permissions');
      return () => set(d => { d.perms[role][feature] = !on; });
    },
    saveSettings: (patch, auditText) => { set(d => { Object.assign(d.settings, patch); }); get().logAudit('Edit', auditText, 'Settings'); },
    setNotify: (key, channel, on) => { set(d => { d.settings.notify[key][channel] = on; }); get().logAudit('Edit', `${on ? 'Turned on' : 'Turned off'} ${channel === 'email' ? 'email' : 'in-app'} for “${NOTIFY_EVENTS.find(e => e[0] === key)?.[1] ?? key}”`, 'Notification settings'); },
    logAudit: (type, action, target) => set(d => {
      d.audit.unshift({ id: newId('A'), at: new Date(), user: d.admin.name || 'Hyacinth staff', role: d.admin.role, type, action, target });
    })
  };
}));
