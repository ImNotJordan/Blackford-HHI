'use client';
/* Portal Reports (legacy repShell / repLoad / renderReport / reportCSV).
   The third month fails on its first load in a session (Retry works); a simulated failure also fails once. */
import Link from 'next/link';
import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { AREAS, REPORT_COUNT } from '@/lib/data';
import { pFirm, repFor, repIdxFor, repMonthVal } from '@/lib/selectors';
import { fmtD, sum, toCSV } from '@/lib/format';
import { Icon, Logo } from '@/components/icons';
import { Band, MonthPicker, Switch, EmptyState, ErrorState, HBarChart, openCsv, useBusy } from '@/components/ui';
import type { AppState } from '@/lib/store';
import { usePortalUi } from './uiStore';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pctFmt = (v: number) => `${v.toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v)}`;

function Delta({ cur, prev, unit = '', lowerBetter = false, digits = 0 }: { cur: number; prev: number; unit?: string; lowerBetter?: boolean; digits?: number }) {
  const d = +(cur - prev).toFixed(digits);
  if (d === 0) return <>No change</>;
  const up = d > 0, good = lowerBetter ? !up : up;
  return <><span className={up ? 'delta-up' : 'delta-down'}>{up ? '+' : '−'}{Math.abs(d).toFixed(digits)}{unit}</span> vs. prior month{good ? '' : ' (watch)'}</>;
}

function reportCSV(s: AppState, idx: number) {
  const r = repFor(s, idx), p = repFor(s, idx + 1), F = pFirm(s);
  return toCSV([
    ['Hyacinth monthly management report', r.label], ['Prepared for', F.name], ['Prepared by', `${s.team[F.lead]?.name}, engagement lead`], [],
    ['Metric', 'Value', `Prior month (${p.label})`],
    ['Items completed', r.completed, p.completed], ['Completed on time (%)', r.onTime.toFixed(1), p.onTime.toFixed(1)],
    ['Median turnaround (days)', r.turnaround.toFixed(1), p.turnaround.toFixed(1)], ['Exceptions raised', r.exRaised, p.exRaised], ['Exceptions resolved', r.exResolved, p.exResolved], [],
    ['Service area', 'Opened', 'Completed', 'On time (%)'],
    ...r.areas.map(a => [AREAS[a[0]], a[1], a[2], a[3]]), [],
    ['Highlights'], ...r.highlights.map(h => [h]), [],
    ['Focus for next month'], ...r.focus.map(h => [h])
  ]);
}

