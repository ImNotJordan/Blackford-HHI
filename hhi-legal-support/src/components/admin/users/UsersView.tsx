'use client';
/* Admin · Users & roles: status KPI filters, user table with row actions, invite modal, permission matrix. */
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { ActionMenu, Avatar, Band, EmptyState, KpiRow, KpiTile, RelTime, Segmented, announce, confirmDialog, toast, type MenuEntry } from '@/components/ui';
import { RoNote, useCan } from '@/components/admin/common';
import { FEATURES, FEATURE_LABEL, ROLES } from '@/lib/data';
import { firmName } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { Feature, PortalUser, Role } from '@/lib/types';
import { InviteModal } from './InviteModal';

type Tab = 'all' | 'Staff' | 'Client';
type StatusFilter = 'all' | PortalUser['status'];
const STATUSES: PortalUser['status'][] = ['Active', 'Invited', 'Disabled'];

function UserStatus({ status }: { status: PortalUser['status'] }) {
  if (status === 'Active') return <span className="badge st-complete"><Icon name="check" size={12} />Active</span>;
  if (status === 'Invited') return <span className="badge st-review"><Icon name="clock" size={12} />Invited</span>;
  return <span className="badge st-blocked"><Icon name="block" size={12} />Disabled</span>;
}

function userMenu(u: PortalUser): MenuEntry[] {
  const st = () => useApp.getState();
  const items: MenuEntry[] = [];
  if (u.status === 'Invited') items.push({ label: 'Resend invite', icon: 'send', onSelect: () => { st().logUserAction(`Resent invite to ${u.name}`, u.email); toast(`Invite resent to ${u.email}.`, { icon: 'send' }); } });
  items.push({
    label: 'Reset password', icon: 'refresh', disabled: u.status !== 'Active',
    onSelect: () => confirmDialog({ title: `Reset ${u.name}’s password?`, body: `A reset link goes to ${u.email}. Their current password stops working right away.`, confirmLabel: 'Send reset link' }).then(ok => {
      if (!ok) return;
      st().logUserAction(`Reset password for ${u.name}`, u.email);
      toast(`Reset link sent to ${u.email} (prototype: nothing was sent).`, { icon: 'send' });
    })
  });
  items.push('separator');
  if (u.status === 'Disabled') {
    items.push({ label: 'Enable user', icon: 'check', onSelect: () => { st().setUserStatus(u.id, 'Active'); toast(`${u.name} can sign in again.`); } });
  } else {
    items.push({
      label: 'Disable user', icon: 'block', danger: true,
      onSelect: () => confirmDialog({ title: `Disable ${u.name}?`, body: 'They will not be able to sign in until you enable them again.', confirmLabel: 'Disable user', danger: true }).then(ok => {
        if (!ok) return;
        const undo = st().setUserStatus(u.id, 'Disabled');
        toast(`${u.name} disabled.`, { undo });
      })
    });
  }
  return items;
}

