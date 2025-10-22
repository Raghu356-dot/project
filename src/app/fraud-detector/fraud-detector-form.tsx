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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResultCard } from '@/components/result-card';
import { Slider } from '@/components/ui/slider';

const defaultValues = {
  transactionDetails: {
    amount: 1500,
    merchant: 'Global Electronics',
    location: 'Unknown',
    time: new Date().toISOString(),
  },
  userProfileSummary: 'User typically shops at local grocery stores and gas stations, with an average transaction value of $50. User is currently located in New York.',
  anomalyScore: 75,
};

const formSchema = z.object({
  transactionDetails: z.object({
    amount: z.coerce.number().positive(),
    merchant: z.string().min(1, 'Merchant is required.'),
    location: z.string().min(1, 'Location is required.'),
    time: z.string().min(1, 'Time is required.'),
  }),
  userProfileSummary: z.string().min(10, 'User profile summary is required.'),
  anomalyScore: z.number().min(0).max(100),
});

type FormSchema = z.infer<typeof formSchema>;

export function FraudDetectorForm() {
  const [result, setResult] = React.useState<ExplainFraudulentTransactionOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await explainFraudulentTransaction(values);
      setResult(analysisResult);
      form.reset(defaultValues);
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

  const anomalyScore = form.watch("anomalyScore");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Fraud Analysis Inputs</CardTitle>
          <CardDescription>Provide details about the transaction and user context.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Transaction Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <FormField control={form.control} name="transactionDetails.amount" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="transactionDetails.merchant" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Merchant</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="transactionDetails.location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="transactionDetails.time" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-medium text-lg">User Context</h3>
                 <div className="p-4 border rounded-lg space-y-4">
                    <FormField control={form.control} name="userProfileSummary" render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Profile Summary</FormLabel>
                            <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="anomalyScore" render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel>Anomaly Score: {value}</FormLabel>
                            <FormControl>
                                <Slider
                                    value={[value]}
                                    onValueChange={(vals) => onChange(vals[0])}
                                    max={100}
                                    step={1}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                 </div>
              </div>

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
