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
  transaction_context: z.string().describe('A block of text containing all available details about the transaction, user profile, and any other relevant context.'),
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
  prompt: `You are an expert in financial fraud detection. Analyze the provided text containing transaction data and user context to determine if the transaction is fraudulent.

Parse all relevant details from the following text block:
{{{transaction_context}}}

Based on your analysis of all the information provided, provide:
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