export function ReportsView() {
  const s = useApp();
  const rep = usePortalUi(u => u.rep);
  const setRep = usePortalUi(u => u.setRep);
  const F = pFirm(s);
  const idx = Math.min(rep.idx, REPORT_COUNT - 1);
  const key = `${s.portalFirm}:${idx}`;
  const status = rep.status[key];
  const [expBusy, runExp] = useBusy();

  useEffect(() => {
    if (status) return;
    const t = setTimeout(() => {
      const sim = useApp.getState().consumeSimulatedError();
      const ui = usePortalUi.getState();
      const fail = sim || (idx === 2 && !ui.rep.failedOnce[idx]);
      ui.setRep({
        status: { ...ui.rep.status, [key]: fail ? 'error' : 'loaded' },
        failedOnce: fail ? { ...ui.rep.failedOnce, [idx]: true } : ui.rep.failedOnce
      });
    }, reduced() ? 300 : 700);
    return () => clearTimeout(t);
  }, [key, idx, status]);

  const go = (i: number) => setRep({ idx: Math.max(0, Math.min(REPORT_COUNT - 1, i)) });
  const retry = () => { const st = { ...usePortalUi.getState().rep.status }; delete st[key]; setRep({ status: st }); };
  const r = repFor(s, idx);
  const monthEnd = new Date(+r.key.slice(0, 4), +r.key.slice(5, 7), 0);
  const empty = F.since > monthEnd || !r.areas.length;
  const exportable = status === 'loaded' && !empty;

  const doExport = () => runExp(() => {
    const st = useApp.getState();
    openCsv(`Export ${r.label} report`, `hyacinth-report-${r.key}.csv`, reportCSV(st, idx));
  });

  let doc: React.ReactNode;
  if (!status) {
    doc = (
      <div className="card report" aria-busy="true">
        <p className="sr-only">Loading report</p>
        <div className="report-cover on-ink">
          <span className="sk" style={{ height: 12, width: 180, opacity: 0.25 }} />
          <div className="report-figs">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="report-fig" key={i}><span className="sk" style={{ height: 32, width: 90, opacity: 0.25 }} /><span className="sk" style={{ height: 10, width: 120, opacity: 0.25 }} /></div>
            ))}
          </div>
        </div>
        <div className="report-sec">{[60, 92, 80, 70, 45].map((w, i) => <span key={i} className="sk" style={{ height: 14, width: `${w}%` }} />)}</div>
      </div>
    );
  } else if (status === 'error') {
    doc = (
      <div className="card">
        <ErrorState
          title={`The ${s.reports[idx].label} report didn’t load`} retryId="rep-retry-btn" onRetry={retry}
          text="The report service did not respond in time. Other months and views are unaffected. Try again in a moment."
          extra={<button className="btn btn-ghost btn-sm" type="button" onClick={() => go(0)}>View the latest report</button>}
        />
      </div>
    );
  } else if (empty) {
    doc = (
      <div className="card">
        <EmptyState
          icon="file" title={`No ${r.label} report for ${F.name}`}
          text={F.since > monthEnd ? `${F.name} started with Hyacinth on ${fmtD(F.since)}. The first report covers its first full month.` : 'This firm has no services enabled for this month.'}
          actions={<Link className="btn btn-dark btn-sm" href="/portal">Go to Overview</Link>}
        />
      </div>
    );
  } else {
    doc = <ReportDoc idx={idx} compare={rep.compare} />;
  }

  return (
    <>
      <Band
        eyebrow="Management reporting" title="Reports" sub={`The monthly management report your engagement lead prepares for ${F.name}.`}
        actions={<>
          <div className="month-nav">
            <button className="icon-btn" type="button" id="rep-prev" aria-label="Previous month" disabled={idx >= REPORT_COUNT - 1} onClick={() => go(idx + 1)}><Icon name="chevron-left" /></button>
            <span className="sr-only" id="rep-month-l">Report month</span>
            <div style={{ width: 200 }}>
              <MonthPicker
                id="rep-month" size="sm" labelId="rep-month-l" title="Report month" required value={repMonthVal(s, idx)}
                monthAllowed={(y, m) => repIdxFor(s, y, m) >= 0} monthReason="No management report for this month."
                onChange={v => { const i = repIdxFor(useApp.getState(), v.y, v.m); if (i >= 0) go(i); }}
              />
            </div>
            <button className="icon-btn" type="button" id="rep-next" aria-label="Next month" disabled={idx <= 0} onClick={() => go(idx - 1)}><Icon name="chevron-right" /></button>
          </div>
          <button className="btn btn-primary btn-sm" type="button" id="rep-export" disabled={!exportable || expBusy} aria-busy={expBusy || undefined} onClick={doExport}><Icon name="export" size={18} />Export CSV</button>
        </>}
      >
        <div className="band-stats">
          <span className="risk-toggle">
            <Switch id="rep-compare" checked={rep.compare} onChange={compare => setRep({ compare })} labelledBy="rep-compare-l" />
            <span id="rep-compare-l">Compare with the previous month</span>
          </span>
        </div>
      </Band>
      <div className="wrap pcontent">{doc}</div>
    </>
  );
}

