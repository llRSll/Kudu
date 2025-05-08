import { NextRequest, NextResponse } from 'next/server';
import { updateFamilyMemberRole } from '@/lib/actions/families';

// PUT /api/users/families/role - Update a user's role within a family
export async function PUT(request: NextRequest) {
  try {
    const { userId, familyId, familyRoleId } = await request.json();
    
    if (!userId || !familyId) {
      return NextResponse.json(
        { message: "Missing required fields: userId and familyId are required" },
        { status: 400 }
      );
    }
    
    // familyRoleId can be null to remove a role
    const result = await updateFamilyMemberRole(userId, familyId, familyRoleId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating family member role:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to update family member role" },
      { status: 500 }
    );
  }
}
