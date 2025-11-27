import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { evaluateCode, loadExerciseConfig } from '@/lib/code-eval/evaluator';
import { recordCodeSubmission, startLesson } from '@/lib/progress/queries';
import { tryCompletePhase } from '@/lib/progress/phase-gating';

/**
 * POST /api/code-eval
 * Evaluate user code submission
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, lessonId, exerciseId, phase } = body;

    if (!code || !lessonId || !exerciseId || !phase) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Mark lesson as started if not already
    await startLesson(session.userId, lessonId);

    // Evaluate the code
    const result = await evaluateCode(code, exerciseConfig);

    // Record the submission
    await recordCodeSubmission(
      session.userId,
      lessonId,
      code,
      {
        testResults: result.testResults,
        error: result.error,
      },
      result.passed,
      result.executionTimeMs
    );

    // If all tests passed, try to complete the phase
    if (result.passed) {
      await tryCompletePhase(session.userId, phase);
    }

    // Return only non-hidden test results to the client
    const visibleTestResults = result.testResults.filter((_, index) => {
      return !exerciseConfig.testCases[index]?.hidden;
    });

    return NextResponse.json({
      passed: result.passed,
      testResults: visibleTestResults,
      totalTests: result.testResults.length,
      passedTests: result.testResults.filter((r) => r.passed).length,
      executionTimeMs: result.executionTimeMs,
      error: result.error,
    });
  } catch (error: any) {
    console.error('Code evaluation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
