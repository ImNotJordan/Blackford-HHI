'use client';
/* Portal Account & preferences (legacy accShell + SUBMITS.profile + pref / reset-demo actions). */
import { useState, type FormEvent } from 'react';
import { useApp } from '@/lib/store';
import { EMAIL_RE, digits } from '@/lib/format';
import { Band, Switch, confirmDialog, toast, useBusy } from '@/components/ui';
import type { Session } from '@/lib/store';
import { usePortalUi, resetReports } from './uiStore';
import { TextField } from './common';

type Errs = { name?: string; email?: string; phone?: string };

function Pref({ id, title, desc, checked, onChange }: { id: string; title: string; desc: string; checked: boolean; onChange(v: boolean): void }) {
  return (
    <div className="pref">
      <div><b id={`${id}-l`}>{title}</b><span className="small" id={`${id}-d`} style={{ display: 'block' }}>{desc}</span></div>
      <Switch id={id} checked={checked} onChange={onChange} labelledBy={`${id}-l`} describedBy={`${id}-d`} />
    </div>
  );
}

export function AccountView() {
  const profile = useApp(s => s.profile);
  const prefs = useApp(s => s.prefs);
  const simulateError = useApp(s => s.simulateError);
  const [v, setV] = useState({ name: profile.name, title: profile.title, email: profile.email, phone: profile.phone });
  const [errs, setErrs] = useState<Errs>({});
  const [busy, run] = useBusy();

  const set = (k: keyof typeof v) => (val: string) => {
    setV(p => ({ ...p, [k]: val }));
    if (k in errs && errs[k as keyof Errs] && val.trim()) setErrs(e => ({ ...e, [k]: undefined }));
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const name = v.name.trim(), email = v.email.trim(), phone = v.phone.trim();
    const next: Errs = {
      name: name.length < 2 ? 'Enter your full name.' : undefined,
      email: !EMAIL_RE.test(email) ? 'Enter an email address in the format name@firm.com.' : undefined,
      phone: phone && digits(phone) < 10 ? 'Enter a phone number with at least 10 digits, or leave it blank.' : undefined
    };
    setErrs(next);
    const first = next.name ? 'pf-name' : next.email ? 'pf-email' : next.phone ? 'pf-phone' : null;
    if (first) { document.getElementById(first)?.focus(); return; }
    run(() => {
      useApp.getState().updateProfile({ name, title: v.title.trim() || 'Client team member', email, phone });
      toast('Profile saved.', { icon: 'user' });
    });
  };

  const setPref = (key: keyof Session['prefs'], title: string) => (on: boolean) => {
    useApp.getState().setPref(key, on);
    toast(`${title} turned ${on ? 'on' : 'off'}.`);
  };

  const setSimulate = (on: boolean) => {
    useApp.getState().setSimulateError(on);
    if (on) { resetReports(); usePortalUi.getState().set({ wfError: false }); }
    toast(on ? 'The next Workflows or Reports load will fail once.' : 'Failed-load simulation is off.', { icon: 'alert' });
  };

  const reset = async () => {
    const ok = await confirmDialog({
      title: 'Reset demo data?',
      body: 'Every workflow, deadline, exception and notification returns to its starting state. You can undo this right after.',
      confirmLabel: 'Reset data', danger: true
    });
    if (!ok) return;
    const undo = useApp.getState().resetPortalDemo();
    toast('Demo data reset.', { icon: 'refresh', undo });
  };

  return (
    <>
      <Band eyebrow="Account" title="Account & preferences" sub="Your profile, notification settings and prototype review controls." />
      <div className="wrap pcontent">
        <div className="two-col">
          <section className="card" aria-labelledby="pf-h">
            <div className="card-head"><div><h2 className="h4" id="pf-h">Profile</h2><p className="small">Shown to your Hyacinth team on comments and requests.</p></div></div>
            <form className="card-body" noValidate onSubmit={save}>
              <div className="form-grid">
                <TextField id="pf-name" label="Full name" autoComplete="name" value={v.name} onChange={set('name')} error={errs.name} />
                <TextField id="pf-title" label="Title" optional autoComplete="organization-title" value={v.title} onChange={set('title')} />
                <TextField id="pf-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errs.email} />
                <TextField id="pf-phone" label="Phone" type="tel" optional autoComplete="tel" value={v.phone} onChange={set('phone')} error={errs.phone} />
                <div className="full form-actions">
                  <span className="small">Changes apply across the portal right away.</span>
                  <button className="btn btn-dark" type="submit" id="pf-save" aria-busy={busy || undefined} disabled={busy}>Save profile</button>
                </div>
              </div>
            </form>
          </section>
          <div className="stack-24">
            <section className="card" aria-labelledby="nt-h">
              <div className="card-head"><h2 className="h4" id="nt-h">Notifications</h2></div>
              <div className="pref-list">
                <Pref id="pref-digest" title="Daily digest" desc="A morning summary of deadlines and exceptions." checked={prefs.digest} onChange={setPref('digest', 'Daily digest')} />
                <Pref id="pref-alerts" title="At-risk alerts" desc="Tell me when a workflow or deadline is flagged at risk." checked={prefs.alerts} onChange={setPref('alerts', 'At-risk alerts')} />
                <Pref id="pref-report" title="Monthly report ready" desc="Tell me when the management report is published." checked={prefs.reportReady} onChange={setPref('reportReady', 'Monthly report ready')} />
              </div>
            </section>
            <section className="card" aria-labelledby="pt-h">
              <div className="card-head"><div><h2 className="h4" id="pt-h">Prototype review controls</h2><p className="small">For design review only. Not part of the client product.</p></div></div>
              <div className="pref-list">
                <Pref id="pref-error" title="Simulate a failed load" desc="The next time Workflows or Reports loads, it fails once so you can review the error state." checked={simulateError} onChange={setSimulate} />
                <div className="pref">
                  <div><b id="reset-demo-l">Reset demo data</b><span className="small" id="reset-demo-d" style={{ display: 'block' }}>Restore every workflow, deadline, exception and notification to its starting state.</span></div>
                  <button className="btn btn-ghost btn-sm" type="button" id="reset-demo" aria-describedby="reset-demo-d" onClick={() => { void reset(); }}>Reset</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
