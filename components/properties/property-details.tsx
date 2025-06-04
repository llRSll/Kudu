"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, updateProperty } from "@/app/actions/properties";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppToast } from "@/hooks/use-app-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PropertyDetailsProps {
  property: Property;
}

// Define the validation schema for property details
const propertyDetailsSchema = z.object({
  squareFeet: z.preprocess(
    (val) => val === '' || val === null ? null : Number(val),
    z.union([
      z.number().positive("Square feet must be a positive number"),
      z.null()
    ])
  ).optional(),
  yearBuilt: z.preprocess(
    (val) => val === '' || val === null ? null : Number(val),
    z.union([
      z.number().int("Year must be a whole number").min(1800, "Year must be after 1800").max(new Date().getFullYear(), "Year cannot be in the future"),
      z.null()
    ])
  ).optional(),
  zoning: z.preprocess(
    (val) => val === '' ? null : String(val),
    z.union([z.string(), z.null()])
  ).optional(),
  parkingSpaces: z.preprocess(
    (val) => val === '' || val === null ? null : Number(val),
    z.union([
      z.number().int("Parking spaces must be a whole number").min(0, "Parking spaces cannot be negative"),
      z.null()
    ])
  ).optional(),
  bedrooms: z.preprocess(
    (val) => val === '' || val === null ? null : Number(val),
    z.union([
      z.number().int("Bedrooms must be a whole number").min(0, "Bedrooms cannot be negative"),
      z.null()
    ])
  ).optional(),
  bathrooms: z.preprocess(
    (val) => val === '' || val === null ? null : Number(val),
    z.union([
      z.number().min(0, "Bathrooms cannot be negative"),
      z.null()
    ])
  ).optional(),
  description: z.union([z.string(), z.null()]).optional(),
});

type PropertyFormValues = {
  squareFeet: number | null;
  yearBuilt: number | null;
  zoning: string | null;
  parkingSpaces: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
};

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useAppToast();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyDetailsSchema) as any, // Cast to 'any' to bypass TypeScript errors
    defaultValues: {
      squareFeet: property.area || null,
      yearBuilt: property.year_built || null,
      zoning: property.zoning ? String(property.zoning) : '',
      parkingSpaces: property.parking || null,
      bedrooms: property.bedrooms || null,
      bathrooms: property.bathrooms || null,
      description: property.description || '',
    },
    mode: "onBlur",
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;

  const handleCancel = () => {
    // Reset the form to its original values
    form.reset();
    setIsEditing(false);
  };

  const onSubmit = async (values: PropertyFormValues) => {
    try {
      // Log values for debugging
      console.log("Form values submitted:", values);
      
      // Map form values to the property model expected by the API
      const propertyToUpdate: Partial<Property> & { id: string } = {
        id: property.id,
        // Handle null values appropriately for number fields to match the Property type
        area: values.squareFeet === null ? undefined : values.squareFeet,
        year_built: values.yearBuilt === null ? undefined : values.yearBuilt,
        zoning: values.zoning === null ? undefined : String(values.zoning),
        parking: values.parkingSpaces === null ? undefined : values.parkingSpaces,
        bedrooms: values.bedrooms === null ? undefined : values.bedrooms,
        bathrooms: values.bathrooms === null ? undefined : values.bathrooms,
        description: values.description || undefined
      };

      // Use the handleApiCall method from useAppToast to handle loading/success/error states
      const result = await toast.handleApiCall(
        () => updateProperty(propertyToUpdate),
        {
          loadingMessage: "Updating property details...",
          successMessage: "Property details updated successfully",
          errorMessage: "Failed to update property details"
        }
      );
      
      if (result) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      // The toast error is already handled by handleApiCall
    }
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
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Save
                </>
              )}
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="squareFeet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Square Feet</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        type="number"
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value?.toLocaleString() || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yearBuilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Year Built</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        type="number"
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zoning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Zoning</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        {...field}
                        value={field.value || ''}
                        onChange={e => {
                          // Ensure we're always dealing with a string or null
                          const value = e.target.value === '' ? null : e.target.value;
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parkingSpaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Parking Spaces</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        type="number"
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Bedrooms</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        type="number"
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Bathrooms</FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input 
                        type="number"
                        {...field}
                        value={field.value === null ? '' : field.value}
                        onChange={e => {
                          const value = e.target.value === '' ? null : Number(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    ) : (
                      <div className="font-medium">{field.value || "N/A"}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">Description</FormLabel>
                <FormControl>
                  {isEditing ? (
                    <Textarea 
                      rows={5}
                      {...field}
                      value={field.value || ''}
                    />
                  ) : (
                    <div className="mt-1">{field.value || "N/A"}</div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
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
