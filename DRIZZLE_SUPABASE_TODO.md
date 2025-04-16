# Drizzle + Supabase Integration TODO

- [ ] 1. Install Drizzle ORM and Postgres driver
  - `npm install drizzle-orm pg`

- [ ] 2. Create Drizzle config and client utility
  - `lib/drizzle/client.ts` (singleton pattern)
  - `lib/drizzle/schema.ts` (define tables)

- [ ] 3. Configure .env with Supabase pooler connection string

- [ ] 4. Use Drizzle in server components, routes, or API handlers

- [ ] 5. (Optional) Add migration tool (drizzle-kit) for schema management
  - `npm install drizzle-kit --save-dev`
  - Add migration scripts to package.json

- [ ] 6. Document usage and patterns
