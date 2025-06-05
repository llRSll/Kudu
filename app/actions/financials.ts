'use server'

import { getSupabaseAdmin } from "@/lib/supabase";
import { FinancialDetails } from "./properties";
import { revalidatePath } from "next/cache";

export async function upsertFinancialDetails(data: {
  property_id: string;
  property_value: number;
  annual_income: number;
  annual_expenses: number;
}): Promise<FinancialDetails> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      throw new Error("Failed to initialize database connection");
    }

    // Validate required fields
    if (!data.property_value || data.property_value <= 0) {
      throw new Error('Valid property value is required');
    }

    if (data.annual_income < 0) {
      throw new Error('Annual income cannot be negative');
    }

    if (data.annual_expenses < 0) {
      throw new Error('Annual expenses cannot be negative');
    }

    // Prepare financial data
    const financialData = {
      property_id: data.property_id,
      property_value: data.property_value,
      annual_income: data.annual_income,
      annual_expenses: data.annual_expenses,
      last_updated: new Date().toISOString(),
    };

    // Upsert the financial details
    const { data: financial, error } = await supabase
      .from('financial_details')
      .upsert(financialData)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!financial) {
      throw new Error("Financial details update failed: No data returned from database");
    }

    revalidatePath(`/properties/${data.property_id}`);
    return financial as FinancialDetails;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Financial details update failed: ${error.message}`);
    }
    throw new Error("Financial details update failed: Unknown error occurred");
  }
}

export async function fetchFinancialDetails(propertyId: string): Promise<FinancialDetails | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('financial_details')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (error) {
      // If no data found, return null without logging an error
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching financial details:', error);
      return null;
    }

    return data as FinancialDetails;
  } catch (error) {
    console.error('Error in fetchFinancialDetails:', error);
    return null;
  }
} 