import { createClient } from '@supabase/supabase-js'

// For client components, NEXT_PUBLIC_ environment variables must be accessed differently
// We need to ensure these have fallback values to prevent runtime errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Don't throw on the client side - it would break the rendering
let supabase: ReturnType<typeof createClient>

// Only create client if we have the required values
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.error('Missing Supabase environment variables - client operations will fail')
  // Create a dummy client that will be replaced once .env is configured correctly
  supabase = createClient('https://placeholder-url.supabase.co', 'placeholder-key')
}

export { supabase }

// Admin client with service role - use with caution, only on trusted server environments
// This should only be used in server components or API routes
// We use a function to prevent instantiation in the browser
export const getSupabaseAdmin = () => {
  // Ensure we're on the server
  if (typeof window !== 'undefined') {
    console.error('getSupabaseAdmin should only be called on the server')
    return null
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    console.error('Missing Supabase environment variables for admin client')
    return null
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} 