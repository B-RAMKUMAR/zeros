'use server';

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import type { AccessRequest, User } from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "samplemd");
const requestsFilePath = path.join(contentDirectory, "requests.md");
const usersFilePath = path.join(contentDirectory, "users.md");

type CreateRequestInput = {
  fullName: string;
  email: string;
  role: string;
};

// --- Requests File ---
async function readRequestsFile(): Promise<{ content: string; data: { items: AccessRequest[] } }> {
  const fileContents = await fs.readFile(requestsFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: AccessRequest[] } };
}

async function writeRequestsFile(requests: AccessRequest[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: requests });
  await fs.writeFile(requestsFilePath, newData);
}

// --- Users File ---
async function readUsersFile(): Promise<{ content: string; data: { items: User[] } }> {
  const fileContents = await fs.readFile(usersFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: User[] } };
}

async function writeUsersFile(users: User[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: users });
  await fs.writeFile(usersFilePath, newData);
}


export async function getAccessRequests(): Promise<AccessRequest[]> {
    const { data } = await readRequestsFile();
    return data.items || [];
}

export async function createAccessRequest(input: CreateRequestInput): Promise<{ success: boolean; error?: string }> {
    const { fullName, email, role } = input;
    try {
        const { data, content } = await readRequestsFile();
        const requests = data.items || [];

        const existingRequest = requests.find(r => r.userEmail === email && r.status === "Pending");
        if (existingRequest) {
            return { success: false, error: "An access request for this email is already pending." };
        }

        const newRequest: AccessRequest = {
            id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
            userName: fullName,
            userEmail: email,
            userRole: role,
            requestedAt: new Date().toISOString(),
            status: 'Pending',
        };

        const updatedRequests = [...requests, newRequest];
        await writeRequestsFile(updatedRequests, content);
        
        revalidatePath("/dashboard/requests");

        return { success: true };

    } catch (error) {
        console.error("Error creating access request:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

export async function approveAccessRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Update the request status
        const { data: requestsData, content: requestsContent } = await readRequestsFile();
        let requests = requestsData.items || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);

        if (requestIndex === -1) {
            return { success: false, error: "Access request not found." };
        }
        
        if(requests[requestIndex].status !== 'Pending') {
            return { success: false, error: "This request has already been processed." };
        }
        
        const request = requests[requestIndex];
        request.status = 'Approved';
        await writeRequestsFile(requests, requestsContent);

        // 2. Create a new user
        const { data: usersData, content: usersContent } = await readUsersFile();
        let users = usersData.items || [];

        if (users.some(u => u.email === request.userEmail)) {
            // User already exists, perhaps manually added. Don't throw error, just approve.
        } else {
             const newUser: User = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name: request.userName,
                email: request.userEmail,
                role: 'Apprentice', // Default role
                avatar: `/avatars/${(users.length % 5) + 1}.png`,
                password: 'pass123' // Default password
            };
            const updatedUsers = [...users, newUser];
            await writeUsersFile(updatedUsers, usersContent);
        }

        revalidatePath("/dashboard/requests");
        revalidatePath("/dashboard/people");
        revalidatePath("/dashboard");

        return { success: true };

    } catch (error) {
        console.error("Error approving request:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

export async function rejectAccessRequest(requestId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const { data, content } = await readRequestsFile();
        let requests = data.items || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);

        if (requestIndex === -1) {
            return { success: false, error: "Access request not found." };
        }
        
        if(requests[requestIndex].status !== 'Pending') {
            return { success: false, error: "This request has already been processed." };
        }

        requests[requestIndex].status = 'Rejected';
        await writeRequestsFile(requests, content);

        revalidatePath("/dashboard/requests");
        
        return { success: true };

    } catch (error) {
        console.error("Error rejecting request:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}
