/**
 * Type definitions for property-related entities
 */

export interface Property {
  id: string;
  name?: string;
  entity_id?: string;
  user_id?: string;
  investment_id?: string;
  street_number?: string;
  street_name?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  land_price?: string;
  build_price?: string;
  purchase_date?: string;
  current_valuation?: string;
  last_valuation_date?: Date;
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
  parking?: string;
  has_pool?: boolean;
  monthly_income?: string;
  property_purchase_price?: string;
  year_built?: number;
  type?: string;
  amenities?: unknown;
  created_at?: Date;
  updated_at?: Date;
  status?: string;
  description?: string;
}

export interface CreditFacilityProperty {
  id: string;
  facility_id?: string;
  property_id?: string;
  purpose?: string;
  amount_allocated?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreditFacilitySecurity {
  id: string;
  facility_id?: string;
  type?: string;
  property_id?: string;
  description?: string;
  value?: string;
  created_at?: Date;
  updated_at?: Date;
}
