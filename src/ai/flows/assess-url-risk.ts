'use server';

/**
 * @fileOverview URL Risk Assessor Agent.
 *
 * - assessUrlRisk - A function that assesses the risk of a given URL.
 * - AssessUrlRiskInput - The input type for the assessUrlRisk function.
 * - AssessUrlRiskOutput - The return type for the assessUrlRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessUrlRiskInputSchema = z.object({
  url: z.string().describe('The URL to assess.'),
});
export type AssessUrlRiskInput = z.infer<typeof AssessUrlRiskInputSchema>;

const AssessUrlRiskOutputSchema = z.object({
  isMalicious: z.boolean().describe('Whether the URL is likely malicious.'),
  threatType: z
    .string()
    .describe(
      'A category for the threat, such as \'Phishing\', \'Malware\', or \'Benign\'.'    ),
  summary:
    z.string().describe(
      'A brief explanation of the findings, pointing out suspicious elements in the URL itself (e.g., unusual domain name, strange path).'
    ),
  verdict: z.enum(['Safe', 'Malicious']).describe('A single, definitive word: \'Safe\' or \'Malicious\'.'),
  advice:
    z.string().describe('A clear, one-sentence recommendation (e.g., \'Avoid this site and do not enter any personal information.\').'),
});
export type AssessUrlRiskOutput = z.infer<typeof AssessUrlRiskOutputSchema>;

export async function assessUrlRisk(input: AssessUrlRiskInput): Promise<AssessUrlRiskOutput> {
  return assessUrlRiskFlow(input);
}

const assessUrlRiskPrompt = ai.definePrompt({
  name: 'assessUrlRiskPrompt',
  input: {schema: AssessUrlRiskInputSchema},
  output: {schema: AssessUrlRiskOutputSchema},
  prompt: `You are a web security specialist who can predict the danger of a URL without actually visiting it.\n
You will examine the given URL to determine if it is likely to be a phishing site, host malware, or be part of a scam.\n
URL: {{{url}}}\n
Based on your analysis, please provide the following information in JSON format:\n\n- isMalicious: A boolean value (true or false) indicating whether the URL is likely malicious.\n- threatType: A category for the threat, such as 'Phishing', 'Malware', or 'Benign'.\n- summary: A brief explanation of the findings, pointing out suspicious elements in the URL itself (e.g., unusual domain name, strange path).\n- verdict: A single, definitive word: 'Safe' or 'Malicious'.\n- advice: A clear, one-sentence recommendation (e.g., 'Avoid this site and do not enter any personal information.').\n\nEnsure the output is a valid JSON object conforming to the following schema:\n${JSON.stringify(AssessUrlRiskOutputSchema.describe(''))}`,
});

const assessUrlRiskFlow = ai.defineFlow(
  {
    name: 'assessUrlRiskFlow',
    inputSchema: AssessUrlRiskInputSchema,
    outputSchema: AssessUrlRiskOutputSchema,
  },
  async input => {
    const {output} = await assessUrlRiskPrompt(input);
    return output!;
  }
);
