import { unlink } from 'fs/promises'
import { join } from 'path'

/**
 * Delete an avatar file from the filesystem
 * @param avatarUrl - The avatar URL (e.g., "/uploads/avatars/filename.jpg")
 */
export async function deleteAvatarFile(avatarUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const filename = avatarUrl.split('/').pop()
    if (!filename) {
      throw new Error('Invalid avatar URL')
    }

    // Construct full file path
    const filePath = join(process.cwd(), 'public', 'uploads', 'avatars', filename)
    
    // Delete the file
    await unlink(filePath)
    console.log(`Deleted avatar file: ${filename}`)
  } catch (error) {
    // Don't throw error if file doesn't exist
    if ((error as any).code !== 'ENOENT') {
      console.error('Error deleting avatar file:', error)
    }
  }
}

/**
 * Clean up orphaned avatar files (files that don't exist in database)
 * This would typically be run as a cron job or maintenance task
 */
export async function cleanupOrphanedAvatars(): Promise<void> {
  try {
    const { readdir } = await import('fs/promises')
    const { db } = await import('@/lib/drizzle/client')
    const { Users } = await import('@/lib/drizzle/schema')
    const { isNotNull } = await import('drizzle-orm')
    
    // Get all avatar files from filesystem
    const avatarsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    const files = await readdir(avatarsDir)
    
    // Get all avatar URLs from database
    const usersWithAvatars = await db
      .select({ avatar_url: Users.avatar_url })
      .from(Users)
      .where(isNotNull(Users.avatar_url))
    
    const dbAvatarFilenames = usersWithAvatars
      .map(user => user.avatar_url?.split('/').pop())
      .filter(Boolean)
    
    // Find orphaned files
    const orphanedFiles = files.filter(file => 
      file !== '.gitkeep' && !dbAvatarFilenames.includes(file)
    )
    
    // Delete orphaned files
    for (const file of orphanedFiles) {
      try {
        await unlink(join(avatarsDir, file))
        console.log(`Cleaned up orphaned avatar: ${file}`)
      } catch (error) {
        console.error(`Failed to delete orphaned avatar ${file}:`, error)
      }
    }
    
    console.log(`Cleanup complete. Removed ${orphanedFiles.length} orphaned files.`)
  } catch (error) {
    console.error('Error during avatar cleanup:', error)
  }
}
