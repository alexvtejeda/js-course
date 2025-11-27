/**
 * Pre-built ChessSquare Component
 *
 * A single square on the chess board with highlighting states:
 * - Normal (light/dark square pattern)
 * - Selected (piece is selected)
 * - Legal move (piece can move here)
 * - Check (king is in check)
 */

'use client';

import { ReactNode } from 'react';

export interface ChessSquareProps {
  row: number;
  col: number;
  isLight: boolean;
  isSelected?: boolean;
  isLegalMove?: boolean;
  isCheck?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

/**
 * ChessSquare - A single square on the chess board
 *
 * Automatically determines light/dark coloring based on position.
 * Shows visual indicators for game state (selected, legal moves, check).
 *
 * Usage:
 * ```tsx
 * <ChessSquare
 *   row={rowIdx}
 *   col={colIdx}
 *   isLight={(rowIdx + colIdx) % 2 === 0}
 *   isSelected={selectedPos?.row === rowIdx && selectedPos?.col === colIdx}
 *   isLegalMove={legalMoves.some(m => m.row === rowIdx && m.col === colIdx)}
 *   onClick={() => handleSquareClick(rowIdx, colIdx)}
 * >
 *   <ChessPiece piece={piece} />
 * </ChessSquare>
 * ```
 */
export function ChessSquare({
  row,
  col,
  isLight,
  isSelected = false,
  isLegalMove = false,
  isCheck = false,
  onClick,
  children,
}: ChessSquareProps) {
  // Base color (checkerboard pattern)
  let bgColor = isLight ? 'bg-amber-100' : 'bg-amber-700';

  // Override with state colors
  if (isCheck) {
    bgColor = 'bg-red-500';
  } else if (isSelected) {
    bgColor = 'bg-yellow-300';
  }

  return (
    <div
      className={`
        relative flex items-center justify-center
        w-16 h-16
        ${bgColor}
        cursor-pointer
        transition-colors duration-150
        hover:brightness-110
      `}
      onClick={onClick}
      data-row={row}
      data-col={col}
    >
      {/* Legal move indicator */}
      {isLegalMove && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`
              ${children ? 'w-14 h-14 border-4 border-green-500 rounded-full' : 'w-4 h-4 bg-green-500 rounded-full opacity-60'}
            `}
          />
        </div>
      )}

      {/* Piece or empty */}
      {children}
    </div>
  );
}

/**
 * Helper function to determine if a square should be light colored
 *
 * @param row - Row index (0-7)
 * @param col - Column index (0-7)
 * @returns true if the square should be light colored
 */
export function isLightSquare(row: number, col: number): boolean {
  return (row + col) % 2 === 0;
}
