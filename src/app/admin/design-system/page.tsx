import type { Metadata } from 'next';
import { DesignSystemView } from '@/components/admin/design-system/DesignSystemView';

export const metadata: Metadata = { title: 'Design system' };

export default function DesignSystemPage() {
  return <DesignSystemView />;
}
