import { ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, PageHeader, Textarea } from "@/components/ui";

export const metadata = { title: "Notes" };

const notes = [
  { who: "Maya Chen", when: "Mar 3 · 9:12 AM", body: "Harbor Light HR asked to push OE reminder Friday." },
  { who: "Sam Ortiz", when: "Mar 2 · 4:40 PM", body: "James Ortega interested in Medicare Supplement review." },
  { who: "Maya Chen", when: "Mar 1 · 11:02 AM", body: "Rivers census errors — waiting on hire dates." },
];

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Module A" title="Notes" description="Staff notes on the book — visible on client timelines." />
      <ModuleTag code="A" name="Notes" />
      <Card className="mt-4 space-y-3 p-4">
        <Textarea placeholder="Add a note…" defaultValue="" />
        <ActionButton success="Note saved on record">Save note</ActionButton>
      </Card>
      <ul className="mt-4 space-y-3">
        {notes.map((n) => (
          <Card key={n.when} className="p-4">
            <p className="text-xs text-muted">{n.who} · {n.when}</p>
            <p className="mt-1 text-sm text-ink">{n.body}</p>
          </Card>
        ))}
      </ul>
    </div>
  );
}
