'use server';

import { db } from '@/lib/db';
import { users, userPhaseProgress, phases } from '@/lib/db/schema';
import { createSession } from './session';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

export async function setupUser(name: string) {
  if (!name || name.trim().length === 0) {
    return { error: 'Please enter your name' };
  }

  try {
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

    // Create session
    await createSession(user.id);
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
