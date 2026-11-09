import Link from "next/link";
import { PortalShell } from "@/components/portal-shell";

export default function EmployerSetupPage() {
  return (
    <PortalShell
        activeNav="plans"
        userName="Tom Brooks"
        userInitials="TB"
      >

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-8 pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1
              className="m-0 text-[30px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Check your 2027 plan setup
            </h1>
            <p className="m-0 text-[var(--color-text-muted)]">
              Bartram Logistics · effective Jul 1, 2027 · set up by Dana
              Whitfield. Confirm it, or tell us what to fix, before enrollment
              opens.
            </p>
          </div>
          <span className="tag tag-warn">Your sign-off due Apr 30</span>
        </div>

        <section aria-labelledby="plans-offered" className="card gap-3">
          <h2
            id="plans-offered"
            className="m-0 text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Plans offered and monthly cost
          </h2>
          <div className="overflow-x-auto">
            <table className="portal-table w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  <th scope="col">Employee</th>
                  <th scope="col">+ Spouse</th>
                  <th scope="col">+ Children</th>
                  <th scope="col">Family</th>
                  <th scope="col">You pay</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Medical PPO 1500</strong>
                  </td>
                  <td>$612.40</td>
                  <td>$1,286.04</td>
                  <td>$1,102.32</td>
                  <td>$1,775.96</td>
                  <td>75% employee, 50% dependents</td>
                </tr>
                <tr>
                  <td>
                    <strong>Medical HDHP 3500</strong>
                  </td>
                  <td>$471.15</td>
                  <td>$989.42</td>
                  <td>$848.07</td>
                  <td>$1,366.34</td>
                  <td>75% employee, 50% dependents</td>
                </tr>
                <tr>
                  <td>
                    <strong>Dental PPO</strong>
                  </td>
                  <td>$38.20</td>
                  <td>$76.40</td>
                  <td>$84.04</td>
                  <td>$122.24</td>
                  <td>100% employee only</td>
                </tr>
                <tr>
                  <td className="border-b-0">
                    <strong>Basic life $25,000</strong>
                  </td>
                  <td className="border-b-0">$4.25</td>
                  <td className="border-b-0">—</td>
                  <td className="border-b-0">—</td>
                  <td className="border-b-0">—</td>
                  <td className="border-b-0">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section aria-labelledby="eligibility" className="card gap-0">
            <h2
              id="eligibility"
              className="mb-1.5 mt-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Who is eligible
            </h2>
            <div className="detail-row">
              <span className="text-[var(--color-text-muted)]">Classes</span>
              <span className="font-semibold">Office, Drivers</span>
            </div>
            <div className="detail-row">
              <span className="text-[var(--color-text-muted)]">
                Minimum hours
              </span>
              <span className="font-semibold">30 a week</span>
            </div>
            <div className="detail-row">
              <span className="text-[var(--color-text-muted)]">
                Waiting period
              </span>
              <span className="font-semibold">
                1st of the month after 60 days
              </span>
            </div>
            <div className="detail-row border-b-0">
              <span className="text-[var(--color-text-muted)]">
                Dependent children
              </span>
              <span className="font-semibold">Up to age 26</span>
            </div>
          </section>

          <section aria-labelledby="windows" className="card gap-0">
            <h2
              id="windows"
              className="mb-1.5 mt-0 text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Enrollment windows
            </h2>
            <div className="detail-row">
              <span className="text-[var(--color-text-muted)]">
                Open enrollment
              </span>
              <span className="font-semibold">May 15 – May 31</span>
            </div>
            <div className="detail-row">
              <span className="text-[var(--color-text-muted)]">New hires</span>
              <span className="font-semibold">30 days from eligibility</span>
            </div>
            <div className="detail-row border-b-0">
              <span className="text-[var(--color-text-muted)]">Life events</span>
              <span className="font-semibold">30 days from the event</span>
            </div>
          </section>
        </div>

        <section aria-labelledby="agreement" className="card gap-3">
          <h2
            id="agreement"
            className="m-0 text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Employer agreement
          </h2>
          <p className="m-0 leading-relaxed text-[#3A4756]">
            Signing confirms the plans, contributions and eligibility above.
            It&apos;s signed electronically and kept with its audit trail on
            your group&apos;s record.
          </p>
          <label className="flex gap-2.5 leading-relaxed">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-teal)]"
            />
            <span>
              I agree to sign electronically.{" "}
              <Link href="#" className="font-semibold">
                Read the consent
              </Link>
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary">
              Something&apos;s wrong — tell Dana
            </button>
            <button type="button" className="btn btn-primary">
              Review and sign agreement
            </button>
          </div>
        </section>

        <p className="m-0 text-xs leading-relaxed text-[var(--color-text-muted)]">
          Sign in with a one-time code — no password. You&apos;re signed out
          after 15 minutes idle. Employee SSNs are stored securely; full SSNs
          are never shown here.
        </p>
      </main>
    </PortalShell>
  );
}
