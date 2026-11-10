import type { Metadata } from 'next';
import { NotFoundRedirect } from '@/components/site/NotFoundRedirect';

export const metadata: Metadata = { title: 'Page not found' };

export default function CatchAllPage() {
  return <NotFoundRedirect />;
}
