import { Suspense } from "react";

/** Employee pages wrap EmployeeShell per-route for enrollment step banners. */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" aria-hidden />}>
      {children}
    </Suspense>
  );
}
