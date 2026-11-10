'use client';
/* Four-step client firm wizard (Firm details → Services → Team → Review).
   Used to add a firm, edit a firm (opens on any step) and convert a won lead (prefill + leadId). */
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { Combobox, DatePicker, Modal, MultiSelect, Select, toast, useBusy } from '@/components/ui';
import { viewAsClient } from '@/components/admin/clients/firmActions';
import { Field } from '@/components/admin/shell/kit';
import { AREAS, FIRM_STATUSES, FS_ICON } from '@/lib/data';
import { EMAIL_RE, fmtD, today } from '@/lib/format';
import { areaOptions, staffOptions } from '@/lib/selectors';
import { useApp, type FirmInput } from '@/lib/store';
import type { AreaKey, FirmStatus } from '@/lib/types';

export interface FirmWizardProps {
  open: boolean;
  onClose(): void;
  mode: 'create' | 'edit';
  /** required in edit mode */
  firmId?: string;
  /** 1–4, default 1 */
  startStep?: number;
  /** prefill for create mode (e.g. converting a lead); leadId links the lead to the new firm */
  prefill?: Partial<FirmInput> & { leadId?: string };
  /** called with the firm id after create/save */
  onDone?(id: string): void;
}

interface Draft {
  name: string; city: string; status: FirmStatus; cname: string; cemail: string; cphone: string;
  services: AreaKey[]; since: Date | null; lead: string; team: string[];
}
type Errs = Partial<Record<'name' | 'cname' | 'cemail' | 'services' | 'since' | 'lead', string>>;

const STEPS = ['Firm details', 'Services', 'Team', 'Review'];
const FOCUS = ['wz-name', 'wz-services', 'wz-lead', 'wz-next'];
const STATUS_OPTS = FIRM_STATUSES.map(s => ({ value: s, label: s, icon: FS_ICON[s] }));
const AREA_OPTS = areaOptions();

export function FirmWizard(props: FirmWizardProps) {
  if (!props.open) return null;
  return <WizardInner {...props} />;
}

