'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { explainFraudulentTransaction, type ExplainFraudulentTransactionOutput } from '@/ai/flows/explain-fraudulent-transaction';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResultCard } from '@/components/result-card';

const formSchema = z.object({
  transactionContext: z.string().min(50, {
    message: 'Transaction details must be at least 50 characters.',
  }),
});

export function FraudDetectorForm() {
  const [result, setResult] = React.useState<ExplainFraudulentTransactionOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await explainFraudulentTransaction({ transaction_context: values.transactionContext });
      setResult(analysisResult);
      form.reset({ transactionContext: '' });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred during analysis. Please try again.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Paste all available transaction and user details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="transactionContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction and User Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Amount: $1500, Merchant: Global Electronics..."
                        className="min-h-[400px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Explain Transaction
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <ResultCard result={result} />}
    </>
  );
}
