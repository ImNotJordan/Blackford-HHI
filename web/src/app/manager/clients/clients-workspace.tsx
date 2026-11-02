"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, PageHeader, StatusChip } from "@/components/ui";
import { clients } from "@/lib/mock-data";

export function ClientsWorkspace() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const rows = useMemo(() => {
    return clients.filter((c) => {
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.city.toLowerCase().includes(q.toLowerCase()) ||
        c.id.includes(q);
      const matchF =
        filter === "All" ||
        (filter === "My book" && c.owner === "Maya Chen") ||
        c.type === filter ||
        (filter === "Medicare" && c.type === "Individual");
      return matchQ && matchF;
    });
  }, [q, filter]);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Find any client and open every plan, message, and document tied to them."
        actions={
          <>
            <Button href="/manager/import" variant="secondary">
              Import spreadsheet
            </Button>
            <Button href="/manager/prospects/new" variant="accent">
              New client
            </Button>
          </>
        }
      />
      <Card className="mb-4 p-4">
        <input
          className="min-h-11 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm text-ink"
          placeholder="Search by name, EIN, email, phone…"
          aria-label="Search clients"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", "Group", "Individual", "Medicare", "My book"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`min-h-10 rounded-full border px-3 text-sm ${
                f === filter
                  ? "border-ink bg-ink text-ivory"
                  : "border-hairline bg-surface text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Card>
      <Card className="divide-y divide-hairline overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-4 text-sm text-muted">No clients match this filter.</p>
        ) : (
          rows.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/manager/clients/${c.id}`}
                  className="font-medium text-ink no-underline"
                >
                  {c.name}
                </Link>
                <p className="text-xs text-muted">
                  {c.type} · {c.city} · {c.owner}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip tone="neutral">{c.pipeline}</StatusChip>
                <span className="font-mono text-xs text-muted">
                  {c.enrolled}/{c.employees}
                </span>
                <Button
                  href={`/manager/clients/${c.id}`}
                  variant="secondary"
                  className="!min-h-9 !text-sm"
                >
                  Open
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
