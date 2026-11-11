'use client';
/* Shared admin helpers (used by every admin screen). */
import { Icon } from '@/components/icons';
import { FEATURE_LABEL, FS_ICON } from '@/lib/data';
import { can } from '@/lib/selectors';
import { useApp } from '@/lib/store';
import type { Feature, FirmStatus } from '@/lib/types';

/** true when the current demo role has the feature. Re-renders when the role or permissions change. */
export function useCan(f: Feature) {
  return useApp(s => can(s, f));
}

/** Opens the role switcher in the admin header (its trigger id is "role-switch"). */
export function focusRoleSwitcher() {
  const t = document.getElementById('role-switch');
  if (!t) return;
  t.scrollIntoView({ block: 'nearest' });
  t.focus();
  t.click();
}

/** Clear, non-broken read-only state shown when the current role lacks a feature. */
export function RoNote({ feature }: { feature: Feature }) {
  const role = useApp(s => s.admin.role);
  return (
    <div className="ro-note" role="note">
      <Icon name="shield" size={18} />
      <span><b>Read-only for {role}.</b> “{FEATURE_LABEL[feature]}” is off for this role in Users &amp; roles.</span>
      <button className="btn btn-ghost btn-sm" type="button" onClick={focusRoleSwitcher}>Switch role</button>
    </div>
  );
}

export function FirmBadge({ status }: { status: FirmStatus }) {
  const cls = status === 'Active' ? 'st-complete' : status === 'Onboarding' ? 'st-review' : 'st-blocked';
  return <span className={`badge ${cls}`}><Icon name={FS_ICON[status]} size={12} />{status}</span>;
}
