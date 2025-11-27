/**
 * Workspace Preview Component
 *
 * Displays a live preview of the student's workspace code.
 * This component dynamically imports and renders the student's ChessBoard component.
 */

'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Dynamically import the student's ChessBoard component
// This allows hot-reloading when they edit their workspace files
const StudentChessBoard = dynamic(
  () => import('@/workspace/components/ChessBoard').catch(() => {
    // Return a fallback component if the import fails
    return {
      default: () => (
        <div className="text-center p-8 text-muted-foreground">
          <p>ChessBoard component not found or has errors.</p>
          <p className="text-sm mt-2">
            Create or fix <code>src/workspace/components/ChessBoard.tsx</code>
          </p>
        </div>
      ),
    };
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

interface WorkspacePreviewProps {
  title?: string;
  description?: string;
}

/**
 * WorkspacePreview - Live preview of student's workspace code
 *
 * Usage:
 * ```tsx
 * <WorkspacePreview
 *   title="Your Chess Board"
 *   description="This is a live preview of your code"
 * />
 * ```
 */
export function WorkspacePreview({
  title = 'Live Preview',
  description = 'Your chess board will appear here',
}: WorkspacePreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[600px]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <StudentChessBoard />
        </Suspense>
      </CardContent>
    </Card>
  );
}
