'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, Edit, User, Users, Home } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FamilyRole {
  id: string;
  name: string;
  description?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

interface Family {
  id: string;
  name?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

interface UserFamily {
  family: Family;
  familyRole?: FamilyRole | undefined;
}

interface UserFamiliesSectionProps {
  userId: string;
  userFamilies: UserFamily[];
  allFamilies: Family[];
  familyRoles: FamilyRole[];
}

export default function UserFamiliesSection({
  userId,
  userFamilies,
  allFamilies,
  familyRoles,
}: UserFamiliesSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [selectedFamilyRole, setSelectedFamilyRole] = useState<string>('');
  const [familyToUpdate, setFamilyToUpdate] = useState<{
    familyId: string;
    familyName: string;
    familyRoleId?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter families that the user is not already a member of
  const availableFamilies = allFamilies.filter(
    family => !userFamilies.some(uf => uf.family.id === family.id)
  );

  const handleAddToFamily = async () => {
    if (!selectedFamily) {
      toast({
        title: "Error",
        description: "Please select a family.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Replace empty or "none" value with null for the role ID
      const roleId = selectedFamilyRole === 'none' ? null : selectedFamilyRole || null;
      
      // Call the addUserToFamily server action via fetch
      const response = await fetch('/api/users/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          familyId: selectedFamily,
          familyRoleId: roleId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add user to family");
      }
      
      toast({
        title: "Success",
        description: "User added to family successfully.",
      });
      
      // Reset form and close dialog
      setSelectedFamily('');
      setSelectedFamilyRole('');
      setIsAddDialogOpen(false);
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user to family.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFamilyRole = async () => {
    if (!familyToUpdate) return;

    setIsLoading(true);
    try {
      // Replace empty or "none" value with null for the role ID
      const roleId = selectedFamilyRole === 'none' ? null : selectedFamilyRole || null;
      
      // Call the updateFamilyMemberRole server action via fetch
      const response = await fetch('/api/users/families/role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          familyId: familyToUpdate.familyId,
          familyRoleId: roleId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update family role");
      }
      
      toast({
        title: "Success",
        description: "Family role updated successfully.",
      });
      
      // Reset form and close dialog
      setFamilyToUpdate(null);
      setSelectedFamilyRole('');
      setIsUpdateDialogOpen(false);
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update family role.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFamily = async (familyId: string) => {
    if (!confirm("Are you sure you want to remove this user from the family?")) {
      return;
    }

    try {
      // Call the removeUserFromFamily server action via fetch
      const response = await fetch(`/api/users/families?userId=${userId}&familyId=${familyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove user from family");
      }
      
      toast({
        title: "Success",
        description: "User removed from family.",
      });
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove user from family.",
        variant: "destructive",
      });
    }
  };

  const openUpdateDialog = (family: UserFamily) => {
    setFamilyToUpdate({
      familyId: family.family.id,
      familyName: family.family.name || 'Unknown Family',
      familyRoleId: family.familyRole?.id,
    });
    setSelectedFamilyRole(family.familyRole?.id || 'none');
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {userFamilies.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg">
          <Users className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Family Memberships</h3>
          <p className="text-sm text-muted-foreground mt-1">
            This user is not currently a member of any families.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {userFamilies.map((userFamily) => (
            <Card key={userFamily.family.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{userFamily.family.name}</h4>
                      {userFamily.familyRole && (
                        <Badge variant="outline" className="mt-1">
                          {userFamily.familyRole.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openUpdateDialog(userFamily)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Role</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFromFamily(userFamily.family.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove from Family</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add to Family Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add to Family
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Family</DialogTitle>
            <DialogDescription>
              Add this user to a family and assign a role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="family">Family</Label>
              <Select
                value={selectedFamily}
                onValueChange={setSelectedFamily}
              >
                <SelectTrigger id="family">
                  <SelectValue placeholder="Select a family" />
                </SelectTrigger>
                <SelectContent>
                  {availableFamilies.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No available families
                    </SelectItem>
                  ) : (
                    availableFamilies.map((family) => (
                      <SelectItem key={family.id} value={family.id}>
                        {family.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role (Optional)</Label>
              <Select
                value={selectedFamilyRole}
                onValueChange={setSelectedFamilyRole}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific role</SelectItem>
                  {familyRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}{role.description ? ` - ${role.description}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToFamily} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add to Family"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Family Role Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Family Role</DialogTitle>
            <DialogDescription>
              Update the role for this user in {familyToUpdate?.familyName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="update-role">Role</Label>
              <Select
                value={selectedFamilyRole}
                onValueChange={setSelectedFamilyRole}
              >
                <SelectTrigger id="update-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific role</SelectItem>
                  {familyRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}{role.description ? ` - ${role.description}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFamilyRole} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
