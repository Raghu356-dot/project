import { PageHeader } from "@/components/page-header";
import { EmailScreenerForm } from "./email-screener-form";

export default function EmailScreenerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Email Screener"
        description="Analyze email content to identify phishing, scams, or malicious intent."
      />
      <div className="mt-8">
        <EmailScreenerForm />
      </div>
    </div>
  );
}
