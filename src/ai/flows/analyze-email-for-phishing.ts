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
  result: z.enum(['Safe', 'Suspicious', 'Malicious']).describe('The verdict of the analysis.'),
  summary: z.string().describe('Brief summary of findings and tone of the email.'),
  advice: z.string().describe('Clear security recommendation for the user.'),
});
export type AnalyzeEmailForPhishingOutput = z.infer<typeof AnalyzeEmailForPhishingOutputSchema>;

export async function analyzeEmailForPhishing(input: AnalyzeEmailForPhishingInput): Promise<AnalyzeEmailForPhishingOutput> {
  return analyzeEmailForPhishingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailForPhishingPrompt',
  input: {schema: AnalyzeEmailForPhishingInputSchema},
  output: {schema: AnalyzeEmailForPhishingOutputSchema},
  prompt: `You are an Email Analysis AI Agent.

Your task is to analyze the content of an email and detect potential security threats such as phishing, spam, or malicious intent.

Always look for email text provided between the markers:
--- EMAIL START --- and --- EMAIL END ---

If you find text between these markers, analyze it completely — including:
- Subject line
- Sender address
- Body text
- Any URLs, attachments, or suspicious words

If no content is found between these markers, respond exactly with:
"No email content found. Please paste a valid email between --- EMAIL START --- and --- EMAIL END ---."

When content is found, return your analysis in this JSON format:

{
  "result": "Safe / Suspicious / Malicious",
  "summary": "Brief summary of findings and tone of the email.",
  "advice": "Clear security recommendation for the user."
}

--- EMAIL START ---
{{{$input}}}
--- EMAIL END ---
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
