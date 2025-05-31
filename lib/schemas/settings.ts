import { z } from 'zod';
import { InferSelectModel } from 'drizzle-orm';
import { Users } from "../drizzle/schema";

export type User = InferSelectModel<typeof Users>;

// Zod schemas for validation
export const accountSettingsSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  middle_initial: z.string().max(1, "Middle initial must be 1 character").optional().nullable(),
  surname: z.string().min(1, "Surname is required").max(50, "Surname must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  tax_file_number: z.string().optional().nullable(),
});

export const notificationSettingsSchema = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  marketing_emails: z.boolean().default(false),
  security_alerts: z.boolean().default(true),
  family_updates: z.boolean().default(true),
  financial_summaries: z.boolean().default(true),
});

export const securitySettingsSchema = z.object({
  two_factor_enabled: z.boolean().default(false),
  session_timeout: z.number().min(15).max(1440).default(60), // minutes
  login_notifications: z.boolean().default(true),
  password_expiry: z.number().min(30).max(365).default(90), // days
});

export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  currency: z.string().default('AUD'),
  date_format: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']).default('DD/MM/YYYY'),
  timezone: z.string().default('Australia/Sydney'),
});

export const privacySettingsSchema = z.object({
  profile_visibility: z.enum(['public', 'family', 'private']).default('family'),
  data_sharing: z.boolean().default(false),
  analytics_tracking: z.boolean().default(true),
  third_party_integrations: z.boolean().default(false),
});

export type AccountSettingsData = z.infer<typeof accountSettingsSchema>;
export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;
export type SecuritySettingsData = z.infer<typeof securitySettingsSchema>;
export type AppearanceSettingsData = z.infer<typeof appearanceSettingsSchema>;
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>;
