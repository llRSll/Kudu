/**
 * Database API functions for working with properties using the drizzle schema
 */

import { db } from '@/lib/drizzle/client';
import { Properties } from '@/lib/drizzle/schema';
import { Property as DrizzleProperty } from '@/lib/drizzle/types/property-types';
import { Property as ComponentProperty } from '@/components/properties/types';
import { adaptDrizzlePropertyToComponentProperty } from '@/lib/utils/type-adapters';
import { eq } from 'drizzle-orm';

/**
 * Fetches all properties from the database using the drizzle schema
 */
export async function getAllProperties(): Promise<ComponentProperty[]> {
  try {
    const properties = await db.select().from(Properties);
    return properties.map(property => adaptDrizzlePropertyToComponentProperty(property));
  } catch (error) {
    console.error('Error fetching properties with drizzle:', error);
    return [];
  }
}

/**
 * Fetches a property by ID from the database using the drizzle schema
 */
export async function getPropertyById(id: string): Promise<ComponentProperty | null> {
  try {
    const [property] = await db.select().from(Properties).where(eq(Properties.id, id));
    if (!property) return null;
    
    return adaptDrizzlePropertyToComponentProperty(property);
  } catch (error) {
    console.error(`Error fetching property ${id} with drizzle:`, error);
    return null;
  }
}

/**
 * Creates a new property in the database using the drizzle schema
 */
export async function createProperty(property: Omit<ComponentProperty, 'id'>): Promise<string | null> {
  try {
    const drizzleProperty: Omit<DrizzleProperty, 'id'> = {
      name: property.name,
      entity_id: property.entity_id,
      user_id: property.userId,
      investment_id: property.investmentId,
      street_number: property.streetNumber,
      street_name: property.streetName,
      suburb: property.suburb,
      postcode: property.postcode,
      state: property.state,
      country: property.country,
      land_price: property.landPrice?.toString(),
      build_price: property.buildPrice?.toString(),
      purchase_date: property.purchaseDate,
      current_valuation: property.currentValuation?.toString(),
      last_valuation_date: property.lastValuationDate,
      area: property.area?.toString(),
      bedrooms: property.bedrooms?.toString(),
      bathrooms: property.bathrooms?.toString(),
      parking: property.parking?.toString(),
      has_pool: property.hasPool,
      monthly_income: property.monthlyIncome?.toString(),
      property_purchase_price: property.propertyPurchasePrice?.toString(),
      year_built: property.yearBuilt,
      type: property.type,
      amenities: property.amenities,
      created_at: property.createdAt || new Date(),
      updated_at: property.updatedAt || new Date(),
      status: property.status,
      description: property.description
    };

    const result = await db.insert(Properties).values(drizzleProperty);
    if (!result || !result[0]?.id) return null;
    
    return result[0].id;
  } catch (error) {
    console.error('Error creating property with drizzle:', error);
    return null;
  }
}

/**
 * Updates a property in the database using the drizzle schema
 */
export async function updateProperty(id: string, property: Partial<ComponentProperty>): Promise<boolean> {
  try {
    // Convert component property fields to drizzle property fields
    const updateValues: Partial<DrizzleProperty> = {};
    
    if (property.name !== undefined) updateValues.name = property.name;
    if (property.entity_id !== undefined) updateValues.entity_id = property.entity_id;
    if (property.userId !== undefined) updateValues.user_id = property.userId;
    if (property.investmentId !== undefined) updateValues.investment_id = property.investmentId;
    if (property.streetNumber !== undefined) updateValues.street_number = property.streetNumber;
    if (property.streetName !== undefined) updateValues.street_name = property.streetName;
    if (property.suburb !== undefined) updateValues.suburb = property.suburb;
    if (property.postcode !== undefined) updateValues.postcode = property.postcode;
    if (property.state !== undefined) updateValues.state = property.state;
    if (property.country !== undefined) updateValues.country = property.country;
    if (property.landPrice !== undefined) updateValues.land_price = property.landPrice.toString();
    if (property.buildPrice !== undefined) updateValues.build_price = property.buildPrice.toString();
    if (property.purchaseDate !== undefined) updateValues.purchase_date = property.purchaseDate;
    if (property.currentValuation !== undefined) updateValues.current_valuation = property.currentValuation.toString();
    if (property.lastValuationDate !== undefined) updateValues.last_valuation_date = property.lastValuationDate;
    if (property.area !== undefined) updateValues.area = property.area.toString();
    if (property.bedrooms !== undefined) updateValues.bedrooms = property.bedrooms.toString();
    if (property.bathrooms !== undefined) updateValues.bathrooms = property.bathrooms.toString();
    if (property.parking !== undefined) updateValues.parking = property.parking.toString();
    if (property.hasPool !== undefined) updateValues.has_pool = property.hasPool;
    if (property.monthlyIncome !== undefined) updateValues.monthly_income = property.monthlyIncome.toString();
    if (property.propertyPurchasePrice !== undefined) updateValues.property_purchase_price = property.propertyPurchasePrice.toString();
    if (property.yearBuilt !== undefined) updateValues.year_built = property.yearBuilt;
    if (property.type !== undefined) updateValues.type = property.type;
    if (property.amenities !== undefined) updateValues.amenities = property.amenities;
    if (property.status !== undefined) updateValues.status = property.status;
    if (property.description !== undefined) updateValues.description = property.description;
    
    // Always update the updated_at timestamp
    updateValues.updated_at = new Date();

    await db.update(Properties).set(updateValues).where(eq(Properties.id, id));
    
    return true;
  } catch (error) {
    console.error(`Error updating property ${id} with drizzle:`, error);
    return false;
  }
}

/**
 * Deletes a property from the database using the drizzle schema
 */
export async function deleteProperty(id: string): Promise<boolean> {
  try {
    await db.delete(Properties).where(eq(Properties.id, id));
    return true;
  } catch (error) {
    console.error(`Error deleting property ${id} with drizzle:`, error);
    return false;
  }
}
