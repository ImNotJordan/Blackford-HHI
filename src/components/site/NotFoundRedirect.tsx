'use client';
/* Unknown path: tell the visitor and replace the URL with the nearest surface home. */
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/components/ui';

export function NotFoundRedirect() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const seg = pathname.split('/')[1];
    const fb = seg === 'admin' ? '/admin' : seg === 'portal' ? '/portal' : '/';
    const where = fb === '/' ? 'the home page' : fb === '/admin' ? 'the admin dashboard' : 'Overview';
    let shown = pathname;
    try { shown = decodeURIComponent(pathname); } catch { /* keep encoded */ }
    toast(`Nothing lives at “${shown.slice(0, 40)}”. Showing ${where} instead.`, { icon: 'alert' });
    router.replace(fb);
  }, [pathname, router]);

  return <main id="main" tabIndex={-1} aria-busy="true" />;
}
