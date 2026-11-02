import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Admin sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Blackford admin" description="MFA required. Full platform access." />
      <Card className="space-y-4 p-6">
        <Field label="Work email"><Input type="email" placeholder="admin@blackford.com" /></Field>
        <Field label="Password"><Input type="password" /></Field>
        <Field label="Authenticator code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/admin" variant="accent" className="w-full">Sign in</Button>
      </Card>
    </div>
  );
}
