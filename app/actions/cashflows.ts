'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface CashFlow {
  id: string
  property_id: string
  entity_id?: string | null
  investment_id?: string | null
  user_id?: string
  // date field removed as it's no longer in the database schema
  timestamp: string
  description: string
  transaction_type: string
  debit_credit: 'DEBIT' | 'CREDIT'  // Updated to uppercase
  amount: number
  created_at?: string
  updated_at?: string
  // Note: type and status fields removed as they don't exist in the database schema
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
    .gte('timestamp', today.toISOString().split('T')[0])
    .order('timestamp')
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
    query = query.gte('timestamp', startDate)
  }
  
  if (endDate) {
    query = query.lte('timestamp', endDate)
  }
  
  const { data, error } = await query.order('timestamp')

  if (error) {
    console.error('Error fetching cash flows:', error)
    return []
  }

  return data as CashFlow[]
}

/**
 * Fetch cash flows for a property filtered by period and user
 */
export async function fetchFilteredCashFlows(
  propertyId: string,
  period: string = '6m',
  userId?: string
): Promise<CashFlow[]> {
  const supabase = getSupabaseAdmin()
  if (!supabase) return []

  // Calculate date range based on period
  const today = new Date()
  let startDate: Date | undefined
  
  switch (period) {
    case '6m':
      startDate = new Date(today)
      startDate.setMonth(today.getMonth() - 6)
      break
    case '12m':
      startDate = new Date(today)
      startDate.setMonth(today.getMonth() - 12)
      break
    case 'ytd':
      startDate = new Date(today.getFullYear(), 0, 1) // January 1st of current year
      break
    case 'all':
      // Don't set a start date to get all records
      break
    default:
      // Default to 6 months
      startDate = new Date(today)
      startDate.setMonth(today.getMonth() - 6)
  }
  
  let query = supabase
    .from('cash_flows')
    .select('*')
    .eq('property_id', propertyId)
  
  // Add date filter if applicable
  if (startDate) {
    query = query.gte('timestamp', startDate.toISOString().split('T')[0])
  }
  
  // Filter by user if provided
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query.order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching filtered cash flows:', error)
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
