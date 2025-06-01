'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface CashFlow {
  id: string
  property_id: string
  date: string
  description: string
  type: 'income' | 'expense'
  amount: number
  status: 'scheduled' | 'pending' | 'completed'
  created_at?: string
  updated_at?: string
}

/**
 * Fetch upcoming cash flows for a property
 */
export async function fetchUpcomingCashFlows(propertyId: string): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  const today = new Date()
  const { data, error } = await supabase
    .from('cash_flows')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', today.toISOString().split('T')[0])
    .order('date')
    .limit(5)

  if (error) {
    console.error('Error fetching upcoming cash flows:', error)
    return []
  }

  return data as CashFlow[]
}

/**
 * Fetch all cash flows for a property in a date range
 */
export async function fetchCashFlows(
  propertyId: string,
  startDate?: string,
  endDate?: string
): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  let query = supabase
    .from('cash_flows')
    .select('*')
    .eq('property_id', propertyId)
  
  if (startDate) {
    query = query.gte('date', startDate)
  }
  
  if (endDate) {
    query = query.lte('date', endDate)
  }
  
  const { data, error } = await query.order('date')

  if (error) {
    console.error('Error fetching cash flows:', error)
    return []
  }

  return data as CashFlow[]
}

/**
 * Add a cash flow
 */
export async function addCashFlow(cashFlow: Omit<CashFlow, 'id'>): Promise<CashFlow | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('cash_flows')
    .insert(cashFlow)
    .select()
    .single()

  if (error) {
    console.error('Error adding cash flow:', error)
    return null
  }

  revalidatePath(`/properties/${cashFlow.property_id}`)
  return data as CashFlow
}

/**
 * Update a cash flow
 */
export async function updateCashFlow(cashFlow: CashFlow): Promise<CashFlow | null> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('cash_flows')
    .update(cashFlow)
    .eq('id', cashFlow.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating cash flow:', error)
    return null
  }

  revalidatePath(`/properties/${cashFlow.property_id}`)
  return data as CashFlow
}

/**
 * Delete a cash flow
 */
export async function deleteCashFlow(id: string, propertyId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return false

  const { error } = await supabase
    .from('cash_flows')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting cash flow:', error)
    return false
  }

  revalidatePath(`/properties/${propertyId}`)
  return true
}
