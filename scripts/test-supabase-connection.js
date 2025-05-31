/**
 * Simple test for Supabase connection
 */
require('dotenv').config();
console.log('Testing Supabase connection...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('SERVICE_KEY:', supabaseServiceKey ? 'Set' : 'Not set');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    // Try to query users table
    console.log('Querying users table...');
    const { data, error } = await supabase
      .from('users')
      .select('count()')
      .limit(1);
    
    if (error) {
      console.error('Error querying users:', error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Users count:', data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();
