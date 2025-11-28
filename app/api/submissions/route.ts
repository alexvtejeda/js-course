import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getRecentSubmissions } from '@/lib/progress/queries';

/**
 * GET /api/submissions?lessonId=xxx
 * Get the most recent successful code submission for a lesson
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Missing lessonId parameter' },
        { status: 400 }
      );
    }

    // Get the most recent submission (whether passed or not)
    const submissions = await getRecentSubmissions(session.id, lessonId, 1);

    if (submissions.length === 0) {
      return NextResponse.json({ code: null });
    }

    const latestSubmission = submissions[0];

    return NextResponse.json({
      code: latestSubmission.code,
      submittedAt: latestSubmission.submittedAt,
      passed: latestSubmission.passed,
    });
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
