import { Card, PageHeader, Table } from "@/components/ui";
export const metadata = { title: "Plans & IDs" };
export default function Page() {
  return (
    <div>
      <PageHeader title="Plans & ID cards" description="Carriers, policy numbers, and effective dates on your record." />
      <Card>
        <Table headers={["Plan", "Carrier", "Policy #", "Effective"]} rows={[
          ["Medicare Supplement G", "Florida Blue", "MS-441902", "2026-06-01"],
          ["Part D Rx", "Wellcare", "PD-22910", "2026-06-01"],
        ]} />
      </Card>
    </div>
  );
}
