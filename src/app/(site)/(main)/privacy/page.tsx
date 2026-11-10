import type { Metadata } from 'next';
import { LEGAL } from '@/lib/data';
import { LegalView } from '@/components/site/LegalView';

export const metadata: Metadata = { title: LEGAL.privacy.title };

export default function Page() {
  return <LegalView page="privacy" />;
}
