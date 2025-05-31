import { supabase, getSupabaseAdmin } from '@/lib/supabase'
import { randomUUID } from 'crypto'

const AVATAR_BUCKET = 'avatars'

/**
 * Upload file to Supabase Storage in the avatars bucket
 * @param file - The file to upload (as Buffer)
 * @param filename - Original filename to derive extension
 * @returns The public URL of the uploaded file
 */
export async function uploadAvatarToStorage(
  file: Buffer,
  filename: string
): Promise<string> {
  // Create a unique filename with the original extension
  const fileExtension = filename.split('.').pop()
  const uniqueFilename = `${randomUUID()}.${fileExtension}`

  // Get admin client for server-side uploads
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    throw new Error('Failed to initialize Supabase admin client')
  }

  // Check if bucket exists, create it if it doesn't
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  
  const bucketExists = buckets?.some(bucket => bucket.name === AVATAR_BUCKET)
  
  if (!bucketExists) {
    // Create the bucket
    const { error } = await supabaseAdmin.storage.createBucket(AVATAR_BUCKET, {
      public: true, // Make the bucket public so avatars are accessible
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
    })
    
    if (error) {
      console.error('Error creating bucket:', error)
      throw new Error('Failed to create storage bucket')
    }
  }

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .upload(uniqueFilename, file, {
      contentType: `image/${fileExtension}`,
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading to Supabase Storage:', uploadError)
    throw new Error('Failed to upload avatar to storage')
  }

  // Get the public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(uniqueFilename)

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to get public URL for uploaded avatar')
  }

  return publicUrlData.publicUrl
}

/**
 * Delete file from Supabase Storage
 * @param url - The public URL of the file to delete
 * @returns Promise resolving to true if successful
 */
export async function deleteAvatarFromStorage(url: string): Promise<boolean> {
  // Extract filename from URL
  // The URL format is usually like: https://[project-ref].supabase.co/storage/v1/object/public/avatars/[filename]
  const filename = url.split('/').pop()
  
  if (!filename) {
    console.error('Invalid avatar URL:', url)
    return false
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.error('Failed to initialize Supabase admin client')
    return false
  }

  // Delete file from Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .remove([filename])

  if (error) {
    console.error('Error deleting from Supabase Storage:', error)
    return false
  }

  return true
}

/**
 * Get public URL for a filename in the avatars bucket
 * @param filename The filename in the bucket
 * @returns The public URL
 */
export function getAvatarPublicUrl(filename: string): string {
  const { data } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filename)
  
  return data.publicUrl
}

/**
 * Clean up orphaned avatar files in Supabase Storage
 * Files that don't exist in the database will be deleted
 */
export async function cleanupOrphanedAvatars(): Promise<void> {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      throw new Error('Failed to initialize Supabase admin client')
    }
    
    const { db } = await import('@/lib/drizzle/client')
    const { Users } = await import('@/lib/drizzle/schema')
    const { isNotNull } = await import('drizzle-orm')
    
    // Get all avatar URLs from the database
    const usersWithAvatars = await db
      .select({ avatar_url: Users.avatar_url })
      .from(Users)
      .where(isNotNull(Users.avatar_url))
    
    // Extract filenames from URLs
    const dbAvatarFilenames = usersWithAvatars
      .map(user => {
        const url = user.avatar_url
        return url ? url.split('/').pop() : null
      })
      .filter(Boolean) as string[]
    
    // List all files in the storage bucket
    const { data: storageFiles, error: listError } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .list()
    
    if (listError) {
      console.error('Error listing storage files:', listError)
      return
    }
    
    if (!storageFiles) {
      console.log('No files found in storage bucket')
      return
    }
    
    // Find orphaned files
    const orphanedFiles = storageFiles.filter(
      file => !dbAvatarFilenames.includes(file.name)
    )
    
    // Delete orphaned files
    if (orphanedFiles.length > 0) {
      const filesToRemove = orphanedFiles.map(file => file.name)
      
      const { error: removeError } = await supabaseAdmin.storage
        .from(AVATAR_BUCKET)
        .remove(filesToRemove)
      
      if (removeError) {
        console.error('Error removing orphaned files:', removeError)
      } else {
        console.log(`Removed ${orphanedFiles.length} orphaned avatar files`)
      }
    } else {
      console.log('No orphaned avatar files to clean up')
    }
    
  } catch (error) {
    console.error('Error during avatar cleanup:', error)
  }
}
