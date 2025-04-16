var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Add Node.js crypto import for UUID generation
var nodeCrypto = require('crypto');
var drizzle = require('drizzle-orm/node-postgres').drizzle;
var Pool = require('pg').Pool;
var _a = require('./schema'), Roles = _a.Roles, DbPermissions = _a.DbPermissions, RolePermissions = _a.RolePermissions, Users = _a.Users, Families = _a.Families, FamilyMembers = _a.FamilyMembers, UserRoles = _a.UserRoles, Entities = _a.Entities, EntityRelationships = _a.EntityRelationships, Investments = _a.Investments, Properties = _a.Properties, DbDocuments = _a.DbDocuments, CashFlows = _a.CashFlows, CreditFacilities = _a.CreditFacilities, CreditFacilityDrawdowns = _a.CreditFacilityDrawdowns, CreditFacilityProperties = _a.CreditFacilityProperties, CreditFacilityRepayments = _a.CreditFacilityRepayments, CreditFacilitySecurities = _a.CreditFacilitySecurities, OffsetAccounts = _a.OffsetAccounts, FacilityOffsetAccounts = _a.FacilityOffsetAccounts, BrokerAccounts = _a.BrokerAccounts, DbCredentials = _a.DbCredentials, TradeJournal = _a.TradeJournal;
// --- DB Setup ---
var pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:SteynFamilyKudu123@db.aoiomzmzfyfzqhykijny.supabase.co:5432/postgres',
});
var db = drizzle(pool);
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var roles, permissions, adminRoleId, userRoleId, editorRoleId, viewerRoleId, permIds, families, users, entities, properties, investments, creditFacilities, offsetAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    roles = [
                        { id: nodeCrypto.randomUUID(), name: 'ADMIN', description: 'Administrator', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'USER', description: 'Standard user', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'EDITOR', description: 'Can edit content', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'VIEWER', description: 'Read-only access', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Roles).values(roles)];
                case 1:
                    _a.sent();
                    permissions = [
                        { id: nodeCrypto.randomUUID(), name: 'CAN_EDIT_PROPERTIES', description: 'Edit properties', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'CAN_ADD_MEMBERS', description: 'Add family members', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'CAN_VIEW_FINANCES', description: 'View financial data', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'CAN_MANAGE_ENTITIES', description: 'Manage entities', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(DbPermissions).values(permissions)];
                case 2:
                    _a.sent();
                    adminRoleId = roles[0].id;
                    userRoleId = roles[1].id;
                    editorRoleId = roles[2].id;
                    viewerRoleId = roles[3].id;
                    permIds = permissions.map(function (p) { return p.id; });
                    return [4 /*yield*/, db.insert(RolePermissions).values(__spreadArray(__spreadArray([], permIds.map(function (pid) { return ({ role_id: adminRoleId, permission_id: pid, created_at: new Date() }); }), true), [
                            // USER gets view
                            { role_id: userRoleId, permission_id: permissions[2].id, created_at: new Date() },
                            // EDITOR gets edit/view
                            { role_id: editorRoleId, permission_id: permissions[0].id, created_at: new Date() },
                            { role_id: editorRoleId, permission_id: permissions[2].id, created_at: new Date() },
                            // VIEWER gets only view
                            { role_id: viewerRoleId, permission_id: permissions[2].id, created_at: new Date() },
                        ], false))];
                case 3:
                    _a.sent();
                    families = [
                        { id: nodeCrypto.randomUUID(), name: 'Smith Family', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'Johnson Family', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Families).values(families)];
                case 4:
                    _a.sent();
                    users = [
                        { id: nodeCrypto.randomUUID(), email: 'alice@smith.com', first_name: 'Alice', surname: 'Smith', full_name: 'Alice Smith', status: 'ACTIVE', role: 'ADMIN', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), email: 'bob@smith.com', first_name: 'Bob', surname: 'Smith', full_name: 'Bob Smith', status: 'ACTIVE', role: 'USER', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), email: 'carol@johnson.com', first_name: 'Carol', surname: 'Johnson', full_name: 'Carol Johnson', status: 'ACTIVE', role: 'EDITOR', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), email: 'dan@johnson.com', first_name: 'Dan', surname: 'Johnson', full_name: 'Dan Johnson', status: 'ACTIVE', role: 'VIEWER', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Users).values(users)];
                case 5:
                    _a.sent();
                    // --- 6. FamilyMembers ---
                    return [4 /*yield*/, db.insert(FamilyMembers).values([
                            { id: nodeCrypto.randomUUID(), user_id: users[0].id, family_id: families[0].id, role: 'Parent', created_at: new Date(), updated_at: new Date() },
                            { id: nodeCrypto.randomUUID(), user_id: users[1].id, family_id: families[0].id, role: 'Child', created_at: new Date(), updated_at: new Date() },
                            { id: nodeCrypto.randomUUID(), user_id: users[2].id, family_id: families[1].id, role: 'Parent', created_at: new Date(), updated_at: new Date() },
                            { id: nodeCrypto.randomUUID(), user_id: users[3].id, family_id: families[1].id, role: 'Child', created_at: new Date(), updated_at: new Date() },
                        ])];
                case 6:
                    // --- 6. FamilyMembers ---
                    _a.sent();
                    // --- 7. UserRoles ---
                    return [4 /*yield*/, db.insert(UserRoles).values([
                            { user_id: users[0].id, role_id: adminRoleId, assigned_at: new Date() },
                            { user_id: users[1].id, role_id: userRoleId, assigned_at: new Date() },
                            { user_id: users[2].id, role_id: editorRoleId, assigned_at: new Date() },
                            { user_id: users[3].id, role_id: viewerRoleId, assigned_at: new Date() },
                        ])];
                case 7:
                    // --- 7. UserRoles ---
                    _a.sent();
                    entities = [
                        { id: nodeCrypto.randomUUID(), name: 'Smith Holdings', type: 'Company', user_id: users[0].id, family_id: families[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: 'Johnson Trust', type: 'Trust', user_id: users[2].id, family_id: families[1].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Entities).values(entities)];
                case 8:
                    _a.sent();
                    properties = [
                        { id: nodeCrypto.randomUUID(), name: '123 Main St', entity_id: entities[0].id, user_id: users[0].id, suburb: 'Sydney', state: 'NSW', country: 'Australia', land_price: '800000', build_price: '400000', purchase_date: '2018-03-01', current_valuation: '1500000', bedrooms: '4', bathrooms: '2', has_pool: true, created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), name: '456 High St', entity_id: entities[1].id, user_id: users[2].id, suburb: 'Melbourne', state: 'VIC', country: 'Australia', land_price: '600000', build_price: '300000', purchase_date: '2020-07-15', current_valuation: '1100000', bedrooms: '3', bathrooms: '1', has_pool: false, created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Properties).values(properties)];
                case 9:
                    _a.sent();
                    investments = [
                        { id: nodeCrypto.randomUUID(), investment_type: 'Property', user_id: users[0].id, family_id: families[0].id, entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
                        { id: nodeCrypto.randomUUID(), investment_type: 'Stock', user_id: users[1].id, family_id: families[0].id, entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(Investments).values(investments)];
                case 10:
                    _a.sent();
                    // --- 11. Documents ---
                    return [4 /*yield*/, db.insert(DbDocuments).values([
                            { id: nodeCrypto.randomUUID(), name: 'Title Deed', type: 'PDF', url: 'https://example.com/title.pdf', property_id: properties[0].id, entity_id: entities[0].id, uploaded_by: users[0].id, created_at: new Date(), updated_at: new Date(), last_modified: new Date(), version: '1' },
                            { id: nodeCrypto.randomUUID(), name: 'Insurance Policy', type: 'PDF', url: 'https://example.com/insurance.pdf', property_id: properties[1].id, entity_id: entities[1].id, uploaded_by: users[2].id, created_at: new Date(), updated_at: new Date(), last_modified: new Date(), version: '1' },
                        ])];
                case 11:
                    // --- 11. Documents ---
                    _a.sent();
                    // --- 12. Cash Flows ---
                    return [4 /*yield*/, db.insert(CashFlows).values([
                            { id: nodeCrypto.randomUUID(), amount: '2000', debit_credit: 'CREDIT', transaction_type: 'RENT', description: 'Monthly rent', timestamp: new Date(), user_id: users[0].id, property_id: properties[0].id },
                            { id: nodeCrypto.randomUUID(), amount: '500', debit_credit: 'DEBIT', transaction_type: 'REPAIRS', description: 'Plumbing repairs', timestamp: new Date(), user_id: users[0].id, property_id: properties[0].id },
                        ])];
                case 12:
                    // --- 12. Cash Flows ---
                    _a.sent();
                    creditFacilities = [
                        { id: nodeCrypto.randomUUID(), name: 'Home Loan', type: 'Mortgage', limit_amount: '1000000', interest_rate_type: 'fixed', base_rate: '3.5', payment_frequency: 'Monthly', entity_id: entities[0].id, status: 'ACTIVE', created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(CreditFacilities).values(creditFacilities)];
                case 13:
                    _a.sent();
                    offsetAccounts = [
                        { id: nodeCrypto.randomUUID(), name: 'Smith Offset', balance: '50000', entity_id: entities[0].id, created_at: new Date(), updated_at: new Date() },
                    ];
                    return [4 /*yield*/, db.insert(OffsetAccounts).values(offsetAccounts)];
                case 14:
                    _a.sent();
                    // --- 15. FacilityOffsetAccounts ---
                    return [4 /*yield*/, db.insert(FacilityOffsetAccounts).values([
                            { id: nodeCrypto.randomUUID(), facility_id: creditFacilities[0].id, offset_account_id: offsetAccounts[0].id, created_at: new Date(), updated_at: new Date() },
                        ])];
                case 15:
                    // --- 15. FacilityOffsetAccounts ---
                    _a.sent();
                    // --- 16. Broker Accounts ---
                    return [4 /*yield*/, db.insert(BrokerAccounts).values([
                            { id: nodeCrypto.randomUUID(), user_id: users[0].id, broker_name: 'Interactive Brokers', account_type: 'Margin', account_number: 'IB123456', is_demo: false, balance: '100000', created_at: new Date(), updated_at: new Date() },
                        ])];
                case 16:
                    // --- 16. Broker Accounts ---
                    _a.sent();
                    // --- 17. Credentials ---
                    return [4 /*yield*/, db.insert(DbCredentials).values([
                            { id: nodeCrypto.randomUUID(), user_id: users[0].id, service_name: 'AWS', username: 'alice.aws', password: 'secret', notes: 'Root account', created_at: new Date(), updated_at: new Date() },
                        ])];
                case 17:
                    // --- 17. Credentials ---
                    _a.sent();
                    // --- 18. Trade Journal ---
                    return [4 /*yield*/, db.insert(TradeJournal).values([
                            { id: nodeCrypto.randomUUID(), user_id: users[0].id, date: '2024-01-15', time: '09:30', symbol: 'AAPL', type: 'BUY', entry_price: '180.00', stop_loss: '175.00', close_price: '190.00', pnl: '1000', methodology: 'Breakout', notes: 'Gap up', screenshot_url: 'https://example.com/trade.png', created_at: new Date(), updated_at: new Date() },
                        ])];
                case 18:
                    // --- 18. Trade Journal ---
                    _a.sent();
                    console.log('✅ Seed complete!');
                    return [4 /*yield*/, pool.end()];
                case 19:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (e) {
    console.error(e);
    pool.end();
});
