import { AcaCaptureNote, ModuleTag } from "@/components/features";
import { Card, PageHeader, Stat, Table } from "@/components/ui";

export const metadata = { title: "ACA data capture" };

export default function Page() {
  return (
    <div>
      <PageHeader
        eyebrow="Module H · Release 2 files later"
        title="ACA data capture"
        description="Offers, elections, and waivers by month are captured from day one. Filing ships in Release 2."
      />
      <ModuleTag code="H" name="ACA capture" />
      <div className="stagger mt-4 mb-4 grid gap-4 sm:grid-cols-3">
        <Card className="ui-card p-5"><Stat label="Offers logged" value="1,204" /></Card>
        <Card className="ui-card p-5"><Stat label="Elections" value="986" /></Card>
        <Card className="ui-card p-5"><Stat label="Waivers" value="218" /></Card>
      </div>
      <AcaCaptureNote />
      <Card className="mt-4 animate-rise overflow-hidden">
        <Table
          headers={["Month", "Offers", "Elections", "Waivers"]}
          rows={[
            ["Jan 2027", "402", "318", "84"],
            ["Feb 2027", "410", "340", "70"],
            ["Mar 2027", "392", "328", "64"],
          ]}
        />
      </Card>
    </div>
  );
}
