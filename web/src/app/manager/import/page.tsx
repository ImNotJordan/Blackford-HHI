import { DuplicateBanner, ModuleTag } from "@/components/features";
import { ActionButton } from "@/components/interactive";
import { Card, Field, Input, PageHeader } from "@/components/ui";

export const metadata = { title: "Import book" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module A · Spreadsheet import"
        title="Import current book"
        description="Import groups and clients with duplicate detection by name, EIN, email, and phone."
      />
      <ModuleTag code="A" name="Import" />
      <div className="mt-4 space-y-4">
        <DuplicateBanner />
        <Card className="animate-rise space-y-4 p-6">
          <Field label="Spreadsheet" hint="CSV or XLSX from the Blackford template">
            <Input type="file" accept=".csv,.xlsx" />
          </Field>
          <ActionButton success="Import queued · duplicates listed">Run import</ActionButton>
        </Card>
      </div>
    </div>
  );
}
