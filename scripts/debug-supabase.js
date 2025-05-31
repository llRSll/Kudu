/**
 * Simple test for Supabase connection with explicit error handling
 */
require('dotenv').config();
console.log('Environment variables loaded');

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('SUPABASE_URL:', supabaseUrl || 'Not set');
  console.log('SERVICE_KEY:', supabaseServiceKey ? 'Set (hidden)' : 'Not set');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const { createClient } = require('@supabase/supabase-js');
  console.log('Supabase client imported');
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('Supabase client created');

  async function testConnection() {
    try {
      // Test storage functionality
      console.log('Testing Supabase storage...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
      } else {
        console.log('Buckets:', buckets.map(b => b.name).join(', '));
      }
      
      // Test database functionality
      console.log('Testing Supabase database...');
      const { data: userCount, error: userError } = await supabase
        .from('users')
        .select('count(*)', { count: 'exact' })
        .limit(1);
      
      if (userError) {
        console.error('Error querying users:', userError);
      } else {
        console.log('User count result:', userCount);
      }
      
    } catch (error) {
      console.error('Error in testConnection:', error);
    }
  }

  // Run the test
  testConnection().then(() => {
    console.log('Test completed');
  }).catch(err => {
    console.error('Unhandled error in test:', err);
  });
  
} catch (error) {
  console.error('Top-level error:', error);
}
