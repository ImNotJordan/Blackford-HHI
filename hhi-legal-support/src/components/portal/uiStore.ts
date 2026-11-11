'use client';
/* Client-portal view state that outlives a single route (filters, report cache, open layers).
   Domain data lives in '@/lib/store'; this store only holds how the portal is being looked at. */
import { create } from 'zustand';
import { useApp } from '@/lib/store';
import { toast } from '@/components/ui';
import type { StatusKey } from '@/lib/types';

export type WfSort = 'id' | 'title' | 'area' | 'owner' | 'status' | 'due' | 'progress';
export interface WfFilters { q: string; area: string[]; owner: string; status: 'all' | StatusKey; sort: WfSort; dir: 'asc' | 'desc' }
export type RepStatus = 'loaded' | 'error';

export const emptyFilters = { q: '', area: [] as string[], owner: 'all', status: 'all' as const };

interface PortalUi {
  wf: WfFilters;
  /** workflows list: error after a failed load, and a reload in progress */
  wfError: boolean;
  wfReloading: boolean;
  wfReloadToast: boolean;
  /** id of a just-created workflow (row flash) */
  newId: string | null;
  sheet: { id: string | null; focus?: string };
  newWfOpen: boolean;
  messageTo: string | null;
  rep: { idx: number; compare: boolean; status: Record<string, RepStatus>; failedOnce: Record<number, boolean> };
  /** selector to focus after the next route change instead of the view title */
  pendingFocus: string | null;

  setWf(patch: Partial<WfFilters>): void;
  set(patch: Partial<Omit<PortalUi, 'set' | 'setWf' | 'setRep'>>): void;
  setRep(patch: Partial<PortalUi['rep']>): void;
}

export const usePortalUi = create<PortalUi>()(set => ({
  wf: { ...emptyFilters, area: [], sort: 'due', dir: 'asc' },
  wfError: false,
  wfReloading: false,
  wfReloadToast: false,
  newId: null,
  sheet: { id: null },
  newWfOpen: false,
  messageTo: null,
  rep: { idx: 0, compare: false, status: {}, failedOnce: {} },
  pendingFocus: null,
  setWf: patch => set(s => ({ wf: { ...s.wf, ...patch } })),
  set: patch => set(patch),
  setRep: patch => set(s => ({ rep: { ...s.rep, ...patch } }))
}));

const ui = () => usePortalUi.getState();

/** Opens the workflow slide-over. Archived or missing workflows get a toast instead (Restore for archived). */
export function openWf(id: string, focus?: string) {
  const s = useApp.getState();
  if (s.workflows.some(w => w.id === id)) { ui().set({ sheet: { id, focus } }); return; }
  const archived = s.archived.some(w => w.id === id);
  if (archived) {
    toast(`${id} is archived.`, {
      icon: 'archive',
      action: {
        label: 'Restore',
        onClick: () => {
          useApp.getState().restoreWorkflow(id);
          toast(`${id} restored.`, { action: { label: 'Open', onClick: () => openWf(id) } });
        }
      }
    });
  } else {
    toast(`Workflow ${id} is no longer available.`, { icon: 'alert' });
  }
}
export const closeWf = () => ui().set({ sheet: { id: null } });
export const openNewWf = () => ui().set({ newWfOpen: true });
export const openMessage = (member: string) => ui().set({ messageTo: member });
/** Forget which report months were loaded (firm switch, failed-load simulation). */
export const resetReports = (idx?: number) => ui().setRep({ status: {}, ...(idx != null ? { idx } : {}) });
