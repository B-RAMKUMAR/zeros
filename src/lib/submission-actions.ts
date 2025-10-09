'use server';

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import type { Submission, Task } from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "samplemd");
const submissionsFilePath = path.join(contentDirectory, "submissions.md");
const tasksFilePath = path.join(contentDirectory, "tasks.md");
const uploadsDirectory = path.join(process.cwd(), "public/uploads");

// --- Submissions File ---
async function readSubmissionsFile(): Promise<{ content: string; data: { items: Submission[] } }> {
  await fs.mkdir(uploadsDirectory, { recursive: true }); // Ensure uploads directory exists
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


// --- Server Action ---
export async function createSubmissionAction(formData: FormData): Promise<{ success: boolean, error?: string }> {
    const file = formData.get("file") as File;
    const submissionId = formData.get("submissionId") ? Number(formData.get("submissionId")) : undefined;
    const taskId = Number(formData.get("taskId"));
    const taskTitle = formData.get("taskTitle") as string;
    const assigneeId = Number(formData.get("assigneeId"));
    const assigneeName = formData.get("assigneeName") as string;

    if (!file || file.size === 0) {
        return { success: false, error: "No file provided." };
    }

    try {
        // Create a unique filename and save the file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
        const filePath = path.join(uploadsDirectory, filename);
        await fs.writeFile(filePath, buffer);
        const fileUrl = `/uploads/${filename}`;
        
        // Now update the markdown file
        const { data: submissionsData, content: submissionsContent } = await readSubmissionsFile();
        let submissions = submissionsData.items || [];
        
        const submissionIndex = submissionId ? submissions.findIndex(s => s.id === submissionId) : -1;

        if (submissionIndex !== -1) {
            // Update existing submission: remove old file if it exists
            const oldFileUrl = submissions[submissionIndex].fileUrl;
            if (oldFileUrl && oldFileUrl.startsWith('/uploads/')) {
                const oldFilePath = path.join(process.cwd(), 'public', oldFileUrl);
                try {
                    await fs.unlink(oldFilePath);
                } catch (e) {
                    console.warn(`Could not delete old file: ${oldFilePath}`, e);
                }
            }

            submissions[submissionIndex] = {
                ...submissions[submissionIndex],
                submittedAt: new Date().toISOString(),
                status: "Pending Score",
                fileUrl: fileUrl,
            };
        } else {
            // Create new submission record
            const newSubmission: Submission = {
                id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
                taskId: taskId,
                taskTitle: taskTitle,
                assigneeId: assigneeId,
                assigneeName: assigneeName,
                submittedAt: new Date().toISOString(),
                status: "Pending Score",
                fileUrl: fileUrl,
            };
            submissions.push(newSubmission);
        }
        
        await writeSubmissionsFile(submissions, submissionsContent);
        
        // Update the task status to 'Submitted'
        const { data: tasksData, content: tasksContent } = await readTasksFile();
        const tasks = tasksData.items || [];
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex !== -1 && tasks[taskIndex].status !== "Submitted") {
            tasks[taskIndex].status = "Submitted";
            await writeTasksFile(tasks, tasksContent);
        }

        // Revalidate paths to refresh data across the app
        revalidatePath("/dashboard/submissions");
        revalidatePath("/dashboard/orchestrator-tasks");
        revalidatePath("/dashboard"); 
        revalidatePath("/dashboard/scores");
        revalidatePath("/dashboard/analytical");

        return { success: true };

    } catch (error) {
        console.error("Error processing submission:", error);
        return { success: false, error: "An unexpected error occurred on the server." };
    }
}
