/**
 * Phase 3 - Lesson 6: Click Detection
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson6Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Link href="/phase-3"><Button variant="ghost">&larr; Back</Button></Link>

      <h1 className="text-4xl font-bold">Click Detection</h1>
      <p className="text-muted-foreground">Select pieces and highlight squares when clicked</p>

      <Card>
        <CardHeader><CardTitle>Implement handleSquareClick</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

const handleSquareClick = (row: number, col: number) => {
  const clickedPiece = board[row][col];

  // If no piece selected
  if (!selectedPosition) {
    if (clickedPiece) {
      setSelectedPosition({ row, col });
    }
    return;
  }

  // If clicking the same piece, deselect
  if (selectedPosition.row === row && selectedPosition.col === col) {
    setSelectedPosition(null);
    return;
  }

  // Otherwise, deselect for now (we'll add movement in Phase 4)
  setSelectedPosition(null);
};

// Add onClick to ChessSquare:
<ChessSquare
  onClick={() => handleSquareClick(rowIdx, colIdx)}
  isSelected={selectedPosition?.row === rowIdx && selectedPosition?.col === colIdx}
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 dark:bg-green-950">
        <CardHeader><CardTitle>✅ Phase 3 Complete!</CardTitle></CardHeader>
        <CardContent>
          <p>Once you can click pieces and see them highlight, you've finished Phase 3!</p>
          <p className="mt-2">Return to the Phase 3 page and check off all the milestones.</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href="/phase-3/lesson-5"><Button variant="outline">&larr; Previous</Button></Link>
        <Link href="/phase-3"><Button>Back to Phase 3 Overview &rarr;</Button></Link>
      </div>
    </div>
  );
}
