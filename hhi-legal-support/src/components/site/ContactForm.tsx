'use client';
/* Website contact form: inline + summary validation, 700ms submit, success card with the submitted details.
   A successful submit creates a lead in admin in real time. */
import { useState, type FormEvent } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Icon } from '@/components/icons';
import { Select, toast, useBusy } from '@/components/ui';
import { AREA_OPTS } from '@/lib/data';
import { EMAIL_RE, digits } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { ContactValues } from '@/lib/types';
import { SiteLink } from './SiteLink';
import { focusEl, reduced } from './nav';
import { useSite } from './siteStore';

type FieldKey = 'name' | 'email' | 'phone';
interface FieldErr { key: FieldKey; id: string; label: string; m: string }
const AREA_OPTIONS = AREA_OPTS.map(a => ({ value: a, label: a }));

function validate(v: ContactValues): FieldErr[] {
  const name = v.name.trim(), email = v.email.trim(), phone = v.phone.trim();
  const e1 = name.length < 2 ? 'Enter the name of the person we should contact.' : '';
  const e2 = !email ? 'Enter a work email address.' : !EMAIL_RE.test(email) ? 'Enter an email address in the format name@firm.com.' : '';
  const e3 = !phone ? 'Enter a phone number.' : (digits(phone) < 10 || digits(phone) > 15) ? 'Enter a phone number with at least 10 digits, for example (312) 555-0100.' : '';
  const all: FieldErr[] = [
    { key: 'name', id: 'c-name', label: 'Representative name', m: e1 },
    { key: 'email', id: 'c-email', label: 'Work email', m: e2 },
    { key: 'phone', id: 'c-phone', label: 'Phone', m: e3 }
  ];
  return all.filter(e => e.m);
}

function Field({ id, label, opt, type = 'text', auto, inputMode, placeholder, value, error, onChange, onBlur }: {
  id: string; label: string; opt?: boolean; type?: string; auto?: string; inputMode?: 'tel'; placeholder: string;
  value: string; error?: string; onChange(v: string): void; onBlur?(): void;
}) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>{label}{opt && <> <span className="opt">(optional)</span></>}</label>
      <input className="input" id={id} name={id} type={type} autoComplete={auto} inputMode={inputMode} aria-required={opt ? undefined : true}
        aria-invalid={error ? true : undefined} aria-describedby={`${id}-err`} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} onBlur={onBlur} />
      <p className="err" id={`${id}-err`} hidden={!error}>{error && <><Icon name="alert" size={16} /><span>{error}</span></>}</p>
    </div>
  );
}

