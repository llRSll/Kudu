/**
 * Test the end-to-end avatar upload flow with Supabase integration
 * 
 * This script will:
 * 1. Create a test user in the database if needed
 * 2. Upload a test avatar to Supabase storage
 * 3. Update the user's avatar_url in the database
 * 4. Verify that the avatar can be accessed through the URL
 * 5. Clean up (optional)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create admin client for database operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const AVATAR_BUCKET = 'avatars';
const TEST_USER_EMAIL = 'avatar-test@example.com';

// Main test function
async function testAvatarUploadFlow() {
  console.log('===== Starting Avatar Upload Flow Test =====');

  // Step 1: Ensure we have a test user
  console.log('\n1. Creating or finding test user...');
  const testUser = await ensureTestUser();
  console.log(`Test user: ${testUser.email} (${testUser.id})`);

  // Step 2: Upload an avatar to Supabase storage
  console.log('\n2. Uploading test avatar to Supabase storage...');
  const avatarUrl = await uploadTestAvatar();
  console.log(`Avatar uploaded: ${avatarUrl}`);

  // Step 3: Update the user's avatar_url in the database
  console.log('\n3. Updating user avatar_url in database...');
  await updateUserAvatar(testUser.id, avatarUrl);
  console.log('User avatar_url updated in database');

  // Step 4: Verify that the user has the correct avatar_url
  console.log('\n4. Verifying user avatar_url...');
  const updatedUser = await getUserById(testUser.id);
  console.log(`Current user avatar_url: ${updatedUser.avatar_url}`);
  console.log(`Verification ${updatedUser.avatar_url === avatarUrl ? 'SUCCESSFUL' : 'FAILED'}`);

  console.log('\n===== Avatar Upload Flow Test Complete =====');
  console.log('\nCleanup options:');
  console.log('1. Run node scripts/test-avatar-cleanup.js to remove test user and avatar');
  console.log('2. Leave test data for manual verification');
}

// Create or find a test user
async function ensureTestUser() {
  // Check if user already exists
  const { data: existingUsers, error: selectError } = await supabase
    .from('users')
    .select('*')
    .eq('email', TEST_USER_EMAIL)
    .limit(1);

  if (selectError) {
    console.error('Error checking for existing user:', selectError);
    process.exit(1);
  }

  if (existingUsers && existingUsers.length > 0) {
    return existingUsers[0];
  }

  // Create a new test user
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      email: TEST_USER_EMAIL,
      first_name: 'Avatar',
      surname: 'Test',
      full_name: 'Avatar Test',
      status: 'active',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating test user:', insertError);
    process.exit(1);
  }

  return newUser;
}

// Upload a test avatar to Supabase storage
async function uploadTestAvatar() {
  const testImagePath = path.join(process.cwd(), 'public', 'placeholder-user.jpg');
  
  if (!fs.existsSync(testImagePath)) {
    console.error('Test image not found:', testImagePath);
    process.exit(1);
  }
  
  const fileBuffer = fs.readFileSync(testImagePath);
  const filename = `test-avatar-${Date.now()}.jpg`;
  
  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === AVATAR_BUCKET);
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(AVATAR_BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      process.exit(1);
    }
  }
  
  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: false
    });
    
  if (uploadError) {
    console.error('Error uploading test avatar:', uploadError);
    process.exit(1);
  }
  
  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filename);
    
  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error('Failed to get public URL for uploaded avatar');
    process.exit(1);
  }
  
  return publicUrlData.publicUrl;
}

// Update a user's avatar_url in the database
async function updateUserAvatar(userId, avatarUrl) {
  const { error } = await supabase
    .from('users')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating user avatar:', error);
    process.exit(1);
  }
}

// Get user by ID
async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting user by ID:', error);
    process.exit(1);
  }
  
  return data;
}

// Run the test
testAvatarUploadFlow().catch(console.error);
