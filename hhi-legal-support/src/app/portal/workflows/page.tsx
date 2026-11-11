import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkflowsView } from '@/components/portal/WorkflowsView';

export const metadata: Metadata = { title: 'Workflows' };

// WorkflowsView reads ?status, ?q and ?wf with useSearchParams, which needs a Suspense boundary.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorkflowsView />
    </Suspense>
  );
}
