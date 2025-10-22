import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailScreenerForm } from "@/app/email-screener/email-screener-form";
import { UrlAssessorForm } from "@/app/url-assessor/url-assessor-form";
import { MalwareAnalyzerForm } from "@/app/malware-analyzer/malware-analyzer-form";
import { FraudDetectorForm } from "@/app/fraud-detector/fraud-detector-form";
import { IncidentCommanderForm } from "@/app/incident-commander/incident-commander-form";

export default function AnalysisToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Analysis Tools"
        description="A suite of AI-powered tools to analyze and mitigate security threats."
      />
      <div className="mt-8">
        <Tabs defaultValue="email-screener">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5">
            <TabsTrigger value="email-screener">Email Screener</TabsTrigger>
            <TabsTrigger value="url-assessor">URL Assessor</TabsTrigger>
            <TabsTrigger value="malware-analyzer">Malware Analyzer</TabsTrigger>
            <TabsTrigger value="fraud-detector">Fraud Detector</TabsTrigger>
            <TabsTrigger value="incident-commander">Incident Commander</TabsTrigger>
          </TabsList>
          <TabsContent value="email-screener">
            <EmailScreenerForm />
          </TabsContent>
          <TabsContent value="url-assessor">
            <UrlAssessorForm />
          </TabsContent>
          <TabsContent value="malware-analyzer">
            <MalwareAnalyzerForm />
          </TabsContent>
          <TabsContent value="fraud-detector">
            <FraudDetectorForm />
          </TabsContent>
          <TabsContent value="incident-commander">
            <IncidentCommanderForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
