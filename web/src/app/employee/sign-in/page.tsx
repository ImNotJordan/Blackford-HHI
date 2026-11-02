import { OtpSignIn } from "@/components/interactive";
import { PageHeader } from "@/components/ui";
import { EmployeeShell } from "@/components/shells";

export const metadata = { title: "Sign in" };

export default function EmployeeSignInPage() {
  return (
    <EmployeeShell>
      <PageHeader
        title="Sign in with a code"
        description="We sent a one-time code to the phone or email on file. No password."
      />
      <OtpSignIn continueHref="/employee" />
    </EmployeeShell>
  );
}
