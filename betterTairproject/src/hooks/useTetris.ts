import { useState, useCallback, useEffect } from 'react';
import { GameState, Position, Tetromino } from '../types/tetris';
import { TETROMINOES, GRID_WIDTH, GRID_HEIGHT, INITIAL_SPEED, SPEED_INCREASE, POINTS_PER_LINE, LINES_PER_LEVEL } from '../constants/tetrominos';

const createEmptyGrid = () => 
  Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(''));

const getRandomTetromino = (): Tetromino => {
  const tetrominoes = Object.values(TETROMINOES);
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: createEmptyGrid(),
    currentPiece: getRandomTetromino(),
    currentPosition: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPaused: false
  });

  const isValidMove = useCallback((position: Position, piece: Tetromino): boolean => {
    return piece.shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (cell === 0) return true;
        const newX = position.x + dx;
        const newY = position.y + dy;
        return (
          newX >= 0 &&
          newX < GRID_WIDTH &&
          newY < GRID_HEIGHT &&
          (newY < 0 || gameState.grid[newY][newX] === '')
        );
      })
    );
  }, [gameState.grid]);

  const rotatePiece = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const rotatedShape = gameState.currentPiece.shape[0].map((_, index) =>
      gameState.currentPiece.shape.map(row => row[index]).reverse()
    );
    
    const rotatedPiece = {
      ...gameState.currentPiece,
      shape: rotatedShape
    };

    if (isValidMove(gameState.currentPosition, rotatedPiece)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: rotatedPiece
      }));
    }
  }, [gameState, isValidMove]);

  const movePiece = useCallback((dx: number) => {
    if (gameState.gameOver || gameState.isPaused) return;

    const newPosition = {
      x: gameState.currentPosition.x + dx,
      y: gameState.currentPosition.y
    };

    if (isValidMove(newPosition, gameState.currentPiece)) {
      setGameState(prev => ({
        ...prev,
        currentPosition: newPosition
      }));
    }
  }, [gameState, isValidMove]);

  const dropPiece = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const newPosition = {
      x: gameState.currentPosition.x,
      y: gameState.currentPosition.y + 1
    };

    if (isValidMove(newPosition, gameState.currentPiece)) {
      setGameState(prev => ({
        ...prev,
        currentPosition: newPosition
      }));
    } else {
      // Lock the piece
      const newGrid = [...gameState.grid];
      gameState.currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const gridY = gameState.currentPosition.y + y;
            if (gridY >= 0) {
              newGrid[gridY][gameState.currentPosition.x + x] = gameState.currentPiece.color;
            }
          }
        });
      });

      // Check for completed lines
      let completedLines = 0;
      for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        if (newGrid[y].every(cell => cell !== '')) {
          completedLines++;
          newGrid.splice(y, 1);
          newGrid.unshift(Array(GRID_WIDTH).fill(''));
        }
      }

      // Update score and level
      const newLines = gameState.lines + completedLines;
      const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
      const newScore = gameState.score + (completedLines * POINTS_PER_LINE * gameState.level);

      // Check for game over
      const gameOver = !isValidMove({ x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 }, gameState.nextPiece);

      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        currentPiece: prev.nextPiece,
        currentPosition: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
        nextPiece: getRandomTetromino(),
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver
      }));
    }
  }, [gameState, isValidMove]);

  const hardDrop = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    let newY = gameState.currentPosition.y;
    while (isValidMove({ x: gameState.currentPosition.x, y: newY + 1 }, gameState.currentPiece)) {
      newY++;
    }
    
    setGameState(prev => ({
      ...prev,
      currentPosition: { ...prev.currentPosition, y: newY }
    }));
    dropPiece();
  }, [gameState, isValidMove, dropPiece]);

  const togglePause = useCallback(() => {
    if (gameState.gameOver) return;
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, [gameState.gameOver]);

  const resetGame = useCallback(() => {
    setGameState({
      grid: createEmptyGrid(),
      currentPiece: getRandomTetromino(),
      currentPosition: { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 },
      nextPiece: getRandomTetromino(),
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPaused: false
    });
  }, []);

  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const speed = INITIAL_SPEED * Math.pow(SPEED_INCREASE, gameState.level - 1);
    const intervalId = setInterval(dropPiece, speed);

    return () => clearInterval(intervalId);
  }, [gameState.level, gameState.gameOver, gameState.isPaused, dropPiece]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case 'Space':
          hardDrop();
          break;
        case 'KeyP':
          togglePause();
          break;
        case 'KeyR':
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, dropPiece, rotatePiece, hardDrop, togglePause, resetGame]);

  return {
    gameState,
    movePiece,
    dropPiece,
    rotatePiece,
    hardDrop,
    togglePause,
    resetGame
  };
};