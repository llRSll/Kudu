"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { deleteUser } from "@/lib/actions/users"; // Server action
import { Loader2 } from "lucide-react";

interface DeleteUserDialogProps {
  userId: string;
  userName: string; // e.g., "John Doe"
  triggerButton: React.ReactNode;
}

export default function DeleteUserDialog({ userId, userName, triggerButton }: DeleteUserDialogProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); 
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmationInput !== userName) {
      toast.error("The entered name does not match. Please try again.");
      return;
    }

    const loadingToast = toast.loading("Deleting user...");
    try {
      const result = await deleteUser(userId);
      
      toast.dismiss(loadingToast);
      
      if (result?.success) {
        toast.success(`${userName} has been successfully deleted.`);
        setIsOpen(false);
        router.push("/users");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to delete user. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete user. Please try again.");
      console.error("Error deleting user:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmationInput(""); // Reset input when dialog closes
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {triggerButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{" "}
            <strong>{userName}</strong> and all associated data.
            <br />
            To confirm, please type the user&apos;s full name (<strong>{userName}</strong>) in the box below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2">
          <Label htmlFor="confirmationName">Confirm User Name</Label>
          <Input
            id="confirmationName"
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={userName}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <Button // Changed from AlertDialogAction to Button for more control over disabled state and loading
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmationInput !== userName}
          >
            Delete User
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
