import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
export const metadata = { title: "Account manager sign-in" };
export default function Page() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Account manager" description="MFA required. Access limited to your assigned groups." />
      <Card className="space-y-4 p-6">
        <Field label="Work email"><Input type="email" placeholder="you@blackford.com" /></Field>
        <Field label="Password"><Input type="password" /></Field>
        <Field label="Authenticator code"><Input inputMode="numeric" className="font-mono tracking-widest" placeholder="000000" /></Field>
        <Button href="/manager" variant="accent" className="w-full">Sign in</Button>
      </Card>
    </div>
  );
}
