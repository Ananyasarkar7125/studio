'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay } from 'date-fns';
import { z } from 'zod';
import type { JournalEntry } from '@/lib/types';
import { JournalForm } from '@/components/journal-form';
import { JournalCalendar } from '@/components/journal-calendar';
import { TrendsSummary } from '@/components/trends-summary';

const formSchema = z.object({
  mood: z.enum(['happy', 'neutral', 'sad']),
  journal: z.string(),
});

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(startOfDay(date));
    }
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newEntry: JournalEntry = {
      date: dateKey,
      mood: data.mood,
      journal: data.journal,
    };

    setEntries((prevEntries) => {
      const entryExists = prevEntries.some((entry) => entry.date === dateKey);
      if (entryExists) {
        return prevEntries.map((entry) =>
          entry.date === dateKey ? newEntry : entry
        );
      }
      return [...prevEntries, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    toast({
      title: 'Entry Saved',
      description: `Your journal entry for ${format(selectedDate, 'MMMM d, yyyy')} has been saved.`,
    });
  };

  const selectedEntry = entries.find(
    (entry) => entry.date === format(selectedDate, 'yyyy-MM-dd')
  ) || null;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline text-primary">
          Reflectly
        </h1>
        <p className="text-muted-foreground mt-2">
          Your daily space for reflection and well-being.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-8">
          <JournalForm
            selectedDate={selectedDate}
            entry={selectedEntry}
            onSubmit={handleFormSubmit}
          />
          <TrendsSummary entries={entries} />
        </div>
        <div className="lg:sticky lg:top-8">
          <JournalCalendar
            entries={entries}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </main>
  );
}
