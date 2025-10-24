'use server';

/**
 * @fileOverview An incident commander AI agent that correlates security events.
 *
 * - correlateSecurityEvents - A function that handles the correlation of security events.
 * - CorrelateSecurityEventsInput - The input type for the correlateSecurityEvents function.
 * - CorrelateSecurityEventsOutput - The return type for the correlateSecurityEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrelateSecurityEventsInputSchema = z.object({
  emailAnalysis: z.object({
    summary: z.string().describe('A short paragraph explaining the identified email threats.'),
    verdict: z.enum(['Safe', 'Malicious']).describe('A single word verdict on the email.'),
    advice: z.string().describe('A recommendation for the user regarding the email.'),
  }).describe('The analysis report from the Email Screener agent.'),
  transactionContext: z.string().describe('A block of text containing all available details about the transaction, user profile, and any other relevant context.'),
});

export type CorrelateSecurityEventsInput = z.infer<typeof CorrelateSecurityEventsInputSchema>;

const CorrelateSecurityEventsOutputSchema = z.object({
  correlationSummary: z.string().describe('An executive summary explaining the likelihood of a connection and the supporting evidence.'),
  recommendedActions: z.array(z.string()).describe('A list of prioritized actions to mitigate the threat.'),
  verdict: z.enum(['Connected', 'Unrelated']).describe('A single word verdict on whether the events are connected.'),
  advice: z.string().describe('A summary of the most critical action to take.'),
});

export type CorrelateSecurityEventsOutput = z.infer<typeof CorrelateSecurityEventsOutputSchema>;

export async function correlateSecurityEvents(input: CorrelateSecurityEventsInput): Promise<CorrelateSecurityEventsOutput> {
  return correlateSecurityEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correlateSecurityEventsPrompt',
  input: {schema: CorrelateSecurityEventsInputSchema},
  output: {schema: CorrelateSecurityEventsOutputSchema},
  prompt: `You are a senior cybersecurity investigator analyzing two separate security events to determine if they are part of a single, coordinated attack.

  Here is the analysis of a suspicious email:
  Summary: {{{emailAnalysis.summary}}}
  Verdict: {{{emailAnalysis.verdict}}}
  Advice: {{{emailAnalysis.advice}}}

  Here is the context for a potentially fraudulent financial transaction:
  {{{transactionContext}}}

  Based on all this information, determine if the events are connected and provide a correlation summary, recommended actions, a verdict, and advice.

  Ensure the output is a valid JSON object conforming to the following schema:
  ${JSON.stringify(CorrelateSecurityEventsOutputSchema.describe(''))}`,
});

const correlateSecurityEventsFlow = ai.defineFlow(
  {
    name: 'correlateSecurityEventsFlow',
    inputSchema: CorrelateSecurityEventsInputSchema,
    outputSchema: CorrelateSecurityEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
