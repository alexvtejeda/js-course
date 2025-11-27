/**
 * Workspace Preview Page
 *
 * A dedicated page where students can see their chess board in action.
 * This page imports and displays the student's workspace components.
 */

import { WorkspacePreview } from '@/components/learning/WorkspacePreview';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WorkspacePreviewPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Chess Board</h1>
        <p className="text-muted-foreground mb-4">
          This is a live preview of your workspace code. Edit files in{' '}
          <code className="bg-muted px-2 py-1 rounded">src/workspace/</code> and see the changes here!
        </p>
        <div className="flex gap-2">
          <Link href="/phase-3">
            <Button variant="outline">Phase 3 Lessons</Button>
          </Link>
          <Link href="/phase-4">
            <Button variant="outline">Phase 4 Lessons</Button>
          </Link>
        </div>
      </div>

      <WorkspacePreview
        title="Your Chess Board Implementation"
        description="This preview updates automatically when you save your code"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">💡 Tips</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Save your files to see updates</li>
            <li>Check the browser console for errors (F12)</li>
            <li>Use console.log() to debug</li>
            <li>The preview auto-refreshes on file changes</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold mb-2">📁 Workspace Files</h3>
          <ul className="text-sm space-y-1 font-mono">
            <li>src/workspace/chess/types.ts</li>
            <li>src/workspace/chess/board.ts</li>
            <li>src/workspace/chess/moves.ts</li>
            <li>src/workspace/chess/check.ts</li>
            <li>src/workspace/components/ChessBoard.tsx</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