function WizardInner({ onClose, mode, firmId, startStep, prefill, onDone }: FirmWizardProps) {
  const router = useRouter();
  const s = useApp();
  const firm = mode === 'edit' && firmId ? s.firms.find(f => f.id === firmId) : undefined;

  const [d, setD] = useState<Draft>(() => {
    if (firm) {
      return {
        name: firm.name, city: firm.city, status: firm.status, cname: firm.contact.name, cemail: firm.contact.email, cphone: firm.contact.phone || '',
        services: [...firm.services], since: firm.since, lead: firm.lead, team: firm.team.filter(k => k !== firm.lead)
      };
    }
    const p = prefill || {};
    return {
      name: p.name || '', city: p.city || '', status: p.status || 'Onboarding', cname: p.contact?.name || '', cemail: p.contact?.email || '',
      cphone: p.contact?.phone || '', services: p.services ? [...p.services] : [], since: p.since || today(), lead: p.lead || '',
      team: (p.team || []).filter(k => k !== p.lead)
    };
  });
  const [step, setStep] = useState(() => Math.min(4, Math.max(1, startStep || 1)));
  /* Pinned to the opening step: the modal re-runs its open effect when initialFocus changes. */
  const [openFocus] = useState(() => `#${FOCUS[step - 1]}`);
  const [errs, setErrs] = useState<Errs>({});
  const [dateValid, setDateValid] = useState(true);
  const [busy, run] = useBusy();
  const staffOpts = useMemo(() => staffOptions(s), [s]);

  /* Move focus to the first field of each step after Next/Back (the modal handles the first open). */
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) { firstStep.current = false; return; }
    const id = requestAnimationFrame(() => document.getElementById(FOCUS[step - 1])?.focus());
    return () => cancelAnimationFrame(id);
  }, [step]);

  if (mode === 'edit' && !firm) return null;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD(x => ({ ...x, [k]: v }));
  const clearErr = (k: keyof Errs, v: unknown) => { if (errs[k] && (Array.isArray(v) ? v.length : v)) setErrs(x => ({ ...x, [k]: '' })); };
  const focus = (id: string) => document.getElementById(id)?.focus();

  const validate = () => {
    if (step === 1) {
      const name = d.name.trim(), cname = d.cname.trim(), cemail = d.cemail.trim();
      const e1 = name.length < 2 ? 'Enter the firm name.' : s.firms.some(f => f.name.toLowerCase() === name.toLowerCase() && f.id !== firm?.id) ? 'A firm with this name already exists.' : '';
      const e2 = cname.length < 2 ? 'Enter the primary contact’s name.' : '';
      const e3 = !EMAIL_RE.test(cemail) ? 'Enter an email address in the format name@firm.com.' : '';
      setErrs({ name: e1, cname: e2, cemail: e3 });
      const first = ([['wz-name', e1], ['wz-cname', e2], ['wz-cemail', e3]] as const).find(x => x[1]);
      if (first) { focus(first[0]); return false; }
    }
    if (step === 2) {
      if (!dateValid) { focus('wz-since'); return false; }
      if (!d.services.length) { setErrs({ services: 'Choose at least one service.' }); focus('wz-services'); return false; }
      if (!d.since) { setErrs({ since: 'Choose a start date.' }); focus('wz-since'); return false; }
    }
    if (step === 3 && !d.lead) { setErrs({ lead: 'Choose a team lead.' }); focus('wz-lead'); return false; }
    setErrs({});
    return true;
  };

  const input = (): FirmInput => ({
    name: d.name.trim(), city: d.city.trim(), status: d.status, services: d.services, since: d.since || today(), lead: d.lead,
    team: d.team.filter(k => k !== d.lead),
    contact: { name: d.cname.trim(), email: d.cemail.trim(), phone: d.cphone.trim(), title: firm?.contact.title }
  });

  const submit = () => {
    if (busy || !validate()) return;
    if (step < 4) { setStep(step + 1); return; }
    run(() => {
      const st = useApp.getState(), data = input();
      if (firm) {
        st.updateFirm(firm.id, data);
        onClose();
        toast(`${data.name} saved.`);
        onDone?.(firm.id);
        return;
      }
      if (!data.contact.title) delete data.contact.title;
      const id = st.createFirm(data, prefill?.leadId);
      onClose();
      toast(`${data.name} added.`, { icon: 'plus', action: { label: 'View as client', onClick: () => viewAsClient(id, router) } });
      onDone?.(id);
    }, 700);
  };

  const last = step === 4;
  const title = mode === 'edit' ? `Edit ${d.name || 'firm'}` : prefill?.leadId ? 'Convert lead to client firm' : 'Add client firm';
  const teamName = (k: string) => s.team[k]?.name || k;

  return (
    <Modal
      open onClose={onClose} onSubmit={submit} title={title} initialFocus={openFocus}
      footer={<>
        {step > 1
          ? <button className="btn btn-quiet" type="button" id="wz-back" onClick={() => { setErrs({}); setStep(step - 1); }}>Back</button>
          : <button className="btn btn-quiet" type="button" onClick={onClose}>Cancel</button>}
        <button className={`btn ${last ? 'btn-primary' : 'btn-dark'}`} type="submit" id="wz-next" aria-busy={busy || undefined} disabled={busy}>
          {last ? (mode === 'edit' ? 'Save changes' : 'Create client firm') : <>Next<Icon name="arrow-right" size={18} /></>}
        </button>
      </>}
    >
      <ol className="steps-ind" aria-label="Steps">
        {STEPS.map((label, i) => {
          const n = i + 1, on = n === step, done = n < step;
          return (
            <li key={label} className={`si${on ? ' is-on' : done ? ' is-done' : ''}`} aria-current={on ? 'step' : undefined}>
              <b>{done ? <Icon name="check" size={12} /> : n}</b>{label}
            </li>
          );
        })}
      </ol>
      <p className="sr-only" aria-live="polite">Step {step} of 4: {STEPS[step - 1]}</p>

      {step === 1 && (
        <div className="form-grid">
          <Field id="wz-name" label="Firm name" full autoComplete="organization" value={d.name} error={errs.name} onChange={v => { set('name', v); clearErr('name', v.trim()); }} />
          <Field id="wz-city" label="City" opt value={d.city} onChange={v => set('city', v)} />
          <div className="field">
            <span className="label" id="wz-status-l">Status</span>
            <Select id="wz-status" labelId="wz-status-l" title="Status" value={d.status} options={STATUS_OPTS} onChange={v => set('status', v as FirmStatus)} />
          </div>
          <Field id="wz-cname" label="Primary contact name" value={d.cname} error={errs.cname} onChange={v => { set('cname', v); clearErr('cname', v.trim()); }} />
          <Field id="wz-cemail" label="Primary contact email" type="email" value={d.cemail} error={errs.cemail} onChange={v => { set('cemail', v); clearErr('cemail', v.trim()); }} />
          <Field id="wz-cphone" label="Phone" type="tel" opt value={d.cphone} onChange={v => set('cphone', v)} />
        </div>
      )}
      {step === 2 && (
        <>
          <div className="field">
            <span className="label" id="wz-svc-l">Services enabled</span>
            <MultiSelect
              id="wz-services" labelId="wz-svc-l" title="Services" placeholder="Choose at least one service" value={d.services} maxChips={3}
              options={AREA_OPTS} error={errs.services || null} onChange={v => { set('services', v as AreaKey[]); clearErr('services', v); }}
            />
          </div>
          <div className="field">
            <span className="label" id="wz-since-l">Service start date</span>
            <DatePicker
              id="wz-since" labelId="wz-since-l" title="Service start date" value={d.since} required error={errs.since || null}
              onChange={v => { set('since', v); clearErr('since', v); }} onValidityChange={setDateValid}
            />
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className="field">
            <span className="label" id="wz-lead-l">Team lead</span>
            <Combobox
              id="wz-lead" labelId="wz-lead-l" title="Team lead" placeholder="Search staff" value={d.lead} options={staffOpts}
              error={errs.lead || null} onChange={v => { set('lead', v); clearErr('lead', v); }}
            />
          </div>
          <div className="field">
            <span className="label" id="wz-team-l">Team members <span className="opt">(optional)</span></span>
            <MultiSelect id="wz-team" labelId="wz-team-l" title="Team members" placeholder="Add team members" value={d.team} searchable options={staffOpts} onChange={v => set('team', v)} />
          </div>
        </>
      )}
      {step === 4 && (
        <dl className="dl-list">
          {([
            ['Firm', d.name],
            ['City', d.city || 'Not set'],
            ['Status', d.status],
            ['Primary contact', `${d.cname} · ${d.cemail}${d.cphone ? ` · ${d.cphone}` : ''}`],
            ['Services', d.services.map(k => AREAS[k]).join(', ')],
            ['Start date', fmtD(d.since)],
            ['Team lead', teamName(d.lead)],
            ['Team', d.team.filter(k => k !== d.lead).map(teamName).join(', ') || 'Lead only']
          ] as const).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      )}
    </Modal>
  );
}
