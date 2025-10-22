import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-email-for-phishing.ts';
import '@/ai/flows/assess-url-risk.ts';
import '@/ai/flows/correlate-security-events.ts';
import '@/ai/flows/detect-malware-in-file-snippet.ts';
import '@/ai/flows/explain-fraudulent-transaction.ts';