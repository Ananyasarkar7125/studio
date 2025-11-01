'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeMoodTrends } from '@/ai/flows/mood-trend-analysis';
import type { JournalEntry } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface TrendsSummaryProps {
  entries: JournalEntry[];
}

const mapToAiInput = (entries: JournalEntry[]) => {
  return entries.map(e => ({
    date: e.date,
    mood: e.mood,
    journalEntry: e.journal,
  }));
}

export function TrendsSummary({ entries }: TrendsSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    if (entries.length < 3) {
      setError('You need at least 3 journal entries to analyze trends.');
      setIsLoading(false);
      return;
    }

    try {
      const aiInput = { moodEntries: mapToAiInput(entries) };
      const result = await analyzeMoodTrends(aiInput);
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing your mood trends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Mood Trends</CardTitle>
        <CardDescription>Discover patterns in your well-being over time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading || entries.length === 0} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze My Mood'
          )}
        </Button>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {summary && (
          <div className="rounded-md border bg-muted/50 p-4">
            <p className="whitespace-pre-wrap font-body leading-relaxed text-sm text-foreground">
              {summary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
