import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Shield,
  Smartphone,
  UserCircle,
  Users,
} from "lucide-react";
import { roles } from "@/lib/roles";

const icons = {
  admin: Shield,
  manager: Users,
  employer: Building2,
  employee: Smartphone,
  client: UserCircle,
};

export default function HubPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink text-ivory">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 12% 18%, rgb(232 217 160 / 0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 88% 8%, rgb(200 25 30 / 0.22), transparent 50%), radial-gradient(ellipse 40% 30% at 70% 90%, rgb(168 130 15 / 0.12), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E8D9A0 1px, transparent 1px), linear-gradient(to bottom, #E8D9A0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-8">
        <header className="animate-rise flex items-start justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-[13px] font-semibold uppercase tracking-[0.22em] text-pale-gold">
              Blackford & Associates
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] text-ivory sm:text-5xl">
              Benefits CRM & enrollment
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory">
              Benefits CRM & enrollment from the Hyacinth SOW — pick your role
              for modules A–H, 17 automations, and carrier-ready workflows.
            </p>
          </div>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-pale-gold sm:block">
            MVP · May 2027
          </p>
        </header>

        <section className="stagger mt-12 grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((p) => {
            const Icon = icons[p.id];
            return (
              <Link
                key={p.href}
                href={p.href}
                className="hub-card group flex flex-col rounded-[10px] border border-pale-gold/25 bg-ivory/[0.04] p-6 no-underline"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-pale-gold/30 bg-ink text-pale-gold">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="label-mono-on-dark mt-6">{p.audience}</p>
                <h2 className="mt-2 font-display text-2xl text-ivory">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ivory">
                  {p.body}
                </p>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-pale-gold">
                  {p.modules}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-pale-gold">
                  Open portal
                  <ArrowRight className="hub-arrow h-4 w-4" aria-hidden />
                </span>
              </Link>
            );
          })}
        </section>

        <footer className="animate-fade mt-12" style={{ animationDelay: "400ms" }}>
          <div className="signature-bar mb-4" />
          <p className="text-xs text-pale-gold">
            Roles: Blackford admin · Account manager · Employer HR · Employee ·
            Client — Hyacinth Industries · SOW v2.0
          </p>
        </footer>
      </div>
    </div>
  );
}
