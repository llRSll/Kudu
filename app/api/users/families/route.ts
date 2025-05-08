import { NextRequest, NextResponse } from 'next/server';
import { addUserToFamily, removeUserFromFamily } from '@/lib/actions/families';

// POST /api/users/families - Add a user to a family
export async function POST(request: NextRequest) {
  try {
    const { userId, familyId, familyRoleId } = await request.json();
    
    if (!userId || !familyId) {
      return NextResponse.json(
        { message: "Missing required fields: userId and familyId are required" },
        { status: 400 }
      );
    }
    
    const result = await addUserToFamily(userId, familyId, familyRoleId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding user to family:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to add user to family" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/families - Remove a user from a family
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    
    if (!userId || !familyId) {
      return NextResponse.json(
        { message: "Missing required parameters: userId and familyId are required" },
        { status: 400 }
      );
    }
    
    await removeUserFromFamily(userId, familyId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing user from family:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to remove user from family" },
      { status: 500 }
    );
  }
}
