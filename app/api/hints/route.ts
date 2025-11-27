import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { loadExerciseConfig, getHint } from '@/lib/code-eval/evaluator';
import { recordHintUsage } from '@/lib/progress/queries';

/**
 * POST /api/hints
 * Get a hint for an exercise
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, exerciseId, phase, level } = body;

    if (!lessonId || !exerciseId || !phase || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (![1, 2, 3].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid hint level (must be 1, 2, or 3)' },
        { status: 400 }
      );
    }

    // Load exercise configuration
    const exerciseConfig = await loadExerciseConfig(phase, exerciseId);

    if (!exerciseConfig) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Get the hint
    const hint = getHint(exerciseConfig, level);

    if (!hint) {
      return NextResponse.json(
        { error: 'Hint not found' },
        { status: 404 }
      );
    }

    // Record hint usage
    await recordHintUsage(session.userId, lessonId, level);

    return NextResponse.json({
      hint: hint.content,
      level: hint.level,
    });
  } catch (error: any) {
    console.error('Hint request error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
