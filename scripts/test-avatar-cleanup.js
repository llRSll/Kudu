/**
 * Clean up test avatar data
 * 
 * This script will:
 * 1. Find test users and delete them
 * 2. Delete test avatars from Supabase storage
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const AVATAR_BUCKET = 'avatars';
const TEST_USER_EMAIL = 'avatar-test@example.com';

async function cleanupAvatarTests() {
  console.log('===== Starting Avatar Test Cleanup =====');

  // Step 1: Find and delete test users
  console.log('\n1. Finding test users...');
  const { data: testUsers, error: selectError } = await supabase
    .from('users')
    .select('id, email, avatar_url')
    .eq('email', TEST_USER_EMAIL);

  if (selectError) {
    console.error('Error finding test users:', selectError);
    process.exit(1);
  }

  if (!testUsers || testUsers.length === 0) {
    console.log('No test users found');
  } else {
    console.log(`Found ${testUsers.length} test users`);
    
    // Extract avatar URLs to clean up
    const avatarUrls = testUsers
      .filter(user => user.avatar_url)
      .map(user => {
        const filename = user.avatar_url.split('/').pop();
        return { userId: user.id, url: user.avatar_url, filename };
      });
    
    // Delete users
    console.log('\n2. Deleting test users...');
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', TEST_USER_EMAIL);
      
    if (deleteError) {
      console.error('Error deleting test users:', deleteError);
    } else {
      console.log(`Deleted ${testUsers.length} test users`);
    }
    
    // Clean up avatars
    if (avatarUrls.length > 0) {
      console.log('\n3. Cleaning up test avatars...');
      
      // List all files in the bucket
      const { data: files, error: listError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .list();
        
      if (listError) {
        console.error('Error listing files in avatar bucket:', listError);
      } else {
        // Find test avatar files
        const testAvatarFiles = files
          .filter(file => file.name.startsWith('test-avatar-'))
          .map(file => file.name);
          
        if (testAvatarFiles.length > 0) {
          console.log(`Found ${testAvatarFiles.length} test avatar files`);
          
          // Delete test avatar files
          const { error: deleteError } = await supabase.storage
            .from(AVATAR_BUCKET)
            .remove(testAvatarFiles);
            
          if (deleteError) {
            console.error('Error deleting avatar files:', deleteError);
          } else {
            console.log(`Deleted ${testAvatarFiles.length} avatar files`);
          }
        } else {
          console.log('No test avatar files found');
        }
      }
    }
  }
  
  console.log('\n===== Avatar Test Cleanup Complete =====');
}

// Run the cleanup
cleanupAvatarTests().catch(console.error);
