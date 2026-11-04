import { StaffShell } from "@/components/staff-shell";

export default function IndividualIntakePage() {
  return (
    <StaffShell>
      <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-text-muted)]">
        <span aria-hidden>/</span> New individual client
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="heading m-0 text-[30px] font-extrabold tracking-tight">
            New individual client
          </h1>
          <p className="m-0 text-[var(--color-text-muted)]">
            Creates a household record and, if you choose, sends them a link to
            enroll themselves.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary">
            Save draft
          </button>
          <button type="button" className="btn btn-primary">
            Create household
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
          <section aria-labelledby="who" className="card gap-3.5">
            <h2 id="who" className="heading m-0 text-lg font-bold">
              Primary client
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="field-label">
                First name
                <input className="field-in" defaultValue="Rosa" />
              </label>
              <label className="field-label">
                Last name
                <input className="field-in" defaultValue="Ibarra" />
              </label>
              <label className="field-label">
                Date of birth
                <input className="field-in" defaultValue="09/02/1961" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="field-label">
                Mobile
                <input className="field-in" type="tel" defaultValue="(555) 010-0003" />
              </label>
              <label className="field-label">
                Email
                <input
                  className="field-in"
                  type="email"
                  defaultValue="rosa.ibarra@example.com"
                />
              </label>
              <label className="field-label">
                Preferred language
                <select className="field-in">
                  <option>Spanish</option>
                  <option>English</option>
                </select>
              </label>
            </div>
            <label className="field-label">
              Home address
              <input className="field-in" defaultValue="77 Palm Ridge Dr, Brandon FL 33511" />
            </label>
          </section>

          <section aria-labelledby="need" className="card gap-3.5">
            <h2 id="need" className="heading m-0 text-lg font-bold">
              What they need
            </h2>
            <div className="flex flex-wrap gap-3">
              <label className="field-label">
                Client type
                <select className="field-in">
                  <option>Medicare (turning 65)</option>
                  <option>Individual / family under 65</option>
                  <option>Medicare, already enrolled</option>
                </select>
              </label>
              <label className="field-label">
                Coverage wanted from
                <input className="field-in" defaultValue="10/01/2026" />
              </label>
            </div>
            <div className="rounded-[10px] bg-[#EAF0FD] px-3.5 py-3 leading-normal text-[#1E3A8A]">
              Turns 65 on Sep 2, 2026 — initial enrollment window Jun 1 to Dec
              31. A task and reminders are created automatically.
            </div>
          </section>

          <section aria-labelledby="hh" className="card gap-3.5">
            <div className="flex items-center justify-between">
              <h2 id="hh" className="heading m-0 text-lg font-bold">
                Household members
              </h2>
              <button type="button" className="btn btn-secondary">
                Add member
              </button>
            </div>
            <div className="flex justify-between border-t border-[#EEF1F5] py-2.5">
              <span>
                <b>Luis Ibarra</b> · Spouse · 66
              </span>
              <span className="tag tag-ok">Medicare Supplement on file</span>
            </div>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-5">
          <section
            aria-labelledby="dup"
            className="card gap-3.5 border-[#F3D3AE] bg-[#FDF3E7]"
          >
            <h2 id="dup" className="heading m-0 text-lg font-bold text-[#5C3204]">
              Possible match
            </h2>
            <p className="m-0 leading-normal text-[#5C3204]">
              Luis Ibarra already has a household record (created 2024). Add Rosa
              to it instead of creating a new one?
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary">
                Keep separate
              </button>
              <button type="button" className="btn btn-primary">
                Add to Ibarra household
              </button>
            </div>
          </section>
          <section aria-labelledby="cons" className="card gap-3.5">
            <h2 id="cons" className="heading m-0 text-lg font-bold">
              Consent and next step
            </h2>
            <label className="flex items-start gap-2.5 leading-normal">
              <input type="checkbox" defaultChecked className="mt-0.5 h-5 w-5 accent-[var(--color-teal)]" />
              Rosa agreed to texts and email (recorded with time and source)
            </label>
            <label className="flex items-start gap-2.5 leading-normal">
              <input type="checkbox" defaultChecked className="mt-0.5 h-5 w-5 accent-[var(--color-teal)]" />
              Send an enrollment link in Spanish after creating
            </label>
            <label className="field-label">
              Owner
              <select className="field-in">
                <option>Dana Whitfield</option>
                <option>Marcus Lee</option>
              </select>
            </label>
          </section>
        </aside>
      </div>
    </StaffShell>
  );
}
