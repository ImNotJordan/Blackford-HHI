'use client';
/* Admin · Audit log: KPI tiles, filters (user, action type, date range), table, CSV export; restricted state without 'audit'. */
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Band, Combobox, DateRangePicker, EmptyState, KpiRow, KpiTile, MultiSelect, RelTime, useBusy } from '@/components/ui';
import { focusRoleSwitcher, useCan } from '@/components/admin/common';
import { exportData } from '@/components/admin/settings/exportData';
import { useTz } from '@/components/admin/settings/formKit';
import { AUDIT_TYPES } from '@/lib/data';
import { TZS, fmtDT, sameDay, startOf, today } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { DateRange } from '@/lib/types';

const TYPE_OPTS = AUDIT_TYPES.map(t => ({ value: t, label: t }));

export function AuditView() {
  const canAudit = useCan('audit');
  const role = useApp(s => s.admin.role);
  if (!canAudit) {
    return (
      <>
        <Band eyebrow="Governance" title="Audit log" sub="A record of every admin action." />
        <div className="wrap pcontent">
          <section className="card">
            <EmptyState
              icon="shield" title={`The audit log is off for ${role}`}
              text="“View the audit log” is turned off for this role in Users & roles. Switch role to review it."
              actions={<>
                <button className="btn btn-dark btn-sm" type="button" onClick={focusRoleSwitcher}>Switch role</button>
                <Link className="btn btn-ghost btn-sm" href="/admin/users">Users &amp; roles</Link>
              </>}
            />
          </section>
        </div>
      </>
    );
  }
  return <AuditLog />;
}

function AuditLog() {
  const audit = useApp(s => s.audit);
  const tz = useTz();
  const canExport = useCan('export');
  const [user, setUser] = useState('all');
  const [types, setTypes] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange | null>(null);
  const [busy, run] = useBusy();

  const users = [...new Set(audit.map(x => x.user))];
  const list = audit.filter(x =>
    (user === 'all' || x.user === user) &&
    (!types.length || types.includes(x.type)) &&
    (!range || (startOf(x.at) >= startOf(range.start) && startOf(x.at) <= startOf(range.end))));
  const filtered = user !== 'all' || types.length > 0 || !!range;
  const t0 = today();
  const isToday = !!(range && sameDay(range.start, t0) && sameDay(range.end, t0));
  const clear = () => { setUser('all'); setTypes([]); setRange(null); };

  const toggleToday = () => setRange(isToday ? null : { start: today(), end: today(), preset: 'today' });
  const pickUser = () => {
    const t = document.getElementById('au-user');
    if (!t) return;
    t.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    t.focus();
    t.click();
  };

  return (
    <>
      <Band
        eyebrow="Governance" title="Audit log" sub="Every admin action in this session: creates, edits, status changes, publishing and role changes."
        actions={canExport
          ? <button className="btn btn-primary btn-sm" type="button" id="au-export" disabled={busy} aria-busy={busy || undefined} onClick={() => run(() => exportData('audit', list))}><Icon name="export" size={18} />Export CSV</button>
          : null}
      >
        <KpiRow cols={3} ariaLabel="Audit summary">
          <KpiTile id="kau-all" label="Entries" value={audit.length} foot="Show every entry" onClick={clear} />
          <KpiTile id="kau-today" label="Today" value={audit.filter(x => sameDay(x.at, new Date())).length} foot={isToday ? 'Showing today' : 'Show today only'} onClick={toggleToday} pressed={isToday} />
          <KpiTile id="kau-people" label="People and systems" value={users.length} foot="Filter by user" onClick={pickUser} />
        </KpiRow>
      </Band>
      <div className="wrap pcontent">
        <section className="card" aria-label="Audit entries">
          <div className="filters">
            <div className="field">
              <span className="flabel" id="au-user-l">User</span>
              <Combobox id="au-user" labelId="au-user-l" title="User" value={user} onChange={v => setUser(v || 'all')}
                options={[{ value: 'all', label: 'All users' }, ...users.map(x => ({ value: x, label: x }))]} />
            </div>
            <div className="field">
              <span className="flabel" id="au-type-l">Action type</span>
              <MultiSelect id="au-type" labelId="au-type-l" title="Action types" placeholder="All actions" value={types} options={TYPE_OPTS} onChange={setTypes} />
            </div>
            <div className="field wide">
              <span className="flabel" id="au-range-l">Date range</span>
              <DateRangePicker id="au-range" labelId="au-range-l" title="Date range" placeholder="All dates" value={range} onChange={setRange}
                max={t0} maxReason="The audit log has no future entries." />
            </div>
            <div className="field">
              <span className="flabel" aria-hidden="true">&nbsp;</span>
              <button className="btn btn-quiet" type="button" id="au-clear" onClick={clear} disabled={!filtered}>Clear filters</button>
            </div>
          </div>
          {list.length ? (
            <>
              <div className="table-wrap" tabIndex={0} role="region" aria-label="Audit log table">
                <table className="data" style={{ minWidth: 880 }}>
                  <thead>
                    <tr><th scope="col">When</th><th scope="col">User</th><th scope="col">Action</th><th scope="col">Type</th><th scope="col">Target</th></tr>
                  </thead>
                  <tbody>
                    {list.map(x => (
                      <tr key={x.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{fmtDT(x.at, tz)}<div className="cell-sub"><RelTime date={x.at} /></div></td>
                        <td><b>{x.user}</b><div className="cell-sub">{x.role}</div></td>
                        <td style={{ minWidth: 240 }}>{x.action}</td>
                        <td><span className="mini-chip">{x.type}</span></td>
                        <td>{x.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="result-bar">
                <span aria-live="polite">Showing {list.length} of {audit.length} entries</span>
                <span>Times in {TZS[tz].name}</span>
              </div>
            </>
          ) : (
            <EmptyState icon="search" title="No entries match" text="Try another user, action type or date range."
              actions={<button className="btn btn-dark btn-sm" type="button" onClick={clear}>Clear filters</button>} />
          )}
        </section>
      </div>
    </>
  );
}
