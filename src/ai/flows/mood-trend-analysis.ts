'use server';

/**
 * @fileOverview A mood trend analysis AI agent.
 *
 * - analyzeMoodTrends - A function that handles the mood trend analysis process.
 * - MoodTrendAnalysisInput - The input type for the analyzeMoodTrends function.
 * - MoodTrendAnalysisOutput - The return type for the analyzeMoodTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodEntrySchema = z.object({
  date: z.string().describe('The date of the mood entry (YYYY-MM-DD).'),
  mood: z.enum(['happy', 'neutral', 'sad']).describe('The mood for the day.'),
  journalEntry: z.string().optional().describe('The journal entry for the day.'),
});

const MoodTrendAnalysisInputSchema = z.object({
  moodEntries: z.array(MoodEntrySchema).describe('An array of mood entries.'),
});
export type MoodTrendAnalysisInput = z.infer<typeof MoodTrendAnalysisInputSchema>;

const MoodTrendAnalysisOutputSchema = z.object({
  summary: z.string().describe('A summary of the mood trends over time.'),
});
export type MoodTrendAnalysisOutput = z.infer<typeof MoodTrendAnalysisOutputSchema>;

export async function analyzeMoodTrends(input: MoodTrendAnalysisInput): Promise<MoodTrendAnalysisOutput> {
  return moodTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodTrendAnalysisPrompt',
  input: {schema: MoodTrendAnalysisInputSchema},
  output: {schema: MoodTrendAnalysisOutputSchema},
  prompt: `You are an AI assistant that analyzes mood trends from a series of daily mood entries.

  Analyze the following mood entries and provide a summary of the mood trends, highlighting any patterns or fluctuations.

  Mood Entries:
  {{#each moodEntries}}
  - Date: {{date}}, Mood: {{mood}}
  {{/each}}

  Summary:`,
});

const moodTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'moodTrendAnalysisFlow',
    inputSchema: MoodTrendAnalysisInputSchema,
    outputSchema: MoodTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
