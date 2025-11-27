/**
 * Chess Type Definitions
 *
 * TODO: Define the types needed for your chess game.
 * This file will help you structure your chess data.
 *
 * Learning objectives:
 * - Understanding TypeScript type definitions
 * - Modeling game state with types
 * - Using union types and enums
 */

// TODO: Define piece types (pawn, knight, bishop, rook, queen, king)
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

// TODO: Define piece colors (white, black)
export type PieceColor = 'white' | 'black';

// TODO: Define a chess piece interface
export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  // Add any other properties you think a piece needs
}

// TODO: Define position on the board (row and column)
export interface Position {
  row: number; // 0-7
  col: number; // 0-7
}

// TODO: Define the board state
// Hint: The board is 8x8, so you might use a 2D array
export type BoardState = (ChessPiece | null)[][];

// TODO: Add any other types you need for your chess game
// Examples: Move, GameState, etc.
