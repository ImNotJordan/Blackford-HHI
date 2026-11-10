'use client';
/* Reassign one workflow (from the dashboard or workflows table) or reassign work away from a team member (Team & capacity). */
import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { Combobox, Modal, toast, useBusy } from '@/components/ui';
import { fmtD } from '@/lib/format';
import { allOpen, firmName, firmOf, getWf, staffOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';

export interface ReassignTarget { from?: string | null; wf?: string | null }

/** Renders nothing when `target` is null. */
export function ReassignModal({ target, onClose }: { target: ReassignTarget | null; onClose(): void }) {
  if (!target) return null;
  return <ReassignInner from={target.from || null} wfId={target.wf || null} onClose={onClose} />;
}

function ReassignInner({ from, wfId, onClose }: { from: string | null; wfId: string | null; onClose(): void }) {
  const s = useApp();
  const own = useMemo(() => (from ? allOpen(s).filter(w => w.owner === from) : []), [s, from]);
  const [wfSel, setWfSel] = useState(from ? own[0]?.id || '' : wfId || '');
  const [to, setTo] = useState('');
  const [err, setErr] = useState('');
  const [busy, run] = useBusy();
  const w = getWf(s, wfSel);
  const firm = w ? firmOf(s, w.firm) : undefined;
  const toOpts = useMemo(() => (w ? staffOptions(s, firm?.team).filter(o => o.value !== w.owner) : []), [s, w, firm]);

  if (!w) return null;
  const submit = () => {
    if (busy) return;
    if (!to) { setErr('Choose who takes over this workflow.'); document.getElementById('ra-to')?.focus(); return; }
    run(() => {
      const id = w.id, name = useApp.getState().team[to].name;
      const undo = useApp.getState().reassignWorkflow(id, to);
      onClose();
      toast(`${id} reassigned to ${name}.`, { icon: 'users', undo });
    });
  };

  return (
    <Modal
      open onClose={onClose} onSubmit={submit} initialFocus={from ? '#ra-wf' : '#ra-to'}
      title={from ? `Reassign work from ${s.team[from].name}` : `Reassign ${w.id}`}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" type="submit" id="ra-save" aria-busy={busy || undefined} disabled={busy}><Icon name="users" size={18} />Reassign</button>
      </>}
    >
      {from ? (
        <div className="field">
          <span className="label" id="ra-wf-l">Workflow</span>
          <Combobox
            id="ra-wf" labelId="ra-wf-l" title="Workflow" value={wfSel}
            options={own.map(x => ({ value: x.id, label: `${x.id} · ${x.title}`, sub: `${firmName(s, x.firm)} · ${fmtD(x.due)}` }))}
            onChange={v => { setWfSel(v); setTo(''); }}
          />
        </div>
      ) : (
        <p>{w.title} · {firmName(s, w.firm)}. Currently owned by {s.team[w.owner].name}.</p>
      )}
      <div className="field">
        <span className="label" id="ra-to-l">New owner</span>
        <Combobox
          id="ra-to" labelId="ra-to-l" title="New owner" placeholder="Search staff" value={to} options={toOpts} error={err || null}
          onChange={v => { setTo(v); if (v) setErr(''); }}
        />
      </div>
    </Modal>
  );
}
