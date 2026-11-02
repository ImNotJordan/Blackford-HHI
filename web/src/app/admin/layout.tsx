import { Suspense } from "react";
import { AdminShell } from "@/components/shells";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
