'use client';
/* Bulk actions on selected workflows: reassign, change status, set due date. Each applies with Undo. */
import { useMemo, useState } from 'react';
import { Combobox, DatePicker, Modal, Select, toast, useBusy } from '@/components/ui';
import { focusViewTitle } from '@/components/admin/shell/kit';
import { STATUS, STATUS_ICON } from '@/lib/data';
import { addDays, fmtD, today } from '@/lib/format';
import { deadlineMarkers, staffOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { StatusKey } from '@/lib/types';

export type BulkKind = 'reassign' | 'status' | 'due';
export const STATUS_OPTS = (Object.keys(STATUS) as StatusKey[]).map(k => ({ value: k, label: STATUS[k], icon: STATUS_ICON[k] }));

export function BulkModal({ kind, ids, onClose }: { kind: BulkKind | null; ids: string[]; onClose(): void }) {
  if (!kind || !ids.length) return null;
  return <BulkInner kind={kind} ids={ids} onClose={onClose} />;
}

function BulkInner({ kind, ids, onClose }: { kind: BulkKind; ids: string[]; onClose(): void }) {
  const s = useApp();
  const n = ids.length;
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState('');
  const [due, setDue] = useState<Date | null>(() => addDays(7));
  const [dueValid, setDueValid] = useState(true);
  const [err, setErr] = useState('');
  const [busy, run] = useBusy();
  const staff = useMemo(() => staffOptions(s), [s]);
  const markers = useMemo(() => deadlineMarkers(s, 'all'), [s]);

  const finish = (msg: string, undo: () => void) => { onClose(); focusViewTitle(); toast(msg, { undo }); };
  const submit = () => {
    if (busy) return;
    const st = useApp.getState();
    if (kind === 'reassign') {
      if (!owner) { setErr('Choose a new owner.'); document.getElementById('bk-owner')?.focus(); return; }
      run(() => { const undo = st.bulkReassign(ids, owner); finish(`${n} workflows reassigned to ${st.team[owner].name}.`, undo); });
    } else if (kind === 'status') {
      if (!status) { setErr('Choose a status.'); document.getElementById('bk-status')?.focus(); return; }
      const k = status as StatusKey;
      run(() => { const undo = st.bulkStatus(ids, k); finish(`${n} workflows set to ${STATUS[k]}.`, undo); });
    } else {
      if (!dueValid) { document.getElementById('bk-due')?.focus(); return; }
      if (!due) { setErr('Choose a due date.'); document.getElementById('bk-due')?.focus(); return; }
      const d = due;
      run(() => { const undo = st.bulkDue(ids, d); finish(`${n} workflows now due ${fmtD(d)}.`, undo); });
    }
  };

  const title = kind === 'reassign' ? `Reassign ${n} workflows` : kind === 'status' ? `Change status of ${n} workflows` : `Set due date for ${n} workflows`;
  const go = kind === 'reassign' ? 'Reassign' : kind === 'status' ? 'Change status' : 'Set due date';
  return (
    <Modal
      open onClose={onClose} onSubmit={submit} title={title} initialFocus={`#bk-${kind === 'reassign' ? 'owner' : kind}`}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" type="submit" id="bk-go" aria-busy={busy || undefined} disabled={busy}>{go}</button>
      </>}
    >
      {kind === 'reassign' && (
        <div className="field">
          <span className="label" id="bk-owner-l">New owner</span>
          <Combobox id="bk-owner" labelId="bk-owner-l" title="New owner" placeholder="Search staff" value={owner} options={staff} error={err || null}
            onChange={v => { setOwner(v); if (v) setErr(''); }} />
        </div>
      )}
      {kind === 'status' && (
        <div className="field">
          <span className="label" id="bk-status-l">New status</span>
          <Select id="bk-status" labelId="bk-status-l" title="Status" placeholder="Choose a status" value={status} options={STATUS_OPTS} error={err || null}
            onChange={v => { setStatus(v); if (v) setErr(''); }} />
        </div>
      )}
      {kind === 'due' && (
        <div className="field">
          <span className="label" id="bk-due-l">New due date</span>
          <DatePicker
            id="bk-due" labelId="bk-due-l" title="Due date" value={due} min={today()} minReason="Due dates can’t be before today." required markers={markers}
            error={err || null} onChange={v => { setDue(v); if (v) setErr(''); }} onValidityChange={setDueValid}
          />
        </div>
      )}
    </Modal>
  );
}
