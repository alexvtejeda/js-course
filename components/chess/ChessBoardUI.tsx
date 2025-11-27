/**
 * Pre-built ChessBoard UI Component
 *
 * This is a styled chess board container that students will use
 * when building their chess game. It provides the 8x8 grid layout
 * with proper styling following Material Design principles.
 */

'use client';

import { ReactNode } from 'react';

interface ChessBoardUIProps {
  children: ReactNode;
  className?: string;
}

/**
 * ChessBoardUI - Pre-styled 8x8 chess board container
 *
 * Usage:
 * ```tsx
 * <ChessBoardUI>
 *   {board.map((row, rowIdx) =>
 *     row.map((piece, colIdx) => (
 *       <ChessSquare key={...} row={rowIdx} col={colIdx} ... />
 *     ))
 *   )}
 * </ChessBoardUI>
 * ```
 */
export function ChessBoardUI({ children, className = '' }: ChessBoardUIProps) {
  return (
    <div className={`flex flex-col items-center gap-8 ${className}`}>
      <div
        className="grid grid-cols-8 gap-0 border-4 border-gray-800 rounded-sm shadow-2xl"
        style={{
          width: '512px', // 8 * 64px squares
          height: '512px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
