'use client';
/* Unknown /portal/* path: send the viewer to Overview and say so (legacy route() fallback). */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui';

export function NotFoundRedirect() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    toast(`Nothing lives at “${pathname.slice(0, 48)}”. Showing Overview instead.`, { icon: 'alert' });
    router.replace('/portal');
  }, [pathname, router]);
  return null;
}
