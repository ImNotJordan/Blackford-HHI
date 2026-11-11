'use client';
/* Unknown /admin/* paths: back to the dashboard with an explanation. */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui';

export function NotFoundRedirect() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    toast(`Nothing lives at “${pathname.slice(0, 60)}”. Showing the admin dashboard instead.`, { icon: 'alert' });
    router.replace('/admin');
  }, [pathname, router]);
  return null;
}
