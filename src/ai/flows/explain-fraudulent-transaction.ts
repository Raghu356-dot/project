'use server';
/**
 * @fileOverview Analyzes transaction data and user context to explain potential fraud.
 * 
 * - explainFraudulentTransaction - A function that handles the analysis of transaction data and user context to explain potential fraud.
 * - ExplainFraudulentTransactionInput - The input type for the explainFraudulentTransaction function.
 * - ExplainFraudulentTransactionOutput - The return type for the explainFraudulentTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainFraudulentTransactionInputSchema = z.object({
  transactionDetails: z.object({
    amount: z.number().describe('The amount of the transaction.'),
    merchant: z.string().describe('The merchant involved in the transaction.'),
    location: z.string().describe('The location of the transaction.'),
    time: z.string().describe('The time of the transaction.'),
  }).describe('Details of the transaction.'),
  userProfileSummary: z.string().describe('A summary of the user profile, including typical behavior and location.'),
  anomalyScore: z.number().min(0).max(100).describe('A numerical anomaly score (0-100) indicating how unusual the transaction is.'),
});
export type ExplainFraudulentTransactionInput = z.infer<typeof ExplainFraudulentTransactionInputSchema>;

const ExplainFraudulentTransactionOutputSchema = z.object({
  explanation: z.string().describe('A paragraph explaining the top 2-3 factors that make the transaction risky.'),
  riskLevel: z.enum(['High', 'Medium', 'Low']).describe('A risk assessment.'),
  verdict: z.enum(['Genuine', 'Fraudulent']).describe('A single, definitive word: \"Genuine\" or \"Fraudulent\".'),
  advice: z.string().describe('A clear, one-sentence recommendation.'),
});
export type ExplainFraudulentTransactionOutput = z.infer<typeof ExplainFraudulentTransactionOutputSchema>;

export async function explainFraudulentTransaction(input: ExplainFraudulentTransactionInput): Promise<ExplainFraudulentTransactionOutput> {
  return explainFraudulentTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainFraudulentTransactionPrompt',
  input: {schema: ExplainFraudulentTransactionInputSchema},
  output: {schema: ExplainFraudulentTransactionOutputSchema},
  prompt: `You are an expert in financial fraud detection. Analyze the provided transaction data and user context to determine if the transaction is fraudulent.

Transaction Details:
Amount: {{{transactionDetails.amount}}}
Merchant: {{{transactionDetails.merchant}}}
Location: {{{transactionDetails.location}}}
Time: {{{transactionDetails.time}}}

User Profile Summary: {{{userProfileSummary}}}

Anomaly Score: {{{anomalyScore}}}

Based on this information, provide:
- A paragraph explaining the top 2-3 factors that make the transaction risky in the explanation field.
- A risk assessment (High, Medium, or Low) in the riskLevel field.
- A definitive verdict (Genuine or Fraudulent) in the verdict field.
- A clear, one-sentence recommendation in the advice field.
`,
});

const explainFraudulentTransactionFlow = ai.defineFlow(
  {
    name: 'explainFraudulentTransactionFlow',
    inputSchema: ExplainFraudulentTransactionInputSchema,
    outputSchema: ExplainFraudulentTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
