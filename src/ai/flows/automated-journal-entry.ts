'use server';

/**
 * @fileOverview A flow for generating automated journal entries for Apprentice Zeros.
 *
 * - generateJournalEntry - A function that generates a personalized daily journal entry.
 * - JournalEntryInput - The input type for the generateJournalEntry function.
 * - JournalEntryOutput - The return type for the generateJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalEntryInputSchema = z.object({
  recentTasks: z.string().describe('A summary of recent tasks completed.'),
  teamInteractions: z.string().describe('A summary of recent team interactions.'),
  skillDevelopment: z.string().describe('A summary of current skill development focuses.'),
});
export type JournalEntryInput = z.infer<typeof JournalEntryInputSchema>;

const JournalEntryOutputSchema = z.object({
  journalEntry: z.string().describe('The generated journal entry.'),
});
export type JournalEntryOutput = z.infer<typeof JournalEntryOutputSchema>;

export async function generateJournalEntry(input: JournalEntryInput): Promise<JournalEntryOutput> {
  return generateJournalEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalEntryPrompt',
  input: {schema: JournalEntryInputSchema},
  output: {schema: JournalEntryOutputSchema},
  prompt: `You are a helpful AI assistant that generates personalized daily journal entries for Apprentice Zeros.

  Integrate the following data points to create a structured and thoughtful journal entry:

  Recent Tasks: {{{recentTasks}}}
  Team Interactions: {{{teamInteractions}}}
  Skill Development: {{{skillDevelopment}}}

  The journal entry should:
  - Follow common diary styles (paragraphs).
  - Highlight key insights and discoveries.
  - Mention areas of recent improvement and future focus.
  - Be structured for easy export to standard journal software formats.

  Generate the journal entry:
  `,
});

const generateJournalEntryFlow = ai.defineFlow(
  {
    name: 'generateJournalEntryFlow',
    inputSchema: JournalEntryInputSchema,
    outputSchema: JournalEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
