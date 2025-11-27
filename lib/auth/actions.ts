'use server';

import { db } from '@/lib/db';
import { users, userPhaseProgress, phases } from '@/lib/db/schema';
import { createSession, addStoredAccount, switchAccount } from './session';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function setupUser(name: string) {
  if (!name || name.trim().length === 0) {
    return { error: 'Please enter your name' };
  }

  try {
    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.name, name.trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: 'This name is already taken. Please choose a different name.' };
    }

    // Create the user
    const [user] = await db
      .insert(users)
      .values({
        name: name.trim(),
      })
      .returning();

    // Initialize phase progress - Phase 1 is unlocked by default
    const allPhases = await db.select().from(phases).orderBy(phases.phaseNumber);

    for (const phase of allPhases) {
      await db.insert(userPhaseProgress).values({
        userId: user.id,
        phaseId: phase.id,
        status: phase.phaseNumber === 1 ? 'unlocked' : 'locked',
      });
    }

    // Create session and add to stored accounts
    await createSession(user.id);
    await addStoredAccount(user.id);
  } catch (error) {
    // Don't catch redirect errors - they're expected behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error setting up user:', error);
    return { error: 'Failed to create account. Please try again.' };
  }

  // Redirect to dashboard (outside try-catch to let redirect throw properly)
  redirect('/dashboard');
}

export async function loginToAccount(userId: string) {
  try {
    const success = await switchAccount(userId);

    if (!success) {
      return { error: 'Account not found' };
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error switching account:', error);
    return { error: 'Failed to switch account. Please try again.' };
  }

  redirect('/dashboard');
}
