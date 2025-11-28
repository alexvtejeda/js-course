import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { startActivitySession } from '@/lib/progress/queries';

/**
 * POST /api/activity/start
 * Start tracking an activity session
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, phaseId, activityType } = body;

    if (!activityType) {
      return NextResponse.json(
        { error: 'Missing activityType' },
        { status: 400 }
      );
    }

    const sessionId = await startActivitySession(
      session.id,
      activityType,
      lessonId || undefined,
      phaseId || undefined
    );

    return NextResponse.json({ sessionId });
  } catch (error: any) {
    console.error('Failed to start activity session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
