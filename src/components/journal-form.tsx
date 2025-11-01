'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { JournalEntry } from '@/lib/types';
import { MoodSelector } from './mood-selector';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const formSchema = z.object({
  mood: z.enum(['happy', 'neutral', 'sad'], { required_error: 'Please select a mood.' }),
  journal: z.string().min(1, { message: 'Journal entry cannot be empty.' }),
});

interface JournalFormProps {
  selectedDate: Date;
  entry: JournalEntry | null;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

export function JournalForm({ selectedDate, entry, onSubmit }: JournalFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: entry?.mood,
      journal: entry?.journal || '',
    },
  });

  useEffect(() => {
    form.reset({
      mood: entry?.mood,
      journal: entry?.journal || '',
    });
  }, [entry, form, selectedDate]);

  const dateDisplay = format(selectedDate, 'MMMM d, yyyy');

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Daily Journal</CardTitle>
        <CardDescription>{dateDisplay}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">How are you feeling today?</FormLabel>
                  <FormControl>
                    <MoodSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="journal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Your thoughts</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let your thoughts flow..."
                      className="min-h-[200px] resize-none text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full">
              Save Entry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
