'use client';
/* Website-only UI state: the contact form (kept across page changes, like the legacy app) and the scroll-spy section. */
import { create } from 'zustand';
import type { ContactValues } from '@/lib/types';

const EMPTY: ContactValues = { name: '', firm: '', email: '', phone: '', area: '', msg: '' };

interface SiteState {
  values: ContactValues;
  /** values captured at the last successful submit (shown on the success card) */
  sent: ContactValues | null;
  submitted: boolean;
  attempted: boolean;
  spy: string | null;
  setValue<K extends keyof ContactValues>(k: K, v: ContactValues[K]): void;
  setArea(area: string): void;
  setAttempted(): void;
  submit(v: ContactValues): void;
  edit(): void;
  reset(): void;
  setSpy(id: string | null): void;
}

export const useSite = create<SiteState>()(set => ({
  values: { ...EMPTY },
  sent: null,
  submitted: false,
  attempted: false,
  spy: null,
  setValue: (k, v) => set(s => ({ values: { ...s.values, [k]: v } })),
  setArea: area => set(s => ({ values: { ...s.values, area }, submitted: false })),
  setAttempted: () => set({ attempted: true }),
  submit: v => set({ values: v, sent: v, submitted: true }),
  edit: () => set({ submitted: false }),
  reset: () => set({ values: { ...EMPTY }, sent: null, submitted: false, attempted: false }),
  setSpy: id => set(s => (s.spy === id ? s : { spy: id }))
}));
