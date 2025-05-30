/**
 * Type adapter utilities to convert between database schema types and component types
 */

import { Property as DrizzleProperty } from '@/lib/drizzle/types/property-types';
import { Property as ComponentProperty } from '@/components/properties/types';

/**
 * Converts a DrizzleProperty from the database schema to a ComponentProperty used in the UI
 */
export function adaptDrizzlePropertyToComponentProperty(drizzleProperty: DrizzleProperty): ComponentProperty {
  return {
    id: drizzleProperty.id,
    name: drizzleProperty.name,
    entity_id: drizzleProperty.entity_id,
    userId: drizzleProperty.user_id,
    investmentId: drizzleProperty.investment_id,
    streetNumber: drizzleProperty.street_number,
    streetName: drizzleProperty.street_name,
    suburb: drizzleProperty.suburb,
    postcode: drizzleProperty.postcode,
    state: drizzleProperty.state,
    country: drizzleProperty.country,
    landPrice: drizzleProperty.land_price ? Number(drizzleProperty.land_price) : undefined,
    buildPrice: drizzleProperty.build_price ? Number(drizzleProperty.build_price) : undefined,
    purchaseDate: drizzleProperty.purchase_date,
    currentValuation: drizzleProperty.current_valuation ? Number(drizzleProperty.current_valuation) : undefined,
    lastValuationDate: drizzleProperty.last_valuation_date,
    area: drizzleProperty.area ? Number(drizzleProperty.area) : undefined,
    bedrooms: drizzleProperty.bedrooms ? Number(drizzleProperty.bedrooms) : undefined,
    bathrooms: drizzleProperty.bathrooms ? Number(drizzleProperty.bathrooms) : undefined,
    parking: drizzleProperty.parking ? Number(drizzleProperty.parking) : undefined,
    hasPool: drizzleProperty.has_pool,
    monthlyIncome: drizzleProperty.monthly_income ? Number(drizzleProperty.monthly_income) : undefined,
    propertyPurchasePrice: drizzleProperty.property_purchase_price ? Number(drizzleProperty.property_purchase_price) : undefined,
    yearBuilt: drizzleProperty.year_built,
    type: drizzleProperty.type,
    amenities: drizzleProperty.amenities,
    createdAt: drizzleProperty.created_at,
    updatedAt: drizzleProperty.updated_at,
    status: drizzleProperty.status,
    description: drizzleProperty.description,
    // Map or derive UI-specific fields from database fields where possible
    // For fields that don't have direct mappings, provide sensible defaults
    value: drizzleProperty.current_valuation ? Number(drizzleProperty.current_valuation) : undefined,
    income: drizzleProperty.monthly_income ? Number(drizzleProperty.monthly_income) : undefined,
    // We don't have a direct mapping for expenses in the database schema, so leave it undefined
    // You might want to calculate this from other fields if appropriate
    expenses: undefined,
    // We don't have occupancy in the database schema
    occupancy: undefined,
    // No direct mapping for image
    image: undefined,
    // Default location derived from address components if location isn't provided
    location: drizzleProperty.street_name && drizzleProperty.suburb ? 
      `${drizzleProperty.street_name}, ${drizzleProperty.suburb}` : undefined
  };
}

/**
 * Converts a ComponentProperty used in the UI to a DrizzleProperty for the database schema
 */
export function adaptComponentPropertyToDrizzleProperty(componentProperty: ComponentProperty): DrizzleProperty {
  return {
    id: componentProperty.id,
    name: componentProperty.name,
    entity_id: componentProperty.entity_id,
    user_id: componentProperty.userId,
    investment_id: componentProperty.investmentId,
    street_number: componentProperty.streetNumber,
    street_name: componentProperty.streetName,
    suburb: componentProperty.suburb,
    postcode: componentProperty.postcode,
    state: componentProperty.state,
    country: componentProperty.country,
    land_price: componentProperty.landPrice?.toString(),
    build_price: componentProperty.buildPrice?.toString(),
    purchase_date: componentProperty.purchaseDate,
    current_valuation: componentProperty.currentValuation?.toString(),
    last_valuation_date: componentProperty.lastValuationDate,
    area: componentProperty.area?.toString(),
    bedrooms: componentProperty.bedrooms?.toString(),
    bathrooms: componentProperty.bathrooms?.toString(),
    parking: componentProperty.parking?.toString(),
    has_pool: componentProperty.hasPool,
    monthly_income: componentProperty.monthlyIncome?.toString(),
    property_purchase_price: componentProperty.propertyPurchasePrice?.toString(),
    year_built: componentProperty.yearBuilt,
    type: componentProperty.type,
    amenities: componentProperty.amenities,
    created_at: componentProperty.createdAt,
    updated_at: componentProperty.updatedAt,
    status: componentProperty.status,
    description: componentProperty.description
  };
}
