import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'js-playground-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface SessionUser {
  id: string;
  name: string;
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the current session user
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    // Invalid session, clear cookie
    await clearSession();
    return null;
  }

  // Update last active timestamp
  await db
    .update(users)
    .set({ lastActiveAt: new Date() })
    .where(eq(users.id, userId));

  return user;
}

/**
 * Clear the current session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication - throws if no session
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
}
