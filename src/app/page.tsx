import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, Link as LinkIcon, FileCode, CreditCard, Siren, ArrowRight } from "lucide-react";

const agents = [
  {
    title: 'Email Screener',
    description: 'Analyze email content to identify phishing, scams, or malicious intent.',
    href: '/email-screener',
    icon: ShieldCheck,
  },
  {
    title: 'URL Assessor',
    description: "Examine a URL to determine if it's a phishing site or hosts malware.",
    href: '/url-assessor',
    icon: LinkIcon,
  },
  {
    title: 'Malware Analyzer',
    description: "Inspect a file's content snippet for malware signatures.",
    href: '/malware-analyzer',
    icon: FileCode,
  },
  {
    title: 'Fraud Detector',
    description: 'Analyze transaction data and user context to explain potential fraud.',
    href: '/fraud-detector',
    icon: CreditCard,
  },
  {
    title: 'Incident Commander',
    description: 'Correlate multiple security events to identify coordinated attacks.',
    href: '/incident-commander',
    icon: Siren,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="CyberSentinel AI Dashboard"
        description="An overview of the AI-powered cybersecurity analysis agents."
      />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.title} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <agent.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>{agent.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{agent.description}</p>
            </CardContent>
            <CardFooter>
                <Link href={agent.href} passHref legacyBehavior>
                  <Button variant="outline" className="w-full">
                    Launch Agent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
