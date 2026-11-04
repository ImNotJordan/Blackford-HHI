import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--brand-ink)] text-[var(--brand-ivory)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-ruby)] text-lg text-white"
            style={{ fontFamily: "var(--font-display)" }}
            aria-hidden
          >
            B
          </div>
          <div>
            <p
              className="m-0 text-lg leading-tight text-[var(--brand-ivory)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blackford
            </p>
            <p className="eyebrow m-0 !text-[var(--brand-pale-gold)]">
              Benefits Platform
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className="btn btn-secondary !bg-transparent !text-[var(--brand-ivory)] !border-[var(--brand-gray)]">
            Staff sign in
          </Link>
          <Link
            href="http://localhost:3001"
            className="btn btn-accent no-underline"
          >
            Employer portal
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-12 px-6 pb-20 pt-8">
        <div className="rise max-w-3xl">
          <p className="eyebrow !text-[var(--brand-pale-gold)]">
            Blackford &amp; Associates · Jacksonville
          </p>
          <h1
            className="mt-3 text-[clamp(42px,7vw,72px)] leading-[1.05] text-[var(--brand-ivory)]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Benefits work, held in one place.
          </h1>
          <p className="mt-5 max-w-[38rem] text-lg leading-relaxed text-[var(--brand-gray)]">
            Staff CRM and employer onboarding for groups, households, census,
            messaging, and renewals — built for Blackford account managers and
            the HR contacts they serve.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-accent no-underline">
              Sign in to the CRM
            </Link>
            <Link
              href="/work"
              className="btn btn-secondary no-underline !bg-transparent !text-[var(--brand-pale-gold)] !border-[var(--brand-gold)]"
            >
              Preview my work today
            </Link>
          </div>
        </div>

        <div className="rise rise-delay-1 grid gap-4 sm:grid-cols-3">
          {[
            { n: "12", label: "Staff screens in the MVP" },
            { n: "5", label: "Employer onboarding steps" },
            { n: "0", label: "Apps to install — browser only" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[10px] border border-[#3A352C] bg-[#201C16] px-5 py-6"
            >
              <p
                className="stat-figure-on-ink m-0 text-[42px] leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.n}
              </p>
              <p className="mt-3 m-0 text-sm text-[var(--brand-gray)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="rise rise-delay-2 grid gap-6 border-t border-[#3A352C] pt-10 md:grid-cols-3">
          {[
            {
              title: "Staff CRM",
              body: "Pipeline, inbox, bulk send, onboarding checklists, changes and renewals.",
            },
            {
              title: "Employer portal",
              body: "Invite, company details, plan agreement, census upload, and new hires.",
            },
            {
              title: "Built for trust",
              body: "One door to the data, every action logged, no health details in texts.",
            },
          ].map((block) => (
            <div key={block.title}>
              <h2
                className="m-0 text-2xl text-[var(--brand-ivory)]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
              >
                {block.title}
              </h2>
              <p className="mt-2 m-0 text-[15px] leading-relaxed text-[var(--brand-gray)]">
                {block.body}
              </p>
            </div>
          ))}
        </div>
      </main>

      <div className="signature-bar" aria-hidden>
        <span />
        <span />
      </div>
      <footer className="bg-[var(--brand-ink)] px-6 py-4 text-center font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--brand-gray)]">
        Blackford Benefits Platform · prepared with Hyacinth Industries
      </footer>
    </div>
  );
}
