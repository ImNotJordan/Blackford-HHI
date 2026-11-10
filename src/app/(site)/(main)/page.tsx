import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomeView } from '@/components/site/HomeView';

export const metadata: Metadata = { title: { absolute: 'Hyacinth Legal Support · Managed operations for midsize law firms' } };

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeView />
    </Suspense>
  );
}
