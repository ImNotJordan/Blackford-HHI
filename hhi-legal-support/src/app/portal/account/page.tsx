import type { Metadata } from 'next';
import { AccountView } from '@/components/portal/AccountView';

export const metadata: Metadata = { title: 'Account & preferences' };

export default function Page() {
  return <AccountView />;
}
