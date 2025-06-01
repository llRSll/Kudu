"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react";
import { PropertyImage, uploadPropertyImage, deletePropertyImage, setPrimaryPropertyImage } from "@/app/actions/properties";
import { toast } from "sonner";

interface PropertyImagesProps {
  propertyId: string;
  images: PropertyImage[];
}

export function PropertyImages({ propertyId, images }: PropertyImagesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const primaryImage = images.find(img => img.is_primary) || images[0];
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadPropertyImage(propertyId, file);
      if (result) {
        toast.success("Image uploaded successfully");
        // Refresh page to show new image
        window.location.reload();
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (image: PropertyImage) => {
    if (images.length <= 1) {
      toast.error("Cannot delete the only image");
      return;
    }

    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const success = await deletePropertyImage(image.id, image.file_name, propertyId);
        if (success) {
          toast.success("Image deleted successfully");
          // If we're deleting the current image in the carousel, adjust the index
          if (currentImageIndex >= images.length - 1) {
            setCurrentImageIndex(images.length - 2);
          }
          // Refresh page to update images
          window.location.reload();
        } else {
          toast.error("Failed to delete image");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while deleting");
      }
    }
  };

  const handleSetPrimary = async (image: PropertyImage) => {
    try {
      const success = await setPrimaryPropertyImage(image.id, propertyId);
      if (success) {
        toast.success("Primary image updated");
        // Refresh page to update images
        window.location.reload();
      } else {
        toast.error("Failed to update primary image");
      }
    } catch (error) {
      console.error("Set primary error:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-t-lg">
      {/* Main image display */}
      {primaryImage ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer h-full w-full">
              <img 
                src={primaryImage.url} 
                alt="Property" 
                className="h-full w-full object-cover"
              />
            </div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-3xl">
            <div className="relative flex flex-col items-center">
              <div className="relative h-[60vh] w-full">
                {images.length > 0 && (
                  <img
                    src={images[currentImageIndex].url}
                    alt={`Property image ${currentImageIndex + 1}`}
                    className="h-full w-full object-contain"
                  />
                )}
                
                {/* Navigation controls */}
                {images.length > 1 && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={handlePrevImage}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={handleNextImage}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Thumbnail navigation */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {images.map((image, idx) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className={`h-16 w-16 object-cover cursor-pointer ${
                        idx === currentImageIndex ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(image);
                        }}
                      >
                        ★
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="h-full w-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No image available</p>
        </div>
      )}
      
      {/* Image upload button */}
      <div className="absolute right-3 bottom-3">
        <div className="relative">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
