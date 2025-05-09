"use server"

import { db } from "../drizzle/client";
import { Users, Roles, UserRoles, FamilyMembers } from "../drizzle/schema";
import { InferSelectModel, InferInsertModel, eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

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
export async function updateUser(userId: string, payload: Partial<typeof Users.$inferInsert> & { roleIds?: string[] }) {
  console.log(`[updateUser] Attempting to update user with ID: ${userId}`);
  console.log('[updateUser] Received payload:', payload);

  const dataToUpdate: Partial<typeof Users.$inferInsert> = {};

  // Directly use properties from the payload object
  if (payload.email) dataToUpdate.email = payload.email;
  if (payload.first_name) dataToUpdate.first_name = payload.first_name;
  dataToUpdate.middle_initial = payload.middle_initial; // Allow setting to null
  if (payload.surname) dataToUpdate.surname = payload.surname;
  dataToUpdate.phone_number = payload.phone_number;

  // Handle date of birth (dob)
  if (payload.dob === '') {
    dataToUpdate.dob = null; // Convert empty string to null for the database
  } else if (payload.dob) {
    dataToUpdate.dob = payload.dob; // Assign if it's a non-empty string (assume valid date format for now)
  }
  // If payload.dob is null or undefined, it won't be added to dataToUpdate, so it won't be changed

  dataToUpdate.tax_file_number = payload.tax_file_number;
  dataToUpdate.avatar_url = payload.avatar_url;
  if (payload.status) dataToUpdate.status = payload.status;
  // Do not directly set dataToUpdate.role from payload.role here, as it will be derived from roleIds
  // if (payload.role) dataToUpdate.role = payload.role;

  let fullNameParts = [];
  if (payload.first_name) fullNameParts.push(payload.first_name.trim());
  if (payload.middle_initial && payload.middle_initial.trim()) {
    fullNameParts.push(payload.middle_initial.trim());
  }
  if (payload.surname) fullNameParts.push(payload.surname.trim());
  
  if (fullNameParts.length > 0) {
    dataToUpdate.full_name = fullNameParts.join(' ');
  }

  dataToUpdate.updated_at = new Date();

  const userRolesFromPayload = payload.roleIds || []; // Get roleIds from the payload
  console.log('[updateUser] User roles from payload:', userRolesFromPayload);

  // If roleIds are provided, try to set the primary Users.role field
  if (userRolesFromPayload.length > 0) {
    const firstRoleId = userRolesFromPayload[0];
    try {
      const roleInfo = await db.select({ name: Roles.name }).from(Roles).where(eq(Roles.id, firstRoleId)).limit(1);
      if (roleInfo.length > 0 && roleInfo[0].name) {
        dataToUpdate.role = roleInfo[0].name; // Set the main role text field
        console.log(`[updateUser] Set Users.role to '${dataToUpdate.role}' based on first roleId.`);
      } else {
        console.warn(`[updateUser] Could not find role name for roleId: ${firstRoleId}`);
      }
    } catch (roleError) {
      console.error(`[updateUser] Error fetching role name for roleId ${firstRoleId}:`, roleError);
      // Decide if you want to halt or continue without setting Users.role
    }
  }

  console.log('[updateUser] Data to be updated in DB:', dataToUpdate);

  try {
    await db.transaction(async (tx) => {
      // Update the user's basic information
      console.log('[updateUser] Starting transaction to update Users table.');
      if (Object.keys(dataToUpdate).length > 0) { // Only update if there's something to update
        await tx.update(Users)
          .set(dataToUpdate)
          .where(eq(Users.id, userId));
        console.log('[updateUser] Users table updated.');
      } else {
        console.log('[updateUser] No basic user info fields to update in Users table.');
      }

      // Handle UserRoles: Delete existing and insert new ones
      console.log(`[updateUser] Deleting existing roles for user: ${userId}`);
      await tx.delete(UserRoles).where(eq(UserRoles.user_id, userId));
      console.log('[updateUser] Existing roles deleted.');

      if (userRolesFromPayload && userRolesFromPayload.length > 0) {
        const rolesToInsert = userRolesFromPayload.map(roleId => ({
          user_id: userId,
          role_id: roleId, // Assuming roleId is the UUID of the role from the Roles table
          assigned_at: new Date(),
        }));
        console.log('[updateUser] Inserting new roles:', rolesToInsert);
        await tx.insert(UserRoles)
          .values(rolesToInsert)
          .onConflictDoNothing(); // Handle case where role assignment already exists
        console.log('[updateUser] New roles inserted.');
      }
    });

    console.log(`[updateUser] User ${userId} and their roles updated successfully.`);
    revalidatePath('/users');
    revalidatePath(`/users/${userId}/edit`);
    return { success: true, message: 'User updated successfully' };

  } catch (error) {
    console.error(`[updateUser] Error updating user with ID ${userId}:`, error);
    let errorMessage = "Failed to update user data.";
    if (error instanceof Error) {
      // Check for PostgreSQL specific error codes if available from the error object
      if ((error as any).code === '22007') { // 'invalid_datetime_format' - specifically for date issues
        errorMessage = "Invalid date format provided for Date of Birth. Ensure it is YYYY-MM-DD or leave blank.";
      } else if ((error as any).code === '23505') { // unique_violation
         if ((error as any).constraint === 'users_email_key') {
            errorMessage = "This email address is already in use by another user.";
         } else if ((error as any).constraint === 'users_pkey') {
            // This shouldn't happen in an update, but good to be aware of
            errorMessage = "User ID conflict. This is unexpected.";
         } else {
            errorMessage = "A unique constraint was violated. Please check your input.";
         }
      } else if ((error as any).code === '22P02') { // invalid_text_representation (e.g. bad UUID)
          if ((error.message as string).includes("uuid")) {
            errorMessage = "An invalid ID was provided for one of the roles.";
          } else {
            errorMessage = "Invalid data format submitted.";
          }
      } else {
        errorMessage = error.message;
      }
    }
    // Return a structured error to the client, do not throw here if form needs to handle it
    return { success: false, message: errorMessage, errorDetail: error instanceof Error ? { name: error.name, message: error.message, code: (error as any).code } : error };
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
  console.log(`[deleteUser] Attempting to delete user with ID: ${userId}`);

  // Ensure environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[deleteUser] Supabase URL or Service Role Key is not configured.');
    return { success: false, message: 'Server configuration error.' };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // First, attempt to delete the user from Supabase Auth
    // This is often preferred first, as if this fails, you might not want to delete DB records
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      // If the user doesn't exist in Auth, it might have been already deleted or never existed.
      // Supabase returns a 404 in such cases, which is fine if we intend to clean up the DB record.
      // However, other errors (like network issues, or permissions) should be treated as failures.
      if (authError.status !== 404) {
        console.error(`[deleteUser] Error deleting user from Supabase Auth (ID: ${userId}):`, authError);
        return { success: false, message: `Failed to delete user from authentication: ${authError.message}` };
      }
      console.warn(`[deleteUser] User ${userId} not found in Supabase Auth or already deleted. Proceeding with DB deletion.`);
    }

    // Proceed with deleting from the database
    await db.transaction(async (tx) => {
      console.log(`[deleteUser] Deleting associated roles for user: ${userId} from UserRoles table.`);
      await tx.delete(UserRoles).where(eq(UserRoles.user_id, userId));
      console.log('[deleteUser] User roles deleted from UserRoles.');

      console.log(`[deleteUser] Deleting family member entries for user: ${userId} from FamilyMembers table.`);
      await tx.delete(FamilyMembers).where(eq(FamilyMembers.user_id, userId));
      console.log('[deleteUser] Family member entries deleted from FamilyMembers.');

      console.log(`[deleteUser] Deleting user: ${userId} from Users table.`);
      await tx.delete(Users).where(eq(Users.id, userId));
      console.log('[deleteUser] User deleted from Users table.');
    });

    console.log(`[deleteUser] User ${userId} successfully deleted from database and authentication.`);
    revalidatePath('/users');
    // Also revalidate any specific user page if it exists, e.g., /users/[userId]
    // revalidatePath(`/users/${userId}`);

    return { success: true, message: 'User deleted successfully from all systems.' };

  } catch (error) {
    console.error(`[deleteUser] Error during delete process for user ID ${userId}:`, error);
    let errorMessage = 'Failed to delete user.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}
