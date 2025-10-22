import { PageHeader } from "@/components/page-header";
import { UrlAssessorForm } from "./url-assessor-form";

export default function UrlAssessorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="URL Risk Assessor"
        description="Examine a URL to determine if it's a phishing site or hosts malware."
      />
      <div className="mt-8">
        <UrlAssessorForm />
      </div>
    </div>
  );
}
