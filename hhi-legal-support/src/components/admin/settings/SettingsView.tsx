'use client';
/* Admin · Settings: organization profile, business hours + time zone, SLA defaults, notification switches, data export. */
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/icons';
import { Band, MultiSelect, Select, Switch, toast, useBusy } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { AREAS, NOTIFY_EVENTS, TIME_OPTS } from '@/lib/data';
import { TZS } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { AreaKey, TzKey } from '@/lib/types';
import { exportData, type ExportKey } from './exportData';
import { FieldErr, TextField, focusLater } from './formKit';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ value: d, label: d }));
const TZ_OPTS = (Object.entries(TZS) as [TzKey, { id: string; name: string }][]).map(([k, v]) => ({ value: k, label: `${v.name} (${k})`, sub: v.id }));
const mins = (v: string) => { const [h, m] = v.split(':').map(Number); return h * 60 + m; };
const tzExample = (k: TzKey) => {
  const d = new Date();
  return `Example: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: TZS[k].id })} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZS[k].id })} ${k}`;
};
const EXPORTS: [ExportKey, string][] = [['clients', 'Client firms'], ['workflows', 'Workflows'], ['leads', 'Leads'], ['audit', 'Audit log']];

export function SettingsView() {
  const ed = useCan('settings');
  return (
    <>
      <Band eyebrow="Governance" title="Settings" sub="Organization details, hours, service levels, notifications and data export." />
      <div className="wrap pcontent">
        {ed ? null : <RoNote feature="settings" />}
        <div className="two-col">
          <div className="stack-24">
            <OrgCard ed={ed} />
            <HoursCard ed={ed} />
            <SlaCard ed={ed} />
          </div>
          <div className="stack-24">
            <NotifyCard ed={ed} />
            <ExportCard />
          </div>
        </div>
      </div>
    </>
  );
}

