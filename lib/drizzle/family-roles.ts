// Standalone definition of FamilyRoles to bypass import issues
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// Define FamilyRoles table schema directly without importing from schema.ts
export const FamilyRoles = pgTable('family_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), 
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

// Also export the type for FamilyRole
export type FamilyRole = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};
