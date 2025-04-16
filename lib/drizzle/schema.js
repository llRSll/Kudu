"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeJournal = exports.DbCredentials = exports.BrokerAccounts = exports.FacilityOffsetAccounts = exports.OffsetAccounts = exports.CreditFacilitySecurities = exports.CreditFacilityRepayments = exports.CreditFacilityProperties = exports.CreditFacilityDrawdowns = exports.CreditFacilities = exports.CashFlows = exports.DbDocuments = exports.Properties = exports.Investments = exports.EntityRelationships = exports.Entities = exports.UserRoles = exports.RolePermissions = exports.DbPermissions = exports.Roles = exports.FamilyMembers = exports.Families = exports.Users = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
// 1) USERS
exports.Users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    first_name: (0, pg_core_1.text)('first_name'),
    middle_initial: (0, pg_core_1.text)('middle_initial'),
    surname: (0, pg_core_1.text)('surname'),
    full_name: (0, pg_core_1.text)('full_name'),
    phone_number: (0, pg_core_1.text)('phone_number'),
    dob: (0, pg_core_1.date)('dob'),
    tax_file_number: (0, pg_core_1.text)('tax_file_number'),
    avatar_url: (0, pg_core_1.text)('avatar_url'),
    preferences: (0, pg_core_1.jsonb)('preferences'),
    status: (0, pg_core_1.text)('status'),
    role: (0, pg_core_1.text)('role'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
    last_login: (0, pg_core_1.timestamp)('last_login', { withTimezone: true }),
});
// 2) FAMILIES
exports.Families = (0, pg_core_1.pgTable)('families', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 3) FAMILY_MEMBERS (pivot)
exports.FamilyMembers = (0, pg_core_1.pgTable)('family_members', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)('user_id').notNull().references(function () { return exports.Users.id; }),
    family_id: (0, pg_core_1.uuid)('family_id').notNull().references(function () { return exports.Families.id; }),
    role: (0, pg_core_1.text)('role'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 4) ROLES
exports.Roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').unique(),
    description: (0, pg_core_1.text)('description'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 5) PERMISSIONS
exports.DbPermissions = (0, pg_core_1.pgTable)('permissions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').unique(),
    description: (0, pg_core_1.text)('description'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 6) ROLE_PERMISSIONS (pivot, composite PK)
