/**
 * Type definitions for user and authentication related entities
 */

export interface User {
  id: string;
  email: string;
  first_name?: string;
  middle_initial?: string;
  surname?: string;
  full_name?: string;
  phone_number?: string;
  dob?: string; // ISO date
  tax_file_number?: string;
  avatar_url?: string;
  preferences?: unknown;
  status?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
}

export interface Role {
  id: string;
  name?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Permission {
  id: string;
  name?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  created_at?: Date;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at?: Date;
}

export interface Credential {
  id: string;
  user_id?: string;
  service_name?: string;
  username?: string;
  password?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}
