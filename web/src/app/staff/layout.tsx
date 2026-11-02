import { Suspense } from "react";
import { StaffShell } from "@/components/shells";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-ivory" aria-hidden />}
    >
      <StaffShell>{children}</StaffShell>
    </Suspense>
  );
}
