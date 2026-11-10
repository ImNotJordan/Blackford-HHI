import { EmployerShell } from "@/components/shells";
import { PayrollScreen } from "./screen";

export const metadata = { title: "Payroll deduction updates" };

export default function Page() {
  return (
    <EmployerShell current="/employer/payroll">
      <PayrollScreen />
    </EmployerShell>
  );
}
