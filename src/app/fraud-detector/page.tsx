import { PageHeader } from "@/components/page-header";
import { FraudDetectorForm } from "./fraud-detector-form";

export default function FraudDetectorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Financial Fraud Detector"
        description="Analyze transaction data and user context to explain potential fraud."
      />
      <div className="mt-8">
        <FraudDetectorForm />
      </div>
    </div>
  );
}
