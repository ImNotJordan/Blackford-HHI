'use client';
/* Admin · Client firms list: status filter tiles, search, services filter, sortable table, per-row status and actions. */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { ActionMenu, Avatar, Band, EmptyState, KpiRow, KpiTile, MultiSelect, Select, announce } from '@/components/ui';
import { FirmBadge, RoNote, useCan } from '@/components/admin/common';
import { FirmWizard } from '@/components/admin/FirmWizard';
import { SearchField, SortTh, cmp } from '@/components/admin/shell/kit';
import { AREAS, FIRM_STATUSES, FS_ICON } from '@/lib/data';
import { areaOptions, firmWfs, slaFor } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { Firm, FirmStatus } from '@/lib/types';
import { changeFirmStatus, togglePauseFirm, viewAsClient } from './firmActions';

type SortKey = 'name' | 'contact' | 'lead' | 'open' | 'sla' | 'status';
const STATUS_OPTS = FIRM_STATUSES.map(st => ({ value: st, label: st, icon: FS_ICON[st] }));
const AREA_OPTS = areaOptions();
const FOOT: Record<'all' | FirmStatus, string> = { all: 'Show all firms', Active: 'Running work now', Onboarding: 'Setting up with Hyacinth', Paused: 'Work on hold' };

export function ClientsList() {
  const router = useRouter();
  const s = useApp();
  const ed = useCan('clients');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('name');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const [wizard, setWizard] = useState<{ mode: 'create' | 'edit'; id?: string } | null>(null);

  const openCount = (f: Firm) => firmWfs(s, f.id).filter(w => w.status !== 'complete').length;
  const keyOf: Record<SortKey, (f: Firm) => string | number> = {
    name: f => f.name, contact: f => f.contact.name, lead: f => s.team[f.lead]?.name || '', open: openCount,
    sla: f => slaFor(s, f.id) ?? -1, status: f => FIRM_STATUSES.indexOf(f.status)
  };
  const term = q.trim().toLowerCase();
  const list = s.firms
    .filter(f => (!status.length || status.includes(f.status)) && (!services.length || services.some(k => (f.services as string[]).includes(k)))
      && (!term || [f.name, f.city, f.contact.name, f.contact.email].join(' ').toLowerCase().includes(term)))
    .sort((a, b) => cmp(keyOf[sort](a), keyOf[sort](b)) * (dir === 'asc' ? 1 : -1));
  const filtered = !!(q || status.length || services.length);

  const onSort = (k: SortKey) => { if (sort === k) setDir(dir === 'asc' ? 'desc' : 'asc'); else { setSort(k); setDir('asc'); } };
  const clear = () => { setQ(''); setStatus([]); setServices([]); document.getElementById('cl-q')?.focus(); };
  const statTile = (k: 'all' | FirmStatus) => {
    const next = k === 'all' || (status.length === 1 && status[0] === k) ? [] : [k];
    setStatus(next);
    announce(next.length ? `Showing ${k.toLowerCase()} firms` : 'Showing all firms');
  };
  /* After adding a firm, reset the list so the new firm is visible. */
  const resetList = () => { setQ(''); setStatus([]); setServices([]); setSort('name'); setDir('asc'); };

  return (
    <>
      <Band
        eyebrow="Operations" title="Client firms" sub="Every firm Hyacinth runs work for, with its services, team and service levels."
        actions={ed ? <button className="btn btn-primary btn-sm" type="button" onClick={() => setWizard({ mode: 'create' })}><Icon name="plus" size={18} />Add client firm</button> : null}
      >
        <KpiRow ariaLabel="Client firms by status">
          <KpiTile id="clst-all" label="Total firms" value={s.firms.length} foot={FOOT.all} pressed={!status.length} onClick={() => statTile('all')} />
          {FIRM_STATUSES.map(st => (
            <KpiTile
              key={st} id={`clst-${st}`} label={`${st} firms`} value={s.firms.filter(f => f.status === st).length} foot={FOOT[st]}
              pressed={status.length === 1 && status[0] === st} onClick={() => statTile(st)}
            />
          ))}
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        {!ed && <RoNote feature="clients" />}
        <section className="card" aria-label="Client firm list">
          <div className="filters">
            <SearchField id="cl-q" value={q} onChange={setQ} placeholder="Firm, contact or city" />
            <div className="field">
              <span className="flabel" id="cl-st-l">Status</span>
              <MultiSelect id="cl-status" labelId="cl-st-l" title="Status" placeholder="Any status" value={status} options={STATUS_OPTS} onChange={setStatus} />
            </div>
            <div className="field">
              <span className="flabel" id="cl-sv-l">Services</span>
              <MultiSelect id="cl-svc" labelId="cl-sv-l" title="Services" placeholder="Any service" value={services} options={AREA_OPTS} onChange={setServices} />
            </div>
            <div className="field">
              <span className="flabel" aria-hidden="true">&nbsp;</span>
              <button className="btn btn-quiet" type="button" id="cl-clear" disabled={!filtered} onClick={clear}>Clear filters</button>
            </div>
          </div>

          {!list.length ? (
            <div style={{ borderTop: '1px solid var(--hairline)' }}>
              <EmptyState icon="search" title="No client firms match" text="Try a different search, status or service, or clear the filters."
                actions={<button className="btn btn-dark btn-sm" type="button" onClick={clear}>Clear filters</button>} />
            </div>
          ) : (
            <>
              <div className="table-wrap" tabIndex={0} role="region" aria-label="Client firms table">
                <table className="data">
                  <caption className="sr-only">Client firms. Column headers sort the table.</caption>
                  <thead>
                    <tr>
                      <SortTh k="name" label="Firm" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <SortTh k="contact" label="Primary contact" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <th scope="col">Active services</th>
                      <SortTh k="lead" label="Team lead" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <SortTh k="open" label="Open workflows" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <SortTh k="sla" label="SLA on time" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <SortTh k="status" label="Status" sort={sort} dir={dir} onSort={onSort} idPrefix="clsort" />
                      <th scope="col"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(f => {
                      const sla = slaFor(s, f.id), svc = f.services.map(k => AREAS[k].split(' ')[0]), more = f.services.slice(2).map(k => AREAS[k]).join(', ');
                      const leadName = s.team[f.lead]?.name || 'Unassigned';
                      return (
                        <tr key={f.id}>
                          <td style={{ minWidth: 200 }}>
                            <Link className="wf-link" href={`/admin/clients/${f.id}`}>{f.name}</Link>
                            <div className="cell-sub">{f.city}</div>
                          </td>
                          <td style={{ minWidth: 200 }}>{f.contact.name}<div className="cell-sub">{f.contact.email}</div></td>
                          <td>
                            <div className="chips-inline">
                              {svc.slice(0, 2).map(x => <span className="mini-chip" key={x}>{x}</span>)}
                              {svc.length > 2 && <span className="mini-chip" data-tip={more} title={more}>+{svc.length - 2}<span className="sr-only">: {more}</span></span>}
                            </div>
                          </td>
                          <td><span className="person"><Avatar name={leadName} />{leadName}</span></td>
                          <td className="tnum">{openCount(f)}</td>
                          <td>
                            {sla == null ? <span className="small">No data yet</span> : (
                              <div className="prog"><div className="prog-track"><div className="prog-fill" style={{ width: `${sla}%` }} /></div><span>{sla.toFixed(1)}%</span></div>
                            )}
                          </td>
                          <td>
                            {ed ? (
                              <Select id={`fs-${f.id}`} size="sm" ariaLabel={`Status for ${f.name}`} title="Firm status" value={f.status} options={STATUS_OPTS}
                                onChange={v => changeFirmStatus(f.id, v as FirmStatus)} />
                            ) : <FirmBadge status={f.status} />}
                          </td>
                          <td>
                            <ActionMenu
                              id={`clm-${f.id}`} label={`More actions for ${f.name}`}
                              items={[
                                { label: 'Open firm', icon: 'eye', onSelect: () => router.push(`/admin/clients/${f.id}`) },
                                { label: 'View as client', icon: 'user', onSelect: () => viewAsClient(f.id, router) },
                                { label: 'Edit firm', icon: 'file', disabled: !ed, onSelect: () => setWizard({ mode: 'edit', id: f.id }) },
                                'separator',
                                {
                                  label: f.status === 'Paused' ? 'Reactivate firm' : 'Pause firm', icon: f.status === 'Paused' ? 'refresh' : 'block',
                                  danger: f.status !== 'Paused', disabled: !ed, onSelect: () => { void togglePauseFirm(f.id); }
                                }
                              ]}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="result-bar"><span aria-live="polite">Showing {list.length} of {s.firms.length} firms</span></div>
            </>
          )}
        </section>
      </div>

      <FirmWizard open={!!wizard} mode={wizard?.mode || 'create'} firmId={wizard?.id} onClose={() => setWizard(null)} onDone={wizard?.mode === 'create' ? resetList : undefined} />
    </>
  );
}
