'use client';

import { cn } from '@/lib/utils';
import { MOODS, type Mood } from '@/lib/moods';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MoodSelectorProps {
  value: Mood | undefined;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {MOODS.map((mood) => (
          <Tooltip key={mood.value}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full w-14 h-14 transition-all duration-300',
                  value === mood.value
                    ? 'bg-accent/30 scale-110'
                    : 'opacity-50 hover:opacity-100'
                )}
                onClick={() => onChange(mood.value)}
              >
                <mood.icon className="w-8 h-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{mood.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
