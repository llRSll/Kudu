// Utility functions for image processing and validation

export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  MAX_DIMENSION: 2048, // Max width/height in pixels
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
    }
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    const maxSizeMB = IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`
    }
  }

  // Check file extension as additional validation
  const fileExtension = file.name.toLowerCase().split('.').pop()
  if (!fileExtension || !IMAGE_CONFIG.ALLOWED_EXTENSIONS.some(ext => ext.slice(1) === fileExtension)) {
    return {
      valid: false,
      error: 'Invalid file extension.'
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

export async function compressImage(file: File, maxWidth = 512, maxHeight = 512, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}
