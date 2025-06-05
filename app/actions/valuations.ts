'use server'

import { getSupabaseAdmin } from "@/lib/supabase";
import { Valuation } from "./properties";
import { revalidatePath } from "next/cache";

export async function addValuation(data: {
  property_id: string;
  appraised_value: number;
  appraised_date: string;
  appraised_by: string;
  notes?: string;
}): Promise<Valuation> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      throw new Error("Failed to initialize database connection");
    }

    // Validate required fields
    if (!data.appraised_value || data.appraised_value <= 0) {
      throw new Error('Valid appraised value is required');
    }

    if (!data.appraised_date) {
      throw new Error('Appraisal date is required');
    }

    if (!data.appraised_by?.trim()) {
      throw new Error('Appraiser name is required');
    }

    // Prepare valuation data
    const valuationData = {
      property_id: data.property_id,
      appraised_value: data.appraised_value,
      appraised_date: new Date(data.appraised_date).toISOString(),
      appraised_by: data.appraised_by.trim(),
      notes: data.notes?.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the valuation
    const { data: valuation, error } = await supabase
      .from('valuations')
      .insert([valuationData])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!valuation) {
      throw new Error("Valuation creation failed: No data returned from database");
    }

    revalidatePath(`/properties/${data.property_id}`);
    return valuation as Valuation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Valuation creation failed: ${error.message}`);
    }
    throw new Error("Valuation creation failed: Unknown error occurred");
  }
}

export async function fetchValuations(propertyId: string): Promise<Valuation[]> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('property_id', propertyId)
      .order('appraised_date', { ascending: false });

    if (error) {
      console.error('Error fetching valuations:', error);
      return [];
    }

    return data as Valuation[];
  } catch (error) {
    console.error('Error in fetchValuations:', error);
    return [];
  }
}

export async function updateValuation(
  id: string,
  data: Partial<{
    appraised_value: number;
    appraised_date: string;
    appraised_by: string;
    notes: string;
  }>
): Promise<Valuation | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const updateData: any = {};
    if (data.appraised_value) updateData.appraised_value = data.appraised_value;
    if (data.appraised_date) updateData.appraised_date = new Date(data.appraised_date).toISOString();
    if (data.appraised_by) updateData.appraised_by = data.appraised_by;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: valuation, error } = await supabase
      .from('valuations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating valuation:", error);
      throw new Error(`Failed to update valuation: ${error.message}`);
    }

    if (!valuation) {
      throw new Error(`Valuation not found with ID: ${id}`);
    }

    revalidatePath(`/properties/${valuation.property_id}`);
    return valuation as Valuation;
  } catch (error) {
    console.error("Failed to update valuation:", error);
    return null;
  }
}

export async function deleteValuation(id: string, propertyId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return false;

    const { error } = await supabase
      .from('valuations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting valuation:', error);
      return false;
    }

    revalidatePath(`/properties/${propertyId}`);
    return true;
  } catch (error) {
    console.error('Error in deleteValuation:', error);
    return false;
  }
} 