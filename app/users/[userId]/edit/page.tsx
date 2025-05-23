import { getUserById, getRoles, getUserRoles } from '@/lib/actions/users';
import { getFamilies, getFamiliesForUser, getFamilyRoles } from '@/lib/actions/families';
import { notFound } from 'next/navigation';
import EditUserForm from '@/components/users/edit-user-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UserFamiliesSection from '@/components/users/user-families-section';
import UserDeletionSection from '@/components/users/user-deletion-section';
import { Metadata } from 'next';

interface EditUserPageProps {
  params: {
    userId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// This forces Next.js to treat the page as dynamic
export async function generateMetadata(
  { params, searchParams }: EditUserPageProps
): Promise<Metadata> {
  return {
    title: 'Edit User',
  };
}

export default async function EditUserPage({ params, searchParams }: EditUserPageProps) {
  try {
    // Access searchParams first to ensure dynamic behavior
    const _dynamic = searchParams;
    
    // In Next.js 15, we need to await params before accessing its properties
    const awaitedParams = await params;
    const userId = awaitedParams.userId;
    
    // Now use the extracted userId
    const user = await getUserById(userId);
    
    if (!user) {
      notFound(); // Show a 404 page if the user doesn't exist or userId was invalid
    }

    // Fetch all data in parallel using the extracted userId
    const [allRoles, currentUserRoleIds, allFamilies, userFamilies, familyRoles] = await Promise.all([
      getRoles(),
      getUserRoles(userId),
      getFamilies(),
      getFamiliesForUser(userId).catch(err => {
        console.error(`Error fetching user families: ${err.message}`);
        return []; // Return empty array on error
      }),
      getFamilyRoles().catch(err => {
        console.error(`Error fetching family roles: ${err.message}`);
        return []; // Return empty array on error
      })
    ]);

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

        <Card className="max-w-4xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Proceed with caution. Actions in this section are destructive and may not be reversible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Delete This User</h3>
              <p className="text-sm text-muted-foreground">
                Once you delete a user, there is no going back. Please be certain.
              </p>
            </div>
            <UserDeletionSection 
              userId={userId} 
              userName={`${user.first_name} ${user.surname}`} 
            />
          </CardContent>
        </Card>

      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      notFound();
    }
    throw error; 
  }
}
