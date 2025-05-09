import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/client';
import { Roles } from '@/lib/drizzle/schema';

export async function GET(request: Request) {
  console.log('[API /roles] Received GET request');
  try {
    const roles = await db.select({
      id: Roles.id,
      name: Roles.name,
    }).from(Roles);

    if (!roles || roles.length === 0) {
      console.log('[API /roles] No roles found in the database.');
      return NextResponse.json({ roles: [] }); 
    }

    console.log(`[API /roles] Successfully fetched ${roles.length} roles.`);
    return NextResponse.json({ roles });

  } catch (error: any) {
    console.error('[API /roles] Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles', details: error.message },
      { status: 500 }
    );
  }
}