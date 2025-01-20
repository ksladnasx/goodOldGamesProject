export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type Position = {
  x: number;
  y: number;
};

export type Tetromino = {
  shape: number[][];
  type: TetrominoType;
  color: string;
};

export type GameState = {
  grid: string[][];
  currentPiece: Tetromino;
  currentPosition: Position;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
};