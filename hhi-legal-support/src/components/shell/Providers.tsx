'use client';
/* App shell shared by all three surfaces.
   - Mount gate: the store holds dates relative to "now" and the viewer's clock, so content renders in the browser only.
   - Sets the active surface (site / portal / admin) from the URL; the store uses it for audit logging.
   - Renders the prototype surface switcher and the global hosts (toasts, confirm dialog, CSV export, live announcer). */
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Logo } from '@/components/icons';
import { Toaster, ConfirmHost, CsvHost, Announcer } from '@/components/ui';
import { Switcher } from './Switcher';
import type { Surface } from '@/lib/types';

export const surfaceFor = (path: string): Surface => (path.startsWith('/admin') ? 'admin' : path.startsWith('/portal') ? 'portal' : 'site');

const subscribeNoop = () => () => {};

export function Providers({ children }: { children: React.ReactNode }) {
  // false while server-rendering and hydrating, true once running in the browser
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const pathname = usePathname() || '/';
  const surface = surfaceFor(pathname);
  const setSurface = useApp(s => s.setSurface);

  useEffect(() => {
    setSurface(surface);
    document.body.classList.toggle('mode-portal', surface !== 'site');
  }, [surface, setSurface]);

  if (!ready) return <div className="boot" aria-busy="true" aria-label="Loading Hyacinth Legal Support"><Logo size={48} /></div>;
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Switcher surface={surface} />
      {children}
      <Toaster />
      <ConfirmHost />
      <CsvHost />
      <Announcer />
    </>
  );
}
