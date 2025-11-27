/**
 * Chess Board Logic
 *
 * TODO: Implement functions to manage the chess board state.
 *
 * Learning objectives:
 * - Working with 2D arrays
 * - Pure functions (functions that don't modify inputs)
 * - Array manipulation in JavaScript
 */

import { BoardState, ChessPiece, Position, PieceColor, PieceType } from './types';

/**
 * TODO: Create the initial chess board setup
 *
 * Hint: A standard chess board has:
 * - Row 0 (black): rook, knight, bishop, queen, king, bishop, knight, rook
 * - Row 1 (black): pawns
 * - Rows 2-5: empty squares (null)
 * - Row 6 (white): pawns
 * - Row 7 (white): rook, knight, bishop, queen, king, bishop, knight, rook
 *
 * @returns The initial board state
 */
export function createInitialBoard(): BoardState {
  // TODO: Create an 8x8 board with pieces in their starting positions
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  // TODO: Place the pieces on the board
  // Example for black rooks:
  // board[0][0] = { type: 'rook', color: 'black' };
  // board[0][7] = { type: 'rook', color: 'black' };

  return board;
}

/**
 * TODO: Get the piece at a specific position
 *
 * @param board - The current board state
 * @param position - The position to check
 * @returns The piece at that position, or null if empty
 */
export function getPieceAt(board: BoardState, position: Position): ChessPiece | null {
  // TODO: Return the piece at the given position
  return null;
}

/**
 * TODO: Check if a position is within the board boundaries
 *
 * @param position - The position to check
 * @returns true if the position is valid (0-7 for both row and col)
 */
export function isValidPosition(position: Position): boolean {
  // TODO: Check if row and col are between 0 and 7
  return false;
}

/**
 * TODO: Move a piece from one position to another
 *
 * Important: This should return a NEW board state, not modify the existing one
 * (This is called immutability and is important in React)
 *
 * @param board - The current board state
 * @param from - The starting position
 * @param to - The destination position
 * @returns A new board state with the piece moved
 */
export function movePiece(board: BoardState, from: Position, to: Position): BoardState {
  // TODO: Create a copy of the board
  // TODO: Move the piece from 'from' to 'to'
  // TODO: Set the 'from' position to null
  // TODO: Return the new board
  return board;
}

// TODO: Add any other board-related functions you need
