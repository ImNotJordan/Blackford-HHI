import { ModuleTag } from "@/components/features";
import { InboxWorkspace } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Messages" };

const threads = [
  { id: "e1", from: "Blackford", channel: "Text", preview: "Your enrollment window is open — secure link inside.", time: "Mon", client: "Aisha Patel", unread: true },
  { id: "e2", from: "You", channel: "Text", preview: "Got it — finishing tonight.", time: "Mon", client: "Aisha Patel", unread: false },
];

export default function Page() {
  return (
    <EmployeeShell>
      <PageHeader eyebrow="Module B" title="Messages" description="Texts and emails about enrollment — no health details in SMS." />
      <ModuleTag code="B" name="Messages" />
      <div className="mt-4"><InboxWorkspace threads={threads} /></div>
    </EmployeeShell>
  );
}
