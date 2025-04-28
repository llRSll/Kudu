"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createUser } from "@/lib/actions/users";

interface AddUserFormProps {
  setOpen: (open: boolean) => void; // Function to close the dialog
}

// Assuming these roles and statuses are relevant
const roles = ["ADMIN", "PROPERTY_MANAGER", "INVESTMENT_ADVISOR", "FINANCIAL_ADVISOR", "FAMILY_MEMBER", "LEGAL_ADVISOR", "TAX_ADVISOR", "USER", "VIEWER", "EDITOR"];
const statuses = ["ACTIVE", "PENDING", "INACTIVE"];

export function AddUserForm({ setOpen }: AddUserFormProps) {
  const { toast } = useToast();

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New User</DialogTitle>
        <DialogDescription>
          Enter the details for the new user. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      {/* Use the action prop, but wrap in a client function for feedback */}
      <form action={async (formData) => {
        try {
          await createUser(formData);
          toast({
            title: "Success",
            description: "User created successfully.",
          });
          setOpen(false); // Close dialog on success
        } catch (error) {
          console.error("Form Action Error:", error);
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Could not create user.",
            variant: "destructive",
          });
          // Keep dialog open on error
        }
      }}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input id="first_name" name="first_name" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surname" className="text-right">
              Surname
            </Label>
            <Input id="surname" name="surname" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" name="email" type="email" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select name="role" required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select name="status" required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel {/* TODO: Add back disabled state if needed later */}
          </Button>
          <Button type="submit">
            Save User {/* TODO: Add back loading state if needed later */}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
