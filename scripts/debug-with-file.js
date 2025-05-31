/**
 * Debug script with file output
 */
require('dotenv').config();
const fs = require('fs');
const logFile = './supabase-debug.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// Clear log file
fs.writeFileSync(logFile, '');

log('Debug script started');

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  log(`SUPABASE_URL: ${supabaseUrl || 'Not set'}`);
  log(`SERVICE_KEY: ${supabaseServiceKey ? 'Set (hidden)' : 'Not set'}`);

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  log('Loading Supabase client');
  const { createClient } = require('@supabase/supabase-js');
  
  log('Creating Supabase client');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  async function testConnection() {
    try {
      // Test storage functionality
      log('Testing Supabase storage...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        log(`Error listing buckets: ${JSON.stringify(bucketsError)}`);
      } else {
        log(`Buckets: ${JSON.stringify(buckets)}`);
      }
      
      // Test database functionality
      log('Testing Supabase database...');
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .limit(5);
      
      if (userError) {
        log(`Error querying users: ${JSON.stringify(userError)}`);
      } else {
        log(`Users: ${JSON.stringify(users)}`);
      }
      
      log('Test completed');
    } catch (error) {
      log(`Error in testConnection: ${error.message}`);
    }
  }

  // Run the test
  testConnection();
  
} catch (error) {
  log(`Top-level error: ${error.message}`);
}
