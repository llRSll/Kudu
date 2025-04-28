"use server"

import { db } from "../drizzle/client";
import { Users } from "../drizzle/schema";
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define the type based on the Drizzle schema
export type User = InferSelectModel<typeof Users>;
// Define the type for inserting a new user (can omit fields like id, created_at)
export type NewUser = InferInsertModel<typeof Users>;

export async function getUsers(): Promise<User[]> {
  try {
    // Fetch all users from the database
    // Selecting specific columns for efficiency might be better in production
    const users = await db.select().from(Users);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    // In a real app, you might want to throw a more specific error
    // or return an empty array/error state
    throw new Error("Failed to fetch users.");
  }
}

export async function createUser(formData: FormData): Promise<void> {
  const userData = {
    first_name: formData.get("first_name") as string,
    surname: formData.get("surname") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    status: formData.get("status") as string,
    avatar_url: null,
    last_login: null,
  };

  // Basic validation (more robust validation recommended in production)
  if (!userData.email || !userData.first_name || !userData.surname || !userData.role || !userData.status) {
    throw new Error("Missing required user fields.");
  }

  try {
    // Set created_at timestamp
    const userToInsert = {
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
      // Ensure all fields expected by the DB are here, even if null/default
    };

    await db.insert(Users).values(userToInsert);

    // Revalidate the users page cache to show the new user immediately
    revalidatePath('/users');

  } catch (error) {
    // Log the full error for server-side debugging
    console.error("Error creating user in database:", error);
    // Check for unique constraint violation (e.g., email already exists)
    if (error instanceof Error && 'code' in error && error.code === '23505') { // PostgreSQL unique violation code
      throw new Error("A user with this email already exists.");
    }
    // Throw a more generic error for the client, but keep the specific one logged on the server
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown database error'}`);
  }
}
