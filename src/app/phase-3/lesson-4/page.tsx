/**
 * Phase 3 - Lesson 4: Client vs Server Components
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson4Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Link href="/phase-3"><Button variant="ghost">&larr; Back</Button></Link>

      <h1 className="text-4xl font-bold">Client vs Server Components</h1>

      <Card>
        <CardHeader><CardTitle>Server Components (Default)</CardTitle></CardHeader>
        <CardContent>
          <p>By default, Next.js components are Server Components. They run on the server and send HTML to the browser.</p>
          <ul className="list-disc list-inside mt-4 space-y-2">
            <li>No interactivity (no useState, onClick, etc.)</li>
            <li>Can fetch data directly from databases</li>
            <li>Smaller bundle size</li>
            <li>Better for SEO</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Client Components</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p>Add <code>'use client'</code> at the top of the file to make it a Client Component:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`'use client';

import { useState } from 'react';

export default function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard());
  // Now you can use hooks and event handlers!

  return <div onClick={...}>...</div>;
}`}
            </pre>
          </div>
          <p><strong>Use Client Components when you need:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>useState, useEffect, or other hooks</li>
            <li>Event handlers (onClick, onChange, etc.)</li>
            <li>Browser APIs (window, document, etc.)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
        <CardHeader><CardTitle>⚠️ Important for Chess Game</CardTitle></CardHeader>
        <CardContent>
          <p>Your ChessBoard component MUST be a Client Component because it needs useState and onClick!</p>
          <p className="mt-2">Always add <code>'use client'</code> at the top of interactive components.</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href="/phase-3/lesson-3"><Button variant="outline">&larr; Previous</Button></Link>
        <Link href="/phase-3/lesson-5"><Button>Next: Chess Board Setup &rarr;</Button></Link>
      </div>
    </div>
  );
}
