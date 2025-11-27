/**
 * Pre-built ChessPiece Component
 *
 * Renders a chess piece using SVG images from public/chess-pieces/
 * Handles piece images for all piece types and colors.
 */

'use client';

import Image from 'next/image';

export interface ChessPieceProps {
  type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  color: 'white' | 'black';
  size?: number;
}

/**
 * ChessPiece - Renders a chess piece image
 *
 * Automatically loads the correct piece image from public/chess-pieces/
 * based on piece type and color.
 *
 * Usage:
 * ```tsx
 * <ChessPiece type="knight" color="white" />
 * ```
 */
export function ChessPiece({ type, color, size = 56 }: ChessPieceProps) {
  // Construct the image path
  // Expected format: /chess-pieces/white-knight.svg
  const imagePath = `/chess-pieces/${color}-${type}.svg`;

  return (
    <div className="relative z-10 pointer-events-none select-none">
      <Image
        src={imagePath}
        alt={`${color} ${type}`}
        width={size}
        height={size}
        className="drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}
