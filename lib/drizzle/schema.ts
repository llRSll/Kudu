import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  numeric,
  boolean,
  integer,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";

// Import all types from the types directory
import * as Types from './types';

// 1) USERS
export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  first_name: text("first_name"),
  middle_initial: text("middle_initial"),
  surname: text("surname"),
  full_name: text("full_name"),
  phone_number: text("phone_number"),
  dob: date("dob"),
  tax_file_number: text("tax_file_number"),
  avatar_url: text("avatar_url"),
  preferences: jsonb("preferences"),
  status: text("status"),
  role: text("role"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  last_login: timestamp("last_login", { withTimezone: true }),
});

// 2) FAMILIES
export const Families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 2.1) FAMILY_ROLES
// This table defines roles within a family context.
export const FamilyRoles = pgTable("family_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 3) FAMILY_MEMBERS (pivot)
export const FamilyMembers = pgTable("family_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => Users.id),
  family_id: uuid("family_id")
    .notNull()
    .references(() => Families.id),
  family_role_id: uuid("family_role_id").references(() => FamilyRoles.id),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 4) ROLES
export const Roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 5) PERMISSIONS
export const DbPermissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique(),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 6) ROLE_PERMISSIONS (pivot, composite PK)
export const RolePermissions = pgTable(
  "role_permissions",
  {
    role_id: uuid("role_id")
      .notNull()
      .references(() => Roles.id),
    permission_id: uuid("permission_id")
      .notNull()
      .references(() => DbPermissions.id),
    created_at: timestamp("created_at", { withTimezone: true }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.role_id, table.permission_id] }),
  })
);

// 7) USER_ROLES (pivot, composite PK)
export const UserRoles = pgTable(
  "user_roles",
  {
    user_id: uuid("user_id")
      .notNull()
      .references(() => Users.id),
    role_id: uuid("role_id")
      .notNull()
      .references(() => Roles.id),
    assigned_at: timestamp("assigned_at", { withTimezone: true }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.role_id] }),
  })
);

// 8) ENTITIES
export const Entities = pgTable("entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  description: text("description"),
  type: text("type"),
  user_id: uuid("user_id").references(() => Users.id),
  family_id: uuid("family_id").references(() => Families.id),
  abn: text("abn"),
  acn: text("acn"),
  status: text("status"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 9) ENTITY_RELATIONSHIPS
export const EntityRelationships = pgTable("entity_relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  parent_entity_id: uuid("parent_entity_id").references(() => Entities.id),
  child_entity_id: uuid("child_entity_id").references(() => Entities.id),
  relationship_type: text("relationship_type"),
  ownership_percentage: numeric("ownership_percentage"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 10) INVESTMENTS
export const Investments = pgTable("investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  investment_type: text("investment_type"),
  user_id: uuid("user_id").references(() => Users.id),
  family_id: uuid("family_id").references(() => Families.id),
  entity_id: uuid("entity_id").references(() => Entities.id),
  status: text("status"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 11) PROPERTIES
export const Properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  entity_id: uuid("entity_id").references(() => Entities.id),
  user_id: uuid("user_id").references(() => Users.id),
  investment_id: uuid("investment_id").references(() => Investments.id),
  street_number: text("street_number"),
  street_name: text("street_name"),
  suburb: text("suburb"),
  postcode: text("postcode"),
  state: text("state"),
  country: text("country"),
  land_price: numeric("land_price"),
  build_price: numeric("build_price"),
  purchase_date: date("purchase_date"),
  current_valuation: numeric("current_valuation"),
  last_valuation_date: timestamp("last_valuation_date", { withTimezone: true }),
  area: numeric("area"),
  bedrooms: numeric("bedrooms"),
  bathrooms: numeric("bathrooms"),
  parking: numeric("parking"),
  has_pool: boolean("has_pool"),
  monthly_income: numeric("monthly_income"),
  property_purchase_price: numeric("property_purchase_price"),
  year_built: integer("year_built"),
  type: text("type"),
  amenities: jsonb("amenities"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  status: text("status"), // <-- Add this line
  description: text("description"), // <-- Add this line
});

// 12) DOCUMENTS
export const DbDocuments = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  type: text("type"),
  url: text("url"),
  file_size: numeric("file_size"),
  description: text("description"),
  metadata: jsonb("metadata"),
  property_id: uuid("property_id").references(() => Properties.id),
  entity_id: uuid("entity_id").references(() => Entities.id),
  investment_id: uuid("investment_id").references(() => Investments.id),
  family_id: uuid("family_id").references(() => Families.id),
  uploaded_by: uuid("uploaded_by").references(() => Users.id),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  last_modified: timestamp("last_modified", { withTimezone: true }),
  version: numeric("version"),
});

