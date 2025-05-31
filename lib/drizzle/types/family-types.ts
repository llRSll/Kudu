/**
 * Type definitions for family-related entities
 */

export interface Family {
  id: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FamilyRole {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  family_role_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
