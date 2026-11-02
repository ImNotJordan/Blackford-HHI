import { Suspense } from "react";
import { ClientShell } from "@/components/shells";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <ClientShell>{children}</ClientShell>
    </Suspense>
  );
}
