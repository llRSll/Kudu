/**
 * Test script for Supabase avatar storage
 * This script tests the functionality of the avatar upload and retrieval
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get environment variables
require('dotenv').config();

// Log environment variables to help debug
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const AVATAR_BUCKET = 'avatars';

// Test avatar functionality
async function testAvatarStorage() {
  console.log('Testing Supabase avatar storage...');
  
  // Step 1: Check if avatar bucket exists, create if not
  console.log('1. Checking if avatar bucket exists...');
  const { data: buckets } = await supabase.storage.listBuckets();
  
  const bucketExists = buckets?.some(bucket => bucket.name === AVATAR_BUCKET);
  
  if (!bucketExists) {
    console.log('Avatar bucket does not exist, creating it...');
    const { error } = await supabase.storage.createBucket(AVATAR_BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
  } else {
    console.log('Avatar bucket already exists');
  }
  
  // Step 2: Upload test avatar
  console.log('2. Uploading test avatar...');
  const testImagePath = path.join(process.cwd(), 'public', 'placeholder-user.jpg');
  
  if (!fs.existsSync(testImagePath)) {
    console.error('Test image not found:', testImagePath);
    return;
  }
  
  const fileBuffer = fs.readFileSync(testImagePath);
  const filename = `test-${Date.now()}.jpg`;
  
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: false
    });
    
  if (uploadError) {
    console.error('Error uploading test avatar:', uploadError);
    return;
  }
  
  console.log('Test avatar uploaded successfully');
  
  // Step 3: Get public URL for the uploaded avatar
  console.log('3. Getting public URL for uploaded avatar...');
  const { data: publicUrlData } = await supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filename);
    
  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error('Failed to get public URL for uploaded avatar');
    return;
  }
  
  const publicUrl = publicUrlData.publicUrl;
  console.log('Public URL:', publicUrl);
  
  // Step 4: Delete test avatar
  console.log('4. Deleting test avatar...');
  const { error: deleteError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove([filename]);
    
  if (deleteError) {
    console.error('Error deleting test avatar:', deleteError);
    return;
  }
  
  console.log('Test avatar deleted successfully');
  
  console.log('All tests completed successfully!');
}

testAvatarStorage().catch(console.error);
