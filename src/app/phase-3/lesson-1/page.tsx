/**
 * Phase 3 - Lesson 1: React Component Basics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Lesson1Page() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/phase-3">
          <Button variant="ghost">&larr; Back to Phase 3</Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">React Component Basics</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Learn the fundamentals of React components, props, JSX, and composition.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>What is a Component?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              A <strong>component</strong> is a reusable piece of UI. Think of it like a function
              that returns HTML (actually JSX, which looks like HTML).
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Use it like this:
<Welcome />`}
              </pre>
            </div>
            <p>
              Components let you break down complex UIs into smaller, manageable pieces.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Props: Passing Data to Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Props</strong> (short for "properties") let you pass data into components,
              making them dynamic and reusable.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Use it with different names:
<Greeting name="Alice" />
<Greeting name="Bob" />`}
              </pre>
            </div>
            <p>
              In TypeScript, we define prop types using interfaces:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`interface GreetingProps {
  name: string;
  age?: number; // ? means optional
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>You are {age} years old.</p>}
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSX: JavaScript + HTML</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>JSX</strong> is a syntax extension that lets you write HTML-like code
              in JavaScript. It gets compiled to JavaScript function calls.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`// You can use JavaScript expressions in JSX:
const name = "Alice";
const element = <h1>Hello, {name}!</h1>;

// You can use loops and conditionals:
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map(num => (
  <li key={num}>{num}</li>
));

// You can use ternary operators:
const isLoggedIn = true;
const greeting = isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>;`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Composition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Components can contain other components. This is called <strong>composition</strong>.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm">
{`function ChessPiece({ type, color }) {
  return <div className="piece">{color} {type}</div>;
}

function ChessSquare({ piece }) {
  return (
    <div className="square">
      {piece && <ChessPiece type={piece.type} color={piece.color} />}
    </div>
  );
}

function ChessBoard() {
  return (
    <div className="board">
      <ChessSquare piece={{ type: 'knight', color: 'white' }} />
      <ChessSquare piece={null} />
      {/* ... more squares */}
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try It Yourself: Create a Component</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Open <code className="bg-muted px-2 py-1 rounded">src/workspace/components/ChessBoard.tsx</code>
            </p>
            <p>
              Try creating a simple component that renders a chess piece name and color.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold mb-2">💡 Challenge:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a component called PieceInfo</li>
                <li>It should accept props: type and color</li>
                <li>Display the piece information in a styled div</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href="/phase-3">
            <Button variant="outline">&larr; Back to Phase 3</Button>
          </Link>
          <Link href="/phase-3/lesson-2">
            <Button>Next: Understanding useState &rarr;</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
