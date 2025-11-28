import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { lessons, phases } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ExerciseCard } from '@/components/learning/ExerciseCard';
import { canAccessPhase, markPhaseInProgress } from '@/lib/progress/phase-gating';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"; 

export default async function Phase2Page() {
  const user = await requireAuth();

  // Check if user can access Phase 2
  const hasAccess = await canAccessPhase(user.id, 2);

  if (!hasAccess) {
    redirect('/dashboard');
  }

  // Mark phase as in progress
  await markPhaseInProgress(user.id, 2);

  // Get phase info
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, 2),
  });

  // Get all lessons for Phase 2
  const phaseLessons = await db.query.lessons.findMany({
    where: eq(lessons.phaseId, phase!.id),
    orderBy: lessons.lessonNumber,
  });

  // Load exercise configs from JSON directly
  const lessonsWithExercises = await Promise.all(
    phaseLessons.map(async (lesson) => {
      if (lesson.type === 'exercise' && lesson.content) {
        const content = lesson.content as { exerciseId: string };

        // Load config directly without VM2
        try {
          const fs = await import('fs/promises');
          const path = await import('path');
          const configPath = path.join(
            process.cwd(),
            'config',
            'exercises',
            'phase-2',
            `${content.exerciseId}.json`
          );
          const fileContent = await fs.readFile(configPath, 'utf-8');
          const exerciseConfig = JSON.parse(fileContent);

          return {
            ...lesson,
            exerciseConfig,
          };
        } catch (error) {
          console.error('Failed to load exercise:', error);
          return {
            ...lesson,
            exerciseConfig: null,
          };
        }
      }
      return {
        ...lesson,
        exerciseConfig: null,
      };
    })
  );

  return (
    <div className="min-h-screen bg-background">
      <LoadingOverlay logoSrc="/logo-white.svg" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-3xl">
              ⏱️
            </div>
            <div>
              <h1 className="text-4xl font-bold">{phase?.title}</h1>
              <p className="text-gray-600 mt-1">{phase?.description}</p>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader>
            <CardTitle>Welcome to Phase 2!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Now that you've mastered the fundamentals, it's time to tackle asynchronous JavaScript.
              You'll learn how to work with promises, async/await, and handle asynchronous operations
              that are essential for modern web development.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold mb-2">📚 What you'll learn:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Understanding Promises and their states</li>
                <li>Using async/await syntax</li>
                <li>Handling errors with try/catch</li>
                <li>Working with multiple asynchronous operations</li>
                <li>Chaining promises and managing execution flow</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <div className="space-y-8">
          {lessonsWithExercises.map((lesson) => (
            <div key={lesson.id} id={lesson.slug}>
              {lesson.type === 'exercise' && lesson.exerciseConfig ? (
                <ExerciseCard
                  exercise={lesson.exerciseConfig}
                  lessonId={lesson.id}
                  phase={2}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{lesson.description}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
