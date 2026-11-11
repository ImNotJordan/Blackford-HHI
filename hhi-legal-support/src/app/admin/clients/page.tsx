import type { Metadata } from 'next';
import { ClientsList } from '@/components/admin/clients/ClientsList';

export const metadata: Metadata = { title: 'Client firms' };

export default function AdminClientsPage() {
  return <ClientsList />;
}
