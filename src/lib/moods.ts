import { Sun, Cloud, CloudRain } from 'lucide-react';

export const MOODS = [
  { value: 'happy', label: 'Happy', icon: Sun },
  { value: 'neutral', label: 'Neutral', icon: Cloud },
  { value: 'sad', label: 'Sad', icon: CloudRain },
] as const;

export type Mood = (typeof MOODS)[number]['value'];

export const getMoodDetails = (moodValue: Mood) => {
  return MOODS.find(m => m.value === moodValue);
}