export function UsersView() {
  const s = useApp();
  const users = s.users, perms = s.perms, current = s.admin.role;
  const canUsers = useCan('users');
  const canPerms = useCan('perms');
  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [inviting, setInviting] = useState(false);

  const needle = q.trim().toLowerCase();
  const list = users.filter(x =>
    (tab === 'all' || x.type === tab) &&
    (status === 'all' || x.status === status) &&
    (!needle || [x.name, x.email, x.firm ? firmName(s, x.firm) : 'Hyacinth'].join(' ').toLowerCase().includes(needle)));

  const toggleStatus = (st: PortalUser['status']) => {
    const next = status === st ? 'all' : st;
    setStatus(next);
    announce(next === 'all' ? 'Showing all users' : `Showing ${next.toLowerCase()} users`);
  };
  const clear = () => { setTab('all'); setQ(''); setStatus('all'); };

  const togglePerm = (r: Role, f: Feature, on: boolean) => {
    const undo = useApp.getState().setPerm(r, f, on);
    toast(`${on ? 'Granted' : 'Removed'} “${FEATURE_LABEL[f]}” for ${r}.`, { icon: 'shield', undo });
  };

  return (
    <>
      <Band
        eyebrow="Governance" title="Users & roles" sub="Portal users at client firms and staff users at Hyacinth, plus what each staff role can do."
        actions={canUsers ? <button className="btn btn-primary btn-sm" type="button" id="us-invite" onClick={() => setInviting(true)}><Icon name="plus" size={18} />Invite user</button> : null}
      >
        <KpiRow cols={3} ariaLabel="Users by status">
          {STATUSES.map(st => (
            <KpiTile
              key={st} id={`ku-${st}`} label={`${st} users`} value={users.filter(x => x.status === st).length}
              foot={status === st ? 'Showing only these · Show all' : `Show only ${st.toLowerCase()}`}
              onClick={() => toggleStatus(st)} pressed={status === st}
            />
          ))}
        </KpiRow>
      </Band>
      <div className="wrap pcontent">
        {canUsers ? null : <RoNote feature="users" />}
        <section className="card" aria-labelledby="us-h">
          <div className="card-head">
            <h2 className="h4" id="us-h">Users</h2>
            <div className="card-tools">
              <Segmented<Tab> label="User type" value={tab} onChange={setTab}
                options={[{ value: 'all', label: 'All', id: 'ust-all' }, { value: 'Staff', label: 'Staff', id: 'ust-Staff' }, { value: 'Client', label: 'Client users', id: 'ust-Client' }]} />
              <div className="search-field" style={{ minWidth: 0, flex: '1 1 220px' }}>
                <Icon name="search" size={18} />
                <label className="sr-only" htmlFor="us-q">Search users</label>
                <input className="input" id="us-q" type="search" placeholder="Name, email or firm" value={q} onChange={e => setQ(e.target.value)} style={{ minHeight: 40 }} />
              </div>
            </div>
          </div>
          {list.length ? (
            <div className="table-wrap" tabIndex={0} role="region" aria-label="Users table">
              <table className="data" style={{ minWidth: 900 }}>
                <thead>
                  <tr>
                    <th scope="col">Name</th><th scope="col">Type</th><th scope="col">Role</th><th scope="col">Firm</th>
                    <th scope="col">Last active</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(x => (
                    <tr key={x.id}>
                      <td><span className="person"><Avatar name={x.name} /><span><b>{x.name}</b><span className="cell-sub" style={{ display: 'block' }}>{x.email}</span></span></span></td>
                      <td>{x.type === 'Staff' ? 'Staff' : 'Client'}</td>
                      <td>{x.role}</td>
                      <td>{x.firm ? firmName(s, x.firm) : 'Hyacinth'}</td>
                      <td>{x.last ? <RelTime date={x.last} /> : <span className="small">Never signed in</span>}</td>
                      <td><UserStatus status={x.status} /></td>
                      <td>{canUsers ? <ActionMenu id={`usm-${x.id}`} label={`More actions for ${x.name}`} items={userMenu(x)} /> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon="search" title="No users match" text="Try another search or user type."
              actions={<button className="btn btn-dark btn-sm" type="button" onClick={clear}>Show all users</button>} />
          )}
        </section>
        <section className="card" aria-labelledby="pm-h">
          <div className="card-head">
            <div>
              <h2 className="h4" id="pm-h">Roles and permissions</h2>
              <p className="small">{canPerms ? 'Changes apply to the role switcher in the header right away.' : 'Only roles with “Edit roles and permissions” can change this matrix.'}</p>
            </div>
          </div>
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Permissions matrix" style={{ borderTop: 0 }}>
            <table className="matrix">
              <caption className="sr-only">Features by role. Checked means the role can use the feature.</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {ROLES.map(r => (
                    <th scope="col" key={r}>{r}{r === current ? <><br /><span className="small" style={{ textTransform: 'none', letterSpacing: 0 }}>(current)</span></> : null}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(([f, l]) => (
                  <tr key={f}>
                    <th scope="row" style={{ fontWeight: 500 }}>{l}</th>
                    {ROLES.map(r => {
                      const locked = r === 'Super Admin' && f === 'perms';
                      return (
                        <td key={r}>
                          <input
                            type="checkbox" className="cbox" id={`pm-${r.replace(/\s/g, '')}-${f}`}
                            checked={locked || !!perms[r][f]} disabled={!canPerms || locked}
                            onChange={e => togglePerm(r, f, e.target.checked)}
                            aria-label={`${l} for ${r}${locked ? ' (always on)' : ''}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <InviteModal open={inviting} onClose={() => setInviting(false)} />
    </>
  );
}
