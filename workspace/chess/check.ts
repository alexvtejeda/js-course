/**
 * Check and Checkmate Detection
 *
 * TODO: Implement functions to detect check and checkmate.
 *
 * Learning objectives:
 * - Complex game logic
 * - Array methods (find, filter, some, every)
 * - Working with multiple functions together
 */

import { BoardState, Position, PieceColor } from './types';
import { getPieceAt } from './board';
import { getLegalMoves } from './moves';

/**
 * TODO: Find the king's position on the board
 *
 * @param board - The current board state
 * @param color - The color of the king to find
 * @returns The position of the king, or null if not found
 */
export function findKing(board: BoardState, color: PieceColor): Position | null {
  // TODO: Search the board for the king of the given color
  // Hint: Use nested loops to check each square

  return null;
}

/**
 * TODO: Check if a king is in check
 *
 * A king is in check if any enemy piece can capture it on their next move.
 *
 * @param board - The current board state
 * @param kingColor - The color of the king
 * @returns true if the king is in check
 */
export function isKingInCheck(board: BoardState, kingColor: PieceColor): boolean {
  // TODO: Find the king's position
  // TODO: Check if any enemy piece can move to the king's position
  // Hint: Loop through all squares, find enemy pieces, check their legal moves

  return false;
}

/**
 * TODO: Check if a king is in checkmate
 *
 * Checkmate means:
 * 1. The king is in check
 * 2. The king has no legal moves to escape check
 * 3. No other piece can block the check or capture the attacking piece
 *
 * @param board - The current board state
 * @param kingColor - The color of the king
 * @returns true if the king is in checkmate
 */
export function isCheckmate(board: BoardState, kingColor: PieceColor): boolean {
  // TODO: First, check if the king is in check
  // TODO: If not in check, return false
  // TODO: Check if the king has any legal moves that would get it out of check
  // TODO: Check if any friendly piece can block or capture to save the king

  return false;
}

/**
 * TODO: Check if a move would put your own king in check
 *
 * This is important: you cannot make a move that puts your own king in check!
 *
 * @param board - The current board state
 * @param from - The starting position
 * @param to - The destination position
 * @returns true if the move is safe (doesn't put own king in check)
 */
export function isSafeMove(board: BoardState, from: Position, to: Position): boolean {
  // TODO: Get the piece at 'from'
  // TODO: Simulate the move (create a new board with the move made)
  // TODO: Check if the king of that piece's color is in check on the new board
  // TODO: Return true if the king is NOT in check after the move

  return true;
}

// TODO: Add any other check-related functions you need
