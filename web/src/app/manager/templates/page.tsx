import { ModuleTag } from "@/components/features";
import { ActionButton, WorkingLanguageToggle } from "@/components/interactive";
import { Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui";

export const metadata = { title: "Templates" };

export default function Page() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Module B"
        title="Message templates"
        description="Merge-field templates in English and Spanish for invites, reminders, and confirmations."
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ModuleTag code="B" name="Templates" />
        <WorkingLanguageToggle />
      </div>
      <Card className="space-y-4 p-4 sm:p-5">
        <Field label="Template">
          <Select defaultValue="invite">
            <option value="invite">Enrollment invite</option>
            <option value="reminder">Window closing</option>
            <option value="confirm">Confirmation</option>
            <option value="qle">Life event received</option>
          </Select>
        </Field>
        <Field label="Name">
          <Input defaultValue="Enrollment invite" />
        </Field>
        <Field label="Subject (email)">
          <Input defaultValue="Your benefits enrollment is open" />
        </Field>
        <Field label="Body" hint="Merge fields: {{first_name}} {{group_name}} {{secure_link}}">
          <Textarea defaultValue="Hi {{first_name}}, your enrollment window for {{group_name}} is open. Use this secure link: {{secure_link}}" />
        </Field>
        <ActionButton success="Template saved">Save template</ActionButton>
      </Card>
    </div>
  );
}
