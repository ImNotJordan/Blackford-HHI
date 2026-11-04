import Link from "next/link";

export function SearchToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <label className="input max-w-[520px] flex-1">
        <span className="sr-only">Search</span>
        <svg
          aria-hidden
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#586575"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search clients, groups, employees, policy numbers"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Link href="/import" className="btn btn-secondary no-underline">
          Import spreadsheet
        </Link>
        <Link href="/clients/new" className="btn btn-primary no-underline">
          New client
        </Link>
      </div>
    </div>
  );
}
