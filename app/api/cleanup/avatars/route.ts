import { NextRequest, NextResponse } from 'next/server'
import { cleanupOrphanedAvatars } from '@/lib/utils/avatar-cleanup'

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication check here if needed
    // For now, we'll just run the cleanup
    
    await cleanupOrphanedAvatars()
    
    return NextResponse.json({
      success: true,
      message: 'Avatar cleanup completed successfully'
    })
  } catch (error) {
    console.error('Error in avatar cleanup:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup avatars' },
      { status: 500 }
    )
  }
}
