import { db } from '@/lib/drizzle/client';
import { Families, FamilyMembers, FamilyRoles, Users } from '@/lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export type Family = typeof Families.$inferSelect;
export type FamilyMember = typeof FamilyMembers.$inferSelect;
export type FamilyRole = typeof FamilyRoles.$inferSelect;

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
    const roles = await db.select().from(FamilyRoles);
    return roles;
  } catch (error) {
    console.error("Error fetching family roles:", error);
    throw new Error("Failed to fetch family roles.");
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
    // Join FamilyMembers with Families and FamilyRoles
    const results = await db
      .select({
        family: Families,
        familyRole: FamilyRoles
      })
      .from(FamilyMembers)
      .innerJoin(Families, eq(FamilyMembers.family_id, Families.id))
      .leftJoin(FamilyRoles, eq(FamilyMembers.family_role_id, FamilyRoles.id))
      .where(eq(FamilyMembers.user_id, userId));
    
    // Convert SQL null to undefined for TypeScript compatibility
    return results.map(item => ({
      family: item.family,
      familyRole: item.familyRole || undefined
    }));
  } catch (error) {
    console.error(`Error fetching families for user ${userId}:`, error);
    throw new Error("Failed to fetch families for user.");
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
    const members = await db
      .select({
        user: Users,
        familyRole: FamilyRoles
      })
      .from(FamilyMembers)
      .innerJoin(Users, eq(FamilyMembers.user_id, Users.id))
      .leftJoin(FamilyRoles, eq(FamilyMembers.family_role_id, FamilyRoles.id))
      .where(eq(FamilyMembers.family_id, familyId));
    
    // Convert SQL null to undefined for TypeScript compatibility
    return members.map(item => ({
      user: item.user,
      familyRole: item.familyRole || undefined
    }));
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
      .select()
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
