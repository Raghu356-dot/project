'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { correlateSecurityEvents, type CorrelateSecurityEventsOutput } from '@/ai/flows/correlate-security-events';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResultCard } from '@/components/result-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const defaultValues = {
  emailAnalysis: {
    summary: 'A phishing email from a sender posing as the user\'s bank was detected. It contained a suspicious link and urged immediate action.',
    verdict: 'Malicious' as const,
    advice: 'Delete this email immediately and do not click any links.',
  },
  transactionContext: 'Amount: $1500\nMerchant: Global Electronics\nLocation: Unknown (IP from a different country)\nTime: 2 minutes after email was received\nUser Profile: User typically shops at local grocery stores and gas stations. Average transaction is $45.\nAnomaly Score: 95',
};

const formSchema = z.object({
  emailAnalysis: z.object({
    summary: z.string().min(1, 'Summary is required.'),
    verdict: z.enum(['Safe', 'Malicious']),
    advice: z.string().min(1, 'Advice is required.'),
  }),
  transactionContext: z.string().min(50, {
    message: 'Transaction details must be at least 50 characters.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

export function IncidentCommanderForm() {
  const [result, setResult] = React.useState<CorrelateSecurityEventsOutput | null>(null);
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
      const analysisResult = await correlateSecurityEvents(values);
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Event Correlation</CardTitle>
          <CardDescription>Provide data from two separate security events to check for a connection.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Event 1: Email Analysis Report</h3>
                <div className="p-4 border rounded-lg space-y-4">
                  <FormField control={form.control} name="emailAnalysis.summary" render={({ field }) => (
                    <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emailAnalysis.verdict" render={({ field }) => (
                    <FormItem><FormLabel>Verdict</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Safe">Safe</SelectItem><SelectItem value="Malicious">Malicious</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emailAnalysis.advice" render={({ field }) => (
                    <FormItem><FormLabel>Advice</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Event 2: Fraudulent Transaction Details</h3>
                <div className="p-4 border rounded-lg space-y-4">
                    <FormField
                      control={form.control}
                      name="transactionContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction and User Context</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Amount: $1500, Merchant: Global Electronics..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Correlate Events
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <ResultCard result={result} />}
    </>
  );
}
