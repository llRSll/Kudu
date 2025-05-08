"use server"

import { db } from "../drizzle/client";
import { Users, Roles, UserRoles, FamilyMembers } from "../drizzle/schema";
import { InferSelectModel, InferInsertModel, eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define the type based on the Drizzle schema
export type User = InferSelectModel<typeof Users>;
// Define the type for inserting a new user (can omit fields like id, created_at)
export type NewUser = InferInsertModel<typeof Users>;
export type Role = InferSelectModel<typeof Roles>;

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

// Action to fetch a single user by ID
export async function getUserById(userId: string): Promise<User | null> {
  if (!userId) {
    return null;
  }

  try {
    const userResult = await db.select().from(Users).where(eq(Users.id, userId)).limit(1);
    return userResult[0] || null; // Return the first user found or null
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw new Error("Failed to fetch user data."); // Or return null/handle differently
  }
}

// Action to fetch all roles
export async function getRoles(): Promise<Role[]> {
  try {
    const roles = await db.select().from(Roles);
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw new Error("Failed to fetch roles.");
  }
}

// Action to fetch assigned role IDs for a specific user
export async function getUserRoles(userId: string): Promise<string[]> {
  if (!userId) {
    return [];
  }

  try {
    const userRoles = await db
      .select({ roleId: UserRoles.role_id })
      .from(UserRoles)
      .where(eq(UserRoles.user_id, userId));
    
    return userRoles.map(ur => ur.roleId);
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    throw new Error("Failed to fetch user roles.");
  }
}

// Action to update an existing user
export async function updateUser(
  userId: string, 
  updatedData: Partial<NewUser> & { roleIds?: string[] }
): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required for update.");
  }

  try {
    // Extract roleIds from the updatedData
    const { roleIds, ...userData } = updatedData;

    // Prepare data for update, ensuring updated_at is set
    const dataToUpdate = {
      ...userData,
      updated_at: new Date(),
    };

    // Remove fields that should not be updated directly if necessary (e.g., id, created_at)
    // delete dataToUpdate.id; 
    // delete dataToUpdate.created_at;

    // Update user data in a transaction to ensure consistency
    await db.transaction(async (tx) => {
      // Update the user's basic information
      await tx.update(Users)
        .set(dataToUpdate)
        .where(eq(Users.id, userId));
      
      // If roleIds are provided, update the user's roles
      if (roleIds) {
        await updateUserRoles(userId, roleIds, tx);
      }
    });

    // Revalidate the user list and the specific user edit page
    revalidatePath('/users');
    revalidatePath(`/users/${userId}/edit`);

  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    // Add specific error checks if needed (e.g., unique constraint on email if it's changeable)
    throw new Error("Failed to update user data.");
  }
}

// Action to update a user's roles
export async function updateUserRoles(
  userId: string, 
  roleIds: string[],
  tx?: any // Optional transaction object
): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required to update roles.");
  }

  try {
    const dbToUse = tx || db; // Use provided transaction or default db
    
    // First, delete all existing role assignments for the user
    await dbToUse.delete(UserRoles)
      .where(eq(UserRoles.user_id, userId));
    
    // If there are roleIds to assign, insert them
    if (roleIds && roleIds.length > 0) {
      // Create role assignments
      const roleAssignments = roleIds.map(roleId => ({
        user_id: userId,
        role_id: roleId,
        assigned_at: new Date()
      }));
      
      // Insert new role assignments
      await dbToUse.insert(UserRoles)
        .values(roleAssignments)
        .onConflictDoNothing(); // Handle case where role assignment already exists
    }
    
    // Only revalidate paths if not part of a transaction
    if (!tx) {
      revalidatePath('/users');
      revalidatePath(`/users/${userId}/edit`);
    }
  } catch (error) {
    console.error(`Error updating roles for user ${userId}:`, error);
    throw new Error("Failed to update user roles.");
  }
}

export async function createUser(formData: FormData): Promise<string> {
  const userData = {
    first_name: formData.get("first_name") as string,
    surname: formData.get("surname") as string,
    email: formData.get("email") as string,
    role: formData.get("role") as string,
    status: formData.get("status") as string,
    avatar_url: null,
    last_login: null,
  };

  // Get role IDs from the form data (if using multi-select)
  const roleIds = formData.getAll("roleIds") as string[];

  // Basic validation (more robust validation recommended in production)
  if (!userData.email || !userData.first_name || !userData.surname || !userData.status) {
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

    // Define userId with an initial value to satisfy TypeScript
    let userId = '';

    // Use a transaction to ensure consistency
    await db.transaction(async (tx) => {
      // Insert the user
      const [newUser] = await tx.insert(Users)
        .values(userToInsert)
        .returning({ id: Users.id });
      
      userId = newUser.id;
      
      // If roleIds are provided, assign roles to the user
      if (roleIds && roleIds.length > 0) {
        await updateUserRoles(userId, roleIds, tx);
      }
      // If legacy role is provided but no roleIds, try to find the role by name and assign it
      else if (userData.role) {
        const role = await tx.select({ id: Roles.id })
          .from(Roles)
          .where(eq(Roles.name, userData.role))
          .limit(1);
        
        if (role.length > 0) {
          await updateUserRoles(userId, [role[0].id], tx);
        }
      }
    });

    // Revalidate the users page cache to show the new user immediately
    revalidatePath('/users');
    
    return userId;

  } catch (error) {
    // Log the full error for server-side debugging
    console.error("Error creating user in database:", error);
    // Check for unique constraint violation (e.g., email already exists)
    if (error instanceof Error && 'code' in error && error.code === '23505') { // PostgreSQL unique violation code
      throw new Error("A user with this email already exists.");
    } else {
      throw new Error("Failed to create user. Please try again.");
    }
  }
}

// New function to delete a user
export async function deleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
  if (!userId) {
    return { success: false, message: "User ID is required for deletion." };
  }

  try {
    await db.transaction(async (tx) => {
      // 1. Delete from UserRoles
      console.log(`Deleting user roles for user ID: ${userId}`);
      await tx.delete(UserRoles).where(eq(UserRoles.user_id, userId));

      // 2. Delete from FamilyMembers
      console.log(`Deleting family memberships for user ID: ${userId}`);
      await tx.delete(FamilyMembers).where(eq(FamilyMembers.user_id, userId));
      
      // Add deletions from other related tables here if necessary
      // Example:
      // await tx.delete(UserActivity).where(eq(UserActivity.user_id, userId));
      // await tx.delete(UserPreferences).where(eq(UserPreferences.user_id, userId));

      // 3. Delete the user from the Users table
      console.log(`Deleting user from Users table with ID: ${userId}`);
      const deleteResult = await tx.delete(Users).where(eq(Users.id, userId)).returning({ id: Users.id });

      if (deleteResult.length === 0) {
        throw new Error("User not found or already deleted.");
      }
    });

    // Revalidate paths to reflect the deletion
    revalidatePath('/users');
    revalidatePath('/'); // Revalidate home if users are listed there or count is shown

    console.log(`User ${userId} deleted successfully.`);
    return { success: true };

  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    let message = "Failed to delete user.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }
}
