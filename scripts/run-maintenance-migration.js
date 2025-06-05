// Run the migration script for adding the maintenance_type field to the cash_flows table
import { getSupabaseAdmin } from "../lib/supabase";
import fs from "fs";

async function main() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("Failed to initialize Supabase admin client");
      process.exit(1);
    }

    console.log("Reading migration SQL...");
    const migrationSql = fs.readFileSync("./drizzle/0004_add_maintenance_type.sql", "utf8");
    
    console.log("Executing migration...");
    const { error } = await supabase.rpc('execute_sql', { sql: migrationSql });
    
    if (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }
    
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Error running migration:", err);
    process.exit(1);
  }
}

main();
