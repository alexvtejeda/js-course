import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { endActivitySession } from '@/lib/progress/queries';

/**
 * POST /api/activity/end
 * End tracking an activity session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      );
    }

    await endActivitySession(sessionId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to end activity session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
