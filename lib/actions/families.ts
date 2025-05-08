import { db } from '@/lib/drizzle/client';
import { Families, FamilyMembers, Users } from '@/lib/drizzle/schema';
import { FamilyRoles, FamilyRole } from '@/lib/drizzle/family-roles'; // Import both table and type
import { eq, and, sql } from 'drizzle-orm';

export type Family = typeof Families.$inferSelect;
export type FamilyMember = typeof FamilyMembers.$inferSelect;
// Re-export the FamilyRole type from family-roles.ts
export type { FamilyRole };

/**
 * Fetch all families
 */
export async function getFamilies(): Promise<Family[]> {
  try {
    const families = await db.select().from(Families);
    return families;
  } catch (error) {
    console.error("Error fetching families:", error);
    throw new Error("Failed to fetch families.");
  }
}

/**
 * Fetch a specific family by ID
 */
export async function getFamily(familyId: string): Promise<Family | undefined> {
  if (!familyId) {
    throw new Error("Family ID is required");
  }
  
  try {
    const family = await db
      .select()
      .from(Families)
      .where(eq(Families.id, familyId))
      .limit(1);
    
    return family[0];
  } catch (error) {
    console.error(`Error fetching family ${familyId}:`, error);
    throw new Error("Failed to fetch family.");
  }
}

/**
 * Create a new family
 */
