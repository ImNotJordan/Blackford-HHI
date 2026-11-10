/* Pure derived-data helpers. Pass the store state (from useApp(s => s) or useApp.getState()). */
import { AREAS, ROLE_DESC, REPORT_COUNT, TYPE_LABEL } from './data';
import { diffDays, sameDay, sum } from './format';
import type { AppState } from './store';
import type { Feature, Firm, ReportMonth, StatusKey } from './types';
import type { Option } from '@/components/ui/types';

type S = Pick<AppState, 'workflows' | 'deadlines' | 'exceptions' | 'firms' | 'team' | 'templates' | 'portalFirm' | 'slaBase' | 'perms' | 'admin' | 'reports'>;

export const getWf = (s: S, id: string | null | undefined) => (id ? s.workflows.find(w => w.id === id) : undefined);
export const firmOf = (s: S, id: string) => s.firms.find(f => f.id === id);
export const firmName = (s: S, id: string) => firmOf(s, id)?.name || 'Unknown firm';
export const pFirm = (s: S): Firm => firmOf(s, s.portalFirm) || s.firms[0];
export const typeLabel = (s: S, k: string) => s.templates.find(t => t.id === k)?.name || TYPE_LABEL[k] || k;

/* ---------- portal (scoped to the firm being viewed) ---------- */
export const pWfs = (s: S) => s.workflows.filter(w => w.firm === s.portalFirm);
export const openWfs = (s: S) => pWfs(s).filter(w => w.status !== 'complete');
export const countStatus = (s: S, st: StatusKey) => pWfs(s).filter(w => w.status === st).length;
export const activeDeadlines = (s: S) => s.deadlines.filter(d => getWf(s, d.wf)?.firm === s.portalFirm);
export const activeExceptions = (s: S) => s.exceptions.filter(e => getWf(s, e.wf)?.firm === s.portalFirm);
export const weekDeadlines = (s: S) => activeDeadlines(s).filter(d => !d.done && diffDays(d.date) >= 0 && diffDays(d.date) <= 6);
export function slaFor(s: S, firmId: string): number | null {
  if (firmId === 'cw') {
    let total = s.slaBase.total, ok = s.slaBase.onTime;
    s.workflows.forEach(w => { if (w.firm === 'cw' && w.completedNow) { total++; if (w.completedOnTime) ok++; } });
    return (ok / total) * 100;
  }
  return firmOf(s, firmId)?.sla ?? null;
}
export const portalSla = (s: S) => slaFor(s, s.portalFirm);

/* ---------- admin (all firms) ---------- */
export const allOpen = (s: S) => s.workflows.filter(w => w.status !== 'complete');
export const allDeadlines = (s: S) => s.deadlines.filter(d => getWf(s, d.wf));
export const firmWfs = (s: S, id: string) => s.workflows.filter(w => w.firm === id);
export function allSla(s: S) { const v = s.firms.map(f => slaFor(s, f.id)).filter((x): x is number => x != null); return v.length ? sum(v) / v.length : null; }
export const activeStaff = (s: S) => Object.entries(s.team).filter(([, t]) => t.active !== false);
export const workload = (s: S, key: string) => allOpen(s).filter(w => w.owner === key).length;
export const can = (s: S, f: Feature) => !!s.perms[s.admin.role]?.[f];

/* ---------- options for dropdowns ---------- */
export const areaOptions = (): Option[] => Object.entries(AREAS).map(([k, v]) => ({ value: k, label: v, short: v.split(' ')[0] }));
export const firmOptions = (s: S): Option[] => s.firms.map(f => ({ value: f.id, label: f.name, sub: `${f.city} · ${f.status}`, short: f.name.split(/[ &]/)[0] }));
/** Staff picker options. Pass a firm team to group into "On this firm’s team" and "Other staff". */
export function staffOptions(s: S, teamKeys?: string[]): Option[] {
  const opts = activeStaff(s).map(([k, t]) => ({
    value: k, label: t.name, sub: `${t.role} · ${workload(s, k)} of ${t.capacity} in use`,
    group: teamKeys ? (teamKeys.includes(k) ? 'On this firm’s team' : 'Other staff') : (t.access === 'Specialist' ? 'Specialists' : 'Leads and managers')
  }));
  const first = teamKeys ? 'On this firm’s team' : 'Leads and managers';
  return [...opts.filter(o => o.group === first), ...opts.filter(o => o.group !== first)];
}
export const roleDesc = (r: string) => ROLE_DESC[r] || '';

/* ---------- deadline markers for date pickers ---------- */
export function deadlineMarkers(s: S, scope: 'portal' | 'all') {
  const list = scope === 'all' ? allDeadlines(s) : activeDeadlines(s);
  return (d: Date) => {
    const items = list.filter(x => !x.done && sameDay(x.date, d));
    return { risk: items.filter(x => x.atRisk).length, normal: items.filter(x => !x.atRisk).length, titles: items.map(x => x.title) };
  };
}

/* ---------- reports (scaled for firms other than Calder Whitmore) ---------- */
export function repFor(s: S, i: number): ReportMonth {
  const r = s.reports[i], f = pFirm(s);
  if (!f || f.id === 'cw') return r;
  const k = f.scale || 0.3, sc = (v: number) => Math.max(1, Math.round(v * k));
  const areas = r.areas.filter(a => f.services.includes(a[0])).map(([a, op, cp, ot]) => [a, sc(op), sc(cp), ot] as ReportMonth['areas'][number]);
  const raised = sc(r.exRaised);
  return { ...r, areas, completed: sum(areas.map(a => a[2])), exRaised: raised, exResolved: Math.min(raised, sc(r.exResolved)), onTime: f.sla ?? r.onTime };
}
export const repMonthVal = (s: S, i: number) => { const k = s.reports[i].key; return { y: +k.slice(0, 4), m: +k.slice(5, 7) - 1 }; };
export const repIdxFor = (s: S, y: number, m: number) => s.reports.slice(0, REPORT_COUNT).findIndex(r => r.key === `${y}-${String(m + 1).padStart(2, '0')}`);
