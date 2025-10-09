'use server';

import { generateJournalEntry, type JournalEntryInput } from "@/ai/flows/automated-journal-entry";
import { getTasks } from "@/lib/data";

export async function createJournalEntryAction(userId: number) {
  try {
    const allTasks = await getTasks();
    const tasks = allTasks.filter(t => t.assigneeId === userId);
    const recentTasksSummary = tasks.slice(0, 3).map(t => `${t.title} (${t.status})`).join(', ');

    // Mock data for other inputs as per the proposal
    const teamInteractionsSummary = "Discussed project architecture with the senior dev team, pair-programmed on the new UI module.";
    const skillDevelopmentSummary = "Focused on improving Next.js server actions and advanced TypeScript patterns.";

    const input: JournalEntryInput = {
      recentTasks: recentTasksSummary || 'No recent tasks to report.',
      teamInteractions: teamInteractionsSummary,
      skillDevelopment: skillDevelopmentSummary,
    };

    const result = await generateJournalEntry(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating journal entry:", error);
    return { success: false, error: "Failed to generate journal entry. Please try again." };
  }
}
