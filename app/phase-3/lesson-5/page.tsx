/**
 * Phase 3 - Lesson 5: Chess Board Setup
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson5Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Link href="/phase-3"><Button variant="ghost">&larr; Back</Button></Link>

      <h1 className="text-4xl font-bold">Chess Board Setup</h1>
      <p className="text-muted-foreground">Render an 8x8 grid with pieces in their starting positions</p>

      <Card>
        <CardHeader><CardTitle>Step 1: Import Components</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`'use client';

import { useState } from 'react';
import { BoardState, Position } from '../chess/types';
import { createInitialBoard } from '../chess/board';
import { ChessBoardUI, ChessSquare, ChessPiece, isLightSquare } from '@/components/chess';`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Step 2: Render the Grid</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p>Use nested <code>map()</code> to create rows and columns:</p>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`export default function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard());

  return (
    <ChessBoardUI>
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => (
          <ChessSquare
            key={\`\${rowIdx}-\${colIdx}\`}
            row={rowIdx}
            col={colIdx}
            isLight={isLightSquare(rowIdx, colIdx)}
          >
            {piece && <ChessPiece type={piece.type} color={piece.color} />}
          </ChessSquare>
        ))
      )}
    </ChessBoardUI>
  );
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950">
        <CardHeader><CardTitle>💡 Your Turn!</CardTitle></CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Complete the <code>createInitialBoard()</code> function in <code>src/workspace/chess/board.ts</code></li>
            <li>Render the board in <code>src/workspace/components/ChessBoard.tsx</code></li>
            <li>Check the preview to see your board!</li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href="/phase-3/lesson-4"><Button variant="outline">&larr; Previous</Button></Link>
        <Link href="/phase-3/lesson-6"><Button>Next: Click Detection &rarr;</Button></Link>
      </div>
    </div>
  );
}
