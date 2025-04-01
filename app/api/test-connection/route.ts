import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/test-connection'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // First, test our general connection to Supabase
    const isConnected = await testConnection()
    
    // Also check our specific tables we're using
    const tables = [
      'Investments_Properties',
      'Properties_Adresses',
      'Cash_Flow'
    ]
    
    const tableResults = await Promise.all(
      tables.map(async (table) => {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1)
            .single()
          
          return { 
            table, 
            connected: !error,
            count: data?.count || 0,
            error: error?.message 
          }
        } catch (err) {
          return {
            table,
            connected: false,
            count: 0,
            error: (err as Error).message
          }
        }
      })
    )
    
    return NextResponse.json({
      success: isConnected,
      tables: tableResults,
      timestamp: new Date().toISOString(),
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
  } catch (error) {
    console.error('Error in test-connection route:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 