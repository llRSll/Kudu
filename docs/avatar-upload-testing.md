# Avatar Upload System Testing Guide

## Overview
This guide provides comprehensive testing instructions for the avatar upload functionality implemented in the Kudu application.

## Testing Checklist

### 1. Basic Functionality Tests

#### Access the Settings Page
1. Navigate to `http://localhost:3002/settings`
2. Verify the account settings section loads correctly
3. Check that the current avatar (if any) is displayed
4. Confirm the "Change Avatar" button is visible and clickable

#### Avatar Upload Dialog
1. Click the "Change Avatar" button
2. Verify the upload dialog opens
3. Check for the following elements:
   - Drag and drop area
   - File input button ("Choose Image")
   - Cancel and Upload buttons
   - Image preview area

### 2. File Upload Tests

#### Valid File Upload
1. Select a valid image file (.jpg, .jpeg, .png, .gif, .webp)
2. Verify file preview appears correctly
3. Confirm upload button becomes enabled
4. Click upload and verify success message
5. Check that the new avatar appears in the settings

#### Invalid File Tests
Test these scenarios to verify proper validation:

1. **Invalid File Type**
   - Try uploading a .txt or .pdf file
   - Verify error message appears
   - Confirm upload button remains disabled

2. **File Too Large**
   - Try uploading an image larger than 5MB
   - Verify size validation error
   - Confirm upload is blocked

3. **Empty File**
   - Try submitting without selecting a file
   - Verify appropriate validation message

### 3. Drag and Drop Tests

1. Drag a valid image file over the drop zone
2. Verify visual feedback (highlight effect)
3. Drop the file and confirm it's processed
4. Test dragging invalid files to ensure proper rejection

### 4. Avatar Removal Tests

1. If an avatar is set, test the removal functionality
2. Verify confirmation dialog (if implemented)
3. Confirm avatar is removed from both UI and server
4. Check that old avatar file is cleaned up from the filesystem

### 5. Error Handling Tests

#### Network Error Simulation
1. Disconnect from internet or stop the server
2. Try uploading an avatar
3. Verify proper error handling and user feedback

#### Server Error Simulation
1. Temporarily rename the upload directory
2. Try uploading an avatar
3. Verify graceful error handling

### 6. Performance Tests

#### Large File Handling
1. Upload a large image (close to 5MB limit)
2. Verify compression works correctly
3. Check upload progress and loading states

#### Multiple Upload Attempts
1. Try uploading multiple files in succession
2. Verify each upload completes properly
3. Check for memory leaks or performance issues

### 7. Database Integration Tests

1. Upload an avatar and verify database record is updated
2. Check that the avatar URL is correctly stored
3. Verify avatar persists after page refresh
4. Test with different user accounts (if applicable)

## Expected Behavior

### Successful Upload Flow
1. User selects/drops valid image file
2. Image preview displays immediately
3. Upload button becomes enabled
4. Click upload → loading state shows
5. Success message appears
6. New avatar displays in settings
7. Old avatar file is automatically cleaned up

### File Validation
- **Accepted formats**: JPG, JPEG, PNG, GIF, WebP
- **Maximum size**: 5MB
- **Automatic compression**: Files > 1MB are compressed
- **Unique naming**: Each upload gets a UUID-based filename

### Error States
- Clear error messages for invalid files
- Network error handling with retry options
- Server error graceful degradation
- Validation feedback in real-time

## API Endpoints

### Upload Avatar
```
POST /api/upload/avatar
Content-Type: multipart/form-data
Body: FormData with 'avatar' file field
```

### Cleanup Avatars (Maintenance)
```
POST /api/cleanup/avatars
```

## File Structure

```
public/uploads/avatars/
├── .gitkeep
└── [uuid-filename].[ext] (uploaded avatars)
```

## Troubleshooting

### Common Issues

1. **Upload directory not writable**
   - Check permissions on `public/uploads/avatars/`
   - Ensure directory exists

2. **File not appearing after upload**
   - Check database connection
   - Verify avatar URL in database
   - Check file was actually saved to disk

3. **Large files failing**
   - Verify Next.js file size limits
   - Check server memory allocation
   - Ensure compression is working

4. **Drag and drop not working**
   - Test in different browsers
   - Check for JavaScript errors
   - Verify event handlers are attached

### Debug Information

Check the browser console and server logs for:
- File validation errors
- Network request failures
- Database operation errors
- File system permission issues

## Success Criteria

The avatar upload system is working correctly when:

✅ Valid images upload successfully  
✅ Invalid files are properly rejected  
✅ File compression works for large images  
✅ Drag and drop functionality works  
✅ Error messages are clear and helpful  
✅ Avatar updates reflect immediately in UI  
✅ Old avatar files are cleaned up automatically  
✅ Database records are updated correctly  
✅ System handles edge cases gracefully  

## Performance Benchmarks

- Upload time for 1MB image: < 3 seconds
- Compression time for 5MB image: < 5 seconds
- UI responsiveness: No blocking during upload
- Memory usage: No significant leaks after multiple uploads
