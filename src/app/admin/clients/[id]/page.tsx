import type { Metadata } from 'next';
import { ClientDetail } from '@/components/admin/clients/ClientDetail';

export const metadata: Metadata = { title: 'Client firm' };

export default function AdminClientDetailPage() {
  return <ClientDetail />;
}
