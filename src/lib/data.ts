'use server';
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { User, Task, Announcement, Submission, AccessRequest } from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "samplemd");

async function readAndParseMarkdown<T>(fileName: string): Promise<{ data: { items: T[] }, content: string }> {
  const filePath = path.join(contentDirectory, fileName);
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = await marked(content);
    return { data: data as { items: T[] }, content: htmlContent };
  } catch (error) {
    console.error(`Error reading or parsing ${fileName}:`, error);
    // Provide a default structure on error to prevent crashes
    return { data: { items: [] }, content: "" };
  }
}

export async function getUsers(): Promise<User[]> {
  const { data } = await readAndParseMarkdown<User>("users.md");
  return data.items || [];
}

export async function getUserById(id: number): Promise<User | undefined> {
    const users = await getUsers();
    return users.find(user => user.id === id);
}

export async function getTasks(): Promise<Task[]> {
  const { data } = await readAndParseMarkdown<Task>("tasks.md");
  return data.items || [];
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await readAndParseMarkdown<Announcement>("announcements.md");
  return (data.items || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPlaybook() {
    const filePath = path.join(contentDirectory, "playbook.md");
    const fileContents = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(fileContents);
    const htmlContent = await marked(content);
    return { content: htmlContent, title: data.title as string };
}

export async function getPlaybookSections(): Promise<{title: string, content: string}[]> {
    const filePath = path.join(contentDirectory, "playbook.md");
    const fileContents = await fs.readFile(filePath, "utf8");
    
    const sections = fileContents.split(/^---\s*$/gm).filter(Boolean);

    const processedSections = await Promise.all(sections.map(async (section) => {
        const { data, content } = matter(section);
        const htmlContent = await marked(content);
        return {
            title: data.title || 'Untitled',
            content: htmlContent
        };
    }));

    return processedSections;
}


export async function getSubmissions(): Promise<Submission[]> {
    const { data } = await readAndParseMarkdown<Submission>("submissions.md");
    return data.items || [];
}

export async function getAccessRequests(): Promise<AccessRequest[]> {
    const { data } = await readAndParseMarkdown<AccessRequest>("requests.md");
    return data.items || [];
}
