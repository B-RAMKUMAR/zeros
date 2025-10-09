'use server';

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import type { Submission, Task, ScoreBreakdown } from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "samplemd");
const submissionsFilePath = path.join(contentDirectory, "submissions.md");
const tasksFilePath = path.join(contentDirectory, "tasks.md");

// --- Submissions File ---
async function readSubmissionsFile(): Promise<{ content: string; data: { items: Submission[] } }> {
  const fileContents = await fs.readFile(submissionsFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: Submission[] } };
}

async function writeSubmissionsFile(submissions: Submission[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: submissions });
  await fs.writeFile(submissionsFilePath, newData);
}

// --- Tasks File ---
async function readTasksFile(): Promise<{ content: string; data: { items: Task[] } }> {
  const fileContents = await fs.readFile(tasksFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: Task[] } };
}

async function writeTasksFile(tasks: Task[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: tasks });
  await fs.writeFile(tasksFilePath, newData);
}

type UpdateScoresInput = {
    submissionId: number;
    scores: ScoreBreakdown;
    scorerName: string;
};

export async function updateScoresAction(input: UpdateScoresInput): Promise<{ success: boolean; error?: string }> {
    const { submissionId, scores, scorerName } = input;

    try {
        const { data: submissionsData, content: submissionsContent } = await readSubmissionsFile();
        let submissions = submissionsData.items || [];
        const submissionIndex = submissions.findIndex(s => s.id === submissionId);

        if (submissionIndex === -1) {
            return { success: false, error: "Submission not found." };
        }
        
        const scoreValues = Object.values(scores);
        const totalScore = scoreValues.reduce((sum, score) => sum + score, 0);
        // Assuming max score per category is 10, total max is 50. We scale to 100.
        const finalScore = (totalScore / (scoreValues.length * 10)) * 100;
        
        // Update submission
        submissions[submissionIndex] = {
            ...submissions[submissionIndex],
            status: "Scored",
            scores: scores,
            score: Math.round(finalScore),
            scorer: scorerName,
        };

        await writeSubmissionsFile(submissions, submissionsContent);
        
        // Update task
        const taskId = submissions[submissionIndex].taskId;
        const { data: tasksData, content: tasksContent } = await readTasksFile();
        let tasks = tasksData.items || [];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].status = "Scored";
            tasks[taskIndex].score = Math.round(finalScore);
            await writeTasksFile(tasks, tasksContent);
        }

        revalidatePath("/dashboard/give-score");
        revalidatePath("/dashboard/scores");
        revalidatePath("/dashboard/analytical");
        revalidatePath("/dashboard/tasks");
        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        console.error("Error updating scores:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}
