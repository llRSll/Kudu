-- Add maintenance_type to cash_flows table
ALTER TABLE cash_flows ADD COLUMN IF NOT EXISTS maintenance_type TEXT;
