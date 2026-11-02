import { Suspense } from "react";
import { EmployerShell } from "@/components/shells";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-ivory" aria-hidden />}
    >
      <EmployerShell>{children}</EmployerShell>
    </Suspense>
  );
}
