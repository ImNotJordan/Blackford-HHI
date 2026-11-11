import type { Metadata } from 'next';
import { Team } from '@/components/admin/team/Team';

export const metadata: Metadata = { title: 'Team & capacity' };

export default function AdminTeamPage() {
  return <Team />;
}
