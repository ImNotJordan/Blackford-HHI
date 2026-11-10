'use client';
/* Workflow actions with their confirmations and feedback. Shared by the portal views,
   the workflow slide-over and (through the slide-over) admin. */
import { useApp } from '@/lib/store';
import { STATUS } from '@/lib/data';
import { getWf } from '@/lib/selectors';
import { toast, confirmDialog } from '@/components/ui';
import type { StatusKey } from '@/lib/types';

/** Sets a workflow status with an Undo toast. No-op when the status is unchanged. */
export function changeStatus(id: string, status: StatusKey) {
  const s = useApp.getState(), w = getWf(s, id);
  if (!w || w.status === status) return;
  const undo = s.setWorkflowStatus(id, status);
  toast(`${id} is now ${STATUS[status]}.`, { undo });
}

/** Confirms, archives and offers Undo. Resolves true when archived. */
export async function archiveWithConfirm(id: string, onArchived?: () => void) {
  const w = getWf(useApp.getState(), id);
  if (!w) return false;
  const ok = await confirmDialog({
    title: `Archive ${id}?`,
    body: `“${w.title}” will leave active workflows, and its deadlines and exceptions will be hidden. You can undo this right after.`,
    confirmLabel: 'Archive workflow',
    danger: true
  });
  if (!ok) return false;
  const undo = useApp.getState().archiveWorkflows([id]);
  onArchived?.();
  requestAnimationFrame(() => { const t = document.getElementById('view-title'); if (t) t.focus({ preventScroll: true }); });
  toast(`${id} archived.`, { icon: 'archive', undo });
  return true;
}
