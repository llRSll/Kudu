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
  lease_start: string
  lease_end: string
  rent_amount: number
  status: 'active' | 'late' | 'ending'
  created_at?: string
  updated_at?: string
}

export interface MaintenanceItem {
  id: string
  property_id: string
  title: string
  description: string
  cost: number
  date: string
  status: 'scheduled' | 'completed' | 'pending'
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
 */
export async function fetchFinancialSummary(propertyId: string): Promise<FinancialSummary | null> {
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
}

/**
 * Create or update financial summary
 */
export async function upsertFinancialSummary(summary: FinancialSummary): Promise<FinancialSummary | null> {
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
}

/**
 * Fetch tenants for a property
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
 */
export async function addTenant(tenant: Omit<Tenant, 'id'>): Promise<Tenant | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('tenants')
    .insert(tenant)
    .select()
    .single()

  if (error) {
    console.error('Error adding tenant:', error)
    return null
  }

  revalidatePath(`/properties/${tenant.property_id}`)
  return data as Tenant
}

/**
 * Update a tenant
 */
export async function updateTenant(tenant: Tenant): Promise<Tenant | null> {
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
}

/**
 * Delete a tenant
 */
export async function deleteTenant(id: string, propertyId: string): Promise<boolean> {
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
}

/**
 * Fetch maintenance items for a property
 */
export async function fetchMaintenanceItems(propertyId: string): Promise<MaintenanceItem[]> {
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
}

/**
 * Add a maintenance item
 */
export async function addMaintenanceItem(item: Omit<MaintenanceItem, 'id'>): Promise<MaintenanceItem | null> {
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
}

/**
 * Update a maintenance item
 */
export async function updateMaintenanceItem(item: MaintenanceItem): Promise<MaintenanceItem | null> {
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
}

/**
 * Delete a maintenance item
 */
export async function deleteMaintenanceItem(id: string, propertyId: string): Promise<boolean> {
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
}

/**
 * Fetch property images
 */
export async function fetchPropertyImages(propertyId: string): Promise<PropertyImage[]> {
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
}

/**
 * Upload a property image to Supabase storage
 */
export async function uploadPropertyImage(
  propertyId: string, 
  file: File
): Promise<PropertyImage | null> {
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
}

/**
 * Delete a property image
 */
export async function deletePropertyImage(id: string, fileName: string, propertyId: string): Promise<boolean> {
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
}

/**
 * Set primary property image
 */
export async function setPrimaryPropertyImage(id: string, propertyId: string): Promise<boolean> {
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
}
