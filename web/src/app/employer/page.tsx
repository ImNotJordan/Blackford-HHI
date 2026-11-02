import {
  FeatureCallout,
  ModuleTag,
} from "@/components/features";
import {
  Button,
  Card,
  PageHeader,
  Stat,
  StatusChip,
  Table,
} from "@/components/ui";

export const metadata = { title: "Enrollment progress" };

export default function EmployerHomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Employer HR · Module C & D"
        title="Enrollment progress"
        description="Rivers & Reed LLP · Your group’s enrollment window and payroll deductions."
        actions={
          <>
            <Button href="/employer/new-hire" variant="secondary">
              New hire
            </Button>
            <Button href="/employer/setup" variant="accent">
              Setup approval
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="C" name="Onboarding" />
        <ModuleTag code="D" name="Benefits portal" />
      </div>

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="ui-card p-5">
          <Stat label="Complete" value="18" note="Of 42 employees" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="In progress" value="9" note="Saved mid-flow" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Not started" value="15" note="Reminders running" />
        </Card>
      </div>

      <Card className="animate-rise mb-4 border-gold bg-parchment p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono">Automation 7 · Weekly digest</p>
            <p className="mt-1 font-display text-3xl text-ink">43% complete</p>
            <p className="mt-1 text-sm text-ink">
              Window open through Feb 28, 2027
            </p>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-hairline">
            <div
              className="progress-fill h-full rounded-full bg-ink"
              style={{ width: "43%" }}
            />
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <FeatureCallout
          module="C"
          title="Setup must be locked before invites"
          tone="info"
        >
          Census validated, plans and contributions confirmed, then you approve
          the setup summary. Status becomes Ready to enroll and invites schedule
          automatically.
        </FeatureCallout>
        <Card className="animate-rise p-5">
          <p className="label-mono">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["Company details", "/employer/company"],
              ["Sign agreement", "/employer/agreement"],
              ["Documents", "/employer/documents"],
              ["Plans & rates", "/employer/plans"],
              ["Contributions", "/employer/contributions"],
              ["OE & windows", "/employer/windows"],
              ["Invites", "/employer/invites"],
              ["Add new hire", "/employer/new-hire"],
              ["Individual intake", "/employer/intake"],
              ["Setup approval", "/employer/setup"],
            ].map(([label, href]) => (
              <li key={href}>
                <Button href={href} variant="ghost" className="!justify-start !px-2">
                  {label}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="animate-rise overflow-hidden">
        <Table
          headers={["Employee", "Status", "Last activity", "Deduction"]}
          rows={[
            [
              "Elena Brooks",
              <StatusChip key="s1" tone="success">
                Complete
              </StatusChip>,
              "Yesterday",
              "$204.90 / pay",
            ],
            [
              "Noah Grant",
              <StatusChip key="s2" tone="warning">
                In progress
              </StatusChip>,
              "Today · 8:14 AM",
              "—",
            ],
            [
              "Sofia Nguyen",
              <StatusChip key="s3" tone="neutral">
                Not started
              </StatusChip>,
              "Invite sent",
              "—",
            ],
          ]}
        />
      </Card>
    </div>
  );
}
