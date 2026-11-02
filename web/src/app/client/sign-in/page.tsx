import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Client sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Client portal" description="One-time code to your phone or email — your own record only." />
      <Card className="space-y-4 p-6">
        <Field label="Mobile or email"><Input placeholder="(904) 555-0199" /></Field>
        <Field label="One-time code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/client" variant="accent" className="w-full">Continue</Button>
      </Card>
    </div>
  );
}
