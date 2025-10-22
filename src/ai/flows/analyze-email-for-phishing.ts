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

const AnalyzeEmailForPhishingInputSchema = z.string().describe('The raw text content of an email.');
export type AnalyzeEmailForPhishingInput = z.infer<typeof AnalyzeEmailForPhishingInputSchema>;

const AnalyzeEmailForPhishingOutputSchema = z.object({
  summary: z.string().describe('A short paragraph explaining the identified threats, the likely intent of the sender, and the key red flags found (like suspicious links or urgent language).'),
  verdict: z.enum(['Safe', 'Malicious']).describe('A single, definitive word: \"Safe\" or \"Malicious\".'),
  advice: z.string().describe('A clear, one-sentence recommendation for the user (e.g., \"Delete this email immediately and do not click any links.\").'),
});
export type AnalyzeEmailForPhishingOutput = z.infer<typeof AnalyzeEmailForPhishingOutputSchema>;

export async function analyzeEmailForPhishing(input: AnalyzeEmailForPhishingInput): Promise<AnalyzeEmailForPhishingOutput> {
  return analyzeEmailForPhishingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailForPhishingPrompt',
  input: {schema: AnalyzeEmailForPhishingInputSchema},
  output: {schema: AnalyzeEmailForPhishingOutputSchema},
  prompt: `You are an expert security analyst specializing in email-based threats. Analyze the following email content and identify any signs of phishing, scams, or malicious intent.

Email Content:
{{{$input}}}
`,
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
