import Link from "next/link";
import { PortalHeader } from "@/components/portal-header";

const OTP = ["2", "9", "0", "7", "1", "5"];

export default function EmployerInvitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader showNav={false} />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 pb-14">
        <div className="flex flex-col gap-1.5">
          <h1
            className="m-0 text-[30px] font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome, Tom
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            Dana Whitfield at Blackford invited you to manage benefits for{" "}
            <strong>Bartram Logistics</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-5">
          <section aria-labelledby="confirm-code" className="card card-invite">
            <span className="step-label">1 · Confirm it&apos;s you</span>
            <h2
              id="confirm-code"
              className="m-0 text-xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              We sent a code to (555) •••-0001
            </h2>
            <fieldset className="m-0 flex gap-2 border-0 p-0">
              <legend className="sr-only">6-digit code</legend>
              {OTP.map((digit, i) => (
                <input
                  key={i}
                  className="otp-digit"
                  aria-label={`Digit ${i + 1}`}
                  defaultValue={digit}
                  readOnly
                />
              ))}
            </fieldset>
            <Link href="#" className="text-[13px] font-semibold">
              Send the code by email instead
            </Link>
          </section>

          <section aria-labelledby="your-details" className="card card-invite">
            <span className="step-label">2 · Your details</span>
            <h2
              id="your-details"
              className="m-0 text-xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How should we reach you?
            </h2>
            <label className="field-label">
              Job title
              <input className="field-input" defaultValue="HR Director" readOnly />
            </label>
            <label className="field-label">
              Work email
              <input
                className="field-input"
                type="email"
                defaultValue="tom.brooks@example.com"
                readOnly
              />
            </label>
            <label className="field-label">
              Mobile for sign-in codes
              <input
                className="field-input"
                type="tel"
                defaultValue="(555) 010-0001"
                readOnly
              />
            </label>
          </section>

          <section aria-labelledby="agree" className="card card-invite">
            <span className="step-label">3 · Agree</span>
            <h2
              id="agree"
              className="m-0 text-xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Before you start
            </h2>
            <label className="flex gap-2.5 leading-relaxed">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-teal)]"
              />
              <span>
                I agree to receive and sign records electronically.{" "}
                <Link href="#" className="font-semibold">
                  Read the consent
                </Link>
              </span>
            </label>
            <label className="flex gap-2.5 leading-relaxed">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-teal)]"
              />
              <span>
                I&apos;ll only see and use employee data for benefits
                administration.
              </span>
            </label>
            <Link href="/employer/setup" className="btn btn-primary no-underline">
              Go to my group
            </Link>
            <p className="m-0 text-xs leading-relaxed text-[var(--color-text-muted)]">
              Next time, sign in with a one-time code — no password. You&apos;re
              signed out after 15 minutes idle.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
