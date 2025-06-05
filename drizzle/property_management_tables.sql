-- Create properties table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  entity_id UUID,
  user_id UUID,
  investment_id UUID,
  street_number TEXT,
  street_name TEXT,
  street_address TEXT,
  suburb TEXT,
  postcode TEXT,
  state TEXT,
  country TEXT,
  land_price NUMERIC,
  build_price NUMERIC,
  purchase_date TIMESTAMP WITH TIME ZONE,
  current_valuation NUMERIC,
  last_valuation_date TIMESTAMP WITH TIME ZONE,
  area NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  has_pool BOOLEAN,
  monthly_income NUMERIC,
  property_purchase_price NUMERIC,
  year_built INTEGER,
  type TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT,
  description TEXT,
  location TEXT,
  image TEXT,
  occupancy INTEGER,
  income NUMERIC,
  expenses NUMERIC,
  value NUMERIC,
  zoning TEXT
);

-- Create financial_summaries table
CREATE TABLE IF NOT EXISTS financial_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  net_monthly_income NUMERIC NOT NULL,
  profit_margin NUMERIC NOT NULL,
  monthly_income NUMERIC NOT NULL,
  monthly_expenses NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lease_start TIMESTAMP WITH TIME ZONE NOT NULL,
  lease_end TIMESTAMP WITH TIME ZONE NOT NULL,
  rent_amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'late', 'ending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_items table
CREATE TABLE IF NOT EXISTS maintenance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cost NUMERIC NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cash_flows table
CREATE TABLE IF NOT EXISTS cash_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_items_property_id ON maintenance_items(property_id);
CREATE INDEX IF NOT EXISTS idx_cash_flows_property_id ON cash_flows(property_id);
CREATE INDEX IF NOT EXISTS idx_financial_summaries_property_id ON financial_summaries(property_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers to automatically update timestamps
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_properties_updated_at') THEN
    CREATE TRIGGER set_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_financial_summaries_updated_at') THEN
    CREATE TRIGGER set_financial_summaries_updated_at
    BEFORE UPDATE ON financial_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_tenants_updated_at') THEN
    CREATE TRIGGER set_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_maintenance_items_updated_at') THEN
    CREATE TRIGGER set_maintenance_items_updated_at
    BEFORE UPDATE ON maintenance_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_cash_flows_updated_at') THEN
    CREATE TRIGGER set_cash_flows_updated_at
    BEFORE UPDATE ON cash_flows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create a trigger to ensure only one primary image per property
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = TRUE THEN
    -- Set all other images for this property to not primary
    UPDATE property_images
    SET is_primary = FALSE
    WHERE property_id = NEW.property_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create the trigger
DROP TRIGGER IF EXISTS ensure_single_primary_image_trigger ON property_images;
CREATE TRIGGER ensure_single_primary_image_trigger
BEFORE INSERT OR UPDATE ON property_images
FOR EACH ROW
EXECUTE FUNCTION ensure_single_primary_image();

-- NOTE: Storage bucket creation
-- In Supabase, you'll need to create a storage bucket named 'property-images'
-- with public access enabled for reading.
-- This cannot be done via SQL but requires using the Supabase dashboard or API.