exports.RolePermissions = (0, pg_core_1.pgTable)('role_permissions', {
    role_id: (0, pg_core_1.uuid)('role_id').notNull().references(function () { return exports.Roles.id; }),
    permission_id: (0, pg_core_1.uuid)('permission_id').notNull().references(function () { return exports.DbPermissions.id; }),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
}, function (table) { return ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.role_id, table.permission_id] })
}); });
// 7) USER_ROLES (pivot, composite PK)
exports.UserRoles = (0, pg_core_1.pgTable)('user_roles', {
    user_id: (0, pg_core_1.uuid)('user_id').notNull().references(function () { return exports.Users.id; }),
    role_id: (0, pg_core_1.uuid)('role_id').notNull().references(function () { return exports.Roles.id; }),
    assigned_at: (0, pg_core_1.timestamp)('assigned_at', { withTimezone: true }),
}, function (table) { return ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.user_id, table.role_id] })
}); });
// 8) ENTITIES
exports.Entities = (0, pg_core_1.pgTable)('entities', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    description: (0, pg_core_1.text)('description'),
    type: (0, pg_core_1.text)('type'),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    family_id: (0, pg_core_1.uuid)('family_id').references(function () { return exports.Families.id; }),
    abn: (0, pg_core_1.text)('abn'),
    acn: (0, pg_core_1.text)('acn'),
    status: (0, pg_core_1.text)('status'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 9) ENTITY_RELATIONSHIPS
exports.EntityRelationships = (0, pg_core_1.pgTable)('entity_relationships', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    parent_entity_id: (0, pg_core_1.uuid)('parent_entity_id').references(function () { return exports.Entities.id; }),
    child_entity_id: (0, pg_core_1.uuid)('child_entity_id').references(function () { return exports.Entities.id; }),
    relationship_type: (0, pg_core_1.text)('relationship_type'),
    ownership_percentage: (0, pg_core_1.numeric)('ownership_percentage'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 10) INVESTMENTS
exports.Investments = (0, pg_core_1.pgTable)('investments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    investment_type: (0, pg_core_1.text)('investment_type'),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    family_id: (0, pg_core_1.uuid)('family_id').references(function () { return exports.Families.id; }),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    status: (0, pg_core_1.text)('status'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 11) PROPERTIES
exports.Properties = (0, pg_core_1.pgTable)('properties', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    investment_id: (0, pg_core_1.uuid)('investment_id').references(function () { return exports.Investments.id; }),
    street_number: (0, pg_core_1.text)('street_number'),
    street_name: (0, pg_core_1.text)('street_name'),
    suburb: (0, pg_core_1.text)('suburb'),
    postcode: (0, pg_core_1.text)('postcode'),
    state: (0, pg_core_1.text)('state'),
    country: (0, pg_core_1.text)('country'),
    land_price: (0, pg_core_1.numeric)('land_price'),
    build_price: (0, pg_core_1.numeric)('build_price'),
    purchase_date: (0, pg_core_1.date)('purchase_date'),
    current_valuation: (0, pg_core_1.numeric)('current_valuation'),
    last_valuation_date: (0, pg_core_1.timestamp)('last_valuation_date', { withTimezone: true }),
    area: (0, pg_core_1.numeric)('area'),
    bedrooms: (0, pg_core_1.numeric)('bedrooms'),
    bathrooms: (0, pg_core_1.numeric)('bathrooms'),
    parking: (0, pg_core_1.numeric)('parking'),
    has_pool: (0, pg_core_1.boolean)('has_pool'),
    monthly_income: (0, pg_core_1.numeric)('monthly_income'),
    property_purchase_price: (0, pg_core_1.numeric)('property_purchase_price'),
    year_built: (0, pg_core_1.integer)('year_built'),
    type: (0, pg_core_1.text)('type'),
    amenities: (0, pg_core_1.jsonb)('amenities'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 12) DOCUMENTS
exports.DbDocuments = (0, pg_core_1.pgTable)('documents', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    type: (0, pg_core_1.text)('type'),
    url: (0, pg_core_1.text)('url'),
    file_size: (0, pg_core_1.numeric)('file_size'),
    description: (0, pg_core_1.text)('description'),
    metadata: (0, pg_core_1.jsonb)('metadata'),
    property_id: (0, pg_core_1.uuid)('property_id').references(function () { return exports.Properties.id; }),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    investment_id: (0, pg_core_1.uuid)('investment_id').references(function () { return exports.Investments.id; }),
    family_id: (0, pg_core_1.uuid)('family_id').references(function () { return exports.Families.id; }),
    uploaded_by: (0, pg_core_1.uuid)('uploaded_by').references(function () { return exports.Users.id; }),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
    last_modified: (0, pg_core_1.timestamp)('last_modified', { withTimezone: true }),
    version: (0, pg_core_1.numeric)('version'),
});
// 13) CASH_FLOWS
exports.CashFlows = (0, pg_core_1.pgTable)('cash_flows', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    amount: (0, pg_core_1.numeric)('amount'),
    debit_credit: (0, pg_core_1.text)('debit_credit'),
    transaction_type: (0, pg_core_1.text)('transaction_type'),
    description: (0, pg_core_1.text)('description'),
    timestamp: (0, pg_core_1.timestamp)('timestamp', { withTimezone: true }),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    family_id: (0, pg_core_1.uuid)('family_id').references(function () { return exports.Families.id; }),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    investment_id: (0, pg_core_1.uuid)('investment_id').references(function () { return exports.Investments.id; }),
    property_id: (0, pg_core_1.uuid)('property_id').references(function () { return exports.Properties.id; }),
});
// 14) CREDIT_FACILITIES
exports.CreditFacilities = (0, pg_core_1.pgTable)('credit_facilities', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    type: (0, pg_core_1.text)('type'),
    limit_amount: (0, pg_core_1.numeric)('limit_amount'),
    interest_rate_type: (0, pg_core_1.text)('interest_rate_type'),
    base_rate: (0, pg_core_1.numeric)('base_rate'),
    margin_rate: (0, pg_core_1.numeric)('margin_rate'),
    start_date: (0, pg_core_1.date)('start_date'),
    end_date: (0, pg_core_1.date)('end_date'),
    payment_frequency: (0, pg_core_1.text)('payment_frequency'),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    status: (0, pg_core_1.text)('status'),
    description: (0, pg_core_1.text)('description'),
    loan_type: (0, pg_core_1.text)('loan_type'),
    repayment_type: (0, pg_core_1.text)('repayment_type'),
    interest_only_period: (0, pg_core_1.integer)('interest_only_period'),
    pi_period: (0, pg_core_1.integer)('pi_period'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 14b) CREDIT_FACILITY_DRAWDOWNS
exports.CreditFacilityDrawdowns = (0, pg_core_1.pgTable)('credit_facility_drawdowns', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    facility_id: (0, pg_core_1.uuid)('facility_id').references(function () { return exports.CreditFacilities.id; }),
    amount: (0, pg_core_1.numeric)('amount'),
    date: (0, pg_core_1.date)('date'),
    purpose: (0, pg_core_1.text)('purpose'),
    property_id: (0, pg_core_1.uuid)('property_id').references(function () { return exports.Properties.id; }),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 14c) CREDIT_FACILITY_PROPERTIES
exports.CreditFacilityProperties = (0, pg_core_1.pgTable)('credit_facility_properties', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    facility_id: (0, pg_core_1.uuid)('facility_id').references(function () { return exports.CreditFacilities.id; }),
    property_id: (0, pg_core_1.uuid)('property_id').references(function () { return exports.Properties.id; }),
    purpose: (0, pg_core_1.text)('purpose'),
    amount_allocated: (0, pg_core_1.numeric)('amount_allocated'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 14d) CREDIT_FACILITY_REPAYMENTS
exports.CreditFacilityRepayments = (0, pg_core_1.pgTable)('credit_facility_repayments', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    facility_id: (0, pg_core_1.uuid)('facility_id').references(function () { return exports.CreditFacilities.id; }),
    amount: (0, pg_core_1.numeric)('amount'),
    date: (0, pg_core_1.date)('date'),
    type: (0, pg_core_1.text)('type'),
    interest_amount: (0, pg_core_1.numeric)('interest_amount'),
    principal_amount: (0, pg_core_1.numeric)('principal_amount'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 14e) CREDIT_FACILITY_SECURITIES
exports.CreditFacilitySecurities = (0, pg_core_1.pgTable)('credit_facility_securities', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    facility_id: (0, pg_core_1.uuid)('facility_id').references(function () { return exports.CreditFacilities.id; }),
    type: (0, pg_core_1.text)('type'),
    property_id: (0, pg_core_1.uuid)('property_id').references(function () { return exports.Properties.id; }),
    description: (0, pg_core_1.text)('description'),
    value: (0, pg_core_1.numeric)('value'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 15) OFFSET_ACCOUNTS
exports.OffsetAccounts = (0, pg_core_1.pgTable)('offset_accounts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name'),
    balance: (0, pg_core_1.numeric)('balance'),
    entity_id: (0, pg_core_1.uuid)('entity_id').references(function () { return exports.Entities.id; }),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 15b) FACILITY_OFFSET_ACCOUNTS
exports.FacilityOffsetAccounts = (0, pg_core_1.pgTable)('facility_offset_accounts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    facility_id: (0, pg_core_1.uuid)('facility_id').references(function () { return exports.CreditFacilities.id; }),
    offset_account_id: (0, pg_core_1.uuid)('offset_account_id').references(function () { return exports.OffsetAccounts.id; }),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 16) BROKER_ACCOUNTS
exports.BrokerAccounts = (0, pg_core_1.pgTable)('broker_accounts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    broker_name: (0, pg_core_1.text)('broker_name'),
    account_type: (0, pg_core_1.text)('account_type'),
    account_number: (0, pg_core_1.text)('account_number'),
    api_key: (0, pg_core_1.text)('api_key'),
    api_secret: (0, pg_core_1.text)('api_secret'),
    is_demo: (0, pg_core_1.boolean)('is_demo'),
    balance: (0, pg_core_1.numeric)('balance'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 17) CREDENTIALS
exports.DbCredentials = (0, pg_core_1.pgTable)('credentials', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    service_name: (0, pg_core_1.text)('service_name'),
    username: (0, pg_core_1.text)('username'),
    password: (0, pg_core_1.text)('password'),
    notes: (0, pg_core_1.text)('notes'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
// 18) TRADE_JOURNAL
exports.TradeJournal = (0, pg_core_1.pgTable)('trade_journal', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    user_id: (0, pg_core_1.uuid)('user_id').references(function () { return exports.Users.id; }),
    date: (0, pg_core_1.date)('date'),
    time: (0, pg_core_1.text)('time'),
    symbol: (0, pg_core_1.text)('symbol'),
    type: (0, pg_core_1.text)('type'),
    entry_price: (0, pg_core_1.numeric)('entry_price'),
    stop_loss: (0, pg_core_1.numeric)('stop_loss'),
    close_price: (0, pg_core_1.numeric)('close_price'),
    pnl: (0, pg_core_1.numeric)('pnl'),
    methodology: (0, pg_core_1.text)('methodology'),
    notes: (0, pg_core_1.text)('notes'),
    screenshot_url: (0, pg_core_1.text)('screenshot_url'),
    created_at: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }),
    updated_at: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }),
});
