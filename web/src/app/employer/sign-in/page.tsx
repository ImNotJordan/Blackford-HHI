import { Button, Card, Field, Input, PageHeader } from "@/components/ui";

export const metadata = { title: "Employer sign-in" };

export default function EmployerSignInPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader
        title="Employer HR"
        description="Secure sign-in for the employer HR contact invited during onboarding."
      />
      <Card className="space-y-4 p-6">
        <Field label="Work email">
          <Input type="email" placeholder="hr@company.com" />
        </Field>
        <Field label="One-time code" hint="We text or email a code — no long-lived password required for MVP demos.">
          <Input inputMode="numeric" placeholder="000000" className="font-mono tracking-widest" />
        </Field>
        <Button href="/employer" variant="accent" className="w-full">
          Continue
        </Button>
      </Card>
    </div>
  );
}
