import { getSupabaseAdmin } from '@/lib/supabase'

export async function testConnection() {
  try {
    // Get the admin client (which only works on the server)
    const supabaseAdmin = getSupabaseAdmin()
    
    // If admin client isn't available, return false
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return false
    }
    
    const tables = [
      'profiles',
      'family_groups',
      'family_branches',
      'family_members',
      'family_relationships'
    ]
    
    const results = await Promise.all(
      tables.map(async (table) => {
        try {
          const { data, error } = await supabaseAdmin
            .from(table)
            .select('*')
            .limit(1)
          
          return { table, success: !error, error: error?.message }
        } catch (err) {
          return { table, success: false, error: (err as Error).message }
        }
      })
    )
    
    const allSuccessful = results.every(r => r.success)
    console.log('Table verification results:', results)
    
    return allSuccessful
  } catch (err) {
    console.error('Unexpected error:', err)
    return false
  }
} 