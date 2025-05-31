"use server"

import { db } from "../drizzle/client";
import { Users } from "../drizzle/schema";
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  User,
  accountSettingsSchema,
  notificationSettingsSchema,
  securitySettingsSchema,
  appearanceSettingsSchema,
  privacySettingsSchema,
  AccountSettingsData,
  NotificationSettingsData,
  SecuritySettingsData,
  AppearanceSettingsData,
  PrivacySettingsData,
} from '../schemas/settings';

// Action to get user settings by ID
export async function getUserSettings(userId: string): Promise<User | null> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const userResult = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1);

    return userResult[0] || null;
  } catch (error) {
    console.error(`Error fetching user settings for ID ${userId}:`, error);
    throw new Error("Failed to fetch user settings");
  }
}

// Action to update account settings
export async function updateAccountSettings(userId: string, data: AccountSettingsData) {
  try {
    // Validate the data
    const validatedData = accountSettingsSchema.parse(data);
    
    // Build full name from components
    const fullName = [
      validatedData.first_name,
      validatedData.middle_initial,
      validatedData.surname
    ].filter(Boolean).join(' ');

    // Update user in database
    const updatedUser = await db
      .update(Users)
      .set({
        first_name: validatedData.first_name,
        middle_initial: validatedData.middle_initial || null,
        surname: validatedData.surname,
        full_name: fullName,
        email: validatedData.email,
        phone_number: validatedData.phone_number || null,
        dob: validatedData.dob || null,
        tax_file_number: validatedData.tax_file_number || null,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();
    
    // Add tag to revalidatePath to prevent infinite loops
    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/account', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating account settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to update account settings' };
  }
}

// Action to update notification preferences
export async function updateNotificationSettings(userId: string, data: NotificationSettingsData) {
  try {
    // Validate the data
    const validatedData = notificationSettingsSchema.parse(data);
    
    // Get current preferences
    const currentUser = await getUserSettings(userId);
    const currentPreferences = (currentUser?.preferences as any) || {};
    
    // Update preferences with notification settings
    const updatedPreferences = {
      ...currentPreferences,
      notifications: validatedData,
    };

    // Update user preferences in database
    const updatedUser = await db
      .update(Users)
      .set({
        preferences: updatedPreferences,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/notifications', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to update notification settings' };
  }
}

// Action to update security settings
export async function updateSecuritySettings(userId: string, data: SecuritySettingsData) {
  try {
    // Validate the data
    const validatedData = securitySettingsSchema.parse(data);
    
    // Get current preferences
    const currentUser = await getUserSettings(userId);
    const currentPreferences = (currentUser?.preferences as any) || {};
    
    // Update preferences with security settings
    const updatedPreferences = {
      ...currentPreferences,
      security: validatedData,
    };

    // Update user preferences in database
    const updatedUser = await db
      .update(Users)
      .set({
        preferences: updatedPreferences,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/security', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating security settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to update security settings' };
  }
}

// Action to update appearance settings
export async function updateAppearanceSettings(userId: string, data: AppearanceSettingsData) {
  try {
    // Validate the data
    const validatedData = appearanceSettingsSchema.parse(data);
    
    // Get current preferences
    const currentUser = await getUserSettings(userId);
    const currentPreferences = (currentUser?.preferences as any) || {};
    
    // Update preferences with appearance settings
    const updatedPreferences = {
      ...currentPreferences,
      appearance: validatedData,
    };

    // Update user preferences in database
    const updatedUser = await db
      .update(Users)
      .set({
        preferences: updatedPreferences,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/appearance', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to update appearance settings' };
  }
}

// Action to update privacy settings
export async function updatePrivacySettings(userId: string, data: PrivacySettingsData) {
  try {
    // Validate the data
    const validatedData = privacySettingsSchema.parse(data);
    
    // Get current preferences
    const currentUser = await getUserSettings(userId);
    const currentPreferences = (currentUser?.preferences as any) || {};
    
    // Update preferences with privacy settings
    const updatedPreferences = {
      ...currentPreferences,
      privacy: validatedData,
    };

    // Update user preferences in database
    const updatedUser = await db
      .update(Users)
      .set({
        preferences: updatedPreferences,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/privacy', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors };
    }
    return { success: false, error: 'Failed to update privacy settings' };
  }
}

// Action to update avatar
export async function updateUserAvatar(userId: string, avatarUrl: string) {
  try {
    // Get current avatar URL to clean up old file
    const currentUser = await db
      .select({ avatar_url: Users.avatar_url })
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1);

    const updatedUser = await db
      .update(Users)
      .set({
        avatar_url: avatarUrl,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    // Clean up old avatar file if it exists
    if (currentUser[0]?.avatar_url && currentUser[0].avatar_url !== avatarUrl) {
      // Delete old avatar file
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const filename = currentUser[0].avatar_url.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'avatars', filename);
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Failed to delete old avatar file:', error);
      }
    }

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/account', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error updating user avatar:', error);
    return { success: false, error: 'Failed to update avatar' };
  }
}

// Action to remove avatar
export async function removeUserAvatar(userId: string) {
  try {
    // Get current avatar URL to clean up file
    const currentUser = await db
      .select({ avatar_url: Users.avatar_url })
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1);

    const updatedUser = await db
      .update(Users)
      .set({
        avatar_url: null,
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    // Clean up avatar file if it exists
    if (currentUser[0]?.avatar_url) {
      // Delete avatar file
      try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const filename = currentUser[0].avatar_url.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'avatars', filename);
          await unlink(filePath);
        }
      } catch (error) {
        console.warn('Failed to delete avatar file:', error);
      }
    }

    revalidatePath('/settings', 'layout');
    revalidatePath('/settings/account', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error removing user avatar:', error);
    return { success: false, error: 'Failed to remove avatar' };
  }
}

// Action to delete user account (soft delete by updating status)
export async function deleteUserAccount(userId: string) {
  try {
    const updatedUser = await db
      .update(Users)
      .set({
        status: 'deleted',
        updated_at: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning();

    revalidatePath('/settings', 'layout');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Error deleting user account:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}
