import type { AnalyzeEmailForPhishingOutput } from "@/ai/flows/analyze-email-for-phishing";
import type { AssessUrlRiskOutput } from "@/ai/flows/assess-url-risk";
import type { CorrelateSecurityEventsOutput } from "@/ai/flows/correlate-security-events";
import type { DetectMalwareInFileOutput } from "@/ai/flows/detect-malware-in-file-snippet";
import type { ExplainFraudulentTransactionOutput } from "@/ai/flows/explain-fraudulent-transaction";

export type AnalysisResult =
  | (AnalyzeEmailForPhishingOutput & { verdict?: string })
  | (AssessUrlRiskOutput & { verdict?: string })
  | (DetectMalwareInFileOutput & { verdict?: string })
  | (ExplainFraudulentTransactionOutput & { verdict?: string })
  | (CorrelateSecurityEventsOutput & { verdict?: string });
