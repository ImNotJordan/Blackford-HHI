'use client';
/* Portal Deadlines (legacy dlShell / dlUpdate + KPI tiles from glue.js): week and month calendars, agenda, flags. */
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { activeDeadlines, weekDeadlines, deadlineMarkers, getWf } from '@/lib/selectors';
import { addDays, diffDays, fmtD, fmtDT, fmtLong, fmtMonth, fmtRange, iso, sameDay, startOf, today, weekStart, DAY } from '@/lib/format';
import { Icon } from '@/components/icons';
import { Band, KpiRow, KpiTile, DatePicker, Switch, Segmented, EmptyState, DueChip, toast, announce } from '@/components/ui';
import type { Deadline } from '@/lib/types';
import { openWf } from './uiStore';
import { focusSoon, plural } from './common';

type Mode = 'week' | 'month';
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const wd = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);

export function DeadlinesView() {
  const s = useApp();
  const tz = s.settings.tz;
  const [mode, setMode] = useState<Mode>('week');
  const [anchor, setAnchor] = useState(() => weekStart(today()));
  const [riskOnly, setRiskOnly] = useState(false);
  const [day, setDay] = useState<Date | null>(null);
  const [goto, setGoto] = useState<Date | null>(null);

  const T = today();
  const wk = mode === 'week';
  const [rs, re] = wk ? [anchor, addDays(6, anchor)] : [monthStart(anchor), new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)];
  const all = activeDeadlines(s);
  const upcoming = all.filter(d => !d.done && diffDays(d.date) >= 0);
  const vis = all.filter(d => !riskOnly || d.atRisk);
  const on = (dd: Date) => vis.filter(d => sameDay(d.date, dd)).sort((a, b) => Number(b.atRisk) - Number(a.atRisk));

  /* navigation */
  const shift = (dir: number) => { setDay(null); setAnchor(a => (wk ? addDays(7 * dir, a) : new Date(a.getFullYear(), a.getMonth() + dir, 1))); };
  const goToday = () => { setDay(null); setAnchor(wk ? weekStart(T) : monthStart(T)); announce(`Showing the current ${mode}`); };
  const changeMode = (m: Mode) => {
    if (m === mode) return;
    setMode(m); setDay(null);
    if (m === 'month') setAnchor(monthStart(anchor));
    else setAnchor(T.getMonth() === rs.getMonth() && T.getFullYear() === rs.getFullYear() ? weekStart(T) : weekStart(rs));
  };
  const onGoto = (v: Date | null) => {
    setGoto(v);
    if (!v) return;
    setDay(wk ? null : v);
    setAnchor(wk ? weekStart(v) : monthStart(v));
    announce(`Showing ${fmtD(v)}`);
  };
  const kpi = (k: 'week' | 'risk' | 'month') => {
    setDay(null);
    if (k === 'week') { setMode('week'); setAnchor(weekStart(T)); }
    if (k === 'month') { setMode('month'); setAnchor(monthStart(T)); }
    if (k === 'risk') setRiskOnly(r => !r);
    announce(k === 'risk' ? (!riskOnly ? 'Showing at-risk deadlines only' : 'Showing all deadlines') : `Showing this ${k}`);
  };
  const toggleDay = (d: Date) => setDay(cur => (cur && sameDay(cur, d) ? null : d));

  /* agenda */
  const range: [Date, Date] = day ? [startOf(day), startOf(day)] : [rs, re];
  const inRange = (d: Date) => startOf(d) >= range[0] && startOf(d) <= range[1];
  const list = vis.filter(d => inRange(d.date)).sort((a, b) => a.date.getTime() - b.date.getTime());
  const next = vis.filter(d => !d.done && startOf(d.date) > range[1]).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  const label = day ? fmtLong(day) : wk ? 'This range' : wd(rs, { month: 'long' });
  const jump = () => {
    if (!next) return;
    setDay(null);
    setAnchor(wk ? weekStart(next.date) : monthStart(next.date));
    announce(`Jumped to ${fmtLong(next.date)}`);
  };

  let cal: React.ReactNode;
  if (wk) {
    cal = (
      <div className="week">
        {Array.from({ length: 7 }, (_, i) => {
          const d = addDays(i, rs), items = on(d), we = d.getDay() === 0 || d.getDay() === 6, isT = sameDay(d, T);
          return (
            <div key={i} className={`day${isT ? ' is-today' : ''}${we ? ' is-weekend' : ''}`} role="group" aria-label={`${fmtLong(d)}${isT ? ', today' : ''}, ${plural(items.length, 'deadline')}`}>
              <div className="day-head"><span>{wd(d, { weekday: 'short' })}</span><span className="day-num">{d.getDate()}</span></div>
              <div className="day-items">{items.length ? items.map(x => <DlChip key={x.id} d={x} />) : <span className="day-empty">No deadlines</span>}</div>
            </div>
          );
        })}
      </div>
    );
  } else {
    const gs = weekStart(rs);
    const weeks = Math.ceil((Math.round((re.getTime() - gs.getTime()) / DAY) + 1) / 7);
    cal = (
      <div className="month">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(x => <div key={x} className="m-dow" aria-hidden="true">{x}</div>)}
        {Array.from({ length: weeks * 7 }, (_, i) => {
          const d = addDays(i, gs), items = on(d), out = d.getMonth() !== rs.getMonth(), sel = !!day && sameDay(day, d);
          return (
            <div key={iso(d)} className={`m-cell${out ? ' out' : ''}${sameDay(d, T) ? ' is-today' : ''}${sel ? ' is-selected' : ''}`}>
              {items.length
                ? <button type="button" className="m-day" aria-pressed={sel} aria-label={`${fmtLong(d)}, ${plural(items.length, 'deadline')}. Show in agenda`} onClick={() => toggleDay(d)}>{d.getDate()}</button>
                : <span className="m-day">{d.getDate()}</span>}
              <span className="m-count" aria-hidden="true">{items.length ? `${items.length} due` : ''}</span>
              {items.slice(0, 2).map(x => <DlChip key={x.id} d={x} />)}
              {items.length > 2 ? <button type="button" className="m-more" onClick={() => setDay(d)}>+{items.length - 2} more</button> : null}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Band eyebrow="Filings and deliverables" title="Deadlines" sub="Filings, discovery dates and client deliverables your Hyacinth team is tracking.">
        <KpiRow cols={3} ariaLabel="Deadline filters">
          <KpiTile id="kd-week" label="Due in the next 7 days" value={weekDeadlines(s).length} foot="Show this week" onClick={() => kpi('week')} />
          <KpiTile id="kd-risk" label="Flagged at risk" value={upcoming.filter(d => d.atRisk).length} foot={riskOnly ? 'Showing at-risk only' : 'Show at-risk only'} pressed={riskOnly} onClick={() => kpi('risk')} />
          <KpiTile id="kd-month" label="Due in the next 30 days" value={upcoming.filter(d => diffDays(d.date) <= 30).length} foot="Show the month" onClick={() => kpi('month')} />
        </KpiRow>
      </Band>
      <div className="wrap pcontent">
        <section className="card" aria-labelledby="dl-range-h" style={{ overflow: 'hidden' }}>
          <div className="cal-bar">
            <div className="cal-nav">
              <button className="icon-btn" type="button" id="dl-prev" aria-label={wk ? 'Previous week' : 'Previous month'} onClick={() => shift(-1)}><Icon name="chevron-left" /></button>
              <button className="btn btn-ghost btn-sm" type="button" id="dl-today" onClick={goToday}>Today</button>
              <button className="icon-btn" type="button" id="dl-next" aria-label={wk ? 'Next week' : 'Next month'} onClick={() => shift(1)}><Icon name="chevron-right" /></button>
              <h2 className="range-label" id="dl-range-h" aria-live="polite">{wk ? fmtRange(rs, re) : fmtMonth(rs)}</h2>
            </div>
            <div className="card-tools">
              <span className="sr-only" id="dl-goto-l">Go to date</span>
              <div style={{ width: 190 }}>
                <DatePicker id="dl-goto" size="sm" labelId="dl-goto-l" title="Go to date" placeholder="Go to date" value={goto} markers={deadlineMarkers(s, 'portal')} onChange={onGoto} />
              </div>
            </div>
            <div className="card-tools">
              <span className="risk-toggle">
                <Switch id="dl-risk" checked={riskOnly} onChange={setRiskOnly} labelledBy="dl-risk-l" />
                <span id="dl-risk-l">At-risk only</span>
              </span>
              <Segmented<Mode> label="Calendar view" value={mode} onChange={m => changeMode(m)} options={[{ value: 'week', label: 'Week', id: 'dlm-week' }, { value: 'month', label: 'Month', id: 'dlm-month' }]} />
            </div>
          </div>
          {cal}
        </section>

        <section className="card" aria-labelledby="agenda-h">
          <div className="card-head">
            <div>
              <h2 className="h4" id="agenda-h" tabIndex={-1}>Agenda</h2>
              <p className="small">{label} · {plural(list.length, 'deadline')}{riskOnly ? ' flagged at risk' : ''}</p>
            </div>
            <div>{day ? <button className="btn btn-ghost btn-sm" type="button" onClick={() => { setDay(null); focusSoon('#agenda-h'); }}>Show all of {wd(rs, { month: 'long' })}</button> : null}</div>
          </div>
          <div>
            {list.length ? list.map(d => <AgendaRow key={d.id} d={d} tz={tz} />) : (
              <EmptyState
                icon="calendar" title={riskOnly ? 'No at-risk deadlines in this range' : 'No deadlines in this range'}
                text={next ? `The next one is “${next.title}” on ${fmtD(next.date)}.` : 'There is nothing further on the calendar.'}
                actions={(next || riskOnly) ? <>
                  {next ? <button className="btn btn-dark btn-sm" type="button" onClick={jump}>Jump to next deadline</button> : null}
                  {riskOnly ? <button className="btn btn-ghost btn-sm" type="button" onClick={() => setRiskOnly(false)}>Show all deadlines</button> : null}
                </> : undefined}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function DlChip({ d }: { d: Deadline }) {
  const cls = `dl-chip${d.atRisk && !d.done ? ' risk' : ''}${d.done ? ' done' : ''}`;
  return (
    <button type="button" className={cls} onClick={() => openWf(d.wf)}>
      <span className="k">
        {d.done ? <><Icon name="check" size={12} />Met · {d.kind}</> : d.atRisk ? <><Icon name="flag" size={12} />At risk · {d.kind}</> : d.kind}
      </span>
      <b>{d.title}</b>
      <span className="k">{d.wf}</span>
    </button>
  );
}

function AgendaRow({ d, tz }: { d: Deadline; tz: Parameters<typeof fmtDT>[1] }) {
  const w = useApp(s => getWf(s, d.wf));
  const flag = () => {
    const undo = useApp.getState().toggleDeadlineRisk(d.id);
    const nowRisk = !d.atRisk;
    toast(nowRisk ? `Flagged “${d.title}” as at risk.` : `Removed the at-risk flag from “${d.title}”.`, { icon: 'flag', undo });
  };
  return (
    <div className="agenda-row">
      <span className={`date-chip${sameDay(d.date, today()) ? ' today' : ''}`}><small>{wd(d.date, { weekday: 'short' })}</small><b>{d.date.getDate()}</b></span>
      <div>
        <p className="row-title">{d.title}</p>
        <p className="row-sub">{d.kind} · {w?.matter} · {fmtDT(d.date, tz)}</p>
        <p className="ds-inline" style={{ marginTop: 6 }}>
          <DueChip date={d.date} done={d.done} />
          {d.atRisk && !d.done ? <span className="risk-tag"><Icon name="flag" size={14} />Flagged at risk</span> : null}
        </p>
      </div>
      <div className="agenda-actions">
        <button
          className="icon-btn flag" type="button" id={`flag-${d.id}`} aria-pressed={d.atRisk} disabled={d.done}
          aria-label={`${d.atRisk ? 'Remove at-risk flag from' : 'Flag as at risk:'} ${d.title}`} title={d.atRisk ? 'Remove at-risk flag' : 'Flag as at risk'}
          onClick={flag}
        ><Icon name="flag" /></button>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => openWf(d.wf)}>Open {d.wf}</button>
      </div>
    </div>
  );
}
