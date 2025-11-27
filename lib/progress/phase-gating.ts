import { db } from '../db';
import { phases, userPhaseProgress, userLessonProgress, lessons } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Phase-gating logic for progressive learning platform
 *
 * Rules:
 * - Phase 1 always unlocked
 * - Phase 2 unlocked when Phase 1 completed (automated via code exercises)
 * - Phase 3 unlocked when Phase 2 completed (automated via code exercises)
 * - Phase 4 unlocked when Phase 3 checklist completed (manual checkboxes)
 * - Phase 5 unlocked when Phase 4 validation passes (Claude code review + Playwright tests)
 */

export type PhaseStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';
export type CompletionType = 'automated' | 'checklist' | 'code_review';

/**
 * Initialize phase progress for a new user
 */
export async function initializeUserPhaseProgress(userId: string) {
  const allPhases = await db.select().from(phases).orderBy(phases.phaseNumber);

  for (const phase of allPhases) {
    const status: PhaseStatus = phase.phaseNumber === 1 ? 'unlocked' : 'locked';

    await db.insert(userPhaseProgress).values({
      userId,
      phaseId: phase.id,
      status,
      startedAt: phase.phaseNumber === 1 ? new Date() : null,
    }).onConflictDoNothing();
  }
}

/**
 * Get current phase status for a user
 */
export async function getUserPhaseStatus(userId: string, phaseNumber: number) {
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, phaseNumber),
  });

  if (!phase) {
    throw new Error(`Phase ${phaseNumber} not found`);
  }

  const progress = await db.query.userPhaseProgress.findFirst({
    where: and(
      eq(userPhaseProgress.userId, userId),
      eq(userPhaseProgress.phaseId, phase.id)
    ),
  });

  return progress || null;
}

/**
 * Check if a phase is completed
 */
export async function isPhaseCompleted(userId: string, phaseNumber: number): Promise<boolean> {
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, phaseNumber),
  });

  if (!phase) return false;

  const progress = await getUserPhaseStatus(userId, phaseNumber);

  if (!progress) return false;

  return progress.status === 'completed';
}

/**
 * Check if user can access a phase
 */
export async function canAccessPhase(userId: string, phaseNumber: number): Promise<boolean> {
  // Phase 1 is always accessible
  if (phaseNumber === 1) return true;

  // Check if previous phase is completed
  const previousPhaseCompleted = await isPhaseCompleted(userId, phaseNumber - 1);

  return previousPhaseCompleted;
}

/**
 * Check if all required lessons in a phase are completed
 */
export async function areAllPhaseLessonsCompleted(userId: string, phaseId: number): Promise<boolean> {
  // Get all required lessons for the phase
  const requiredLessons = await db.query.lessons.findMany({
    where: and(
      eq(lessons.phaseId, phaseId),
      eq(lessons.requiredForCompletion, true)
    ),
  });

  if (requiredLessons.length === 0) return false;

  // Check if all required lessons are completed
  for (const lesson of requiredLessons) {
    const lessonProgress = await db.query.userLessonProgress.findFirst({
      where: and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.lessonId, lesson.id)
      ),
    });

    if (!lessonProgress || lessonProgress.status !== 'completed') {
      return false;
    }
  }

  return true;
}

/**
 * Check phase completion based on completion type
 */
export async function checkPhaseCompletion(
  userId: string,
  phaseNumber: number
): Promise<{ completed: boolean; reason?: string }> {
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, phaseNumber),
  });

  if (!phase) {
    return { completed: false, reason: 'Phase not found' };
  }

  switch (phase.completionType) {
    case 'automated': {
      // Check if all required lessons are completed
      const allCompleted = await areAllPhaseLessonsCompleted(userId, phase.id);
      return {
        completed: allCompleted,
        reason: allCompleted ? undefined : 'Not all exercises completed',
      };
    }

    case 'checklist': {
      // Check if checklist is complete (Phase 3)
      const phaseLessons = await db.query.lessons.findMany({
        where: and(
          eq(lessons.phaseId, phase.id),
          eq(lessons.type, 'checklist')
        ),
      });

      for (const lesson of phaseLessons) {
        const progress = await db.query.userLessonProgress.findFirst({
          where: and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.lessonId, lesson.id)
          ),
        });

        // Check if all checklist items are checked
        const checklistData = progress?.checklistData as { items?: Array<{ checked: boolean }> } | null;
        if (!checklistData?.items || !checklistData.items.every(item => item.checked)) {
          return { completed: false, reason: 'Checklist not complete' };
        }
      }

      return { completed: true };
    }

    case 'code_review': {
      // Check if code review is approved (Phase 4)
      const phaseLessons = await db.query.lessons.findMany({
        where: eq(lessons.phaseId, phase.id),
      });

      for (const lesson of phaseLessons) {
        const progress = await db.query.userLessonProgress.findFirst({
          where: and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.lessonId, lesson.id)
          ),
        });

        if (progress?.codeReviewStatus !== 'approved') {
          return { completed: false, reason: 'Code review not approved' };
        }
      }

      return { completed: true };
    }

    default:
      return { completed: false, reason: 'Unknown completion type' };
  }
}

