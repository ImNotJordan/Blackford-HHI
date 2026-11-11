'use client';
/* Admin · Workflows: All workflows (filters, KPI tiles, selection + bulk actions, row actions) and Templates.
   Deep links: ?tab=templates, ?status=at-risk,blocked (or open), ?firm=lp[,hb], ?owner=priya. */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/icons';
import {
  ActionMenu, Avatar, Band, Combobox, DateRangePicker, DueChip, EmptyState, KpiRow, KpiTile, MultiSelect, StatusBadge, StatusDropdown,
  announce, confirmDialog, toast
} from '@/components/ui';
import { WorkflowSheet } from '@/components/shared/WorkflowSheet';
import { RoNote, useCan } from '@/components/admin/common';
import { SearchField, SortTh, cmp, focusViewTitle } from '@/components/admin/shell/kit';
import { AREAS, STATUS, STATUS_ORDER } from '@/lib/data';
import { fmtD, iso, startOf } from '@/lib/format';
import { allOpen, areaOptions, deadlineMarkers, firmName, typeLabel } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { DateRange, StatusKey, Workflow } from '@/lib/types';
import { BulkModal, STATUS_OPTS, type BulkKind } from './BulkModals';
import { ReassignModal, type ReassignTarget } from './ReassignModal';
import { TemplateEditor, TemplatesGrid } from './Templates';

type Tab = 'all' | 'templates';
type SortKey = 'id' | 'title' | 'firm' | 'owner' | 'status' | 'due';
interface Filters { q: string; firms: string[]; areas: string[]; statuses: string[]; owner: string; due: DateRange | null }
const OPEN_STATUSES: StatusKey[] = ['on-track', 'at-risk', 'review', 'blocked'];
const EMPTY: Filters = { q: '', firms: [], areas: [], statuses: [], owner: 'all', due: null };
const AREA_OPTS = areaOptions();
const list = (v: string | null) => (v ? v.split(',').map(x => x.trim()).filter(Boolean) : []);

export function AdminWorkflows() {
  const params = useSearchParams();
  /* Filter deep links re-seed the view; switching tabs keeps them, so filters survive a trip to Templates. */
  const seed = ['status', 'firm', 'owner'].map(k => params.get(k) || '').join('|');
  return <WorkflowsView key={seed} />;
}

