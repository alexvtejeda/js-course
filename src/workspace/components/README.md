# Your Chess Components

This is where you'll build your chess game components!

## What to build

You'll create interactive React components that use the chess logic from `../chess/`:

### ChessBoard.tsx (Main Component)
- Manages the game state (board, selected piece, current turn)
- Handles user interactions (clicking squares)
- Renders the board using pre-built UI components
- Shows legal moves and game status

### Optional Components (if you want to organize further):
- ChessGame.tsx - Wrapper for the entire game
- GameControls.tsx - Reset button, move history, etc.
- GameStatus.tsx - Display current turn, check/checkmate status

## Pre-built UI Components

You have access to pre-built UI components in `src/components/chess/`:
- `<ChessBoard>` - Styled board container with 8x8 grid
- `<ChessSquare>` - Individual square with highlighting
- `<ChessPiece>` - Renders chess piece images

Import these and use them in your components!

## Key React Concepts

### useState
Use `useState` to manage component state:
```tsx
const [board, setBoard] = useState<BoardState>(createInitialBoard());
const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
```

### Event Handling
Handle user clicks:
```tsx
<div onClick={() => handleSquareClick(row, col)}>
```

### Rendering Lists
Use `map()` to render the board:
```tsx
{board.map((row, rowIndex) => (
  row.map((piece, colIndex) => (
    <ChessSquare key={`${rowIndex}-${colIndex}`} ... />
  ))
))}
```

### Client Components
Add `'use client'` at the top of files that use hooks or event handlers!

## Getting Started

1. Start with ChessBoard.tsx
2. Set up state for the board and selected piece
3. Implement handleSquareClick()
4. Render the board using the pre-built components
5. Test by clicking pieces and squares!