/**
 * Update phase status and unlock next phase if needed
 */
export async function updatePhaseStatus(
  userId: string,
  phaseNumber: number,
  newStatus: PhaseStatus
) {
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, phaseNumber),
  });

  if (!phase) {
    throw new Error(`Phase ${phaseNumber} not found`);
  }

  const updateData: any = {
    status: newStatus,
    lastAccessedAt: new Date(),
  };

  if (newStatus === 'in_progress' || newStatus === 'unlocked') {
    updateData.startedAt = new Date();
  }

  if (newStatus === 'completed') {
    updateData.completedAt = new Date();
  }

  // Update the phase status
  await db
    .update(userPhaseProgress)
    .set(updateData)
    .where(
      and(
        eq(userPhaseProgress.userId, userId),
        eq(userPhaseProgress.phaseId, phase.id)
      )
    );

  // If phase is completed, unlock next phase
  if (newStatus === 'completed') {
    await unlockNextPhase(userId, phaseNumber);
  }
}

/**
 * Unlock the next phase when current phase is completed
 */
async function unlockNextPhase(userId: string, currentPhaseNumber: number) {
  const nextPhaseNumber = currentPhaseNumber + 1;

  const nextPhase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, nextPhaseNumber),
  });

  if (!nextPhase) return; // No next phase

  const nextPhaseProgress = await db.query.userPhaseProgress.findFirst({
    where: and(
      eq(userPhaseProgress.userId, userId),
      eq(userPhaseProgress.phaseId, nextPhase.id)
    ),
  });

  // Only unlock if currently locked
  if (nextPhaseProgress?.status === 'locked') {
    await db
      .update(userPhaseProgress)
      .set({
        status: 'unlocked',
        lastAccessedAt: new Date(),
      })
      .where(
        and(
          eq(userPhaseProgress.userId, userId),
          eq(userPhaseProgress.phaseId, nextPhase.id)
        )
      );
  }
}

/**
 * Mark phase as in progress (when user first accesses it)
 */
export async function markPhaseInProgress(userId: string, phaseNumber: number) {
  const currentStatus = await getUserPhaseStatus(userId, phaseNumber);

  if (currentStatus?.status === 'unlocked') {
    await updatePhaseStatus(userId, phaseNumber, 'in_progress');
  }
}

/**
 * Attempt to complete a phase (checks completion criteria)
 */
export async function tryCompletePhase(userId: string, phaseNumber: number) {
  const completionCheck = await checkPhaseCompletion(userId, phaseNumber);

  if (completionCheck.completed) {
    await updatePhaseStatus(userId, phaseNumber, 'completed');
    return { success: true };
  }

  return { success: false, reason: completionCheck.reason };
}

/**
 * Get all phases with user progress
 */
export async function getAllPhasesWithProgress(userId: string) {
  const allPhases = await db.query.phases.findMany({
    orderBy: phases.phaseNumber,
  });

  const phasesWithProgress = await Promise.all(
    allPhases.map(async (phase) => {
      const progress = await db.query.userPhaseProgress.findFirst({
        where: and(
          eq(userPhaseProgress.userId, userId),
          eq(userPhaseProgress.phaseId, phase.id)
        ),
      });

      // Count completed lessons
      const allLessons = await db.query.lessons.findMany({
        where: eq(lessons.phaseId, phase.id),
      });

      const completedLessonsCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(userLessonProgress)
        .where(
          and(
            eq(userLessonProgress.userId, userId),
            sql`${userLessonProgress.lessonId} IN (SELECT id FROM ${lessons} WHERE ${lessons.phaseId} = ${phase.id})`,
            eq(userLessonProgress.status, 'completed')
          )
        );

      return {
        ...phase,
        progress: progress || null,
        totalLessons: allLessons.length,
        completedLessons: completedLessonsCount[0]?.count || 0,
      };
    })
  );

  return phasesWithProgress;
}
