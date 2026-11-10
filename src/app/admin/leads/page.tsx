import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LeadsView } from '@/components/admin/leads/LeadsView';

export const metadata: Metadata = { title: 'Leads' };

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsView />
    </Suspense>
  );
}
