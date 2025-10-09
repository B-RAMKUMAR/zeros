'use server';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/lib/types";
import { getUsers } from "./data";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { revalidatePath } from "next/cache";


const contentDirectory = path.join(process.cwd(), "samplemd");
const usersFilePath = path.join(contentDirectory, "users.md");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

async function readUsersFile(): Promise<{ content: string; data: { items: User[] } }> {
  const fileContents = await fs.readFile(usersFilePath, "utf8");
  const { content, data } = matter(fileContents);
  return { content, data: data as { items: User[] } };
}

async function writeUsersFile(users: User[], originalContent: string): Promise<void> {
  const newData = matter.stringify(originalContent, { items: users });
  await fs.writeFile(usersFilePath, newData);
}


export async function login(formData: unknown): Promise<{ error: string } | { success: true }> {
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return { error: "Invalid data format." };
  }

  const { email, password } = validation.data;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (user && user.password === password) {
    // Omit password from the cookie
    const { password: _password, ...userToStore } = user;
    
    cookies().set("currentUser", JSON.stringify(userToStore), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    // Redirect must be called outside of a try/catch block.
  } else {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function logout() {
  cookies().delete("currentUser");
  redirect("/login");
}

export async function getCurrentUser(): Promise<User | null> {
  const userCookie = cookies().get("currentUser")?.value;
  if (userCookie && typeof userCookie === 'string' && userCookie.trim() !== '') {
    try {
      return JSON.parse(userCookie) as User;
    } catch (e) {
      console.error("Failed to parse user cookie:", e);
      return null;
    }
  }
  return null;
}

export async function checkUserByEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const users = await getUsers();
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return { success: true };
    } else {
      return { success: false, error: "This email address is not registered for the program. Please contact your orchestrator." };
    }
  } catch (error) {
    console.error("Error checking user by email:", error);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

export async function updateUserPassword(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, content } = await readUsersFile();
    const users = data.items || [];
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      return { success: false, error: "User not found." };
    }
    
    users[userIndex].password = password;

    await writeUsersFile(users, content);
    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "An unexpected server error occurred." };
  }
}

export async function deleteUserAction(userId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const { data, content } = await readUsersFile();
        let users = data.items || [];
        
        const initialLength = users.length;
        users = users.filter(u => u.id !== userId);

        if (users.length === initialLength) {
            return { success: false, error: "User not found." };
        }

        await writeUsersFile(users, content);
        
        revalidatePath("/dashboard/people");
        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}
