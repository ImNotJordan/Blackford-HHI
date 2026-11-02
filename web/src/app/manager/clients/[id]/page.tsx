import { Suspense } from "react";
import Link from "next/link";
import {
  ActivityTimeline,
  DuplicateBanner,
  ModuleTag,
  PipelineBar,
} from "@/components/features";
import { RouteFallback } from "@/components/route-fallback";
import {
  Button,
  Card,
  PageHeader,
  StatusChip,
  Table,
} from "@/components/ui";
import { clients, inbox } from "@/lib/mock-data";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <ClientDetailContent params={params} />
    </Suspense>
  );
}

async function ClientDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = clients.find((c) => c.id === id) ?? clients[0];

  return (
    <div>
      <PageHeader
        title={client.name}
        description={`${client.type} · ${client.city} · Effective ${client.effective}`}
        actions={
          <>
            <Button href="/manager/compose" variant="secondary">
              Message
            </Button>
            <Button href={`/manager/groups/${client.id}`} variant="accent">
              Open group
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <ModuleTag code="A" name="Client record" />
        <StatusChip tone="active">{client.pipeline}</StatusChip>
        <StatusChip tone="neutral">Owner · {client.owner}</StatusChip>
        <StatusChip tone="auto">ID · {client.id}</StatusChip>
      </div>

      <div className="mb-6">
        <PipelineBar active={client.pipeline} />
      </div>

      {client.id === "cl-1088" ? (
        <div className="mb-4">
          <DuplicateBanner />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="animate-rise p-5 lg:col-span-2">
          <h2 className="font-display text-xl text-ink">Plans & policies</h2>
          <Table
            headers={["Plan", "Carrier", "Policy #", "Effective"]}
            rows={[
              [
                "Medical · Gold PPO 1500",
                "Florida Blue",
                "FB-884210",
                client.effective,
              ],
              ["Dental · PPO", "Guardian", "GD-10221", client.effective],
              ["Vision", "MetLife", "MV-4410", client.effective],
            ]}
          />
        </Card>
        <Card className="animate-rise p-5">
          <h2 className="font-display text-xl text-ink">Household</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex justify-between border-b border-hairline pb-2">
              <span className="text-muted">Primary</span>
              <span className="font-medium text-ink">Aisha Patel</span>
            </li>
            <li className="flex justify-between border-b border-hairline pb-2">
              <span className="text-muted">Spouse</span>
              <span className="font-medium text-ink">Omar Patel</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Dependent</span>
              <span className="font-medium text-ink">Nora Patel · age 4</span>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="animate-rise p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Messages</h2>
            <Link
              href="/manager/inbox"
              className="text-link text-sm"
            >
              Inbox
            </Link>
          </div>
          <ul className="space-y-3">
            {inbox.slice(0, 2).map((m) => (
              <li
                key={m.id}
                className="rounded-[10px] border border-hairline p-3 text-sm"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-ink">{m.from}</span>
                  <span className="font-mono text-xs text-muted">{m.time}</span>
                </div>
                <p className="mt-1 text-muted">{m.preview}</p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="animate-rise p-5">
          <h2 className="font-display text-xl text-ink">Activity timeline</h2>
          <div className="mt-4">
            <ActivityTimeline
              items={[
                {
                  title: "Confirmation PDF stored on record",
                  meta: "Today · Automation 3",
                },
                {
                  title: "Enrollment completed · medical + dental",
                  meta: "Today · Module D",
                },
                {
                  title: "OTP sign-in from iPhone",
                  meta: "Today · Module D",
                },
                {
                  title: "Invite sent by text and email",
                  meta: "Mar 1 · Automation 1",
                },
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
