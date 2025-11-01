'use client';

import { Calendar } from '@/components/ui/calendar';
import { getMoodDetails } from '@/lib/moods';
import type { JournalEntry } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { DayPicker, DayProps, useDayRender } from 'react-day-picker';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface JournalCalendarProps {
  entries: JournalEntry[];
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
}

function CustomDay(props: DayProps & { entries: JournalEntry[] }) {
  const { buttonRef, activeModifiers, ...dayRender } = useDayRender(
    props.date,
    props.displayMonth,
    props.buttonProps
  );

  const entryMap = new Map((props.entries || []).map((entry: JournalEntry) => [format(new Date(entry.date), 'yyyy-MM-dd'), entry]));
  const entry = entryMap.get(format(props.date, 'yyyy-MM-dd'));
  const moodStyles = {
    happy: { color: 'hsl(var(--primary))' },
    neutral: { color: 'hsl(var(--accent))' },
    sad: { color: 'hsl(var(--muted-foreground))' },
  };

  if (dayRender.isHidden) {
    return <></>;
  }

  return (
    <div
      className={cn("relative", dayRender.className)}
      style={dayRender.style}
    >
      <Button
        ref={buttonRef}
        {...dayRender.buttonProps}
        variant="ghost"
        className={cn("h-9 w-9 p-0 font-normal", {
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground': activeModifiers.selected,
          'bg-accent text-accent-foreground': activeModifiers.today,
          'text-muted-foreground opacity-50': activeModifiers.outside,
        })}
      >
        {dayRender.formattedDate}
      </Button>
      {entry && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: moodStyles[entry.mood].color }} />}
    </div>
  );
}


export function JournalCalendar({ entries, selectedDate, onDateSelect }: JournalCalendarProps) {
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
            components={{
                Day: (props: DayProps) => <CustomDay {...props} entries={entries} />
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