export function ContactForm() {
  const { values, sent, submitted, attempted, setValue, setAttempted, submit, edit, reset } = useSite(useShallow(s => ({
    values: s.values, sent: s.sent, submitted: s.submitted, attempted: s.attempted,
    setValue: s.setValue, setAttempted: s.setAttempted, submit: s.submit, edit: s.edit, reset: s.reset
  })));
  /* Errors shown inline; the summary lists the current shown errors. */
  const [shown, setShown] = useState<Partial<Record<FieldKey, string>>>({});
  const [summary, setSummary] = useState<FieldErr[]>([]);
  const [busy, run] = useBusy();

  const change = (k: keyof ContactValues, v: string) => {
    setValue(k, v);
    if (!attempted || (k !== 'name' && k !== 'email' && k !== 'phone')) return;
    const ok = !validate({ ...values, [k]: v }).some(e => e.key === k);
    if (ok && shown[k]) setShown(s => ({ ...s, [k]: '' }));
  };
  const blur = (k: FieldKey) => {
    if (!attempted) return;
    const errs = validate(values);
    setShown(s => ({ ...s, [k]: errs.find(e => e.key === k)?.m || '' }));
    setSummary(errs);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setAttempted();
    const errs = validate(values);
    setShown(Object.fromEntries((['name', 'email', 'phone'] as FieldKey[]).map(k => [k, errs.find(x => x.key === k)?.m || ''])));
    setSummary(errs);
    if (errs.length) { requestAnimationFrame(() => focusEl(document.getElementById('cf-summary'))); return; }
    run(() => {
      const v: ContactValues = {
        name: values.name.trim(), firm: values.firm.trim(), email: values.email.trim(), phone: values.phone.trim(),
        area: useSite.getState().values.area || '', msg: values.msg.trim()
      };
      useApp.getState().addLeadFromWebsite(v);
      submit(v);
      requestAnimationFrame(() => focusEl(document.getElementById('cf-success')));
    }, reduced() ? 250 : 700);
  };

  const focusField = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: reduced() ? 'instant' : 'smooth' });
    el.focus({ preventScroll: true });
  };

  const onEdit = () => {
    edit();
    requestAnimationFrame(() => focusEl(document.getElementById('c-name')));
  };
  const onNew = () => {
    reset();
    setShown({});
    setSummary([]);
    requestAnimationFrame(() => focusEl(document.getElementById('c-name')));
    toast('Ready for a new request.');
  };

  if (submitted && sent) {
    const rows: [string, string][] = [
      ['Representative', sent.name], ['Firm', sent.firm || 'Not provided'], ['Work email', sent.email], ['Phone', sent.phone],
      ['Area', sent.area || 'Not specified'], ['Bottleneck', sent.msg || 'Not provided']
    ];
    return (
      <div className="success" id="cf-success" tabIndex={-1} role="status">
        <span className="success-mark"><Icon name="check" size={28} /></span>
        <h3 className="h3">Thanks, {sent.name.split(' ')[0]}. Your request is in.</h3>
        <p>A Hyacinth representative will follow up using the details below.</p>
        <dl className="summary-list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={onEdit}>Edit details</button>
          <button className="btn btn-dark" type="button" onClick={onNew}>Start a new request</button>
        </div>
      </div>
    );
  }

  return (
    <form id="contact-form" noValidate aria-labelledby="cf-title" onSubmit={onSubmit}>
      <div className="stack-24">
        <div className="stack-8"><h3 className="h3" id="cf-title">Request a conversation</h3><p className="small">Fields are required unless marked optional.</p></div>
        <div id="cf-summary" className="error-summary" tabIndex={-1} role="alert" hidden={!summary.length}>
          {summary.length > 0 && <>
            <h3><Icon name="alert" size={18} />Fix {summary.length === 1 ? 'this field' : `these ${summary.length} fields`} to continue</h3>
            <ul>{summary.map(e => (
              <li key={e.id}><button type="button" className="text-btn" onClick={() => focusField(e.id)}>{e.label}: {e.m}</button></li>
            ))}</ul>
          </>}
        </div>
        <div className="form-grid">
          <Field id="c-name" label="Representative name" auto="name" placeholder="Full name" value={values.name} error={shown.name}
            onChange={v => change('name', v)} onBlur={() => blur('name')} />
          <Field id="c-firm" label="Firm name" opt auto="organization" placeholder="Your firm" value={values.firm} onChange={v => change('firm', v)} />
          <Field id="c-email" label="Work email" type="email" auto="email" placeholder="name@firm.com" value={values.email} error={shown.email}
            onChange={v => change('email', v)} onBlur={() => blur('email')} />
          <Field id="c-phone" label="Phone" type="tel" auto="tel" inputMode="tel" placeholder="(312) 555-0100" value={values.phone} error={shown.phone}
            onChange={v => change('phone', v)} onBlur={() => blur('phone')} />
          <div className="field full">
            <span className="label" id="c-area-l">Where do you need capacity? <span className="opt">(optional)</span></span>
            <Select id="c-area" labelId="c-area-l" title="Area of focus" placeholder="Choose an area" value={values.area}
              options={AREA_OPTIONS} onChange={v => setValue('area', v)} />
          </div>
          <div className="field full">
            <label className="label" htmlFor="c-msg">What is the bottleneck? <span className="opt">(optional)</span></label>
            <textarea className="textarea" id="c-msg" name="c-msg" value={values.msg} onChange={e => change('msg', e.target.value)}
              placeholder="For example: records requests are taking paralegal time away from trial prep." />
          </div>
        </div>
        <div className="form-actions">
          <p className="small" style={{ maxWidth: '36ch' }}>We use these details only to respond to your request. Read the <SiteLink href="/privacy">privacy notice</SiteLink>.</p>
          <button className="btn btn-primary" type="submit" id="c-submit" aria-busy={busy || undefined} disabled={busy}>
            Request a conversation <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}
