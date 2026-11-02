import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { inbox } from "@/lib/mock-data";

export const metadata = { title: "Inbox" };

export default function InboxPage() {
  return (
    <div>
      <PageHeader
        title="Shared inbox"
        description="Replies land here and on the client timeline. STOP and HELP are handled automatically."
        actions={<Button href="/staff/compose" variant="accent">Compose</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="divide-y divide-hairline">
          {inbox.map((m) => (
            <button
              key={m.id}
              type="button"
              className="flex w-full cursor-pointer flex-col gap-1 px-4 py-4 text-left hover:bg-ivory"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{m.from}</span>
                <span className="font-mono text-xs text-muted">{m.time}</span>
              </div>
              <p className="text-sm text-ink/75">{m.preview}</p>
              <div className="mt-1 flex gap-2">
                <StatusChip tone={m.unread ? "warning" : "neutral"}>{m.channel}</StatusChip>
                <StatusChip tone="neutral">{m.client}</StatusChip>
              </div>
            </button>
          ))}
        </Card>
        <Card className="flex min-h-[420px] flex-col p-5">
          <div className="border-b border-hairline pb-4">
            <h2 className="font-display text-xl">Aisha Patel</h2>
            <p className="text-sm text-muted">Harbor Light · Text thread</p>
          </div>
          <div className="flex-1 space-y-3 py-4">
            <div className="max-w-[80%] rounded-[10px] bg-ivory px-3 py-2 text-sm">
              Your enrollment window is open. Secure link inside — no password needed.
            </div>
            <div className="ml-auto max-w-[80%] rounded-[10px] bg-ink px-3 py-2 text-sm text-ivory">
              Got the link — starting enrollment now
            </div>
          </div>
          <div className="flex gap-2 border-t border-hairline pt-4">
            <input
              className="min-h-11 flex-1 rounded-[10px] border border-hairline px-3 text-sm"
              placeholder="Reply from the record…"
              aria-label="Reply"
            />
            <Button variant="primary">Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
