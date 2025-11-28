import { requireAuth } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { lessons, phases } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ExerciseCard } from '@/components/learning/ExerciseCard';
// Moved loadExerciseConfig to avoid VM2 server import
import { canAccessPhase, markPhaseInProgress } from '@/lib/progress/phase-gating';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {ArrowLeft } from 'lucide-react';
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"; 

export default async function Phase1Page() {
  const user = await requireAuth();

  // Check if user can access Phase 1
  const hasAccess = await canAccessPhase(user.id, 1);

  if (!hasAccess) {
    redirect('/dashboard');
  }

  // Mark phase as in progress
  await markPhaseInProgress(user.id, 1);

  // Get phase info
  const phase = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, 1),
  });

  // Get all lessons for Phase 1
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
            'phase-1',
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
            <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center text-3xl">
              💻
            </div>
            <div>
              <h1 className="text-4xl font-bold">{phase?.title}</h1>
              <p className="text-gray-600 mt-1">{phase?.description}</p>
            </div>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="mb-8 border-2 border-orange-200">
          <CardHeader>
            <CardTitle>Welcome to Phase 1!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              In this phase, you'll review fundamental JavaScript concepts that will be essential
              for building the chess game. Each exercise will test your understanding and help
              reinforce core concepts.
            </p>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-semibold mb-2 dark:text-background">📚 What you'll practice:</p>
              <ul className="list-disc list-inside space-y-1 text-sm dark:text-background">
                <li>Loops and iteration patterns</li>
                <li>Array methods and manipulation</li>
                <li>Variable declaration and scope</li>
                <li>Conditional logic and control flow</li>
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
                  phase={1}
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
