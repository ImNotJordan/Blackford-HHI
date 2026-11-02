import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  AutomationStrip,
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
import { clients, tasks } from "@/lib/mock-data";

export const metadata = { title: "Account manager" };

export default function ManagerHomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account manager · SOW roles"
        title="My work today"
        description="Assigned book of business — act on exceptions while 17 automations run enrollment season."
        actions={
          <>
            <Button href="/manager/inbox" variant="secondary">
              Inbox
            </Button>
            <Button href="/manager/verifications" variant="secondary">
              Verifications
            </Button>
            <Button href="/manager/clients" variant="accent">
              Find a client
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="A" name="Clients" />
        <ModuleTag code="B" name="Comms" />
        <ModuleTag code="C" name="Onboarding" />
        <ModuleTag code="F" name="Changes" />
        <ModuleTag code="G" name="Carriers" />
      </div>

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="ui-card p-5">
          <Stat label="Due today" value="7" note="Tasks on your queue" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Unread inbox" value="2" note="Shared staff inbox" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Groups enrolling" value="3" note="Below 70% flagged" />
        </Card>
        <Card className="ui-card p-5">
          <Stat label="Drafts ready" value="1" note="Awaiting admin approve" />
        </Card>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="animate-rise overflow-hidden">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <h2 className="font-display text-xl text-ink">Priority queue</h2>
            <Link
              href="/manager/tasks"
              className="text-link text-sm"
            >
              All tasks
            </Link>
          </div>
          <Table
            headers={["Task", "Client", "Due", ""]}
            rows={tasks.map((t) => [
              <div key={t.id}>
                <p className="font-medium text-ink">{t.title}</p>
                <div className="mt-1.5">
                  <StatusChip
                    tone={t.priority === "high" ? "danger" : "warning"}
                  >
                    {t.type}
                  </StatusChip>
                </div>
              </div>,
              t.client,
              <span key={`${t.id}-d`} className="font-mono text-xs text-ink">
                {t.due}
              </span>,
              <Link
                key={`${t.id}-a`}
                href={
                  t.type === "Carrier"
                    ? "/manager/carriers/cf-88"
                    : t.type === "Onboarding"
                      ? "/manager/onboarding/cl-1088"
                      : t.type === "Change"
                        ? "/manager/verifications/vr-101"
                        : "/manager/changes"
                }
                className="inline-flex items-center gap-1 text-sm font-medium text-ink no-underline"
              >
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Link>,
            ])}
          />
        </Card>

        <div className="stagger space-y-4">
          <FeatureCallout module="B" title="Harbor Light below 70%" tone="warning">
            <div className="flex gap-3">
              <AlertTriangle
                className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep"
                aria-hidden
              />
              <div>
                <p>
                  Automation 4 sent the outstanding list to HR and you. 44 people
                  still open · OE closes in 3 days.
                </p>
                <Button
                  href="/manager/groups/cl-1042"
                  variant="primary"
                  className="mt-4"
                >
                  View group
                </Button>
              </div>
            </div>
          </FeatureCallout>

          <Card className="p-5">
            <h3 className="text-ink">Assigned clients</h3>
            <ul className="mt-3 space-y-3">
              {clients
                .filter((c) => c.owner === "Maya Chen")
                .map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-3 border-b border-hairline pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/manager/clients/${c.id}`}
                      className="font-medium text-ink no-underline"
                    >
                      {c.name}
                    </Link>
                    {c.enrolled > 0 ? (
                      <CheckCircle2
                        className="h-4 w-4 text-gold-deep"
                        aria-hidden
                      />
                    ) : (
                      <StatusChip tone="warning">Needs work</StatusChip>
                    )}
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      </div>

      <AutomationStrip group="Enrollment" limit={4} />
    </div>
  );
}
