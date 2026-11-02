import { ModuleTag } from "@/components/features";
import { TaskBoard } from "@/components/working";
import { Button, PageHeader } from "@/components/ui";
import { tasks } from "@/lib/mock-data";

export const metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Module A"
        title="Tasks & service requests"
        description="Complete or open each item. Overdue work escalates on the team queue."
        actions={
          <Button href="/manager/team-queue" variant="secondary">
            Team queue
          </Button>
        }
      />
      <ModuleTag code="A" name="Tasks" />
      <div className="mt-4">
        <TaskBoard
          initial={tasks.map((t) => ({
            id: t.id,
            title: t.title,
            type: t.type,
            client: t.client,
            due: t.due,
            priority: t.priority,
            href:
              t.type === "Carrier"
                ? "/manager/carriers/cf-88"
                : t.type === "Onboarding"
                  ? "/manager/onboarding/cl-1088"
                  : t.type === "Change"
                    ? "/manager/verifications/vr-101"
                    : "/manager/delivery",
          }))}
        />
      </div>
    </div>
  );
}
