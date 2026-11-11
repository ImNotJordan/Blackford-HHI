'use client';
/* Add or edit a team member (name, email, job title, admin access, capacity, assigned clients). */
import { useState } from 'react';
import { Modal, MultiSelect, Select, toast, useBusy } from '@/components/ui';
import { ErrText, Field } from '@/components/admin/shell/kit';
import { ACCESS_LEVELS, ROLE_DESC } from '@/lib/data';
import { EMAIL_RE } from '@/lib/format';
import { useApp } from '@/lib/store';
import type { AccessLevel } from '@/lib/types';

const ACCESS_OPTS = ACCESS_LEVELS.map(a => ({ value: a, label: a, sub: ROLE_DESC[a] || 'No admin access; works in assigned workflows' }));

/** `member` is a staff key, 'new' to add someone, or null when closed. */
export function MemberModal({ member, onClose }: { member: string | null; onClose(): void }) {
  if (!member) return null;
  return <MemberInner key={member} k={member === 'new' ? null : member} onClose={onClose} />;
}

function MemberInner({ k, onClose }: { k: string | null; onClose(): void }) {
  const firms = useApp(s => s.firms);
  const [init] = useState(() => {
    const st = useApp.getState(), t = k ? st.team[k] : null;
    return {
      name: t?.name || '', email: t?.email || '', role: t?.role || '', access: (t?.access || 'Specialist') as AccessLevel, cap: String(t?.capacity ?? 5),
      clients: k ? st.firms.filter(f => f.team.includes(k) || f.lead === k).map(f => f.id) : []
    };
  });
  const [v, setV] = useState(init);
  const [errs, setErrs] = useState<{ name?: string; email?: string; cap?: string }>({});
  const [busy, run] = useBusy();
  const firmOpts = firms.map(f => ({ value: f.id, label: f.name, sub: `${f.city} · ${f.status}`, short: f.name.split(/[ &]/)[0] }));

  const upd = (key: 'name' | 'email' | 'role' | 'cap', val: string) => {
    setV(x => ({ ...x, [key]: val }));
    if (key !== 'role' && errs[key] && val.trim()) setErrs(x => ({ ...x, [key]: '' }));
  };
  const submit = () => {
    if (busy) return;
    const n = v.name.trim(), e = v.email.trim(), c = Number(v.cap);
    const okCap = Number.isInteger(c) && c >= 1 && c <= 20;
    const next = {
      name: n.length < 2 ? 'Enter a full name.' : '',
      email: EMAIL_RE.test(e) ? '' : 'Enter an email address in the format name@hyacinth.example.',
      cap: okCap ? '' : 'Enter a capacity from 1 to 20.'
    };
    setErrs(next);
    const first = ([['mb-name', next.name], ['mb-email', next.email], ['mb-cap', next.cap]] as const).find(x => x[1]);
    if (first) { document.getElementById(first[0])?.focus(); return; }
    run(() => {
      useApp.getState().saveMember(k, { name: n, email: e, role: v.role.trim() || 'Specialist', access: v.access, capacity: c }, v.clients);
      onClose();
      toast(`${n} ${k ? 'saved' : 'added to the team'}.`, { icon: 'users' });
    });
  };

  return (
    <Modal
      open onClose={onClose} onSubmit={submit} initialFocus="#mb-name" title={k ? `Edit ${init.name}` : 'Add team member'}
      footer={<>
        <button className="btn btn-quiet" type="button" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" type="submit" id="mb-save" aria-busy={busy || undefined} disabled={busy}>{k ? 'Save changes' : 'Add team member'}</button>
      </>}
    >
      <div className="form-grid">
        <Field id="mb-name" label="Full name" autoComplete="off" value={v.name} error={errs.name} onChange={t => upd('name', t)} />
        <Field id="mb-email" label="Work email" type="email" autoComplete="off" value={v.email} error={errs.email} onChange={t => upd('email', t)} />
        <Field id="mb-role" label="Job title" placeholder="For example: Records coordinator" value={v.role} onChange={t => upd('role', t)} />
        <div className="field">
          <span className="label" id="mb-access-l">Admin access</span>
          <Select id="mb-access" labelId="mb-access-l" title="Admin access" value={v.access} options={ACCESS_OPTS} onChange={a => setV(x => ({ ...x, access: a as AccessLevel }))} />
        </div>
        <div className="field">
          <label className="label" htmlFor="mb-cap">Capacity (open workflows)</label>
          <input
            className="input num-input" id="mb-cap" type="number" min={1} max={20} inputMode="numeric" value={v.cap}
            aria-describedby="mb-cap-err" aria-invalid={errs.cap ? true : undefined} onChange={e => upd('cap', e.target.value)}
          />
          <ErrText id="mb-cap" msg={errs.cap} />
        </div>
        <div className="field full">
          <span className="label" id="mb-clients-l">Assigned clients <span className="opt">(optional)</span></span>
          <MultiSelect id="mb-clients" labelId="mb-clients-l" title="Clients" placeholder="No clients yet" value={v.clients} options={firmOpts} onChange={c => setV(x => ({ ...x, clients: c }))} />
        </div>
      </div>
    </Modal>
  );
}
