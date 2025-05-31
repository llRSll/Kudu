/**
 * Type definitions for document-related entities
 */

export interface Document {
  id: string;
  name?: string;
  type?: string;
  url?: string;
  file_size?: string;
  description?: string;
  metadata?: unknown;
  property_id?: string;
  entity_id?: string;
  investment_id?: string;
  family_id?: string;
  uploaded_by?: string;
  created_at?: Date;
  updated_at?: Date;
  last_modified?: Date;
  version?: string;
}
