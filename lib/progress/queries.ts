import { db } from '../db';
import {
  userLessonProgress,
  lessons,
  codeSubmissions,
  hintUsage,
  activitySessions,
} from '../db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Progress tracking queries for lessons and exercises
 */

export interface LessonProgress {
  lessonId: string;
  status: string;
  startedAt: Date | null;
  completedAt: Date | null;
  timeSpentSeconds: number;
  attempts: number;
  hintsUsed: number;
}

/**
 * Get or create lesson progress
 */
export async function getOrCreateLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress> {
  let progress = await db.query.userLessonProgress.findFirst({
    where: and(
      eq(userLessonProgress.userId, userId),
      eq(userLessonProgress.lessonId, lessonId)
    ),
  });

  if (!progress) {
    const [newProgress] = await db
      .insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        status: 'not_started',
        timeSpentSeconds: 0,
        attempts: 0,
        hintsUsed: 0,
      })
      .returning();

    progress = newProgress;
  }

  return {
    lessonId: progress.lessonId,
    status: progress.status,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    timeSpentSeconds: progress.timeSpentSeconds || 0,
    attempts: progress.attempts || 0,
    hintsUsed: progress.hintsUsed || 0,
  };
}

/**
 * Update lesson progress status
 */
export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  updates: {
    status?: string;
    timeSpentSeconds?: number;
    attempts?: number;
    hintsUsed?: number;
  }
) {
  const updateData: any = { ...updates };

  if (updates.status === 'in_progress' && !updateData.startedAt) {
    updateData.startedAt = new Date();
  }

  if (updates.status === 'completed' && !updateData.completedAt) {
    updateData.completedAt = new Date();
  }

  await db
    .update(userLessonProgress)
    .set(updateData)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      )
    );
}

/**
 * Mark lesson as started
 */
export async function startLesson(userId: string, lessonId: string) {
  const progress = await getOrCreateLessonProgress(userId, lessonId);

  if (progress.status === 'not_started') {
    await updateLessonProgress(userId, lessonId, { status: 'in_progress' });
  }
}

/**
 * Mark lesson as completed
 */
export async function completeLesson(userId: string, lessonId: string) {
  await updateLessonProgress(userId, lessonId, { status: 'completed' });
}

/**
 * Record a code submission
 */
export async function recordCodeSubmission(
  userId: string,
  lessonId: string,
  code: string,
  result: any,
  passed: boolean,
  executionTimeMs?: number
) {
  await db.insert(codeSubmissions).values({
    userId,
    lessonId,
    code,
    result,
    passed,
    executionTimeMs,
  });

  // Update attempts count
  const progress = await getOrCreateLessonProgress(userId, lessonId);
  await updateLessonProgress(userId, lessonId, {
    attempts: progress.attempts + 1,
  });

  // If passed, mark lesson as completed
  if (passed) {
    await completeLesson(userId, lessonId);
  }
}

/**
 * Record hint usage
 */
export async function recordHintUsage(
  userId: string,
  lessonId: string,
  hintLevel: number
) {
  await db.insert(hintUsage).values({
    userId,
    lessonId,
    hintLevel,
  });

  // Update hints used count
  const progress = await getOrCreateLessonProgress(userId, lessonId);
  await updateLessonProgress(userId, lessonId, {
    hintsUsed: progress.hintsUsed + 1,
  });
}

/**
 * Get lesson with progress
 */
export async function getLessonWithProgress(userId: string, lessonId: string) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });

  if (!lesson) return null;

  const progress = await getOrCreateLessonProgress(userId, lessonId);

  return {
    ...lesson,
    progress,
  };
}

/**
 * Get all lessons for a phase with progress
 */
export async function getPhaseLessonsWithProgress(
  userId: string,
  phaseId: number
) {
  const phaseLessons = await db.query.lessons.findMany({
    where: eq(lessons.phaseId, phaseId),
    orderBy: lessons.lessonNumber,
  });

  const lessonsWithProgress = await Promise.all(
    phaseLessons.map(async (lesson) => {
      const progress = await getOrCreateLessonProgress(userId, lesson.id);
      return {
        ...lesson,
        progress,
      };
    })
  );

  return lessonsWithProgress;
}

/**
 * Get recent code submissions for a lesson
 */
export async function getRecentSubmissions(
  userId: string,
  lessonId: string,
  limit = 10
) {
  return await db.query.codeSubmissions.findMany({
    where: and(
      eq(codeSubmissions.userId, userId),
      eq(codeSubmissions.lessonId, lessonId)
    ),
    orderBy: desc(codeSubmissions.submittedAt),
    limit,
  });
}

/**
 * Start an activity session
 */
export async function startActivitySession(
  userId: string,
  activityType: string,
  lessonId?: string,
  phaseId?: number
) {
  const [session] = await db
    .insert(activitySessions)
    .values({
      userId,
      activityType,
      lessonId: lessonId || null,
      phaseId: phaseId || null,
      startedAt: new Date(),
    })
    .returning();

  return session.id;
}

/**
 * End an activity session
 */
export async function endActivitySession(sessionId: string) {
  const session = await db.query.activitySessions.findFirst({
    where: eq(activitySessions.id, sessionId),
  });

  if (!session || session.endedAt) return;

  const endTime = new Date();
  const durationSeconds = Math.floor(
    (endTime.getTime() - session.startedAt.getTime()) / 1000
  );

  await db
    .update(activitySessions)
    .set({
      endedAt: endTime,
      durationSeconds,
    })
    .where(eq(activitySessions.id, sessionId));

  // Update lesson time spent if applicable
  if (session.lessonId) {
    const progress = await getOrCreateLessonProgress(
      session.userId,
      session.lessonId
    );

    await updateLessonProgress(session.userId, session.lessonId, {
      timeSpentSeconds: progress.timeSpentSeconds + durationSeconds,
    });
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  // Total time spent
  const [timeResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${userLessonProgress.timeSpentSeconds}), 0)`,
    })
    .from(userLessonProgress)
    .where(eq(userLessonProgress.userId, userId));

  // Lessons completed
  const [lessonsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userLessonProgress)
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.status, 'completed')
      )
    );

  // Code submissions
  const [submissionsResult] = await db
    .select({
      total: sql<number>`count(*)`,
      passed: sql<number>`count(*) FILTER (WHERE ${codeSubmissions.passed} = true)`,
    })
    .from(codeSubmissions)
    .where(eq(codeSubmissions.userId, userId));

  // Hints used
  const [hintsResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(hintUsage)
    .where(eq(hintUsage.userId, userId));

  return {
    totalTimeSpent: timeResult?.total || 0,
    lessonsCompleted: lessonsResult?.count || 0,
    totalSubmissions: submissionsResult?.total || 0,
    successfulSubmissions: submissionsResult?.passed || 0,
    hintsUsed: hintsResult?.count || 0,
  };
}

/**
 * Update checklist data for a lesson (Phases 3-4)
 */
export async function updateChecklistData(
  userId: string,
  lessonId: string,
  checklistData: any
) {
  await db
    .update(userLessonProgress)
    .set({ checklistData })
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      )
    );
}

/**
 * Update code review status (Phase 4)
 */
export async function updateCodeReviewStatus(
  userId: string,
  lessonId: string,
  status: 'pending' | 'approved' | 'needs_fixes',
  feedback?: string
) {
  await db
    .update(userLessonProgress)
    .set({
      codeReviewStatus: status,
      codeReviewFeedback: feedback || null,
    })
    .where(
      and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lessonId)
      )
    );
}
