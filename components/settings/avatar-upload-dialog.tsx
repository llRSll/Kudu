"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X, Camera } from "lucide-react"
import { validateImageFile, createImagePreview, compressImage } from "@/lib/utils/image-utils"
import { useAppToast } from "@/hooks/use-app-toast"

interface AvatarUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File | Blob, originalFileName: string) => Promise<void>
  currentAvatarUrl?: string | null
  userInitials: string
  isUploading: boolean
}

export function AvatarUploadDialog({
  isOpen,
  onClose,
  onUpload,
  currentAvatarUrl,
  userInitials,
  isUploading
}: AvatarUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const toast = useAppToast()

  const handleFileSelect = async (file: File) => {
    // Validate the file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error!)
      return
    }

    setSelectedFile(file)
    
    try {
      const preview = await createImagePreview(file)
      setPreviewUrl(preview)
    } catch (error) {
      toast.error("Failed to create image preview")
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Compress the image if it's large
      let fileToUpload: File | Blob = selectedFile
      if (selectedFile.size > 1024 * 1024) { // If larger than 1MB, compress
        fileToUpload = await compressImage(selectedFile, 512, 512, 0.8)
      }

      await onUpload(fileToUpload, selectedFile.name)
      handleClose()
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsDragOver(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription>
            Upload a new profile photo. Supported formats: JPEG, PNG, WebP, GIF (max 5MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Avatar Preview */}
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border border-primary/10">
              <AvatarImage 
                src={previewUrl || currentAvatarUrl || "/placeholder.svg?height=96&width=96"} 
                alt="Profile photo" 
              />
              <AvatarFallback className="bg-primary/5 text-primary text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* File Upload Area */}
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {selectedFile ? (
                  <Camera className="h-8 w-8 text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium mb-1">
                {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, GIF up to 5MB
              </p>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </Card>

          {/* File Info */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
