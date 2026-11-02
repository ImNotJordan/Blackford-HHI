import { Suspense } from "react";
import { ManagerShell } from "@/components/shells";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      <ManagerShell>{children}</ManagerShell>
    </Suspense>
  );
}
