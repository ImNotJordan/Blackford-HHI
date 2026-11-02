import { ModuleTag } from "@/components/features";
import { SettingsSaveForm } from "@/components/working";
import { Card, Field, PageHeader, Select } from "@/components/ui";
import { Button } from "@/components/ui";

export const metadata = { title: "Security settings" };

export default function Page() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Module H"
        title="Security settings"
        description="MFA for staff, session timeouts, HIPAA hosting under a BAA."
        actions={
          <Button href="/admin/mfa-setup" variant="secondary">
            MFA setup
          </Button>
        }
      />
      <ModuleTag code="H" name="Security" />
      <Card className="mt-4 space-y-4 p-4 sm:p-6">
        <SettingsSaveForm>
          <Field label="Staff MFA policy">
            <Select defaultValue="required">
              <option value="required">Required for all staff</option>
            </Select>
          </Field>
          <Field label="Idle sign-out">
            <Select defaultValue="30">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
            </Select>
          </Field>
          <Field label="Quiet hours default">
            <Select defaultValue="8-20">
              <option value="8-20">8 a.m. – 8 p.m. recipient TZ</option>
            </Select>
          </Field>
        </SettingsSaveForm>
      </Card>
    </div>
  );
}
