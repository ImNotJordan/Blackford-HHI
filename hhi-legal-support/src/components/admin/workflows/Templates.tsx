'use client';
/* Workflow templates: card grid + editor (name, area, default SLA, ordered steps with automated switch). */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { Modal, Select, Switch, announce, toast, useBusy } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { ErrText, Field } from '@/components/admin/shell/kit';
import { AREAS } from '@/lib/data';
import { allOpen, areaOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { AreaKey } from '@/lib/types';

const AREA_OPTS = areaOptions();
let stepKey = 0;

/** Template cards; `onEdit` opens the editor (or the read-only step list). */
export function TemplatesGrid({ onEdit }: { onEdit(id: string): void }) {
  const s = useApp();
  const ed = useCan('templates');
  const open = allOpen(s);
  return (
    <>
      {!ed && <div style={{ padding: '16px 24px 0' }}><RoNote feature="templates" /></div>}
      <div className="tpl-grid">
        {s.templates.map(t => {
          const used = open.filter(w => w.type === t.id).length, auto = t.steps.filter(x => x.auto).length;
          return (
            <article className="tpl-card" key={t.id} aria-labelledby={`tplh-${t.id}`}>
              <h3 className="h4" id={`tplh-${t.id}`}>{t.name}</h3>
              <div className="chips-inline"><span className="mini-chip">{AREAS[t.area]}</span><span className="mini-chip">{t.sla}-day default SLA</span></div>
              <p className="small">{t.steps.length} steps · {auto} automated · used by {used} open {used === 1 ? 'workflow' : 'workflows'}</p>
              <div>
                <button className={`btn ${ed ? 'btn-dark' : 'btn-ghost'} btn-sm`} type="button" id={`tple-${t.id}`} onClick={() => onEdit(t.id)}>
                  {ed ? 'Edit template' : 'View steps'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

interface DraftStep { key: number; title: string; auto: boolean }

/** `editing` is a template id, 'new' for a new template, or null when the editor is closed. */
export function TemplateEditor({ editing, onClose }: { editing: string | null; onClose(): void }) {
  if (!editing) return null;
  return <EditorInner key={editing} id={editing === 'new' ? null : editing} onClose={onClose} />;
}

function EditorInner({ id, onClose }: { id: string | null; onClose(): void }) {
  const ed = useCan('templates');
  const mk = (title: string, auto: boolean): DraftStep => ({ key: stepKey++, title, auto });
  const [init] = useState(() => {
    const st = useApp.getState(), t = id ? st.templates.find(x => x.id === id) : undefined;
    return t
      ? { name: t.name, area: t.area, sla: String(t.sla), steps: t.steps.map(x => mk(x.title, x.auto)) }
      : { name: '', area: 'lo' as AreaKey, sla: String(st.settings.sla.lo), steps: [mk('', false), mk('', true)] };
  });
  const [name, setName] = useState(init.name);
  const [area, setArea] = useState<AreaKey>(init.area);
  const [sla, setSla] = useState(init.sla);
  const [steps, setSteps] = useState<DraftStep[]>(init.steps);
  const [errs, setErrs] = useState<{ name?: string; sla?: string; steps?: string }>({});
  const [busy, run] = useBusy();

  /* Focus to move after the step list re-renders (move, add, remove, toggle). */
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    const sel = pendingFocus.current;
    if (!sel) return;
    pendingFocus.current = null;
    const el = document.getElementById(sel) as HTMLButtonElement | null;
    if (el && !el.disabled) el.focus();
    else document.getElementById(sel.replace(/^tp[ud]/, m => (m === 'tpu' ? 'tpd' : 'tpu')))?.focus();
  }, [steps]);

  const setStep = (i: number, patch: Partial<DraftStep>) => setSteps(arr => arr.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: -1 | 1) => {
    setSteps(arr => { const a = [...arr]; [a[i], a[i + d]] = [a[i + d], a[i]]; return a; });
    pendingFocus.current = `${d < 0 ? 'tpu' : 'tpd'}-${i + d}`;
  };
  const remove = (i: number) => { setSteps(arr => arr.filter((_, j) => j !== i)); pendingFocus.current = 'tpl-add'; announce('Step removed'); };
  const add = () => { pendingFocus.current = `tps-${steps.length}`; setSteps(arr => [...arr, mk('', false)]); };

  const submit = () => {
    if (busy || !ed) return;
    const n = +sla, nm = name.trim();
    const blank = steps.findIndex(x => !x.title.trim());
    const e = {
      name: nm.length < 3 ? 'Give the template a name of at least 3 characters.' : '',
      sla: n >= 1 && n <= 60 && Number.isInteger(n) ? '' : 'Enter a number of days from 1 to 60.',
      steps: blank >= 0 ? `Describe step ${blank + 1}, or remove it.` : ''
    };
    setErrs(e);
    if (e.name) { document.getElementById('tpl-name')?.focus(); return; }
    if (e.sla) { document.getElementById('tpl-sla')?.focus(); return; }
    if (blank >= 0) { document.getElementById(`tps-${blank}`)?.focus(); return; }
    run(() => {
      useApp.getState().saveTemplate({ id, name: nm, area, sla: n, steps: steps.map(x => ({ title: x.title.trim(), auto: x.auto, review: /review|sign-off/i.test(x.title) })) });
      onClose();
      toast(`${nm} template ${id ? 'saved' : 'created'}. It’s available in New workflow.`);
    });
  };

  return (
    <Modal
      open onClose={onClose} onSubmit={ed ? submit : undefined} initialFocus="#tpl-name"
      title={id ? (ed ? 'Edit template' : 'Template steps') : 'New workflow template'}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={onClose}>{ed ? 'Cancel' : 'Close'}</button>
        {ed && <button className="btn btn-primary" type="submit" id="tpl-save" aria-busy={busy || undefined} disabled={busy}>{id ? 'Save template' : 'Create template'}</button>}
      </>}
    >
      <div className="form-grid">
        <Field id="tpl-name" label="Template name" full value={name} disabled={!ed} error={errs.name}
          onChange={v => { setName(v); if (errs.name && v.trim()) setErrs(x => ({ ...x, name: '' })); }} />
        <div className="field">
          <span className="label" id="tpl-area-l">Service area</span>
          <Select id="tpl-area" labelId="tpl-area-l" title="Service area" value={area} options={AREA_OPTS} disabled={!ed} onChange={v => setArea(v as AreaKey)} />
        </div>
        <div className="field">
          <label className="label" htmlFor="tpl-sla">Default SLA (days)</label>
          <input
            className="input num-input" id="tpl-sla" type="number" min={1} max={60} inputMode="numeric" value={sla} disabled={!ed}
            aria-describedby="tpl-sla-err" aria-invalid={errs.sla ? true : undefined}
            onChange={e => { setSla(e.target.value); if (errs.sla && e.target.value.trim()) setErrs(x => ({ ...x, sla: '' })); }}
          />
          <ErrText id="tpl-sla" msg={errs.sla} />
        </div>
      </div>
      <div className="stack-8">
        <p className="label">Steps, in order</p>
        <ol className="tpl-steps" aria-label="Template steps">
          {steps.map((x, i) => (
            <li className={`tpl-step${x.auto ? ' auto' : ''}`} key={x.key}>
              <span className="n" aria-hidden="true">{i + 1}</span>
              <div className="field" style={{ gap: 4 }}>
                <label className="sr-only" htmlFor={`tps-${i}`}>Step {i + 1}</label>
                <input
                  className="input" id={`tps-${i}`} value={x.title} placeholder="Describe the step" disabled={!ed}
                  aria-describedby={errs.steps ? 'tpl-steps-err' : undefined}
                  onChange={e => { setStep(i, { title: e.target.value }); if (errs.steps) setErrs(y => ({ ...y, steps: '' })); }}
                />
                <span className="small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Switch id={`tpa-${i}`} checked={x.auto} disabled={!ed} ariaLabel={`Step ${i + 1} is automated`} onChange={v => setStep(i, { auto: v })} />
                  {x.auto ? 'Automated (runs without staff time)' : 'Manual'}
                </span>
              </div>
              <span className="acts">
                {ed && <>
                  <button className="icon-btn" type="button" id={`tpu-${i}`} aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    <Icon name="chevron-left" size={16} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                  <button className="icon-btn" type="button" id={`tpd-${i}`} aria-label={`Move step ${i + 1} down`} disabled={i === steps.length - 1} onClick={() => move(i, 1)}>
                    <Icon name="chevron-right" size={16} style={{ transform: 'rotate(90deg)' }} />
                  </button>
                  <button className="icon-btn" type="button" id={`tpr-${i}`} aria-label={`Remove step ${i + 1}`} disabled={steps.length < 2} onClick={() => remove(i)}>
                    <Icon name="x" size={16} />
                  </button>
                </>}
              </span>
            </li>
          ))}
        </ol>
        {ed && <div><button className="btn btn-ghost btn-sm" type="button" id="tpl-add" onClick={add}><Icon name="plus" size={16} />Add step</button></div>}
        <ErrText id="tpl-steps" msg={errs.steps} />
      </div>
    </Modal>
  );
}
