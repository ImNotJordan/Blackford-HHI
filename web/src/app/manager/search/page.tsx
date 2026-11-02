import { ModuleTag } from "@/components/features";
import { SavedSearchFilters } from "@/components/gap-features";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A"
        title="Search & saved filters"
        description="Full-text across clients, groups, policies, and documents — plus filters like not-yet-enrolled."
      />
      <div className="mb-4">
        <ModuleTag code="A" name="Search" />
      </div>
      <SavedSearchFilters />
    </div>
  );
}
