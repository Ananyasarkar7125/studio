import type { Mood } from './moods';

export type JournalEntry = {
  date: string; // YYYY-MM-DD
  mood: Mood;
  journal: string;
};
