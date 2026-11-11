import type { Metadata } from 'next';
import { DeadlinesView } from '@/components/portal/DeadlinesView';

export const metadata: Metadata = { title: 'Deadlines' };

export default function Page() {
  return <DeadlinesView />;
}
