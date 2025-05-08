"use client";

import { Button } from "@/components/ui/button";
import DeleteUserDialog from "@/components/users/delete-user-dialog";

interface UserDeletionSectionProps {
  userId: string;
  userName: string;
}

export default function UserDeletionSection({ userId, userName }: UserDeletionSectionProps) {
  return (
    <DeleteUserDialog
      userId={userId}
      userName={userName}
      triggerButton={
        <Button variant="destructive">
          Delete User
        </Button>
      }
    />
  );
}
