'use client';
/* "Request a new workflow" modal (legacy openNewWf + SUBMITS['new-wf']). */
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { AREAS } from '@/lib/data';
import { pFirm, areaOptions, staffOptions, deadlineMarkers } from '@/lib/selectors';
import { addDays, today } from '@/lib/format';
import { Icon } from '@/components/icons';
import { Modal, Select, Combobox, DatePicker, toast, useBusy } from '@/components/ui';
import type { AreaKey } from '@/lib/types';
import type { AppState } from '@/lib/store';
import { usePortalUi, openWf } from './uiStore';
import { TextField } from './common';
import { filterWorkflows } from './wfFilter';

const firstTemplate = (s: AppState, area: string) => (s.templates.find(t => t.area === area) || s.templates[0])?.id || '';

function defaults(s: AppState) {
  const F = pFirm(s);
  const area = (F.services[0] || 'lo') as AreaKey;
  return { title: '', matter: '', area: area as string, type: firstTemplate(s, area), owner: F.lead, due: addDays(s.settings.sla[area] ?? 5) as Date | null };
}

export function NewWorkflowModal() {
  const open = usePortalUi(s => s.newWfOpen);
  const s = useApp();
  const pathname = usePathname();
  const F = pFirm(s);

  const [v, setV] = useState(() => defaults(s));
  const [dueTouched, setDueTouched] = useState(false);
  const [dueValid, setDueValid] = useState(true);
  const [errs, setErrs] = useState<{ title?: string; matter?: string; due?: string }>({});
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) { setV(defaults(s)); setDueTouched(false); setDueValid(true); setErrs({}); }
  }
  const [busy, run] = useBusy();
  const close = () => usePortalUi.getState().set({ newWfOpen: false });

  const setField = (k: 'title' | 'matter', val: string) => {
    setV(p => ({ ...p, [k]: val }));
    if (errs[k] && val.trim()) setErrs(e => ({ ...e, [k]: undefined }));
  };
  const onArea = (area: string) => {
    setV(p => ({
      ...p, area,
      type: s.templates.find(t => t.area === area)?.id || p.type,
      due: dueTouched ? p.due : addDays(s.settings.sla[area as AreaKey] ?? 5)
    }));
  };

  const submit = () => {
    const title = v.title.trim(), matter = v.matter.trim();
    const e = {
      title: title.length < 3 ? 'Give the workflow a name of at least 3 characters.' : undefined,
      matter: !matter ? 'Enter the matter, or “Firmwide” if it is not tied to one.' : undefined,
      due: !v.due ? 'Choose a due date.' : !dueValid ? 'Enter a valid date that is today or later.' : undefined
    };
    setErrs(e);
    const first = e.title ? 'nw-title' : e.matter ? 'nw-matter' : e.due ? 'nw-due' : null;
    if (first) { document.getElementById(first)?.focus(); return; }
    run(() => {
      const st = useApp.getState();
      const id = st.createWorkflow({ title, matter, area: v.area as AreaKey, type: v.type, owner: v.owner || pFirm(st).lead, due: v.due! });
      usePortalUi.getState().set({ newWfOpen: false, newId: id });
      const onList = pathname === '/portal/workflows';
      const visible = !onList || filterWorkflows(useApp.getState(), usePortalUi.getState().wf).some(w => w.id === id);
      toast(`${id} created${onList && !visible ? '. Clear filters to see it in the table' : ''}.`, { icon: 'plus', action: { label: 'Open', onClick: () => openWf(id) } });
      requestAnimationFrame(() => document.getElementById('view-title')?.focus({ preventScroll: true }));
    });
  };

  const typeOpts = s.templates
    .map(t => ({ value: t.id, label: t.name, sub: `${t.steps.length} steps · ${AREAS[t.area]}`, group: AREAS[t.area] }))
    .sort((a, b) => a.group.localeCompare(b.group));

  return (
    <Modal
      open={open} onClose={close} title="Request a new workflow" initialFocus="#nw-title" onSubmit={submit}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={close}>Cancel</button>
        <button className="btn btn-primary" type="submit" id="nw-submit" aria-busy={busy || undefined} disabled={busy}><Icon name="plus" size={18} />Create workflow</button>
      </>}
    >
      <p className="small">Your Hyacinth team picks it up and adds steps based on the workflow type.</p>
      <div className="form-grid">
        <TextField id="nw-title" label="Workflow name" full placeholder="For example: Records request, three providers" value={v.title} onChange={x => setField('title', x)} error={errs.title} />
        <TextField id="nw-matter" label="Matter" full placeholder="For example: Reyes v. Northgate Logistics, or Firmwide" value={v.matter} onChange={x => setField('matter', x)} error={errs.matter} />
        <div className="field">
          <span className="label" id="nw-area-l">Service area</span>
          <Select id="nw-area" labelId="nw-area-l" title="Service area" value={v.area} onChange={onArea} options={areaOptions().filter(o => F.services.includes(o.value as AreaKey))} />
        </div>
        <div className="field">
          <span className="label" id="nw-type-l">Workflow type</span>
          <Combobox id="nw-type" labelId="nw-type-l" title="Workflow template" value={v.type} onChange={type => setV(p => ({ ...p, type }))} options={typeOpts} />
        </div>
        <div className="field">
          <span className="label" id="nw-owner-l">Owner</span>
          <Combobox id="nw-owner" labelId="nw-owner-l" title="Owner" value={v.owner} onChange={owner => setV(p => ({ ...p, owner }))} options={staffOptions(s, F.team)} />
        </div>
        <div className="field">
          <span className="label" id="nw-due-l">Due date</span>
          <DatePicker
            id="nw-due" labelId="nw-due-l" title="Due date" value={v.due} required requiredMsg="Choose a due date."
            min={today()} minReason="Due dates can’t be before today." markers={deadlineMarkers(s, 'portal')}
            hintId="nw-due-hint" error={errs.due}
            onChange={due => { setV(p => ({ ...p, due })); setDueTouched(true); if (due) setErrs(x => ({ ...x, due: undefined })); }}
            onValidityChange={setDueValid}
          />
          <p className="hint" id="nw-due-hint">Defaults to the service area’s SLA from admin settings.</p>
        </div>
      </div>
    </Modal>
  );
}
