import type { Metadata } from 'next';
import { NotFoundRedirect } from '@/components/portal/NotFoundRedirect';

export const metadata: Metadata = { title: 'Not found' };

export default function Page() {
  return <NotFoundRedirect />;
}