// 13) CASH_FLOWS
export const CashFlows = pgTable("cash_flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: numeric("amount"),
  debit_credit: text("debit_credit"),
  transaction_type: text("transaction_type"),
  maintenance_type: text("maintenance_type"),
  description: text("description"),
  timestamp: timestamp("timestamp", { withTimezone: true }),
  user_id: uuid("user_id").references(() => Users.id),
  family_id: uuid("family_id").references(() => Families.id),
  entity_id: uuid("entity_id").references(() => Entities.id),
  investment_id: uuid("investment_id").references(() => Investments.id),
  property_id: uuid("property_id").references(() => Properties.id),
});

// 14) CREDIT_FACILITIES
export const CreditFacilities = pgTable("credit_facilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  type: text("type"),
  limit_amount: numeric("limit_amount"),
  interest_rate_type: text("interest_rate_type"),
  base_rate: numeric("base_rate"),
  margin_rate: numeric("margin_rate"),
  start_date: date("start_date"),
  end_date: date("end_date"),
  payment_frequency: text("payment_frequency"),
  entity_id: uuid("entity_id").references(() => Entities.id),
  status: text("status"),
  description: text("description"),
  loan_type: text("loan_type"),
  repayment_type: text("repayment_type"),
  interest_only_period: integer("interest_only_period"),
  pi_period: integer("pi_period"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 14b) CREDIT_FACILITY_DRAWDOWNS
export const CreditFacilityDrawdowns = pgTable("credit_facility_drawdowns", {
  id: uuid("id").primaryKey().defaultRandom(),
  facility_id: uuid("facility_id").references(() => CreditFacilities.id),
  amount: numeric("amount"),
  date: date("date"),
  purpose: text("purpose"),
  property_id: uuid("property_id").references(() => Properties.id),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 14c) CREDIT_FACILITY_PROPERTIES
export const CreditFacilityProperties = pgTable("credit_facility_properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  facility_id: uuid("facility_id").references(() => CreditFacilities.id),
  property_id: uuid("property_id").references(() => Properties.id),
  purpose: text("purpose"),
  amount_allocated: numeric("amount_allocated"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 14d) CREDIT_FACILITY_REPAYMENTS
export const CreditFacilityRepayments = pgTable("credit_facility_repayments", {
  id: uuid("id").primaryKey().defaultRandom(),
  facility_id: uuid("facility_id").references(() => CreditFacilities.id),
  amount: numeric("amount"),
  date: date("date"),
  type: text("type"),
  interest_amount: numeric("interest_amount"),
  principal_amount: numeric("principal_amount"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 14e) CREDIT_FACILITY_SECURITIES
export const CreditFacilitySecurities = pgTable("credit_facility_securities", {
  id: uuid("id").primaryKey().defaultRandom(),
  facility_id: uuid("facility_id").references(() => CreditFacilities.id),
  type: text("type"),
  property_id: uuid("property_id").references(() => Properties.id),
  description: text("description"),
  value: numeric("value"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 15) OFFSET_ACCOUNTS
export const OffsetAccounts = pgTable("offset_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  balance: numeric("balance"),
  entity_id: uuid("entity_id").references(() => Entities.id),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 15b) FACILITY_OFFSET_ACCOUNTS
export const FacilityOffsetAccounts = pgTable("facility_offset_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  facility_id: uuid("facility_id").references(() => CreditFacilities.id),
  offset_account_id: uuid("offset_account_id").references(
    () => OffsetAccounts.id
  ),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 16) BROKER_ACCOUNTS
export const BrokerAccounts = pgTable("broker_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => Users.id),
  broker_name: text("broker_name"),
  account_type: text("account_type"),
  account_number: text("account_number"),
  api_key: text("api_key"),
  api_secret: text("api_secret"),
  is_demo: boolean("is_demo"),
  balance: numeric("balance"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 17) CREDENTIALS
export const DbCredentials = pgTable("credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => Users.id),
  service_name: text("service_name"),
  username: text("username"),
  password: text("password"),
  notes: text("notes"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// 18) TRADE_JOURNAL
export const TradeJournal = pgTable("trade_journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => Users.id),
  date: date("date"),
  time: text("time"),
  symbol: text("symbol"),
  type: text("type"),
  entry_price: numeric("entry_price"),
  stop_loss: numeric("stop_loss"),
  close_price: numeric("close_price"),
  pnl: numeric("pnl"),
  methodology: text("methodology"),
  notes: text("notes"),
  screenshot_url: text("screenshot_url"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

// Type definitions are now imported from ./types directory
// Re-export all types for backward compatibility
export type {
  User,
  Family,
  FamilyRole,
  FamilyMember,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Entity,
  EntityRelationship,
  Investment,
  Property,
  Document,
  CashFlow,
  CreditFacility,
  CreditFacilityDrawdown,
  CreditFacilityProperty,
  CreditFacilityRepayment,
  CreditFacilitySecurity,
  OffsetAccount,
  FacilityOffsetAccount,
  BrokerAccount,
  Credential,
  TradeJournalEntry
} from './types';
