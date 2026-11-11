import type { Metadata } from 'next';
import { LEGAL } from '@/lib/data';
import { LegalView } from '@/components/site/LegalView';

export const metadata: Metadata = { title: LEGAL.terms.title };

export default function Page() {
  return <LegalView page="terms" />;
}
