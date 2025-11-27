/**
 * Phase 3: React Basics + Chess Setup
 *
 * In this phase, you'll learn React fundamentals while setting up
 * your chess board and implementing basic interactions.
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

export default function Phase3Page() {
  // TODO: Fetch user's progress for this phase from the database
  const lessons = [
    {
      id: 1,
      title: 'React Component Basics',
      description: 'Learn about components, props, JSX, and composition',
      href: '/phase-3/lesson-1',
      completed: false,
    },
    {
      id: 2,
      title: 'Understanding useState',
      description: 'Manage state in React - board state, selected pieces, and turn tracking',
      href: '/phase-3/lesson-2',
      completed: false,
    },
    {
      id: 3,
      title: 'Event Handling in React',
      description: 'Handle user interactions with onClick and other event handlers',
      href: '/phase-3/lesson-3',
      completed: false,
    },
    {
      id: 4,
      title: 'Client vs Server Components',
      description: "Learn about 'use client' and Next.js component types",
      href: '/phase-3/lesson-4',
      completed: false,
    },
    {
      id: 5,
      title: 'Chess Board Setup',
      description: 'Render an 8x8 grid and display initial piece positions',
      href: '/phase-3/lesson-5',
      completed: false,
    },
    {
      id: 6,
      title: 'Click Detection',
      description: 'Select pieces and highlight squares when clicked',
      href: '/phase-3/lesson-6',
      completed: false,
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Phase 3: React Basics + Chess Setup</h1>
        <p className="text-lg text-muted-foreground">
          Learn React fundamentals by building the foundation of your chess game.
          You'll work in the <code className="bg-muted px-2 py-1 rounded">src/workspace/</code> directory
          to create interactive components.
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="mt-2">{lesson.description}</CardDescription>
                </div>
                <Link href={lesson.href}>
                  <Button variant={lesson.completed ? 'outline' : 'default'}>
                    {lesson.completed ? 'Review' : 'Start'}
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle>Phase 3 Completion Checklist</CardTitle>
          <CardDescription>
            Complete these milestones to unlock Phase 4
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="board-renders" className="w-4 h-4" />
              <label htmlFor="board-renders">Chess board renders with 8x8 grid</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pieces-display" className="w-4 h-4" />
              <label htmlFor="pieces-display">All pieces display in starting positions</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="click-detection" className="w-4 h-4" />
              <label htmlFor="click-detection">Pieces highlight when clicked</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="square-selection" className="w-4 h-4" />
              <label htmlFor="square-selection">Can select and deselect pieces</label>
            </div>
          </div>
          <Button className="mt-4 w-full" disabled>
            Complete Phase 3
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
