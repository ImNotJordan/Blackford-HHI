'use client';
/* Firm actions shared by the client list, client detail and firm wizard. */
import { confirmDialog, toast } from '@/components/ui';
import { useApp } from '@/lib/store';
import type { FirmStatus } from '@/lib/types';

type Nav = { push(href: string): void };

/** Opens the client portal as the firm (logged to the audit trail by the store). */
export function viewAsClient(id: string, router: Nav) {
  const f = useApp.getState().firms.find(x => x.id === id);
  if (!f) return;
  useApp.getState().viewAsClient(id);
  router.push('/portal');
  toast(`Previewing the portal as ${f.name}.`, { icon: 'eye' });
}

/** Sets the firm status with an Undo toast. */
export function changeFirmStatus(id: string, status: FirmStatus) {
  const f = useApp.getState().firms.find(x => x.id === id);
  if (!f || f.status === status) return;
  const undo = useApp.getState().setFirmStatus(id, status);
  toast(`${f.name} is now ${status}.`, { undo });
}

/** Pause (with a confirm) or reactivate a firm. */
export async function togglePauseFirm(id: string) {
  const f = useApp.getState().firms.find(x => x.id === id);
  if (!f) return;
  const pausing = f.status !== 'Paused';
  const ok = await confirmDialog({
    title: pausing ? `Pause ${f.name}?` : `Reactivate ${f.name}?`,
    body: pausing ? 'The firm’s portal stays available, but the firm is marked Paused across admin. You can undo this right after.' : 'The firm returns to Active.',
    confirmLabel: pausing ? 'Pause firm' : 'Reactivate',
    danger: pausing
  });
  if (ok) changeFirmStatus(id, pausing ? 'Paused' : 'Active');
}
