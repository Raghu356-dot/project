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
  transactionDetails: z.object({
    explanation: z.string().describe('Explanation of why the transaction was flagged as fraudulent.'),
    riskLevel: z.enum(['High', 'Medium', 'Low']).describe('Risk assessment of the transaction.'),
    verdict: z.enum(['Genuine', 'Fraudulent']).describe('A single word verdict on the transaction.'),
    advice: z.string().describe('A recommendation regarding the transaction.'),
    amount: z.number().describe('The transaction amount.'),
    merchant: z.string().describe('The transaction merchant.'),
    location: z.string().describe('The transaction location.'),
    time: z.string().describe('The transaction time.'),
    userProfileSummary: z.string().describe('A summary of the user profile and behavior.'),
    anomalyScore: z.number().describe('A numerical anomaly score (0-100) indicating how unusual the transaction is.'),
  }).describe('The details of a fraudulent financial transaction.'),
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

  Here are the details of a fraudulent financial transaction:
  Explanation: {{{transactionDetails.explanation}}}
  Risk Level: {{{transactionDetails.riskLevel}}}
  Verdict: {{{transactionDetails.verdict}}}
  Advice: {{{transactionDetails.advice}}}
  Amount: {{{transactionDetails.amount}}}
  Merchant: {{{transactionDetails.merchant}}}
  Location: {{{transactionDetails.location}}}
  Time: {{{transactionDetails.time}}}
  User Profile Summary: {{{transactionDetails.userProfileSummary}}}
  Anomaly Score: {{{transactionDetails.anomalyScore}}}

  Based on this information, determine if the events are connected and provide a correlation summary, recommended actions, a verdict, and advice.

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

