import { Button, Card, Field, Input, PageHeader } from "@/components/ui";

export const metadata = { title: "Staff sign-in" };

export default function StaffSignInPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Staff sign-in"
        description="MFA required for Blackford admin and account managers (SOW module H)."
      />
      <Card className="space-y-4 p-6">
        <Field label="Work email">
          <Input type="email" placeholder="you@blackford.com" autoComplete="username" />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="••••••••" autoComplete="current-password" />
        </Field>
        <Field label="Authenticator code" hint="6-digit code from your authenticator app">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-widest" />
        </Field>
        <Button href="/staff" variant="accent" className="w-full">
          Sign in securely
        </Button>
      </Card>
    </div>
  );
}