export async function createFamily(name: string): Promise<Family> {
  if (!name || name.trim() === '') {
    throw new Error("Family name is required");
  }
  
  try {
    const [family] = await db
      .insert(Families)
      .values({
        name,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    
    return family;
  } catch (error) {
    console.error("Error creating family:", error);
    throw new Error("Failed to create family.");
  }
}

/**
 * Fetch all family roles
 */
export async function getFamilyRoles(): Promise<FamilyRole[]> {
  try {
    // Try to fetch directly from SQL table to avoid schema reference issues
    const query = `SELECT id, name, description, created_at, updated_at 
                  FROM "family_roles" 
                  ORDER BY name`;
    
    const { rows } = await db.execute(query);
    
    // Define expected shape for raw SQL result
    interface RawFamilyRoleRow {
      id: unknown;
      name: unknown;
      description: unknown;
      created_at: unknown;
      updated_at: unknown;
    }
    
    // Cast rows to RawFamilyRoleRow[] via unknown to inform TypeScript of the expected shape
    const typedRows = (rows || []) as unknown as RawFamilyRoleRow[];

    // Map raw rows to the expected FamilyRole type
    return typedRows.map((row: RawFamilyRoleRow) => ({
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | null,
      created_at: row.created_at ? new Date(row.created_at as string) : null,
      updated_at: row.updated_at ? new Date(row.updated_at as string) : null
    }));
  } catch (error) {
    console.error("Error fetching family roles:", error);
    // Return an empty array instead of throwing to prevent UI failures
    return [];
  }
}

/**
 * Fetch families for a specific user
 */
export async function getFamiliesForUser(userId: string): Promise<{ 
  family: Family, 
  familyRole?: FamilyRole | undefined 
}[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  
  try {
    // Using SQL query to avoid potential issues with the standalone FamilyRoles schema
    const query = sql`
      SELECT 
        f.id as family_id, f.name as family_name, f.created_at as family_created_at, f.updated_at as family_updated_at,
        fr.id as role_id, fr.name as role_name, fr.description as role_description, 
        fr.created_at as role_created_at, fr.updated_at as role_updated_at
      FROM family_members fm
      INNER JOIN families f ON fm.family_id = f.id
      LEFT JOIN family_roles fr ON fm.family_role_id = fr.id
      WHERE fm.user_id = ${userId}
    `;
    
    const result = await db.execute(query);
    
    // Get rows from query result and ensure it's an array
    const rows = (result as any).rows || [];
    
    // Map raw SQL results to expected types with proper typing
    return rows.map((row: Record<string, unknown>) => {
      const role = row.role_id ? {
        id: row.role_id as string,
        name: row.role_name as string,
        description: row.role_description as string | null,
        created_at: row.role_created_at ? new Date(row.role_created_at as string) : null,
        updated_at: row.role_updated_at ? new Date(row.role_updated_at as string) : null
      } : undefined;
      
      return {
        family: {
          id: row.family_id as string,
          name: row.family_name as string,
          created_at: row.family_created_at ? new Date(row.family_created_at as string) : null,
          updated_at: row.family_updated_at ? new Date(row.family_updated_at as string) : null
        },
        familyRole: role
      };
    });
  } catch (error) {
    console.error(`Error fetching families for user ${userId}:`, error);
    // Return empty array instead of throwing to prevent cascading UI failures
    return [];
  }
}

/**
 * Fetch members of a specific family with their roles
 */
export async function getFamilyMembers(familyId: string): Promise<{
  user: typeof Users.$inferSelect,
  familyRole?: FamilyRole | undefined
}[]> {
  if (!familyId) {
    throw new Error("Family ID is required");
  }
  
  try {
    // Use raw SQL query to avoid issues with the standalone schemas
    const query = sql`
      SELECT 
        u.id, u.email, u.first_name, u.middle_initial, u.surname, u.full_name, 
        u.phone_number, u.dob, u.tax_file_number, u.avatar_url, u.preferences, 
        u.status, u.role, u.created_at as user_created_at, u.updated_at as user_updated_at, u.last_login,
        fr.id as role_id, fr.name as role_name, fr.description as role_description, 
        fr.created_at as role_created_at, fr.updated_at as role_updated_at
      FROM family_members fm
      INNER JOIN users u ON fm.user_id = u.id
      LEFT JOIN family_roles fr ON fm.family_role_id = fr.id
      WHERE fm.family_id = ${familyId}
    `;
    
    const result = await db.execute(query);
    
    // Get rows from query result and ensure it's an array
    const rows = (result as any).rows || [];
    
    // Map raw SQL results to expected types
    return rows.map((row: Record<string, unknown>) => {
      // Create role object if role_id exists
      const role = row.role_id ? {
        id: row.role_id as string,
        name: row.role_name as string,
        description: row.role_description as string | null,
        created_at: row.role_created_at ? new Date(row.role_created_at as string) : null,
        updated_at: row.role_updated_at ? new Date(row.role_updated_at as string) : null
      } : undefined;
      
      // Create a user object from the row data
      const user = {
        id: row.id as string,
        email: row.email as string,
        first_name: row.first_name as string | null,
        middle_initial: row.middle_initial as string | null,
        surname: row.surname as string | null,
        full_name: row.full_name as string | null,
        phone_number: row.phone_number as string | null,
        dob: row.dob as string | null,
        tax_file_number: row.tax_file_number as string | null,
        avatar_url: row.avatar_url as string | null,
        preferences: row.preferences as any,
        status: row.status as string | null,
        role: row.role as string | null,
        created_at: row.user_created_at ? new Date(row.user_created_at as string) : null,
        updated_at: row.user_updated_at ? new Date(row.user_updated_at as string) : null,
        last_login: row.last_login ? new Date(row.last_login as string) : null
      };
      
      return {
        user,
        familyRole: role
      };
    });
  } catch (error) {
    console.error(`Error fetching members for family ${familyId}:`, error);
    throw new Error("Failed to fetch family members.");
  }
}

/**
 * Add a user to a family with a specific role
 */
export async function addUserToFamily(
  userId: string, 
  familyId: string, 
  familyRoleId?: string
): Promise<FamilyMember> {
  if (!userId || !familyId) {
    throw new Error("User ID and Family ID are required");
  }
  
  try {
    // Check if user is already in this family
    const existingMembership = await db
      .select({
        id: FamilyMembers.id,
        user_id: FamilyMembers.user_id, // Keep original column name for consistency with table
        family_id: FamilyMembers.family_id // Keep original column name
      })
      .from(FamilyMembers)
      .where(
        and(
          eq(FamilyMembers.user_id, userId),
          eq(FamilyMembers.family_id, familyId)
        )
      )
      .limit(1);
    
    if (existingMembership.length > 0) {
      throw new Error("User is already a member of this family");
    }
    
    const [membership] = await db
      .insert(FamilyMembers)
      .values({
        user_id: userId,
        family_id: familyId,
        family_role_id: familyRoleId || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    
    return membership;
  } catch (error) {
    console.error(`Error adding user ${userId} to family ${familyId}:`, error);
    throw new Error("Failed to add user to family.");
  }
}

/**
 * Update a user's role within a family
 */
export async function updateFamilyMemberRole(
  userId: string,
  familyId: string,
  familyRoleId: string
): Promise<FamilyMember> {
  if (!userId || !familyId) {
    throw new Error("User ID and Family ID are required");
  }
  
  try {
    const [updated] = await db
      .update(FamilyMembers)
      .set({
        family_role_id: familyRoleId,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(FamilyMembers.user_id, userId),
          eq(FamilyMembers.family_id, familyId)
        )
      )
      .returning();
    
    if (!updated) {
      throw new Error("Family membership not found");
    }
    
    return updated;
  } catch (error) {
    console.error(`Error updating role for user ${userId} in family ${familyId}:`, error);
    throw new Error("Failed to update family member role.");
  }
}

/**
 * Remove a user from a family
 */
export async function removeUserFromFamily(
  userId: string,
  familyId: string
): Promise<boolean> {
  if (!userId || !familyId) {
    throw new Error("User ID and Family ID are required");
  }
  
  try {
    const result = await db
      .delete(FamilyMembers)
      .where(
        and(
          eq(FamilyMembers.user_id, userId),
          eq(FamilyMembers.family_id, familyId)
        )
      );
    
    return true;
  } catch (error) {
    console.error(`Error removing user ${userId} from family ${familyId}:`, error);
    throw new Error("Failed to remove user from family.");
  }
}
