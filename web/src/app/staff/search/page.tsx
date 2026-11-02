import Link from "next/link";
import { Card, Input, PageHeader } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        title="Search"
        description="Saved filters and full-text across clients, groups, policies, and documents."
      />
      <Card className="mb-4 p-4">
        <Input
          autoFocus
          placeholder="Try “Harbor Light”, policy number, or EIN…"
          aria-label="Global search"
          defaultValue="Harbor"
        />
      </Card>
      <Card className="divide-y divide-hairline">
        {clients
          .filter((c) => c.name.toLowerCase().includes("harbor") || true)
          .slice(0, 3)
          .map((c) => (
            <Link
              key={c.id}
              href={`/staff/clients/${c.id}`}
              className="block px-5 py-4 no-underline hover:bg-ivory"
            >
              <p className="font-medium text-ink">{c.name}</p>
              <p className="text-sm text-muted">
                {c.type} · {c.pipeline} · {c.id}
              </p>
            </Link>
          ))}
      </Card>
    </div>
  );
}
