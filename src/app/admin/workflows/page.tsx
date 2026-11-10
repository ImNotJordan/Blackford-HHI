import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AdminWorkflows } from '@/components/admin/workflows/AdminWorkflows';

export const metadata: Metadata = { title: 'Workflows' };

export default function AdminWorkflowsPage() {
  return (
    <Suspense fallback={null}>
      <AdminWorkflows />
    </Suspense>
  );
}
