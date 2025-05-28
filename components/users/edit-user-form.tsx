"use client";

import { User } from "@/lib/actions/users"; // Assuming User type is exported from actions
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppToast } from "@/hooks/use-app-toast";
import { updateUser } from '@/lib/actions/users';
import { useState } from "react";

// Define Zod schema for validation (adjust as needed based on schema.ts)
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_initial: z.string().max(1, "Middle initial must be a single letter").optional().nullable(),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional().nullable(),
  dob: z.string().optional().nullable(), // Using string for input type=date, can refine later
  tax_file_number: z.string().optional().nullable(), // Add specific TFN validation if needed
  status: z.string(), // Add specific status validation if needed
  roleIds: z.array(z.string()), // Array of role IDs selected via checkboxes
  // Add other fields from schema.ts here for validation
});

interface EditUserFormProps {
  user: User;
  allRoles: {
    id: string;
    name?: string | null;
    description?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
  }[];
  currentUserRoleIds: string[];
}

// TODO: Fetch roles dynamically if needed
const statuses = ["ACTIVE", "PENDING", "INACTIVE"];

export default function EditUserForm({ user, allRoles, currentUserRoleIds }: EditUserFormProps) {
  const toast = useAppToast();
  
  // Add debug logging
  console.log('Debug - User:', user);
  console.log('Debug - All Roles:', allRoles);
  console.log('Debug - Current User Role IDs:', currentUserRoleIds);

  // Debug form initialization
  console.log('Debug - Initializing form with default values');
  
  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user.first_name || "",
      middle_initial: user.middle_initial || "",
      surname: user.surname || "",
      email: user.email,
      phone_number: user.phone_number || "",
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      tax_file_number: user.tax_file_number || "",
      status: user.status || "ACTIVE",
      roleIds: currentUserRoleIds || [],
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('Debug - Form submitted with data:', data);
    
    await toast.handleApiCall(
      () => updateUser(user.id, {
        ...data,
        roleIds: data.roleIds,
      }),
      {
        loadingMessage: "Updating user...",
        successMessage: "User details have been successfully updated.",
        errorMessage: "Failed to update user. Please try again."
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middle_initial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Initial</FormLabel>
              <FormControl>
                <Input placeholder="M" {...field} value={field.value ?? ''} maxLength={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="Enter surname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter phone number" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                {/* Basic date input, consider ShadCN date picker later */}
                <Input type="date" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tax_file_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax File Number (TFN)</FormLabel>
              <FormControl>
                <Input placeholder="Enter TFN" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                Handle TFN securely. This is sensitive information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4 mt-6">
          <FormLabel>User Roles</FormLabel>
          <FormDescription>
            Select all roles that apply to this user. Multiple roles can be assigned.
          </FormDescription>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {allRoles.map((role) => (
              <FormField
                key={role.id}
                control={form.control}
                name="roleIds"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value?.includes(role.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            field.onChange([...field.value, role.id]);
                          } else {
                            field.onChange(field.value?.filter((id) => id !== role.id));
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {role.name}
                      {role.description && (
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      )}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
        <Button type="submit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
