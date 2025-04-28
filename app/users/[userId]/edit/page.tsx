import { getUserById, getRoles, getUserRoles } from '@/lib/actions/users';
import { getFamilies, getFamiliesForUser, getFamilyRoles } from '@/lib/actions/families';
import { notFound } from 'next/navigation';
import EditUserForm from '@/components/users/edit-user-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserFamiliesSection from '@/components/users/user-families-section';

interface EditUserPageProps {
  params: {
    userId: string;
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const userId = params.userId;

  // Fetch user, roles, and family data in parallel
  const [user, allRoles, currentUserRoleIds, allFamilies, userFamilies, familyRoles] = await Promise.all([
    getUserById(userId),
    getRoles(),
    getUserRoles(userId),
    getFamilies(),
    getFamiliesForUser(userId),
    getFamilyRoles()
  ]);

  if (!user) {
    notFound(); // Show a 404 page if the user doesn't exist
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/users" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Users</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Edit User Profile</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Update the details for {user.first_name} {user.surname}.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass role data to the form */}
          <EditUserForm 
            user={user} 
            allRoles={allRoles} 
            currentUserRoleIds={currentUserRoleIds} 
          />
        </CardContent>
      </Card>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Family Management</CardTitle>
          <CardDescription>Manage family memberships and roles for this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserFamiliesSection 
            userId={userId}
            userFamilies={userFamilies}
            allFamilies={allFamilies}
            familyRoles={familyRoles}
          />
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>View effective permissions for this user based on assigned roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Permissions management will be implemented in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
