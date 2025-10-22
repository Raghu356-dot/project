import type { AnalysisResult } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
}

function getVerdict(result: AnalysisResult) {
  if ("verdict" in result && result.verdict) {
    return result.verdict;
  }
  if ("result" in result && typeof result.result === "string") {
    return result.result;
  }
  return null;
}

function getBadgeVariant(verdict: string | null) {
  if (!verdict) return "secondary";
  const safeVerdicts = ["Safe", "Genuine", "Unrelated"];
  if (safeVerdicts.includes(verdict)) {
    return "secondary";
  }
  const suspiciousVerdicts = ["Suspicious", "Medium"];
    if (suspiciousVerdicts.includes(verdict)) {
        return "default";
    }
  return "destructive";
}

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function ResultCard({ result }: ResultCardProps) {
  const verdict = getVerdict(result);

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Analysis Result</CardTitle>
          {verdict && (
            <Badge variant={getBadgeVariant(verdict)} className="text-sm">
              {verdict}
            </Badge>
          )}
        </div>
        <CardDescription>
          The AI agent has completed its analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-6">
          {Object.entries(result).map(([key, value]) => {
            if (key === "verdict" || key === "result") return null;
            return (
              <div key={key} className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-4 items-start">
                <dt className="font-semibold text-muted-foreground break-words">
                  {formatKey(key)}
                </dt>
                <dd className="md:col-start-2">
                  {typeof value === "boolean" ? (
                    value ? (
                      <Badge variant="destructive">
                        <XCircle className="mr-2 h-4 w-4" /> True
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <CheckCircle className="mr-2 h-4 w-4" /> False
                      </Badge>
                    )
                  ) : Array.isArray(value) ? (
                    <ul className="list-disc list-inside space-y-2">
                      {value.map((item, index) => (
                        <li key={index} className="text-foreground">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-foreground whitespace-pre-wrap">
                      {value.toString()}
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
