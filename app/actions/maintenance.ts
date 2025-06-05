'use server'

import { getSupabaseAdmin } from "@/lib/supabase";
import { MaintenanceSchedule } from "./properties";
import { revalidatePath } from "next/cache";

export async function addMaintenanceItem(data: {
  property_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  cost: number;
  status: "scheduled" | "in_progress" | "completed" | "overdue";
  assigned_to?: string;
  notes?: string;
}): Promise<MaintenanceSchedule> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      throw new Error("Failed to initialize database connection");
    }

    // Validate required fields
    if (!data.title?.trim()) {
      throw new Error('Maintenance title is required');
    }

    if (!data.scheduled_date) {
      throw new Error('Scheduled date is required');
    }

    if (data.cost === undefined || data.cost < 0) {
      throw new Error('Valid cost is required');
    }

    // Prepare maintenance data
    const maintenanceData = {
      property_id: data.property_id,
      title: data.title.trim(),
      description: data.description?.trim(),
      scheduled_date: new Date(data.scheduled_date).toISOString(),
      cost: data.cost,
      status: data.status || 'scheduled',
      assigned_to: data.assigned_to?.trim(),
      notes: data.notes?.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the maintenance item
    const { data: maintenance, error } = await supabase
      .from('maintenance_schedule')
      .insert([maintenanceData])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!maintenance) {
      throw new Error("Maintenance item creation failed: No data returned from database");
    }

    revalidatePath(`/properties/${data.property_id}`);
    return maintenance as MaintenanceSchedule;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Maintenance item creation failed: ${error.message}`);
    }
    throw new Error("Maintenance item creation failed: Unknown error occurred");
  }
}

export async function fetchMaintenanceSchedule(propertyId: string): Promise<MaintenanceSchedule[]> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('maintenance_schedule')
      .select('*')
      .eq('property_id', propertyId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching maintenance schedule:', error);
      return [];
    }

    return data as MaintenanceSchedule[];
  } catch (error) {
    console.error('Error in fetchMaintenanceSchedule:', error);
    return [];
  }
}

export async function updateMaintenanceItem(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    scheduled_date: string;
    cost: number;
    status: "scheduled" | "in_progress" | "completed" | "overdue";
    assigned_to: string;
    notes: string;
  }>
): Promise<MaintenanceSchedule | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.scheduled_date) updateData.scheduled_date = new Date(data.scheduled_date).toISOString();
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.status) updateData.status = data.status;
    if (data.assigned_to !== undefined) updateData.assigned_to = data.assigned_to;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: maintenance, error } = await supabase
      .from('maintenance_schedule')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating maintenance item:", error);
      throw new Error(`Failed to update maintenance item: ${error.message}`);
    }

    if (!maintenance) {
      throw new Error(`Maintenance item not found with ID: ${id}`);
    }

    revalidatePath(`/properties/${maintenance.property_id}`);
    return maintenance as MaintenanceSchedule;
  } catch (error) {
    console.error("Failed to update maintenance item:", error);
    return null;
  }
}

export async function deleteMaintenanceItem(id: string, propertyId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return false;

    const { error } = await supabase
      .from('maintenance_schedule')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting maintenance item:', error);
      return false;
    }

    revalidatePath(`/properties/${propertyId}`);
    return true;
  } catch (error) {
    console.error('Error in deleteMaintenanceItem:', error);
    return false;
  }
} 