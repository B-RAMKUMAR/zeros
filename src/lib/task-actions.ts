'use server';

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import type { Task } from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "samplemd");
const tasksFilePath = path.join(contentDirectory, "tasks.md");

async function readTasksFile(): Promise<{ content: string; data: { items: Task[] } }> {
  const fileContents = await fs.readFile(tasksFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: Task[] } };
}

async function writeTasksFile(tasks: Task[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: tasks });
  await fs.writeFile(tasksFilePath, newData);
  revalidatePath("/dashboard/orchestrator-tasks");
  revalidatePath("/dashboard");
}

export async function createTaskAction(taskData: Omit<Task, "id"> & { id?: number }): Promise<void> {
  const { data, content } = await readTasksFile();
  const tasks = data.items || [];
  
  const newTask: Task = {
    ...taskData,
    id: taskData.id || (tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 101),
  };

  const updatedTasks = [...tasks, newTask];
  await writeTasksFile(updatedTasks, content);
}

export async function updateTaskAction(updatedTask: Task): Promise<void> {
  const { data, content } = await readTasksFile();
  const tasks = data.items || [];

  const taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
  if (taskIndex === -1) {
    throw new Error("Task not found");
  }

  tasks[taskIndex] = updatedTask;
  await writeTasksFile(tasks, content);
}

export async function deleteTaskAction(taskId: number): Promise<void> {
  const { data, content } = await readTasksFile();
  let tasks = data.items || [];
  
  const updatedTasks = tasks.filter(t => t.id !== taskId);

  if (tasks.length === updatedTasks.length) {
      throw new Error("Task not found for deletion");
  }

  await writeTasksFile(updatedTasks, content);
}
