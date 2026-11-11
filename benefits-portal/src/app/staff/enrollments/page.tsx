import { StaffShell } from "@/components/shells";
import { EnrollmentsScreen } from "./screen";

export const metadata = { title: "Enrollments" };

export default function Page() {
  return (
    <StaffShell current="/staff/enrollments">
      <EnrollmentsScreen />
    </StaffShell>
  );
}
