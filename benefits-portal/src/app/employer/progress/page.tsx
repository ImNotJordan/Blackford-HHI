import { EmployerShell } from "@/components/shells";
import { ProgressScreen } from "./screen";

export const metadata = { title: "Open enrollment progress" };

export default function Page() {
  return (
    <EmployerShell current="/employer/progress">
      <ProgressScreen />
    </EmployerShell>
  );
}