function WorkflowsView() {
  const router = useRouter();
  const pathname = usePathname() || '/admin/workflows';
  const params = useSearchParams();
  const tab: Tab = params.get('tab') === 'templates' ? 'templates' : 'all';
  const s = useApp();
  const ed = useCan('workflows');
  const edTpl = useCan('templates');

  const [f, setF] = useState<Filters>(() => {
    const raw = list(params.get('status'));
    const statuses = raw.includes('open') ? OPEN_STATUSES : raw.filter((x): x is StatusKey => x in STATUS);
    const firms = list(params.get('firm')).filter(id => useApp.getState().firms.some(x => x.id === id));
    const owner = params.get('owner');
    return { ...EMPTY, statuses, firms, owner: owner && useApp.getState().team[owner] ? owner : 'all' };
  });
  const [sort, setSort] = useState<SortKey>('due');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const [sheet, setSheet] = useState<string | null>(null);
  const [reassign, setReassign] = useState<ReassignTarget | null>(null);
  const [bulk, setBulk] = useState<BulkKind | null>(null);
  const [tplEdit, setTplEdit] = useState<string | null>(null);

  const patch = (p: Partial<Filters>) => setF(x => ({ ...x, ...p }));
  const setTab = (t: Tab, focus = false) => {
    const next = new URLSearchParams(params.toString());
    if (t === 'templates') next.set('tab', 'templates'); else next.delete('tab');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    if (focus) document.getElementById(`tab-${t}`)?.focus();
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const t: Tab = e.key === 'Home' ? 'all' : e.key === 'End' ? 'templates' : tab === 'all' ? 'templates' : 'all';
    setTab(t, true);
  };

  /* ---------- derived ---------- */
  const open = allOpen(s);
  const term = f.q.trim().toLowerCase();
  const keyOf: Record<SortKey, (w: Workflow) => string | number> = {
    id: w => w.id, title: w => w.title.toLowerCase(), firm: w => firmName(s, w.firm), owner: w => s.team[w.owner]?.name || '',
    status: w => STATUS_ORDER.indexOf(w.status), due: w => w.due.getTime()
  };
  const rows = s.workflows
    .filter(w => (!f.firms.length || f.firms.includes(w.firm)) && (!f.areas.length || f.areas.includes(w.area)) && (!f.statuses.length || f.statuses.includes(w.status))
      && (f.owner === 'all' || w.owner === f.owner)
      && (!f.due || (startOf(w.due) >= startOf(f.due.start) && startOf(w.due) <= startOf(f.due.end)))
      && (!term || [w.id, w.title, w.matter, firmName(s, w.firm)].join(' ').toLowerCase().includes(term)))
    .sort((a, b) => (cmp(keyOf[sort](a), keyOf[sort](b)) * (dir === 'asc' ? 1 : -1)) || a.id.localeCompare(b.id));
  const selIds = s.workflows.filter(w => sel.has(w.id)).map(w => w.id);
  const allSel = rows.length > 0 && rows.every(w => sel.has(w.id)), someSel = rows.some(w => sel.has(w.id));
  const filtered = !!(f.q || f.firms.length || f.areas.length || f.statuses.length || f.owner !== 'all' || f.due);

  const firmOpts = useMemo(() => s.firms.map(x => ({ value: x.id, label: x.name, short: x.name.split(/[ &]/)[0] })), [s.firms]);
  const ownerOpts = useMemo(() => [{ value: 'all', label: 'All owners' }, ...Object.entries(s.team).map(([k, t]) => ({ value: k, label: t.name, sub: t.active === false ? 'Inactive' : t.role }))], [s.team]);
  const markers = useMemo(() => deadlineMarkers(s, 'all'), [s]);

  /* ---------- actions ---------- */
  const onSort = (k: SortKey) => { if (sort === k) setDir(dir === 'asc' ? 'desc' : 'asc'); else { setSort(k); setDir('asc'); } };
  const clear = () => { setF(EMPTY); document.getElementById('aw-q')?.focus(); };
  const kpi = (k: 'open' | 'at-risk' | 'blocked' | 'templates') => {
    if (k === 'templates') { setTab('templates'); return; }
    setF({ ...EMPTY, statuses: k === 'open' ? OPEN_STATUSES : [k] });
    if (tab !== 'all') setTab('all');
    announce(k === 'open' ? 'Showing open workflows' : `Showing ${STATUS[k].toLowerCase()} workflows`);
  };
  const toggleSel = (id: string, on: boolean) => setSel(x => { const n = new Set(x); if (on) n.add(id); else n.delete(id); return n; });
  const toggleAll = (on: boolean) => {
    setSel(x => { const n = new Set(x); rows.forEach(w => (on ? n.add(w.id) : n.delete(w.id))); return n; });
    announce(on ? `${rows.length} workflows selected` : 'Selection cleared');
  };
  const setStatus = (id: string, st: StatusKey) => {
    const w = useApp.getState().workflows.find(x => x.id === id);
    if (!w || w.status === st) return;
    const undo = useApp.getState().setWorkflowStatus(id, st);
    toast(`${id} is now ${STATUS[st]}.`, { undo });
  };
  const archive = (ids: string[]) => {
    const n = ids.length;
    const undo = useApp.getState().archiveWorkflows(ids);
    setSel(x => { const m = new Set(x); ids.forEach(id => m.delete(id)); return m; });
    focusViewTitle();
    toast(`${n} ${n === 1 ? 'workflow' : 'workflows'} archived.`, { icon: 'archive', undo });
  };
  const confirmArchiveOne = async (w: Workflow) => {
    const ok = await confirmDialog({
      title: `Archive ${w.id}?`, body: `“${w.title}” will leave active workflows for ${firmName(s, w.firm)}. You can undo this right after.`,
      confirmLabel: 'Archive workflow', danger: true
    });
    if (ok) archive([w.id]);
  };
  const confirmArchiveSel = async () => {
    const n = selIds.length;
    const ok = await confirmDialog({ title: `Archive ${n} workflows?`, body: 'They will leave active workflows across all clients. You can undo this right after.', confirmLabel: 'Archive workflows', danger: true });
    if (ok) archive(selIds);
  };

  return (
    <>
      <Band
        eyebrow="Operations" title="Workflows" sub="Every workflow across every client firm, plus the templates new workflows start from."
        actions={tab === 'templates' && edTpl ? <button className="btn btn-primary btn-sm" type="button" onClick={() => setTplEdit('new')}><Icon name="plus" size={18} />New template</button> : null}
      >
        <KpiRow ariaLabel="Workflow summary">
          <KpiTile id="ka-open" label="Open workflows" value={open.length} foot="All clients" onClick={() => kpi('open')}
            pressed={tab === 'all' && f.statuses.length === 4 && !f.statuses.includes('complete')} />
          <KpiTile id="ka-at-risk" label="At risk" value={open.filter(w => w.status === 'at-risk').length} foot="Filter to at-risk" onClick={() => kpi('at-risk')}
            pressed={tab === 'all' && f.statuses.length === 1 && f.statuses[0] === 'at-risk'} />
          <KpiTile id="ka-blocked" label="Blocked" value={open.filter(w => w.status === 'blocked').length} foot="Filter to blocked" onClick={() => kpi('blocked')}
            pressed={tab === 'all' && f.statuses.length === 1 && f.statuses[0] === 'blocked'} />
          <KpiTile id="ka-templates" label="Templates" value={s.templates.length} foot={tab === 'templates' ? 'Showing templates' : 'Open templates'} onClick={() => kpi('templates')}
            pressed={tab === 'templates'} />
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        <section className="card" aria-label="Workflow management">
          <div className="tabs" role="tablist" aria-label="Workflow views">
            {(['all', 'templates'] as Tab[]).map(t => (
              <button
                key={t} className="tab" role="tab" type="button" id={`tab-${t}`} aria-selected={tab === t} aria-controls="tp-wf" tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)} onKeyDown={onTabKey}
              >{t === 'all' ? 'All workflows' : 'Templates'}</button>
            ))}
          </div>
          <div id="tp-wf" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {tab === 'templates' ? <TemplatesGrid onEdit={setTplEdit} /> : (
              <>
                {!ed && <div style={{ padding: '16px 24px 0' }}><RoNote feature="workflows" /></div>}
                <div className="filters">
                  <SearchField id="aw-q" value={f.q} onChange={q => patch({ q })} placeholder="Workflow, matter or ID" />
                  <div className="field">
                    <span className="flabel" id="aw-firm-l">Client</span>
                    <MultiSelect id="aw-firms" labelId="aw-firm-l" title="Clients" placeholder="All clients" searchable value={f.firms} options={firmOpts} onChange={firms => patch({ firms })} />
                  </div>
                  <div className="field">
                    <span className="flabel" id="aw-area-l">Service area</span>
                    <MultiSelect id="aw-areas" labelId="aw-area-l" title="Service areas" placeholder="All areas" value={f.areas} options={AREA_OPTS} onChange={areas => patch({ areas })} />
                  </div>
                  <div className="field">
                    <span className="flabel" id="aw-st-l">Status</span>
                    <MultiSelect id="aw-status" labelId="aw-st-l" title="Statuses" placeholder="All statuses" value={f.statuses} options={STATUS_OPTS} onChange={statuses => patch({ statuses })} />
                  </div>
                  <div className="field">
                    <span className="flabel" id="aw-own-l">Owner</span>
                    <Combobox id="aw-owner" labelId="aw-own-l" title="Owner" value={f.owner} options={ownerOpts} onChange={owner => patch({ owner: owner || 'all' })} />
                  </div>
                  <div className="field">
                    <span className="flabel" id="aw-due-l">Due date</span>
                    <DateRangePicker id="aw-due" labelId="aw-due-l" title="Due date range" placeholder="Any due date" value={f.due} markers={markers} onChange={due => patch({ due })} />
                  </div>
                  <div className="field">
                    <span className="flabel" aria-hidden="true">&nbsp;</span>
                    <button className="btn btn-quiet" type="button" id="aw-clear" disabled={!filtered} onClick={clear}>Clear filters</button>
                  </div>
                </div>

                {!rows.length ? (
                  <div style={{ borderTop: '1px solid var(--hairline)' }}>
                    <EmptyState icon="search" title="No workflows match these filters" text="Try another client, status or date range, or clear the filters."
                      actions={<button className="btn btn-dark btn-sm" type="button" onClick={clear}>Clear filters</button>} />
                  </div>
                ) : (
                  <>
                    <div className="table-wrap" tabIndex={0} role="region" aria-label="All workflows table">
                      <table className="data">
                        <caption className="sr-only">Workflows across all clients</caption>
                        <thead>
                          <tr>
                            {ed && (
                              <th scope="col" style={{ width: 44 }}>
                                <input
                                  type="checkbox" className="cbox" id="aw-all" checked={allSel} aria-label={`Select all ${rows.length} workflows shown`}
                                  ref={el => { if (el) el.indeterminate = someSel && !allSel; }} onChange={e => toggleAll(e.target.checked)}
                                />
                              </th>
                            )}
                            <SortTh k="id" label="ID" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <SortTh k="title" label="Workflow" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <SortTh k="firm" label="Client" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <th scope="col">Service area</th>
                            <SortTh k="owner" label="Owner" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <SortTh k="status" label="Status" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <SortTh k="due" label="Due" sort={sort} dir={dir} onSort={onSort} idPrefix="awsort" />
                            <th scope="col"><span className="sr-only">Actions</span></th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map(w => {
                            const owner = s.team[w.owner]?.name || w.owner;
                            return (
                              <tr key={w.id}>
                                {ed && (
                                  <td>
                                    <input type="checkbox" className="cbox" id={`aws-${w.id}`} checked={sel.has(w.id)} aria-label={`Select ${w.id}`}
                                      onChange={e => toggleSel(w.id, e.target.checked)} />
                                  </td>
                                )}
                                <td className="mono">{w.id}</td>
                                <td style={{ minWidth: 230 }}>
                                  <button type="button" className="wf-link" onClick={() => setSheet(w.id)}>{w.title}</button>
                                  <div className="cell-sub">{w.matter}</div>
                                </td>
                                <td style={{ minWidth: 160 }}>{firmName(s, w.firm)}</td>
                                <td style={{ minWidth: 150 }}>{AREAS[w.area]}<div className="cell-sub">{typeLabel(s, w.type)}</div></td>
                                <td><span className="person"><Avatar name={owner} />{owner}</span></td>
                                <td>
                                  {ed
                                    ? <StatusDropdown id={`ast-${w.id}`} size="sm" ariaLabel={`Status for ${w.id}`} title={`Status for ${w.id}`} value={w.status} onChange={v => setStatus(w.id, v)} />
                                    : <StatusBadge status={w.status} />}
                                </td>
                                <td className="due-cell">
                                  <time dateTime={iso(w.due)}>{fmtD(w.due)}</time>
                                  <div className="cell-sub">{w.status === 'complete' ? 'Completed' : <DueChip date={w.due} />}</div>
                                </td>
                                <td>
                                  <ActionMenu
                                    id={`awm-${w.id}`} label={`More actions for ${w.id}`}
                                    items={[
                                      { label: 'Open details', icon: 'eye', onSelect: () => setSheet(w.id) },
                                      { label: 'Reassign owner', icon: 'users', disabled: !ed, onSelect: () => setReassign({ wf: w.id }) },
                                      { label: 'View client firm', icon: 'briefcase', onSelect: () => router.push(`/admin/clients/${w.firm}`) },
                                      'separator',
                                      { label: 'Archive workflow', icon: 'archive', danger: true, disabled: !ed, onSelect: () => { void confirmArchiveOne(w); } }
                                    ]}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="result-bar">
                      <span aria-live="polite">Showing {rows.length} of {s.workflows.length} workflows{selIds.length ? ` · ${selIds.length} selected` : ''}</span>
                    </div>
                  </>
                )}

                {ed && selIds.length > 0 && (
                  <div className="bulkbar" role="region" aria-label="Bulk actions">
                    <b>{selIds.length} selected</b>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setBulk('reassign')}><Icon name="users" size={16} />Reassign</button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setBulk('status')}>Change status</button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setBulk('due')}><Icon name="calendar" size={16} />Set due date</button>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => { void confirmArchiveSel(); }}><Icon name="archive" size={16} />Archive</button>
                    <button className="btn btn-quiet btn-sm" type="button" onClick={() => { setSel(new Set()); requestAnimationFrame(() => document.getElementById('aw-all')?.focus()); }}>Clear selection</button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <WorkflowSheet id={sheet} onClose={() => setSheet(null)} />
      <ReassignModal target={reassign} onClose={() => setReassign(null)} />
      <BulkModal kind={bulk} ids={selIds} onClose={() => setBulk(null)} />
      <TemplateEditor editing={tplEdit} onClose={() => setTplEdit(null)} />
    </>
  );
}
