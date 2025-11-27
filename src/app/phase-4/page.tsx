/**
 * Phase 4: Chess Logic - Build the Game
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

export default function Phase4Page() {
  const lessons = [
    {
      id: 1,
      title: 'Piece Movement Logic',
      description: 'Implement move validation for each piece type',
      href: '/phase-4/lesson-1',
      completed: false,
    },
    {
      id: 2,
      title: 'Legal Moves Display',
      description: 'Show valid moves when a piece is selected',
      href: '/phase-4/lesson-2',
      completed: false,
    },
    {
      id: 3,
      title: 'Making Moves',
      description: 'Update board state and switch turns',
      href: '/phase-4/lesson-3',
      completed: false,
    },
    {
      id: 4,
      title: 'Check Detection',
      description: 'Detect when a king is under attack',
      href: '/phase-4/lesson-4',
      completed: false,
    },
    {
      id: 5,
      title: 'Checkmate Detection',
      description: 'Detect when the game is over',
      href: '/phase-4/lesson-5',
      completed: false,
    },
  ];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Phase 4: Chess Logic</h1>
        <p className="text-lg text-muted-foreground">
          Implement the chess game logic in your workspace. You'll write move validation,
          check detection, and complete the game mechanics.
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
          <CardTitle>Phase 4 Completion Checklist</CardTitle>
          <CardDescription>
            Complete these milestones, then request a code review to unlock Phase 5
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="piece-moves" className="w-4 h-4" />
              <label htmlFor="piece-moves">At least one piece type moves correctly</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="all-pieces" className="w-4 h-4" />
              <label htmlFor="all-pieces">All pieces move according to chess rules</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="legal-moves-display" className="w-4 h-4" />
              <label htmlFor="legal-moves-display">Legal moves display when piece selected</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="turn-switching" className="w-4 h-4" />
              <label htmlFor="turn-switching">Turns switch between white and black</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="check" className="w-4 h-4" />
              <label htmlFor="check">Check detection implemented</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="checkmate" className="w-4 h-4" />
              <label htmlFor="checkmate">Checkmate detection working</label>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200">
            <p className="font-semibold mb-2">🤖 Claude Code Review Required</p>
            <p className="text-sm">
              Once you've checked all boxes, click "Request Code Review" to have Claude analyze
              your chess implementation and unlock Phase 5.
            </p>
          </div>

          <Button className="w-full" disabled>
            Request Code Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
