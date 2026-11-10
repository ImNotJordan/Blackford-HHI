import { PortalProviders } from "@/components/portal/providers";

/** Employees and clients · phone. One provider so choices carry across steps. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalProviders>{children}</PortalProviders>;
}
