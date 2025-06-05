'use server'

import { getSupabaseAdmin } from "@/lib/supabase";
import { Tenant } from "./properties";
import { revalidatePath } from "next/cache";

export async function addTenant(data: {
  property_id: string;
  name: string;
  email: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  status: "active" | "late" | "ending_soon" | "expired";
}): Promise<Tenant> {
  try {
    // Initialize Supabase client
    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error initializing Supabase';
      throw new Error(`Database connection failed: ${message}`);
    }

    if (!supabase) {
      throw new Error("Failed to initialize database connection");
    }
    
    // First, ensure the property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', data.property_id)
      .single();

    if (propertyError) {
      throw new Error(`Property verification failed: ${propertyError.message}`);
    }

    if (!property) {
      throw new Error(`Property not found with ID: ${data.property_id}`);
    }

    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error('Tenant name is required');
    }

    if (!data.lease_start || !data.lease_end) {
      throw new Error('Lease start and end dates are required');
    }

    if (data.rent_amount === undefined || data.rent_amount < 0) {
      throw new Error('Valid rent amount is required');
    }

    // Prepare tenant data with explicit type casting
    const tenantData = {
      property_id: data.property_id,
      name: data.name.trim(),
      email: data.email?.trim() || '',
      lease_start: new Date(data.lease_start).toISOString(),
      lease_end: new Date(data.lease_end).toISOString(),
      rent_amount: Number(data.rent_amount),
      status: data.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the tenant
    const { data: tenant, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select('*')
      .single();

    if (error) {
      // Check for specific error types
      if (error.code === '23505') {
        throw new Error('A tenant with this information already exists');
      } else if (error.code === '23503') {
        throw new Error('Invalid property ID or missing required relationship');
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }

    if (!tenant) {
      throw new Error("Tenant creation failed: No data returned from database");
    }

    revalidatePath(`/properties/${data.property_id}`);
    return tenant as Tenant;
  } catch (error) {
    // Ensure we throw an error with a meaningful message
    if (error instanceof Error) {
      throw new Error(`Tenant creation failed: ${error.message}`);
    }
    throw new Error("Tenant creation failed: Unknown error occurred");
  }
}

export async function updateTenant(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    phone: string;
    lease_start: string;
    lease_end: string;
    rent_amount: number;
    status: "active" | "late" | "ending_soon" | "expired";
  }>
): Promise<Tenant> {
  try {
    const supabase = getSupabaseAdmin();
    
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.lease_start) updateData.lease_start = new Date(data.lease_start).toISOString();
    if (data.lease_end) updateData.lease_end = new Date(data.lease_end).toISOString();
    if (data.rent_amount) updateData.rent_amount = data.rent_amount;
    if (data.status) updateData.status = data.status;

    const { data: tenant, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating tenant:", error);
      throw new Error(`Failed to update tenant: ${error.message}`);
    }

    if (!tenant) {
      throw new Error(`Tenant not found with ID: ${id}`);
    }

    revalidatePath(`/properties/${tenant.property_id}`);
    return tenant as Tenant;
  } catch (error) {
    console.error("Failed to update tenant:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update tenant: ${error.message}`);
    }
    throw new Error("Failed to update tenant: Unknown error");
  }
} 