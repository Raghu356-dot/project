import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Settings"
        description="Configure agent behavior and manage system settings."
      />
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              This section is a placeholder for future settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              In a future version, you will be able to customize agent thresholds,
              manage integrations, and configure notification preferences here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
