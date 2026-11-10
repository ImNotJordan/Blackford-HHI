import type { Metadata } from 'next';
import { AdminGate } from '@/components/admin/shell/AdminShell';

export const metadata: Metadata = {
  title: { template: '%s · Hyacinth admin', default: 'Hyacinth admin' },
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
