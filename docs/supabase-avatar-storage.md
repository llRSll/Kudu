# Supabase Storage for Avatar Images

## Overview

This document describes the implementation of Supabase Storage for avatar images in the Kudu application. We use Supabase Storage to store user avatar images and retrieve them using public URLs.

## Features

- Secure file uploads to Supabase Storage
- Automatic cleanup of old avatars
- File validation for type and size
- Image compression for large files
- Drag-and-drop upload interface
- Database integration with user profiles

## Implementation Details

### Storage Configuration

Avatar images are stored in a dedicated `avatars` bucket in Supabase Storage. This bucket is configured with:

- Public access to allow direct URL access to images
- 5MB file size limit
- Unique filenames using UUID to prevent collisions

### Upload Flow

1. User selects an image via the avatar upload dialog
2. Client-side validation checks file type and size
3. File is sent to the API endpoint (`/api/upload/avatar`)
4. Server uploads the file to Supabase Storage
5. Public URL is generated and returned to the client
6. User avatar URL is updated in the database
7. Old avatar is cleaned up from storage

### Database Integration

The user record contains an `avatar_url` field that stores the public URL of the avatar image. This URL is used throughout the application to display the user's avatar.

### Security

- Server-side validation ensures only valid image types are uploaded
- File size limits prevent abuse
- Service Role Key is used for storage operations, never exposed to the client
- Old avatars are automatically cleaned up to prevent storage bloat

## Code Structure

- **API Endpoint**: `/app/api/upload/avatar/route.ts` - Handles file upload requests
- **Storage Utils**: `/lib/utils/supabase-storage.ts` - Functions for interacting with Supabase Storage
- **Server Actions**: `/app/actions/settings.ts` - Functions for updating and removing avatars
- **UI Components**: 
  - `/components/settings/account-settings.tsx` - Main settings component
  - `/components/settings/avatar-upload-dialog.tsx` - Dialog for uploading avatars

## Usage Example

```tsx
// Upload an avatar
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/upload/avatar", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  
  if (response.ok) {
    // Update user avatar in database
    await updateUserAvatar(userId, result.avatarUrl);
  }
};

// Display an avatar
<Avatar>
  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

## Maintenance

- Orphaned avatars can be cleaned up using the `cleanupOrphanedAvatars` function
- Monitor storage usage in the Supabase dashboard
- Consider implementing image optimization for better performance
