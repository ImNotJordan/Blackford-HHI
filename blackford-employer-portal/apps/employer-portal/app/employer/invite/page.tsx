import Link from "next/link";
import { PortalHeader } from "@/components/portal-header";
import { Field } from "@/components/ui";

const OTP = ["2", "9", "0", "7", "1", "5"];

export default function EmployerInvitePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PortalHeader />

      <main id="main" className="page rise">
        <header className="page-header">
          <div className="page-header-text">
            <p className="page-context">Invitation · Bartram Logistics</p>
            <h1 className="page-title">Welcome, Tom</h1>
            <p className="page-lede">
              Dana Whitfield at Blackford invited you to manage benefits for{" "}
              <strong className="text-[var(--color-text)]">Bartram Logistics</strong>.
              Three quick steps and you&apos;re in.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap items-stretch gap-6">
          <section aria-labelledby="confirm-code" className="card card-invite">
            <span className="step-label">Step 1 · Confirm it&apos;s you</span>
            <h2 id="confirm-code" className="card-title">
              We sent a code to <span className="whitespace-nowrap">(555) •••-0001</span>
            </h2>
            <fieldset className="otp-group">
              <legend className="sr-only">6-digit code</legend>
              {OTP.map((digit, i) => (
                <input
                  key={i}
                  className="otp-digit"
                  aria-label={`Digit ${i + 1}`}
                  inputMode="numeric"
                  defaultValue={digit}
                  readOnly
                />
              ))}
            </fieldset>
            <Link href="#" className="text-sm font-semibold">
              Send the code by email instead
            </Link>
          </section>

          <section aria-labelledby="your-details" className="card card-invite">
            <span className="step-label">Step 2 · Your details</span>
            <h2 id="your-details" className="card-title">
              How should we reach you?
            </h2>
            <Field label="Job title">
              <input className="field-input" defaultValue="HR Director" readOnly />
            </Field>
            <Field label="Work email">
              <input
                className="field-input"
                type="email"
                defaultValue="tom.brooks@example.com"
                readOnly
              />
            </Field>
            <Field label="Mobile for sign-in codes">
              <input
                className="field-input"
                type="tel"
                defaultValue="(555) 010-0001"
                readOnly
              />
            </Field>
          </section>

          <section aria-labelledby="agree" className="card card-invite">
            <span className="step-label">Step 3 · Agree</span>
            <h2 id="agree" className="card-title">
              Before you start
            </h2>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>
                I agree to receive and sign records electronically.{" "}
                <Link href="#" className="font-semibold">
                  Read the consent
                </Link>
              </span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>
                I&apos;ll only see and use employee data for benefits
                administration.
              </span>
            </label>
            <div className="mt-auto flex flex-col gap-3 pt-2">
              <Link href="/employer/company" className="btn btn-primary btn-block">
                Go to my group →
              </Link>
              <p className="text-caption text-[13px] leading-relaxed">
                Next time, sign in with a one-time code — no password.
                You&apos;re signed out after 15 minutes idle.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
