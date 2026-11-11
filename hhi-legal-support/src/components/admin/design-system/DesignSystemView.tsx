'use client';
/* Admin · Design system: every dropdown and date component, live and interactive, with value readouts and usage notes. */
import { useState, type ReactNode } from 'react';
import {
  ActionMenu, Band, Combobox, DatePicker, DateRangePicker, DateTimePicker, DueChip, MonthPicker, MultiSelect, RelTime, Select, StatusDropdown, toast,
  type MenuEntry, type Option
} from '@/components/ui';
import { useTz } from '@/components/admin/settings/formKit';
import { ROLES, ROLE_DESC, STATUS } from '@/lib/data';
import { TZS, addDays, at, fmtD, fmtDT, fmtRange, monthLabel, today } from '@/lib/format';
import { areaOptions, deadlineMarkers, firmOptions, staffOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { DateRange, MonthValue, StatusKey } from '@/lib/types';

const STATUS_OPTS: Option[] = (Object.keys(STATUS) as StatusKey[]).map(k => ({ value: k, label: STATUS[k] }));
const ROLE_OPTS: Option[] = ROLES.map(r => ({ value: r, label: r, sub: ROLE_DESC[r] }));
const STATUS_KEYS: StatusKey[] = ['on-track', 'at-risk', 'review', 'blocked', 'complete'];

const labelOf = (opts: Option[], v: string) => opts.find(o => o.value === v)?.label || v;
const one = (opts: Option[], v: string) => `Value: ${v ? labelOf(opts, v) : 'none'}`;
const many = (opts: Option[], v: string[]) => `Value: ${v.length ? v.map(x => labelOf(opts, x)).join(', ') : 'none'}`;

/** One example: caption, hidden label, the control, a live readout and an optional usage note. */
function Ex({ cap, children, note }: { cap: string; children: ReactNode; note?: ReactNode }) {
  return (
    <div className="ds-ex">
      <span className="cap-l">{cap}</span>
      {children}
      {note ? <p className="ds-note">{note}</p> : null}
    </div>
  );
}
const Lab = ({ id, children }: { id: string; children: string }) => <span className="sr-only" id={`${id}-l`}>{children}</span>;
const Readout = ({ id, children }: { id: string; children: ReactNode }) => <p className="small" id={`dsv-${id}`} aria-live="polite">{children}</p>;

export function DesignSystemView() {
  const s = useApp();
  const tz = useTz();
  const areas = areaOptions();
  const owners = staffOptions(s);
  const firms = firmOptions(s);
  const markers = deadlineMarkers(s, 'all');
  const t0 = today();

  /* Select */
  const [a, setA] = useState('');
  const [b, setB] = useState('lo');
  const [c, setC] = useState('fa');
  const [d, setD] = useState('cx');
  const [e, setE] = useState('Team Lead');
  const [g, setG] = useState('');
  /* Combobox */
  const [h, setH] = useState('');
  const [i, setI] = useState('');
  const [j, setJ] = useState('');
  /* Multi-select */
  const [k, setK] = useState<string[]>(['cx', 'lo', 'fa', 'dv']);
  const [l, setL] = useState<string[]>([]);
  /* Status dropdowns */
  const [st, setSt] = useState<Record<StatusKey, StatusKey>>(() => Object.fromEntries(STATUS_KEYS.map(x => [x, x])) as Record<StatusKey, StatusKey>);
  /* Dates */
  const [m, setM] = useState<Date | null>(null);
  const [n, setN] = useState<Date | null>(() => addDays(3));
  const [o, setO] = useState<Date | null>(null);
  const [q, setQ] = useState<DateRange | null>(null);
  const [r, setR] = useState<Date | null>(() => at(1, 15, 30));
  const [twoHoursAgo] = useState(() => new Date(Date.now() - 2 * 3600e3));
  const [sm, setSm] = useState<MonthValue | null>(() => ({ y: t0.getFullYear(), m: t0.getMonth() }));

  const showOpen = () => {
    const t = document.getElementById('ds-d');
    if (!t) return;
    t.focus();
    t.click();
  };
  const menu: MenuEntry[] = [
    { label: 'Open', icon: 'eye', onSelect: () => toast('Menu item: Open.') },
    { label: 'Duplicate', icon: 'copy', onSelect: () => toast('Menu item: Duplicate.') },
    { label: 'Reassign', icon: 'users', onSelect: () => toast('Menu item: Reassign.') },
    { label: 'Disabled item', icon: 'block', disabled: true, onSelect: () => {} },
    'separator',
    { label: 'Delete', icon: 'archive', danger: true, onSelect: () => toast('Menu item: Delete. Real deletes confirm first and offer Undo.', { icon: 'alert' }) }
  ];

  return (
    <>
      <Band eyebrow="Reference" title="Design system" sub="Every dropdown and date component, live. These are the same components used on the website, in the client portal and in admin." />
      <div className="wrap pcontent">
        <section className="card ds-sec" aria-labelledby="ds1">
          <div className="card-head"><div><h2 className="h4" id="ds1">Select</h2><p className="small">Single choice: status, role, service area. Enter, Space or ↓ opens; type a letter to jump.</p></div></div>
          <div className="card-body ds-grid">
            <Ex cap="Default">
              <Lab id="ds-a">Service area</Lab>
              <Select id="ds-a" labelId="ds-a-l" title="Service area" placeholder="Choose an area" value={a} options={areas} onChange={setA} />
              <Readout id="ds-a">{one(areas, a)}</Readout>
            </Ex>
            <Ex cap="Hover">
              <Lab id="ds-b">Service area, hover state</Lab>
              <Select id="ds-b" labelId="ds-b-l" title="Service area" value={b} options={areas} demo="is-hover" onChange={setB} />
              <Readout id="ds-b">Border darkens to Warm Gray. {one(areas, b)}</Readout>
            </Ex>
            <Ex cap="Focus">
              <Lab id="ds-c">Service area, focus state</Lab>
              <Select id="ds-c" labelId="ds-c-l" title="Service area" value={c} options={areas} demo="is-focus" onChange={setC} />
              <Readout id="ds-c">2px Gold ring with offset. {one(areas, c)}</Readout>
            </Ex>
            <Ex cap="Open" note="Gold border, chevron rotates, panel flips above when there is no room below.">
              <Lab id="ds-d">Service area, open state</Lab>
              <Select id="ds-d" labelId="ds-d-l" title="Service area" value={d} options={areas} onChange={setD} />
              <button className="btn btn-ghost btn-sm" type="button" onClick={showOpen}>Show open state</button>
              <Readout id="ds-d">{one(areas, d)}</Readout>
            </Ex>
            <Ex cap="Selected">
              <Lab id="ds-e">Role</Lab>
              <Select id="ds-e" labelId="ds-e-l" title="Role" value={e} options={ROLE_OPTS} onChange={setE} />
              <Readout id="ds-e">Selected option shows a Gold check. {one(ROLE_OPTS, e)}</Readout>
            </Ex>
            <Ex cap="Disabled">
              <Lab id="ds-f">Service area, disabled</Lab>
              <Select id="ds-f" labelId="ds-f-l" title="Service area" value="dv" options={areas} disabled onChange={() => {}} />
              <p className="small">Ivory fill, Warm Gray text, not-allowed cursor.</p>
            </Ex>
            <Ex cap="Error">
              <Lab id="ds-g">Service area, required</Lab>
              <Select id="ds-g" labelId="ds-g-l" title="Service area" placeholder="Choose an area" value={g} options={areas}
                error={g ? null : 'Choose a service area to continue.'} onChange={setG} />
              <Readout id="ds-g">{g ? one(areas, g) : 'Pick a value to clear the error.'}</Readout>
            </Ex>
          </div>
        </section>

        <section className="card ds-sec" aria-labelledby="ds2">
          <div className="card-head"><div><h2 className="h4" id="ds2">Searchable select (combobox)</h2><p className="small">Long lists: firms, owners, team members. Type to filter; matches are highlighted.</p></div></div>
          <div className="card-body ds-grid">
            <Ex cap="Grouped" note="Group headings use the eyebrow style.">
              <Lab id="ds-h">Owner</Lab>
              <Combobox id="ds-h" labelId="ds-h-l" title="Owner" placeholder="Search staff" value={h} options={owners} onChange={setH} />
              <Readout id="ds-h">{one(owners, h)}</Readout>
            </Ex>
            <Ex cap="No results">
              <Lab id="ds-i">Client firm</Lab>
              <Combobox id="ds-i" labelId="ds-i-l" title="Client firm" placeholder="Search firms" value={i} initialQuery="zzz" options={firms} onChange={setI} />
              <Readout id="ds-i">{i ? one(firms, i) : 'Opens with “zzz” typed to show the no-results state.'}</Readout>
            </Ex>
            <Ex cap="Loading">
              <Lab id="ds-j">Team member</Lab>
              <Combobox id="ds-j" labelId="ds-j-l" title="Team member" placeholder="Search staff" value={j} loadMs={1200} alwaysLoad options={owners} onChange={setJ} />
              <Readout id="ds-j">{j ? one(owners, j) : 'Shows 3 skeleton rows while the list loads.'}</Readout>
            </Ex>
          </div>
        </section>

        <section className="card ds-sec" aria-labelledby="ds3">
          <div className="card-head"><div><h2 className="h4" id="ds3">Multi-select, action menu, status dropdown</h2><p className="small">Filters use multi-select; row actions use the action menu; tables change status with the status dropdown.</p></div></div>
          <div className="card-body ds-grid">
            <Ex cap="Multi-select with overflow">
              <Lab id="ds-k">Services</Lab>
              <MultiSelect id="ds-k" labelId="ds-k-l" title="Services" placeholder="Any service" value={k} options={areas} onChange={setK} />
              <Readout id="ds-k">Chips are removable; extras collapse into “+2”. {many(areas, k)}</Readout>
            </Ex>
            <Ex cap="Multi-select, empty">
              <Lab id="ds-l">Statuses</Lab>
              <MultiSelect id="ds-l" labelId="ds-l-l" title="Statuses" placeholder="All statuses" value={l} options={STATUS_OPTS} onChange={setL} />
              <Readout id="ds-l">Select all and Clear sit at the top of the panel. {many(STATUS_OPTS, l)}</Readout>
            </Ex>
            <Ex cap="Action menu" note="Icons on every item; the destructive item is last, in Ruby, after a divider.">
              <div><ActionMenu id="ds-menu" label="Example row actions" items={menu} style={{ border: '1px solid var(--hairline)' }} /></div>
            </Ex>
            <Ex cap="Status dropdown" note="A badge that opens a status list. Color always comes with an icon and a label.">
              <div className="ds-inline">
                {STATUS_KEYS.map(x => (
                  <StatusDropdown key={x} id={`ds-st-${x}`} size="sm" ariaLabel={`Example status ${STATUS[x]}`} title="Status" value={st[x]}
                    onChange={v => { setSt(p => ({ ...p, [x]: v })); toast(`Example status set to ${STATUS[v]}.`); }} />
                ))}
              </div>
            </Ex>
          </div>
        </section>

        <section className="card ds-sec" aria-labelledby="ds4">
          <div className="card-head"><div><h2 className="h4" id="ds4">Date and time</h2><p className="small">Type a date (11/02/2026, 2026-11-02, Nov 2 2026) or pick one. Arrows move by day, PageUp/PageDown by month, Shift+PageUp/PageDown by year.</p></div></div>
          <div className="card-body ds-grid">
            <Ex cap="Date picker">
              <Lab id="ds-m">Date</Lab>
              <DatePicker id="ds-m" labelId="ds-m-l" title="Date" value={m} onChange={setM} />
              <Readout id="ds-m">Value: {m ? fmtD(m) : 'none'}</Readout>
            </Ex>
            <Ex cap="With min date and deadline markers">
              <Lab id="ds-n">Due date</Lab>
              <DatePicker id="ds-n" labelId="ds-n-l" title="Due date" value={n} min={t0} minReason="Due dates can’t be before today." markers={markers} onChange={setN} />
              <Readout id="ds-n">Past days are disabled with a tooltip. Ruby dot: at-risk deadline. Gold dot: deadline. Value: {n ? fmtD(n) : 'none'}</Readout>
            </Ex>
            <Ex cap="Error">
              <Lab id="ds-o">Date with an error</Lab>
              <DatePicker id="ds-o" labelId="ds-o-l" title="Date" value={o} onChange={setO} />
              <Readout id="ds-o">{o ? `Value: ${fmtD(o)}` : 'Type “13/45/2026” and leave the field to see the inline error.'}</Readout>
            </Ex>
            <Ex cap="Disabled">
              <Lab id="ds-p">Date, disabled</Lab>
              <DatePicker id="ds-p" labelId="ds-p-l" title="Date" value={t0} disabled onChange={() => {}} />
              <p className="small">Read-only dates keep their formatting.</p>
            </Ex>
            <Ex cap="Date range with presets">
              <Lab id="ds-q">Date range</Lab>
              <DateRangePicker id="ds-q" labelId="ds-q-l" title="Date range" placeholder="Any date" value={q} onChange={setQ} />
              <Readout id="ds-q">Hover previews the range before the second click. Apply commits it. Value: {q ? fmtRange(q.start, q.end) : 'none'}</Readout>
            </Ex>
            <Ex cap="Date and time">
              <Lab id="ds-r">Scheduled call</Lab>
              <DateTimePicker id="ds-r" labelId="ds-r-l" title="Scheduled call" value={r} min={t0} onChange={setR} />
              <Readout id="ds-r">15-minute steps. Times in {TZS[tz].name}. Value: {r ? fmtDT(r, tz) : 'none'}</Readout>
            </Ex>
            <Ex cap="Month picker">
              <Lab id="ds-s">Report month</Lab>
              <MonthPicker id="ds-s" labelId="ds-s-l" title="Report month" value={sm} required onChange={setSm} />
              <Readout id="ds-s">12-month grid with year navigation. Value: {sm ? monthLabel(sm) : 'none'}</Readout>
            </Ex>
            <Ex cap="Inline date display" note="Due chips: Overdue (Ruby icon), Due today (Gold), Due in 1–3 days (Parchment), Later (neutral). Always with a text label.">
              <ul className="stack-8" style={{ fontSize: 'var(--fs-14)' }}>
                <li>Date: <b>{fmtD(t0)}</b></li>
                <li>Date and time: <b>{fmtDT(at(0, 15, 30), tz)}</b></li>
                <li>Range: <b>{fmtRange(new Date(t0.getFullYear(), t0.getMonth(), 1), new Date(t0.getFullYear(), t0.getMonth() + 1, 0))}</b></li>
                <li>Relative (hover for full date): <RelTime date={twoHoursAgo} /></li>
                <li className="ds-inline"><DueChip date={addDays(-2)} /><DueChip date={t0} /><DueChip date={addDays(2)} /><DueChip date={addDays(9)} /></li>
              </ul>
            </Ex>
          </div>
        </section>
      </div>
    </>
  );
}
