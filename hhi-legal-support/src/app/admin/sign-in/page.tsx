import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SignIn } from '@/components/admin/shell/SignIn';

export const metadata: Metadata = { title: 'Staff sign-in' };

export default function AdminSignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
