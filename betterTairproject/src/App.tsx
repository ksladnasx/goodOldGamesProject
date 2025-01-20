import React from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { GameStats } from './components/GameStats';
import { Controls } from './components/Controls';
import { useTetris } from './hooks/useTetris';
import { Gamepad2 } from 'lucide-react';

function App() {
  const { gameState, resetGame } = useTetris();
  const { score, level, lines, gameOver, isPaused, nextPiece } = gameState;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-center mb-8 gap-4">
          <Gamepad2 className="w-8 h-8" />
          <h1 className="text-4xl font-bold">精装修俄罗斯方块</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,200px] gap-8">
          <div className="relative">
            <GameBoard gameState={gameState} />
            
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    {gameOver ? 'Game Over' : 'Paused'}
                  </h2>
                  {gameOver && (
                    <button
                      onClick={resetGame}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition"
                    >
                      Play Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <NextPiece piece={nextPiece} />
            <GameStats score={score} level={level} lines={lines} />
            <Controls />
          </div>
        </div>
      </div>
      
    </div>
      
  );
}

export default App;