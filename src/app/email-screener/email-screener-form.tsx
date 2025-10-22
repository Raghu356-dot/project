'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { analyzeEmailForPhishing, type AnalyzeEmailForPhishingOutput } from '@/ai/flows/analyze-email-for-phishing';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultCard } from '@/components/result-card';

const formSchema = z.object({
  emailContent: z.string().min(50, {
    message: 'Email content must be at least 50 characters.',
  }),
});

export function EmailScreenerForm() {
  const [result, setResult] = React.useState<AnalyzeEmailForPhishingOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeEmailForPhishing(values.emailContent);
      setResult(analysisResult);
      form.reset({ emailContent: '' });
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
          <CardTitle>Email Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="emailContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste the full content of the email below</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="From: suspicious@example.com..."
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
                Analyze Email
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <ResultCard result={result} />}
    </>
  );
}
