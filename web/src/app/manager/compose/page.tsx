import {
  ConsentNotice,
  ModuleTag,
  QuietHoursNotice,
} from "@/components/features";
import {
  ActionButton,
  WorkingLanguageToggle,
} from "@/components/interactive";
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/ui";

export const metadata = { title: "Compose" };

export default function ComposePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Module B · Client communications"
        title="Compose message"
        description="Templates with merge fields. Bulk send to a group or filtered list such as “not yet enrolled.”"
        actions={
          <Button href="/manager/delivery" variant="secondary">
            Delivery tracking
          </Button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ModuleTag code="B" name="Communications" />
        <WorkingLanguageToggle />
      </div>
      <div className="stagger mb-4 space-y-3">
        <ConsentNotice />
        <QuietHoursNotice />
      </div>
      <Card className="animate-rise space-y-4 p-6">
        <Field label="Audience">
          <Select defaultValue="filter">
            <option value="group">Entire group · Harbor Light Manufacturing</option>
            <option value="filter">Filtered list · Not yet enrolled</option>
            <option value="one">Single client</option>
          </Select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Channel">
            <Select defaultValue="both">
              <option value="both">Text + email</option>
              <option value="text">Text only</option>
              <option value="email">Email only</option>
            </Select>
          </Field>
          <Field label="Template">
            <Select defaultValue="invite">
              <option value="invite">Enrollment invite</option>
              <option value="reminder">Window closing reminder</option>
              <option value="confirm">Confirmation</option>
            </Select>
          </Field>
        </div>
        <Field label="Subject (email)">
          <Input defaultValue="Your benefits enrollment is open" />
        </Field>
        <Field
          label="Message"
          hint="Texts carry a secure link only — never health details."
        >
          <Textarea defaultValue="Hi {{first_name}}, your enrollment window for {{group_name}} is open. Use this secure link to enroll — it works on your phone." />
        </Field>
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="secondary" success="Draft saved">
            Save draft
          </ActionButton>
          <ActionButton success="Queued · consent checked">
            Send with consent check
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}
