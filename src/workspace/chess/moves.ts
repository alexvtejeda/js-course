/**
 * Chess Move Validation
 *
 * TODO: Implement functions to validate legal moves for each piece type.
 *
 * Learning objectives:
 * - Conditional logic and switch statements
 * - Array methods (filter, map, some, every)
 * - Breaking down complex problems into smaller functions
 */

import { BoardState, Position, PieceType, ChessPiece } from './types';
import { getPieceAt, isValidPosition } from './board';

/**
 * TODO: Get all legal moves for a piece at a given position
 *
 * @param board - The current board state
 * @param position - The position of the piece
 * @returns An array of valid positions the piece can move to
 */
export function getLegalMoves(board: BoardState, position: Position): Position[] {
  const piece = getPieceAt(board, position);

  if (!piece) {
    return [];
  }

  // TODO: Based on the piece type, return legal moves
  // Hint: Use a switch statement or if/else to handle each piece type
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, position, piece);
    case 'knight':
      return getKnightMoves(board, position, piece);
    case 'bishop':
      return getBishopMoves(board, position, piece);
    case 'rook':
      return getRookMoves(board, position, piece);
    case 'queen':
      return getQueenMoves(board, position, piece);
    case 'king':
      return getKingMoves(board, position, piece);
    default:
      return [];
  }
}

/**
 * TODO: Get legal moves for a pawn
 *
 * Pawn rules:
 * - Moves forward 1 square (2 squares from starting position)
 * - Captures diagonally
 * - Cannot move backward
 *
 * @param board - The current board state
 * @param position - The pawn's position
 * @param piece - The pawn piece
 * @returns Array of legal positions
 */
function getPawnMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement pawn movement logic
  // Hint: White pawns move up (row decreases), black pawns move down (row increases)

  return moves;
}

/**
 * TODO: Get legal moves for a knight
 *
 * Knight rules:
 * - Moves in an "L" shape: 2 squares in one direction, 1 square perpendicular
 * - Can jump over other pieces
 *
 * @param board - The current board state
 * @param position - The knight's position
 * @param piece - The knight piece
 * @returns Array of legal positions
 */
function getKnightMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement knight movement logic
  // There are 8 possible L-shaped moves

  return moves;
}

/**
 * TODO: Get legal moves for a bishop
 *
 * Bishop rules:
 * - Moves diagonally any number of squares
 * - Cannot jump over pieces
 *
 * @param board - The current board state
 * @param position - The bishop's position
 * @param piece - The bishop piece
 * @returns Array of legal positions
 */
function getBishopMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement bishop movement logic
  // Hint: Check all 4 diagonal directions until you hit a piece or board edge

  return moves;
}

/**
 * TODO: Get legal moves for a rook
 *
 * Rook rules:
 * - Moves horizontally or vertically any number of squares
 * - Cannot jump over pieces
 *
 * @param board - The current board state
 * @param position - The rook's position
 * @param piece - The rook piece
 * @returns Array of legal positions
 */
function getRookMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement rook movement logic
  // Hint: Check all 4 directions (up, down, left, right)

  return moves;
}

/**
 * TODO: Get legal moves for a queen
 *
 * Queen rules:
 * - Combines bishop and rook movement
 * - Moves any number of squares diagonally, horizontally, or vertically
 *
 * @param board - The current board state
 * @param position - The queen's position
 * @param piece - The queen piece
 * @returns Array of legal positions
 */
function getQueenMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement queen movement logic
  // Hint: Combine bishop and rook moves!

  return moves;
}

/**
 * TODO: Get legal moves for a king
 *
 * King rules:
 * - Moves one square in any direction
 * - Cannot move into check (we'll handle this in check.ts)
 *
 * @param board - The current board state
 * @param position - The king's position
 * @param piece - The king piece
 * @returns Array of legal positions
 */
function getKingMoves(board: BoardState, position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = [];

  // TODO: Implement king movement logic
  // Hint: Check all 8 surrounding squares

  return moves;
}

/**
 * Helper function: Check if a move is blocked by a piece of the same color
 *
 * @param board - The current board state
 * @param position - The position to check
 * @param pieceColor - The color of the moving piece
 * @returns true if the move is valid (empty square or enemy piece)
 */
export function canMoveTo(board: BoardState, position: Position, pieceColor: string): boolean {
  if (!isValidPosition(position)) {
    return false;
  }

  const targetPiece = getPieceAt(board, position);

  // Can move to empty square or capture enemy piece
  return targetPiece === null || targetPiece.color !== pieceColor;
}
