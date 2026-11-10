'use client';
/* Portal Overview (legacy ovShell / ovUpdate / renderTrend / renderExceptions). */
import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { pFirm, openWfs, countStatus, weekDeadlines, activeDeadlines, activeExceptions, portalSla, getWf } from '@/lib/selectors';
import { addDays, diffDays, fmtD, fmtLong, greeting, relDue, sum, today } from '@/lib/format';
import { Icon } from '@/components/icons';
import { Band, KpiRow, KpiTile, LineChart, Segmented, EmptyState, ActionMenu, Avatar, toast, useBusy } from '@/components/ui';
import type { ExceptionItem } from '@/lib/types';
import { openWf, openNewWf, openMessage } from './uiStore';
import { focusSoon, plural } from './common';

export function OverviewView() {
  const s = useApp();
  const F = pFirm(s);
  const [range, setRange] = useState<'6' | '12'>('12');
  const [table, setTable] = useState(false);
  const [exView, setExView] = useState<'open' | 'snoozed'>('open');

  const open = openWfs(s).length, risk = countStatus(s, 'at-risk'), review = countStatus(s, 'review');
  const wk = weekDeadlines(s), wkRisk = wk.filter(d => d.atRisk).length;
  const sla = portalSla(s);
  const latest = s.reports[0];

  /* trend */
  const n = +range;
  const labels = s.trend.labels.slice(-n), op = s.trend.opened.slice(-n), cp = s.trend.completed.slice(-n);

  /* exceptions */
  const allEx = activeExceptions(s);
  const openList = allEx.filter(e => !e.snoozedUntil), snoozed = allEx.filter(e => e.snoozedUntil);
  const exList = exView === 'open' ? openList : snoozed;
  const showEx = (v: 'open' | 'snoozed') => { setExView(v); focusSoon(`#exv-${v}`); };

  /* next deadlines */
  const up = activeDeadlines(s).filter(d => !d.done && diffDays(d.date) >= 0).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  return (
    <>
      <Band
        eyebrow={fmtLong(today())}
        title={`Good ${greeting()}, ${s.profile.name.split(' ')[0]}.`}
        sub={`Here is what your Hyacinth team is running for ${F.name} right now.`}
        actions={<>
          <Link className="btn btn-ghost btn-sm" href="/portal/reports"><Icon name="file" size={18} />{latest.label} report</Link>
          <button className="btn btn-primary btn-sm" type="button" onClick={openNewWf}><Icon name="plus" size={18} />Request a workflow</button>
        </>}
      >
        <KpiRow ariaLabel="Key figures">
          <KpiTile href="/portal/workflows?status=all" label="Open workflows" value={open} foot={`${risk} at risk`} />
          <KpiTile href="/portal/deadlines" label="Deadlines this week" value={wk.length} foot={`${wkRisk} flagged at risk`} />
          <KpiTile href="/portal/workflows?status=review" label="Awaiting attorney review" value={review} foot="Waiting on your attorneys" />
          <KpiTile href="/portal/reports" label="SLA on time, last 30 days" value={sla == null ? '—' : `${sla.toFixed(1)}%`} foot={sla == null ? 'Not enough data yet' : 'Target 95%'} />
        </KpiRow>
      </Band>

      <div className="wrap pcontent">
        <div className="ov-grid">
          <section className="card" aria-labelledby="trend-h">
            <div className="card-head">
              <div><h2 className="h4" id="trend-h">Workload trend</h2><p className="small">Items opened and completed by your Hyacinth team each week</p></div>
              <div className="card-tools">
                <Segmented<'6' | '12'> label="Trend range" value={range} onChange={v => setRange(v)} options={[{ value: '6', label: '6 weeks', id: 'tr-6' }, { value: '12', label: '12 weeks', id: 'tr-12' }]} />
                <button className="btn btn-quiet btn-sm" type="button" id="tr-table" aria-pressed={table} onClick={() => setTable(t => !t)}><Icon name="list" size={18} />{table ? 'Chart view' : 'Table view'}</button>
              </div>
            </div>
            <div className="card-body">
              {table ? (
                <div className="table-wrap" tabIndex={0} role="region" aria-label="Workload trend table" style={{ borderTop: 0 }}>
                  <table className="mini-table">
                    <caption className="sr-only">Items opened and completed per week</caption>
                    <thead><tr><th scope="col">Week of</th><th scope="col">Opened</th><th scope="col">Completed</th></tr></thead>
                    <tbody>{labels.map((l, i) => <tr key={l}><td>{l}</td><td>{op[i]}</td><td>{cp[i]}</td></tr>)}</tbody>
                    <tfoot><tr><th scope="row">Total</th><td><b>{sum(op)}</b></td><td><b>{sum(cp)}</b></td></tr></tfoot>
                  </table>
                </div>
              ) : (
                <LineChart
                  labels={labels}
                  series={[{ name: 'Opened', values: op, color: 'var(--ink)' }, { name: 'Completed', values: cp, color: 'var(--gold)', area: true }]}
                  ariaLabel="Workload trend chart. Use the left and right arrow keys to read each week."
                  summary={`Over the last ${n} weeks your team opened ${sum(op)} items and completed ${sum(cp)}. Most recent week: ${op[n - 1]} opened, ${cp[n - 1]} completed.`}
                />
              )}
            </div>
          </section>

          <section className="card" aria-labelledby="ex-h">
            <div className="card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h2 className="h4" id="ex-h" tabIndex={-1}>Exceptions</h2>
                <span className="count-badge">{openList.length}</span>
              </div>
              <Segmented<'open' | 'snoozed'>
                label="Which exceptions to show" value={exView} onChange={v => setExView(v)}
                options={[{ value: 'open', label: 'Open', id: 'exv-open' }, { value: 'snoozed', label: `Snoozed (${snoozed.length})`, id: 'exv-snoozed' }]}
              />
            </div>
            <div>
              {exList.length ? (
                <div className="ex-list">{exList.map(e => <ExceptionRow key={e.id} e={e} view={exView} />)}</div>
              ) : exView === 'open' ? (
                <EmptyState
                  icon="check" title="No open exceptions" text="Your Hyacinth team has nothing waiting on a decision right now."
                  actions={snoozed.length
                    ? <button className="btn btn-ghost btn-sm" type="button" onClick={() => showEx('snoozed')}>Show snoozed ({snoozed.length})</button>
                    : <Link className="btn btn-ghost btn-sm" href="/portal/workflows">Review workflows</Link>}
                />
              ) : (
                <EmptyState
                  icon="clock" title="Nothing snoozed" text="Snoozed exceptions appear here until their snooze ends."
                  actions={<button className="btn btn-ghost btn-sm" type="button" onClick={() => showEx('open')}>Back to open exceptions</button>}
                />
              )}
            </div>
          </section>
        </div>

        <div className="ov-grid b">
          <section className="card" aria-labelledby="nd-h">
            <div className="card-head">
              <div><h2 className="h4" id="nd-h">Next deadlines</h2><p className="small">Filings and deliverables coming up</p></div>
              <Link className="btn btn-quiet btn-sm" href="/portal/deadlines">Open calendar <Icon name="arrow-right" size={18} /></Link>
            </div>
            <div>
              {up.length ? (
                <div className="row-list">
                  {up.map(d => {
                    const w = getWf(s, d.wf);
                    return (
                      <button key={d.id} type="button" className="row-item" onClick={() => openWf(d.wf)}>
                        <span className={`date-chip${diffDays(d.date) === 0 ? ' today' : ''}`}><small>{d.date.toLocaleDateString('en-US', { month: 'short' })}</small><b>{d.date.getDate()}</b></span>
                        <span>
                          <span className="row-title" style={{ display: 'block' }}>{d.title}</span>
                          <span className="row-sub" style={{ display: 'block' }}>{d.kind} · {w?.matter} · {relDue(d.date)}</span>
                        </span>
                        {d.atRisk ? <span className="risk-tag"><Icon name="flag" size={16} />At risk</span> : <Icon name="chevron-right" size={18} />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon="calendar" title="No upcoming deadlines" text="Nothing is due in the coming weeks." actions={<Link className="btn btn-ghost btn-sm" href="/portal/deadlines">Open the calendar</Link>} />
              )}
            </div>
          </section>

          <section className="card" aria-labelledby="team-h">
            <div className="card-head">
              <div><h2 className="h4" id="team-h">Your Hyacinth team</h2><p className="small">Dedicated to {F.name}</p></div>
              <Link className="btn btn-quiet btn-sm" href="/portal/help">Get support <Icon name="arrow-right" size={18} /></Link>
            </div>
            <div className="row-list">
              {F.team.slice(0, 5).filter(k => s.team[k]).map(k => {
                const t = s.team[k], cnt = openWfs(s).filter(w => w.owner === k).length;
                return (
                  <div className="row-item" key={k}>
                    <Avatar name={t.name} />
                    <span>
                      <span className="row-title" style={{ display: 'block' }}>{t.name}</span>
                      <span className="row-sub" style={{ display: 'block' }}>{t.role} · {cnt} active {cnt === 1 ? 'workflow' : 'workflows'}</span>
                    </span>
                    <button className="btn btn-quiet btn-sm" type="button" id={`msg-${k}`} aria-label={`Message ${t.name}`} onClick={() => openMessage(k)}><Icon name="message" size={18} /><span>Message</span></button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ExceptionRow({ e, view }: { e: ExceptionItem; view: 'open' | 'snoozed' }) {
  const w = useApp(s => getWf(s, e.wf));
  const [busy, run] = useBusy();
  const resolve = () => run(() => {
    const undo = useApp.getState().resolveException(e.id);
    focusSoon('[id^="exr-"]', '#ex-h');
    toast(`Resolved “${e.title}”.`, { undo });
  });
  const snooze = (days: number) => {
    const undo = useApp.getState().snoozeException(e.id, days);
    focusSoon('[id^="exr-"]', '#ex-h');
    toast(`Snoozed until ${fmtD(addDays(days))}.`, { icon: 'clock', undo });
  };
  const unsnooze = () => {
    useApp.getState().unsnoozeException(e.id);
    focusSoon('#exv-snoozed');
    toast(`“${e.title}” is back in open exceptions.`);
  };
  return (
    <article className="ex" aria-labelledby={`ext-${e.id}`}>
      <span className={`sev ${e.sev}`}><Icon name={e.sev === 'high' ? 'alert' : 'clock'} size={16} /></span>
      <div>
        <h3 className="ex-title" id={`ext-${e.id}`}>{e.title}</h3>
        <p className="ex-detail">{e.detail}</p>
        <p className="ex-meta">
          <span>{e.sev === 'high' ? 'High priority' : 'Normal priority'}</span><span aria-hidden="true">·</span>
          <span>{e.age}</span><span aria-hidden="true">·</span>
          <button className="text-btn" type="button" onClick={() => openWf(e.wf)}>{e.wf}: {w?.title}</button>
        </p>
        <div className="ex-actions">
          {view === 'open' ? (
            <>
              <button className="btn btn-dark btn-sm" type="button" id={`exr-${e.id}`} onClick={resolve} aria-busy={busy || undefined} disabled={busy}><Icon name="check" size={16} />Resolve</button>
              <ActionMenu
                id={`exs-${e.id}`} label={`Snooze: ${e.title}`} triggerClassName="btn btn-ghost btn-sm"
                trigger={<><Icon name="clock" size={16} />Snooze<Icon name="chevron-down" size={16} /></>}
                items={[1, 3, 7].map(dn => ({ label: dn === 7 ? 'Snooze for 1 week' : `Snooze for ${plural(dn, 'day')}`, icon: 'clock' as const, onSelect: () => snooze(dn) }))}
              />
            </>
          ) : (
            <>
              <span className="small">Snoozed until {fmtD(e.snoozedUntil)}</span>
              <button className="btn btn-ghost btn-sm" type="button" id={`exu-${e.id}`} onClick={unsnooze}>Unsnooze</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
