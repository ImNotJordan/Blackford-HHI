'use client';
/* Invite user modal: email, user type → role options, firm (client users only), duplicate-email check. */
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Combobox, Modal, Select, toast, useBusy, type Option } from '@/components/ui';
import { TextField, focusLater } from '@/components/admin/settings/formKit';
import { ROLES, ROLE_DESC } from '@/lib/data';
import { EMAIL_RE } from '@/lib/format';
import { firmOptions } from '@/lib/selectors';
import { useApp } from '@/lib/store';

type UserType = 'Client' | 'Staff';
const TYPE_OPTS: Option[] = [
  { value: 'Client', label: 'Client user', sub: 'Signs in to the client portal' },
  { value: 'Staff', label: 'Staff user', sub: 'Signs in to admin' }
];
const roleOpts = (t: UserType): Option[] => (t === 'Staff' ? [...ROLES] : ['Firm admin', 'Firm member']).map(r => ({
  value: r, label: r, sub: ROLE_DESC[r] || (r === 'Firm admin' ? 'Manages the firm’s portal users' : 'Sees workflows, deadlines and reports')
}));
const defaultRole = (t: UserType) => (t === 'Staff' ? 'Team Lead' : 'Firm member');

/** Mounted only while open, so every invite starts from a clean form. */
export function InviteModal({ open, onClose }: { open: boolean; onClose(): void }) {
  return open ? <InviteDialog onClose={onClose} /> : null;
}

function InviteDialog({ onClose }: { onClose(): void }) {
  const firms = useApp(s => s.firms);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<UserType>('Client');
  const [role, setRole] = useState(defaultRole('Client'));
  const [firm, setFirm] = useState('');
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [firmErr, setFirmErr] = useState<string | null>(null);
  const [busy, run] = useBusy();

  const send = () => {
    if (busy) return;
    const e = email.trim();
    if (!EMAIL_RE.test(e)) { setEmailErr('Enter an email address in the format name@firm.com.'); focusLater('iv-email'); return; }
    if (useApp.getState().users.some(u => u.email.toLowerCase() === e.toLowerCase())) { setEmailErr('This person already has an account.'); focusLater('iv-email'); return; }
    setEmailErr(null);
    if (type === 'Client' && !firm) { setFirmErr('Choose the firm this user belongs to.'); focusLater('iv-firm'); return; }
    run(() => {
      useApp.getState().inviteUser({ name: name.trim() || e.split('@')[0], email: e, type, role, firm: type === 'Client' ? firm : null });
      onClose();
      toast(`Invite sent to ${e} (prototype: nothing was sent).`, { icon: 'send' });
    });
  };

  const footer = (
    <>
      <button className="btn btn-quiet" type="button" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" type="submit" id="iv-send" disabled={busy} aria-busy={busy || undefined}><Icon name="send" size={18} />Send invite</button>
    </>
  );

  return (
    <Modal open onClose={onClose} title="Invite user" initialFocus="#iv-email" onSubmit={send} footer={footer}>
      <div className="form-grid">
        <TextField id="iv-name" label="Full name" opt value={name} onChange={setName} autoComplete="off" />
        <TextField id="iv-email" label="Email" type="email" value={email} error={emailErr} autoComplete="off"
          onChange={v => { setEmail(v); if (emailErr && v.trim()) setEmailErr(null); }} />
        <div className="field">
          <span className="label" id="iv-type-l">User type</span>
          <Select id="iv-type" labelId="iv-type-l" title="User type" value={type} options={TYPE_OPTS}
            onChange={v => { const t = v as UserType; setType(t); setRole(defaultRole(t)); setFirmErr(null); }} />
        </div>
        <div className="field">
          <span className="label" id="iv-role-l">Role</span>
          <Select id="iv-role" labelId="iv-role-l" title="Role" value={role} options={roleOpts(type)} onChange={setRole} />
        </div>
        <div className="field full">
          {type === 'Client' ? (
            <>
              <span className="label" id="iv-firm-l">Firm</span>
              <Combobox id="iv-firm" labelId="iv-firm-l" title="Firm" placeholder="Search client firms" value={firm}
                options={firmOptions({ firms } as Parameters<typeof firmOptions>[0])} error={firmErr}
                onChange={v => { setFirm(v); if (v) setFirmErr(null); }} />
            </>
          ) : <p className="small">Staff users join Hyacinth, not a client firm.</p>}
        </div>
      </div>
    </Modal>
  );
}
