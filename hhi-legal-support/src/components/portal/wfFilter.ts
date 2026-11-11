/* Workflows table: columns, filtering and sorting (legacy filteredWfs). */
import { AREAS, STATUS, STATUS_ORDER } from '@/lib/data';
import { pWfs, typeLabel } from '@/lib/selectors';
import type { AppState } from '@/lib/store';
import type { Workflow } from '@/lib/types';
import type { WfFilters, WfSort } from './uiStore';

export const WF_COLS: [WfSort, string][] = [['id', 'ID'], ['title', 'Workflow'], ['area', 'Service area'], ['owner', 'Owner'], ['status', 'Status'], ['due', 'Due'], ['progress', 'Progress']];

const doneCount = (w: Workflow) => w.steps.filter(s => s.done).length;

export function filterWorkflows(s: AppState, f: WfFilters): Workflow[] {
  const ql = f.q.trim().toLowerCase();
  const owner = (w: Workflow) => s.team[w.owner]?.name || w.owner;
  const list = pWfs(s).filter(w =>
    (!f.area.length || f.area.includes(w.area)) &&
    (f.owner === 'all' || w.owner === f.owner) &&
    (f.status === 'all' || w.status === f.status) &&
    (!ql || [w.id, w.title, w.matter, owner(w), AREAS[w.area], typeLabel(s, w.type), STATUS[w.status]].join(' ').toLowerCase().includes(ql)));
  const key: Record<WfSort, (w: Workflow) => string | number> = {
    id: w => w.id, title: w => w.title.toLowerCase(), area: w => AREAS[w.area], owner,
    status: w => STATUS_ORDER.indexOf(w.status), due: w => w.due.getTime(), progress: w => doneCount(w) / w.steps.length
  };
  const k = key[f.sort], dir = f.dir === 'asc' ? 1 : -1;
  return list.sort((a, b) => { const A = k(a), B = k(b); return ((A < B ? -1 : A > B ? 1 : 0) * dir) || a.id.localeCompare(b.id); });
}

export const hasFilters = (f: WfFilters) => !!(f.q.trim() || f.area.length || f.owner !== 'all' || f.status !== 'all');
export { doneCount };
