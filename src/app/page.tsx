import Link from "next/link";
import { BrandMark } from "@/components/ui";

export const metadata = { title: "Benefits portal screens" };

const PHONE = [
  { n: "1", label: "Sign in", href: "/portal/sign-in" },
  { n: "2", label: "Start and your details", href: "/portal/start" },
  { n: "3", label: "Dependents", href: "/portal/dependents" },
  { n: "4", label: "Compare plans", href: "/portal/compare" },
  { n: "5", label: "Elect or waive", href: "/portal/elect" },
  { n: "6", label: "Beneficiaries", href: "/portal/beneficiaries" },
  { n: "7", label: "Review and sign", href: "/portal/sign" },
  { n: "8", label: "Confirmation", href: "/portal/done" },
  { n: "After", label: "My benefits and renewal", href: "/portal/my-benefits" },
  { n: "After", label: "Report a life event", href: "/portal/life-event" },
  { n: "After", label: "Ask for help (service requests)", href: "/portal/help" },
];

const STAFF = [
  { label: "Agent-assisted enrollment (iPad)", href: "/staff/assist" },
  { label: "Enrollments list", href: "/staff/enrollments" },
  { label: "Employer enrollment progress", href: "/employer/progress" },
  { label: "Employer payroll deduction updates", href: "/employer/payroll" },
];

const STATES = [
  { label: "Link expired", href: "/portal/link/expired" },
  { label: "Welcome back (save and resume)", href: "/portal/link/welcome-back" },
  { label: "Already enrolled", href: "/portal/link/enrolled" },
  { label: "Window closed", href: "/portal/link/closed" },
  { label: "Signed out when idle", href: "/portal/link/signed-out" },
  { label: "Not my link", href: "/portal/link/not-mine" },
];

const card = "flex flex-col gap-3 rounded-xl border border-line bg-surface px-5 py-4";
const group = "m-0 text-[11px] font-bold tracking-[0.08em] text-ink-2 uppercase";
const list = "m-0 flex list-none flex-col gap-0.5 p-0";
const item = "flex min-h-11 items-center gap-3 rounded-lg px-2 font-medium no-underline hover:bg-canvas";

export default function Home() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[1100px] flex-col gap-7 px-4 pt-10 pb-14 text-sm sm:px-8">
      <header className="flex flex-col gap-2">
        <span className="flex items-center gap-2.5">
          <BrandMark size={34} />
          <span className="text-xs font-bold tracking-[0.1em] text-brand uppercase">Module D · employee side of E and F</span>
        </span>
        <h1 className="m-0 font-display text-[38px] font-extrabold tracking-tight">Benefits portal</h1>
        <p className="m-0 max-w-[760px] text-base leading-normal text-ink-2">
          Employees and clients open a text or email link on any device, confirm with a code, and finish enrollment in one session. Staff
          and employers watch the same enrollment records. 15 screens, plus the entry states from the build-ready boards.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby="phone" className={card}>
          <h2 id="phone" className={group}>
            Employees and clients · phone
          </h2>
          <ol className={list}>
            {PHONE.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={item}>
                  <span className="w-11 flex-none font-mono text-xs text-muted">{s.n}</span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-col gap-4">
          <section aria-labelledby="staff" className={card}>
            <h2 id="staff" className={group}>
              Staff and employer views
            </h2>
            <ul className={list}>
              {STAFF.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={item}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="states" className={card}>
            <h2 id="states" className={group}>
              Portal entry states
            </h2>
            <ul className={list}>
              {STATES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={item}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <p className="m-0 rounded-xl border border-dashed border-field bg-surface px-4 py-3 font-mono text-xs leading-relaxed text-ink-2">
        Demo build: sample data, no backend. Any 6-digit code signs in. Portal choices live in memory only and reset on reload.
      </p>
    </main>
  );
}
