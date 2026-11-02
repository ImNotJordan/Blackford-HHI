import { ModuleTag } from "@/components/features";
import { InboxWorkspace } from "@/components/interactive";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Messages" };

const threads = [
  {
    id: "cm-1",
    from: "Blackford",
    channel: "Text",
    preview: "Your annual review is coming up — reply YES to schedule.",
    time: "Mon",
    client: "James Ortega",
    unread: true,
  },
  {
    id: "cm-2",
    from: "You",
    channel: "Text",
    preview: "YES — mornings work best.",
    time: "Mon",
    client: "James Ortega",
    unread: false,
  },
  {
    id: "cm-3",
    from: "Maya Chen",
    channel: "Email",
    preview: "ID card request received — expect mail in 7–10 days.",
    time: "Last week",
    client: "James Ortega",
    unread: false,
  },
];

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module B"
        title="Messages"
        description="Texts and emails with Blackford — SMS carries a secure link only, never health details."
      />
      <div className="mb-4">
        <ModuleTag code="B" name="Client communications" />
      </div>
      <InboxWorkspace threads={threads} />
    </div>
  );
}
