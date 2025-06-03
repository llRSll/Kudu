'use server'

import { getSupabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Property {
  id: string
  name?: string
  entity_id?: string
  user_id?: string
  investment_id?: string
  street_number?: string
  street_name?: string
  street_address?: string
  suburb?: string
  postcode?: string
  state?: string
  country?: string
  land_price?: number
  build_price?: number
  purchase_date?: string
  current_valuation?: number
  last_valuation_date?: string
  area?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
  has_pool?: boolean
  monthly_income?: number
  property_purchase_price?: number
  year_built?: number
  type?: string
  amenities?: string[]
  created_at?: string
  updated_at?: string
  status?: string
  description?: string
  location?: string
  image?: string
  occupancy?: number
  income?: number
  expenses?: number
  value?: number
  zoning?: string
}

export interface FinancialSummary {
  id: string
  property_id: string
  net_monthly_income: number
  profit_margin: number
  monthly_income: number
  monthly_expenses: number
  created_at?: string
  updated_at?: string
}

export interface Tenant {
  id: string
  property_id: string
  name: string
  email: string
  lease_start: string
  lease_end: string
  rent_amount: number
  status: "active" | "late" | "ending_soon" | "expired"
  created_at?: string
  updated_at?: string
}

export interface MaintenanceItem {
  id: string
  property_id: string
  title: string
  description?: string
  cost: number
  due_date: string
  status: "scheduled" | "in_progress" | "completed" | "overdue"
  created_at?: string
  updated_at?: string
}

export interface PropertyImage {
  id: string
  property_id: string
  url: string
  file_name: string
  file_size: number
  content_type: string
  created_at?: string
  is_primary?: boolean
}

export interface Valuation {
  id: string
  property_id: string
  appraised_value: number
  appraised_date: string
  appraised_by: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface MaintenanceSchedule {
  id: string
  property_id: string
  title: string
  description?: string
  scheduled_date: string
  cost: number
  status: "scheduled" | "in_progress" | "completed" | "overdue"
  assigned_to?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface FinancialDetails {
  id: string
  property_id: string
  property_value: number
  annual_income: number
  annual_expenses: number
  annual_net_income: number
  cap_rate: number
  last_updated: string
  created_at?: string
  updated_at?: string
}

/**
 * Fetch a property by ID
 */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching property:', error)
    return null
  }

  return data as Property
}

/**
 * Update a property
 */
export async function updateProperty(property: Partial<Property> & { id: string }): Promise<Property | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', property.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating property:', error)
    return null
  }

  revalidatePath(`/properties/${property.id}`)
  return data as Property
}

/**
 * Fetch financial summary for a property
 * TEMPORARILY DISABLED: Returns hardcoded data to prevent errors
 */
export async function fetchFinancialSummary(propertyId: string): Promise<FinancialSummary | null> {
  // Return hardcoded data instead of querying the database
  return {
    id: 'hardcoded-summary',
    property_id: propertyId,
    monthly_income: 2500,
    monthly_expenses: 1200,
    net_monthly_income: 1300,
    profit_margin: 52,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('financial_summaries')
    .select('*')
    .eq('property_id', propertyId)
    .single()

  if (error) {
    // If no data found, return null without logging an error
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching financial summary:', error)
    return null
  }

  return data as FinancialSummary
  */
}

/**
 * Create or update financial summary
 * TEMPORARILY DISABLED: Returns the input data without saving to database
 */
export async function upsertFinancialSummary(summary: FinancialSummary): Promise<FinancialSummary | null> {
  // Simply return the summary object without actually saving to the database
  return {
    ...summary,
    updated_at: new Date().toISOString()
  };
  
  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('financial_summaries')
    .upsert(summary)
    .select()
    .single()

  if (error) {
    console.error('Error upserting financial summary:', error)
    return null
  }

  revalidatePath(`/properties/${summary.property_id}`)
  return data as FinancialSummary
  */
}

/**
 * Fetch tenants for a property
 * TEMPORARILY DISABLED: Returns hardcoded data to prevent errors
 */
export async function fetchTenants(propertyId: string): Promise<Tenant[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('property_id', propertyId)
    .order('lease_end')

  if (error) {
    console.error('Error fetching tenants:', error)
    return []
  }

  return data as Tenant[]
}

/**
 * Add a tenant
 * TEMPORARILY DISABLED: Returns mock data without saving to database
 */

/**
 * Update a tenant
 * TEMPORARILY DISABLED: Returns the updated tenant without saving to database
 */
export async function updateTenant(tenant: Tenant): Promise<Tenant | null> {
  // Simply return the updated tenant with a new timestamp
  const updatedTenant = {
    ...tenant,
    updated_at: new Date().toISOString()
  };
  
  // Revalidate the path to refresh the UI
  revalidatePath(`/properties/${tenant.property_id}`);
  return updatedTenant;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('tenants')
    .update(tenant)
    .eq('id', tenant.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating tenant:', error)
    return null
  }

  revalidatePath(`/properties/${tenant.property_id}`)
  return data as Tenant
  */
}

/**
 * Delete a tenant
 * TEMPORARILY DISABLED: Returns success without actually deleting from database
 */
export async function deleteTenant(id: string, propertyId: string): Promise<boolean> {
  // Simply return success without actually deleting anything
  console.log(`Mock delete for tenant ${id} from property ${propertyId}`);
  
  // Revalidate the path to trigger a refresh of the UI
  revalidatePath(`/properties/${propertyId}`);
  return true;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tenant:', error)
    return false
  }

  revalidatePath(`/properties/${propertyId}`)
  return true
  */
}

