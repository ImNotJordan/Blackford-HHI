'use client';
/* Portal Workflows (legacy wfShell / wfLoad / wfUpdate + KPI filter tiles from glue.js).
   Deep links: ?status=review|at-risk|blocked|complete|all, ?q=…, ?wf=HL-2041 (opens the slide-over). */
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { AREAS, STATUS } from '@/lib/data';
import { pFirm, pWfs, openWfs, countStatus, areaOptions, typeLabel } from '@/lib/selectors';
import { fmtD, iso } from '@/lib/format';
import { Icon } from '@/components/icons';
import {
  Band, KpiRow, KpiTile, MultiSelect, Combobox, StatusDropdown, ActionMenu, EmptyState, ErrorState, Avatar, DueChip, toast, announce
} from '@/components/ui';
import type { StatusKey, Workflow } from '@/lib/types';
import { usePortalUi, emptyFilters, openWf, openNewWf, type WfSort } from './uiStore';
import { WF_COLS, filterWorkflows, hasFilters, doneCount } from './wfFilter';
import { changeStatus, archiveWithConfirm } from './wfActions';
import { focusSoon } from './common';

const CHIP_STATUSES: ('all' | StatusKey)[] = ['all', 'on-track', 'at-risk', 'review', 'blocked', 'complete'];
const isStatus = (v: string | null): v is StatusKey => !!v && v in STATUS;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function WorkflowsView() {
  const s = useApp();
  const ui = usePortalUi();
  const params = useSearchParams();
  const router = useRouter();
  const F = pFirm(s);
  const f = ui.wf;

  /* deep links → filters, then a clean URL */
  useEffect(() => {
    const wf = params.get('wf');
    if (!params.has('status') && !params.has('q') && !wf) return;
    const st = usePortalUi.getState();
    if (params.has('status')) { const v = params.get('status'); st.setWf({ ...emptyFilters, area: [], status: isStatus(v) ? v : 'all' }); }
    if (params.has('q')) { st.setWf({ ...emptyFilters, area: [], q: (params.get('q') || '').trim() }); focusSoon('#wf-q'); }
    router.replace('/portal/workflows', { scroll: false });
    if (wf) openWf(wf);
  }, [params, router]);

  /* first load (skeleton ~800ms), refresh and retry; a simulated failure shows the error state */
  const loading = (!s.workflowsLoaded && !ui.wfError) || ui.wfReloading;
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      const fail = useApp.getState().consumeSimulatedError();
      const st = usePortalUi.getState();
      if (fail) {
        st.set({ wfError: true, wfReloading: false, wfReloadToast: false });
        focusSoon('#wf-retry-btn');
      } else {
        useApp.getState().setWorkflowsLoaded();
        if (st.wfReloadToast) toast('Workflows refreshed.');
        st.set({ wfError: false, wfReloading: false, wfReloadToast: false });
      }
    }, reduced() ? 300 : 800);
    return () => clearTimeout(t);
  }, [loading]);
  const reload = () => { if (!usePortalUi.getState().wfReloading) usePortalUi.getState().set({ wfReloading: true, wfReloadToast: true, wfError: false }); };

  /* row flash for a just-created workflow */
  useEffect(() => {
    if (!ui.newId) return;
    const t = setTimeout(() => usePortalUi.getState().set({ newId: null }), 1700);
    return () => clearTimeout(t);
  }, [ui.newId]);

  const setStatusFilter = (st: 'all' | StatusKey, say = true) => {
    ui.setWf({ status: st });
    if (say) announce(st === 'all' ? 'Showing all workflows' : `Showing ${STATUS[st].toLowerCase()} workflows`);
  };
  const clear = () => {
    const had = hasFilters(f);
    ui.setWf({ ...emptyFilters, area: [] });
    focusSoon('#wf-q');
    if (had) toast('Filters cleared.');
  };
  const sortBy = (k: WfSort) => ui.setWf(f.sort === k ? { dir: f.dir === 'asc' ? 'desc' : 'asc' } : { sort: k, dir: 'asc' });

  const all = pWfs(s);
  const list = loading || ui.wfError ? [] : filterWorkflows(s, f);
  const ownerOpts = [{ value: 'all', label: 'All owners' }, ...F.team.filter(k => s.team[k]).map(k => ({ value: k, label: s.team[k].name, sub: s.team[k].role }))];

  let region: React.ReactNode;
  if (loading) {
    region = (
      <div aria-busy="true">
        <p className="sr-only">Loading workflows</p>
        <div className="table-wrap">
          <table className="data" aria-hidden="true">
            <thead><tr>{WF_COLS.map(c => <th key={c[0]}>{c[1]}</th>)}<th /></tr></thead>
            <tbody>{Array.from({ length: 7 }, (_, r) => (
              <tr className="sk-row" key={r}>{[50, 220, 140, 120, 100, 80, 96, 24].map((w, i) => <td key={i}><span className="sk" style={{ height: 12, width: w }} /></td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  } else if (ui.wfError) {
    region = (
      <ErrorState
        title="Workflows didn’t load" retryId="wf-retry-btn" onRetry={reload}
        text="The connection to the workflow service timed out. Your filters are kept. Try again, or come back in a minute."
        extra={<Link className="btn btn-ghost btn-sm" href="/portal">Go to Overview</Link>}
      />
    );
  } else if (!list.length) {
    region = (
      <div style={{ borderTop: '1px solid var(--hairline)' }}>
        <EmptyState
          icon="search" title="No workflows match these filters"
          text={f.q ? `Nothing matches “${f.q}” with the current filters. Try a different search or clear the filters.` : 'Try another status or service area, or clear the filters to see every workflow.'}
          actions={<>
            <button className="btn btn-dark btn-sm" type="button" onClick={clear}>Clear filters</button>
            <button className="btn btn-ghost btn-sm" type="button" onClick={openNewWf}><Icon name="plus" size={16} />New workflow</button>
          </>}
        />
      </div>
    );
  } else {
    const sortLabel = WF_COLS.find(c => c[0] === f.sort)![1];
    region = (
      <>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Workflows table, scrolls sideways on small screens">
          <table className="data">
            <caption className="sr-only">Active workflows. Column headers sort the table.</caption>
            <thead>
              <tr>
                {WF_COLS.map(([k, l]) => (
                  <th key={k} scope="col" aria-sort={f.sort === k ? (f.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <button type="button" className="sort" id={`sort-${k}`} onClick={() => sortBy(k)}>{l}<Icon name="chevron-down" size={14} /></button>
                  </th>
                ))}
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>{list.map(w => <WfRow key={w.id} w={w} isNew={ui.newId === w.id} />)}</tbody>
          </table>
        </div>
        <div className="result-bar">
          <span aria-live="polite">Showing {list.length} of {all.length} workflows</span>
          <span>Sorted by {sortLabel.toLowerCase()}, {f.dir === 'asc' ? 'ascending' : 'descending'}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Band
        eyebrow="Visible execution" title="Workflows" sub="Every workflow your Hyacinth team is running, by service area."
        actions={<button className="btn btn-primary btn-sm" type="button" onClick={openNewWf}><Icon name="plus" size={18} />New workflow</button>}
      >
        <KpiRow ariaLabel="Filter by workflow status">
          <KpiTile id="kw-all" label="Open workflows" value={openWfs(s).length} foot={f.status === 'all' ? `${all.length} including complete` : 'Show all workflows'} pressed={f.status === 'all'} onClick={() => setStatusFilter('all')} />
          <KpiTile id="kw-at-risk" label="At risk" value={countStatus(s, 'at-risk')} foot="Needs attention now" pressed={f.status === 'at-risk'} onClick={() => setStatusFilter('at-risk')} />
          <KpiTile id="kw-review" label="Awaiting attorney review" value={countStatus(s, 'review')} foot="Waiting on your attorneys" pressed={f.status === 'review'} onClick={() => setStatusFilter('review')} />
          <KpiTile id="kw-blocked" label="Blocked" value={countStatus(s, 'blocked')} foot="Waiting on a decision" pressed={f.status === 'blocked'} onClick={() => setStatusFilter('blocked')} />
        </KpiRow>
      </Band>
      <div className="wrap pcontent">
        <section className="card" aria-label="Workflow list">
          <div className="toolbar">
            <div className="search-field">
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="wf-q">Search workflows</label>
              <input className="input" id="wf-q" type="search" placeholder="Search by workflow, matter, owner or ID" autoComplete="off" value={f.q} onChange={e => ui.setWf({ q: e.target.value })} />
            </div>
            <div className="field-inline">
              <span className="flabel-i" id="wf-area-l">Service area</span>
              <MultiSelect id="wf-area" labelId="wf-area-l" title="Service areas" placeholder="All service areas" value={f.area} options={areaOptions()} onChange={area => ui.setWf({ area })} />
            </div>
            <div className="field-inline">
              <span className="flabel-i" id="wf-owner-l">Owner</span>
              <Combobox id="wf-owner" labelId="wf-owner-l" title="Owner" value={f.owner} options={ownerOpts} onChange={owner => ui.setWf({ owner: owner || 'all' })} />
            </div>
            <div className="toolbar-actions">
              <button className="btn btn-quiet" type="button" id="wf-clear" disabled={!hasFilters(f)} onClick={clear}>Clear filters</button>
              <button className="icon-btn" type="button" id="wf-refresh" aria-label="Refresh workflows" onClick={reload}><Icon name="refresh" /></button>
            </div>
          </div>
          <div className="chips" role="group" aria-label="Filter by status">
            {CHIP_STATUSES.map(st => (
              <button key={st} type="button" className="chip" id={`chip-${st}`} aria-pressed={f.status === st} onClick={() => setStatusFilter(st, false)}>
                {st === 'all' ? 'All' : STATUS[st]} <span className="n">{st === 'all' ? all.length : countStatus(s, st)}</span>
              </button>
            ))}
          </div>
          <div aria-busy={loading || undefined}>{region}</div>
        </section>
      </div>
    </>
  );
}

function WfRow({ w, isNew }: { w: Workflow; isNew: boolean }) {
  const s = useApp();
  const d = doneCount(w), n = w.steps.length, owner = s.team[w.owner]?.name || w.owner;
  const complete = w.status === 'complete';
  return (
    <tr className={isNew ? 'is-new' : undefined}>
      <td className="mono">{w.id}</td>
      <td style={{ minWidth: 240 }}>
        <button type="button" className="wf-link" onClick={() => openWf(w.id)}>{w.title}</button>
        <div className="cell-sub">{w.matter}</div>
      </td>
      <td style={{ minWidth: 170 }}>{AREAS[w.area]}<div className="cell-sub">{typeLabel(s, w.type)}</div></td>
      <td><span className="person"><Avatar name={owner} />{owner}</span></td>
      <td><StatusDropdown id={`st-${w.id}`} size="sm" ariaLabel={`Status for ${w.id}`} title={`Status for ${w.id}`} value={w.status} onChange={v => changeStatus(w.id, v)} /></td>
      <td className="due-cell">
        <time dateTime={iso(w.due)}>{fmtD(w.due)}</time>
        <div className="cell-sub">{complete ? 'Completed' : <DueChip date={w.due} />}</div>
      </td>
      <td>
        <div className="prog">
          <div className="prog-track"><div className="prog-fill" style={{ width: `${Math.round((d / n) * 100)}%` }} /></div>
          <span>{d} of {n} steps</span>
        </div>
      </td>
      <td>
        <ActionMenu
          id={`more-${w.id}`} label={`More actions for ${w.id}`}
          items={[
            { label: 'Open details', icon: 'eye', onSelect: () => openWf(w.id) },
            { label: 'Reassign owner', icon: 'users', onSelect: () => openWf(w.id, '#reassign-owner') },
            { label: complete ? 'Already complete' : 'Mark complete', icon: 'check', disabled: complete, onSelect: () => changeStatus(w.id, 'complete') },
            'separator',
            { label: 'Archive workflow', icon: 'archive', danger: true, onSelect: () => { void archiveWithConfirm(w.id); } }
          ]}
        />
      </td>
    </tr>
  );
}
