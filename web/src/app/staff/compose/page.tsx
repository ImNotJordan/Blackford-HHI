import { Button, Card, Field, Input, PageHeader, Select, Textarea } from "@/components/ui";

export const metadata = { title: "Compose" };

export default function ComposePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Compose message"
        description="Templates with merge fields, English and Spanish. Texts carry a secure link — never health details."
      />
      <Card className="space-y-4 p-6">
        <Field label="Audience">
          <Select defaultValue="group">
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
        <Field label="Language">
          <Select defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </Select>
        </Field>
        <Field label="Subject (email)">
          <Input defaultValue="Your benefits enrollment is open" />
        </Field>
        <Field
          label="Message"
          hint="Quiet hours: 8 a.m.–8 p.m. recipient time zone. Consent checked before send."
        >
          <Textarea defaultValue="Hi {{first_name}}, your enrollment window for {{group_name}} is open. Use this secure link to enroll — it works on your phone." />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Save draft</Button>
          <Button variant="accent">Send with consent check</Button>
        </div>
      </Card>
    </div>
  );
}