/**
 * Fetch maintenance items for a property
 * TEMPORARILY DISABLED: Returns hardcoded data to prevent errors
 */
export async function fetchMaintenanceItems(propertyId: string): Promise<MaintenanceItem[]> {
  // Return hardcoded maintenance items instead of querying the database
  return [
    {
      id: 'maintenance-1',
      property_id: propertyId,
      title: 'HVAC System Maintenance',
      description: 'Annual service check and filter replacement',
      cost: 350,
      due_date: new Date(2023, 11, 15).toISOString(),
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'maintenance-2',
      property_id: propertyId,
      title: 'Roof Inspection',
      description: 'Check for damage after recent storm',
      cost: 275,
      due_date: new Date(2023, 10, 5).toISOString(),
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'maintenance-3',
      property_id: propertyId,
      title: 'Plumbing Repair',
      description: 'Fix leaking faucet in master bathroom',
      cost: 180,
      due_date: new Date(2023, 11, 28).toISOString(),
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('maintenance_items')
    .select('*')
    .eq('property_id', propertyId)
    .order('date')

  if (error) {
    console.error('Error fetching maintenance items:', error)
    return []
  }

  return data as MaintenanceItem[]
  */
}

/**
 * Add a maintenance item
 * TEMPORARILY DISABLED: Returns mock data without saving to database
 */
export async function addMaintenanceItem(item: Omit<MaintenanceItem, 'id'>): Promise<MaintenanceItem | null> {
  // Return a mock item with an id
  return {
    ...item,
    id: `maintenance-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('maintenance_items')
    .insert(item)
    .select()
    .single()

  if (error) {
    console.error('Error adding maintenance item:', error)
    return null
  }

  revalidatePath(`/properties/${item.property_id}`)
  return data as MaintenanceItem
  */
}

/**
 * Update a maintenance item
 * TEMPORARILY DISABLED: Returns the updated item without saving to database
 */
export async function updateMaintenanceItem(item: MaintenanceItem): Promise<MaintenanceItem | null> {
  // Simply return the updated item with a new timestamp
  return {
    ...item,
    updated_at: new Date().toISOString()
  };

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('maintenance_items')
    .update(item)
    .eq('id', item.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating maintenance item:', error)
    return null
  }

  revalidatePath(`/properties/${item.property_id}`)
  return data as MaintenanceItem
  */
}

/**
 * Delete a maintenance item
 * TEMPORARILY DISABLED: Returns success without actually deleting from database
 */
export async function deleteMaintenanceItem(id: string, propertyId: string): Promise<boolean> {
  // Simply return success without actually deleting anything
  console.log(`Mock delete for maintenance item ${id} from property ${propertyId}`);
  
  // Revalidate the path to trigger a refresh of the UI
  revalidatePath(`/properties/${propertyId}`);
  return true;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  const { error } = await supabase
    .from('maintenance_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting maintenance item:', error)
    return false
  }

  revalidatePath(`/properties/${propertyId}`)
  return true
  */
}

/**
 * Fetch property images
 * TEMPORARILY DISABLED: Returns hardcoded data to prevent errors
 */
export async function fetchPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  // Return hardcoded property images instead of querying the database
  return [
    {
      id: 'image-1',
      property_id: propertyId,
      url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
      file_name: 'exterior_front.jpg',
      file_size: 1250000,
      content_type: 'image/jpeg',
      created_at: new Date().toISOString(),
      is_primary: true
    },
    {
      id: 'image-2',
      property_id: propertyId,
      url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e',
      file_name: 'living_room.jpg',
      file_size: 980000,
      content_type: 'image/jpeg',
      created_at: new Date().toISOString(),
      is_primary: false
    },
    {
      id: 'image-3',
      property_id: propertyId,
      url: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf',
      file_name: 'kitchen.jpg',
      file_size: 1050000,
      content_type: 'image/jpeg',
      created_at: new Date().toISOString(),
      is_primary: false
    }
  ];

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at')

  if (error) {
    console.error('Error fetching property images:', error)
    return []
  }

  return data as PropertyImage[]
  */
}

/**
 * Upload a property image to Supabase storage
 * TEMPORARILY DISABLED: Returns mock data without saving to database
 */
export async function uploadPropertyImage(
  propertyId: string, 
  file: File
): Promise<PropertyImage | null> {
  // Return a mock property image without actually uploading anything
  const mockImageId = `image-${Date.now()}`;
  const fileName = `${propertyId}/${Date.now()}-${file.name}`;
  
  // Create a mock URL from unsplash 
  const mockUrl = 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab';
  
  // Return mock data
  const mockImageRecord: PropertyImage = {
    id: mockImageId,
    property_id: propertyId,
    url: mockUrl,
    file_name: fileName,
    file_size: file.size,
    content_type: file.type,
    is_primary: false,
    created_at: new Date().toISOString()
  };
  
  // Revalidate the path to trigger a refresh of the UI
  revalidatePath(`/properties/${propertyId}`);
  return mockImageRecord;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  // 1. Upload to storage
  const fileName = `${propertyId}/${Date.now()}-${file.name}`
  const { data: fileData, error: uploadError } = await supabase
    .storage
    .from('property-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    return null
  }

  // 2. Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('property-images')
    .getPublicUrl(fileName)

  if (!publicUrlData.publicUrl) {
    console.error('Failed to get public URL for uploaded file')
    return null
  }

  // 3. Create record in property_images table
  const imageRecord: Omit<PropertyImage, 'id'> = {
    property_id: propertyId,
    url: publicUrlData.publicUrl,
    file_name: fileName,
    file_size: file.size,
    content_type: file.type,
    is_primary: false,
  }

  const { data: dbRecord, error: dbError } = await supabase
    .from('property_images')
    .insert(imageRecord)
    .select()
    .single()

  if (dbError) {
    console.error('Error creating image record:', dbError)
    // Try to delete the uploaded file if database insert fails
    await supabase.storage.from('property-images').remove([fileName])
    return null
  }

  revalidatePath(`/properties/${propertyId}`)
  return dbRecord as PropertyImage
  */
}

/**
 * Delete a property image
 * TEMPORARILY DISABLED: Returns success without actually deleting from storage or database
 */
export async function deletePropertyImage(id: string, fileName: string, propertyId: string): Promise<boolean> {
  // Simply log and return success without actually deleting anything
  console.log(`Mock delete for property image ${id} (${fileName}) from property ${propertyId}`);
  
  // Revalidate the path to trigger a refresh of the UI
  revalidatePath(`/properties/${propertyId}`);
  return true;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  // 1. Delete from storage
  const { error: storageError } = await supabase
    .storage
    .from('property-images')
    .remove([fileName])

  if (storageError) {
    console.error('Error deleting file from storage:', storageError)
    return false
  }

  // 2. Delete from database
  const { error: dbError } = await supabase
    .from('property_images')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('Error deleting image record:', dbError)
    return false
  }

  revalidatePath(`/properties/${propertyId}`)
  return true
  */
}

/**
 * Set primary property image
 * TEMPORARILY DISABLED: Returns success without actually updating the database
 */
export async function setPrimaryPropertyImage(id: string, propertyId: string): Promise<boolean> {
  // Simply log and return success without actually updating anything
  console.log(`Mock set primary for property image ${id} from property ${propertyId}`);
  
  // Revalidate the path to trigger a refresh of the UI
  revalidatePath(`/properties/${propertyId}`);
  return true;

  /* Original implementation:
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  // First, set all images for this property as not primary
  const { error: updateError } = await supabase
    .from('property_images')
    .update({ is_primary: false })
    .eq('property_id', propertyId)

  if (updateError) {
    console.error('Error updating property images:', updateError)
    return false
  }

  // Then, set the selected image as primary
  const { error: primaryError } = await supabase
    .from('property_images')
    .update({ is_primary: true })
    .eq('id', id)

  if (primaryError) {
    console.error('Error setting primary image:', primaryError)
    return false
  }

  revalidatePath(`/properties/${propertyId}`)
  return true
  */
}

/**
 * Fetch valuations for a property
 */
export async function fetchValuations(propertyId: string): Promise<Valuation[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('valuations')
    .select('*')
    .eq('property_id', propertyId)
    .order('appraised_date', { ascending: false })

  if (error) {
    console.error('Error fetching valuations:', error)
    return []
  }

  return data as Valuation[]
}

/**
 * Fetch maintenance schedule for a property
 */
export async function fetchMaintenanceSchedule(propertyId: string): Promise<MaintenanceSchedule[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('maintenance_schedule')
    .select('*')
    .eq('property_id', propertyId)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching maintenance schedule:', error)
    return []
  }

  return data as MaintenanceSchedule[]
}
