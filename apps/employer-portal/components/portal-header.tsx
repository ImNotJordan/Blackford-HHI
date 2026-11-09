import Link from "next/link";
import { SignatureBar } from "@/components/ui";

/** Brand-only top bar for signed-out screens (invite and sign-in). */
export function PortalHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark brand-mark-ink" aria-hidden>
            B
          </span>
          <span className="flex flex-col">
            <span className="brand-name">Blackford &amp; Associates</span>
            <span className="brand-sub">Employer portal</span>
          </span>
        </Link>
      </div>
      <SignatureBar />
    </header>
  );
}
