'use client';
import Link from 'next/link';
import { Icon } from '@/components/icons';
import type { Surface } from '@/lib/types';

/** Prototype-only bar for moving between the three surfaces. */
export function Switcher({ surface }: { surface: Surface }) {
  const tabs: { s: Surface; href: string; long: string; short: string }[] = [
    { s: 'site', href: '/', long: 'Website', short: 'Website' },
    { s: 'portal', href: '/portal', long: 'Client portal', short: 'Portal' },
    { s: 'admin', href: '/admin', long: 'Admin', short: 'Admin' }
  ];
  return (
    <div className="switcher" role="region" aria-label="Prototype surface switcher">
      <div className="wrap">
        <p className="switcher-label"><Icon name="layers" /><span><b>Prototype</b><span className="long"> · Hyacinth Legal Support</span></span></p>
        <nav className="surface-tabs" aria-label="Choose surface">
          {tabs.map(t => (
            <Link key={t.s} href={t.href} aria-current={surface === t.s ? 'page' : undefined}>
              {t.long === t.short ? t.long : <><span className="long">{t.long}</span><span className="short">{t.short}</span></>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
