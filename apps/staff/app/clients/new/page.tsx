import { StaffShell } from "@/components/staff-shell";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

export default function IndividualIntakePage() {
  return (
    <StaffShell>
      <PageHeader
        breadcrumb={[{ label: "Clients", href: "/clients" }, { label: "New individual client" }]}
        title="New individual client"
        description="Creates a household record and, if you choose, sends them a link to enroll themselves."
        actions={
          <>
            <button type="button" className="btn btn-secondary">
              Save draft
            </button>
            <button type="button" className="btn btn-primary">
              Create household
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
          <section aria-labelledby="who" className="card gap-4">
            <h2 id="who" className="section-title">
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
                <input className="field-in" type="email" defaultValue="rosa.ibarra@example.com" />
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

          <section aria-labelledby="need" className="card gap-4">
            <h2 id="need" className="section-title">
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
            <Callout tone="info" icon="clock">
              Turns 65 on Sep 2, 2026 — initial enrollment window Jun 1 to Dec 31.
              A task and reminders are created automatically.
            </Callout>
          </section>

          <section aria-labelledby="hh" className="card gap-3">
            <div className="card-head items-center">
              <h2 id="hh" className="section-title">
                Household members
              </h2>
              <button type="button" className="btn btn-secondary btn-sm">
                Add member
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline px-4 py-3">
              <span className="flex items-center gap-3">
                <span className="avatar avatar-sm">LI</span>
                <span>
                  <span className="font-semibold">Luis Ibarra</span>
                  <span className="text-muted"> · Spouse · 66</span>
                </span>
              </span>
              <Tag variant="ok">Medicare Supplement on file</Tag>
            </div>
          </section>
        </div>

        <aside className="flex min-w-0 flex-[2_1_300px] flex-col gap-5">
          <section aria-labelledby="dup" className="card gap-3 border-gold bg-parchment">
            <h2 id="dup" className="section-title">
              Possible match
            </h2>
            <p className="m-0 text-ink-soft">
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
          <section aria-labelledby="cons" className="card gap-3">
            <h2 id="cons" className="section-title">
              Consent and next step
            </h2>
            <div className="flex flex-col">
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                Rosa agreed to texts and email (recorded with time and source)
              </label>
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                Send an enrollment link in Spanish after creating
              </label>
            </div>
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
