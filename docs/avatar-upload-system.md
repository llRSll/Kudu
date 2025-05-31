# Avatar Upload System Documentation

## Overview
The avatar upload system provides a complete solution for users to upload, manage, and remove profile photos with the following features:

## Features
✅ **File Upload & Validation**
- Supports JPEG, PNG, WebP, and GIF formats
- Maximum file size: 5MB
- Client-side and server-side validation
- Image compression for large files (>1MB compressed to 512x512px)

✅ **User Interface**
- Modern drag-and-drop upload dialog
- Real-time image preview
- Loading states and progress feedback
- Responsive design

✅ **Storage & Database**
- Files stored in `/public/uploads/avatars/` with unique UUID filenames
- Avatar URLs stored in user database records
- Proper cleanup and error handling

✅ **Server Actions**
- `updateUserAvatar(userId, avatarUrl)` - Update user avatar
- `removeUserAvatar(userId)` - Remove user avatar
- Full integration with Drizzle ORM and database

## Components

### 1. AccountSettings Component (`/components/settings/account-settings.tsx`)
- Main settings form with avatar management
- Integrates with the avatar upload dialog
- Handles avatar removal functionality
- Real-time updates after avatar changes

### 2. AvatarUploadDialog Component (`/components/settings/avatar-upload-dialog.tsx`)
- Modal dialog for avatar upload
- Drag-and-drop functionality
- Image preview and compression
- File validation and error handling

### 3. Image Utilities (`/lib/utils/image-utils.ts`)
- File validation functions
- Image compression utilities
- Preview generation helpers
- Configuration constants

### 4. Upload API Route (`/app/api/upload/avatar/route.ts`)
- Secure file upload endpoint
- Server-side validation
- Unique filename generation
- Error handling and responses

## Usage

### Basic Avatar Upload Flow:
1. User clicks "Change" button in account settings
2. Avatar upload dialog opens
3. User selects or drags image file
4. File is validated and preview shown
5. On upload, image is compressed if needed
6. File uploaded to server via API
7. Database updated with new avatar URL
8. UI refreshes to show new avatar

### Avatar Removal Flow:
1. User clicks "Remove" button
2. Avatar URL set to null in database
3. UI updates to show initials fallback

## Security Features
- File type validation (whitelist approach)
- File size limits
- Unique filename generation to prevent conflicts
- Server-side validation as backup

## Error Handling
- Comprehensive client-side validation
- Server-side validation backup
- User-friendly error messages
- Proper loading states

## Database Integration
- Uses existing Users table with avatar_url column
- Leverages Drizzle ORM for type safety
- Proper transaction handling
- Cache revalidation after updates

## Testing

### Manual Testing Checklist:
- [ ] Upload valid image (JPEG, PNG, WebP, GIF)
- [ ] Try uploading invalid file type
- [ ] Try uploading oversized file (>5MB)
- [ ] Test drag-and-drop functionality
- [ ] Test image compression for large files
- [ ] Test avatar removal
- [ ] Verify database updates
- [ ] Test error scenarios
- [ ] Check responsive design

### Automated Testing:
- File validation functions can be unit tested
- API endpoints can be integration tested
- Components can be tested with React Testing Library

## Configuration

### Image Constraints:
```typescript
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_DIMENSION: 2048, // Max width/height in pixels
}
```

### Compression Settings:
- Target dimensions: 512x512px
- Quality: 0.8 (80%)
- Only applied to files >1MB

## Future Enhancements
- [ ] Add image cropping functionality
- [ ] Implement cloud storage (AWS S3, Cloudinary)
- [ ] Add bulk avatar upload for admin users
- [ ] Implement avatar versioning
- [ ] Add advanced image filters
- [ ] Add avatar approval workflow
- [ ] Implement WebP conversion for better compression
