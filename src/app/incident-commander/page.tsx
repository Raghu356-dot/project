import { PageHeader } from "@/components/page-header";
import { IncidentCommanderForm } from "./incident-commander-form";

export default function IncidentCommanderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Incident Commander"
        description="Correlate multiple security events to identify coordinated attacks."
      />
      <div className="mt-8">
        <IncidentCommanderForm />
      </div>
    </div>
  );
}
