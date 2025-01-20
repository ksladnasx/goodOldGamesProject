import React from 'react';
import { Tetromino } from '../types/tetris';

interface NextPieceProps {
  piece: Tetromino;
}

export const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white text-lg font-bold mb-2">Next Piece</h3>
      <div className="grid grid-cols-4 gap-1">
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 border border-gray-700 ${
                cell ? '' : 'bg-gray-900'
              }`}
              style={{ backgroundColor: cell ? piece.color : undefined }}
            />
          ))
        )}
      </div>
    </div>
  );
};