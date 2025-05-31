/**
 * Type definitions for entity and investment related structures
 */

export interface Entity {
  id: string;
  name?: string;
  description?: string;
  type?: string;
  user_id?: string;
  family_id?: string;
  abn?: string;
  acn?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EntityRelationship {
  id: string;
  parent_entity_id?: string;
  child_entity_id?: string;
  relationship_type?: string;
  ownership_percentage?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Investment {
  id: string;
  investment_type?: string;
  user_id?: string;
  family_id?: string;
  entity_id?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}
