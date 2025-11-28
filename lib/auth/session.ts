import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

const SESSION_COOKIE_NAME = 'js-playground-session';
const ACCOUNTS_COOKIE_NAME = 'js-playground-accounts';
const THEME_COOKIE_NAME = 'js-playground-theme';
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
    secure: false, // Disabled for Docker/localhost development
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

  console.log('[Session] Cookie value:', userId ? 'Found' : 'Not found');

  if (!userId) {
    console.log('[Session] No userId in cookie');
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

  console.log('[Session] User lookup result:', user ? 'Found user' : 'User not found', 'for userId:', userId);

  if (!user) {
    // Invalid session, clear cookie
    console.log('[Session] Clearing invalid session');
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

/**
 * Get all stored account IDs from cookies
 */
export async function getStoredAccountIds(): Promise<string[]> {
  const cookieStore = await cookies();
  const accountsCookie = cookieStore.get(ACCOUNTS_COOKIE_NAME)?.value;

  if (!accountsCookie) {
    return [];
  }

  try {
    return JSON.parse(accountsCookie);
  } catch {
    return [];
  }
}

/**
 * Get all stored accounts with user details
 */
export async function getStoredAccounts(): Promise<SessionUser[]> {
  const accountIds = await getStoredAccountIds();

  if (accountIds.length === 0) {
    return [];
  }

  const accounts = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(inArray(users.id, accountIds));

  return accounts;
}

/**
 * Add an account to the stored accounts list
 */
export async function addStoredAccount(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const accountIds = await getStoredAccountIds();

  if (!accountIds.includes(userId)) {
    accountIds.push(userId);
    cookieStore.set(ACCOUNTS_COOKIE_NAME, JSON.stringify(accountIds), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
  }
}

/**
 * Switch to a different stored account
 */
export async function switchAccount(userId: string): Promise<boolean> {
  const accountIds = await getStoredAccountIds();

  if (!accountIds.includes(userId)) {
    return false;
  }

  await createSession(userId);
  return true;
}

/**
 * Get the stored theme preference from cookies
 */
export async function getThemePreference(): Promise<'light' | 'dark'> {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return (theme === 'light' || theme === 'dark') ? theme : 'dark';
}

/**
 * Set the theme preference in cookies
 */
export async function setThemePreference(theme: 'light' | 'dark'): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    httpOnly: false, // Allow JavaScript access for client-side sync
    secure: false,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}
