import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CaseSensitive } from "lucide-react";

const tools = [
  {
    title: 'Analysis Tools',
    description: 'A suite of AI-powered tools to analyze and mitigate security threats.',
    href: '/analysis-tools',
    icon: CaseSensitive,
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
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <tool.icon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{tool.description}</p>
            </CardContent>
            <CardFooter>
               <Button asChild variant="outline" className="w-full">
                <Link href={tool.href}>
                  <span className="flex items-center">
                    Launch Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
