# Toast Migration Guide

This document helps developers migrate from various toast implementations to react-hot-toast.

## Migration Status - COMPLETED ✅

All toast implementations have been successfully migrated to react-hot-toast:

**COMPLETED ✅**
- `components/client-layout.tsx` - Replaced Sonner toaster with react-hot-toast ToasterProvider
- `components/ToasterProvider.tsx` - Enhanced with bottom-right positioning, 4-second duration, and theme-aware styling
- `lib/services/toast-service.ts` - Created centralized toast service with comprehensive API
- `hooks/use-app-toast.ts` - Created custom hook with automated API call handling
- `components/users/add-user-form.tsx` - Migrated to use handleApiCall for role fetching and user creation
- `components/users/user-families-section.tsx` - Migrated family management operations
- `components/users/delete-user-dialog.tsx` - Migrated user deletion with confirmation
- `components/users/edit-user-form.tsx` - Migrated user editing operations
- `components/settings/notification-settings.tsx` - Migrated notification settings
- `components/settings/integration-settings.tsx` - Migrated integration settings  
- `components/settings/security-settings.tsx` - Migrated security settings
- `components/settings/account-settings.tsx` - Migrated account settings
- `components/settings/appearance-settings.tsx` - Migrated appearance settings
- `app/(protected)/properties/page.tsx` - Migrated properties page toasts

🎉 **All toast notifications now use react-hot-toast positioned in the bottom-right corner!**

## Quick Migration Examples

### From Shadcn/ui toast:
```tsx
// Before
import { toast } from "@/components/ui/use-toast"

toast({
  title: "Success",
  description: "Operation completed successfully.",
})

toast({
  title: "Error", 
  description: "Something went wrong.",
  variant: "destructive",
})

// After
import { useAppToast } from "@/hooks/use-app-toast"

const toast = useAppToast()

toast.success("Operation completed successfully!")
toast.error("Something went wrong.")
```

### For API calls:
```tsx
// Before (manual handling)
const response = await fetch('/api/endpoint')
if (response.ok) {
  toast.success("Success!")
} else {
  toast.error("Failed!")
}

// After (automated handling)
await toast.handleApiCall(
  () => fetch('/api/endpoint'),
  {
    loadingMessage: "Processing...",
    successMessage: "Operation completed!",
    errorMessage: "Failed to complete operation"
  }
)
```

### Using toast.promise for complex operations:
```tsx
await toast.promise(
  fetch('/api/endpoint').then(res => res.json()),
  {
    loading: 'Saving...',
    success: (data) => `Saved ${data.name}!`,
    error: (err) => err?.message || 'Failed to save',
  }
)
```

## Available Methods

- `toast.success(message)` - Show success toast
- `toast.error(message)` - Show error toast  
- `toast.loading(message)` - Show loading toast (returns ID for dismissal)
- `toast.dismiss(id)` - Dismiss specific toast
- `toast.handleApiCall(apiFunction, options)` - Handle API calls with automatic loading/success/error states
- `toast.promise(promise, options)` - Wrap promises with toast states

## Configuration

The toaster is configured in `components/ToasterProvider.tsx` with:
- Position: bottom-right
- Duration: 4 seconds
- Theme-aware styling
- Custom success/error colors
