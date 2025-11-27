/**
 * Phase 3 - Lesson 3: Event Handling in React
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson3Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Link href="/phase-3"><Button variant="ghost">&larr; Back</Button></Link>

      <h1 className="text-4xl font-bold">Event Handling in React</h1>

      <Card>
        <CardHeader><CardTitle>Handling Clicks</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`// Basic onClick
<button onClick={() => alert('Clicked!')}>
  Click me
</button>

// With a handler function
function handleClick() {
  console.log('Button clicked');
}
<button onClick={handleClick}>Click me</button>

// Passing arguments
<button onClick={() => handleSquareClick(row, col)}>
  Square
</button>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Chess Square Click Handler</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-sm">
{`function ChessBoard() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  const handleSquareClick = (row: number, col: number) => {
    console.log(\`Clicked square: \${row}, \${col}\`);

    // If no piece selected, select this piece
    if (!selectedPosition) {
      setSelectedPosition({ row, col });
      return;
    }

    // If piece selected, try to move it
    // (We'll implement movement logic in Phase 4)
  };

  return (
    <ChessSquare
      row={0}
      col={0}
      onClick={() => handleSquareClick(0, 0)}
    />
  );
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link href="/phase-3/lesson-2"><Button variant="outline">&larr; Previous</Button></Link>
        <Link href="/phase-3/lesson-4"><Button>Next: Client Components &rarr;</Button></Link>
      </div>
    </div>
  );
}
