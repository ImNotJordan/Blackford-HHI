import { ModuleTag } from "@/components/features";
import { InboxWorkspace } from "@/components/interactive";
import { Button, PageHeader } from "@/components/ui";
import { inbox } from "@/lib/mock-data";

export const metadata = { title: "Inbox" };

export default function InboxPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module B · Shared inbox"
        title="Shared inbox"
        description="Replies land here and on the client timeline. STOP and HELP are handled automatically."
        actions={
          <Button href="/manager/compose" variant="accent">
            Compose
          </Button>
        }
      />
      <div className="mb-4">
        <ModuleTag code="B" name="Two-way text & email" />
      </div>
      <InboxWorkspace threads={inbox} />
    </div>
  );
}
