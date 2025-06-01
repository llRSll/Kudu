"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, updateProperty } from "@/app/actions/properties";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['squareFeet', 'yearBuilt', 'parkingSpaces', 'bedrooms', 'bathrooms'].includes(name)) {
      setEditedProperty(prev => ({
        ...prev,
        [name]: value ? Number(value) : null
      }));
    } else {
      setEditedProperty(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Map to the API property model
      const propertyToUpdate = {
        id: property.id,
        area: editedProperty.squareFeet,
        year_built: editedProperty.yearBuilt,
        zoning: editedProperty.zoning,
        parking: editedProperty.parkingSpaces,
        bedrooms: editedProperty.bedrooms,
        bathrooms: editedProperty.bathrooms,
        description: editedProperty.description
      };
      
      const updatedProperty = await updateProperty(propertyToUpdate);
      if (updatedProperty) {
        toast.success("Property details updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update property details");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProperty(property);
    setIsEditing(false);
  };

  // Map property fields to display format
  const displayProperty = {
    squareFeet: property.area,
    yearBuilt: property.year_built,
    zoning: property.zoning,
    parkingSpaces: property.parking,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    description: property.description
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Property Details</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Square Feet</div>
          {isEditing ? (
            <Input 
              type="number" 
              name="squareFeet"
              value={editedProperty.squareFeet || ''}
              onChange={handleChange}
              className="mt-1"
            />
          ) : (
            <div className="font-medium">{displayProperty.squareFeet?.toLocaleString() || "N/A"}</div>
          )}
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground">Year Built</div>
          {isEditing ? (
            <Input 
              type="number" 
              name="yearBuilt"
              value={editedProperty.yearBuilt || ''}
              onChange={handleChange}
              className="mt-1"
            />
          ) : (
            <div className="font-medium">{displayProperty.yearBuilt || "N/A"}</div>
          )}
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground">Zoning</div>
          {isEditing ? (
            <Input 
              name="zoning"
              value={editedProperty.zoning || ''}
              onChange={handleChange}
              className="mt-1"
            />
          ) : (
            <div className="font-medium">{displayProperty.zoning || "N/A"}</div>
          )}
        </div>
        
        <div>
          <div className="text-sm text-muted-foreground">Parking Spaces</div>
          {isEditing ? (
            <Input 
              type="number" 
              name="parkingSpaces"
              value={editedProperty.parkingSpaces || ''}
              onChange={handleChange}
              className="mt-1"
            />
          ) : (
            <div className="font-medium">{displayProperty.parkingSpaces || "N/A"}</div>
          )}
        </div>
        
        {(displayProperty.bedrooms !== undefined || isEditing) && (
          <div>
            <div className="text-sm text-muted-foreground">Bedrooms</div>
            {isEditing ? (
              <Input 
                type="number" 
                name="bedrooms"
                value={editedProperty.bedrooms || ''}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <div className="font-medium">{displayProperty.bedrooms}</div>
            )}
          </div>
        )}
        
        {(displayProperty.bathrooms !== undefined || isEditing) && (
          <div>
            <div className="text-sm text-muted-foreground">Bathrooms</div>
            {isEditing ? (
              <Input 
                type="number" 
                name="bathrooms"
                value={editedProperty.bathrooms || ''}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <div className="font-medium">{displayProperty.bathrooms}</div>
            )}
          </div>
        )}
      </div>
      
      {(displayProperty.description || isEditing) && (
        <div className="mt-4">
          <div className="text-sm text-muted-foreground">Description</div>
          {isEditing ? (
            <Textarea 
              name="description"
              value={editedProperty.description || ''}
              onChange={handleChange}
              rows={5}
              className="mt-1"
            />
          ) : (
            <div className="mt-1">{displayProperty.description}</div>
          )}
        </div>
      )}
      
      {property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Amenities</div>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity: string, index: number) => (
              <Badge key={index} variant="outline">{amenity}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
