"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { format, subMonths } from "date-fns";

export interface CashFlow {
  id: string;
  property_id: string;
  entity_id?: string | null;
  investment_id?: string | null;
  user_id?: string;
  timestamp: string;
  description: string;
  transaction_type: string;
  maintenance_type?: string | null;
  debit_credit: "DEBIT" | "CREDIT";
  // amount: number;
  // Additional computed fields for display
  month?: string;
  income?: number;
  expenses?: number;
  maintenance?: number;
  net_income?: number;
  created_at?: string;
  updated_at?: string;

}

/**
 * Fetch upcoming cash flows for a property
 */
export async function fetchUpcomingCashFlows(
  propertyId: string
): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const today = new Date();
  const { data, error } = await supabase
    .from("cash_flows")
    .select("*")
    .eq("property_id", propertyId)
    .gte("timestamp", today.toISOString().split("T")[0])
    .order("timestamp")
    .limit(5);

  if (error) {
    console.error("Error fetching upcoming cash flows:", error);
    return [];
  }

  // Format and compute any additional fields needed for display
  const formattedData = data?.map(cashFlow => ({
    ...cashFlow,
    income: cashFlow.income || 0,
    expenses: cashFlow.expenses || 0,
    maintenance: cashFlow.maintenance || 0,
    net_income: (cashFlow.income || 0) - ((cashFlow.expenses || 0) + (cashFlow.maintenance || 0))
  }));

  return formattedData as CashFlow[];
}

/**
 * Fetch all cash flows for a property in a date range
 */
export async function fetchCashFlows(
  propertyId: string,
  startDate?: string,
  endDate?: string
): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase
    .from("cash_flows")
    .select("*")
    .eq("property_id", propertyId);

  if (startDate) {
    query = query.gte("timestamp", startDate);
  }

  if (endDate) {
    query = query.lte("timestamp", endDate);
  }

  const { data, error } = await query.order("timestamp");

  if (error) {
    console.error("Error fetching cash flows:", error);
    return [];
  }

  return data as CashFlow[];
}

/**
 * Fetch cash flows for a property filtered by period and user
 */
export async function fetchFilteredCashFlows(
  propertyId: string,
  period: string = "6m",
  userId?: string,
  startDateStr?: string,
  endDateStr?: string
): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  // Variables for date filtering
  let startDate: Date | undefined;
  const today = new Date();

  // If custom date range is provided directly, use it
  if (startDateStr && period === "custom") {
    // We'll use the provided date strings directly later
  } 
  // Otherwise calculate date range based on period
  else {
    switch (period) {
      case "6m":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "12m":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 12);
        break;
      case "ytd":
        startDate = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        break;
      case "all":
        // Don't set a start date to get all records
        break;
      default:
        // Default to 6 months
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
    }
  }

  let query = supabase
    .from("cash_flows")
    .select("*")
    .eq("property_id", propertyId);

  // Add date filter based on either calculated dates or provided strings
  if (period === "custom" && startDateStr) {
    query = query.gte("timestamp", startDateStr);
    
    if (endDateStr) {
      query = query.lte("timestamp", endDateStr);
    }
  } else if (startDate) {
    query = query.gte("timestamp", startDate.toISOString().split("T")[0]);
  }

  // Filter by user if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching filtered cash flows:", error);
    return [];
  }

  return data as CashFlow[];
}

/**
 * Fetch a single cash flow by ID
 */
export async function getCashFlowById(
  id: string
): Promise<{ success: boolean; data?: CashFlow; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const { data, error } = await supabase
      .from("cash_flows")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching cash flow:", error);
      return { success: false, error: error.message || "Cash flow not found" };
    }

    return { success: true, data: data as CashFlow };
  } catch (error) {
    console.error("Unexpected error fetching cash flow:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Add a cash flow
 */
export async function addCashFlow(
  cashFlow: Omit<CashFlow, "id">
): Promise<{ success: boolean; data?: CashFlow; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    console.log("Adding cash flow:", cashFlow);

    const { data, error } = await supabase
      .from("cash_flows")
      .insert(cashFlow)
      .select()
      .single();

    if (error) {
      console.error("Error adding cash flow:", error);
      return { success: false, error: error.message || "Failed to add cash flow" };
    }

    console.log("Cash flow added successfully:", data);
    revalidatePath(`/properties/${cashFlow.property_id}`);
    return { success: true, data: data as CashFlow };
  } catch (error) {
    console.error("Unexpected error adding cash flow:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Update a cash flow
 */
export async function updateCashFlow(
  id: string,
  updates: Partial<Omit<CashFlow, "id">>
): Promise<{ success: boolean; data?: CashFlow; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    console.log("Updating cash flow:", id, updates);

    const { data, error } = await supabase
      .from("cash_flows")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cash flow:", error);
      return { success: false, error: error.message || "Failed to update cash flow" };
    }

    console.log("Cash flow updated successfully:", data);
    if (data?.property_id) {
      revalidatePath(`/properties/${data.property_id}`);
    }
    return { success: true, data: data as CashFlow };
  } catch (error) {
    console.error("Unexpected error updating cash flow:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

/**
 * Delete a cash flow
 */
export async function deleteCashFlow(
  id: string,
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    console.log("Deleting cash flow:", id);

    const { error } = await supabase.from("cash_flows").delete().eq("id", id);

    if (error) {
      console.error("Error deleting cash flow:", error);
      return { success: false, error: error.message || "Failed to delete cash flow" };
    }

    console.log("Cash flow deleted successfully");
    revalidatePath(`/properties/${propertyId}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting cash flow:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}
