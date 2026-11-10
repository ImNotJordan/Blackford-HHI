import type { Metadata } from 'next';
import { UsersView } from '@/components/admin/users/UsersView';

export const metadata: Metadata = { title: 'Users & roles' };

export default function UsersPage() {
  return <UsersView />;
}
