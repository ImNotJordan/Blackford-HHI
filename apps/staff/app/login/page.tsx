import Link from "next/link";

export default function StaffLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-ivory)]">
      <div className="mx-auto grid w-full max-w-6xl flex-1 lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between bg-[var(--brand-ink)] px-10 py-12 text-[var(--brand-ivory)] lg:flex">
          <div>
            <p className="eyebrow !text-[var(--brand-pale-gold)]">Staff CRM</p>
            <h1
              className="mt-4 max-w-sm text-[42px] leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Sign in to your book of business.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--brand-gray)]">
              Password plus authenticator app for every Blackford staff
              account. Sessions end after 30 idle minutes.
            </p>
          </div>
          <div>
            <p
              className="text-[56px] leading-none text-[var(--brand-pale-gold)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              48
            </p>
            <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--brand-gray)]">
              Active groups in Dana’s book · demo
            </p>
          </div>
          <div className="signature-bar absolute bottom-0 left-0 right-0" aria-hidden>
            <span />
            <span />
          </div>
        </aside>

        <main className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="rise mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 no-underline">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-ink)] text-[var(--brand-ivory)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                B
              </span>
              <span className="text-sm font-semibold text-[var(--brand-ink)]">
                Blackford
              </span>
            </Link>

            <h2
              className="mt-10 text-[32px] leading-tight text-[var(--brand-ink)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            >
              Welcome back
            </h2>
            <p className="mt-2 text-[15px] text-[var(--brand-gray)]">
              Use your Blackford staff email. Demo accepts any password, then
              opens the CRM.
            </p>

            <form
              action="/work"
              className="mt-8 flex flex-col gap-4"
              method="get"
            >
              <label className="field-label">
                Work email
                <input
                  className="field-in"
                  type="email"
                  name="email"
                  autoComplete="username"
                  defaultValue="dana.whitfield@example.com"
                  required
                />
              </label>
              <label className="field-label">
                Password
                <input
                  className="field-in"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  defaultValue="••••••••"
                  required
                />
              </label>
              <label className="field-label">
                Authenticator code
                <input
                  className="field-in"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="6-digit code"
                  defaultValue="290715"
                  name="otp"
                  required
                />
              </label>
              <button type="submit" className="btn btn-accent mt-2">
                Sign in
              </button>
            </form>

            <p className="mt-6 text-[13px] text-[var(--brand-gray)]">
              Employer HR?{" "}
              <a href="http://localhost:3001/employer/invite">
                Open the employer portal
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
