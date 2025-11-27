/**
 * ChessBoard Component
 *
 * TODO: Build the interactive chess board component.
 *
 * Learning objectives:
 * - React component structure
 * - useState for managing state
 * - Event handling (onClick)
 * - Rendering lists with map()
 * - Client Components in Next.js
 */

'use client';

import { useState } from 'react';
import { BoardState, Position } from '../chess/types';
import { createInitialBoard, movePiece } from '../chess/board';
import { getLegalMoves } from '../chess/moves';

/**
 * TODO: Create your ChessBoard component
 *
 * This component should:
 * 1. Manage the board state using useState
 * 2. Track which piece is selected
 * 3. Show legal moves when a piece is selected
 * 4. Handle piece movement when a legal square is clicked
 * 5. Use the pre-built UI components from src/components/chess/
 */

export default function ChessBoard() {
  // TODO: Create state for the board
  const [board, setBoard] = useState<BoardState>(createInitialBoard());

  // TODO: Create state for the selected piece position
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // TODO: Create state for legal moves
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);

  // TODO: Create state for whose turn it is
  // const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');

  /**
   * TODO: Handle square click
   *
   * When a square is clicked:
   * 1. If no piece is selected:
   *    - Select the piece if there is one
   *    - Show its legal moves
   * 2. If a piece is selected:
   *    - If clicking a legal move, move the piece
   *    - If clicking another piece of the same color, select that piece instead
   *    - If clicking an empty square (not legal), deselect
   */
  const handleSquareClick = (row: number, col: number) => {
    // TODO: Implement square click logic
    console.log(`Square clicked: ${row}, ${col}`);
  };

  /**
   * TODO: Render the chess board
   *
   * Hint: Use nested map() to create an 8x8 grid
   * Use the ChessSquare and ChessPiece components from src/components/chess/
   */
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Your Chess Board</h2>

      {/* TODO: Render the 8x8 board grid */}
      <div className="grid grid-cols-8 gap-0 border-4 border-gray-800">
        {/* Use map() to create rows and columns */}
        {/* Example: board.map((row, rowIndex) => ...) */}
      </div>

      {/* TODO: Add turn indicator */}
      {/* TODO: Add game status (check, checkmate) */}
    </div>
  );
}
