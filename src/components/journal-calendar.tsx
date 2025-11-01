'use client';

import { Calendar } from '@/components/ui/calendar';
import { getMoodDetails } from '@/lib/moods';
import type { JournalEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface JournalCalendarProps {
  entries: JournalEntry[];
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function JournalCalendar({ entries, selectedDate, onDateSelect }: JournalCalendarProps) {
  const entryMap = new Map(entries.map((entry) => [entry.date, entry]));

  const modifiers = {
    happy: (date: Date) => {
      const entry = entryMap.get(format(date, 'yyyy-MM-dd'));
      return entry?.mood === 'happy';
    },
    neutral: (date: Date) => {
      const entry = entryMap.get(format(date, 'yyyy-MM-dd'));
      return entry?.mood === 'neutral';
    },
    sad: (date: Date) => {
      const entry = entryMap.get(format(date, 'yyyy-MM-dd'));
      return entry?.mood === 'sad';
    },
  };

  const modifiersStyles = {
    happy: { color: 'hsl(var(--primary))' },
    neutral: { color: 'hsl(var(--accent))' },
    sad: { color: 'hsl(var(--muted-foreground))' },
  };
  
  const selectedEntry = entries.find(e => e.date === format(selectedDate, 'yyyy-MM-dd'));
  const selectedMoodDetails = selectedEntry ? getMoodDetails(selectedEntry.mood) : null;


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-2 md:p-4 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-md"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            components={{
                Day: ({ date, ...props }) => {
                    const dayFormatted = format(date, 'yyyy-MM-dd');
                    const entry = entryMap.get(dayFormatted);
                    return (
                        <div className="relative">
                            <props.children />
                            {entry && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: modifiersStyles[entry.mood].color }} />}
                        </div>
                    );
                },
            }}
          />
        </CardContent>
      </Card>

      {selectedEntry && selectedMoodDetails && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-2xl">Entry for {format(selectedDate, "MMMM d")}</CardTitle>
                <CardDescription>Your reflection on this day.</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-2 text-base py-1 px-3 border-accent">
                <selectedMoodDetails.icon className="w-5 h-5" />
                <span>{selectedMoodDetails.label}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-body leading-relaxed text-foreground/80">
              {selectedEntry.journal}
            </p>
          </CardContent>
        </Card>
      )}
      {!selectedEntry && (
        <Card className="flex items-center justify-center min-h-[200px]">
          <div className="text-center text-muted-foreground p-4">
            <p>Select a day to view its entry.</p>
            <p className="text-xs mt-1">Days with entries have a colored dot.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
