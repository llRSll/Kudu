import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle/client';
import { Users, Roles, UserRoles } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

type DbUserType = typeof Users.$inferSelect;

export async function POST(request: Request) {
  console.log('[API /users/create] Received POST request');
  try {
    // Destructure roleId from the request body
    const { email, password, firstName, lastName, middleInitial, roleId } = await request.json();
    console.log('[API /users/create] Request body:', { email, firstName, lastName, middleInitial, roleId });

    // Validate roleId
    if (!roleId || typeof roleId !== 'string') {
      console.error('[API /users/create] Missing or invalid roleId.');
      return NextResponse.json({ error: 'Role ID is required and must be a string.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[API /users/create] Supabase URL or Service Role Key is missing.');
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials missing.' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('[API /users/create] Attempting to create user in Supabase Auth...');
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, 
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (authError) {
      console.error('[API /users/create] Supabase Auth error:', authError);
      if ((authError as any).code === 'email_exists') {
        return NextResponse.json({ error: 'A user with this email address has already been registered.' }, { status: 409 });
      } 
      return NextResponse.json(
        { error: authError.message || 'Failed to authenticate or create user.' },
        { status: 400 } 
      );
    }

    if (!authUser || !authUser.user) {
        console.error('[API /users/create] Supabase Auth user creation failed to return a user object.');
        return NextResponse.json({ error: 'User creation failed in authentication provider.' }, { status: 500 });
    }
    
    console.log('[API /users/create] Supabase Auth user created successfully:', authUser.user.id);
    console.log('[API /users/create] Attempting to create user in local DB and assign selected role...');

    let nameParts = [];
    if (firstName) nameParts.push(firstName.trim());
    if (middleInitial && middleInitial.trim()) nameParts.push(middleInitial.trim());
    if (lastName) nameParts.push(lastName.trim());
    const calculatedFullName = nameParts.join(' ');

    let createdDbUser: DbUserType | undefined;

    // Fetch the role name based on roleId to store in Users.role
    const roleDetailsResult = await db.select({ name: Roles.name }).from(Roles).where(eq(Roles.id, roleId)).limit(1);
    if (roleDetailsResult.length === 0) {
      console.error(`[API /users/create] Invalid roleId '${roleId}' provided. Role not found.`);
      // Optional: Rollback Supabase user if role is critical
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      console.log(`[API /users/create] Rolled back Supabase Auth user due to invalid roleId: ${authUser.user.id}`);
      return NextResponse.json({ error: 'Invalid Role ID provided.' }, { status: 400 });
    }
    const selectedRoleName = roleDetailsResult[0].name;
    console.log(`[API /users/create] Selected role: '${selectedRoleName}' (ID: ${roleId})`);

    await db.transaction(async (tx) => {
      const insertedUsers = await tx.insert(Users).values({
        id: authUser.user.id,
        email: authUser.user.email!,
        first_name: firstName,
        middle_initial: middleInitial || null, 
        surname: lastName,
        full_name: calculatedFullName,
        role: selectedRoleName, // Use the fetched role name
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();

      if (insertedUsers.length > 0) {
        createdDbUser = insertedUsers[0];
        console.log('[API /users/create] Local DB user record created:', createdDbUser.id);

        await tx.insert(UserRoles).values({
          user_id: createdDbUser.id, 
          role_id: roleId, // Use the roleId from the request
          assigned_at: new Date(),
        });
        console.log(`[API /users/create] Assigned selected role to user in UserRoles table.`);
      } else {
        // This case should ideally not happen if the insert was supposed to occur.
        console.error('[API /users/create] User insert transaction returned no user.');
        // Transaction will rollback automatically if an error is thrown here.
        throw new Error('Failed to retrieve created user from database after insert.');
      }
    });

    if (!createdDbUser) {
        console.error('[API /users/create] Failed to create user record in local database (createdDbUser is undefined post-transaction).');
        // Supabase user might have been created if transaction failed internally *after* authUser creation but *before* roleId check or during TX.
        // The roleId check already rolls back, so this path implies TX failure.
        if (authUser && authUser.user) { 
          // Consider if rollback is appropriate here or if an earlier step should have caught it
          // If roleId was valid, but TX failed, then Supabase user exists without DB counterpart.
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
          console.log(`[API /users/create] Rolled back Supabase Auth user due to transaction failure: ${authUser.user.id}`);
        } else {
          console.warn('[API /users/create] Cannot roll back Supabase Auth user post-transaction: authUser.user is unexpectedly null.');
        }
        return NextResponse.json({ error: 'Failed to complete user creation in local database.' }, { status: 500 });
    }

    console.log('[API /users/create] User creation process complete for:', createdDbUser.id);
    return NextResponse.json({ user: createdDbUser });

  } catch (error: any) {
    console.error('[API /users/create] General error in POST handler:', error);
    // Attempt to get Supabase Auth user ID if available in this scope for potential rollback
    // This part is tricky as authUser might not be defined if error happened before its creation
    // For simplicity, we're currently only rolling back on specific, known pre-DB-commit failures.

    if (error.code === '23505' && error.constraint === 'users_email_key') {
        return NextResponse.json({ error: 'This email address is already registered.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
