'use server';
/**
 * @fileOverview Email Screener Agent: Analyzes email content to identify phishing, scams, or malicious intent.
 *
 * - analyzeEmailForPhishing - A function that handles the email analysis process.
 * - AnalyzeEmailForPhishingInput - The input type for the analyzeEmailForPhishing function.
 * - AnalyzeEmailForPhishingOutput - The return type for the analyzeEmailForPhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailForPhishingInputSchema = z.object({
  email_content: z
    .string()
    .describe(
      'The full raw email text, including subject, sender, and body.'
    ),
});
export type AnalyzeEmailForPhishingInput = z.infer<
  typeof AnalyzeEmailForPhishingInputSchema
>;

const AnalyzeEmailForPhishingOutputSchema = z.object({
  result: z
    .enum(['Safe', 'Suspicious', 'Malicious'])
    .describe('The verdict of the analysis.'),
  summary: z
    .string()
    .describe('Brief summary of findings and tone of the email.'),
  advice: z.string().describe('Clear security recommendation for the user.'),
});
export type AnalyzeEmailForPhishingOutput = z.infer<
  typeof AnalyzeEmailForPhishingOutputSchema
>;

export async function analyzeEmailForPhishing(
  input: AnalyzeEmailForPhishingInput
): Promise<AnalyzeEmailForPhishingOutput> {
  return analyzeEmailForPhishingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailForPhishingPrompt',
  input: {schema: AnalyzeEmailForPhishingInputSchema},
  output: {schema: AnalyzeEmailForPhishingOutputSchema},
  prompt: `You are an AI Email Security Analyzer. Your job is to analyze emails to detect phishing, spam, or malicious intent.

Always look for email text inside the provided variable {{email_content}} or between markers --- EMAIL START --- and --- EMAIL END ---.

If content exists, analyze it completely. Look for sender spoofing, suspicious URLs, urgency, misspelled domains, or fake branding.

If content is missing, respond with this exact text: 'No email content found. Please paste a valid email between --- EMAIL START --- and --- EMAIL END ---.'

When content is found, return a structured JSON response in this format:
{
  "result": "Safe / Suspicious / Malicious",
  "summary": "Brief summary of findings and tone.",
  "advice": "Actionable advice for the user."
}
`,
  examples: [
    {
      input: {
        email_content:
          'Subject: URGENT: Your account has been suspended!\nFrom: support@secure-update.example.com\nTo: user@example.com\nDate: Wed, 22 Oct 2025 09:15 AM\n\nDear User,\nYour account has been locked. Click below to verify your credentials immediately:\nhttp://secure-update.example.com/login\n\nFailure to verify will result in permanent suspension.\n\nRegards,\nAccount Support',
      },
      output: {
        result: 'Suspicious',
        summary:
          'Email uses urgency and an insecure (HTTP) link. Sender domain appears fake.',
        advice: 'Do not click links. Verify directly from the official website.',
      },
    },
    {
      input: {
        email_content:
          'Subject: Welcome to TaskWave — Confirm your email\nFrom: TaskWave <noreply@example.com>\nDate: Tue, 21 Oct 2025 09:15:00 +0530\nTo: alice@example.com\n\nHi Alice,\n\nThanks for signing up for TaskWave! Please confirm your email address by visiting:\nhttps://example.com/confirm?token=ABC123\n\nIf you did not sign up, ignore this message.\n\nRegards,\nThe TaskWave Team',
      },
      output: {
        result: 'Safe',
        summary:
          'Legitimate confirmation email with HTTPS link and professional tone.',
        advice: 'Safe to open and confirm if you registered for TaskWave.',
      },
    },
  ],
});

const analyzeEmailForPhishingFlow = ai.defineFlow(
  {
    name: 'analyzeEmailForPhishingFlow',
    inputSchema: AnalyzeEmailForPhishingInputSchema,
    outputSchema: AnalyzeEmailForPhishingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
