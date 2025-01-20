import React from 'react';
import { GameState } from '../types/tetris';
import HomeButton from "./Homebutton";
interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { grid, currentPiece, currentPosition } = gameState;
  
  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);

    // Add current piece to display grid
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const gridY = currentPosition.y + y;
          const gridX = currentPosition.x + x;
          if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
            displayGrid[gridY][gridX] = currentPiece.color;
          }
        }
      });
    });

    return displayGrid.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`w-6 h-6 border border-gray-700 ${
              cell ? '' : 'bg-gray-900'
            }`}
            style={{ backgroundColor: cell || undefined }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-gray-800 p-2 rounded-lg">
      
      {renderGrid()}
      <div>
        <br />
        <a href="http://localhost:5174/">
          <HomeButton/>
        </a>
        
  </div>
    </div>
    
  );
};