function OrgCard({ ed }: { ed: boolean }) {
  const org = useApp(s => s.settings.org);
  const [v, setV] = useState(org);
  const [err, setErr] = useState<string | null>(null);
  const [busy, run] = useBusy();
  const set = (k: keyof typeof v) => (x: string) => { setV(p => ({ ...p, [k]: x })); if (k === 'name' && err && x.trim().length >= 2) setErr(null); };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const n = v.name.trim();
    if (n.length < 2) { setErr('Enter the organization name.'); focusLater('so-name'); return; }
    setErr(null);
    run(() => {
      useApp.getState().saveSettings({ org: { name: n, website: v.website.trim(), phone: v.phone.trim(), address: v.address.trim() } }, 'Updated the organization profile');
      toast('Organization profile saved.');
    });
  };
  return (
    <section className="card" aria-labelledby="so-h">
      <div className="card-head"><h2 className="h4" id="so-h">Organization profile</h2></div>
      <form className="card-body" onSubmit={save} noValidate>
        <div className="form-grid">
          <TextField id="so-name" label="Organization name" value={v.name} onChange={set('name')} full error={err} disabled={!ed} />
          <TextField id="so-web" label="Website" value={v.website} onChange={set('website')} disabled={!ed} />
          <TextField id="so-phone" label="Main phone" type="tel" value={v.phone} onChange={set('phone')} disabled={!ed} />
          <TextField id="so-addr" label="Address" value={v.address} onChange={set('address')} full disabled={!ed} />
          {ed ? (
            <div className="full form-actions">
              <span className="small">Shown on invoices and staff emails.</span>
              <button className="btn btn-dark" type="submit" id="so-save" disabled={busy} aria-busy={busy || undefined}>Save profile</button>
            </div>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function HoursCard({ ed }: { ed: boolean }) {
  const S = useApp(s => s.settings);
  const [days, setDays] = useState<string[]>(() => [...S.days]);
  const [open, setOpen] = useState(S.open);
  const [close, setClose] = useState(S.close);
  const [tz, setTz] = useState<TzKey>(S.tz);
  const [daysErr, setDaysErr] = useState<string | null>(null);
  const [closeErr, setCloseErr] = useState<string | null>(null);
  const [busy, run] = useBusy();
  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!days.length) { setDaysErr('Choose at least one working day.'); focusLater('sh-days'); return; }
    if (mins(close) <= mins(open)) { setCloseErr('Closing time must be after opening time.'); focusLater('sh-close'); return; }
    run(() => {
      const prevTz = useApp.getState().settings.tz;
      useApp.getState().saveSettings({ days: [...days], open, close, tz }, `Updated business hours${prevTz !== tz ? ` and time zone to ${tz}` : ''}`);
      toast(prevTz !== tz ? `Saved. Date-times now show in ${TZS[tz].name}.` : 'Business hours saved.');
    });
  };
  return (
    <section className="card" aria-labelledby="sh-h">
      <div className="card-head">
        <div>
          <h2 className="h4" id="sh-h">Business hours and time zone</h2>
          <p className="small">Every date-time in the website, portal and admin follows this time zone.</p>
        </div>
      </div>
      <form className="card-body" onSubmit={save} noValidate>
        <div className="form-grid">
          <div className="field full">
            <span className="label" id="sh-days-l">Working days</span>
            <MultiSelect id="sh-days" labelId="sh-days-l" title="Working days" value={days} maxChips={7} disabled={!ed} options={DAYS} error={daysErr}
              onChange={v => { setDays(v); if (v.length) setDaysErr(null); }} />
          </div>
          <div className="field">
            <span className="label" id="sh-open-l">Opens</span>
            <Select id="sh-open" labelId="sh-open-l" title="Opens" value={open} disabled={!ed} options={TIME_OPTS}
              onChange={v => { setOpen(v); if (mins(close) > mins(v)) setCloseErr(null); }} />
          </div>
          <div className="field">
            <span className="label" id="sh-close-l">Closes</span>
            <Select id="sh-close" labelId="sh-close-l" title="Closes" value={close} disabled={!ed} options={TIME_OPTS} error={closeErr}
              onChange={v => { setClose(v); if (mins(v) > mins(open)) setCloseErr(null); }} />
          </div>
          <div className="field full">
            <span className="label" id="sh-tz-l">Time zone</span>
            <Select id="sh-tz" labelId="sh-tz-l" title="Time zone" value={tz} disabled={!ed} options={TZ_OPTS} hintId="tz-preview" onChange={v => setTz(v as TzKey)} />
            <p className="hint" id="tz-preview" aria-live="polite">{tzExample(tz)}</p>
          </div>
          {ed ? (
            <div className="full form-actions">
              <span className="small">Saving applies everywhere right away.</span>
              <button className="btn btn-dark" type="submit" id="sh-save" disabled={busy} aria-busy={busy || undefined}>Save hours</button>
            </div>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function SlaCard({ ed }: { ed: boolean }) {
  const sla = useApp(s => s.settings.sla);
  const keys = Object.keys(AREAS) as AreaKey[];
  const [v, setV] = useState<Record<AreaKey, string>>(() => Object.fromEntries(keys.map(k => [k, String(sla[k])])) as Record<AreaKey, string>);
  const [errs, setErrs] = useState<Partial<Record<AreaKey, string>>>({});
  const [busy, run] = useBusy();
  const ok = (x: string) => { const n = Number(x); return x.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= 30; };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<AreaKey, string>> = {};
    keys.forEach(k => { if (!ok(v[k])) next[k] = 'Enter 1 to 30 days.'; });
    setErrs(next);
    const bad = keys.find(k => next[k]);
    if (bad) { focusLater(`sla-${bad}`); return; }
    run(() => {
      useApp.getState().saveSettings({ sla: Object.fromEntries(keys.map(k => [k, Number(v[k])])) as Record<AreaKey, number> }, 'Updated SLA defaults');
      toast('SLA defaults saved. New workflows use them for their default due date.');
    });
  };
  return (
    <section className="card" aria-labelledby="ss-h">
      <div className="card-head">
        <div>
          <h2 className="h4" id="ss-h">SLA defaults by service area</h2>
          <p className="small">New workflows get a due date this many days out unless someone sets one.</p>
        </div>
      </div>
      <form className="card-body stack-16" onSubmit={save} noValidate>
        <div className="sla-grid">
          {keys.map(k => (
            <div className="field" key={k}>
              <label className="label" htmlFor={`sla-${k}`}>{AREAS[k]}</label>
              <input
                className="input num-input" id={`sla-${k}`} type="number" inputMode="numeric" min={1} max={30} value={v[k]} disabled={!ed}
                aria-describedby={`sla-${k}-err`} aria-invalid={errs[k] ? true : undefined}
                onChange={e => { const x = e.target.value; setV(p => ({ ...p, [k]: x })); if (errs[k] && ok(x)) setErrs(p => ({ ...p, [k]: undefined })); }}
              />
              <FieldErr id={`sla-${k}`} msg={errs[k]} />
            </div>
          ))}
        </div>
        {ed ? (
          <div className="form-actions">
            <span className="small">Days, 1 to 30.</span>
            <button className="btn btn-dark" type="submit" id="ss-save" disabled={busy} aria-busy={busy || undefined}>Save SLA defaults</button>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function NotifyCard({ ed }: { ed: boolean }) {
  const notify = useApp(s => s.settings.notify);
  const flip = (k: string, label: string, ch: 'email' | 'app', on: boolean) => {
    useApp.getState().setNotify(k, ch, on);
    toast(`${ch === 'email' ? 'Email' : 'In-app'} notifications for “${label}” ${on ? 'on' : 'off'}. Saved.`);
  };
  return (
    <section className="card" aria-labelledby="sn-h">
      <div className="card-head">
        <div>
          <h2 className="h4" id="sn-h">Notification preferences</h2>
          <p className="small">Each switch saves as you change it.</p>
        </div>
      </div>
      <div className="table-wrap" style={{ borderTop: 0 }}>
        <table className="notify-table">
          <thead><tr><th scope="col">Event</th><th scope="col" className="c">Email</th><th scope="col" className="c">In-app</th></tr></thead>
          <tbody>
            {NOTIFY_EVENTS.map(([k, l]) => (
              <tr key={k}>
                <th scope="row" style={{ fontWeight: 500 }} id={`nt-${k}`}>{l}</th>
                {(['email', 'app'] as const).map(ch => (
                  <td className="c" key={ch}>
                    <Switch id={`nt-${k}-${ch}`} checked={!!notify[k]?.[ch]} disabled={!ed}
                      ariaLabel={`${l}, ${ch === 'email' ? 'email' : 'in-app'}`} onChange={on => flip(k, l, ch, on)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ExportCard() {
  const canExport = useCan('export');
  return (
    <section className="card" aria-labelledby="se-h">
      <div className="card-head">
        <div>
          <h2 className="h4" id="se-h">Data export</h2>
          <p className="small">CSV files of the shared demo data.</p>
        </div>
      </div>
      <div className="card-body stack-8">
        {canExport ? EXPORTS.map(([k, l]) => <ExportButton key={k} k={k} label={l} />) : <RoNote feature="export" />}
      </div>
    </section>
  );
}

function ExportButton({ k, label }: { k: ExportKey; label: string }) {
  const [busy, run] = useBusy();
  return (
    <button className="btn btn-ghost btn-block" type="button" id={`ex-${k}`} style={{ justifyContent: 'space-between' }}
      disabled={busy} aria-busy={busy || undefined} onClick={() => run(() => exportData(k))}>
      {label}<Icon name="export" size={18} />
    </button>
  );
}
