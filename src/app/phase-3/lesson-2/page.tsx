/**
 * Phase 3 - Lesson 2: Understanding useState
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson2Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/phase-3">
          <Button variant="ghost">&larr; Back to Phase 3</Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">Understanding useState</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn how to manage component state in React using the useState hook.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What is State?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>State</strong> is data that changes over time in your component.
              When state changes, React re-renders the component to show the updated data.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`import { useState } from 'react';

function Counter() {
  // Declare a state variable called "count"
  const [count, setCount] = useState(0);
  //     ^      ^           ^
  //     |      |           |
  //  value  setter    initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>State for Chess: Board State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For your chess game, you'll need state to track the board and pieces:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`import { useState } from 'react';
import { BoardState } from '../chess/types';
import { createInitialBoard } from '../chess/board';

function ChessBoard() {
  // State for the 8x8 board with pieces
  const [board, setBoard] = useState<BoardState>(
    createInitialBoard()
  );

  return (
    <div>
      {/* Render board here */}
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>State for Chess: Selected Piece</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You'll also need state to track which piece the player has selected:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`import { useState } from 'react';
import { Position } from '../chess/types';

function ChessBoard() {
  const [board, setBoard] = useState(createInitialBoard());

  // State for which piece is selected (row, col)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // State for legal moves of selected piece
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);

  // State for whose turn it is
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

  return <div>{/* ... */}</div>;
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updating State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Important:</strong> Always use the setter function to update state.
              Never modify state directly!
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`// ❌ WRONG - Don't do this!
board[2][3] = { type: 'pawn', color: 'white' };

// ✅ CORRECT - Use the setter function
const newBoard = [...board]; // Create a copy
newBoard[2][3] = { type: 'pawn', color: 'white' };
setBoard(newBoard);

// ✅ Also correct - using a function
setBoard(prevBoard => {
  const newBoard = [...prevBoard];
  newBoard[2][3] = { type: 'pawn', color: 'white' };
  return newBoard;
});`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try It Yourself</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              In <code className="bg-muted px-2 py-1 rounded">src/workspace/components/ChessBoard.tsx</code>:
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold mb-2">💡 Challenge:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Add useState for the board state</li>
                <li>Add useState for selectedPosition</li>
                <li>Add useState for legalMoves</li>
                <li>Add useState for currentTurn</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href="/phase-3/lesson-1">
            <Button variant="outline">&larr; Previous: React Basics</Button>
          </Link>
          <Link href="/phase-3/lesson-3">
            <Button>Next: Event Handling &rarr;</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