function ReportDoc({ idx, compare: cmp }: { idx: number; compare: boolean }) {
  const s = useApp();
  const r = repFor(s, idx), p = repFor(s, idx + 1), F = pFirm(s);
  const lead = s.team[F.lead]?.name || 'your engagement lead';
  const prevArea = (i: number) => p.areas[i]?.[2] ?? 0;
  const fig = (val: React.ReactNode, label: string, dl: React.ReactNode) => (
    <div className="report-fig"><b>{val}</b><span>{label}</span>{cmp ? <span className="delta">{dl}</span> : null}</div>
  );
  const rows = r.areas.map(([a, op, cp, ot], i) => ({
    label: AREAS[a],
    segments: [{ name: 'Completed', value: cp, color: 'var(--gold)' }],
    valueText: `${cp}${cmp ? ` (${signed(cp - prevArea(i))})` : ''}`,
    tip: [
      { label: 'Completed', value: cp }, { label: 'Opened', value: op }, { label: 'On time', value: `${ot}%` },
      ...(cmp ? [{ label: `${p.short} completed`, value: prevArea(i) }] : [])
    ]
  }));
  return (
    <article className="card report" aria-labelledby="rep-title">
      <header className="report-cover on-ink">
        <div className="report-meta">
          <div className="stack-8">
            <p className="eyebrow">Monthly management report</p>
            <h2 className="h3" id="rep-title">{r.label}</h2>
            <p className="small">Prepared for {F.name} by {lead}, engagement lead</p>
          </div>
          <span><Logo /></span>
        </div>
        <div className="report-figs">
          {fig(r.completed, 'Items completed', <Delta cur={r.completed} prev={p.completed} />)}
          {fig(pctFmt(r.onTime), 'Completed on time', <Delta cur={r.onTime} prev={p.onTime} unit=" pts" digits={1} />)}
          {fig(`${r.turnaround.toFixed(1)} days`, 'Median turnaround', <Delta cur={r.turnaround} prev={p.turnaround} unit=" days" lowerBetter digits={1} />)}
          {fig(`${r.exResolved} of ${r.exRaised}`, 'Exceptions resolved', <Delta cur={r.exResolved} prev={p.exResolved} />)}
        </div>
      </header>
      <section className="report-sec" aria-labelledby="rep-chart-h">
        <div>
          <h3 className="h4" id="rep-chart-h">Completed work by service area</h3>
          <p className="small">Items completed in {r.label}{cmp ? `, with change from ${p.label}` : ''}. Values are also in the table below.</p>
        </div>
        <HBarChart
          rows={rows} ariaLabel={`Completed work by service area, ${r.label}`}
          summary={`${r.label}: ${r.areas.map(a => `${AREAS[a[0]]} ${a[2]} completed`).join(', ')}.`}
        />
      </section>
      <section className="report-sec" aria-labelledby="rep-table-h">
        <h3 className="h4" id="rep-table-h">Service area detail</h3>
        <div className="table-wrap" tabIndex={0} role="region" aria-labelledby="rep-table-h" style={{ borderTop: 0 }}>
          <table className="mini-table">
            <thead>
              <tr>
                <th scope="col">Service area</th><th scope="col">Opened</th><th scope="col">Completed</th>
                {cmp ? <th scope="col">Change vs. {p.short}</th> : null}<th scope="col">On time</th>
              </tr>
            </thead>
            <tbody>
              {r.areas.map(([a, op, cp, ot], i) => (
                <tr key={a}><td>{AREAS[a]}</td><td>{op}</td><td>{cp}</td>{cmp ? <td>{signed(cp - prevArea(i))}</td> : null}<td>{ot}%</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">All areas</th><td><b>{sum(r.areas.map(a => a[1]))}</b></td><td><b>{r.completed}</b></td>
                {cmp ? <td><b>{signed(r.completed - p.completed)}</b></td> : null}<td><b>{pctFmt(r.onTime)}</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      <section className="report-sec">
        <div className="report-cols">
          <div className="stack-16"><h3 className="h4">Highlights</h3><ul className="bul">{r.highlights.map(h => <li key={h}>{h}</li>)}</ul></div>
          <div className="stack-16"><h3 className="h4">Focus for next month</h3><ul className="bul">{r.focus.map(h => <li key={h}>{h}</li>)}</ul></div>
        </div>
      </section>
      <footer className="report-foot"><span>Hyacinth Industries, LLC · Legal Support</span><span>Report period {r.label}</span></footer>
    </article>
  );
}
