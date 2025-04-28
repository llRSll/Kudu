// Use a unique import name for Node.js crypto to avoid TS DOM conflict
const nodeCrypto = require('crypto');

// Import the shared db instance from client.ts and rename it for seed scope
const { db: seedDb } = require('./client');

import * as schema from './schema'; // Import all schema objects

async function seed() {
  // --- 1. Roles --- (Adding more examples)
  const roles = [
    { id: nodeCrypto.randomUUID(), name: 'ADMIN', description: 'Full access to all features and settings', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'USER', description: 'Standard user with basic access', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'EDITOR', description: 'Can create and edit content', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'VIEWER', description: 'Read-only access', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'FINANCE_MANAGER', description: 'Manages financial data and facilities', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'PROPERTY_MANAGER', description: 'Manages specific properties', created_at: new Date(), updated_at: new Date() },
  ];
  // Add onConflictDoNothing to handle existing roles
  await seedDb.insert(schema.Roles).values(roles).onConflictDoNothing();
  // Fetch roles from DB to get correct IDs after potential conflicts
  const dbRoles: (typeof schema.Roles.$inferSelect)[] = await seedDb.select().from(schema.Roles);

  // --- 2. Permissions --- (Adding more examples)
  const permissions = [
    { id: nodeCrypto.randomUUID(), name: 'CAN_MANAGE_FINANCE', description: 'Allows managing financial aspects', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_VIEW_PROPERTIES', description: 'Allows viewing property details', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_EDIT_PROPERTIES', description: 'Allows editing property details', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_ADD_MEMBERS', description: 'Allows adding family members', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_VIEW_FINANCES', description: 'Allows viewing financial data', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_MANAGE_ENTITIES', description: 'Allows managing entities', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_APPROVE_DRAWDOWN', description: 'Allows approving credit drawdowns', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'CAN_UPLOAD_DOCUMENTS', description: 'Allows uploading documents', created_at: new Date(), updated_at: new Date() },
  ];
  // Assuming the schema export is Permissions, adjust if different (e.g., DbPermissions)
  await seedDb.insert(schema.DbPermissions).values(permissions).onConflictDoNothing();
  // Fetch permissions from DB to get correct IDs after potential conflicts
  const dbPermissions: (typeof schema.DbPermissions.$inferSelect)[] = await seedDb.select().from(schema.DbPermissions);

  // Helper function for safe ID retrieval
  function findOrFail<T>(arr: T[], predicate: (item: T) => boolean, message: string): T {
    const item = arr.find(predicate);
    if (!item) {
      throw new Error(message);
    }
    return item;
  }

  // --- 3. RolePermissions --- (Map roles to permissions)
  const rolePermissionsMap = [
    // ADMIN gets all permissions
    ...dbPermissions.map((p: typeof schema.DbPermissions.$inferSelect) => ({ role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'ADMIN', 'ADMIN role not found').id, permission_id: p.id })),
    // EDITOR can edit/view properties and documents
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'EDITOR', 'EDITOR role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_EDIT_PROPERTIES', 'CAN_EDIT_PROPERTIES permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'EDITOR', 'EDITOR role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_VIEW_PROPERTIES', 'CAN_VIEW_PROPERTIES permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'EDITOR', 'EDITOR role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_UPLOAD_DOCUMENTS', 'CAN_UPLOAD_DOCUMENTS permission not found').id
    },
    // VIEWER can only view properties
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'VIEWER', 'VIEWER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_VIEW_PROPERTIES', 'CAN_VIEW_PROPERTIES permission not found').id
    },
    // FINANCE_MANAGER manages finance and views properties
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'FINANCE_MANAGER', 'FINANCE_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_MANAGE_FINANCE', 'CAN_MANAGE_FINANCE permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'FINANCE_MANAGER', 'FINANCE_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_APPROVE_DRAWDOWN', 'CAN_APPROVE_DRAWDOWN permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'FINANCE_MANAGER', 'FINANCE_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_VIEW_PROPERTIES', 'CAN_VIEW_PROPERTIES permission not found').id
    },
    // PROPERTY_MANAGER can edit/view properties and upload docs
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'PROPERTY_MANAGER', 'PROPERTY_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_EDIT_PROPERTIES', 'CAN_EDIT_PROPERTIES permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'PROPERTY_MANAGER', 'PROPERTY_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_VIEW_PROPERTIES', 'CAN_VIEW_PROPERTIES permission not found').id
    },
    {
      role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'PROPERTY_MANAGER', 'PROPERTY_MANAGER role not found').id,
      permission_id: findOrFail(dbPermissions, (p: typeof schema.DbPermissions.$inferSelect) => p.name === 'CAN_UPLOAD_DOCUMENTS', 'CAN_UPLOAD_DOCUMENTS permission not found').id
    }
  ];
  // Add onConflictDoNothing to handle existing role-permission links
  await seedDb.insert(schema.RolePermissions).values(rolePermissionsMap).onConflictDoNothing();

  // --- 4. Families --- (Adding more examples)
  const families = [
    { id: nodeCrypto.randomUUID(), name: 'Smith Family', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Johnson Family', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Williams Household', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Brown Group', created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.Families).values(families).onConflictDoNothing();
  const dbFamilies: (typeof schema.Families.$inferSelect)[] = await seedDb.select().from(schema.Families);

  // --- 4.1 Family Roles --- (NEW)
  const familyRoles = [
    { id: nodeCrypto.randomUUID(), name: 'Parent', description: 'Primary guardian or head of household.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Child', description: 'Dependent child within the family.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Spouse', description: 'Partner of a primary member.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Trustee', description: 'Manages assets on behalf of the family/member.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Beneficiary', description: 'Receives benefits from family assets/trusts.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Head', description: 'Head of the family or household.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Member', description: 'General family member.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Lead', description: 'Lead member or representative.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Associate', description: 'Associate member with limited connection.', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Other', description: 'Other relationship type.', created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.FamilyRoles).values(familyRoles).onConflictDoNothing({ target: schema.FamilyRoles.name });
  const dbFamilyRoles: (typeof schema.FamilyRoles.$inferSelect)[] = await seedDb.select().from(schema.FamilyRoles);

  // --- 5. Users --- (Adding more examples with different roles)
  const users = [
    // Smith Family
    { id: nodeCrypto.randomUUID(), email: 'alice@smith.com', first_name: 'Alice', surname: 'Smith', full_name: 'Alice Smith', status: 'ACTIVE', role: 'ADMIN', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), email: 'bob@smith.com', first_name: 'Bob', surname: 'Smith', full_name: 'Bob Smith', status: 'ACTIVE', role: 'USER', created_at: new Date(), updated_at: new Date() },
    // Johnson Family
    { id: nodeCrypto.randomUUID(), email: 'carol@johnson.com', first_name: 'Carol', surname: 'Johnson', full_name: 'Carol Johnson', status: 'ACTIVE', role: 'EDITOR', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), email: 'dan@johnson.com', first_name: 'Dan', surname: 'Johnson', full_name: 'Dan Johnson', status: 'INACTIVE', role: 'VIEWER', created_at: new Date(), updated_at: new Date() }, // Inactive user
    // Williams Household
    { id: nodeCrypto.randomUUID(), email: 'eve@williams.org', first_name: 'Eve', surname: 'Williams', full_name: 'Eve Williams', status: 'ACTIVE', role: 'FINANCE_MANAGER', created_at: new Date(), updated_at: new Date() },
    // Brown Group
    { id: nodeCrypto.randomUUID(), email: 'frank@brown.net', first_name: 'Frank', surname: 'Brown', full_name: 'Frank Brown', status: 'ACTIVE', role: 'PROPERTY_MANAGER', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), email: 'grace@brown.net', first_name: 'Grace', surname: 'Brown', full_name: 'Grace Brown', status: 'PENDING', role: 'USER', created_at: new Date(), updated_at: new Date() }, // Pending user
  ];
  await seedDb.insert(schema.Users).values(users).onConflictDoNothing();
  const dbUsers: (typeof schema.Users.$inferSelect)[] = await seedDb.select().from(schema.Users);

  // Quick check: ensure all users were inserted before proceeding
  if (users.length !== 7) throw new Error('Incorrect number of users defined');

  // --- 6. FamilyMembers --- (Mapping new users/families)
  const smithFamily = findOrFail(dbFamilies, (f: typeof schema.Families.$inferSelect) => f.name === 'Smith Family', 'Smith Family not found');
  const johnsonFamily = findOrFail(dbFamilies, (f: typeof schema.Families.$inferSelect) => f.name === 'Johnson Family', 'Johnson Family not found');
  const williamsFamily = findOrFail(dbFamilies, (f: typeof schema.Families.$inferSelect) => f.name === 'Williams Household', 'Williams Household not found');
  const brownFamily = findOrFail(dbFamilies, (f: typeof schema.Families.$inferSelect) => f.name === 'Brown Group', 'Brown Group not found');

  const alice = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'alice@smith.com', 'User alice@smith.com not found');
  const bob = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'bob@smith.com', 'User bob@smith.com not found');
  const carol = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'carol@johnson.com', 'User carol@johnson.com not found');
  const dan = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'dan@johnson.com', 'User dan@johnson.com not found');
  const eve = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'eve@williams.org', 'User eve@williams.org not found');
  const frank = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'frank@brown.net', 'User frank@brown.net not found');
  const grace = findOrFail(dbUsers, (u: typeof schema.Users.$inferSelect) => u.email === 'grace@brown.net', 'User grace@brown.net not found');

  // Get family role IDs
  const headRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Head', 'Head family role not found');
  const spouseRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Spouse', 'Spouse family role not found');
  const parentRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Parent', 'Parent family role not found');
  const childRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Child', 'Child family role not found');
  const memberRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Member', 'Member family role not found');
  const leadRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Lead', 'Lead family role not found');
  const associateRole = findOrFail(dbFamilyRoles, (r: typeof schema.FamilyRoles.$inferSelect) => r.name === 'Associate', 'Associate family role not found');

  await seedDb.insert(schema.FamilyMembers).values([
    // Smith
    { id: nodeCrypto.randomUUID(), user_id: alice.id, family_id: smithFamily.id, family_role_id: headRole.id, created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), user_id: bob.id, family_id: smithFamily.id, family_role_id: spouseRole.id, created_at: new Date(), updated_at: new Date() },
    // Johnson
    { id: nodeCrypto.randomUUID(), user_id: carol.id, family_id: johnsonFamily.id, family_role_id: parentRole.id, created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), user_id: dan.id, family_id: johnsonFamily.id, family_role_id: childRole.id, created_at: new Date(), updated_at: new Date() },
    // Williams
    { id: nodeCrypto.randomUUID(), user_id: eve.id, family_id: williamsFamily.id, family_role_id: memberRole.id, created_at: new Date(), updated_at: new Date() },
    // Brown
    { id: nodeCrypto.randomUUID(), user_id: frank.id, family_id: brownFamily.id, family_role_id: leadRole.id, created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), user_id: grace.id, family_id: brownFamily.id, family_role_id: associateRole.id, created_at: new Date(), updated_at: new Date() },
  ]).onConflictDoNothing();

  // --- 7. UserRoles --- (Mapping new users/roles)
  await seedDb.insert(schema.UserRoles).values([
    { user_id: alice.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'ADMIN', 'ADMIN role not found').id, assigned_at: new Date() },
    { user_id: bob.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'USER', 'USER role not found').id, assigned_at: new Date() },
    { user_id: carol.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'EDITOR', 'EDITOR role not found').id, assigned_at: new Date() },
    { user_id: dan.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'VIEWER', 'VIEWER role not found').id, assigned_at: new Date() },
    { user_id: eve.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'FINANCE_MANAGER', 'FINANCE_MANAGER role not found').id, assigned_at: new Date() },
    { user_id: frank.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'PROPERTY_MANAGER', 'PROPERTY_MANAGER role not found').id, assigned_at: new Date() },
    { user_id: grace.id, role_id: findOrFail(dbRoles, (r: typeof schema.Roles.$inferSelect) => r.name === 'USER', 'USER role not found').id, assigned_at: new Date() }, // Grace gets USER role
  ]).onConflictDoNothing();

  // --- 8. Entities --- (Keep existing simple data for now)
  const entities = [
    { id: nodeCrypto.randomUUID(), name: 'Smith Holdings', type: 'Company', user_id: alice.id, family_id: smithFamily.id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: 'Johnson Trust', type: 'Trust', user_id: carol.id, family_id: johnsonFamily.id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.Entities).values(entities);

  // --- 9. Properties ---
  const properties = [
    { id: nodeCrypto.randomUUID(), name: '123 Main St', entity_id: entities[0].id, user_id: alice.id, suburb: 'Sydney', state: 'NSW', country: 'Australia', land_price: '800000', build_price: '400000', purchase_date: '2018-03-01', current_valuation: '1500000', bedrooms: '4', bathrooms: '2', has_pool: true, created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), name: '456 High St', entity_id: entities[1].id, user_id: carol.id, suburb: 'Melbourne', state: 'VIC', country: 'Australia', land_price: '600000', build_price: '300000', purchase_date: '2020-07-15', current_valuation: '1100000', bedrooms: '3', bathrooms: '1', has_pool: false, created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.Properties).values(properties);

  // --- 10. Investments ---
  const investments = [
    { id: nodeCrypto.randomUUID(), investment_type: 'Property', user_id: alice.id, family_id: smithFamily.id, entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
    { id: nodeCrypto.randomUUID(), investment_type: 'Stock', user_id: bob.id, family_id: smithFamily.id, entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.Investments).values(investments);

  // --- 11. Documents ---
  await seedDb.insert(schema.DbDocuments).values([
    { id: nodeCrypto.randomUUID(), name: 'Title Deed', type: 'PDF', url: 'https://example.com/title.pdf', property_id: properties[0].id, entity_id: entities[0].id, uploaded_by: alice.id, created_at: new Date(), updated_at: new Date(), last_modified: new Date(), version: '1' },
    { id: nodeCrypto.randomUUID(), name: 'Insurance Policy', type: 'PDF', url: 'https://example.com/insurance.pdf', property_id: properties[1].id, entity_id: entities[1].id, uploaded_by: carol.id, created_at: new Date(), updated_at: new Date(), last_modified: new Date(), version: '1' },
  ]);

  // --- 12. Cash Flows ---
  await seedDb.insert(schema.CashFlows).values([
    { id: nodeCrypto.randomUUID(), amount: '2000', debit_credit: 'CREDIT', transaction_type: 'RENT', description: 'Monthly rent', timestamp: new Date(), user_id: alice.id, property_id: properties[0].id },
    { id: nodeCrypto.randomUUID(), amount: '500', debit_credit: 'DEBIT', transaction_type: 'REPAIRS', description: 'Plumbing repairs', timestamp: new Date(), user_id: alice.id, property_id: properties[0].id },
  ]);

  // --- 13. Credit Facilities ---
  const creditFacilities = [
    { id: nodeCrypto.randomUUID(), name: 'Home Loan', type: 'Mortgage', limit_amount: '1000000', interest_rate_type: 'fixed', base_rate: '3.5', payment_frequency: 'Monthly', entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.CreditFacilities).values(creditFacilities);

  // --- 14. Offset Accounts ---
  const offsetAccounts = [
    { id: nodeCrypto.randomUUID(), name: 'Smith Offset', balance: '50000', entity_id: entities[0].id, created_at: new Date(), updated_at: new Date() },
  ];
  await seedDb.insert(schema.OffsetAccounts).values(offsetAccounts);

  // --- 15. FacilityOffsetAccounts ---
  await seedDb.insert(schema.FacilityOffsetAccounts).values([
    { id: nodeCrypto.randomUUID(), facility_id: creditFacilities[0].id, offset_account_id: offsetAccounts[0].id, created_at: new Date(), updated_at: new Date() },
  ]);

  // --- 16. Broker Accounts ---
  await seedDb.insert(schema.BrokerAccounts).values([
    { id: nodeCrypto.randomUUID(), user_id: alice.id, broker_name: 'Interactive Brokers', account_type: 'Margin', account_number: 'IB123456', is_demo: false, balance: '100000', created_at: new Date(), updated_at: new Date() },
  ]);

  // --- 17. Credentials ---
  await seedDb.insert(schema.DbCredentials).values([
    { id: nodeCrypto.randomUUID(), user_id: alice.id, service_name: 'AWS', username: 'alice.aws', password: 'secret', notes: 'Root account', created_at: new Date(), updated_at: new Date() },
  ]);

  // --- 18. Trade Journal ---
  await seedDb.insert(schema.TradeJournal).values([
    { id: nodeCrypto.randomUUID(), user_id: alice.id, date: '2024-01-15', time: '09:30', symbol: 'AAPL', type: 'BUY', entry_price: '180.00', stop_loss: '175.00', close_price: '190.00', pnl: '1000', methodology: 'Breakout', notes: 'Gap up', screenshot_url: 'https://example.com/trade.png', created_at: new Date(), updated_at: new Date() },
  ]);

  console.log('✅ Seed complete!');
}

seed().catch(e => {
  console.error(e);
});
